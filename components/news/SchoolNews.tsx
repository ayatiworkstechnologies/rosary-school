"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type NewsItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  shortDescription: string;
  content: ReactNode;
};

/* =========================================================
   NEWS DATA
========================================================= */

const newsItems: NewsItem[] = [
  {
    id: 1,

    title:
      "ROSARY MATRICULATION HR. SEC. SCHOOL",

    category:
      "School Updates",

    date:
      "2026-08-25",

    image:
      "/images/news/rosary-news-1.png",

    shortDescription:
      "Rosary School begins the 2026–27 academic year with new leadership and newly elected student leaders.",

    content: (
      <>
        <p>
          Rosary Matriculation Higher Secondary School begins
          the 2026–27 academic year with renewed enthusiasm,
          leadership and commitment towards holistic education.
        </p>

        <p className="mt-4">
          The school community warmly welcomes its new
          Principal and student leaders as they begin another
          important chapter in the institution&apos;s journey.
          Students are encouraged to grow through discipline,
          responsibility, academic excellence and service.
        </p>

        <p className="mt-4">
          Rosary continues to create opportunities that nurture
          confidence, leadership, creativity and values among
          every Rosarian.
        </p>
      </>
    ),
  },

  {
    id: 2,

    title:
      "A New Chapter of Leadership at Rosary",

    category:
      "School News",

    date:
      "2026-08-20",

    image:
      "/images/news/rosary-news-2.png",

    shortDescription:
      "Rosary School welcomes a new chapter of leadership, learning and student development.",

    content: (
      <>
        <p>
          Rosary School continues its legacy of nurturing young
          minds through strong academic values, dedicated
          leadership and meaningful learning experiences.
        </p>

        <p className="mt-4">
          The new academic session brings fresh opportunities
          for students to participate, lead, discover and grow
          together as responsible members of the school
          community.
        </p>
      </>
    ),
  },

  {
    id: 3,

    title:
      "Student Leadership Programme Begins",

    category:
      "Student Updates",

    date:
      "2026-08-18",

    image:
      "/images/news/rosary-news-3.png",

    shortDescription:
      "Student leaders begin their responsibilities with commitment, teamwork and confidence.",

    content: (
      <>
        <p>
          The Student Leadership Programme at Rosary School
          encourages young Rosarians to develop responsibility,
          confidence, teamwork and service.
        </p>

        <p className="mt-4">
          Through active participation in school initiatives,
          students learn the importance of leadership,
          communication and working together towards shared
          goals.
        </p>
      </>
    ),
  },
];

/* =========================================================
   DATE FORMAT
========================================================= */

function formatNewsDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(
      `${date}T00:00:00`
    )
  );
}

/* =========================================================
   ANIMATION
========================================================= */

const ease = [
  0.22,
  1,
  0.36,
  1,
] as const;

const container = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.75,
      ease,
    },
  },
};

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.975,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.8,
      ease,
    },
  },
};

/* =========================================================
   NEWS CARD
========================================================= */

function NewsCard({
  news,
  featured = false,
  onOpen,
}: {
  news: NewsItem;
  featured?: boolean;
  onOpen: (
    news: NewsItem
  ) => void;
}) {
  return (
    <motion.article
      variants={cardReveal}
      className="
        group

        h-full
        w-full
      "
    >
      <motion.div
        whileHover={{
          y: -5,
        }}
        transition={{
          duration: 0.4,
          ease,
        }}
        className={`
          flex
          h-full
          flex-col

          overflow-hidden

          rounded-[12px]

          border
          border-[#E5EDF5]

          bg-white

          transition-all
          duration-500

          hover:border-[#A8D1FF]

          hover:shadow-[0_20px_50px_rgba(0,117,255,0.11)]

          ${
            featured
              ? `
                mx-auto
                max-w-[430px]
              `
              : ""
          }
        `}
      >
        {/* =================================================
            IMAGE
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            onOpen(news)
          }
          className="
            relative

            block
            shrink-0

            aspect-[1.45/1]

            w-full

            overflow-hidden

            bg-[#F2F5F8]
          "
        >
          <Image
            src={
              news.image
            }
            alt={
              news.title
            }
            fill
            sizes="
              (max-width:639px) 100vw,
              (max-width:1023px) 50vw,
              33vw
            "
            className="
              object-cover
              object-center

              transition-transform
              duration-700

              group-hover:scale-[1.035]
            "
          />

          {/* IMAGE OVERLAY */}

          <div
            className="
              pointer-events-none

              absolute
              inset-0

              bg-gradient-to-t

              from-[#07111E]/25
              via-transparent
              to-transparent
            "
          />

          {/* CATEGORY */}

          <span
            className="
              absolute

              left-[14px]
              top-[14px]

              rounded-[5px]

              bg-white/92

              px-[9px]
              py-[5px]

              font-secondary

              text-[9px]
              font-medium

              text-[#0075FF]

              backdrop-blur-md
            "
          >
            {news.category}
          </span>
        </button>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            flex
            flex-1
            flex-col

            px-[16px]

            pb-[18px]
            pt-[15px]

            sm:px-[18px]
            sm:pb-[20px]
          "
        >
          {/* DATE */}

          <div
            className="
              flex

              items-center

              gap-[6px]

              font-secondary

              text-[9px]

              text-[#9BA3AD]
            "
          >
            <CalendarDays
              size={12}
              className="
                text-[#0075FF]
              "
            />

            {formatNewsDate(
              news.date
            )}
          </div>

          {/* TITLE */}

          <h3
            className="
              mt-[10px]

              font-primary

              text-[17px]
              font-semibold

              leading-[1.25]

              tracking-[-0.25px]

              text-[#151A22]

              sm:text-[18px]
            "
          >
            {news.title}
          </h3>

          {/* DESCRIPTION */}

          <p
            className="
              mt-[8px]

              line-clamp-2

              font-secondary

              text-[11px]

              leading-[1.55]

              text-[#818A94]

              sm:text-[11.5px]
            "
          >
            {
              news.shortDescription
            }
          </p>

          {/* READ MORE */}

          <button
            type="button"
            onClick={() =>
              onOpen(news)
            }
            className="
              group/button

              mt-auto

              inline-flex
              w-fit

              items-center

              gap-[15px]

              border-b
              border-[#7AB9FF]

              pb-[5px]
              pt-[15px]

              font-secondary

              text-[10px]
              font-medium

              uppercase

              tracking-[0.25px]

              text-[#0075FF]

              transition-all
              duration-300

              hover:border-[#0075FF]
            "
          >
            Explore More

            <ArrowRight
              size={14}
              className="
                transition-transform
                duration-300

                group-hover/button:translate-x-[4px]
              "
            />
          </button>
        </div>
      </motion.div>
    </motion.article>
  );
}

/* =========================================================
   NEWS MODAL
========================================================= */

function NewsModal({
  news,
  allNews,
  onClose,
  onChange,
}: {
  news: NewsItem | null;
  allNews: NewsItem[];
  onClose: () => void;
  onChange: (
    news: NewsItem
  ) => void;
}) {
  /* =========================================================
     BODY LOCK + ESCAPE
  ========================================================= */

  useEffect(() => {
    if (!news) {
      return;
    }

    const oldOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyboard = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      document.body.style.overflow =
        oldOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    news,
    onClose,
  ]);

  if (!news) {
    return null;
  }

  const currentIndex =
    allNews.findIndex(
      (item) =>
        item.id ===
        news.id
    );

  const hasMultiple =
    allNews.length > 1;

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const previousNews =
    () => {
      const newIndex =
        (currentIndex -
          1 +
          allNews.length) %
        allNews.length;

      onChange(
        allNews[newIndex]
      );
    };

  /* =========================================================
     NEXT
  ========================================================= */

  const nextNews =
    () => {
      const newIndex =
        (currentIndex +
          1) %
        allNews.length;

      onChange(
        allNews[newIndex]
      );
    };

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.25,
        }}
        onMouseDown={
          onClose
        }
        className="
          fixed
          inset-0

          z-[99999]

          flex

          items-center
          justify-center

          overflow-hidden

          bg-[#081320]/75

          p-[8px]

          backdrop-blur-[12px]

          sm:p-[16px]

          md:p-[20px]

          lg:p-[25px]
        "
      >
        {/* =================================================
            MODAL CONTAINER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 25,
            scale: 0.97,
          }}
          transition={{
            duration: 0.48,
            ease,
          }}
          onMouseDown={(
            event
          ) =>
            event.stopPropagation()
          }
          role="dialog"
          aria-modal="true"
          aria-label={
            news.title
          }
          className="
            relative

            grid

            h-[calc(100dvh-16px)]

            w-full
            min-w-0
            max-w-[1040px]

            grid-rows-[auto_minmax(0,1fr)]

            overflow-hidden

            rounded-[14px]

            bg-white

            shadow-[0_40px_130px_rgba(0,0,0,0.34)]

            sm:h-auto
            sm:max-h-[calc(100dvh-32px)]
            sm:rounded-[18px]

            md:max-h-[calc(100dvh-40px)]

            lg:max-h-[calc(100dvh-50px)]
            lg:rounded-[20px]
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="
              relative

              flex
              min-w-0

              items-start
              justify-between

              gap-[10px]

              border-b
              border-[#E9EEF3]

              bg-white

              px-[14px]
              py-[13px]

              sm:gap-[14px]
              sm:px-[20px]
              sm:py-[15px]

              lg:px-[22px]
              lg:py-[17px]
            "
          >
            {/* BLUE TOP LINE */}

            <motion.span
              initial={{
                scaleX: 0,
              }}
              animate={{
                scaleX: 1,
              }}
              transition={{
                duration: 0.7,
                ease,
              }}
              className="
                absolute

                left-0
                top-0

                h-[3px]
                w-[115px]

                origin-left

                rounded-br-full

                bg-[#0075FF]
              "
            />

            {/* HEADER TEXT */}

            <div
              className="
                min-w-0
                flex-1
              "
            >
              {/* CATEGORY + DATE */}

              <div
                className="
                  flex
                  flex-wrap

                  items-center

                  gap-x-[8px]
                  gap-y-[5px]
                "
              >
                <span
                  className="
                    inline-flex

                    shrink-0

                    rounded-[5px]

                    bg-[#EEF6FF]

                    px-[8px]
                    py-[5px]

                    font-secondary

                    text-[8px]
                    font-medium

                    text-[#0075FF]

                    sm:text-[9px]
                  "
                >
                  {news.category}
                </span>

                <span
                  className="
                    font-secondary

                    text-[8px]

                    text-[#919AA5]

                    sm:text-[9px]
                  "
                >
                  {formatNewsDate(
                    news.date
                  )}
                </span>
              </div>

              {/* TITLE

                  IMPORTANT:
                  NO truncate
              */}

              <h3
                className="
                  mt-[7px]

                  max-w-full

                  break-words

                  font-primary

                  text-[16px]
                  font-semibold

                  leading-[1.22]

                  tracking-[-0.25px]

                  text-[#141A22]

                  sm:text-[20px]
                  sm:leading-[1.18]

                  md:text-[22px]

                  lg:text-[24px]
                "
              >
                {news.title}
              </h3>
            </div>

            {/* CLOSE */}

            <motion.button
              type="button"
              onClick={
                onClose
              }
              whileHover={{
                rotate: 90,
              }}
              whileTap={{
                scale: 0.9,
              }}
              aria-label="Close news"
              className="
                flex

                h-[36px]
                w-[36px]

                shrink-0

                items-center
                justify-center

                rounded-[9px]

                border
                border-[#DFE7EF]

                bg-[#F8FAFC]

                text-[#404A55]

                transition-all
                duration-300

                hover:border-[#0075FF]
                hover:bg-[#0075FF]
                hover:text-white

                sm:h-[40px]
                sm:w-[40px]
                sm:rounded-[10px]
              "
            >
              <X
                size={18}
              />
            </motion.button>
          </header>

          {/* =================================================
              BODY SCROLLER

              Main cropping fix
          ================================================= */}

          <div
            className="
              min-h-0
              min-w-0

              w-full

              overflow-x-hidden
              overflow-y-auto

              overscroll-contain

              [scrollbar-color:#A8D2FF_transparent]
              [scrollbar-width:thin]
            "
          >
            {/* =================================================
                IMAGE
            ================================================= */}

            <motion.div
              key={`image-${news.id}`}
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                ease,
              }}
              className="
                relative

                mx-auto

                mt-[14px]

                aspect-[16/10]

                w-[calc(100%-24px)]
                max-w-[820px]

                overflow-hidden

                rounded-[10px]

                border
                border-[#DDEEFF]

                bg-[#F3F6F8]

                sm:mt-[20px]

                sm:aspect-[16/9]

                sm:w-[calc(100%-40px)]

                md:mt-[24px]

                md:w-[calc(100%-48px)]

                lg:rounded-[12px]
              "
            >
              <Image
                src={
                  news.image
                }
                alt={
                  news.title
                }
                fill
                sizes="
                  (max-width:640px) 100vw,
                  (max-width:1024px) 90vw,
                  820px
                "
                className="
                  object-contain
                  object-center
                "
              />
            </motion.div>

            {/* =================================================
                ARTICLE
            ================================================= */}

            <article
              className="
                mx-auto

                w-full
                min-w-0
                max-w-[820px]

                px-[16px]

                pb-[24px]
                pt-[20px]

                sm:px-[22px]
                sm:pb-[30px]
                sm:pt-[24px]

                md:px-[24px]
                md:pb-[34px]
                md:pt-[28px]
              "
            >
              {/* NEWS DETAILS */}

              <div
                className="
                  mb-[16px]

                  flex

                  items-center

                  gap-[9px]

                  sm:mb-[18px]
                "
              >
                <motion.span
                  initial={{
                    scaleX: 0,
                  }}
                  animate={{
                    scaleX: 1,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.12,
                    ease,
                  }}
                  className="
                    h-[2px]
                    w-[32px]

                    shrink-0

                    origin-left

                    bg-[#0075FF]
                  "
                />

                <span
                  className="
                    font-secondary

                    text-[9px]
                    font-medium

                    uppercase

                    tracking-[0.8px]

                    text-[#0075FF]

                    sm:text-[10px]
                  "
                >
                  News Details
                </span>
              </div>

              {/* =================================================
                  FULL CONTENT

                  Prevents paragraph from being cut.
              ================================================= */}

              <motion.div
                key={`content-${news.id}`}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  ease,
                }}
                className="
                  min-w-0
                  max-w-full

                  whitespace-normal

                  break-words

                  font-secondary

                  text-[12px]

                  leading-[1.8]

                  text-[#626B75]

                  [overflow-wrap:anywhere]

                  sm:text-[13px]
                  sm:leading-[1.85]

                  md:text-[13.5px]

                  [&_p]:max-w-full
                  [&_p]:whitespace-normal
                  [&_p]:break-words
                  [&_p]:[overflow-wrap:anywhere]

                  [&_strong]:font-semibold
                  [&_strong]:text-[#171B22]
                "
              >
                {news.content}
              </motion.div>

              {/* =================================================
                  PREVIOUS / NEXT NEWS

                  MOBILE = stacked
                  TABLET/DESKTOP = row
              ================================================= */}

              {hasMultiple && (
                <div
                  className="
                    mt-[26px]

                    flex
                    w-full

                    flex-col

                    gap-[8px]

                    border-t
                    border-[#EDF1F5]

                    pt-[16px]

                    sm:mt-[30px]

                    sm:flex-row
                    sm:items-center
                    sm:justify-between

                    sm:gap-[16px]

                    sm:pt-[18px]
                  "
                >
                  {/* PREVIOUS */}

                  <motion.button
                    type="button"
                    onClick={
                      previousNews
                    }
                    whileHover={{
                      x: -3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="
                      inline-flex

                      min-w-0

                      items-center

                      gap-[7px]

                      self-start

                      rounded-[7px]

                      py-[7px]

                      font-secondary

                      text-[11px]
                      font-medium

                      text-[#697580]

                      transition-colors
                      duration-300

                      hover:text-[#0075FF]

                      sm:text-[12px]
                    "
                  >
                    <ChevronLeft
                      size={16}
                      className="
                        shrink-0
                      "
                    />

                    <span
                      className="
                        whitespace-nowrap
                      "
                    >
                      Previous News
                    </span>
                  </motion.button>

                  {/* NEXT */}

                  <motion.button
                    type="button"
                    onClick={
                      nextNews
                    }
                    whileHover={{
                      x: 3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="
                      inline-flex

                      min-w-0

                      items-center

                      gap-[7px]

                      self-end

                      rounded-[7px]

                      py-[7px]

                      font-secondary

                      text-[11px]
                      font-medium

                      text-[#0075FF]

                      sm:text-[12px]
                    "
                  >
                    <span
                      className="
                        whitespace-nowrap
                      "
                    >
                      Next News
                    </span>

                    <ChevronRight
                      size={16}
                      className="
                        shrink-0
                      "
                    />
                  </motion.button>
                </div>
              )}
            </article>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SchoolNews() {
  const [
    selectedNews,
    setSelectedNews,
  ] =
    useState<NewsItem | null>(
      null
    );

  /* =========================================================
     LATEST FIRST
  ========================================================= */

  const sortedNews =
    useMemo(() => {
      return [
        ...newsItems,
      ].sort(
        (a, b) =>
          new Date(
            `${b.date}T00:00:00`
          ).getTime() -
          new Date(
            `${a.date}T00:00:00`
          ).getTime()
      );
    }, []);

  /* =========================================================
     RESPONSIVE SMART LAYOUT
  ========================================================= */

  const gridClass =
    sortedNews.length === 1
      ? `
        grid-cols-1

        max-w-[430px]
      `
      : sortedNews.length === 2
        ? `
          grid-cols-1

          sm:grid-cols-2

          max-w-[860px]
        `
        : `
          grid-cols-1

          sm:grid-cols-2

          lg:grid-cols-3

          max-w-[1120px]
        `;

  return (
    <>
      <section
        className="
          relative
          isolate

          w-full

          overflow-hidden

          bg-white

          py-[55px]

          sm:py-[68px]

          lg:py-[82px]
        "
      >
        {/* =================================================
            VERY LIGHT GRID
        ================================================= */}

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            -z-20
          "
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(30,72,110,0.035) 1px,
                transparent 1px
              ),

              linear-gradient(
                90deg,
                rgba(30,72,110,0.035) 1px,
                transparent 1px
              )
            `,

            backgroundSize:
              "42px 42px",
          }}
        />

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            -z-10

            bg-white/55
          "
        />

        <div
          className="
            mx-auto

            w-full
            max-w-[1240px]

            px-[16px]

            sm:px-[26px]

            lg:px-[42px]
          "
        >
          {/* =================================================
              HEADING
          ================================================= */}

          <motion.div
            variants={
              container
            }
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
            }}
            className="
              flex

              flex-col
              items-center

              text-center
            "
          >
            <motion.span
              variants={
                fadeUp
              }
              className="
                inline-flex

                items-center

                gap-[5px]

                rounded-[4px]

                bg-[#EEF6FF]

                px-[9px]
                py-[5px]

                font-secondary

                text-[9px]
                font-medium

                text-[#0075FF]

                sm:text-[11px]
              "
            >
              

              News
            </motion.span>

            <motion.h2
              variants={
                fadeUp
              }
              className="
                mt-[14px]

                pt-3

                font-primary

                text-[30px]
                font-semibold

                leading-[1.08]

                tracking-[-0.6px]

                text-[#161A20]

                sm:text-[35px]

                lg:text-[38px]
              "
            >
              Welcome News
            </motion.h2>

            <motion.p
              variants={
                fadeUp
              }
              className="
                mx-auto

                mt-[10px]
                pt-3

                max-w-[590px]

                font-secondary

                text-[11px]

                leading-[1.55]

                text-[#8C939B]

                sm:text-[13px]
              "
            >
              Rosary School begins
              the 2026–27 academic
              year with new
              leadership and
              inspiring stories from
              our school community.
            </motion.p>
          </motion.div>

          {/* =================================================
              NEWS GRID
          ================================================= */}

          <motion.div
            variants={
              container
            }
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.07,
            }}
            className={`
              mx-auto

              mt-[40px]

              grid

              w-full

              items-stretch

              gap-[18px]

              sm:mt-[48px]
              sm:gap-[21px]

              lg:mt-[55px]
              lg:gap-[25px]

              ${gridClass}
            `}
          >
            {sortedNews.map(
              (
                news
              ) => (
                <NewsCard
                  key={
                    news.id
                  }
                  news={
                    news
                  }
                  featured={
                    sortedNews.length ===
                    1
                  }
                  onOpen={
                    setSelectedNews
                  }
                />
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          NEWS MODAL
      ====================================================== */}

      <NewsModal
        news={
          selectedNews
        }
        allNews={
          sortedNews
        }
        onClose={() =>
          setSelectedNews(
            null
          )
        }
        onChange={
          setSelectedNews
        }
      />
    </>
  );
}