// =========================================================
// API BASE URL
// =========================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";


// =========================================================
// TYPES
// =========================================================

export type NewsContentType =
  | "NEWS"
  | "ANNOUNCEMENT";


export interface NewsItem {
  id: number;

  content_type: NewsContentType;

  label: string | null;

  title: string;

  slug: string;

  short_description: string;

  content: string;

  image_url: string | null;

  published_at: string | null;

  is_published: boolean;

  is_featured: boolean;

  created_by_id: number | null;

  created_at: string;

  updated_at: string;
}


// =========================================================
// LIST RESPONSE
// =========================================================

export interface NewsListResponse {
  items: NewsItem[];

  total: number;

  page: number;

  limit: number;
}


// =========================================================
// CREATE PAYLOAD
// =========================================================

export interface CreateNewsPayload {
  content_type: NewsContentType;

  label?: string | null;

  title: string;

  short_description: string;

  content: string;

  image_url?: string | null;

  published_at?: string | null;

  is_published: boolean;

  is_featured: boolean;
}


// =========================================================
// UPDATE PAYLOAD
// =========================================================

export interface UpdateNewsPayload {
  content_type?: NewsContentType;

  label?: string | null;

  title?: string;

  short_description?: string;

  content?: string;

  image_url?: string | null;

  published_at?: string | null;

  is_published?: boolean;

  is_featured?: boolean;
}


// =========================================================
// LIST FILTERS
// =========================================================

export interface NewsListParams {
  page?: number;

  limit?: number;

  content_type?: NewsContentType;

  is_published?: boolean;

  search?: string;
}


// =========================================================
// IMAGE UPLOAD RESPONSE
// =========================================================

export interface NewsImageUploadResponse {
  message: string;

  image_url: string;

  filename: string;
}


// =========================================================
// API ERROR
// =========================================================

async function getApiError(
  response: Response
): Promise<string> {
  try {
    const data = await response.json();

    if (
      typeof data?.detail === "string"
    ) {
      return data.detail;
    }

    if (
      Array.isArray(data?.detail)
    ) {
      return (
        data.detail[0]?.msg ||
        "Validation error."
      );
    }

    if (
      typeof data?.message === "string"
    ) {
      return data.message;
    }
  } catch {
    // Ignore JSON parsing errors.
  }

  return (
    `Request failed with status ${response.status}`
  );
}


// =========================================================
// GET ALL NEWS / ANNOUNCEMENTS
// =========================================================

export async function getAdminNews(
  params: NewsListParams = {}
): Promise<NewsListResponse> {

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
      params.limit ?? 10
    )
  );


  if (params.content_type) {
    searchParams.set(
      "content_type",
      params.content_type
    );
  }


  if (
    params.is_published !==
    undefined
  ) {
    searchParams.set(
      "is_published",
      String(
        params.is_published
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


  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/news?${searchParams.toString()}`,
    {
      method: "GET",

      credentials: "include",

      cache: "no-store",
    }
  );


  if (!response.ok) {
    throw new Error(
      await getApiError(
        response
      )
    );
  }


  return response.json();
}


// =========================================================
// GET ONE NEWS ITEM
// =========================================================

export async function getAdminNewsById(
  id: number
): Promise<NewsItem> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/news/${id}`,
    {
      method: "GET",

      credentials: "include",

      cache: "no-store",
    }
  );


  if (!response.ok) {
    throw new Error(
      await getApiError(
        response
      )
    );
  }


  return response.json();
}


// =========================================================
// CREATE NEWS / ANNOUNCEMENT
// =========================================================

export async function createAdminNews(
  payload: CreateNewsPayload
): Promise<NewsItem> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/news`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      credentials: "include",

      body: JSON.stringify(
        payload
      ),
    }
  );


  if (!response.ok) {
    throw new Error(
      await getApiError(
        response
      )
    );
  }


  return response.json();
}


// =========================================================
// UPDATE NEWS / ANNOUNCEMENT
// =========================================================

export async function updateAdminNews(
  id: number,
  payload: UpdateNewsPayload
): Promise<NewsItem> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/news/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      credentials: "include",

      body: JSON.stringify(
        payload
      ),
    }
  );


  if (!response.ok) {
    throw new Error(
      await getApiError(
        response
      )
    );
  }


  return response.json();
}


// =========================================================
// DELETE NEWS / ANNOUNCEMENT
// =========================================================

export async function deleteAdminNews(
  id: number
): Promise<{
  message: string;
}> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/news/${id}`,
    {
      method: "DELETE",

      credentials: "include",
    }
  );


  if (!response.ok) {
    throw new Error(
      await getApiError(
        response
      )
    );
  }


  return response.json();
}


// =========================================================
// UPLOAD NEWS IMAGE
// =========================================================

export async function uploadNewsImage(
  file: File
): Promise<NewsImageUploadResponse> {

  const formData =
    new FormData();


  formData.append(
    "file",
    file
  );


  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/uploads/news-image`,
    {
      method: "POST",

      credentials: "include",

      body: formData,
    }
  );


  if (!response.ok) {
    throw new Error(
      await getApiError(
        response
      )
    );
  }


  return response.json();
}


// =========================================================
// GET FULL IMAGE URL
// =========================================================

export function getNewsImageUrl(
  imageUrl:
    | string
    | null
    | undefined
): string | null {

  if (!imageUrl) {
    return null;
  }


  // Already a complete external URL.
  if (
    imageUrl.startsWith(
      "http://"
    ) ||
    imageUrl.startsWith(
      "https://"
    )
  ) {
    return imageUrl;
  }


  return (
    `${API_BASE_URL}${imageUrl}`
  );
}