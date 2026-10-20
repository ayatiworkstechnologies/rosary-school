
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const API_URL =
  "https://api.ayatiworks.com/api/v1/public/rosary-school/rosary_lkg_admission/records";

// API key remains unchanged.
// Keep this file server-side only.
const API_KEY =
  "205a80dc727cceb4c6df90f93173287f2fe7bb21b2d445b7046f4d1130afa2f8";

// ======================================================
// ALL MODULE FIELDS
// ======================================================

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

// ======================================================
// REQUIRED FIELDS
// ======================================================

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

// ======================================================
// HELPERS
// ======================================================

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

// ======================================================
// POST - ROSARY LKG ADMISSION
// ======================================================

export async function POST(
  request: NextRequest
) {
  try {
    // --------------------------------------------------
    // 1. API CONFIGURATION
    // --------------------------------------------------

    if (!API_KEY) {
      return errorResponse(
        "Admission API is not configured. Please contact the school administrator.",
        503
      );
    }

    // --------------------------------------------------
    // 2. READ REQUEST BODY
    // --------------------------------------------------

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse(
        "Invalid request. Please try submitting the form again.",
        400
      );
    }

    // --------------------------------------------------
    // 3. VALIDATE REQUEST STRUCTURE
    // --------------------------------------------------

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

    const incomingData =
      body.data as AdmissionData;

    // --------------------------------------------------
    // 4. CLEAN AND MAP ALL FIELDS
    // --------------------------------------------------

    const cleanedData: Record<string, string> = {};

    for (const field of ALL_FIELDS) {
      cleanedData[field] = getValue(
        incomingData,
        field
      );
    }

    // --------------------------------------------------
    // 5. REQUIRED FIELD VALIDATION
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 6. EMAIL VALIDATION
    // --------------------------------------------------

    const email = cleanedData.email;

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return errorResponse(
        "Please enter a valid email address.",
        400
      );
    }

    // --------------------------------------------------
    // 7. PHONE NUMBER VALIDATION
    // --------------------------------------------------

    const phone =
      cleanedData.phone_number;

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

    // --------------------------------------------------
    // 8. DATE OF BIRTH VALIDATION
    // --------------------------------------------------

    const dob =
      cleanedData.date_of_birth;

    const dateRegex =
      /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dob)) {
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

    // --------------------------------------------------
    // 9. YES / NO VALIDATION
    // --------------------------------------------------

    const passedStudent =
      cleanedData.is_she_a_passed_student_of_rosary;

    const siblingChoice =
      cleanedData.does_the_applicant_have_any_siblings_studying_in_this_school;

    if (
      !["Yes", "No"].includes(passedStudent)
    ) {
      return errorResponse(
        "Please select Yes or No for the mother's Rosary student history.",
        400
      );
    }

    if (
      !["Yes", "No"].includes(siblingChoice)
    ) {
      return errorResponse(
        "Please select Yes or No for sibling details.",
        400
      );
    }

    // --------------------------------------------------
    // 10. CONDITIONAL SIBLING VALIDATION
    // --------------------------------------------------

    if (siblingChoice === "Yes") {
      if (
        !cleanedData.name_of_the_sibling
      ) {
        return errorResponse(
          "Please enter the sibling's name.",
          400
        );
      }

      if (
        !cleanedData.class_and_section
      ) {
        return errorResponse(
          "Please enter the sibling's class and section.",
          400
        );
      }
    } else {
      cleanedData.name_of_the_sibling = "";
      cleanedData.class_and_section = "";
    }

    // --------------------------------------------------
    // 11. INCOME VALIDATION
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 12. SEND APPLICATION TO AYATIWORKS
    // --------------------------------------------------

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        // Existing API authentication unchanged
        "X-API-Key": API_KEY,
      },

      body: JSON.stringify({
        data: cleanedData,
      }),

      cache: "no-store",

      signal: AbortSignal.timeout(20000),
    });

    // --------------------------------------------------
    // 13. HANDLE API ERRORS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 14. SUCCESS RESPONSE
    // --------------------------------------------------

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message:
          "Your LKG admission application has been submitted successfully!",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    // --------------------------------------------------
    // 15. NETWORK / TIMEOUT ERRORS
    // --------------------------------------------------

    const timedOut =
      error instanceof Error &&
      (
        error.name === "TimeoutError" ||
        error.name === "AbortError"
      );

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
