const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";


/* =========================================================
   TYPES
========================================================= */

export type PublicCircularNoticeType =
  | "CIRCULAR"
  | "NOTICE";


export interface PublicCircularNoticeItem {
  id: number;

  content_type:
    PublicCircularNoticeType;

  title: string;

  description: string;

  notice_date: string;

  pdf_url: string | null;

  is_featured: boolean;
}


export interface PublicCircularNoticeResponse {
  featured:
    PublicCircularNoticeItem | null;

  items:
    PublicCircularNoticeItem[];

  total: number;

  limit: number;
}


export interface GetPublicCircularNoticesParams {
  limit?: number;
}


/* =========================================================
   ERROR HELPER
========================================================= */

async function getErrorMessage(
  response: Response
): Promise<string> {

  try {

    const data =
      await response.json();


    if (
      typeof data?.detail ===
      "string"
    ) {
      return data.detail;
    }


    if (
      typeof data?.message ===
      "string"
    ) {
      return data.message;
    }


    if (
      Array.isArray(
        data?.detail
      )
    ) {

      return data.detail
        .map(
          (
            item: {
              msg?: string;
            }
          ) =>
            item?.msg ||
            "Validation error"
        )
        .join(", ");
    }

  } catch {

    // Response was not JSON.

  }


  return (
    `Request failed with status ${response.status}`
  );
}


/* =========================================================
   GET PUBLIC NOTICE BOARD
========================================================= */

export async function getPublicCircularNotices(
  params: GetPublicCircularNoticesParams = {}
): Promise<PublicCircularNoticeResponse> {

  const limit =
    params.limit ?? 5;


  const searchParams =
    new URLSearchParams();


  searchParams.set(
    "limit",
    String(limit)
  );


  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/circular-notices?${searchParams.toString()}`,
      {
        method: "GET",

        cache:
          "no-store",
      }
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response
      )
    );

  }


  return response.json();
}


/* =========================================================
   BUILD FULL PDF URL
========================================================= */

export function getPublicCircularNoticePdfUrl(
  pdfUrl: string | null
): string | null {

  if (!pdfUrl) {
    return null;
  }


  if (
    pdfUrl.startsWith(
      "http://"
    ) ||
    pdfUrl.startsWith(
      "https://"
    )
  ) {
    return pdfUrl;
  }


  return (
    `${API_BASE_URL}${pdfUrl}`
  );
}


/* =========================================================
   FORMAT DATE
========================================================= */

export function formatPublicCircularNoticeDate(
  value: string
): {
  day: string;
  month: string;
  year: string;
  fullDate: string;
} {

  const date =
    new Date(
      `${value}T00:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return {
      day: "",
      month: "",
      year: "",
      fullDate: value,
    };

  }


  const day =
    new Intl.DateTimeFormat(
      "en-US",
      {
        day: "2-digit",
      }
    ).format(date);


  const month =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
      }
    )
      .format(date)
      .toUpperCase();


  const year =
    String(
      date.getFullYear()
    );


  const fullDate =
    `${day} ${month} ${year}`;


  return {
    day,
    month,
    year,
    fullDate,
  };
}


/* =========================================================
   FORMAT CONTENT TYPE
========================================================= */

export function formatCircularNoticeType(
  type: PublicCircularNoticeType
): string {

  return (
    type === "CIRCULAR"
      ? "Circular"
      : "Notice"
  );
}