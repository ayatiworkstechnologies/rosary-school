
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const API_URL =
  "https://api.ayatiworks.com/api/v1/public/rosary-school/rosary_lkg_admission/records";

// Existing API key value kept unchanged.
// This file must remain server-side only.
const API_KEY =
  "205a80dc727cceb4c6df90f93173287f2fe7bb21b2d445b7046f4d1130afa2f8";

const ALL_FIELDS = [
  "registration_no",
  "name_of_the_pupil",
  "date_of_birth",
  "religion",
  "place_of_birth",
  "father_s_name",
  "father_s_qualification",
  "father_s_occupation",
  "father_s_income_per_month",
  "mother_s_name",
  "is_she_a_passed_student_of_rosary",
  "mother_s_qualification",
  "mother_s_occupation",
  "mother_s_income_per_month",
  "mother_tongue",
  "does_the_applicant_have_any_siblings_studying_in_this_school",
  "name_of_the_sibling",
  "class_and_section",
  "permanent_address",
  "email",
  "phone_number",
  "alternative_phone_number",
] as const;

const REQUIRED_FIELDS = [
  "registration_no",
  "name_of_the_pupil",
  "date_of_birth",
  "religion",
  "place_of_birth",
  "father_s_name",
  "father_s_qualification",
  "father_s_occupation",
  "father_s_income_per_month",
  "mother_s_name",
  "is_she_a_passed_student_of_rosary",
  "mother_s_qualification",
  "mother_s_occupation",
  "mother_s_income_per_month",
  "mother_tongue",
  "does_the_applicant_have_any_siblings_studying_in_this_school",
  "permanent_address",
  "email",
  "phone_number",
] as const;

type AdmissionData = Record<string, unknown>;

type ApiResponse = {
  success: boolean;
  message: string;
};

function getValue(
  data: AdmissionData,
  key: string
): string {
  const value = data[key];

  return typeof value === "string"
    ? value.trim()
    : "";
}

function errorResponse(
  message: string,
  status: number
) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
    },
    { status }
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    if (!API_KEY) {
      return errorResponse(
        "Admission API is not configured. Please contact the school administrator.",
        503
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse(
        "Invalid request. Please try submitting the form again.",
        400
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      !("data" in body) ||
      !body.data ||
      typeof body.data !== "object" ||
      Array.isArray(body.data)
    ) {
      return errorResponse(
        "Invalid application data. Please review the form.",
        400
      );
    }

    const incomingData = body.data as AdmissionData;

    // Keep all 22 Ayatiworks module fields.
    const cleanedData: Record<string, string> = {};

    for (const field of ALL_FIELDS) {
      cleanedData[field] = getValue(
        incomingData,
        field
      );
    }

    // Required field validation.
    for (const field of REQUIRED_FIELDS) {
      if (!cleanedData[field]) {
        const readableField = field
          .replace(/_/g, " ")
          .replace(/\b\w/g, (character) =>
            character.toUpperCase()
          );

        return errorResponse(
          `Please fill in the required field: ${readableField}.`,
          400
        );
      }
    }

    // Email validation.
    const email = cleanedData.email;

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return errorResponse(
        "Please enter a valid email address.",
        400
      );
    }

    // Phone validation.
    const phone = cleanedData.phone_number;
    const alternativePhone =
      cleanedData.alternative_phone_number;

    if (!/^[0-9]{10}$/.test(phone)) {
      return errorResponse(
        "Phone number must contain exactly 10 digits.",
        400
      );
    }

    if (
      alternativePhone &&
      !/^[0-9]{10}$/.test(alternativePhone)
    ) {
      return errorResponse(
        "Alternative phone number must contain exactly 10 digits.",
        400
      );
    }

    // Date of birth validation.
    const dob = cleanedData.date_of_birth;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return errorResponse(
        "Please select a valid date of birth.",
        400
      );
    }

    const parsedDate = new Date(
      `${dob}T00:00:00.000Z`
    );

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== dob
    ) {
      return errorResponse(
        "Please enter a valid date of birth.",
        400
      );
    }

    // Mother's past-pupil response.
    // Backend key is intentionally unchanged.
    const pastPupil =
      cleanedData.is_she_a_passed_student_of_rosary;

    // Sibling(s) response.
    // Backend key is intentionally unchanged.
    const siblingChoice =
      cleanedData.does_the_applicant_have_any_siblings_studying_in_this_school;

    if (!["Yes", "No"].includes(pastPupil)) {
      return errorResponse(
        "Please select Yes or No for 'Is she a past pupil of Rosary?'.",
        400
      );
    }

    if (!["Yes", "No"].includes(siblingChoice)) {
      return errorResponse(
        "Please select Yes or No for sibling(s) details.",
        400
      );
    }

    // Sibling details are required only when Yes.
    if (siblingChoice === "Yes") {
      if (!cleanedData.name_of_the_sibling) {
        return errorResponse(
          "Please enter the sibling's name.",
          400
        );
      }

      if (!cleanedData.class_and_section) {
        return errorResponse(
          "Please enter the sibling's class and section.",
          400
        );
      }
    } else {
      cleanedData.name_of_the_sibling = "";
      cleanedData.class_and_section = "";
    }

    // Monthly income validation.
    const fatherIncome = Number(
      cleanedData.father_s_income_per_month
    );

    const motherIncome = Number(
      cleanedData.mother_s_income_per_month
    );

    if (
      !Number.isFinite(fatherIncome) ||
      fatherIncome < 0
    ) {
      return errorResponse(
        "Please enter a valid father's monthly income.",
        400
      );
    }

    if (
      !Number.isFinite(motherIncome) ||
      motherIncome < 0
    ) {
      return errorResponse(
        "Please enter a valid mother's monthly income.",
        400
      );
    }

    // Submit all module fields to Ayatiworks.
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        data: cleanedData,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      if (response.status === 409) {
        return errorResponse(
          "An application with this registration number may already exist. Please check before submitting again.",
          409
        );
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        return errorResponse(
          "Admission service authentication failed. Please contact the administrator.",
          502
        );
      }

      if (
        response.status === 400 ||
        response.status === 422
      ) {
        return errorResponse(
          "Some application details were rejected. Please check the form and try again.",
          400
        );
      }

      if (response.status === 429) {
        return errorResponse(
          "Too many requests. Please wait a moment before trying again.",
          429
        );
      }

      return errorResponse(
        "The admission service is temporarily unavailable. Please try again later.",
        502
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message:
          "Your LKG admission application has been submitted successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError");

    if (timedOut) {
      return errorResponse(
        "Submission timed out. Please check whether your application was received before trying again.",
        504
      );
    }

    return errorResponse(
      "Unable to confirm your application submission. Please contact the school before retrying.",
      502
    );
  }
}
