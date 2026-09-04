"use client";

import {
  AnimatePresence,
  motion,
  Variants,
} from "framer-motion";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  formatCircularNoticeType,
  formatPublicCircularNoticeDate,
  getPublicCircularNoticePdfUrl,
  getPublicCircularNotices,
  type PublicCircularNoticeItem,
} from "@/services/publicCircularNoticeService";

/* =========================================================
   NOTICE DISPLAY TYPE
========================================================= */

type Notice = {
  id: number;
  featured: boolean;
  badge: string;
  date: string;
  title: string;
  description: string;
  href: string | null;
};


/* =========================================================
   MAP API ITEM -> EXISTING UI DESIGN
========================================================= */

function mapPublicNotice(
  item: PublicCircularNoticeItem
): Notice {
  const formattedDate =
    formatPublicCircularNoticeDate(
      item.notice_date
    );

  return {
    id: item.id,

    featured:
      item.is_featured,

    badge:
      formatCircularNoticeType(
        item.content_type
      ),

    date:
      formattedDate.fullDate,

    title:
      item.title,

    description:
      item.description,

    href:
      getPublicCircularNoticePdfUrl(
        item.pdf_url
      ),
  };
}

/* =========================================================
   SMOOTH ANIMATION SYSTEM
========================================================= */

const smoothEase = [
  0.22,
  1,
  0.36,
  1,
] as const;

/* =========================================================
   WHOLE SECTION
========================================================= */

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.2,
    },
  },
};

/* =========================================================
   HEADER
========================================================= */

const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 1,
      ease: smoothEase,

      delayChildren: 0.1,
      staggerChildren: 0.16,
    },
  },
};

/* =========================================================
   GENERIC TEXT REVEAL
========================================================= */

const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.9,
      ease: smoothEase,
    },
  },
};

/* =========================================================
   SMALL BADGE
========================================================= */

const badgeReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.93,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.7,
      ease: smoothEase,
    },
  },
};

/* =========================================================
   CONTENT GRID
========================================================= */

const gridVariants: Variants = {
  hidden: {},

  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.22,
    },
  },
};

/* =========================================================
   FEATURED CARD
========================================================= */

const featuredCardVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -38,
    y: 18,
    scale: 0.985,
  },

  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,

    transition: {
      duration: 1,
      ease: smoothEase,

      delayChildren: 0.15,
      staggerChildren: 0.15,
    },
  },
};

/* =========================================================
   FEATURED CONTENT
========================================================= */

const featuredContentVariants: Variants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/* =========================================================
   DOWNLOAD
========================================================= */

const downloadReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.8,
      ease: smoothEase,
    },
  },
};

/* =========================================================
   RIGHT PANEL
========================================================= */

const rightPanelVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 38,
    y: 16,
  },

  visible: {
    opacity: 1,
    x: 0,
    y: 0,

    transition: {
      duration: 1,
      ease: smoothEase,
      delay: 0.12,
    },
  },
};

/* =========================================================
   INDICATORS
========================================================= */

const indicatorsVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      delayChildren: 0.45,
      staggerChildren: 0.08,
    },
  },
};

const indicatorVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function NoticeBoard() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [direction, setDirection] =
    useState(1);

  const [
    featuredNoticeData,
    setFeaturedNoticeData,
  ] = useState<Notice | null>(
    null
  );

  const [
    announcements,
    setAnnouncements,
  ] = useState<Notice[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =========================================================
     LOAD PUBLIC CIRCULARS + NOTICES
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadNoticeBoard =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getPublicCircularNotices({
              limit: 5,
            });

          if (!mounted) {
            return;
          }

          setFeaturedNoticeData(
            response.featured
              ? mapPublicNotice(
                  response.featured
                )
              : null
          );

          setAnnouncements(
            response.items.map(
              mapPublicNotice
            )
          );

          setActiveIndex(0);
        } catch (err) {
          console.error(
            "Unable to load public Circulars & Notices:",
            err
          );

          if (mounted) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to load school updates."
            );
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    loadNoticeBoard();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     FEATURED DISPLAY FALLBACK

     We do not automatically promote a normal item to
     featured. The admin's Featured setting remains the
     source of truth.
  ========================================================= */

  const featuredNotice =
    useMemo<Notice>(() => {
      if (featuredNoticeData) {
        return featuredNoticeData;
      }

      if (loading) {
        return {
          id: -1,
          featured: false,
          badge: "Loading",
          date: "",
          title:
            "Loading school updates...",
          description:
            "Please wait while the latest Circulars and Notices are loaded.",
          href: null,
        };
      }

      if (error) {
        return {
          id: -2,
          featured: false,
          badge: "Notice Board",
          date: "",
          title:
            "Unable to load updates",
          description:
            error,
          href: null,
        };
      }

      return {
        id: -3,
        featured: false,
        badge: "Notice Board",
        date: "",
        title:
          "No featured update available",
        description:
          "Published Circulars and Notices will appear here when an item is marked as Featured.",
        href: null,
      };
    }, [
      featuredNoticeData,
      loading,
      error,
    ]);

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
     TWO VISIBLE RIGHT CARDS

     If there is only one latest item, show it once
     instead of duplicating the same card.
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

      if (
        announcements.length === 1
      ) {
        return [first];
      }

      const second =
        announcements[
          (activeIndex + 1) %
            announcements.length
        ];

      return [
        first,
        second,
      ];
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

          opacity-[0.95]
        "
        style={{
          backgroundImage:
            "url('/images/notice-bg.png')",
        }}
      />

      {/* =====================================================
          WHITE OVERLAY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]

          bg-white/85
        "
      />

      {/* =====================================================
          GRID BACKGROUND
          NEW BACKGROUND ADDED
      ====================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          z-[2]

          opacity-[0.95]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(17,17,17,0.065) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(17,17,17,0.065) 1px,
              transparent 1px
            )
          `,

          backgroundSize:
            "32px 32px",
        }}
      />

      {/* =====================================================
          BLUE SOFT BLUR
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 1.5,
          ease: smoothEase,
        }}
        className="
          pointer-events-none

          absolute

          left-[-120px]
          top-[160px]

          z-[3]

          h-[300px]
          w-[300px]

          rounded-full

          bg-[#0075FF]/10

          blur-[120px]
        "
      />

      {/* =====================================================
          SECOND SOFT BLUE GLOW
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 1.6,
          delay: 0.1,
          ease: smoothEase,
        }}
        className="
          pointer-events-none

          absolute

          bottom-[-140px]
          right-[-100px]

          z-[3]

          h-[280px]
          w-[280px]

          rounded-full

          bg-[#0075FF]/7

          blur-[120px]
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.12,
        }}
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
          variants={headerVariants}
          className="
            text-center
          "
        >
          {/* Small heading */}

          <motion.span
            variants={textReveal}
            className="
              font-primary

              text-[11px]
              font-semibold

              text-primary

              sm:text-[12px]
            "
          >
            Notice Board
          </motion.span>

          {/* Main Heading */}

          <motion.h2
            variants={textReveal}
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
          </motion.h2>
        </motion.div>

        {/* ===================================================
            CONTENT GRID
        ==================================================== */}

        <motion.div
          variants={gridVariants}
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
            variants={
              featuredCardVariants
            }
            whileHover={{
              y: -4,

              transition: {
                duration: 0.35,
                ease: smoothEase,
              },
            }}
            className="
              group

              relative

              flex

              min-h-[330px]

              flex-col

              justify-between

              overflow-hidden

              rounded-[10px]

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

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.2,
                delay: 0.3,
                ease: smoothEase,
              }}
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

            {/* =================================================
                FEATURED CONTENT
            ================================================= */}

            <motion.div
              variants={
                featuredContentVariants
              }
              className="
                relative
                z-10
              "
            >
              {/* Badge */}

              <motion.span
                variants={badgeReveal}
                className="
                  inline-flex

                  rounded-[6px]

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
              </motion.span>

              {/* Date */}

              <motion.p
                variants={textReveal}
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
              </motion.p>

              {/* Title */}

              <motion.h3
                variants={textReveal}
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
              </motion.h3>

              {/* Description */}

              <motion.p
                variants={textReveal}
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
              </motion.p>
            </motion.div>

            {/* =================================================
                DOWNLOAD
            ================================================= */}

            <motion.div
              variants={downloadReveal}
              className="
                relative
                z-10

                mt-7
              "
            >
              <DownloadLink
                href={
                  featuredNotice.href
                }
              />
            </motion.div>
          </motion.article>

          {/* =================================================
              RIGHT CAROUSEL
          ================================================== */}

          <motion.div
            variants={
              rightPanelVariants
            }
            className="
              relative

              min-w-0

              lg:pr-10
            "
          >
            {/* =================================================
                CAROUSEL WINDOW
            ================================================= */}

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
                        direction >
                        0
                          ? 55
                          : -55,

                      opacity: 0,

                      scale: 0.985,

                      filter:
                        "blur(3px)",
                    }),

                    center: {
                      y: 0,

                      opacity: 1,

                      scale: 1,

                      filter:
                        "blur(0px)",
                    },

                    exit: (
                      direction: number
                    ) => ({
                      y:
                        direction >
                        0
                          ? -55
                          : 55,

                      opacity: 0,

                      scale: 0.985,

                      filter:
                        "blur(3px)",
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.8,
                    ease: smoothEase,
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
                        index={
                          index
                        }
                      />
                    )
                  )}

                  {visibleNotices.length ===
                    0 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 18,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.7,
                        ease: smoothEase,
                      }}
                      className="
                        flex
                        min-h-[157px]
                        flex-1
                        items-center
                        justify-center

                        rounded-[10px]

                        bg-white/85

                        px-6
                        py-8

                        text-center

                        shadow-[0_5px_25px_rgba(0,0,0,0.025)]

                        backdrop-blur-[4px]
                      "
                    >
                      <div>
                        <p
                          className="
                            font-primary
                            text-[16px]
                            font-semibold
                            text-[#111111]
                          "
                        >
                          {loading
                            ? "Loading latest updates..."
                            : error
                            ? "Unable to load latest updates"
                            : "No latest updates available"}
                        </p>

                        <p
                          className="
                            mt-2
                            font-secondary
                            text-[12px]
                            leading-[1.5]
                            text-[#8F8F8F]
                          "
                        >
                          {loading
                            ? "Please wait a moment."
                            : error
                            ? error
                            : "Published Circulars and Notices will appear here."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* =================================================
                DESKTOP DOTS
            ================================================== */}

            <motion.div
              variants={
                indicatorsVariants
              }
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
                    <motion.button
                      variants={
                        indicatorVariants
                      }
                      key={
                        notice.id
                      }
                      type="button"
                      onClick={() =>
                        goToSlide(
                          index
                        )
                      }
                      aria-label={`Show notice ${
                        index + 1
                      }`}
                      whileHover={{
                        scale: 1.15,
                      }}
                      whileTap={{
                        scale: 0.9,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
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
                          duration-500

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
                    </motion.button>
                  );
                }
              )}
            </motion.div>

            {/* =================================================
                MOBILE DOTS
            ================================================== */}

            <motion.div
              variants={
                indicatorsVariants
              }
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
                  <motion.button
                    variants={
                      indicatorVariants
                    }
                    key={
                      notice.id
                    }
                    type="button"
                    onClick={() =>
                      goToSlide(
                        index
                      )
                    }
                    aria-label={`Show notice ${
                      index + 1
                    }`}
                    whileTap={{
                      scale: 0.9,
                    }}
                    className={`
                      rounded-full

                      transition-all
                      duration-500

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
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

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
        y: 26,
        scale: 0.985,
        filter:
          "blur(3px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter:
          "blur(0px)",
      }}
      transition={{
        duration: 0.78,
        delay:
          index * 0.13,
        ease: smoothEase,
      }}
      whileHover={{
        x: 4,

        transition: {
          duration: 0.35,
          ease: smoothEase,
        },
      }}
      className="
        group

        relative

        flex

        min-h-[157px]
        flex-1

        overflow-hidden

        rounded-[10px]

        bg-white/85

        px-5
        py-5

        shadow-[0_5px_25px_rgba(0,0,0,0.025)]

        backdrop-blur-[4px]

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

      <motion.div
        initial={{
          opacity: 0,
          x: -16,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.72,
          delay:
            0.1 +
            index * 0.12,
          ease: smoothEase,
        }}
      >
        {/* Badge */}

        <motion.span
          initial={{
            opacity: 0,
            y: 8,
            scale: 0.94,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.62,
            delay:
              0.18 +
              index * 0.12,
            ease: smoothEase,
          }}
          className="
            inline-flex

            rounded-[6px]

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
        </motion.span>

        {/* Date */}

        <motion.p
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay:
              0.25 +
              index * 0.12,
            ease: smoothEase,
          }}
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
        </motion.p>

        {/* Title */}

        <motion.h3
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.72,
            delay:
              0.33 +
              index * 0.12,
            ease: smoothEase,
          }}
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
        </motion.h3>
      </motion.div>

      {/* RIGHT */}

      <motion.div
        initial={{
          opacity: 0,
          x: 16,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.75,
          delay:
            0.28 +
            index * 0.13,
          ease: smoothEase,
        }}
        className="
          mt-5

          md:mt-0
        "
      >
        {/* Description */}

        <motion.p
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.72,
            delay:
              0.36 +
              index * 0.13,
            ease: smoothEase,
          }}
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
        </motion.p>

        {/* Download */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay:
              0.44 +
              index * 0.13,
            ease: smoothEase,
          }}
          className="
            mt-5
          "
        >
          <DownloadLink
            href={
              notice.href
            }
          />
        </motion.div>
      </motion.div>

      {/* Hover Line */}

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
========================================================= */

function DownloadLink({
  href,
}: {
  href?: string | null;
}) {
  if (!href) {
    return (
      <div
        className="
          inline-flex

          min-w-[140px]

          items-center
          justify-between

          gap-6

          border-b
          border-[#C8D8E8]

          pb-[9px]

          font-primary

          text-[13px]
          font-medium

          text-[#8CA4BA]
        "
      >
        <span>
          PDF Not Available
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="
        w-fit
      "
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
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

        <motion.span
          variants={{
            rest: {
              x: 0,
            },

            hover: {
              x: 6,
            },
          }}
          transition={{
            duration: 0.35,
            ease: smoothEase,
          }}
          className="
            flex
            items-center
            justify-center
          "
        >
          <ArrowIcon />
        </motion.span>
      </a>
    </motion.div>
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
      className="
        text-primary
      "
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