"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Search,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type EventItem = {
  id: number;
  day: string;
  month: string;
  location: string;
  time: string;
  title: string;
  description: string;
};

type UpcomingEvent = {
  id: number;
  title: string;
  location: string;
  dateTime: string;
};

/* =========================================================
   MAIN EVENTS
========================================================= */

const events: EventItem[] = [
  {
    id: 1,
    day: "15",
    month: "Aug",
    location: "School Campus",
    time: "8 Am",
    title:
      "Independence Day Celebration",
    description:
      "Flag hoisting, cultural performances and student presentations celebrating India’s Independence Day.",
  },

  {
    id: 2,
    day: "22",
    month: "Aug",
    location: "Classrooms",
    time: "8 Am - 1pm",
    title:
      "Parent-Teacher Meeting",
    description:
      "An opportunity for parents and teachers to discuss students’ academic progress and overall development.",
  },

  {
    id: 3,
    day: "25",
    month: "Sep",
    location:
      "School Auditorium",
    time: "8 Am",
    title:
      "Teachers’ Day Celebration",
    description:
      "Students honour their teachers through special performances, activities and appreciation programmes.",
  },

  {
    id: 4,
    day: "27",
    month: "Sep",
    location:
      "School Auditorium",
    time: "9 Am",
    title:
      "Inter-House Cultural Fest",
    description:
      "Students showcase their talents through music, dance, drama and creative competitions.",
  },

  {
    id: 5,
    day: "15",
    month: "Oct",
    location:
      "School Ground",
    time: "8 Am",
    title:
      "Annual Sports Meet",
    description:
      "A day of athletics, team events and sporting activities celebrating teamwork and sportsmanship.",
  },
];

/* =========================================================
   UPCOMING EVENTS
========================================================= */

const upcomingEvents: UpcomingEvent[] = [
  {
    id: 1,
    title:
      "Rosary Welcomes New Principal",
    location:
      "School Campus",
    dateTime:
      "AUG 15-2026 - 8 AM",
  },

  {
    id: 2,
    title:
      "Sports Excellence at Rosary",
    location:
      "Classrooms",
    dateTime:
      "AUG 09-2026 - 8 AM",
  },

  {
    id: 3,
    title:
      "Celebrating Academic Excellence",
    location:
      "School Auditorium",
    dateTime:
      "AUG 09-2026 - 8 AM",
  },

  {
    id: 4,
    title:
      "Student Leadership Takes Centre Stage",
    location:
      "School Auditorium",
    dateTime:
      "AUG 09-2026 - 8 AM",
  },

  {
    id: 5,
    title:
      "Sports Excellence at Rosary",
    location:
      "School Ground",
    dateTime:
      "AUG 09-2026 - 8 AM",
  },

  {
    id: 6,
    title:
      "Celebrating Academic Excellence",
    location:
      "School Ground",
    dateTime:
      "AUG 09-2026 - 8 AM",
  },
];

/* =========================================================
   ANIMATION
========================================================= */

const ease = [
  0.22,
  1,
  0.36,
  1,
] as const;

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SchoolEventsSection() {
  const [search, setSearch] =
    useState("");

  /* =========================================================
     NORMALIZED SEARCH

     trim means:
     ""
     " "
     "   "

     are all treated as no search.
  ========================================================= */

  const query = useMemo(
    () =>
      search
        .trim()
        .toLowerCase(),
    [search]
  );

  /* =========================================================
     MAIN EVENTS FILTER
  ========================================================= */

  const filteredEvents =
    useMemo(() => {
      if (!query) {
        return events;
      }

      return events.filter(
        (event) => {
          const searchable =
            [
              event.day,
              event.month,
              event.location,
              event.time,
              event.title,
              event.description,
            ]
              .join(" ")
              .toLowerCase();

          return searchable.includes(
            query
          );
        }
      );
    }, [query]);

  /* =========================================================
     UPCOMING FILTER
  ========================================================= */

  const filteredUpcoming =
    useMemo(() => {
      if (!query) {
        return upcomingEvents;
      }

      return upcomingEvents.filter(
        (event) => {
          const searchable =
            [
              event.title,
              event.location,
              event.dateTime,
            ]
              .join(" ")
              .toLowerCase();

          return searchable.includes(
            query
          );
        }
      );
    }, [query]);

  /* =========================================================
     CLEAR
  ========================================================= */

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <section
      className="
        relative
        isolate

        w-full
        overflow-hidden

        bg-white

        py-[46px]

        sm:py-[56px]

        lg:py-[70px]
      "
    >
      <div
        className="
          mx-auto

          grid
          w-full
          max-w-[1320px]

          grid-cols-1

          px-[16px]

          sm:px-[26px]

          md:px-[36px]

          lg:grid-cols-[minmax(0,1.68fr)_minmax(300px,0.92fr)]
          lg:gap-[46px]
          lg:px-[48px]

          xl:gap-[60px]
        "
      >
        {/* =====================================================
            LEFT AREA
        ====================================================== */}

        <div
          className="
            min-w-0
            w-full
          "
        >
          {/* =================================================
              SEARCH
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.75,
              ease,
            }}
            className="
              relative

              w-full

              rounded-[9px]


              bg-white

              p-[9px]

              shadow-[0_5px_20px_rgba(0,117,255,0.04)]

              transition-all
              duration-300

             
              focus-within:shadow-[0_8px_26px_rgba(0,117,255,0.09)]
            "
          >
            {/* SEARCH ICON */}

            <Search
              size={18}
              strokeWidth={1.8}
              className="
                pointer-events-none

                absolute
                left-[25px]
                top-1/2

                -translate-y-1/2

                text-[#66839E]
              "
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search Events"
              aria-label="Search events"
              className="
                h-[48px]
                w-full

                rounded-[7px]

                border-0

                bg-[#F7F8F9]

                pl-[46px]

                pr-[50px]

                font-secondary

                text-[14px]

                text-[#202020]

                outline-none

                placeholder:text-[#9CA6B2]

                sm:h-[50px]
                sm:text-[15px]
              "
            />

            {/* CLEAR SEARCH */}

            <AnimatePresence>
              {search.length > 0 && (
                <motion.button
                  type="button"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  onClick={
                    clearSearch
                  }
                  aria-label="Clear search"
                  className="
                    absolute

                    right-[20px]
                    top-1/2

                    flex

                    h-[30px]
                    w-[30px]

                    -translate-y-1/2

                    items-center
                    justify-center

                    rounded-full

                    bg-white

                    text-[#777777]

                    shadow-[0_3px_10px_rgba(20,40,60,0.07)]

                    transition-all
                    duration-300

                    hover:bg-[#0075FF]
                    hover:text-white
                  "
                >
                  <X
                    size={15}
                    strokeWidth={2}
                  />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* =================================================
              EVENTS TITLE
          ================================================= */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.08,
              ease,
            }}
            className="
              mt-[20px]

              font-primary

              text-[28px]
              font-semibold

              leading-none

              tracking-[-0.5px]

              text-[#171717]

              sm:text-[31px]
            "
          >
            Events
          </motion.h2>

          {/* =================================================
              MAIN EVENT LIST

              IMPORTANT FIX:
              Dynamic items use explicit
              initial / animate / exit.

              They DO NOT depend on a
              once:true parent variant.
          ================================================= */}

          <div
            className="
              mt-[18px]

              border-t
              border-[#E3E6E9]
            "
          >
            <AnimatePresence
              mode="popLayout"
              initial={false}
            >
              {filteredEvents.length >
              0 ? (
                filteredEvents.map(
                  (
                    event,
                    index
                  ) => (
                    <motion.article
                      layout
                      key={
                        event.id
                      }
                      initial={{
                        opacity: 0,
                        y: 16,
                        scale:
                          0.99,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        scale:
                          0.985,
                      }}
                      transition={{
                        duration:
                          0.42,
                        delay:
                          index *
                          0.035,
                        ease,
                        layout: {
                          duration:
                            0.35,
                        },
                      }}
                      whileHover={{
                        x: 3,
                      }}
                      className={`
                        group
                        relative

                        grid

                        grid-cols-[58px_minmax(0,1fr)]

                        gap-[14px]

                        border-b

                        bg-white

                        px-[10px]
                        py-[18px]

                        transition-colors
                        duration-300

                        hover:bg-[#FCFDFF]

                        sm:grid-cols-[70px_112px_minmax(0,1fr)]
                        sm:gap-[18px]
                        sm:px-[15px]

                        md:grid-cols-[76px_125px_minmax(0,1fr)]

                        ${
                          index ===
                          0
                            ? `
                              border
                              border-[#78B8FF]

                              shadow-[0_8px_26px_rgba(0,117,255,0.055)]
                            `
                            : `
                              border-x-0
                              border-t-0
                              border-b-[#E6E8EB]
                            `
                        }
                      `}
                    >
                      {/* =====================================
                          DATE
                      ====================================== */}

                      <div
                        className="
                          flex

                          flex-col
                          justify-center
                        "
                      >
                        <span
                          className="
                            font-primary

                            text-[27px]
                            font-semibold

                            leading-[0.9]

                            text-[#0075FF]

                            sm:text-[30px]
                          "
                        >
                          {
                            event.day
                          }
                        </span>

                        <span
                          className="
                            mt-[7px]

                            font-primary

                            text-[13px]
                            font-semibold

                            leading-none

                            text-[#191919]
                          "
                        >
                          {
                            event.month
                          }
                        </span>
                      </div>

                      {/* =====================================
                          LOCATION
                          TABLET/DESKTOP
                      ====================================== */}

                      <div
                        className="
                          hidden

                          border-l
                          border-[#D9DDE1]

                          pl-[20px]

                          sm:flex
                          sm:flex-col
                          sm:justify-center
                        "
                      >
                        <span
                          className="
                            font-primary

                            text-[10px]
                            font-medium

                            leading-[1.25]

                            text-[#222222]
                          "
                        >
                          {
                            event.location
                          }
                        </span>

                        <span
                          className="
                            mt-[5px]

                            font-secondary

                            text-[9.5px]

                            text-[#555555]
                          "
                        >
                          {
                            event.time
                          }
                        </span>
                      </div>

                      {/* =====================================
                          CONTENT
                      ====================================== */}

                      <div
                        className="
                          min-w-0

                          sm:border-l
                          sm:border-[#D9DDE1]

                          sm:pl-[25px]
                        "
                      >
                        <h3
                          className="
                            font-primary

                            text-[15px]
                            font-semibold

                            leading-[1.2]

                            tracking-[-0.2px]

                            text-[#202020]

                            sm:text-[16px]

                            md:text-[17px]
                          "
                        >
                          {
                            event.title
                          }
                        </h3>

                        {/* MOBILE LOCATION */}

                        <div
                          className="
                            mt-[5px]

                            flex
                            flex-wrap

                            items-center

                            gap-[5px]

                            sm:hidden
                          "
                        >
                          <span
                            className="
                              font-secondary

                              text-[9px]
                              font-medium

                              text-[#0075FF]
                            "
                          >
                            {
                              event.location
                            }
                          </span>

                          <span
                            className="
                              text-[8px]
                              text-[#B8B8B8]
                            "
                          >
                            •
                          </span>

                          <span
                            className="
                              font-secondary

                              text-[9px]

                              text-[#777777]
                            "
                          >
                            {
                              event.time
                            }
                          </span>
                        </div>

                        <p
                          className="
                            mt-[7px]

                            max-w-[520px]

                            font-secondary

                            text-[10px]

                            leading-[1.5]

                            text-[#8A8A8A]

                            sm:text-[10.5px]

                            md:text-[11px]
                          "
                        >
                          {
                            event.description
                          }
                        </p>
                      </div>

                      {/* =====================================
                          HOVER BLUE LINE
                      ====================================== */}

                      <span
                        className="
                          pointer-events-none

                          absolute
                          bottom-0
                          left-0

                          h-[2px]
                          w-0

                          bg-[#0075FF]

                          transition-all
                          duration-500

                          group-hover:w-full
                        "
                      />
                    </motion.article>
                  )
                )
              ) : (
                <motion.div
                  key="no-main-results"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  className="
                    flex

                    min-h-[180px]

                    items-center
                    justify-center

                    border-b
                    border-[#E6E8EB]

                    px-[20px]

                    text-center
                  "
                >
                  <div>
                    <p
                      className="
                        font-primary

                        text-[16px]
                        font-semibold

                        text-[#252525]
                      "
                    >
                      No events
                      found
                    </p>

                    <p
                      className="
                        mt-[6px]

                        font-secondary

                        text-[11px]

                        text-[#8C8C8C]
                      "
                    >
                      Try another
                      event,
                      location,
                      month or
                      keyword.
                    </p>

                    <button
                      type="button"
                      onClick={
                        clearSearch
                      }
                      className="
                        mt-[14px]

                        font-secondary

                        text-[11px]
                        font-medium

                        text-[#0075FF]

                        transition-opacity
                        duration-300

                        hover:opacity-70
                      "
                    >
                      Clear search
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* =====================================================
            RIGHT — UPCOMING EVENTS
        ====================================================== */}

        <aside
          className="
            relative

            mt-[45px]

            min-w-0

            lg:mt-0

            lg:border-l
            lg:border-[#E1E4E7]

            lg:pl-[44px]

            xl:pl-[55px]
          "
        >
          <motion.h2
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.75,
              ease,
            }}
            className="
              font-primary

              text-[28px]
              font-semibold

              leading-[1.05]

              tracking-[-0.5px]

              text-[#151515]

              sm:text-[31px]
            "
          >
            Upcoming Events
          </motion.h2>

          {/* =================================================
              DYNAMIC UPCOMING LIST
          ================================================= */}

          <div
            className="
              mt-[25px]

              divide-y
              divide-[#E5E8EA]
            "
          >
            <AnimatePresence
              mode="popLayout"
              initial={false}
            >
              {filteredUpcoming.length >
              0 ? (
                filteredUpcoming.map(
                  (
                    event,
                    index
                  ) => (
                    <motion.article
                      layout
                      key={
                        event.id
                      }
                      initial={{
                        opacity: 0,
                        x: 20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -15,
                      }}
                      transition={{
                        duration:
                          0.4,
                        delay:
                          index *
                          0.035,
                        ease,
                      }}
                      whileHover={{
                        x: 4,
                      }}
                      className="
                        group

                        py-[14px]

                        first:pt-0
                      "
                    >
                      <h3
                        className="
                          font-primary

                          text-[13px]
                          font-medium

                          leading-[1.3]

                          text-[#262626]

                          transition-colors
                          duration-300

                          group-hover:text-[#0075FF]

                          sm:text-[14px]
                        "
                      >
                        {
                          event.title
                        }
                      </h3>

                      <div
                        className="
                          mt-[8px]

                          flex
                          flex-col

                          gap-[7px]

                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >
                        <span
                          className="
                            inline-flex

                            w-fit

                            rounded-[3px]

                            bg-[#EEF6FF]

                            px-[7px]
                            py-[4px]

                            font-secondary

                            text-[8px]
                            font-medium

                            leading-none

                            text-[#0075FF]
                          "
                        >
                          {
                            event.location
                          }
                        </span>

                        <span
                          className="
                            whitespace-nowrap

                            font-secondary

                            text-[8px]

                            uppercase

                            text-[#868686]
                          "
                        >
                          {
                            event.dateTime
                          }
                        </span>
                      </div>
                    </motion.article>
                  )
                )
              ) : (
                <motion.div
                  key="no-upcoming-results"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="
                    py-[35px]

                    text-center
                  "
                >
                  <p
                    className="
                      font-secondary

                      text-[11px]

                      text-[#8B8B8B]
                    "
                  >
                    No matching
                    upcoming
                    events.
                  </p>

                  <button
                    type="button"
                    onClick={
                      clearSearch
                    }
                    className="
                      mt-[10px]

                      font-secondary

                      text-[10px]
                      font-medium

                      text-[#0075FF]
                    "
                  >
                    Clear search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </section>
  );
}