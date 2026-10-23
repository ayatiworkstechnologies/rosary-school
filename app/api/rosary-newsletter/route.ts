
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Paste the exact Newsletter module POST endpoint here.
// Do not include the word "POST" inside the URL.
const NEWSLETTER_API_URL = "https://api.ayatiworks.com/api/v1/public/rosary-school/subscribe_module/records";

// Use your existing Ayatiworks API key as a server-side
// environment variable in your hosting provider.
// This key must never be exposed in frontend code.
const API_KEY = process.env.AYATIWORKS_API_KEY ?? "205a80dc727cceb4c6df90f93173287f2fe7bb21b2d445b7046f4d1130afa2f8";

type ApiResponse = {
  success: boolean;
  message: string;
};

function sendResponse(
  success: boolean,
  message: string,
  status: number
) {
  return NextResponse.json<ApiResponse>(
    { success, message },
    { status }
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!NEWSLETTER_API_URL || !API_KEY) {
      return sendResponse(
        false,
        "Newsletter service is not configured.",
        503
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return sendResponse(
        false,
        "Invalid JSON request.",
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
      return sendResponse(
        false,
        "Invalid newsletter subscription data.",
        400
      );
    }

    const input = body.data as Record<string, unknown>;

    const email =
      typeof input.email === "string"
        ? input.email.trim().toLowerCase()
        : "";

    if (!email) {
      return sendResponse(
        false,
        "Please enter your email address.",
        400
      );
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return sendResponse(
        false,
        "Please enter a valid email address.",
        400
      );
    }

    // Match this payload to the Ayatiworks module's
    // actual Sample Request Body.
    const payload = {
      data: {
        email,
      },
    };

    const upstreamResponse = await fetch(
      NEWSLETTER_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      }
    );

    if (!upstreamResponse.ok) {
      console.error(
        "Newsletter API returned status:",
        upstreamResponse.status
      );

      if (upstreamResponse.status === 409) {
        return sendResponse(
          false,
          "This email address is already subscribed.",
          409
        );
      }

      if (
        upstreamResponse.status === 400 ||
        upstreamResponse.status === 422
      ) {
        return sendResponse(
          false,
          "The newsletter service rejected this email address.",
          400
        );
      }

      if (
        upstreamResponse.status === 401 ||
        upstreamResponse.status === 403
      ) {
        return sendResponse(
          false,
          "Newsletter service authentication failed.",
          502
        );
      }

      if (upstreamResponse.status === 429) {
        return sendResponse(
          false,
          "Too many requests. Please try again later.",
          429
        );
      }

      return sendResponse(
        false,
        "Newsletter service is temporarily unavailable.",
        502
      );
    }

    return sendResponse(
      true,
      "Thank you! Your newsletter subscription has been received successfully.",
      201
    );
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError");

    return sendResponse(
      false,
      timedOut
        ? "Request timed out. Please check your subscription status before trying again."
        : "Unable to confirm your subscription. Please try again later.",
      timedOut ? 504 : 502
    );
  }
}
