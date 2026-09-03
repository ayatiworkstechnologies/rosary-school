"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  LoaderCircle,
  MapPin,
  Save,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

import {
  createAdminEvent,
} from "@/services/adminEventService";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";


/* =========================================================
   FORM TYPE
========================================================= */

type EventFormData = {
  title: string;

  description: string;

  venue: string;

  event_date: string;

  start_time: string;

  end_time: string;

  is_published: boolean;
};


/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm: EventFormData = {
  title: "",

  description: "",

  venue: "",

  event_date: "",

  start_time: "",

  end_time: "",

  is_published: true,
};


/* =========================================================
   PAGE
========================================================= */

export default function NewEventPage() {

  const router =
    useRouter();


  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(
    false
  );


  const [
    form,
    setForm,
  ] =
    useState<EventFormData>(
      initialForm
    );


  const [
    saving,
    setSaving,
  ] =
    useState(
      false
    );


  const [
    error,
    setError,
  ] =
    useState(
      ""
    );


  /* =========================================================
     UPDATE FIELD
  ========================================================= */

  const updateField = <
    K extends keyof EventFormData
  >(
    field: K,
    value: EventFormData[K]
  ) => {

    setForm(
      (
        current
      ) => ({
        ...current,

        [field]:
          value,
      })
    );

  };


  /* =========================================================
     VALIDATE FORM
  ========================================================= */

  const validateForm =
    () => {

      if (
        !form.title.trim()
      ) {
        return "Event title is required.";
      }


      if (
        !form.description.trim()
      ) {
        return "Description is required.";
      }


      if (
        !form.venue.trim()
      ) {
        return "Venue is required.";
      }


      if (
        !form.event_date
      ) {
        return "Event date is required.";
      }


      if (
        !form.start_time
      ) {
        return "Start time is required.";
      }


      if (
        form.end_time &&
        form.end_time <=
          form.start_time
      ) {
        return (
          "End time must be later than start time."
        );
      }


      return "";
    };


  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault();


      const validationError =
        validateForm();


      if (
        validationError
      ) {

        setError(
          validationError
        );

        return;

      }


      try {

        setSaving(
          true
        );


        setError(
          ""
        );


        await createAdminEvent({
          title:
            form.title.trim(),

          description:
            form.description.trim(),

          venue:
            form.venue.trim(),

          event_date:
            form.event_date,

          start_time:
            `${form.start_time}:00`,

          end_time:
            form.end_time
              ? `${form.end_time}:00`
              : null,

          is_published:
            form.is_published,
        });


        router.push(
          "/admin/events"
        );


        router.refresh();

      } catch (
        error
      ) {

        console.error(
          "Unable to create Event:",
          error
        );


        setError(
          error instanceof Error
            ? error.message
            : "Unable to create Event."
        );

      } finally {

        setSaving(
          false
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
                max-w-[1000px]
              "
            >

        {/* =================================================
            TOP BACK LINK
        ================================================= */}

        <Link
          href="/admin/events"
          className="
            inline-flex

            items-center

            gap-2

            font-secondary

            text-[11px]
            font-medium

            text-[#697685]

            transition

            hover:text-[#0075FF]
          "
        >

          <ArrowLeft
            size={15}
          />

          Back to Events

        </Link>


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mt-5
          "
        >

          <h1
            className="
              font-primary

              text-[27px]
              font-semibold

              tracking-[-0.5px]

              text-[#151A22]

              sm:text-[31px]
            "
          >
            Add New Event
          </h1>


          <p
            className="
              mt-2

              max-w-[650px]

              font-secondary

              text-[12px]

              leading-[1.6]

              text-[#8B95A5]

              sm:text-[13px]
            "
          >
            Create a new school Event
            with its date, time, venue
            and publishing status.
          </p>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mt-5

              rounded-[9px]

              border
              border-[#FFD4D4]

              bg-[#FFF6F6]

              px-4
              py-3

              font-secondary

              text-[12px]

              text-[#C83C3C]
            "
          >
            {
              error
            }
          </div>
        )}


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            mt-6

            overflow-hidden

            rounded-[14px]

            border
            border-[#E5EAF0]

            bg-white

            shadow-[0_12px_35px_rgba(15,39,67,0.04)]
          "
        >

          <div
            className="
              border-b
              border-[#EDF1F5]

              px-5
              py-5

              sm:px-7
            "
          >

            <h2
              className="
                font-primary

                text-[16px]
                font-semibold

                text-[#1D2530]
              "
            >
              Event Information
            </h2>


            <p
              className="
                mt-1

                font-secondary

                text-[10px]

                text-[#98A2AE]
              "
            >
              Fields marked required
              must be completed.
            </p>

          </div>


          <div
            className="
              grid

              grid-cols-1

              gap-5

              px-5
              py-6

              sm:px-7

              md:grid-cols-2
            "
          >

            {/* =================================================
                TITLE
            ================================================= */}

            <div
              className="
                md:col-span-2
              "
            >

              <label
                htmlFor="title"
                className="
                  font-secondary

                  text-[11px]
                  font-medium

                  text-[#46515E]
                "
              >
                Event Title *
              </label>


              <input
                id="title"
                type="text"

                value={
                  form.title
                }

                onChange={(
                  event
                ) =>
                  updateField(
                    "title",
                    event.target
                      .value
                  )
                }

                placeholder="Example: Annual Sports Meet"

                maxLength={
                  255
                }

                className="
                  mt-2

                  h-[44px]

                  w-full

                  rounded-[8px]

                  border
                  border-[#DDE4EC]

                  bg-white

                  px-3

                  font-secondary

                  text-[12px]

                  text-[#252C35]

                  outline-none

                  transition

                  placeholder:text-[#A8B0BA]

                  focus:border-[#0075FF]
                  focus:ring-2
                  focus:ring-[#0075FF]/10
                "
              />

            </div>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div
              className="
                md:col-span-2
              "
            >

              <label
                htmlFor="description"
                className="
                  font-secondary

                  text-[11px]
                  font-medium

                  text-[#46515E]
                "
              >
                Description *
              </label>


              <textarea
                id="description"

                value={
                  form.description
                }

                onChange={(
                  event
                ) =>
                  updateField(
                    "description",
                    event.target
                      .value
                  )
                }

                placeholder="Enter a short description about the Event..."

                rows={5}

                className="
                  mt-2

                  w-full

                  resize-y

                  rounded-[8px]

                  border
                  border-[#DDE4EC]

                  bg-white

                  px-3
                  py-3

                  font-secondary

                  text-[12px]

                  leading-[1.6]

                  text-[#252C35]

                  outline-none

                  transition

                  placeholder:text-[#A8B0BA]

                  focus:border-[#0075FF]
                  focus:ring-2
                  focus:ring-[#0075FF]/10
                "
              />

            </div>


            {/* =================================================
                VENUE
            ================================================= */}

            <div
              className="
                md:col-span-2
              "
            >

              <label
                htmlFor="venue"
                className="
                  font-secondary

                  text-[11px]
                  font-medium

                  text-[#46515E]
                "
              >
                Venue *
              </label>


              <div
                className="
                  relative
                  mt-2
                "
              >

                <MapPin
                  size={15}
                  className="
                    absolute

                    left-3
                    top-1/2

                    -translate-y-1/2

                    text-[#8EA1B5]
                  "
                />


                <input
                  id="venue"
                  type="text"

                  value={
                    form.venue
                  }

                  onChange={(
                    event
                  ) =>
                    updateField(
                      "venue",
                      event.target
                        .value
                    )
                  }

                  placeholder="Example: School Ground"

                  maxLength={
                    190
                  }

                  className="
                    h-[44px]

                    w-full

                    rounded-[8px]

                    border
                    border-[#DDE4EC]

                    bg-white

                    pl-9
                    pr-3

                    font-secondary

                    text-[12px]

                    text-[#252C35]

                    outline-none

                    transition

                    placeholder:text-[#A8B0BA]

                    focus:border-[#0075FF]
                    focus:ring-2
                    focus:ring-[#0075FF]/10
                  "
                />

              </div>

            </div>


            {/* =================================================
                EVENT DATE
            ================================================= */}

            <div>

              <label
                htmlFor="event_date"
                className="
                  font-secondary

                  text-[11px]
                  font-medium

                  text-[#46515E]
                "
              >
                Event Date *
              </label>


              <div
                className="
                  relative
                  mt-2
                "
              >

                <CalendarDays
                  size={15}
                  className="
                    pointer-events-none

                    absolute

                    left-3
                    top-1/2

                    -translate-y-1/2

                    text-[#8EA1B5]
                  "
                />


                <input
                  id="event_date"
                  type="date"

                  value={
                    form.event_date
                  }

                  onChange={(
                    event
                  ) =>
                    updateField(
                      "event_date",
                      event.target
                        .value
                    )
                  }

                  className="
                    h-[44px]

                    w-full

                    rounded-[8px]

                    border
                    border-[#DDE4EC]

                    bg-white

                    pl-9
                    pr-3

                    font-secondary

                    text-[12px]

                    text-[#525E6B]

                    outline-none

                    transition

                    focus:border-[#0075FF]
                    focus:ring-2
                    focus:ring-[#0075FF]/10
                  "
                />

              </div>

            </div>


            {/* =================================================
                PUBLISH STATUS
            ================================================= */}

            <div>

              <label
                className="
                  font-secondary

                  text-[11px]
                  font-medium

                  text-[#46515E]
                "
              >
                Publishing Status
              </label>


              <button
                type="button"

                onClick={() =>
                  updateField(
                    "is_published",
                    !form.is_published
                  )
                }

                className="
                  mt-2

                  flex

                  h-[44px]

                  w-full

                  items-center
                  justify-between

                  rounded-[8px]

                  border
                  border-[#DDE4EC]

                  bg-white

                  px-3
                "
              >

                <span
                  className="
                    font-secondary

                    text-[11px]

                    text-[#596573]
                  "
                >
                  {
                    form.is_published
                      ? "Published"
                      : "Draft"
                  }
                </span>


                <span
                  className={`
                    relative

                    h-[22px]
                    w-[40px]

                    rounded-full

                    transition-colors

                    ${
                      form.is_published
                        ? "bg-[#0075FF]"
                        : "bg-[#CBD3DD]"
                    }
                  `}
                >

                  <span
                    className={`
                      absolute

                      top-[3px]

                      h-[16px]
                      w-[16px]

                      rounded-full

                      bg-white

                      shadow-sm

                      transition-all

                      ${
                        form.is_published
                          ? "left-[21px]"
                          : "left-[3px]"
                      }
                    `}
                  />

                </span>

              </button>

            </div>


            {/* =================================================
                START TIME
            ================================================= */}

            <div>

              <label
                htmlFor="start_time"
                className="
                  font-secondary

                  text-[11px]
                  font-medium

                  text-[#46515E]
                "
              >
                Start Time *
              </label>


              <div
                className="
                  relative
                  mt-2
                "
              >

                <Clock3
                  size={15}
                  className="
                    pointer-events-none

                    absolute

                    left-3
                    top-1/2

                    -translate-y-1/2

                    text-[#8EA1B5]
                  "
                />


                <input
                  id="start_time"
                  type="time"

                  value={
                    form.start_time
                  }

                  onChange={(
                    event
                  ) =>
                    updateField(
                      "start_time",
                      event.target
                        .value
                    )
                  }

                  className="
                    h-[44px]

                    w-full

                    rounded-[8px]

                    border
                    border-[#DDE4EC]

                    bg-white

                    pl-9
                    pr-3

                    font-secondary

                    text-[12px]

                    text-[#525E6B]

                    outline-none

                    transition

                    focus:border-[#0075FF]
                    focus:ring-2
                    focus:ring-[#0075FF]/10
                  "
                />

              </div>

            </div>


            {/* =================================================
                END TIME
            ================================================= */}

            <div>

              <label
                htmlFor="end_time"
                className="
                  font-secondary

                  text-[11px]
                  font-medium

                  text-[#46515E]
                "
              >
                End Time
                <span
                  className="
                    ml-1

                    font-normal

                    text-[#9AA4AF]
                  "
                >
                  (Optional)
                </span>
              </label>


              <div
                className="
                  relative
                  mt-2
                "
              >

                <Clock3
                  size={15}
                  className="
                    pointer-events-none

                    absolute

                    left-3
                    top-1/2

                    -translate-y-1/2

                    text-[#8EA1B5]
                  "
                />


                <input
                  id="end_time"
                  type="time"

                  value={
                    form.end_time
                  }

                  onChange={(
                    event
                  ) =>
                    updateField(
                      "end_time",
                      event.target
                        .value
                    )
                  }

                  className="
                    h-[44px]

                    w-full

                    rounded-[8px]

                    border
                    border-[#DDE4EC]

                    bg-white

                    pl-9
                    pr-3

                    font-secondary

                    text-[12px]

                    text-[#525E6B]

                    outline-none

                    transition

                    focus:border-[#0075FF]
                    focus:ring-2
                    focus:ring-[#0075FF]/10
                  "
                />

              </div>

            </div>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              flex-col-reverse

              gap-3

              border-t
              border-[#EDF1F5]

              bg-[#FBFCFD]

              px-5
              py-4

              sm:flex-row
              sm:items-center
              sm:justify-end

              sm:px-7
            "
          >

            <Link
              href="/admin/events"
              className="
                inline-flex

                h-[42px]

                items-center
                justify-center

                rounded-[8px]

                border
                border-[#DCE3EB]

                bg-white

                px-5

                font-secondary

                text-[11px]
                font-medium

                text-[#5E6976]

                transition

                hover:border-[#B7C4D1]
                hover:bg-[#F7F9FB]
              "
            >
              Cancel
            </Link>


            <button
              type="submit"

              disabled={
                saving
              }

              className="
                inline-flex

                h-[42px]

                items-center
                justify-center

                gap-2

                rounded-[8px]

                bg-[#0075FF]

                px-5

                font-secondary

                text-[11px]
                font-medium

                text-white

                transition

                hover:bg-[#0067DF]

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {saving ? (

                <>
                  <LoaderCircle
                    size={15}
                    className="
                      animate-spin
                    "
                  />

                  Saving...
                </>

              ) : (

                <>
                  <Save
                    size={15}
                  />

                  {
                    form.is_published
                      ? "Publish Event"
                      : "Save Draft"
                  }
                </>

              )}

            </button>

          </div>

        </form>
            </div>

          </main>

        </div>

      </div>

    </AdminAuthGuard>
  );
}
