// =========================================================
// API BASE URL
// =========================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";


// =========================================================
// TYPES
// =========================================================

export type PublicNewsContentType =
  | "NEWS"
  | "ANNOUNCEMENT";


// =========================================================
// PUBLIC LIST ITEM
// =========================================================

export interface PublicNewsItem {
  id: number;

  content_type: PublicNewsContentType;

  label: string | null;

  title: string;

  slug: string;

  short_description: string;

  image_url: string | null;

  published_at: string | null;

  is_featured: boolean;
}


// =========================================================
// PUBLIC DETAIL ITEM
// =========================================================

export interface PublicNewsDetail {
  id: number;

  content_type: PublicNewsContentType;

  label: string | null;

  title: string;

  slug: string;

  short_description: string;

  content: string;

  image_url: string | null;

  published_at: string | null;

  is_featured: boolean;
}


// =========================================================
// LIST RESPONSE
// =========================================================

export interface PublicNewsListResponse {
  items: PublicNewsItem[];

  total: number;

  page: number;

  limit: number;
}


// =========================================================
// LIST PARAMETERS
// =========================================================

export interface PublicNewsListParams {
  page?: number;

  limit?: number;

  content_type?:
    | PublicNewsContentType;

  search?: string;
}


// =========================================================
// API ERROR
// =========================================================

async function getApiError(
  response: Response
): Promise<string> {
  try {
    const data =
      await response.json();

    if (
      typeof data?.detail === "string"
    ) {
      return data.detail;
    }

    if (
      typeof data?.message === "string"
    ) {
      return data.message;
    }
  } catch {
    // Ignore invalid JSON error response.
  }

  return `Request failed with status ${response.status}`;
}


// =========================================================
// GET PUBLIC NEWS + ANNOUNCEMENTS
// =========================================================

export async function getPublicNews(
  params: PublicNewsListParams = {}
): Promise<PublicNewsListResponse> {

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


  if (params.content_type) {
    searchParams.set(
      "content_type",
      params.content_type
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
      `${API_BASE_URL}/api/v1/news?${searchParams.toString()}`,
      {
        method: "GET",

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
// GET ONE PUBLIC NEWS ITEM BY SLUG
// =========================================================

export async function getPublicNewsBySlug(
  slug: string
): Promise<PublicNewsDetail> {

  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/news/${encodeURIComponent(
        slug
      )}`,
      {
        method: "GET",

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
// GET COMPLETE IMAGE URL
// =========================================================

export function getPublicNewsImageUrl(
  imageUrl:
    | string
    | null
    | undefined
): string | null {

  if (!imageUrl) {
    return null;
  }


  // Already a full URL.
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


// =========================================================
// FORMAT PUBLICATION DATE
// =========================================================

export function formatPublicNewsDate(
  value:
    | string
    | null
    | undefined
): string {

  if (!value) {
    return "";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }


  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}