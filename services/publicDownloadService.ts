/* =========================================================
   API CONFIG
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/backend";


/* =========================================================
   TYPES
========================================================= */

export type PublicDownloadIconType =
  | "lucide"
  | "image";


export type PublicDownload = {
  id: number;

  title: string;

  description: string;

  icon_type:
    PublicDownloadIconType;

  icon_key:
    string | null;

  icon_url:
    string | null;

  file_url:
    string;

  original_file_name:
    string | null;

  file_size_bytes:
    number | null;

  display_order:
    number;
};


export type PublicDownloadListResponse = {
  items:
    PublicDownload[];

  total:
    number;
};


/* =========================================================
   ERROR CLASS
========================================================= */

export class PublicDownloadApiError
  extends Error {

  status:
    number;

  data:
    unknown;


  constructor(
    message: string,
    status: number,
    data: unknown,
  ) {
    super(
      message,
    );

    this.name =
      "PublicDownloadApiError";

    this.status =
      status;

    this.data =
      data;
  }
}


/* =========================================================
   RESPONSE ERROR MESSAGE
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
   PUBLIC API REQUEST

   No Admin credentials are required because:

   GET /api/v1/downloads

   is a public endpoint.
========================================================= */

async function publicDownloadRequest<T>(
  endpoint: string,
): Promise<T> {

  let response:
    Response;


  try {

    response =
      await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          method:
            "GET",

          headers: {
            Accept:
              "application/json",
          },

          cache:
            "no-store",
        },
      );

  } catch (
    error
  ) {

    console.error(
      "Public Downloads network error:",
      error,
    );


    throw new Error(
      "Unable to connect to the Downloads service.",
    );
  }


  const text =
    await response.text();


  let data:
    any =
    null;


  if (text) {

    try {

      data =
        JSON.parse(
          text,
        );

    } catch {

      data = {
        message:
          text,
      };
    }
  }


  if (
    !response.ok
  ) {

    const message =
      getErrorMessage(
        data,
        `Request failed with status ${response.status}`,
      );


    throw new PublicDownloadApiError(
      message,
      response.status,
      data,
    );
  }


  return data as T;
}


/* =========================================================
   GET PUBLIC DOWNLOADS
========================================================= */

export async function getPublicDownloads() {

  return publicDownloadRequest<
    PublicDownloadListResponse
  >(
    "/api/v1/downloads",
  );
}


/* =========================================================
   BUILD ASSET URL

   Backend returns:

   /uploads/downloads/files/file.pdf

   Frontend needs:

   http://localhos/uploads/downloads/files/file.pdf
========================================================= */

export function getPublicDownloadFileUrl(
  fileUrl:
    | string
    | null
    | undefined,
) {

  if (
    !fileUrl
  ) {
    return "";
  }


  if (
    fileUrl.startsWith(
      "http://",
    ) ||
    fileUrl.startsWith(
      "https://",
    )
  ) {
    return fileUrl;
  }


  return (
    `${API_BASE_URL}${fileUrl}`
  );
}


/* =========================================================
   CUSTOM ICON URL
========================================================= */

export function getPublicDownloadIconUrl(
  iconUrl:
    | string
    | null
    | undefined,
) {

  if (
    !iconUrl
  ) {
    return "";
  }


  if (
    iconUrl.startsWith(
      "http://",
    ) ||
    iconUrl.startsWith(
      "https://",
    )
  ) {
    return iconUrl;
  }


  return (
    `${API_BASE_URL}${iconUrl}`
  );
}


/* =========================================================
   SORT HELPER

   Backend already sorts the records.

   Keeping this helper gives the frontend an additional
   safeguard if the API ordering changes later.
========================================================= */

export function sortPublicDownloads(
  downloads:
    PublicDownload[],
) {

  return [
    ...downloads,
  ].sort(
    (
      first,
      second,
    ) => {

      if (
        first.display_order !==
        second.display_order
      ) {
        return (
          first.display_order -
          second.display_order
        );
      }


      return (
        first.id -
        second.id
      );
    },
  );
}


/* =========================================================
   FILE SIZE HELPER
========================================================= */

export function formatPublicDownloadSize(
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
    return "";
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