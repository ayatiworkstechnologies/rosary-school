const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";


/* =========================================================
   TYPES
========================================================= */

export interface AdminEvent {
  id: number;

  title: string;

  description: string;

  venue: string;

  event_date: string;

  start_time: string;

  end_time: string | null;

  is_published: boolean;

  created_by_id: number | null;

  created_at: string;

  updated_at: string;
}


export interface AdminEventListResponse {
  items: AdminEvent[];

  total: number;

  page: number;

  limit: number;
}


export interface CreateAdminEventPayload {
  title: string;

  description: string;

  venue: string;

  event_date: string;

  start_time: string;

  end_time?: string | null;

  is_published: boolean;
}


export interface UpdateAdminEventPayload {
  title?: string;

  description?: string;

  venue?: string;

  event_date?: string;

  start_time?: string;

  end_time?: string | null;

  is_published?: boolean;
}


export interface GetAdminEventsParams {
  page?: number;

  limit?: number;

  is_published?: boolean;

  search?: string;
}


/* =========================================================
   API ERROR HELPER
========================================================= */

async function getErrorMessage(
  response: Response,
  fallbackMessage: string
): Promise<string> {

  try {

    const data =
      await response.json();


    if (
      data &&
      typeof data.detail === "string"
    ) {
      return data.detail;
    }


    if (
      data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }

  } catch {
    // Ignore JSON parsing error.
  }


  return fallbackMessage;
}


/* =========================================================
   GET EVENT LIST
========================================================= */

export async function getAdminEvents(
  params: GetAdminEventsParams = {}
): Promise<AdminEventListResponse> {

  const {
    page = 1,
    limit = 10,
    is_published,
    search,
  } = params;


  const query =
    new URLSearchParams();


  query.set(
    "page",
    String(page)
  );


  query.set(
    "limit",
    String(limit)
  );


  if (
    typeof is_published ===
    "boolean"
  ) {
    query.set(
      "is_published",
      String(
        is_published
      )
    );
  }


  if (
    search &&
    search.trim()
  ) {
    query.set(
      "search",
      search.trim()
    );
  }


  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/events?${query.toString()}`,
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
        response,
        "Unable to load Events."
      )
    );

  }


  return response.json();
}


/* =========================================================
   GET SINGLE EVENT
========================================================= */

export async function getAdminEventById(
  eventId: number
): Promise<AdminEvent> {

  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/events/${eventId}`,
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
        response,
        "Unable to load Event."
      )
    );

  }


  return response.json();
}


/* =========================================================
   CREATE EVENT
========================================================= */

export async function createAdminEvent(
  payload: CreateAdminEventPayload
): Promise<AdminEvent> {

  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/events`,
      {
        method:
          "POST",

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
        response,
        "Unable to create Event."
      )
    );

  }


  return response.json();
}


/* =========================================================
   UPDATE EVENT
========================================================= */

export async function updateAdminEvent(
  eventId: number,
  payload: UpdateAdminEventPayload
): Promise<AdminEvent> {

  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/events/${eventId}`,
      {
        method:
          "PATCH",

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
        response,
        "Unable to update Event."
      )
    );

  }


  return response.json();
}


/* =========================================================
   DELETE EVENT
========================================================= */

export async function deleteAdminEvent(
  eventId: number
): Promise<{
  message: string;
}> {

  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/admin/events/${eventId}`,
      {
        method:
          "DELETE",

        credentials:
          "include",
      }
    );


  if (!response.ok) {

    throw new Error(
      await getErrorMessage(
        response,
        "Unable to delete Event."
      )
    );

  }


  return response.json();
}