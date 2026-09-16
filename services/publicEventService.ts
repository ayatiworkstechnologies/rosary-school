const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/backend";


/* =========================================================
   EVENT SCOPE
========================================================= */

export type PublicEventScope =
  | "this_week"
  | "next_week"
  | "upcoming";


/* =========================================================
   PUBLIC EVENT ITEM
========================================================= */

export interface PublicEventItem {
  id: number;

  title: string;

  description: string;

  venue: string;

  event_date: string;

  start_time: string;

  end_time: string | null;
}


/* =========================================================
   PUBLIC EVENT LIST RESPONSE
========================================================= */

export interface PublicEventListResponse {
  items: PublicEventItem[];

  total: number;

  scope: PublicEventScope;

  limit: number;
}


/* =========================================================
   GET PUBLIC EVENTS
========================================================= */

export async function getPublicEvents(
  params: {
    scope?: PublicEventScope;
    limit?: number;
  } = {}
): Promise<PublicEventListResponse> {

  const {
    scope = "upcoming",
    limit = 20,
  } = params;


  const query =
    new URLSearchParams();


  query.set(
    "scope",
    scope
  );


  query.set(
    "limit",
    String(
      limit
    )
  );


  const response =
    await fetch(
      `${API_BASE_URL}/api/v1/events?${query.toString()}`,
      {
        method: "GET",

        cache:
          "no-store",
      }
    );


  if (!response.ok) {

    let message =
      "Unable to load Events.";


    try {

      const data =
        await response.json();


      if (
        data &&
        typeof data.detail ===
          "string"
      ) {

        message =
          data.detail;

      }

    } catch {
      // Keep fallback message.
    }


    throw new Error(
      message
    );

  }


  return response.json();
}


/* =========================================================
   FORMAT EVENT DATE
========================================================= */

export function formatPublicEventDate(
  value: string
) {

  if (!value) {
    return {
      day: "",
      month: "",
      fullDate: "",
    };
  }


  const date =
    new Date(
      `${value}T00:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return {
      day: "",
      month: "",
      fullDate:
        value,
    };

  }


  const day =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        day:
          "2-digit",
      }
    ).format(
      date
    );


  const month =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        month:
          "short",
      }
    ).format(
      date
    );


  const fullDate =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        day:
          "2-digit",

        month:
          "short",

        year:
          "numeric",
      }
    ).format(
      date
    );


  return {
    day,
    month,
    fullDate,
  };
}


/* =========================================================
   FORMAT SINGLE TIME
========================================================= */

export function formatPublicEventTime(
  value:
    | string
    | null
) {

  if (!value) {
    return "";
  }


  const parts =
    value.split(
      ":"
    );


  const hours =
    Number(
      parts[0]
    );


  const minutes =
    Number(
      parts[1] || 0
    );


  if (
    Number.isNaN(
      hours
    ) ||
    Number.isNaN(
      minutes
    )
  ) {

    return value;

  }


  const date =
    new Date();


  date.setHours(
    hours,
    minutes,
    0,
    0
  );


  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour:
        "numeric",

      minute:
        minutes === 0
          ? undefined
          : "2-digit",

      hour12:
        true,
    }
  ).format(
    date
  );
}


/* =========================================================
   FORMAT EVENT TIME RANGE
========================================================= */

export function formatPublicEventTimeRange(
  startTime: string,
  endTime:
    | string
    | null
) {

  const start =
    formatPublicEventTime(
      startTime
    );


  const end =
    formatPublicEventTime(
      endTime
    );


  if (
    start &&
    end
  ) {

    return `${start} - ${end}`;

  }


  return (
    start ||
    "-"
  );
}