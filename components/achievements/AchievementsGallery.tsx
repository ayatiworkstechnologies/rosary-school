"use client";

import Image from "next/image";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Images,
  Play,
  Video,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  MouseEvent as ReactMouseEvent,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type GalleryTab = "photos" | "videos";

type PhotoAchievement = {
  id: number;
  year: number;

  /* YYYY-MM-DD */
  date: string;

  title: string;
  category: string;
  images: string[];
};

type VideoAchievement = {
  id: number;
  year: number;

  /* YYYY-MM-DD */
  date: string;

  title: string;
  category: string;

  /*
   * Poster image shown on the gallery card.
   */
  poster: string;

  /*
   * Supports:
   *
   * YouTube:
   * https://youtu.be/VIDEO_ID
   * https://www.youtube.com/watch?v=VIDEO_ID
   * https://youtube.com/embed/VIDEO_ID
   * https://youtube.com/shorts/VIDEO_ID
   *
   * Local uploaded video:
   * /videos/achievements/video.mp4
   *
   * Remote direct file:
   * https://example.com/video.mp4
   */
  video: string;
};

/* =========================================================
   PHOTO DATA
========================================================= */

const photoAchievements: PhotoAchievement[] = [
  /* =======================================================
     2026
  ======================================================= */

  {
    id: 1,
    year: 2026,
    date: "2026-08-24",

    title: "Sports Excellence 2026",
    category: "Sports Achievement",

    images: [
      "/images/achievements/2026/ag-1.png",
      "/images/achievements/2026/ag-2.png",
    ],
  },

  {
    id: 2,
    year: 2026,
    date: "2026-07-18",

    title: "Academic Excellence Awards",
    category: "Academic Achievement",

    images: [
      "/images/achievements/2026/ag-2.png",
      "/images/achievements/2026/ag-3.png",
    ],
  },

  {
    id: 3,
    year: 2026,
    date: "2026-06-10",

    title: "Inter School Competition Winners",
    category: "Competition",

    images: [
      "/images/achievements/2026/ag-3.png",
      "/images/achievements/2026/ag-1.png",
    ],
  },

  /* =======================================================
     2025
  ======================================================= */

  {
    id: 4,
    year: 2025,
    date: "2025-11-21",

    title: "Sports Achievements 2025",
    category: "Sports Achievement",

    images: [
      "/images/achievements/2025/sports-01.png",
      "/images/achievements/2025/sports-02.png",
    ],
  },


];

/* =========================================================
   VIDEO DATA

   IMPORTANT:
   You can mix YouTube + uploaded/local video.
========================================================= */

const videoAchievements: VideoAchievement[] = [
  /* =======================================================
     2026 - YOUTUBE EXAMPLE
  ======================================================= */

  {
    id: 1,
    year: 2026,
    date: "2026-08-20",

    title: "Achievement Highlights 2026",
    category: "School Achievements",

    poster:
      "/images/achievements/2026/ag-1.png",

    /*
     * YouTube URL.
     */
    video:
      "https://youtu.be/zDz9o57vGXs",
  },

  /* =======================================================
     2025 - LOCAL UPLOAD EXAMPLE
  ======================================================= */

  {
    id: 2,
    year: 2025,
    date: "2025-10-16",

    title: "Achievement Highlights 2025",
    category: "School Achievements",

    poster:
      "/images/achievements/2025/sports-01.png",

    /*
     * Put the file inside:
     *
     * public/
     * └── videos/
     *     └── achievements/
     *         └── achievement-2025.mp4
     */
    video:
      "/videos/achievements/achievement-2025.mp4",
  },
];

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const headerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.11,
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
      duration: 0.8,
      ease,
    },
  },
};

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 42,
    scale: 0.965,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.85,
      ease,
    },
  },
};

/* =========================================================
   DATE HELPERS
========================================================= */

function sortNewestFirst<
  T extends {
    date: string;
  },
>(items: T[]) {
  return [...items].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
}

/* =========================================================
   VIDEO HELPERS

   Automatically determines whether video is:
   - YouTube
   - local / uploaded / direct MP4
========================================================= */

function getYouTubeVideoId(
  url: string
): string | null {
  try {
    const parsed = new URL(url);

    const hostname =
      parsed.hostname.replace(
        "www.",
        ""
      );

    /* =====================================================
       youtu.be/VIDEO_ID
    ====================================================== */

    if (
      hostname === "youtu.be"
    ) {
      const id =
        parsed.pathname
          .split("/")
          .filter(Boolean)[0];

      return id || null;
    }

    /* =====================================================
       youtube.com
    ====================================================== */

    if (
      hostname === "youtube.com" ||
      hostname ===
        "m.youtube.com"
    ) {
      /* watch?v= */

      if (
        parsed.pathname ===
        "/watch"
      ) {
        return (
          parsed.searchParams.get(
            "v"
          ) || null
        );
      }

      /* embed/ */

      if (
        parsed.pathname.startsWith(
          "/embed/"
        )
      ) {
        return (
          parsed.pathname
            .split("/embed/")[1]
            ?.split("/")[0] ||
          null
        );
      }

      /* shorts/ */

      if (
        parsed.pathname.startsWith(
          "/shorts/"
        )
      ) {
        return (
          parsed.pathname
            .split("/shorts/")[1]
            ?.split("/")[0] ||
          null
        );
      }

      /* live/ */

      if (
        parsed.pathname.startsWith(
          "/live/"
        )
      ) {
        return (
          parsed.pathname
            .split("/live/")[1]
            ?.split("/")[0] ||
          null
        );
      }
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubeEmbedUrl(
  url: string
) {
  const id =
    getYouTubeVideoId(url);

  if (!id) {
    return null;
  }

  return (
    `https://www.youtube.com/embed/${id}` +
    "?autoplay=1" +
    "&rel=0" +
    "&modestbranding=1" +
    "&playsinline=1"
  );
}

function isYouTubeVideo(
  url: string
) {
  return Boolean(
    getYouTubeVideoId(url)
  );
}

/* =========================================================
   AVAILABLE YEARS

   Automatically latest year first.
========================================================= */

const availableYears =
  Array.from(
    new Set([
      ...photoAchievements.map(
        (item) => item.year
      ),

      ...videoAchievements.map(
        (item) => item.year
      ),
    ])
  ).sort(
    (a, b) => b - a
  );

/* =========================================================
   DYNAMIC GRID

   1 item → centered
   2 items → centered
   3+ → 3 columns desktop
========================================================= */

function getGalleryGridClass(
  count: number
) {
  if (count === 1) {
    return `
      mx-auto

      grid
      w-full
      max-w-[430px]

      grid-cols-1

      gap-[20px]
    `;
  }

  if (count === 2) {
    return `
      mx-auto

      grid
      w-full
      max-w-[880px]

      grid-cols-1

      gap-[20px]

      sm:grid-cols-2

      lg:gap-[24px]
    `;
  }

  return `
    mx-auto

    grid
    w-full
    max-w-[1180px]

    grid-cols-1

    gap-[20px]

    sm:grid-cols-2

    lg:grid-cols-3

    lg:gap-[24px]
  `;
}

/* =========================================================
   PHOTO CARD
========================================================= */

function PhotoCard({
  item,
  onOpen,
}: {
  item: PhotoAchievement;

  onOpen: (
    item: PhotoAchievement,
    imageIndex: number
  ) => void;
}) {
  const [
    activeImage,
    setActiveImage,
  ] = useState(0);

  const hasMultiple =
    item.images.length > 1;

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previousImage = (
    event: ReactMouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    setActiveImage(
      (current) =>
        current === 0
          ? item.images.length -
            1
          : current - 1
    );
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const nextImage = (
    event: ReactMouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    setActiveImage(
      (current) =>
        (current + 1) %
        item.images.length
    );
  };

  return (
    <motion.article
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.18,
        margin:
          "0px 0px -40px 0px",
      }}
      className="
        group
        w-full
      "
    >
      <motion.div
        whileHover={{
          y: -6,
        }}
        transition={{
          duration: 0.35,
          ease,
        }}
        className="
          relative

          aspect-[1.45/1]

          w-full

          overflow-hidden

          rounded-[14px]

          bg-[#EDF2F6]

          shadow-[0_14px_36px_rgba(20,47,78,0.10)]

          transition-[box-shadow]
          duration-500

          hover:shadow-[0_22px_50px_rgba(0,117,255,0.16)]
        "
      >
        {/* =================================================
            IMAGE
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            onOpen(
              item,
              activeImage
            )
          }
          aria-label={`Open ${item.title}`}
          className="
            absolute
            inset-0

            z-[1]

            block

            h-full
            w-full
          "
        >
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            <motion.div
              key={
                item.images[
                  activeImage
                ]
              }
              initial={{
                opacity: 0,
                scale: 1.04,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.45,
                ease,
              }}
              className="
                absolute
                inset-0
              "
            >
              <Image
                src={
                  item.images[
                    activeImage
                  ]
                }
                alt={item.title}
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

                  group-hover:scale-[1.04]
                "
              />
            </motion.div>
          </AnimatePresence>
        </button>

        {/* =================================================
            OVERLAY
        ================================================= */}

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            z-[2]

            bg-gradient-to-t

            from-black/85
            via-black/10
            to-transparent
          "
        />

        {/* =================================================
            COUNT
        ================================================= */}

        {hasMultiple && (
          <div
            className="
              absolute

              right-[13px]
              top-[13px]

              z-30

              inline-flex

              items-center

              gap-[5px]

              rounded-full

              bg-black/45

              px-[9px]
              py-[5px]

              font-secondary

              text-[10px]
              font-medium

              !text-white

              backdrop-blur-md
            "
          >
            <Images size={12} />

            {item.images.length}
          </div>
        )}

        {/* =================================================
            CAROUSEL
        ================================================= */}

        {hasMultiple && (
          <>
            <motion.button
              type="button"
              onClick={
                previousImage
              }
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.92,
              }}
              aria-label="Previous photo"
              className="
                absolute

                left-[12px]
                top-1/2

                z-30

                flex

                h-[38px]
                w-[38px]

                -translate-y-1/2

                items-center
                justify-center

                rounded-full

                border
                border-white/15

                bg-black/40

                !text-white

                opacity-0

                backdrop-blur-md

                transition-opacity
                duration-300

                group-hover:opacity-100

                max-md:opacity-100
              "
            >
              <ChevronLeft
                size={19}
              />
            </motion.button>

            <motion.button
              type="button"
              onClick={
                nextImage
              }
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.92,
              }}
              aria-label="Next photo"
              className="
                absolute

                right-[12px]
                top-1/2

                z-30

                flex

                h-[38px]
                w-[38px]

                -translate-y-1/2

                items-center
                justify-center

                rounded-full

                bg-[#0075FF]

                !text-white

                opacity-0

                shadow-[0_8px_22px_rgba(0,117,255,0.24)]

                transition-opacity
                duration-300

                group-hover:opacity-100

                max-md:opacity-100
              "
            >
              <ChevronRight
                size={19}
              />
            </motion.button>
          </>
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            pointer-events-none

            absolute

            bottom-0
            left-0
            right-0

            z-20

            px-[17px]
            pb-[16px]
            pt-[60px]
          "
        >
          <div
            className="
              flex
              flex-wrap

              items-center

              gap-x-[9px]
              gap-y-[3px]
            "
          >
            <span
              className="
                font-secondary

                text-[9px]
                font-medium

                uppercase

                tracking-[0.7px]

                !text-white/75
              "
            >
              {item.category}
            </span>

            <span
              className="
                h-[3px]
                w-[3px]

                rounded-full

                bg-white/45
              "
            />

            <span
              className="
                font-secondary

                text-[9px]

                !text-white/65
              "
            >
              {formatDate(
                item.date
              )}
            </span>
          </div>

          <h3
            className="
              mt-[5px]

              font-primary

              text-[16px]
              font-semibold

              leading-[1.25]

              !text-white

              sm:text-[17px]
            "
            style={{
              color: "#ffffff",
            }}
          >
            {item.title}
          </h3>
        </div>
      </motion.div>
    </motion.article>
  );
}

/* =========================================================
   VIDEO CARD
========================================================= */

function VideoCard({
  item,
  onOpen,
}: {
  item: VideoAchievement;

  onOpen: (
    item: VideoAchievement
  ) => void;
}) {
  const youtube =
    isYouTubeVideo(
      item.video
    );

  return (
    <motion.article
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.18,
        margin:
          "0px 0px -40px 0px",
      }}
      className="
        group
        w-full
      "
    >
      <motion.button
        type="button"
        onClick={() =>
          onOpen(item)
        }
        whileHover={{
          y: -6,
        }}
        whileTap={{
          scale: 0.99,
        }}
        transition={{
          duration: 0.35,
          ease,
        }}
        className="
          relative

          block

          aspect-[1.45/1]

          w-full

          overflow-hidden

          rounded-[14px]

          bg-[#EDF2F6]

          text-left

          shadow-[0_14px_36px_rgba(20,47,78,0.10)]

          transition-[box-shadow]
          duration-500

          hover:shadow-[0_22px_50px_rgba(0,117,255,0.16)]
        "
      >
        {/* POSTER */}

        <Image
          src={item.poster}
          alt={item.title}
          fill
          sizes="
            (max-width:639px) 100vw,
            (max-width:1023px) 50vw,
            430px
          "
          className="
            object-cover
            object-center

            transition-transform
            duration-700

            group-hover:scale-[1.045]
          "
        />

        {/* OVERLAY */}

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-t

            from-black/85
            via-black/10
            to-transparent
          "
        />

        {/* SOURCE TYPE */}

        <div
          className="
            absolute

            right-[12px]
            top-[12px]

            z-20

            rounded-full

            bg-black/45

            px-[9px]
            py-[5px]

            font-secondary

            text-[9px]
            font-medium

            uppercase

            tracking-[0.4px]

            !text-white

            backdrop-blur-md
          "
        >
          {youtube
            ? "YouTube"
            : "Video"}
        </div>

        {/* PLAY */}

        <motion.div
          whileHover={{
            scale: 1.08,
          }}
          className="
            absolute

            left-1/2
            top-1/2

            z-20

            flex

            h-[58px]
            w-[58px]

            -translate-x-1/2
            -translate-y-1/2

            items-center
            justify-center

            rounded-full

            border
            border-white/30

            bg-[#0075FF]

            !text-white

            shadow-[0_12px_30px_rgba(0,117,255,0.30)]
          "
        >
          <Play
            size={22}
            fill="white"
            className="
              translate-x-[1px]
            "
          />
        </motion.div>

        {/* DETAILS */}

        <div
          className="
            absolute

            bottom-0
            left-0
            right-0

            z-20

            px-[17px]
            pb-[16px]
            pt-[60px]
          "
        >
          <div
            className="
              flex
              flex-wrap

              items-center

              gap-x-[9px]
              gap-y-[3px]
            "
          >
            <span
              className="
                font-secondary

                text-[9px]
                font-medium

                uppercase

                tracking-[0.7px]

                !text-white/75
              "
            >
              {item.category}
            </span>

            <span
              className="
                h-[3px]
                w-[3px]

                rounded-full

                bg-white/45
              "
            />

            <span
              className="
                font-secondary

                text-[9px]

                !text-white/65
              "
            >
              {formatDate(
                item.date
              )}
            </span>
          </div>

          <h3
            className="
              mt-[5px]

              font-primary

              text-[16px]
              font-semibold

              leading-[1.25]

              !text-white

              sm:text-[17px]
            "
            style={{
              color: "#ffffff",
            }}
          >
            {item.title}
          </h3>
        </div>
      </motion.button>
    </motion.article>
  );
}

/* =========================================================
   PHOTO VIEWER
========================================================= */

function PhotoViewer({
  item,
  initialIndex,
  onClose,
}: {
  item:
    | PhotoAchievement
    | null;

  initialIndex: number;

  onClose: () => void;
}) {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(
    initialIndex
  );

  useEffect(() => {
    setActiveIndex(
      initialIndex
    );
  }, [
    item,
    initialIndex,
  ]);

  useEffect(() => {
    if (!item) {
      return;
    }

    const oldOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeydown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        setActiveIndex(
          (current) =>
            current === 0
              ? item.images
                  .length - 1
              : current - 1
        );
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        setActiveIndex(
          (current) =>
            (current + 1) %
            item.images.length
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeydown
    );

    return () => {
      document.body.style.overflow =
        oldOverflow;

      window.removeEventListener(
        "keydown",
        handleKeydown
      );
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const previous = () => {
    setActiveIndex(
      (current) =>
        current === 0
          ? item.images
              .length - 1
          : current - 1
    );
  };

  const next = () => {
    setActiveIndex(
      (current) =>
        (current + 1) %
        item.images.length
    );
  };

  return (
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

        bg-[#07111F]/82

        p-[10px]

        backdrop-blur-[12px]

        sm:p-[22px]
      "
    >
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
          y: 20,
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
        className="
          flex

          max-h-[92dvh]

          w-full
          max-w-[1060px]

          flex-col

          overflow-hidden

          rounded-[18px]

          bg-white

          shadow-[0_35px_100px_rgba(0,0,0,0.35)]
        "
      >
        {/* HEADER */}

        <div
          className="
            flex

            shrink-0

            items-start
            justify-between

            gap-[18px]

            border-b
            border-[#E6ECF2]

            px-[18px]
            py-[14px]

            sm:px-[24px]
          "
        >
          <div>
            <div
              className="
                flex
                flex-wrap

                items-center

                gap-[7px]
              "
            >
              <span
                className="
                  font-secondary

                  text-[9px]
                  font-medium

                  uppercase

                  tracking-[0.7px]

                  text-[#0075FF]
                "
              >
                {item.category}
              </span>

              <span
                className="
                  text-[#CBD3DC]
                "
              >
                •
              </span>

              <span
                className="
                  font-secondary

                  text-[9px]

                  text-[#8B949F]
                "
              >
                {formatDate(
                  item.date
                )}
              </span>
            </div>

            <h3
              className="
                mt-[5px]

                font-primary

                text-[18px]
                font-semibold

                leading-[1.2]

                text-[#121721]

                sm:text-[22px]
              "
            >
              {item.title}
            </h3>
          </div>

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
            aria-label="Close photo viewer"
            className="
              flex

              h-[40px]
              w-[40px]

              shrink-0

              items-center
              justify-center

              rounded-full

              border
              border-[#DFE7EF]

              bg-white

              text-[#56606B]

              transition-colors
              duration-300

              hover:border-[#0075FF]
              hover:bg-[#0075FF]
              hover:text-white
            "
          >
            <X size={19} />
          </motion.button>
        </div>

        {/* IMAGE AREA */}

        <div
          className="
            relative

            flex

            min-h-0
            flex-1

            items-center
            justify-center

            overflow-hidden

            bg-[#F4F7FA]

            p-[10px]

            sm:p-[20px]
          "
        >
          <div
            className="
              relative

              aspect-[16/10]

              w-full
              max-w-[860px]

              overflow-hidden

              rounded-[10px]

              bg-black
            "
          >
            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key={
                  item.images[
                    activeIndex
                  ]
                }
                initial={{
                  opacity: 0,
                  x: 24,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -24,
                }}
                transition={{
                  duration: 0.4,
                  ease,
                }}
                className="
                  absolute
                  inset-0
                "
              >
                <Image
                  src={
                    item.images[
                      activeIndex
                    ]
                  }
                  alt={item.title}
                  fill
                  sizes="90vw"
                  className="
                    object-contain
                  "
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ARROWS */}

          {item.images.length >
            1 && (
            <>
              <motion.button
                type="button"
                onClick={
                  previous
                }
                whileHover={{
                  x: -2,
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                aria-label="Previous image"
                className="
                  absolute

                  left-[14px]
                  top-1/2

                  flex

                  h-[44px]
                  w-[44px]

                  -translate-y-1/2

                  items-center
                  justify-center

                  rounded-full

                  bg-white

                  text-[#0075FF]

                  shadow-[0_10px_25px_rgba(0,0,0,0.13)]

                  sm:left-[28px]
                "
              >
                <ChevronLeft
                  size={21}
                />
              </motion.button>

              <motion.button
                type="button"
                onClick={
                  next
                }
                whileHover={{
                  x: 2,
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                aria-label="Next image"
                className="
                  absolute

                  right-[14px]
                  top-1/2

                  flex

                  h-[44px]
                  w-[44px]

                  -translate-y-1/2

                  items-center
                  justify-center

                  rounded-full

                  bg-[#0075FF]

                  text-white

                  shadow-[0_10px_26px_rgba(0,117,255,0.24)]

                  sm:right-[28px]
                "
              >
                <ChevronRight
                  size={21}
                />
              </motion.button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}

        {item.images.length >
          1 && (
          <div
            className="
              flex

              shrink-0

              gap-[8px]

              overflow-x-auto

              border-t
              border-[#E6ECF2]

              px-[16px]
              py-[11px]

              [scrollbar-width:thin]

              sm:px-[22px]
            "
          >
            {item.images.map(
              (
                image,
                imageIndex
              ) => (
                <motion.button
                  key={`${item.id}-${imageIndex}`}
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      imageIndex
                    )
                  }
                  whileHover={{
                    y: -2,
                  }}
                  className={`
                    relative

                    h-[58px]
                    w-[82px]

                    shrink-0

                    overflow-hidden

                    rounded-[7px]

                    border-2

                    transition-all
                    duration-300

                    ${
                      imageIndex ===
                      activeIndex
                        ? "border-[#0075FF] opacity-100"
                        : "border-transparent opacity-45 hover:opacity-100"
                    }
                  `}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="82px"
                    className="
                      object-cover
                    "
                  />
                </motion.button>
              )
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   VIDEO VIEWER

   Supports:
   1. YouTube
   2. Local uploaded MP4/WebM
   3. Remote direct video files
========================================================= */

function VideoViewer({
  item,
  onClose,
}: {
  item:
    | VideoAchievement
    | null;

  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) {
      return;
    }

    const oldOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeydown = (
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
      handleKeydown
    );

    return () => {
      document.body.style.overflow =
        oldOverflow;

      window.removeEventListener(
        "keydown",
        handleKeydown
      );
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const youtubeEmbedUrl =
    getYouTubeEmbedUrl(
      item.video
    );

  const isYouTube =
    Boolean(
      youtubeEmbedUrl
    );

  return (
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
        duration: 0.3,
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

        overflow-y-auto

        bg-[#07111F]/85

        p-[10px]

        backdrop-blur-[12px]

        sm:p-[24px]
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 30,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.97,
          y: 15,
        }}
        transition={{
          duration: 0.45,
          ease,
        }}
        onMouseDown={(
          event
        ) =>
          event.stopPropagation()
        }
        className="
          my-auto

          w-full
          max-w-[950px]

          overflow-hidden

          rounded-[18px]

          bg-white

          shadow-[0_35px_100px_rgba(0,0,0,0.38)]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex

            items-start
            justify-between

            gap-[18px]

            border-b
            border-[#E6ECF2]

            px-[16px]
            py-[14px]

            sm:px-[22px]
            sm:py-[16px]
          "
        >
          <div
            className="
              min-w-0
              flex-1
            "
          >
            <div
              className="
                flex
                flex-wrap

                items-center

                gap-[7px]
              "
            >
              <span
                className="
                  font-secondary

                  text-[9px]
                  font-medium

                  uppercase

                  tracking-[0.7px]

                  text-[#0075FF]
                "
              >
                {item.category}
              </span>

              <span
                className="
                  text-[#CBD3DC]
                "
              >
                •
              </span>

              <span
                className="
                  font-secondary

                  text-[9px]

                  text-[#8B949F]
                "
              >
                {formatDate(
                  item.date
                )}
              </span>
            </div>

            <h3
              className="
                mt-[5px]

                font-primary

                text-[17px]
                font-semibold

                leading-[1.25]

                text-[#141922]

                sm:text-[21px]
              "
            >
              {item.title}
            </h3>
          </div>

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
            aria-label="Close video"
            className="
              flex

              h-[40px]
              w-[40px]

              shrink-0

              items-center
              justify-center

              rounded-full

              border
              border-[#E2E8EF]

              bg-[#F3F6F9]

              text-[#47525E]

              transition-colors
              duration-300

              hover:border-[#0075FF]
              hover:bg-[#0075FF]
              hover:text-white
            "
          >
            <X size={19} />
          </motion.button>
        </div>

        {/* =================================================
            PLAYER
        ================================================= */}

        <div
          className="
            relative

            w-full

            overflow-hidden

            bg-black
          "
        >
          <div
            className="
              relative

              aspect-video

              w-full
            "
          >
            {/* =============================================
                YOUTUBE PLAYER
            ============================================== */}

            {isYouTube &&
            youtubeEmbedUrl ? (
              <iframe
                src={
                  youtubeEmbedUrl
                }
                title={
                  item.title
                }
                className="
                  absolute
                  inset-0

                  h-full
                  w-full

                  border-0
                "
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                  web-share
                "
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              /* ===========================================
                  LOCAL / UPLOADED / DIRECT VIDEO
              ============================================ */

              <video
                src={
                  item.video
                }
                poster={
                  item.poster
                }
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="
                  absolute
                  inset-0

                  h-full
                  w-full

                  bg-black

                  object-contain
                "
              >
                Your browser does
                not support video
                playback.
              </video>
            )}
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            flex

            items-center
            justify-between

            gap-[15px]

            border-t
            border-[#E6ECF2]

            bg-[#FAFCFE]

            px-[16px]
            py-[11px]

            sm:px-[22px]
          "
        >
          <div
            className="
              flex

              min-w-0

              items-center

              gap-[9px]
            "
          >
            <div
              className="
                flex

                h-[31px]
                w-[31px]

                shrink-0

                items-center
                justify-center

                rounded-full

                bg-[#EDF6FF]

                text-[#0075FF]
              "
            >
              <Play
                size={13}
                fill="currentColor"
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  font-primary

                  text-[11px]
                  font-semibold

                  text-[#1C2530]

                  sm:text-[12px]
                "
              >
                Achievement
                Video
              </p>

              <p
                className="
                  mt-[1px]

                  font-secondary

                  text-[9px]

                  text-[#919AA5]

                  sm:text-[10px]
                "
              >
                {isYouTube
                  ? "YouTube Video"
                  : "Uploaded Video"}
              </p>
            </div>
          </div>

          <span
            className="
              shrink-0

              rounded-full

              bg-[#EEF6FF]

              px-[9px]
              py-[5px]

              font-secondary

              text-[9px]
              font-medium

              text-[#0075FF]
            "
          >
            {item.year}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AchievementsGallery() {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<GalleryTab>(
      "photos"
    );

  /* =========================================================
     LATEST YEAR AUTOMATIC
  ========================================================= */

  const [
    selectedYear,
    setSelectedYear,
  ] = useState(
    availableYears[0]
  );

  const [
    selectedPhoto,
    setSelectedPhoto,
  ] =
    useState<PhotoAchievement | null>(
      null
    );

  const [
    selectedPhotoIndex,
    setSelectedPhotoIndex,
  ] = useState(0);

  const [
    selectedVideo,
    setSelectedVideo,
  ] =
    useState<VideoAchievement | null>(
      null
    );

  /* =========================================================
     LATEST PHOTOS FIRST
  ========================================================= */

  const filteredPhotos =
    useMemo(() => {
      const matching =
        photoAchievements.filter(
          (item) =>
            item.year ===
            selectedYear
        );

      return sortNewestFirst(
        matching
      );
    }, [selectedYear]);

  /* =========================================================
     LATEST VIDEOS FIRST
  ========================================================= */

  const filteredVideos =
    useMemo(() => {
      const matching =
        videoAchievements.filter(
          (item) =>
            item.year ===
            selectedYear
        );

      return sortNewestFirst(
        matching
      );
    }, [selectedYear]);

  const activeItemCount =
    activeTab === "photos"
      ? filteredPhotos.length
      : filteredVideos.length;

  return (
    <>
      <section
        className="
          relative
          isolate

          w-full

          overflow-hidden

          bg-white

          py-[52px]

          sm:py-[64px]

          lg:py-[76px]
        "
      >
        {/* =================================================
            BACKGROUND GRID
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
                rgba(0,117,255,0.025) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(0,117,255,0.025) 1px,
                transparent 1px
              )
            `,

            backgroundSize:
              "48px 48px",
          }}
        />

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            -z-10

            bg-white/84
          "
        />

        {/* =================================================
            CONTAINER
        ================================================= */}

        <div
          className="
            mx-auto

            w-full
            max-w-[1280px]

            px-[18px]

            sm:px-[28px]

            lg:px-[42px]
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <motion.div
            variants={
              headerContainer
            }
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.3,
            }}
            className="
              mx-auto

              flex

              max-w-[760px]

              flex-col
              items-center

              text-center
            "
          >
            <motion.span
              variants={fadeUp}
              className="
                inline-flex

                rounded-[4px]

                bg-[#EEF6FF]

                px-[10px]
                py-[5px]

                font-secondary

                text-[10px]
                font-medium

                uppercase

                tracking-[0.5px]

                text-[#0075FF]
              "
            >
              Achievements
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="
                mt-[14px]

                font-primary

                text-[32px]
                font-semibold

                leading-[1.08]

                tracking-[-0.8px]

                text-[#111827]

                sm:text-[38px]

                lg:text-[42px] pt-3
              "
            >
              Celebrating
              Excellence
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="
                mx-auto

                mt-[11px]

                max-w-[650px]

                font-secondary

                text-[13px] pt-3

                leading-[1.6]

                text-[#89919B]

                sm:text-[14px]
              "
            >
              Explore Rosary
              School&apos;s
              academic, cultural,
              sports, and student
              achievements through
              photos and videos.
            </motion.p>
          </motion.div>

          {/* =================================================
              TABS
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
              delay: 0.12,
              ease,
            }}
            className="
              mx-auto

              mt-[30px]

              flex

              w-fit

              items-center

              rounded-[11px]

              border
              border-[#DDE4EC]

              bg-[#F3F6F9]

              p-[4px]
            "
          >
            {/* PHOTOS */}

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "photos"
                )
              }
              className={`
                relative

                flex

                min-w-[110px]

                items-center
                justify-center

                gap-[7px]

                rounded-[8px]

                px-[15px]
                py-[11px]

                font-secondary

                text-[11px]
                font-medium

                uppercase

                transition-colors
                duration-300

                sm:min-w-[116px]
                sm:px-[17px]

                ${
                  activeTab ===
                  "photos"
                    ? "!text-white"
                    : "text-[#687483]"
                }
              `}
            >
              {activeTab ===
                "photos" && (
                <motion.span
                  layoutId="achievement-active-tab"
                  className="
                    absolute
                    inset-0

                    rounded-[8px]

                    bg-[#0075FF]

                    shadow-[0_7px_20px_rgba(0,117,255,0.20)]
                  "
                  transition={{
                    duration: 0.4,
                    ease,
                  }}
                />
              )}

              <ImageIcon
                size={15}
                className="
                  relative
                  z-10
                "
              />

              <span
                className="
                  relative
                  z-10
                "
              >
                Photos
              </span>
            </button>

            {/* VIDEOS */}

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "videos"
                )
              }
              className={`
                relative

                flex

                min-w-[110px]

                items-center
                justify-center

                gap-[7px]

                rounded-[8px]

                px-[15px]
                py-[11px]

                font-secondary

                text-[11px]
                font-medium

                uppercase

                transition-colors
                duration-300

                sm:min-w-[116px]
                sm:px-[17px]

                ${
                  activeTab ===
                  "videos"
                    ? "!text-white"
                    : "text-[#687483]"
                }
              `}
            >
              {activeTab ===
                "videos" && (
                <motion.span
                  layoutId="achievement-active-tab"
                  className="
                    absolute
                    inset-0

                    rounded-[8px]

                    bg-[#0075FF]

                    shadow-[0_7px_20px_rgba(0,117,255,0.20)]
                  "
                  transition={{
                    duration: 0.4,
                    ease,
                  }}
                />
              )}

              <Video
                size={15}
                className="
                  relative
                  z-10
                "
              />

              <span
                className="
                  relative
                  z-10
                "
              >
                Videos
              </span>
            </button>
          </motion.div>

          {/* =================================================
              GALLERY HEADER
          ================================================= */}

          <motion.div
            layout
            className="
              mx-auto

              mt-[42px]

              flex
              w-full
              max-w-[1180px]

              flex-col

              gap-[18px]

              sm:mt-[46px]
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <motion.div
              key={
                activeTab
              }
              initial={{
                opacity: 0,
                x: -18,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                ease,
              }}
            >
              <span
                className="
                  font-secondary

                  text-[10px]
                  font-medium

                  uppercase

                  tracking-[0.8px]

                  text-[#0075FF]
                "
              >
                {activeTab ===
                "photos"
                  ? "Photo Gallery"
                  : "Video Gallery"}
              </span>

              <h3
                className="
                  mt-[5px]

                  font-primary

                  text-[25px]
                  font-semibold

                  leading-[1.15]

                  text-[#151A22]

                  sm:text-[30px]
                "
              >
                Achievement
                Gallery
              </h3>
            </motion.div>

            {/* YEAR */}

            <motion.div
              initial={{
                opacity: 0,
                x: 18,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.65,
                ease,
              }}
              className="
                relative

                w-full

                sm:w-[180px]
              "
            >
              <select
                value={
                  selectedYear
                }
                onChange={(
                  event
                ) =>
                  setSelectedYear(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
                className="
                  h-[52px]

                  w-full

                  appearance-none

                  rounded-[11px]

                  border
                  border-[#BBD9FA]

                  bg-white

                  px-[17px]
                  pr-[45px]

                  font-secondary

                  text-[14px]
                  font-medium

                  text-[#171C24]

                  outline-none

                  shadow-[0_7px_20px_rgba(31,62,95,0.06)]

                  transition-all
                  duration-300

                  hover:border-[#77B8FF]

                  focus:border-[#0075FF]
                  focus:ring-4
                  focus:ring-[#0075FF]/10
                "
              >
                {availableYears.map(
                  (year) => (
                    <option
                      key={
                        year
                      }
                      value={
                        year
                      }
                    >
                      Year {year}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={17}
                className="
                  pointer-events-none

                  absolute

                  right-[16px]
                  top-1/2

                  -translate-y-1/2

                  text-[#0075FF]
                "
              />
            </motion.div>
          </motion.div>

          {/* =================================================
              RESULT INFO
          ================================================= */}

          <motion.div
            key={`${activeTab}-${selectedYear}-${activeItemCount}`}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mx-auto

              mt-[13px]

              w-full
              max-w-[1180px]
            "
          >
            <p
              className="
                font-secondary

                text-[11px]

                text-[#98A0AA]
              "
            >
              Showing{" "}
              <span
                className="
                  font-medium
                  text-[#0075FF]
                "
              >
                {activeItemCount}
              </span>{" "}
              {activeTab ===
              "photos"
                ? activeItemCount ===
                  1
                  ? "achievement"
                  : "achievements"
                : activeItemCount ===
                    1
                  ? "video"
                  : "videos"}{" "}
              from {selectedYear}
            </p>
          </motion.div>

          {/* =================================================
              GALLERY
          ================================================= */}

          <AnimatePresence
            mode="wait"
          >
            {activeTab ===
            "photos" ? (
              <motion.div
                key={`photos-${selectedYear}`}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                transition={{
                  duration: 0.48,
                  ease,
                }}
                className={`
                  mt-[27px]

                  ${getGalleryGridClass(
                    filteredPhotos.length
                  )}
                `}
              >
                {filteredPhotos.map(
                  (item) => (
                    <PhotoCard
                      key={
                        item.id
                      }
                      item={item}
                      onOpen={(
                        photo,
                        index
                      ) => {
                        setSelectedPhoto(
                          photo
                        );

                        setSelectedPhotoIndex(
                          index
                        );
                      }}
                    />
                  )
                )}
              </motion.div>
            ) : (
              <motion.div
                key={`videos-${selectedYear}`}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                transition={{
                  duration: 0.48,
                  ease,
                }}
                className={`
                  mt-[27px]

                  ${getGalleryGridClass(
                    filteredVideos.length
                  )}
                `}
              >
                {filteredVideos.map(
                  (item) => (
                    <VideoCard
                      key={
                        item.id
                      }
                      item={item}
                      onOpen={
                        setSelectedVideo
                      }
                    />
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================
              EMPTY
          ================================================= */}

          {activeItemCount ===
            0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mx-auto

                mt-[28px]

                max-w-[700px]

                rounded-[14px]

                border
                border-dashed
                border-[#C9DEF4]

                bg-[#F8FBFF]

                px-[20px]
                py-[55px]

                text-center
              "
            >
              {activeTab ===
              "photos" ? (
                <ImageIcon
                  size={30}
                  className="
                    mx-auto
                    text-[#0075FF]
                  "
                />
              ) : (
                <Video
                  size={30}
                  className="
                    mx-auto
                    text-[#0075FF]
                  "
                />
              )}

              <p
                className="
                  mt-[12px]

                  font-secondary

                  text-[13px]

                  text-[#818A94]
                "
              >
                No{" "}
                {activeTab ===
                "photos"
                  ? "photos"
                  : "videos"}{" "}
                available for{" "}
                {selectedYear}.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* =====================================================
          PHOTO POPUP
      ====================================================== */}

      <AnimatePresence>
        {selectedPhoto && (
          <PhotoViewer
            item={
              selectedPhoto
            }
            initialIndex={
              selectedPhotoIndex
            }
            onClose={() =>
              setSelectedPhoto(
                null
              )
            }
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          VIDEO POPUP
      ====================================================== */}

      <AnimatePresence>
        {selectedVideo && (
          <VideoViewer
            item={
              selectedVideo
            }
            onClose={() =>
              setSelectedVideo(
                null
              )
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}