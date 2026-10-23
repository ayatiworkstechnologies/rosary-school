
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 60;

const API_URL =
  "https://api.ayatiworks.com/api/v1/public/rosary-school/rosary_lkg_admission/records";

// Existing API key value unchanged.
// Keep this route server-side only.
const API_KEY =
  process.env.AYATIWORKS_API_KEY ??
  "205a80dc727cceb4c6df90f93173287f2fe7bb21b2d445b7046f4d1130afa2f8";

const REGISTRATION_PREFIX = "2728";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = 16 * 1024 * 1024;

const IMAGE_FIELDS = [
  "student_passport_size_photo",
  "father_s_signature",
  "mother_s_signature",
] as const;

const TEXT_FIELDS = [
  "name_of_the_pupil",
  "date_of_birth",
  "religion",
  "place_of_birth",
  "father_s_name",
  "father_s_qualification",
  "father_s_occupation",
  "father_s_income_per_month",
  "mother_s_name",
  "is_she_a_past_pupil_of_rosary",
  "mother_s_qualification",
  "mother_s_occupation",
  "mother_s_income_per_month",
  "mother_tongue",
  "does_the_applicant_have_any_sibling_s_studying_in_this_school",
  "name_of_the_sibling",
  "class_and_section",
  "address",
  "email",
  "phone_number",
  "alternative_phone_number",
] as const;

const OPTIONAL_FIELDS = new Set<string>([
  "name_of_the_sibling",
  "class_and_section",
  "alternative_phone_number",
]);

type ApiResponse = {
  success: boolean;
  message: string;
  registration_no?: string;
  upstream_status?: number;
};

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function sendError(
  message: string,
  status: number,
  upstreamStatus?: number
) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      ...(upstreamStatus !== undefined
        ? { upstream_status: upstreamStatus }
        : {}),
    },
    { status }
  );
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    date.getTime() <= Date.now()
  );
}

function isValidIncome(value: string): boolean {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
    return false;
  }

  const amount = Number(value);

  return Number.isFinite(amount) && amount >= 0;
}

// ======================================================
// IMAGE PROCESSING
// ======================================================

async function processImage(
  formData: FormData,
  field: string
): Promise<string> {
  const file = formData.get(field);

  const label = field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );

  if (!(file instanceof File) || file.size === 0) {
    throw new Error(`Please upload ${label}.`);
  }

  if (file.size >= MAX_IMAGE_SIZE) {
    throw new Error(
      `${label} must be smaller than 5 MB.`
    );
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `${label} must be a JPG, PNG or WebP image.`
    );
  }

  const input = Buffer.from(await file.arrayBuffer());

  // TypeScript infers the Sharp metadata type.
  // No sharp.Metadata namespace declaration needed.
  let metadata;

  try {
    metadata = await sharp(input).metadata();
  } catch {
    throw new Error(`${label} is not a valid image.`);
  }

  const expectedFormats: Record<string, string> = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
  };

  if (metadata.format !== expectedFormats[file.type]) {
    throw new Error(
      `${label} does not match its image format.`
    );
  }

  const isSignature = field.includes("signature");

  const width = isSignature ? 900 : 800;
  const height = isSignature ? 450 : 1100;

  let output: Buffer | null = null;

  for (const quality of [80, 65, 50, 35]) {
    const result = await sharp(input)
      .rotate()
      .flatten({ background: "#ffffff" })
      .resize({
        width,
        height,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        mozjpeg: true,
      })
      .toBuffer();

    output = result;

    if (result.length <= 250 * 1024) {
      break;
    }
  }

  if (!output) {
    throw new Error(
      `Unable to process ${label}.`
    );
  }

  // The Ayatiworks API must support Base64 data URLs
  // for these Image Upload fields.
  return `data:image/jpeg;base64,${output.toString("base64")}`;
}

// ======================================================
// REGISTRATION NUMBER
// ======================================================

function getSequence(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const escapedPrefix = REGISTRATION_PREFIX.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const pattern = new RegExp(
    `^${escapedPrefix}-(\\d+)$`
  );

  const match = value.match(pattern);

  if (!match) {
    return null;
  }

  const number = Number(match[1]);

  return Number.isSafeInteger(number) && number > 0
    ? number
    : null;
}

function getRecords(payload: unknown): JsonObject[] {
  if (Array.isArray(payload)) {
    return payload.filter(isObject);
  }

  if (!isObject(payload)) {
    throw new Error("Invalid records response.");
  }

  for (const key of ["items", "records", "data"]) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value.filter(isObject);
    }

    if (isObject(value)) {
      for (const nestedKey of ["items", "records", "data"]) {
        const nestedValue = value[nestedKey];

        if (Array.isArray(nestedValue)) {
          return nestedValue.filter(isObject);
        }
      }
    }
  }

  throw new Error("Records list not found.");
}

async function generateRegistrationNumber(): Promise<string> {
  const pageSize = 100;
  let maximum = 0;

  for (let page = 1; page <= 1000; page++) {
    const url = new URL(API_URL);

    url.searchParams.set("page", String(page));
    url.searchParams.set(
      "page_size",
      String(pageSize)
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(
        `Registration lookup failed: ${response.status}`
      );
    }

    const payload: unknown = await response.json();
    const records = getRecords(payload);

    for (const record of records) {
      const item = isObject(record.data)
        ? record.data
        : record;

      const sequence = getSequence(
        item.registration_no
      );

      if (sequence !== null) {
        maximum = Math.max(maximum, sequence);
      }
    }

    if (records.length < pageSize) {
      return `${REGISTRATION_PREFIX}-${String(
        maximum + 1
      ).padStart(3, "0")}`;
    }
  }

  throw new Error(
    "Unable to scan all registration records."
  );
}

// ======================================================
// UPSTREAM ERROR HANDLING
// ======================================================

function getUpstreamMessage(body: string): string {
  try {
    const payload: unknown = JSON.parse(body);

    if (!isObject(payload)) {
      return "";
    }

    const message =
      typeof payload.detail === "string"
        ? payload.detail
        : typeof payload.message === "string"
          ? payload.message
          : "";

    if (
      message.length <= 180 &&
      !/base64|data:image|api.?key/i.test(message)
    ) {
      return message;
    }
  } catch {
    // Ignore non-JSON upstream responses.
  }

  return "";
}

// ======================================================
// SUBMIT ADMISSION
// ======================================================

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return sendError(
        "Admission API key is not configured.",
        503
      );
    }

    const contentLength = Number(
      request.headers.get("content-length") || "0"
    );

    if (contentLength > MAX_REQUEST_SIZE) {
      return sendError(
        "Total uploaded file size is too large.",
        413
      );
    }

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return sendError(
        "Invalid form submission.",
        400
      );
    }

    const data: Record<string, string> = {};

    // Keep all existing Ayatiworks field keys.
    for (const field of TEXT_FIELDS) {
      data[field] = readText(formData, field);
    }

    for (const field of TEXT_FIELDS) {
      if (
        !OPTIONAL_FIELDS.has(field) &&
        !data[field]
      ) {
        return sendError(
          `Please complete ${field.replace(/_/g, " ")}.`,
          400
        );
      }
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      return sendError(
        "Please enter a valid email address.",
        400
      );
    }

    if (!/^\d{10}$/.test(data.phone_number)) {
      return sendError(
        "Phone number must contain exactly 10 digits.",
        400
      );
    }

    if (
      data.alternative_phone_number &&
      !/^\d{10}$/.test(data.alternative_phone_number)
    ) {
      return sendError(
        "Alternative phone number must contain exactly 10 digits.",
        400
      );
    }

    if (!isValidDate(data.date_of_birth)) {
      return sendError(
        "Please enter a valid date of birth.",
        400
      );
    }

    if (
      !isValidIncome(
        data.father_s_income_per_month
      ) ||
      !isValidIncome(
        data.mother_s_income_per_month
      )
    ) {
      return sendError(
        "Please enter valid monthly income values.",
        400
      );
    }

    if (
      !["Yes", "No"].includes(
        data.is_she_a_past_pupil_of_rosary
      )
    ) {
      return sendError(
        "Please select the mother's past-pupil status.",
        400
      );
    }

    const siblingChoice =
      data.does_the_applicant_have_any_sibling_s_studying_in_this_school;

    if (!["Yes", "No"].includes(siblingChoice)) {
      return sendError(
        "Please select Yes or No for sibling details.",
        400
      );
    }

    if (siblingChoice === "Yes") {
      if (
        !data.name_of_the_sibling ||
        !data.class_and_section
      ) {
        return sendError(
          "Please enter the sibling's name, class and section.",
          400
        );
      }
    } else {
      data.name_of_the_sibling = "";
      data.class_and_section = "";
    }

    // Validate and compress the three images.
    try {
      for (const field of IMAGE_FIELDS) {
        data[field] = await processImage(
          formData,
          field
        );
      }
    } catch (error) {
      return sendError(
        error instanceof Error
          ? error.message
          : "Invalid uploaded image.",
        400
      );
    }

    // Generate registration number server-side.
    // Never accept it from the browser.
    let registrationNo: string;

    try {
      registrationNo =
        await generateRegistrationNumber();
    } catch {
      return sendError(
        "Unable to generate the next registration number. Please verify the admission records API.",
        503
      );
    }

    // Forward the application to Ayatiworks.
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        data: {
          registration_no: registrationNo,
          ...data,
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const responseBody = await response.text();

      const upstreamMessage =
        getUpstreamMessage(responseBody);

      console.error(
        "[Rosary Admission] Upstream error:",
        {
          status: response.status,
          message: upstreamMessage || "No safe detail",
        }
      );

      if (response.status === 413) {
        return sendError(
          "The admission service rejected the total upload size.",
          413,
          413
        );
      }

      if (response.status === 409) {
        return sendError(
          "Registration number conflict. Please contact the school before retrying.",
          409,
          409
        );
      }

      if (
        response.status === 400 ||
        response.status === 422
      ) {
        return sendError(
          upstreamMessage ||
            "The admission service rejected the application. Please verify its image-upload format and required fields.",
          422,
          response.status
        );
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        return sendError(
          "Admission service authentication failed.",
          502,
          response.status
        );
      }

      if (response.status === 429) {
        return sendError(
          "Too many requests. Please try again later.",
          429,
          429
        );
      }

      return sendError(
        "Admission service is temporarily unavailable.",
        502,
        response.status
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message:
          "Your LKG admission application has been submitted successfully!",
        registration_no: registrationNo,
      },
      { status: 201 }
    );
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      ["TimeoutError", "AbortError"].includes(
        error.name
      );

    if (timedOut) {
      return sendError(
        "Submission timed out. Please contact the school before trying again.",
        504
      );
    }

    console.error(
      "[Rosary Admission] Unexpected error:",
      error instanceof Error
        ? error.name
        : "Unknown error"
    );

    return sendError(
      "Unable to confirm your application submission. Please contact the school.",
      502
    );
  }
}
