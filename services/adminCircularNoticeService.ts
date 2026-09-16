const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/backend";


/* =========================================================
   TYPES
========================================================= */

export type CircularNoticeType =
  | "CIRCULAR"
  | "NOTICE";


export interface AdminCircularNotice {
  id: number;

  content_type:
    CircularNoticeType;

  title: string;

  description: string;

  notice_date: string;

  pdf_url: string | null;

  is_published: boolean;

  is_featured: boolean;

  created_by_id:
    number | null;

  created_at: string;

  updated_at: string;
}


export interface AdminCircularNoticeListResponse {
  items: AdminCircularNotice[];

  total: number;

  page: number;

  limit: number;
}


export interface CreateCircularNoticePayload {
  content_type:
    CircularNoticeType;

  title: string;

  description: string;

  notice_date: string;

  pdf_url?: string | null;

  is_published?: boolean;

  is_featured?: boolean;
}


export interface UpdateCircularNoticePayload {
  content_type?:
    CircularNoticeType;

  title?: string;

  description?: string;

  notice_date?: string;

  pdf_url?: string | null;

  is_published?: boolean;

  is_featured?: boolean;
}


export interface GetCircularNoticesParams {
  page?: number;

  limit?: number;

  content_type?:
    CircularNoticeType;

  is_published?:
    boolean;

  is_featured?:
    boolean;

  search?: string;
}


export interface CircularDocumentUploadResponse {
  pdf_url: string;

  file_name: string;

  original_name: string;

  size: number;
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
   GET ADMIN CIRCULARS + NOTICES
========================================================= */

export async function getAdminCircularNotices(
  params: GetCircularNoticesParams = {}
): Promise<AdminCircularNoticeListResponse> {

  const searchParams =
    new URLSearchParams();


  searchParams.set(
    "page",
    String(
      params.page ?? 1
    )
  );


  searchParams.set(
    "limit",
    String(
      params.limit ?? 20
    )
  );


  if (
    params.content_type
  ) {

    searchParams.set(
      "content_type",
      params.content_type
    );

  }


  if (
    typeof params.is_published ===
    "boolean"
  ) {

    searchParams.set(
      "is_published",
      String(
        params.is_published
      )
    );

  }


  if (
    typeof params.is_featured ===
    "boolean"
  ) {

    searchParams.set(
      "is_featured",
      String(
        params.is_featured
      )
    );

  }


  if (
    params.search?.trim()
  ) {

    searchParams.set(
      "search",
      params.search.trim()
    );

  }


  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/circular-notices?${searchParams.toString()}`,
      {
        method: "GET",

        credentials:
          "include",

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
   GET SINGLE
========================================================= */

export async function getAdminCircularNoticeById(
  id: number
): Promise<AdminCircularNotice> {

  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/circular-notices/${id}`,
      {
        method: "GET",

        credentials:
          "include",

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
   CREATE
========================================================= */

export async function createAdminCircularNotice(
  payload: CreateCircularNoticePayload
): Promise<AdminCircularNotice> {

  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/circular-notices`,
      {
        method: "POST",

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
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
   UPDATE
========================================================= */

export async function updateAdminCircularNotice(
  id: number,
  payload: UpdateCircularNoticePayload
): Promise<AdminCircularNotice> {

  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/circular-notices/${id}`,
      {
        method: "PATCH",

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
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
   DELETE
========================================================= */

export async function deleteAdminCircularNotice(
  id: number
): Promise<{
  message: string;
}> {

  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/circular-notices/${id}`,
      {
        method: "DELETE",

        credentials:
          "include",
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
   UPLOAD PDF
========================================================= */

export async function uploadCircularNoticePdf(
  file: File
): Promise<CircularDocumentUploadResponse> {

  const formData =
    new FormData();


  formData.append(
    "file",
    file
  );


  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/uploads/circular-document`,
      {
        method: "POST",

        credentials:
          "include",

        body:
          formData,
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

export function getCircularNoticePdfUrl(
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