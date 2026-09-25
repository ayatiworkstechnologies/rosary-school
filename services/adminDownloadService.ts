/* =========================================================
   API CONFIG
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/backend";


/* =========================================================
   TYPES
========================================================= */

export type DownloadIconType =
  | "lucide"
  | "image";


export type AdminDownload = {
  id: number;

  title: string;
  description: string;

  icon_type: DownloadIconType;
  icon_key: string | null;
  icon_url: string | null;

  file_url: string;

  original_file_name: string | null;
  file_size_bytes: number | null;

  display_order: number;

  is_active: boolean;

  created_by_id: number | null;

  created_at: string;
  updated_at: string;
};


export type AdminDownloadListResponse = {
  items: AdminDownload[];
  total: number;
};


export type DownloadFileUploadResponse = {
  file_url: string;
  file_name: string;
  original_name: string;
  size: number;
};


export type DownloadIconUploadResponse = {
  icon_url: string;
  file_name: string;
  original_name: string;
  size: number;
  width: number;
  height: number;
};


export type CreateDownloadPayload = {
  title: string;

  description: string;

  icon_type: DownloadIconType;

  icon_key?: string | null;

  icon_url?: string | null;

  file_url: string;

  original_file_name?: string | null;

  file_size_bytes?: number | null;

  display_order: number;

  is_active: boolean;
};


export type UpdateDownloadPayload = {
  title?: string;

  description?: string;

  icon_type?: DownloadIconType;

  icon_key?: string | null;

  icon_url?: string | null;

  file_url?: string;

  original_file_name?: string | null;

  file_size_bytes?: number | null;

  display_order?: number;

  is_active?: boolean;
};


export type AdminDownloadQuery = {
  page?: number;
  limit?: number;

  search?: string;

  icon_type?: DownloadIconType | "";

  is_active?: boolean | null;
};


/* =========================================================
   API ERROR
========================================================= */

export class DownloadApiError extends Error {
  status: number;

  data: unknown;

  constructor(
    message: string,
    status: number,
    data: unknown,
  ) {
    super(message);

    this.name =
      "DownloadApiError";

    this.status =
      status;

    this.data =
      data;
  }
}


/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

function getErrorMessage(
  data: any,
  fallback: string,
) {
  if (
    typeof data?.detail ===
    "string"
  ) {
    return data.detail;
  }


  if (
    Array.isArray(
      data?.detail,
    )
  ) {
    return data.detail
      .map(
        (item: any) => {
          const location =
            Array.isArray(
              item?.loc,
            )
              ? item.loc
                  .filter(
                    (
                      part: string,
                    ) =>
                      part !==
                      "body",
                  )
                  .join(".")
              : "";

          const message =
            item?.msg ||
            "Invalid value";

          return location
            ? `${location}: ${message}`
            : message;
        },
      )
      .join(", ");
  }


  if (
    typeof data?.message ===
    "string"
  ) {
    return data.message;
  }


  return fallback;
}


/* =========================================================
   CORE REQUEST
========================================================= */

async function downloadApiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {

  const isFormData =
    typeof FormData !==
      "undefined" &&
    options.body instanceof
      FormData;


  const headers: HeadersInit = {
    Accept:
      "application/json",

    ...(
      !isFormData
        ? {
            "Content-Type":
              "application/json",
          }
        : {}
    ),

    ...options.headers,
  };


  let response: Response;


  try {

    response =
      await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          ...options,

          headers,

          // Required because Admin
          // authentication uses
          // HttpOnly cookie.
          credentials:
            "include",

          cache:
            "no-store",
        },
      );

  } catch (
    error
  ) {

    console.error(
      "Downloads API network error:",
      error,
    );

    throw new Error(
      "Unable to connect to the backend server.",
    );
  }


  /* -------------------------------------------------------
     204 NO CONTENT
  ------------------------------------------------------- */

  if (
    response.status === 204
  ) {
    return null as T;
  }


  /* -------------------------------------------------------
     READ RESPONSE
  ------------------------------------------------------- */

  const text =
    await response.text();


  let data: any =
    null;


  if (text) {

    try {

      data =
        JSON.parse(text);

    } catch {

      data = {
        message: text,
      };
    }
  }


  /* -------------------------------------------------------
     ERROR
  ------------------------------------------------------- */

  if (
    !response.ok
  ) {

    const message =
      getErrorMessage(
        data,
        `Request failed with status ${response.status}`,
      );


    throw new DownloadApiError(
      message,
      response.status,
      data,
    );
  }


  return data as T;
}


/* =========================================================
   BUILD QUERY STRING
========================================================= */

function buildQueryString(
  params: AdminDownloadQuery,
) {

  const searchParams =
    new URLSearchParams();


  if (
    params.page !==
    undefined
  ) {
    searchParams.set(
      "page",
      String(
        params.page,
      ),
    );
  }


  if (
    params.limit !==
    undefined
  ) {
    searchParams.set(
      "limit",
      String(
        params.limit,
      ),
    );
  }


  if (
    params.search?.trim()
  ) {
    searchParams.set(
      "search",
      params.search.trim(),
    );
  }


  if (
    params.icon_type
  ) {
    searchParams.set(
      "icon_type",
      params.icon_type,
    );
  }


  if (
    params.is_active !==
      undefined &&
    params.is_active !==
      null
  ) {
    searchParams.set(
      "is_active",
      String(
        params.is_active,
      ),
    );
  }


  const query =
    searchParams.toString();


  return query
    ? `?${query}`
    : "";
}


/* =========================================================
   GET ADMIN DOWNLOADS
========================================================= */

export async function getAdminDownloads(
  params: AdminDownloadQuery = {},
) {

  const query =
    buildQueryString(
      params,
    );


  return downloadApiRequest<
    AdminDownloadListResponse
  >(
    `/api/v1/admin/downloads${query}`,
    {
      method:
        "GET",
    },
  );
}


/* =========================================================
   GET SINGLE DOWNLOAD
========================================================= */

export async function getAdminDownload(
  downloadId: number,
) {

  return downloadApiRequest<
    AdminDownload
  >(
    `/api/v1/admin/downloads/${downloadId}`,
    {
      method:
        "GET",
    },
  );
}


/* =========================================================
   UPLOAD PDF
========================================================= */

export async function uploadDownloadFile(
  file: File,
) {

  const formData =
    new FormData();


  formData.append(
    "file",
    file,
  );


  return downloadApiRequest<
    DownloadFileUploadResponse
  >(
    "/api/v1/admin/uploads/download-file",
    {
      method:
        "POST",

      body:
        formData,
    },
  );
}


/* =========================================================
   UPLOAD CUSTOM ICON
========================================================= */

export async function uploadDownloadIcon(
  file: File,
) {

  const formData =
    new FormData();


  formData.append(
    "file",
    file,
  );


  return downloadApiRequest<
    DownloadIconUploadResponse
  >(
    "/api/v1/admin/uploads/download-icon",
    {
      method:
        "POST",

      body:
        formData,
    },
  );
}


/* =========================================================
   CREATE DOWNLOAD
========================================================= */

export async function createDownload(
  payload: CreateDownloadPayload,
) {

  return downloadApiRequest<
    AdminDownload
  >(
    "/api/v1/admin/downloads",
    {
      method:
        "POST",

      body:
        JSON.stringify(
          payload,
        ),
    },
  );
}


/* =========================================================
   UPDATE DOWNLOAD
========================================================= */

export async function updateDownload(
  downloadId: number,
  payload: UpdateDownloadPayload,
) {

  return downloadApiRequest<
    AdminDownload
  >(
    `/api/v1/admin/downloads/${downloadId}`,
    {
      method:
        "PATCH",

      body:
        JSON.stringify(
          payload,
        ),
    },
  );
}


/* =========================================================
   ACTIVE / INACTIVE
========================================================= */

export async function updateDownloadStatus(
  downloadId: number,
  isActive: boolean,
) {

  return downloadApiRequest<
    AdminDownload
  >(
    `/api/v1/admin/downloads/${downloadId}/status`,
    {
      method:
        "PATCH",

      body:
        JSON.stringify({
          is_active:
            isActive,
        }),
    },
  );
}


/* =========================================================
   DISPLAY ORDER
========================================================= */

export async function updateDownloadOrder(
  downloadId: number,
  displayOrder: number,
) {

  return downloadApiRequest<
    AdminDownload
  >(
    `/api/v1/admin/downloads/${downloadId}/order`,
    {
      method:
        "PATCH",

      body:
        JSON.stringify({
          display_order:
            displayOrder,
        }),
    },
  );
}


/* =========================================================
   DELETE DOWNLOAD
========================================================= */

export async function deleteDownload(
  downloadId: number,
) {

  return downloadApiRequest<
    null
  >(
    `/api/v1/admin/downloads/${downloadId}`,
    {
      method:
        "DELETE",
    },
  );
}


/* =========================================================
   BUILD UPLOADED ASSET URL
========================================================= */

export function getDownloadAssetUrl(
  path: string | null | undefined,
) {

  if (!path) {
    return "";
  }


  if (
    path.startsWith(
      "http://",
    ) ||
    path.startsWith(
      "https://",
    )
  ) {
    return path;
  }


  return (
    `${API_BASE_URL}${path}`
  );
}


/* =========================================================
   FILE SIZE FORMATTER
========================================================= */

export function formatDownloadFileSize(
  bytes:
    | number
    | null
    | undefined,
) {

  if (
    bytes === null ||
    bytes === undefined ||
    bytes <= 0
  ) {
    return "—";
  }


  if (
    bytes < 1024
  ) {
    return `${bytes} B`;
  }


  const kb =
    bytes / 1024;


  if (
    kb < 1024
  ) {
    return `${kb.toFixed(1)} KB`;
  }


  const mb =
    kb / 1024;


  return `${mb.toFixed(1)} MB`;
}