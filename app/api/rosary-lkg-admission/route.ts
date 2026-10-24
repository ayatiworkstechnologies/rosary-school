
import { NextRequest, NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import sharp from "sharp";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

// =====================================================
// CONFIGURATION
// =====================================================

const API_URL =
  "https://api.ayatiworks.com/api/v1/public/rosary-school/rosary_lkg_admission/records";

const API_KEY =
  process.env.AYATIWORKS_API_KEY ??
  "205a80dc727cceb4c6df90f93173287f2fe7bb21b2d445b7046f4d1130afa2f8";

const REGISTRATION_PREFIX = "2728";
const MAX_DATE_OF_BIRTH = "2024-12-31";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = 18 * 1024 * 1024;

const IMAGE_FIELDS = [
  "student_s_passport_size_photograph",
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

  "name_of_parish",
  "religion_others",
  "mother_tongue_others",
] as const;

const OPTIONAL_FIELDS = new Set<string>([
  "name_of_the_sibling",
  "class_and_section",
  "alternative_phone_number",
  "name_of_parish",
  "religion_others",
  "mother_tongue_others",
]);

type JsonObject = Record<string, unknown>;

type ApiResponse = {
  success: boolean;
  message: string;
  registration_no?: string;
  upstream_status?: number;
};

// =====================================================
// HELPERS
// =====================================================

function isObject(
  value: unknown
): value is JsonObject {
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
        ? {
            upstream_status: upstreamStatus,
          }
        : {}),
    },
    { status }
  );
}

function readText(
  formData: FormData,
  key: string
): string {
  const value = formData.get(key);

  return typeof value === "string"
    ? value.trim()
    : "";
}

// =====================================================
// DATE VALIDATION
// =====================================================

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(
    `${value}T00:00:00.000Z`
  );

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

  return (
    Number.isFinite(amount) &&
    amount >= 0
  );
}

// =====================================================
// IMAGE PROCESSING
// =====================================================

async function saveImage(
  formData: FormData,
  field: string
): Promise<{ url: string; blobUrl: string }> {
  const file = formData.get(field);
  const labels: Record<string, string> = {
    student_s_passport_size_photograph: "Student’s Passport-Size Photograph",
    father_s_signature: "Father's Signature",
    mother_s_signature: "Mother's Signature",
  };
  const label = labels[field] ?? field;

  if (!(file instanceof File) || file.size === 0) {
    throw new Error(`Please upload ${label}.`);
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`${label} must not exceed 5 MB.`);
  }

  const formats: Record<string, string> = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
  };
  if (!formats[file.type]) {
    throw new Error(`${label} must be JPG, PNG or WebP.`);
  }

  const input = Buffer.from(await file.arrayBuffer());
  let metadata;
  try {
    metadata = await sharp(input, { limitInputPixels: 25_000_000 }).metadata();
  } catch {
    throw new Error(`${label} is not a valid image.`);
  }
  if (metadata.format !== formats[file.type]) {
    throw new Error(`${label} has an invalid image format.`);
  }

  const signature = field.includes("signature");
  const output = await sharp(input, { limitInputPixels: 25_000_000 })
    .rotate()
    .flatten({ background: "#ffffff" })
    .resize({
      width: signature ? 900 : 800,
      height: signature ? 450 : 1100,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  // Blob URLs are public HTTPS URLs that Ayatiworks can retrieve. The UUID
  // keeps applicant names out of the pathname.
  const blob = await put(
    `rosary-lkg-admissions/${randomUUID()}.jpg`,
    output,
    {
      access: "public",
      addRandomSuffix: false,
      contentType: "image/jpeg",
    }
  );

  return {
    url: blob.url,
    blobUrl: blob.url,
  };
}

// =====================================================
// REGISTRATION NUMBER HELPERS
// =====================================================

function getSequence(
  value: unknown
): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const match = value.match(/^2728-(\d+)$/);

  if (!match) {
    return null;
  }

  const sequence = Number(match[1]);

  return (
    Number.isSafeInteger(sequence) &&
    sequence > 0
  )
    ? sequence
    : null;
}

function getRecords(
  payload: unknown
): JsonObject[] {
  if (Array.isArray(payload)) {
    return payload.filter(isObject);
  }

  if (!isObject(payload)) {
    throw new Error(
      "Invalid records response."
    );
  }

  for (const key of ["items", "records", "data"]) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value.filter(isObject);
    }

    if (isObject(value)) {
      for (const nestedKey of [
        "items",
        "records",
        "data",
      ]) {
        const nested = value[nestedKey];

        if (Array.isArray(nested)) {
          return nested.filter(isObject);
        }
      }
    }
  }

  throw new Error(
    "Admission records list not found."
  );
}

// =====================================================
// GENERATE REGISTRATION NUMBER
// Format: 2728-001, 2728-002, ...
// =====================================================

async function generateRegistrationNumber(): Promise<string> {
  const PAGE_SIZE = 100;
  let highest = 0;

  for (let page = 1; page <= 1000; page++) {
    const url = new URL(API_URL);

    url.searchParams.set(
      "page",
      String(page)
    );

    url.searchParams.set(
      "page_size",
      String(PAGE_SIZE)
    );

    const response = await fetch(
      url.toString(),
      {
        method: "GET",
        headers: {
          "X-API-Key": API_KEY,
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Registration lookup failed: ${response.status}`
      );
    }

    const records = getRecords(
      await response.json()
    );

    for (const record of records) {
      const recordData = isObject(record.data)
        ? record.data
        : record;

      const sequence = getSequence(
        recordData.registration_no
      );

      if (sequence !== null) {
        highest = Math.max(
          highest,
          sequence
        );
      }
    }

    if (records.length < PAGE_SIZE) {
      return `${REGISTRATION_PREFIX}-${String(
        highest + 1
      ).padStart(3, "0")}`;
    }
  }

  throw new Error(
    "Registration records pagination exceeded the limit."
  );
}

// =====================================================
// UPSTREAM ERROR MESSAGE
// =====================================================

function getSafeUpstreamMessage(
  responseBody: string
): string {
  try {
    const payload: unknown = JSON.parse(responseBody);

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
      message.length > 0 &&
      message.length <= 180 &&
      !/base64|data:image|api.?key/i.test(message)
    ) {
      return message;
    }
  } catch {
    // The upstream response might not be JSON.
  }

  return "";
}

// =====================================================
// POST ADMISSION APPLICATION
// =====================================================

export async function POST(
  request: NextRequest
) {
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

    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_REQUEST_SIZE
    ) {
      return sendError(
        "Total upload size is too large.",
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
    const uploadedBlobUrls: string[] = [];

    // Read every Ayatiworks module field.
    for (const field of TEXT_FIELDS) {
      data[field] = readText(formData, field);
    }

    // Clear inactive conditional fields.
    if (
      data.religion !== "Christian - Roman Catholic"
    ) {
      data.name_of_parish = "";
    }

    if (data.religion !== "Others") {
      data.religion_others = "";
    }

    if (data.mother_tongue !== "Others") {
      data.mother_tongue_others = "";
    }

    const siblingChoice =
      data.does_the_applicant_have_any_sibling_s_studying_in_this_school;

    if (siblingChoice !== "Yes") {
      data.name_of_the_sibling = "";
      data.class_and_section = "";
    }

    // Required fields.
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

    // Religion.
    if (
      ![
        "Hindu",
        "Christian - Roman Catholic",
        "Christian",
        "Muslim",
        "Others",
      ].includes(data.religion)
    ) {
      return sendError(
        "Please select a valid religion.",
        400
      );
    }

    if (
      data.religion ===
        "Christian - Roman Catholic" &&
      !data.name_of_parish
    ) {
      return sendError(
        "Please enter Name of Parish.",
        400
      );
    }

    if (
      data.religion === "Others" &&
      !data.religion_others
    ) {
      return sendError(
        "Please specify the religion.",
        400
      );
    }

    // Mother tongue.
    if (
      ![
        "Tamil",
        "English",
        "Telugu",
        "Malayalam",
        "Kannada",
        "Hindi",
        "Others",
      ].includes(data.mother_tongue)
    ) {
      return sendError(
        "Please select a valid mother tongue.",
        400
      );
    }

    if (
      data.mother_tongue === "Others" &&
      !data.mother_tongue_others
    ) {
      return sendError(
        "Please specify the mother tongue.",
        400
      );
    }

    // Yes / No.
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

    if (!["Yes", "No"].includes(siblingChoice)) {
      return sendError(
        "Please select the sibling status.",
        400
      );
    }

    if (
      siblingChoice === "Yes" &&
      (!data.name_of_the_sibling ||
        !data.class_and_section)
    ) {
      return sendError(
        "Please enter sibling name, class and section.",
        400
      );
    }

    // Date of Birth restriction.
    if (!isValidDate(data.date_of_birth)) {
      return sendError(
        "Please enter a valid date of birth.",
        400
      );
    }

    if (
      data.date_of_birth > MAX_DATE_OF_BIRTH
    ) {
      return sendError(
        "Date of Birth must be on or before 31 December 2024.",
        400
      );
    }

    // Monthly income.
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

    // Email validation.
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        data.email
      )
    ) {
      return sendError(
        "Please enter a valid email address.",
        400
      );
    }

    // Phone validation.
    if (
      !/^\d{10}$/.test(
        data.phone_number
      )
    ) {
      return sendError(
        "Phone number must contain exactly 10 digits.",
        400
      );
    }

    if (
      data.alternative_phone_number &&
      !/^\d{10}$/.test(
        data.alternative_phone_number
      )
    ) {
      return sendError(
        "Alternative phone number must contain exactly 10 digits.",
        400
      );
    }

    // Process image uploads.
    try {
      for (const field of IMAGE_FIELDS) {
        const saved = await saveImage(formData, field);
        data[field] = saved.url;
        uploadedBlobUrls.push(saved.blobUrl);
      }
    } catch (caught) {
      await Promise.all(uploadedBlobUrls.map((url) => del(url).catch(() => undefined)));
      return sendError(
        caught instanceof Error
          ? caught.message
          : "Invalid image upload.",
        400
      );
    }

    // Generate registration number.
    let registrationNo: string;

    try {
      registrationNo =
        await generateRegistrationNumber();
    } catch {
      await Promise.all(uploadedBlobUrls.map((url) => del(url).catch(() => undefined)));
      return sendError(
        "Unable to generate a registration number. Please verify the Ayatiworks records API.",
        503
      );
    }

    // Submit to Ayatiworks.
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
      // Definitive validation/auth rejection: record was not accepted.
      if ([400, 401, 403, 413, 422].includes(response.status)) {
        await Promise.all(uploadedBlobUrls.map((url) => del(url).catch(() => undefined)));
      }

      const safeDetail =
        getSafeUpstreamMessage(responseBody);

      console.error(
        "[Rosary Admission] Upstream error:",
        {
          status: response.status,
          message: safeDetail || "No safe detail",
        }
      );

      if (response.status === 413) {
        return sendError(
          "The admission service rejected the image upload size.",
          413,
          413
        );
      }

      if (response.status === 409) {
        return sendError(
          "Registration number conflict. Please contact the school.",
          409,
          409
        );
      }

      if (
        response.status === 400 ||
        response.status === 422
      ) {
        return sendError(
          safeDetail ||
            "The admission service rejected the form data or image format.",
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
          "Too many requests. Please try later.",
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

    // Successful submission.
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message:
          "Your LKG admission application was submitted successfully!",
        registration_no: registrationNo,
      },
      { status: 201 }
    );
  } catch (caught) {
    const timedOut =
      caught instanceof Error &&
      ["TimeoutError", "AbortError"].includes(
        caught.name
      );

    return sendError(
      timedOut
        ? "Submission timed out. Please contact the school before retrying."
        : "Unable to confirm submission. Please contact the school.",
      timedOut ? 504 : 502
    );
  }
}
