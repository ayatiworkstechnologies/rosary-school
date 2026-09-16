const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/backend";


/* =========================================================
   PUBLIC GALLERY IMAGE
========================================================= */

export interface PublicGalleryImage {
  id: number;

  image_url: string;

  alt_text: string;

  sort_order: number;
}


/* =========================================================
   PUBLIC GALLERY ALBUM
========================================================= */

export interface PublicGalleryAlbum {
  id: number;

  year: number;

  title: string;

  category: string;

  images: PublicGalleryImage[];
}


/* =========================================================
   PUBLIC ALBUM RESPONSE
========================================================= */

export interface PublicGalleryAlbumListResponse {
  items: PublicGalleryAlbum[];

  total: number;
}


/* =========================================================
   HOMEPAGE IMAGE
========================================================= */

export interface PublicHomepageGalleryImage {
  id: number;

  image_url: string;

  alt_text: string;

  homepage_order: number;
}


/* =========================================================
   HOMEPAGE RESPONSE
========================================================= */

export interface PublicHomepageGalleryResponse {
  items:
    PublicHomepageGalleryImage[];

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
   GET PUBLIC GALLERY ALBUMS
========================================================= */

export async function getPublicGalleryAlbums(
  year?: number
): Promise<
  PublicGalleryAlbumListResponse
> {
  const searchParams =
    new URLSearchParams();


  if (
    year !== undefined
  ) {
    searchParams.set(
      "year",
      String(year)
    );
  }


  const query =
    searchParams.toString();


  const url =
    query
      ? `${API_BASE_URL}/api/v1/gallery/albums?${query}`
      : `${API_BASE_URL}/api/v1/gallery/albums`;


  const response =
    await fetch(
      url,
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
   GET HOMEPAGE GALLERY
========================================================= */

export async function getPublicHomepageGallery(): Promise<
  PublicHomepageGalleryResponse
> {
  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/gallery/homepage`,
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
   BUILD FULL IMAGE URL
========================================================= */

export function getPublicGalleryImageUrl(
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
   SORT ALBUM IMAGES
========================================================= */

export function sortGalleryImages(
  images:
    PublicGalleryImage[]
): PublicGalleryImage[] {
  return [
    ...images,
  ].sort(
    (
      first,
      second
    ) =>
      first.sort_order -
      second.sort_order
  );
}


/* =========================================================
   SORT HOMEPAGE IMAGES
========================================================= */

export function sortHomepageGalleryImages(
  images:
    PublicHomepageGalleryImage[]
): PublicHomepageGalleryImage[] {
  return [
    ...images,
  ].sort(
    (
      first,
      second
    ) =>
      first.homepage_order -
      second.homepage_order
  );
}


/* =========================================================
   GROUP ALBUMS BY YEAR
========================================================= */

export function getGalleryYears(
  albums:
    PublicGalleryAlbum[]
): number[] {
  return Array.from(
    new Set(
      albums.map(
        (
          album
        ) =>
          album.year
      )
    )
  ).sort(
    (
      first,
      second
    ) =>
      second -
      first
  );
}