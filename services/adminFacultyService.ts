// =========================================================
// ADMIN FACULTY SERVICE
// =========================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/backend";


// =========================================================
// TYPES
// =========================================================


// ---------------------------------------------------------
// FACULTY CATEGORY
// ---------------------------------------------------------

export type FacultyCategory = {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};


export type FacultyCategorySummary = {
  id: number;
  name: string;
  slug: string;
};


export type FacultyCategoryListResponse = {
  items: FacultyCategory[];
  total: number;
};


export type FacultyCategoryCreatePayload = {
  name: string;
  display_order: number;
  is_active: boolean;
};


export type FacultyCategoryUpdatePayload = {
  name?: string;
  display_order?: number;
  is_active?: boolean;
};


// ---------------------------------------------------------
// FACULTY MEMBER
// ---------------------------------------------------------

export type FacultyMember = {
  id: number;

  name: string;

  designation: string;

  subject: string;

  experience_years: number;

  category_id: number;

  image_url: string | null;

  display_order: number;

  is_active: boolean;

  created_by_id: number | null;

  created_at: string;

  updated_at: string;

  category: FacultyCategorySummary;
};


export type FacultyMemberListResponse = {
  items: FacultyMember[];

  total: number;

  page: number;

  limit: number;
};


export type FacultyMemberCreatePayload = {
  name: string;

  designation: string;

  subject: string;

  experience_years: number;

  category_id: number;

  image_url?: string | null;

  display_order: number;

  is_active: boolean;
};


export type FacultyMemberUpdatePayload = {
  name?: string;

  designation?: string;

  subject?: string;

  experience_years?: number;

  category_id?: number;

  image_url?: string | null;

  display_order?: number;

  is_active?: boolean;
};


// ---------------------------------------------------------
// IMAGE UPLOAD
// ---------------------------------------------------------

export type FacultyImageUploadResponse = {
  image_url: string;

  file_name: string;

  original_name: string;

  size: number;

  width: number;

  height: number;
};


// =========================================================
// FILTER TYPES
// =========================================================

export type FacultyMemberFilters = {
  page?: number;

  limit?: number;

  search?: string;

  category_id?: number;

  subject?: string;

  is_active?: boolean;
};


export type FacultyCategoryFilters = {
  search?: string;

  is_active?: boolean;
};


// =========================================================
// ERROR HANDLER
// =========================================================

async function getErrorMessage(
  response: Response
): Promise<string> {
  try {
    const data = await response.json();

    if (
      typeof data?.detail ===
      "string"
    ) {
      return data.detail;
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
            item.msg ||
            "Validation error"
        )
        .join(", ");
    }

    if (
      typeof data?.message ===
      "string"
    ) {
      return data.message;
    }
  } catch {
    // Ignore JSON parsing error.
  }

  return (
    `Request failed with status ${response.status}`
  );
}


// =========================================================
// REQUEST HELPER
// =========================================================

async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    url,
    {
      ...options,

      credentials:
        "include",

      headers: {
        ...(options.body
          instanceof FormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),

        ...options.headers,
      },

      cache:
        "no-store",
    }
  );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response
      );

    throw new Error(
      message
    );
  }

  return response.json();
}


// =========================================================
// CATEGORY APIs
// =========================================================


// ---------------------------------------------------------
// GET ALL CATEGORIES
// ---------------------------------------------------------

export async function getAdminFacultyCategories(
  filters: FacultyCategoryFilters = {}
): Promise<FacultyCategoryListResponse> {
  const params =
    new URLSearchParams();


  if (filters.search) {
    params.set(
      "search",
      filters.search
    );
  }


  if (
    filters.is_active !==
    undefined
  ) {
    params.set(
      "is_active",
      String(
        filters.is_active
      )
    );
  }


  const query =
    params.toString();


  const url =
    `${API_BASE_URL}` +
    `/api/v1/admin/faculty/categories` +
    (query
      ? `?${query}`
      : "");


  return apiRequest<
    FacultyCategoryListResponse
  >(url);
}


// ---------------------------------------------------------
// GET ONE CATEGORY
// ---------------------------------------------------------

export async function getAdminFacultyCategory(
  categoryId: number
): Promise<FacultyCategory> {
  return apiRequest<
    FacultyCategory
  >(
    `${API_BASE_URL}` +
      `/api/v1/admin/faculty/categories/${categoryId}`
  );
}


// ---------------------------------------------------------
// CREATE CATEGORY
// ---------------------------------------------------------

export async function createAdminFacultyCategory(
  payload:
    FacultyCategoryCreatePayload
): Promise<FacultyCategory> {
  return apiRequest<
    FacultyCategory
  >(
    `${API_BASE_URL}` +
      `/api/v1/admin/faculty/categories`,
    {
      method:
        "POST",

      body:
        JSON.stringify(
          payload
        ),
    }
  );
}


// ---------------------------------------------------------
// UPDATE CATEGORY
// ---------------------------------------------------------

export async function updateAdminFacultyCategory(
  categoryId: number,

  payload:
    FacultyCategoryUpdatePayload
): Promise<FacultyCategory> {
  return apiRequest<
    FacultyCategory
  >(
    `${API_BASE_URL}` +
      `/api/v1/admin/faculty/categories/${categoryId}`,
    {
      method:
        "PATCH",

      body:
        JSON.stringify(
          payload
        ),
    }
  );
}


// ---------------------------------------------------------
// DELETE CATEGORY
// ---------------------------------------------------------

export async function deleteAdminFacultyCategory(
  categoryId: number
): Promise<{
  message: string;
}> {
  return apiRequest<{
    message: string;
  }>(
    `${API_BASE_URL}` +
      `/api/v1/admin/faculty/categories/${categoryId}`,
    {
      method:
        "DELETE",
    }
  );
}


// =========================================================
// FACULTY MEMBER APIs
// =========================================================


// ---------------------------------------------------------
// GET FACULTY MEMBERS
// ---------------------------------------------------------

export async function getAdminFacultyMembers(
  filters: FacultyMemberFilters = {}
): Promise<FacultyMemberListResponse> {
  const params =
    new URLSearchParams();


  params.set(
    "page",
    String(
      filters.page || 1
    )
  );


  params.set(
    "limit",
    String(
      filters.limit || 20
    )
  );


  if (filters.search) {
    params.set(
      "search",
      filters.search
    );
  }


  if (
    filters.category_id !==
    undefined
  ) {
    params.set(
      "category_id",
      String(
        filters.category_id
      )
    );
  }


  if (filters.subject) {
    params.set(
      "subject",
      filters.subject
    );
  }


  if (
    filters.is_active !==
    undefined
  ) {
    params.set(
      "is_active",
      String(
        filters.is_active
      )
    );
  }


  return apiRequest<
    FacultyMemberListResponse
  >(
    `${API_BASE_URL}` +
      `/api/v1/admin/faculty/members?${params.toString()}`
  );
}


// ---------------------------------------------------------
// GET ONE FACULTY MEMBER
// ---------------------------------------------------------

export async function getAdminFacultyMember(
  memberId: number
): Promise<FacultyMember> {
  return apiRequest<
    FacultyMember
  >(
    `${API_BASE_URL}` +
      `/api/v1/admin/faculty/members/${memberId}`
  );
}


// ---------------------------------------------------------
// CREATE FACULTY MEMBER
// ---------------------------------------------------------

export async function createAdminFacultyMember(
  payload:
    FacultyMemberCreatePayload
): Promise<FacultyMember> {
  return apiRequest<
    FacultyMember
  >(
    `${API_BASE_URL}` +
      `/api/v1/admin/faculty/members`,
    {
      method:
        "POST",

      body:
        JSON.stringify(
          payload
        ),
    }
  );
}


// ---------------------------------------------------------
// UPDATE FACULTY MEMBER
// ---------------------------------------------------------

export async function updateAdminFacultyMember(
  memberId: number,

  payload:
    FacultyMemberUpdatePayload
): Promise<FacultyMember> {
  return apiRequest<
    FacultyMember
  >(
    `${API_BASE_URL}` +
      `/api/v1/admin/faculty/members/${memberId}`,
    {
      method:
        "PATCH",

      body:
        JSON.stringify(
          payload
        ),
    }
  );
}


// ---------------------------------------------------------
// DELETE FACULTY MEMBER
// ---------------------------------------------------------

export async function deleteAdminFacultyMember(
  memberId: number
): Promise<{
  message: string;
}> {
  return apiRequest<{
    message: string;
  }>(
    `${API_BASE_URL}` +
      `/api/v1/admin/faculty/members/${memberId}`,
    {
      method:
        "DELETE",
    }
  );
}


// =========================================================
// FACULTY IMAGE UPLOAD
// =========================================================

export async function uploadAdminFacultyImage(
  file: File
): Promise<FacultyImageUploadResponse> {
  validateFacultyImage(
    file
  );


  const formData =
    new FormData();


  formData.append(
    "file",
    file
  );


  return apiRequest<
    FacultyImageUploadResponse
  >(
    `${API_BASE_URL}` +
      `/api/v1/admin/uploads/faculty-image`,
    {
      method:
        "POST",

      body:
        formData,
    }
  );
}


// =========================================================
// FRONTEND FILE VALIDATION
// =========================================================

export function validateFacultyImage(
  file: File
): void {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];


  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    throw new Error(
      "Only JPG, JPEG, PNG and WEBP images are allowed."
    );
  }


  const maxSize =
    5 *
    1024 *
    1024;


  if (
    file.size >
    maxSize
  ) {
    throw new Error(
      "Faculty image must be 5 MB or smaller."
    );
  }
}


// =========================================================
// IMAGE URL HELPER
// =========================================================

export function getFacultyImageUrl(
  imageUrl:
    string | null | undefined
): string | null {
  if (!imageUrl) {
    return null;
  }


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


  if (
    imageUrl.startsWith("/")
  ) {
    return (
      `${API_BASE_URL}` +
      imageUrl
    );
  }


  return (
    `${API_BASE_URL}/` +
    imageUrl
  );
}


// =========================================================
// FORMAT EXPERIENCE
// =========================================================

export function formatFacultyExperience(
  years: number
): string {
  if (
    years === 1
  ) {
    return "1 Year Exp";
  }

  return `${years} Years Exp`;
}