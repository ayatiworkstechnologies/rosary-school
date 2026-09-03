"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  LoaderCircle,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  deleteAdminEvent,
  getAdminEvents,
  type AdminEvent,
} from "@/services/adminEventService";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import AdminAuthGuard from "../../../components/admin/AdminAuthGuard";


/* =========================================================
   SETTINGS
========================================================= */

const PAGE_LIMIT = 10;


/* =========================================================
   DATE FORMAT
========================================================= */

function formatEventDate(
  value: string
) {

  if (!value) {
    return "-";
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
    return value;
  }


  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    date
  );
}


/* =========================================================
   TIME FORMAT
========================================================= */

function formatTime(
  value: string | null
) {

  if (!value) {
    return null;
  }


  const [
    hours,
    minutes,
  ] =
    value.split(
      ":"
    );


  const date =
    new Date();


  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );


  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  ).format(
    date
  );
}


/* =========================================================
   EVENT TIME DISPLAY
========================================================= */

function getEventTime(
  event: AdminEvent
) {

  const start =
    formatTime(
      event.start_time
    );


  const end =
    formatTime(
      event.end_time
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


/* =========================================================
   PAGE
========================================================= */

export default function AdminEventsPage() {

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  const [
    events,
    setEvents,
  ] =
    useState<
      AdminEvent[]
    >([]);


  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );


  const [
    deletingId,
    setDeletingId,
  ] =
    useState<
      number | null
    >(
      null
    );


  const [
    error,
    setError,
  ] =
    useState(
      ""
    );


  const [
    search,
    setSearch,
  ] =
    useState(
      ""
    );


  const [
    searchInput,
    setSearchInput,
  ] =
    useState(
      ""
    );


  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<
      "ALL"
      | "PUBLISHED"
      | "DRAFT"
    >(
      "ALL"
    );


  const [
    page,
    setPage,
  ] =
    useState(
      1
    );


  const [
    total,
    setTotal,
  ] =
    useState(
      0
    );


  /* =========================================================
     LOAD EVENTS
  ========================================================= */

  const loadEvents =
    useCallback(
      async () => {

        try {

          setLoading(
            true
          );

          setError(
            ""
          );


          let isPublished:
            boolean
            | undefined;


          if (
            statusFilter ===
            "PUBLISHED"
          ) {
            isPublished =
              true;
          }


          if (
            statusFilter ===
            "DRAFT"
          ) {
            isPublished =
              false;
          }


          const response =
            await getAdminEvents({
              page,

              limit:
                PAGE_LIMIT,

              search:
                search ||
                undefined,

              is_published:
                isPublished,
            });


          setEvents(
            response.items
          );


          setTotal(
            response.total
          );

        } catch (
          error
        ) {

          console.error(
            "Unable to load Events:",
            error
          );


          setError(
            error instanceof Error
              ? error.message
              : "Unable to load Events."
          );

        } finally {

          setLoading(
            false
          );

        }

      },
      [
        page,
        search,
        statusFilter,
      ]
    );


  useEffect(
    () => {
      loadEvents();
    },
    [
      loadEvents,
    ]
  );


  /* =========================================================
     TOTAL PAGES
  ========================================================= */

  const totalPages =
    useMemo(
      () =>
        Math.max(
          1,

          Math.ceil(
            total /
            PAGE_LIMIT
          )
        ),
      [
        total,
      ]
    );


  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch =
    () => {

      setPage(
        1
      );


      setSearch(
        searchInput.trim()
      );

    };


  const handleSearchKeyDown =
    (
      event:
        React.KeyboardEvent<HTMLInputElement>
    ) => {

      if (
        event.key ===
        "Enter"
      ) {
        handleSearch();
      }

    };


  /* =========================================================
     STATUS FILTER
  ========================================================= */

  const handleStatusChange =
    (
      value:
        "ALL"
        | "PUBLISHED"
        | "DRAFT"
    ) => {

      setStatusFilter(
        value
      );


      setPage(
        1
      );

    };


  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete =
    async (
      event:
        AdminEvent
    ) => {

      const confirmed =
        window.confirm(
          `Delete "${event.title}"?`
        );


      if (
        !confirmed
      ) {
        return;
      }


      try {

        setDeletingId(
          event.id
        );


        setError(
          ""
        );


        await deleteAdminEvent(
          event.id
        );


        /*
         * If deleting the only record
         * on this page, move back one page.
         */
        if (
          events.length ===
            1 &&
          page > 1
        ) {

          setPage(
            (
              current
            ) =>
              current - 1
          );

          return;
        }


        await loadEvents();

      } catch (
        error
      ) {

        console.error(
          "Unable to delete Event:",
          error
        );


        setError(
          error instanceof Error
            ? error.message
            : "Unable to delete Event."
        );

      } finally {

        setDeletingId(
          null
        );

      }

    };


  return (
    <AdminAuthGuard>

      <div
        className="
          min-h-screen
          bg-[#F7F9FC]
        "
      >

        {/* =================================================
            ADMIN SIDEBAR
        ================================================= */}

        <AdminSidebar
          mobileOpen={
            mobileSidebarOpen
          }
          onClose={() =>
            setMobileSidebarOpen(
              false
            )
          }
        />


        {/* =================================================
            ADMIN MAIN AREA
        ================================================= */}

        <div
          className="
            min-h-screen
            lg:pl-[250px]
          "
        >

          <AdminHeader
            onMenuClick={() =>
              setMobileSidebarOpen(
                true
              )
            }
          />


          <main
            className="
              mx-auto

              w-full
              max-w-[1600px]

              px-4
              py-6

              sm:px-6
              sm:py-7

              lg:px-8
              lg:py-8
            "
          >

            <div
              className="
                mx-auto

                w-full
                max-w-[1400px]
              "
            >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            flex-col

            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h1
              className="
                font-primary

                text-[26px]
                font-semibold

                tracking-[-0.5px]

                text-[#151A22]

                sm:text-[30px]
              "
            >
              Events Management
            </h1>


            <p
              className="
                mt-1

                font-secondary

                text-[12px]

                text-[#8B95A5]

                sm:text-[13px]
              "
            >
              Create, update and manage
              school Events.
            </p>

          </div>


          <Link
            href="/admin/events/new"
            className="
              inline-flex

              w-fit

              items-center
              justify-center

              gap-2

              rounded-[8px]

              bg-[#0075FF]

              px-4
              py-[11px]

              font-secondary

              text-[12px]
              font-medium

              !text-white

              transition

              hover:bg-[#0067DF]
            "
          >

            <Plus
              size={16}
            />

            Add Event

          </Link>

        </div>


        {/* =================================================
            FILTERS
        ================================================= */}

        <div
          className="
            mt-6

            rounded-[12px]

            border
            border-[#E7ECF2]

            bg-white

            p-4
          "
        >

          <div
            className="
              flex
              flex-col

              gap-3

              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            {/* SEARCH */}

            <div
              className="
                flex

                w-full

                items-center

                overflow-hidden

                rounded-[8px]

                border
                border-[#E1E7EE]

                bg-[#FAFBFC]

                md:max-w-[460px]
              "
            >

              <div
                className="
                  flex

                  flex-1

                  items-center

                  gap-2

                  px-3
                "
              >

                <Search
                  size={16}
                  className="
                    shrink-0
                    text-[#8A96A5]
                  "
                />


                <input
                  type="text"

                  value={
                    searchInput
                  }

                  onChange={(
                    event
                  ) =>
                    setSearchInput(
                      event.target
                        .value
                    )
                  }

                  onKeyDown={
                    handleSearchKeyDown
                  }

                  placeholder="Search Events..."

                  className="
                    h-[42px]

                    w-full

                    bg-transparent

                    font-secondary

                    text-[12px]

                    text-[#252B34]

                    outline-none

                    placeholder:text-[#A2AAB5]
                  "
                />

              </div>


              <button
                type="button"

                onClick={
                  handleSearch
                }

                className="
                  h-[42px]

                  border-l
                  border-[#E1E7EE]

                  px-4

                  font-secondary

                  text-[11px]
                  font-medium

                  text-[#0075FF]

                  transition

                  hover:bg-[#EEF6FF]
                "
              >
                Search
              </button>

            </div>


            {/* STATUS */}

            <select
              value={
                statusFilter
              }

              onChange={(
                event
              ) =>
                handleStatusChange(
                  event.target
                    .value as
                    | "ALL"
                    | "PUBLISHED"
                    | "DRAFT"
                )
              }

              className="
                h-[42px]

                min-w-[170px]

                rounded-[8px]

                border
                border-[#E1E7EE]

                bg-white

                px-3

                font-secondary

                text-[12px]

                text-[#4E5966]

                outline-none

                focus:border-[#0075FF]
              "
            >

              <option value="ALL">
                All Status
              </option>

              <option value="PUBLISHED">
                Published
              </option>

              <option value="DRAFT">
                Draft
              </option>

            </select>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mt-4

              rounded-[9px]

              border
              border-[#FFD5D5]

              bg-[#FFF6F6]

              px-4
              py-3

              font-secondary

              text-[12px]

              text-[#C83C3C]
            "
          >
            {error}
          </div>
        )}


        {/* =================================================
            TABLE
        ================================================= */}

        <div
          className="
            mt-5

            overflow-hidden

            rounded-[12px]

            border
            border-[#E7ECF2]

            bg-white
          "
        >

          {loading ? (

            <div
              className="
                flex

                min-h-[320px]

                items-center
                justify-center

                gap-2
              "
            >

              <LoaderCircle
                size={20}

                className="
                  animate-spin

                  text-[#0075FF]
                "
              />


              <span
                className="
                  font-secondary

                  text-[12px]

                  text-[#8B95A5]
                "
              >
                Loading Events...
              </span>

            </div>

          ) : events.length ===
            0 ? (

            <div
              className="
                flex

                min-h-[300px]

                flex-col

                items-center
                justify-center

                px-5

                text-center
              "
            >

              <CalendarDays
                size={35}

                className="
                  text-[#B8C6D6]
                "
              />


              <p
                className="
                  mt-3

                  font-primary

                  text-[15px]
                  font-semibold

                  text-[#344050]
                "
              >
                No Events Found
              </p>


              <p
                className="
                  mt-1

                  font-secondary

                  text-[11px]

                  text-[#98A2AE]
                "
              >
                Create an Event or
                change your filters.
              </p>

            </div>

          ) : (

            <div
              className="
                overflow-x-auto
              "
            >

              <table
                className="
                  w-full

                  min-w-[1000px]

                  border-collapse
                "
              >

                <thead
                  className="
                    bg-[#F8FAFC]
                  "
                >

                  <tr
                    className="
                      border-b
                      border-[#E8EDF3]
                    "
                  >

                    {[
                      "Event",
                      "Date",
                      "Time",
                      "Venue",
                      "Status",
                      "Actions",
                    ].map(
                      (
                        heading
                      ) => (

                        <th
                          key={
                            heading
                          }

                          className="
                            px-5
                            py-4

                            text-left

                            font-secondary

                            text-[10px]
                            font-semibold

                            uppercase

                            tracking-[0.4px]

                            text-[#8793A2]
                          "
                        >
                          {
                            heading
                          }
                        </th>

                      )
                    )}

                  </tr>

                </thead>


                <tbody>

                  {events.map(
                    (
                      event
                    ) => (

                      <tr
                        key={
                          event.id
                        }

                        className="
                          border-b
                          border-[#EEF1F5]

                          last:border-b-0

                          transition-colors

                          hover:bg-[#FBFCFE]
                        "
                      >

                        {/* EVENT */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              max-w-[360px]
                            "
                          >

                            <p
                              className="
                                font-primary

                                text-[13px]
                                font-semibold

                                text-[#1D2530]
                              "
                            >
                              {
                                event.title
                              }
                            </p>


                            <p
                              className="
                                mt-1

                                line-clamp-2

                                font-secondary

                                text-[10px]

                                leading-[1.5]

                                text-[#8E98A5]
                              "
                            >
                              {
                                event.description
                              }
                            </p>

                          </div>

                        </td>


                        {/* DATE */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              inline-flex

                              items-center

                              gap-2
                            "
                          >

                            <CalendarDays
                              size={14}

                              className="
                                text-[#0075FF]
                              "
                            />

                            <span
                              className="
                                font-secondary

                                text-[11px]

                                text-[#596573]
                              "
                            >
                              {
                                formatEventDate(
                                  event.event_date
                                )
                              }
                            </span>

                          </div>

                        </td>


                        {/* TIME */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              inline-flex

                              items-center

                              gap-2
                            "
                          >

                            <Clock3
                              size={14}

                              className="
                                text-[#0075FF]
                              "
                            />

                            <span
                              className="
                                whitespace-nowrap

                                font-secondary

                                text-[11px]

                                text-[#596573]
                              "
                            >
                              {
                                getEventTime(
                                  event
                                )
                              }
                            </span>

                          </div>

                        </td>


                        {/* VENUE */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              flex

                              max-w-[180px]

                              items-center

                              gap-2
                            "
                          >

                            <MapPin
                              size={14}

                              className="
                                shrink-0

                                text-[#0075FF]
                              "
                            />

                            <span
                              className="
                                font-secondary

                                text-[11px]

                                text-[#596573]
                              "
                            >
                              {
                                event.venue
                              }
                            </span>

                          </div>

                        </td>


                        {/* STATUS */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex

                              rounded-full

                              px-[9px]
                              py-[5px]

                              font-secondary

                              text-[9px]
                              font-semibold

                              ${
                                event.is_published
                                  ? `
                                      bg-[#EBF9F1]
                                      text-[#268A50]
                                    `
                                  : `
                                      bg-[#FFF4E5]
                                      text-[#B87400]
                                    `
                              }
                            `}
                          >
                            {
                              event.is_published
                                ? "Published"
                                : "Draft"
                            }
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td
                          className="
                            px-5
                            py-4
                          "
                        >

                          <div
                            className="
                              flex

                              items-center

                              gap-2
                            "
                          >

                            <Link
                              href={
                                `/admin/events/${event.id}/edit`
                              }

                              aria-label={
                                `Edit ${event.title}`
                              }

                              className="
                                inline-flex

                                h-[34px]
                                w-[34px]

                                items-center
                                justify-center

                                rounded-[7px]

                                border
                                border-[#DDE7F1]

                                text-[#0075FF]

                                transition

                                hover:border-[#0075FF]
                                hover:bg-[#EEF6FF]
                              "
                            >

                              <Edit3
                                size={14}
                              />

                            </Link>


                            <button
                              type="button"

                              disabled={
                                deletingId ===
                                event.id
                              }

                              onClick={() =>
                                handleDelete(
                                  event
                                )
                              }

                              aria-label={
                                `Delete ${event.title}`
                              }

                              className="
                                inline-flex

                                h-[34px]
                                w-[34px]

                                items-center
                                justify-center

                                rounded-[7px]

                                border
                                border-[#F0DADA]

                                text-[#D14343]

                                transition

                                hover:border-[#D14343]
                                hover:bg-[#FFF2F2]

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >

                              {deletingId ===
                              event.id ? (

                                <LoaderCircle
                                  size={14}

                                  className="
                                    animate-spin
                                  "
                                />

                              ) : (

                                <Trash2
                                  size={14}
                                />

                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          total > 0 && (

            <div
              className="
                mt-4

                flex
                flex-col

                gap-3

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <p
                className="
                  font-secondary

                  text-[11px]

                  text-[#8B95A5]
                "
              >
                Showing page{" "}
                <span
                  className="
                    font-medium
                    text-[#4D5866]
                  "
                >
                  {page}
                </span>{" "}
                of{" "}
                <span
                  className="
                    font-medium
                    text-[#4D5866]
                  "
                >
                  {
                    totalPages
                  }
                </span>

                {" "}—{" "}

                {total} Event
                {
                  total !== 1
                    ? "s"
                    : ""
                }
              </p>


              <div
                className="
                  flex

                  items-center

                  gap-2
                "
              >

                <button
                  type="button"

                  disabled={
                    page <= 1
                  }

                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        Math.max(
                          1,
                          current -
                            1
                        )
                    )
                  }

                  className="
                    inline-flex

                    h-[36px]

                    items-center
                    justify-center

                    gap-1

                    rounded-[7px]

                    border
                    border-[#DEE5ED]

                    bg-white

                    px-3

                    font-secondary

                    text-[10px]

                    text-[#596573]

                    transition

                    hover:border-[#0075FF]
                    hover:text-[#0075FF]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >

                  <ChevronLeft
                    size={14}
                  />

                  Previous

                </button>


                <button
                  type="button"

                  disabled={
                    page >=
                    totalPages
                  }

                  onClick={() =>
                    setPage(
                      (
                        current
                      ) =>
                        Math.min(
                          totalPages,
                          current +
                            1
                        )
                    )
                  }

                  className="
                    inline-flex

                    h-[36px]

                    items-center
                    justify-center

                    gap-1

                    rounded-[7px]

                    border
                    border-[#DEE5ED]

                    bg-white

                    px-3

                    font-secondary

                    text-[10px]

                    text-[#596573]

                    transition

                    hover:border-[#0075FF]
                    hover:text-[#0075FF]

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >

                  Next

                  <ChevronRight
                    size={14}
                  />

                </button>

              </div>

            </div>

          )}

            </div>

          </main>

        </div>

      </div>

    </AdminAuthGuard>
  );
}