
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Correct Contact Us API URL.
// Do not include "POST " in the URL.
const CONTACT_API_URL =
  "https://api.ayatiworks.com/api/v1/public/rosary-school/rosary_contact_us/records";

const API_KEY = process.env.AYATIWORKS_API_KEY;

type ContactData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
};

function sendError(message: string, status: number) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
    },
    { status }
  );
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    if (!API_KEY) {
      return sendError("Legacy contact integration is not configured.", 503);
    }
    let body: unknown;

    // 1. Parse incoming JSON.
    try {
      body = await request.json();
    } catch {
      return sendError("Invalid JSON request.", 400);
    }

    // 2. Validate request structure.
    if (
      !body ||
      typeof body !== "object" ||
      !("data" in body) ||
      !body.data ||
      typeof body.data !== "object" ||
      Array.isArray(body.data)
    ) {
      return sendError("Invalid contact form data.", 400);
    }

    const input = body.data as Record<string, unknown>;

    // 3. Extract all four fields.
    const data: ContactData = {
      name: getString(input.name),
      email: getString(input.email),
      phone: getString(input.phone),
      message: getString(input.message),
    };

    // 4. Validate required fields.
    if (!data.name) {
      return sendError("Please enter your name.", 400);
    }

    if (!data.email) {
      return sendError("Please enter your email.", 400);
    }

    if (!data.phone) {
      return sendError("Please enter your phone number.", 400);
    }

    if (!data.message) {
      return sendError("Please enter your message.", 400);
    }

    // 5. Validate maximum lengths.
    if (data.name.length > 150) {
      return sendError(
        "Name must not exceed 150 characters.",
        400
      );
    }

    if (data.email.length > 254) {
      return sendError(
        "Email must not exceed 254 characters.",
        400
      );
    }

    if (data.message.length > 3000) {
      return sendError(
        "Message must not exceed 3000 characters.",
        400
      );
    }

    // 6. Validate email format.
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      return sendError(
        "Please enter a valid email address.",
        400
      );
    }

    // 7. Validate phone number.
    if (!/^[0-9]{10}$/.test(data.phone)) {
      return sendError(
        "Phone number must contain exactly 10 digits.",
        400
      );
    }

    // 8. Build exact Ayatiworks request body.
    const payload = {
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
    };

    // 9. Submit to the Contact Us module.
    const upstreamResponse = await fetch(CONTACT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });

    // 10. Handle upstream API errors.
    if (!upstreamResponse.ok) {
      // Log only the status, not personal details or API key.
      console.error(
        "Rosary Contact API failed:",
        upstreamResponse.status
      );

      if (
        upstreamResponse.status === 400 ||
        upstreamResponse.status === 422
      ) {
        return sendError(
          "The contact service rejected the submitted details. Please verify all fields.",
          400
        );
      }

      if (
        upstreamResponse.status === 401 ||
        upstreamResponse.status === 403
      ) {
        return sendError(
          "Contact service authentication failed. Please contact the administrator.",
          502
        );
      }

      if (upstreamResponse.status === 404) {
        return sendError(
          "Contact Us module endpoint was not found.",
          502
        );
      }

      if (upstreamResponse.status === 409) {
        return sendError(
          "This enquiry may already have been submitted.",
          409
        );
      }

      if (upstreamResponse.status === 429) {
        return sendError(
          "Too many requests. Please try again later.",
          429
        );
      }

      return sendError(
        "Contact service is temporarily unavailable. Please try again later.",
        502
      );
    }

    // 11. Successful submission.
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message:
          "Thank you for contacting Rosary School. Your enquiry has been submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError");

    if (isTimeout) {
      return sendError(
        "Submission timed out. Please check whether your enquiry was received before retrying.",
        504
      );
    }

    console.error(
      "Rosary Contact API request failed:",
      error instanceof Error ? error.name : "Unknown error"
    );

    return sendError(
      "Unable to confirm your enquiry. Please try again later.",
      502
    );
  }
}
