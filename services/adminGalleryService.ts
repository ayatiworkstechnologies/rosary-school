const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/backend";


/* =========================================================
   TYPES
========================================================= */

export interface AdminGalleryImage {
  id: number;
  album_id: number;

  image_url: string;
  alt_text: string;

  sort_order: number;

  is_homepage: boolean;
  homepage_order: number | null;

  created_at: string;
  updated_at: string;
}


export interface AdminGalleryAlbum {
  id: number;

  title: string;
  category: string;
  year: number;

  is_published: boolean;

  created_by_id: number | null;

  created_at: string;
  updated_at: string;

  images: AdminGalleryImage[];
}


export interface AdminGalleryAlbumListResponse {
  items: AdminGalleryAlbum[];

  total: number;

  page: number;

  limit: number;
}


/* =========================================================
   ALBUM PAYLOADS
========================================================= */

export interface CreateGalleryAlbumPayload {
  title: string;

  category: string;

  year: number;

  is_published: boolean;
}


export interface UpdateGalleryAlbumPayload {
  title?: string;

  category?: string;

  year?: number;

  is_published?: boolean;
}


/* =========================================================
   IMAGE PAYLOADS
========================================================= */

export interface CreateGalleryImagePayload {
  image_url: string;

  alt_text: string;

  sort_order: number;

  is_homepage: boolean;

  homepage_order: number | null;
}


export interface UpdateGalleryImagePayload {
  alt_text?: string;

  sort_order?: number;

  is_homepage?: boolean;

  homepage_order?: number | null;
}


/* =========================================================
   LIST PARAMETERS
========================================================= */

export interface GetGalleryAlbumsParams {
  page?: number;

  limit?: number;

  year?: number;

  category?: string;

  is_published?: boolean;

  search?: string;
}


/* =========================================================
   UPLOAD RESPONSE
========================================================= */

export interface GalleryUploadedImage {
  image_url: string;

  file_name: string;

  original_name: string;

  size: number;

  width: number;

  height: number;
}


export interface GalleryUploadResponse {
  items: GalleryUploadedImage[];

  total: number;
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
   BUILD QUERY STRING
========================================================= */

function buildGalleryAlbumQuery(
  params:
    GetGalleryAlbumsParams = {}
): string {
  const searchParams =
    new URLSearchParams();


  if (
    params.page !== undefined
  ) {
    searchParams.set(
      "page",
      String(params.page)
    );
  }


  if (
    params.limit !== undefined
  ) {
    searchParams.set(
      "limit",
      String(params.limit)
    );
  }


  if (
    params.year !== undefined
  ) {
    searchParams.set(
      "year",
      String(params.year)
    );
  }


  if (
    params.category
  ) {
    searchParams.set(
      "category",
      params.category
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
    params.search
  ) {
    searchParams.set(
      "search",
      params.search
    );
  }


  const query =
    searchParams.toString();


  return query
    ? `?${query}`
    : "";
}


/* =========================================================
   GET ALBUMS
========================================================= */

export async function getAdminGalleryAlbums(
  params:
    GetGalleryAlbumsParams = {}
): Promise<
  AdminGalleryAlbumListResponse
> {
  const query =
    buildGalleryAlbumQuery(
      params
    );


  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/gallery/albums${query}`,
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
   GET ONE ALBUM
========================================================= */

export async function getAdminGalleryAlbumById(
  albumId: number
): Promise<AdminGalleryAlbum> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/gallery/albums/${albumId}`,
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
   CREATE ALBUM
========================================================= */

export async function createAdminGalleryAlbum(
  payload:
    CreateGalleryAlbumPayload
): Promise<AdminGalleryAlbum> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/gallery/albums`,
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
   UPDATE ALBUM
========================================================= */

export async function updateAdminGalleryAlbum(
  albumId: number,

  payload:
    UpdateGalleryAlbumPayload
): Promise<AdminGalleryAlbum> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/gallery/albums/${albumId}`,
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
   DELETE ALBUM
========================================================= */

export async function deleteAdminGalleryAlbum(
  albumId: number
): Promise<{
  message: string;
}> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/gallery/albums/${albumId}`,
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
   UPLOAD MULTIPLE GALLERY IMAGES
========================================================= */

export async function uploadAdminGalleryImages(
  files: File[]
): Promise<GalleryUploadResponse> {
  if (!files.length) {
    throw new Error(
      "Please select at least one image."
    );
  }


  const formData =
    new FormData();


  files.forEach(
    (file) => {
      formData.append(
        "files",
        file
      );
    }
  );


  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/uploads/gallery-images`,
      {
        method: "POST",

        credentials:
          "include",

        body:
          formData,
      }
    );


  /*
   * IMPORTANT:
   *
   * Do NOT manually set:
   *
   * Content-Type: multipart/form-data
   *
   * The browser automatically adds
   * the required multipart boundary.
   */


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
   ATTACH IMAGE TO ALBUM
========================================================= */

export async function createAdminGalleryImage(
  albumId: number,

  payload:
    CreateGalleryImagePayload
): Promise<AdminGalleryImage> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/gallery/albums/${albumId}/images`,
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
   GET ONE IMAGE
========================================================= */

export async function getAdminGalleryImageById(
  imageId: number
): Promise<AdminGalleryImage> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/gallery/images/${imageId}`,
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
   UPDATE IMAGE
========================================================= */

export async function updateAdminGalleryImage(
  imageId: number,

  payload:
    UpdateGalleryImagePayload
): Promise<AdminGalleryImage> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/gallery/images/${imageId}`,
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
   DELETE IMAGE
========================================================= */

export async function deleteAdminGalleryImage(
  imageId: number
): Promise<{
  message: string;
}> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/gallery/images/${imageId}`,
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
   BUILD FULL IMAGE URL
========================================================= */

export function getAdminGalleryImageUrl(
  imageUrl:
    string | null | undefined
): string {
  if (!imageUrl) {
    return "";
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


  return (
    `${API_BASE_URL}${imageUrl}`
  );
}


/* =========================================================
   FILE VALIDATION HELPER
========================================================= */

export function validateGalleryFiles(
  files: File[]
): string | null {
  const maxFiles = 20;

  const maxSize =
    5 * 1024 * 1024;


  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];


  if (!files.length) {
    return (
      "Please select at least one image."
    );
  }


  if (
    files.length >
    maxFiles
  ) {
    return (
      `You can upload a maximum of ${maxFiles} images at one time.`
    );
  }


  for (const file of files) {
    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      return (
        `${file.name}: Only JPG, JPEG, PNG and WEBP images are allowed.`
      );
    }


    if (
      file.size >
      maxSize
    ) {
      return (
        `${file.name}: Image must be 5 MB or smaller.`
      );
    }
  }


  return null;
}