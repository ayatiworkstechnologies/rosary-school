"use client";

import { motion } from "framer-motion";

/* =========================================================
   EVENTS DATA
========================================================= */

const events = [
  {
    id: 1,
    day: "15",
    month: "Aug",
    location: "School Campus",
    time: "8 Am",
    title: "Independence Day Celebration",
    description:
      "Flag hoisting, cultural performances and student presentations celebrating India's Independence Day.",
  },
  {
    id: 2,
    day: "22",
    month: "Aug",
    location: "Classrooms",
    time: "8 Am - 1pm",
    title: "Parent–Teacher Meeting",
    description:
      "An opportunity for parents and teachers to discuss students’ academic progress and overall development.",
  },
  {
    id: 3,
    day: "25",
    month: "Sep",
    location: "School Auditorium",
    time: "8 Am",
    title: "Teachers’ Day Celebration",
    description:
      "Students honour their teachers through special performances, activities and appreciation programmes.",
  },
  {
    id: 4,
    day: "27",
    month: "Sep",
    location: "School Auditorium",
    time: "9 Am",
    title: "Inter-House Cultural Fest",
    description:
      "Students showcase their talents through music, dance, drama and creative competitions.",
  },
  {
    id: 5,
    day: "15",
    month: "Oct",
    location: "School Ground",
    time: "8 Am",
    title: "Annual Sports Meet",
    description:
      "A day of athletics, team events and sporting activities celebrating teamwork and sportsmanship.",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function UpcomingEvents() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f2f5f8]
        px-4
        py-14

        sm:px-6
        sm:py-16

        lg:px-8
        lg:py-[72px]
      "
    >
      {/* =====================================================
          WHITE DOTTED BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
        "
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.95) 1.4px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* =====================================================
          SOFT BLUE BLUR - LEFT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-150px]
          top-[110px]
          z-0
          h-[360px]
          w-[360px]
          rounded-full
          bg-[#0075FF]/20
          blur-[120px]

          sm:h-[430px]
          sm:w-[430px]
        "
      />

      {/* =====================================================
          SOFT DARK BLUR - RIGHT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-140px]
          right-[-130px]
          z-0
          h-[350px]
          w-[350px]
          rounded-full
          bg-black/[0.13]
          blur-[130px]

          lg:h-[430px]
          lg:w-[430px]
        "
      />

      {/* =====================================================
          EXTRA WHITE GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[45%]
          z-0
          h-[350px]
          w-[650px]
          -translate-x-1/2
          rounded-full
          bg-white/50
          blur-[120px]
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1120px]
        "
      >
        {/* ===================================================
            HEADING
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center"
        >
          <span
            className="
              font-primary
              text-[11px]
              font-semibold
              text-primary

              sm:text-[12px]
            "
          >
            Events
          </span>

          <h2
            className="
              mt-2
              font-primary
              text-[30px]
              font-semibold
              leading-[1.1]
              tracking-[-0.04em]
              text-[#111827]

              sm:text-[36px]

              lg:text-[40px]
            "
          >
            Upcoming Events
          </h2>

          <p
            className="
              mt-3
              font-secondary
              text-[14px]
              text-[#858585]

              sm:text-[15px]
            "
          >
            Stay Connected With What&apos;s Happening at Rosary
          </p>
        </motion.div>

        {/* ===================================================
            EVENTS
        ==================================================== */}

        <div
          className="
            mt-9
            flex
            flex-col
            gap-[10px]

            sm:mt-10

            lg:mt-11
          "
        >
          {events.map((event, index) => (
            <motion.article
              key={event.id}

              /* ===============================
                 ONE-TIME SCROLL ANIMATION
              =============================== */

              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}

              /* ===============================
                 HOVER MOVEMENT
              =============================== */

              whileHover={{
                y: -3,
              }}

              className="
                group
                relative
                overflow-hidden

                rounded-[16px]

                border
                border-black/[0.05]

                bg-white/45

                transition-[background-color,border-color,box-shadow]
                duration-300
                ease-out

                hover:border-[#0075FF]/60
                hover:bg-white
                hover:shadow-[0_10px_35px_rgba(0,117,255,0.08)]
              "
            >
              {/* ===============================
                  VERY SUBTLE BLUE HOVER GLOW
              =============================== */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-[-70px]
                  top-1/2
                  h-[130px]
                  w-[130px]
                  -translate-y-1/2
                  rounded-full
                  bg-primary/0
                  blur-[60px]

                  transition-all
                  duration-500

                  group-hover:bg-primary/[0.10]
                "
              />

              {/* =================================================
                  DESKTOP/TABLET ROW
              ================================================== */}

              <div
                className="
                  relative
                  z-10
                  grid
                  min-h-[86px]
                  grid-cols-1
                  gap-4
                  px-5
                  py-4

                  sm:grid-cols-[92px_1px_145px_1px_minmax(0,1fr)]
                  sm:items-center
                  sm:gap-5
                  sm:px-6
                  sm:py-[14px]

                  lg:min-h-[94px]
                  lg:grid-cols-[105px_1px_165px_1px_minmax(0,1fr)]
                  lg:gap-6
                  lg:px-7
                  lg:py-[15px]
                "
              >
                {/* =================================================
                    MOBILE TOP AREA
                ================================================== */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-5

                    sm:contents
                  "
                >
                  {/* DATE */}

                  <div
                    className="
                      flex
                      shrink-0
                      items-end
                      gap-2

                      sm:block
                    "
                  >
                    <span
                      className="
                        block
                        font-primary
                        text-[34px]
                        font-semibold
                        leading-none
                        tracking-[-0.05em]
                        text-primary

                        sm:text-[36px]

                        lg:text-[40px]
                      "
                    >
                      {event.day}
                    </span>

                    <span
                      className="
                        block
                        pb-[2px]
                        font-primary
                        text-[16px]
                        font-semibold
                        leading-none
                        text-[#111111]

                        sm:mt-1
                        sm:pb-0

                        lg:text-[17px]
                      "
                    >
                      {event.month}
                    </span>
                  </div>

                  {/* MOBILE LOCATION */}

                  <div
                    className="
                      text-right

                      sm:hidden
                    "
                  >
                    <p
                      className="
                        font-primary
                        text-[13px]
                        font-semibold
                        leading-[1.25]
                        text-[#111111]
                      "
                    >
                      {event.location}
                    </p>

                    <p
                      className="
                        mt-1
                        font-secondary
                        text-[12px]
                        text-[#555555]
                      "
                    >
                      {event.time}
                    </p>
                  </div>
                </div>

                {/* DIVIDER 1 */}

                <div
                  className="
                    hidden
                    h-[52px]
                    w-px
                    bg-black/[0.10]

                    sm:block
                  "
                />

                {/* LOCATION DESKTOP */}

                <div
                  className="
                    hidden
                    min-w-0

                    sm:block
                  "
                >
                  <p
                    className="
                      font-primary
                      text-[13px]
                      font-semibold
                      leading-[1.2]
                      text-[#111111]

                      lg:text-[14px]
                    "
                  >
                    {event.location}
                  </p>

                  <p
                    className="
                      mt-1
                      font-secondary
                      text-[12px]
                      text-[#444444]

                      lg:text-[13px]
                    "
                  >
                    {event.time}
                  </p>
                </div>

                {/* DIVIDER 2 */}

                <div
                  className="
                    hidden
                    h-[52px]
                    w-px
                    bg-black/[0.10]

                    sm:block
                  "
                />

                {/* =================================================
                    EVENT DETAILS
                ================================================== */}

                <div className="min-w-0">
                  <h3
                    className="
                      font-primary
                      text-[17px]
                      font-semibold
                      leading-[1.25]
                      tracking-[-0.02em]
                      text-[#111111]

                      transition-colors
                      duration-300

                      group-hover:text-primary

                      sm:text-[16px]

                      lg:text-[18px]
                    "
                  >
                    {event.title}
                  </h3>

                  <p
                    className="
                      mt-[5px]
                      max-w-[720px]
                      font-secondary
                      text-[12px]
                      leading-[1.45]
                      text-[#8A8A8A]

                      sm:text-[12px]

                      lg:text-[13px]
                    "
                  >
                    {event.description}
                  </p>
                </div>
              </div>

              {/* =================================================
                  BOTTOM HOVER LINE
              ================================================== */}

              <span
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-[1px]
                  w-0
                  -translate-x-1/2
                  bg-primary

                  transition-all
                  duration-500
                  ease-out

                  group-hover:w-[92%]
                "
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}