// =========================================================
// PUBLIC FACULTY SERVICE
// =========================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/backend";


// =========================================================
// TYPES
// =========================================================

export type PublicFacultyCategory = {
  id: number;
  name: string;
  slug: string;
  display_order: number;
};


export type PublicFacultyCategoryListResponse = {
  items: PublicFacultyCategory[];
  total: number;
};


export type PublicFacultyCategorySummary = {
  id: number;
  name: string;
  slug: string;
};


export type PublicFacultyMember = {
  id: number;

  name: string;

  designation: string;

  subject: string;

  experience_years: number;

  image_url: string | null;

  display_order: number;

  category: PublicFacultyCategorySummary;
};


export type PublicFacultyMemberListResponse = {
  items: PublicFacultyMember[];
  total: number;
};


// =========================================================
// ERROR HANDLER
// =========================================================

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
    // Ignore invalid JSON error responses.
  }


  return (
    `Request failed with status ${response.status}`
  );
}


// =========================================================
// REQUEST HELPER
// =========================================================

async function publicApiRequest<T>(
  url: string
): Promise<T> {
  const response =
    await fetch(
      url,
      {
        method:
          "GET",

        cache:
          "no-store",

        headers: {
          Accept:
            "application/json",
        },
      }
    );


  if (
    !response.ok
  ) {
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
// GET PUBLIC FACULTY CATEGORIES
//
// GET
// /api/v1/faculty/categories
// =========================================================

export async function getPublicFacultyCategories():
  Promise<
    PublicFacultyCategoryListResponse
  > {
  return publicApiRequest<
    PublicFacultyCategoryListResponse
  >(
    `${API_BASE_URL}` +
      `/api/v1/faculty/categories`
  );
}


// =========================================================
// GET PUBLIC FACULTY MEMBERS
//
// GET
// /api/v1/faculty
//
// Optional:
//
// /api/v1/faculty?category=leadership
// /api/v1/faculty?category=primary
// =========================================================

export async function getPublicFacultyMembers(
  categorySlug?: string
): Promise<
  PublicFacultyMemberListResponse
> {
  const params =
    new URLSearchParams();


  if (
    categorySlug &&
    categorySlug !==
      "all"
  ) {
    params.set(
      "category",
      categorySlug
    );
  }


  const query =
    params.toString();


  const url =
    `${API_BASE_URL}` +
    `/api/v1/faculty` +
    (query
      ? `?${query}`
      : "");


  return publicApiRequest<
    PublicFacultyMemberListResponse
  >(url);
}


// =========================================================
// IMAGE URL
// =========================================================

export function getPublicFacultyImageUrl(
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
// EXPERIENCE DISPLAY
// =========================================================

export function formatPublicFacultyExperience(
  years: number
): string {
  if (
    years === 0
  ) {
    return "Fresher";
  }


  if (
    years === 1
  ) {
    return "1 Year Exp";
  }


  return (
    `${years} Years Exp`
  );
}


// =========================================================
// SORT CATEGORIES
// =========================================================

export function sortPublicFacultyCategories(
  categories:
    PublicFacultyCategory[]
): PublicFacultyCategory[] {
  return [
    ...categories,
  ].sort(
    (
      a,
      b
    ) => {
      if (
        a.display_order !==
        b.display_order
      ) {
        return (
          a.display_order -
          b.display_order
        );
      }


      return (
        a.name.localeCompare(
          b.name
        )
      );
    }
  );
}


// =========================================================
// SORT FACULTY
// =========================================================

export function sortPublicFacultyMembers(
  members:
    PublicFacultyMember[]
): PublicFacultyMember[] {
  return [
    ...members,
  ].sort(
    (
      a,
      b
    ) => {
      if (
        a.category.id !==
        b.category.id
      ) {
        return (
          a.category.id -
          b.category.id
        );
      }


      if (
        a.display_order !==
        b.display_order
      ) {
        return (
          a.display_order -
          b.display_order
        );
      }


      return (
        a.name.localeCompare(
          b.name
        )
      );
    }
  );
}