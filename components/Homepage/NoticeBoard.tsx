"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   NOTICE DATA
   All content is now in ONE ARRAY
========================================================= */

const notices = [
  {
    id: 1,
    featured: true,
    badge: "New",
    date: "12 AUG 2026",
    title: "Quarterly Examination Timetable",
    description:
      "The examination timetable for Classes VI–XII is now available.",
    href: "#",
  },

  {
    id: 2,
    featured: false,
    badge: "New",
    date: "14 AUG 2026",
    title: "Parent–Teacher Meeting",
    description:
      "Parents are invited to attend the upcoming Parent–Teacher Meeting and discuss students’ academic progress.",
    href: "#",
  },

  {
    id: 3,
    featured: false,
    badge: "New",
    date: "18 AUG 2026",
    title: "Holiday Announcement",
    description:
      "Please note the upcoming school holiday and revised working schedule.",
    href: "#",
  },

  {
    id: 4,
    featured: false,
    badge: "Circular",
    date: "22 AUG 2026",
    title: "Academic Calendar Update",
    description:
      "The revised academic calendar for the current term is now available.",
    href: "#",
  },

  {
    id: 5,
    featured: false,
    badge: "Notice",
    date: "28 AUG 2026",
    title: "School Cultural Programme",
    description:
      "Students and parents are invited to our upcoming cultural programme.",
    href: "#",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function NoticeBoard() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [direction, setDirection] =
    useState(1);

  /* =========================================================
     SPLIT ARRAY
  ========================================================= */

  const featuredNotice =
    notices.find(
      (notice) => notice.featured
    ) ?? notices[0];

  const announcements =
    notices.filter(
      (notice) => !notice.featured
    );

  /* =========================================================
     AUTO VERTICAL CAROUSEL
  ========================================================= */

  useEffect(() => {
    if (announcements.length <= 1) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setDirection(1);

        setActiveIndex(
          (current) =>
            (current + 1) %
            announcements.length
        );
      }, 4200);

    return () => {
      window.clearInterval(interval);
    };
  }, [announcements.length]);

  /* =========================================================
     TWO VISIBLE RIGHT-SIDE CARDS
  ========================================================= */

  const visibleNotices =
    useMemo(() => {
      if (!announcements.length) {
        return [];
      }

      const first =
        announcements[
          activeIndex %
            announcements.length
        ];

      const second =
        announcements[
          (activeIndex + 1) %
            announcements.length
        ];

      return [first, second];
    }, [
      activeIndex,
      announcements,
    ]);

  /* =========================================================
     DOT NAVIGATION
  ========================================================= */

  const goToSlide = (
    index: number
  ) => {
    if (index === activeIndex) {
      return;
    }

    setDirection(
      index > activeIndex ? 1 : -1
    );

    setActiveIndex(index);
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#FAFAFA]
        px-4
        py-14

        sm:px-6
        sm:py-16

        lg:px-8
        lg:py-[76px]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE

      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          bg-cover
          bg-center
          bg-no-repeat
          opacity-[0.55]
        "
        style={{
          backgroundImage:
            "url('/images/notice-bg.png')",
        }}
      />

      {/* White overlay */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          bg-white/35
        "
      />

      {/* Blue soft blur */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-120px]
          top-[160px]
          z-0
          h-[300px]
          w-[300px]
          rounded-full
          bg-[#0075FF]/10
          blur-[120px]
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1180px]
        "
      >
        {/* ===================================================
            HEADER
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 22,
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
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
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
            Notice Board
          </span>

          <h2
            className="
              mt-3
              font-primary
              text-[28px]
              font-semibold
              leading-[1.15]
              tracking-[-0.035em]
              text-[#111111]

              sm:text-[34px]

              lg:text-[40px]
            "
          >
            Important School Updates
          </h2>
        </motion.div>

        {/* ===================================================
            CONTENT GRID
        ==================================================== */}

        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-5

            sm:mt-12

            lg:grid-cols-[360px_minmax(0,1fr)]
            lg:items-stretch
            lg:gap-7

            xl:grid-cols-[390px_minmax(0,1fr)]
          "
        >
          {/* =================================================
              FEATURED LEFT NOTICE
          ================================================== */}

          <motion.article
            initial={{
              opacity: 0,
              x: -35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.7,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            whileHover={{
              y: -4,
            }}
            className="
              group
              relative
              flex
              min-h-[330px]
              flex-col
              justify-between
              overflow-hidden
              border
              border-primary
              bg-white
              px-7
              py-7

              shadow-[0_10px_30px_rgba(0,0,0,0.035)]

              transition-shadow
              duration-300

              hover:shadow-[0_18px_45px_rgba(0,117,255,0.10)]

              sm:px-8
              sm:py-8

              lg:min-h-[340px]
            "
          >
            {/* Glow */}

            <div
              className="
                pointer-events-none
                absolute
                left-[-60px]
                top-[-60px]
                h-[150px]
                w-[150px]
                rounded-full
                bg-primary/[0.05]
                blur-[55px]

                transition-all
                duration-500

                group-hover:bg-primary/[0.12]
              "
            />

            <div className="relative z-10">
              {/* Badge */}

              <span
                className="
                  inline-flex
                  bg-[#F3F8FF]
                  px-2
                  py-[4px]
                  font-secondary
                  text-[10px]
                  font-medium
                  text-primary
                "
              >
                {featuredNotice.badge}
              </span>

              {/* Date */}

              <p
                className="
                  mt-6
                  font-primary
                  text-[20px]
                  font-semibold
                  tracking-[-0.02em]
                  text-[#111111]

                  sm:text-[22px]
                "
              >
                {featuredNotice.date}
              </p>

              {/* Title */}

              <h3
                className="
                  mt-5
                  max-w-[270px]
                  font-primary
                  text-[21px]
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.025em]
                  text-[#111111]

                  sm:text-[22px]
                "
              >
                {featuredNotice.title}
              </h3>

              {/* Description */}

              <p
                className="
                  mt-5
                  max-w-[280px]
                  font-secondary
                  text-[13px]
                  leading-[1.45]
                  text-[#929292]

                  sm:text-[14px]
                "
              >
                {
                  featuredNotice.description
                }
              </p>
            </div>

            {/* Download */}

            <div
              className="
                relative
                z-10
                mt-7
              "
            >
              <DownloadLink
                href="#"
              />
            </div>
          </motion.article>

          {/* =================================================
              RIGHT VERTICAL CAROUSEL
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.7,
              delay: 0.12,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              relative
              min-w-0

              lg:pr-10
            "
          >
            {/* Carousel window */}

            <div
              className="
                relative
                min-h-[330px]
                overflow-hidden

                lg:min-h-[340px]
              "
            >
              <AnimatePresence
                initial={false}
                mode="popLayout"
                custom={direction}
              >
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={{
                    enter: (
                      direction: number
                    ) => ({
                      y:
                        direction > 0
                          ? 90
                          : -90,
                      opacity: 0,
                    }),

                    center: {
                      y: 0,
                      opacity: 1,
                    },

                    exit: (
                      direction: number
                    ) => ({
                      y:
                        direction > 0
                          ? -90
                          : 90,
                      opacity: 0,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.62,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="
                    absolute
                    inset-0
                    flex
                    flex-col
                    gap-4
                  "
                >
                  {visibleNotices.map(
                    (
                      notice,
                      index
                    ) => (
                      <AnnouncementCard
                        key={`${activeIndex}-${notice.id}`}
                        notice={
                          notice
                        }
                        index={index}
                      />
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* =================================================
                DESKTOP INDICATOR DOTS
            ================================================== */}

            <div
              className="
                absolute
                right-0
                top-1/2
                hidden
                -translate-y-1/2
                flex-col
                gap-[10px]

                lg:flex
              "
            >
              {announcements.map(
                (
                  notice,
                  index
                ) => {
                  const active =
                    index ===
                    activeIndex;

                  return (
                    <button
                      key={notice.id}
                      type="button"
                      onClick={() =>
                        goToSlide(
                          index
                        )
                      }
                      aria-label={`Show notice ${
                        index + 1
                      }`}
                      className="
                        group
                        flex
                        h-[14px]
                        w-[14px]
                        items-center
                        justify-center
                      "
                    >
                      <span
                        className={`
                          block
                          rounded-full
                          transition-all
                          duration-300

                          ${
                            active
                              ? `
                                h-[9px]
                                w-[9px]
                                bg-primary
                              `
                              : `
                                h-[5px]
                                w-[5px]
                                bg-[#BFC4CA]

                                group-hover:bg-primary/60
                              `
                          }
                        `}
                      />
                    </button>
                  );
                }
              )}
            </div>

            {/* =================================================
                MOBILE INDICATORS
            ================================================== */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-center
                gap-2

                lg:hidden
              "
            >
              {announcements.map(
                (
                  notice,
                  index
                ) => (
                  <button
                    key={notice.id}
                    type="button"
                    onClick={() =>
                      goToSlide(
                        index
                      )
                    }
                    aria-label={`Show notice ${
                      index + 1
                    }`}
                    className={`
                      rounded-full
                      transition-all
                      duration-300

                      ${
                        activeIndex ===
                        index
                          ? `
                            h-[7px]
                            w-[22px]
                            bg-primary
                          `
                          : `
                            h-[7px]
                            w-[7px]
                            bg-[#C5C9CD]
                          `
                      }
                    `}
                  />
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   NOTICE TYPE
========================================================= */

type Notice =
  (typeof notices)[number];

/* =========================================================
   ANNOUNCEMENT CARD
========================================================= */

function AnnouncementCard({
  notice,
  index,
}: {
  notice: Notice;
  index: number;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay:
          index * 0.07,
      }}
      whileHover={{
        x: 4,
      }}
      className="
        group
        relative
        flex
        min-h-[157px]
        flex-1
        overflow-hidden
        bg-white/80
        px-5
        py-5

        shadow-[0_5px_25px_rgba(0,0,0,0.025)]

        backdrop-blur-[2px]

        transition-[background-color,box-shadow]
        duration-300

        hover:bg-white
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]

        sm:px-6

        md:grid
        md:grid-cols-[250px_minmax(0,1fr)]
        md:items-center
        md:gap-8

        lg:min-h-[160px]
      "
    >
      {/* LEFT */}

      <div>
        <span
          className="
            inline-flex
            bg-[#F3F8FF]
            px-2
            py-[3px]
            font-secondary
            text-[10px]
            font-medium
            text-primary
          "
        >
          {notice.badge}
        </span>

        <p
          className="
            mt-5
            font-primary
            text-[18px]
            font-semibold
            tracking-[-0.02em]
            text-[#111111]

            sm:text-[20px]
          "
        >
          {notice.date}
        </p>

        <h3
          className="
            mt-4
            font-primary
            text-[17px]
            font-semibold
            leading-[1.2]
            tracking-[-0.02em]
            text-[#111111]

            transition-colors
            duration-300

            group-hover:text-primary

            sm:text-[18px]
          "
        >
          {notice.title}
        </h3>
      </div>

      {/* RIGHT */}

      <div
        className="
          mt-5

          md:mt-0
        "
      >
        <p
          className="
            max-w-[330px]
            font-secondary
            text-[13px]
            leading-[1.45]
            text-[#8F8F8F]

            sm:text-[14px]
          "
        >
          {notice.description}
        </p>

        <div className="mt-5">
          <DownloadLink
            href="#"
          />
        </div>
      </div>

      {/* Hover line */}

      <span
        className="
          absolute
          bottom-0
          left-0
          h-[1px]
          w-0
          bg-primary

          transition-all
          duration-500

          group-hover:w-full
        "
      />
    </motion.article>
  );
}

/* =========================================================
   DOWNLOAD LINK
   Navigation kept as # for frontend design stage
========================================================= */

function DownloadLink({
  href = "#",
}: {
  href?: string;
}) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        /*
          Remove this preventDefault()
          later when real PDF/API links are added.
        */
        if (href === "#") {
          event.preventDefault();
        }
      }}
      className="
        group/link
        inline-flex
        min-w-[140px]
        items-center
        justify-between
        gap-6
        border-b
        border-primary
        pb-[9px]

        font-primary
        text-[13px]
        font-medium
        text-primary
      "
    >
      <span>
        Download Pdf
      </span>

      <span
        className="
          transition-transform
          duration-300

          group-hover/link:translate-x-2
        "
      >
        <ArrowIcon />
      </span>
    </Link>
  );
}

/* =========================================================
   ARROW
========================================================= */

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-primary"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M14 7L19 12L14 17"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}