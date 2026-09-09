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
  Expand,
  Images,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getPublicGalleryAlbums,
  getPublicGalleryImageUrl,
  sortGalleryImages,
  type PublicGalleryAlbum,
} from "@/services/publicGalleryService";

/* =========================================================
   TYPES
========================================================= */

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
};

type GalleryAlbum = {
  id: number;
  year: number;
  title: string;
  category: string;
  images: GalleryImage[];
};

/* =========================================================
   NEXT IMAGE REMOTE URL HELPER
========================================================= */

function isRemoteImage(
  src: string
) {
  return (
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}

function remoteImageLoader({
  src,
}: {
  src: string;
}) {
  return src;
}

/* =========================================================
   MAP PUBLIC API DATA -> EXISTING UI STRUCTURE

   Backend:
   image_url / alt_text / sort_order

   Existing UI:
   src / alt

   Mapping here lets the existing cards, modal,
   arrows, thumbnails and responsive design stay unchanged.
========================================================= */

function mapPublicGalleryAlbum(
  album: PublicGalleryAlbum
): GalleryAlbum {
  return {
    id: album.id,
    year: album.year,
    title: album.title,
    category: album.category,

    images: sortGalleryImages(
      album.images
    ).map((image) => ({
      id: image.id,

      src:
        getPublicGalleryImageUrl(
          image.image_url
        ),

      alt:
        image.alt_text,
    })),
  };
}


/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const sectionContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
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
    y: 32,
    scale: 0.97,
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
   SLIDE ANIMATIONS
========================================================= */

const cardSlideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
    scale: 1.02,
  }),

  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },

  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
    scale: 1.01,
  }),
};

const modalSlideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 70 : -70,
    scale: 0.985,
  }),

  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },

  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -70 : 70,
    scale: 0.985,
  }),
};

/* =========================================================
   YEAR SELECTOR
========================================================= */

function YearSelector({
  years,
  selectedYear,
  onChange,
}: {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-50">
      <motion.button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        whileTap={{
          scale: 0.97,
        }}
        className="
          inline-flex
          h-[46px]

          items-center
          justify-center

          gap-[11px]

          rounded-[10px]

          border
          border-[#82BDFF]

          bg-white

          px-[16px]

          font-secondary

          text-[12px]

          text-[#69727D]

          shadow-[0_8px_24px_rgba(0,117,255,0.06)]

          transition-all
          duration-300

          hover:border-[#0075FF]
          hover:shadow-[0_12px_30px_rgba(0,117,255,0.12)]

          sm:text-[13px]
        "
      >
        <span>
          Year
        </span>

        <span
          className="
            font-medium
            text-[#171B22]
          "
        >
          {selectedYear}
        </span>

        <motion.span
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="
            text-[#0075FF]
          "
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -7,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -5,
              scale: 0.97,
            }}
            transition={{
              duration: 0.22,
              ease,
            }}
            className="
              absolute

              right-0
              top-[54px]

              min-w-[145px]

              overflow-hidden

              rounded-[10px]

              border
              border-[#E1E8EF]

              bg-white

              p-[6px]

              shadow-[0_20px_50px_rgba(24,50,75,0.15)]
            "
          >
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  onChange(year);
                  setOpen(false);
                }}
                className={`
                  flex
                  w-full

                  items-center
                  justify-between

                  rounded-[7px]

                  px-[12px]
                  py-[9px]

                  font-secondary

                  text-[11px]

                  transition-all
                  duration-300

                  ${
                    selectedYear === year
                      ? `
                        bg-[#EDF6FF]
                        font-medium
                        text-[#0075FF]
                      `
                      : `
                        text-[#66707A]

                        hover:bg-[#F7F9FB]
                        hover:text-[#0075FF]
                      `
                  }
                `}
              >
                {year}

                {selectedYear === year && (
                  <span
                    className="
                      h-[5px]
                      w-[5px]

                      rounded-full

                      bg-[#0075FF]
                    "
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   GALLERY CARD

   NO AUTO SLIDE
   NO INDICATOR DOTS
========================================================= */

function GalleryCard({
  album,
  onOpen,
}: {
  album: GalleryAlbum;

  onOpen: (
    album: GalleryAlbum,
    index: number
  ) => void;
}) {
  const [
    imageIndex,
    setImageIndex,
  ] = useState(0);

  const [
    direction,
    setDirection,
  ] = useState(1);

  const hasMultiple =
    album.images.length > 1;

  /* =========================================================
     RESET
  ========================================================= */

  useEffect(() => {
    setImageIndex(0);
    setDirection(1);
  }, [album.id]);

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const previous = (
    event:
      | React.MouseEvent
      | React.PointerEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDirection(-1);

    setImageIndex(
      (current) =>
        (current -
          1 +
          album.images.length) %
        album.images.length
    );
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const next = (
    event:
      | React.MouseEvent
      | React.PointerEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setDirection(1);

    setImageIndex(
      (current) =>
        (current + 1) %
        album.images.length
    );
  };

  return (
    <motion.article
      variants={cardReveal}
      className="
        group
        relative

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
        className="
          relative

          overflow-hidden

          rounded-[14px]

          bg-[#EEF4F8]

          shadow-[0_8px_26px_rgba(24,50,80,0.06)]

          transition-shadow
          duration-500

          hover:shadow-[0_22px_50px_rgba(0,117,255,0.15)]
        "
      >
        <div
          className="
            relative

            aspect-[1.48/1]

            w-full

            overflow-hidden
          "
        >
          {/* IMAGE */}

          <AnimatePresence
            initial={false}
            custom={direction}
            mode="sync"
          >
            <motion.div
              key={`${album.id}-${imageIndex}`}
              custom={direction}
              variants={cardSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.6,
                ease,
              }}
              className="
                absolute
                inset-0
              "
            >
              <Image
                loader={
                  isRemoteImage(
                    album.images[
                      imageIndex
                    ].src
                  )
                    ? remoteImageLoader
                    : undefined
                }
                unoptimized={
                  isRemoteImage(
                    album.images[
                      imageIndex
                    ].src
                  )
                }
                src={
                  album.images[
                    imageIndex
                  ].src
                }
                alt={
                  album.images[
                    imageIndex
                  ].alt
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
                "
              />
            </motion.div>
          </AnimatePresence>

          {/* OPEN MODAL */}

          <button
            type="button"
            onClick={() =>
              onOpen(
                album,
                imageIndex
              )
            }
            aria-label={`Open ${album.title}`}
            className="
              absolute
              inset-0

              z-10
            "
          />

          {/* DARK GRADIENT */}

          <div
            className="
              pointer-events-none

              absolute
              inset-0

              z-[11]

              bg-gradient-to-t

              from-black/75
              via-black/5
              to-transparent
            "
          />

          {/* IMAGE COUNT */}

          {hasMultiple && (
            <div
              className="
                pointer-events-none

                absolute

                right-[13px]
                top-[13px]

                z-20

                flex

                items-center

                gap-[5px]

                rounded-full

                bg-black/40

                px-[9px]
                py-[6px]

                text-white

                backdrop-blur-md
              "
            >
              <Images size={12} />

              <span
                className="
                  font-secondary

                  text-[8px]
                "
              >
                {album.images.length}
              </span>
            </div>
          )}

          {/* CATEGORY */}

          <span
            className="
              pointer-events-none

              absolute

              left-[13px]
              top-[13px]

              z-20

              translate-y-[-5px]

              rounded-full

              bg-white/90

              px-[9px]
              py-[5px]

              font-secondary

              text-[8px]
              font-medium

              text-[#0075FF]

              opacity-0

              backdrop-blur-md

              transition-all
              duration-300

              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            {album.category}
          </span>

          {/* PREVIOUS */}

          {hasMultiple && (
            <button
              type="button"
              onPointerDown={(event) =>
                event.stopPropagation()
              }
              onClick={previous}
              aria-label="Previous image"
              className="
                absolute

                left-[10px]
                top-1/2

                z-40

                flex

                h-[36px]
                w-[36px]

                -translate-y-1/2

                items-center
                justify-center

                rounded-full

                bg-white/92

                text-[#0075FF]

                shadow-[0_7px_20px_rgba(0,0,0,0.13)]

                backdrop-blur

                transition-all
                duration-300

                hover:bg-[#0075FF]
                hover:text-white

                lg:-translate-x-[6px]
                lg:opacity-0

                lg:group-hover:translate-x-0
                lg:group-hover:opacity-100
              "
            >
              <ChevronLeft size={17} />
            </button>
          )}

          {/* NEXT */}

          {hasMultiple && (
            <button
              type="button"
              onPointerDown={(event) =>
                event.stopPropagation()
              }
              onClick={next}
              aria-label="Next image"
              className="
                absolute

                right-[10px]
                top-1/2

                z-40

                flex

                h-[36px]
                w-[36px]

                -translate-y-1/2

                items-center
                justify-center

                rounded-full

                bg-white/92

                text-[#0075FF]

                shadow-[0_7px_20px_rgba(0,0,0,0.13)]

                backdrop-blur

                transition-all
                duration-300

                hover:bg-[#0075FF]
                hover:text-white

                lg:translate-x-[6px]
                lg:opacity-0

                lg:group-hover:translate-x-0
                lg:group-hover:opacity-100
              "
            >
              <ChevronRight size={17} />
            </button>
          )}

          {/* DETAILS */}

          <div
            className="
              pointer-events-none

              absolute

              bottom-[15px]
              left-[16px]
              right-[16px]

              z-20
            "
          >
            <h3
              className="
                pr-[55px]

                font-primary

                text-[16px]
                font-semibold

                leading-[1.2]

                !text-white

                sm:text-[17px]
              "
              style={{
                color: "#ffffff",
              }}
            >
              {album.title}
            </h3>

            <div
              className="
                mt-[6px]

                flex

                items-center

                gap-[7px]
              "
            >
              <span
                className="
                  font-secondary

                  text-[9px]

                  text-white/80
                "
              >
                {album.year}
              </span>

              {hasMultiple && (
                <>
                  <span
                    className="
                      h-[3px]
                      w-[3px]

                      rounded-full

                      bg-white/50
                    "
                  />

                  <span
                    className="
                      font-secondary

                      text-[9px]

                      text-white/80
                    "
                  >
                    {imageIndex + 1}
                    {" / "}
                    {album.images.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* EXPAND */}

          <div
            className="
              pointer-events-none

              absolute

              bottom-[47px]
              right-[14px]

              z-20

              flex

              h-[30px]
              w-[30px]

              translate-y-[5px]

              items-center
              justify-center

              rounded-full

              bg-white/90

              text-[#0075FF]

              opacity-0

              transition-all
              duration-300

              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <Expand size={13} />
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

/* =========================================================
   MODAL
   NO AUTO SLIDE
========================================================= */

function GalleryModal({
  album,
  initialIndex,
  onClose,
}: {
  album: GalleryAlbum | null;
  initialIndex: number;
  onClose: () => void;
}) {
  const [
    index,
    setIndex,
  ] = useState(initialIndex);

  const [
    direction,
    setDirection,
  ] = useState(1);

  /* =========================================================
     THUMBNAIL SCROLL
  ========================================================= */

  const thumbnailScrollerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const thumbnailRefs =
    useRef<
      (HTMLButtonElement | null)[]
    >([]);

  const [
    canScrollLeft,
    setCanScrollLeft,
  ] = useState(false);

  const [
    canScrollRight,
    setCanScrollRight,
  ] = useState(false);

  /* =========================================================
     RESET
  ========================================================= */

  useEffect(() => {
    setIndex(initialIndex);
    setDirection(1);
  }, [
    initialIndex,
    album?.id,
  ]);

  /* =========================================================
     BODY LOCK + KEYBOARD
  ========================================================= */

  useEffect(() => {
    if (!album) return;

    const oldOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyboard = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (
        event.key ===
          "ArrowRight" &&
        album.images.length > 1
      ) {
        setDirection(1);

        setIndex(
          (current) =>
            (current + 1) %
            album.images.length
        );
      }

      if (
        event.key ===
          "ArrowLeft" &&
        album.images.length > 1
      ) {
        setDirection(-1);

        setIndex(
          (current) =>
            (current -
              1 +
              album.images.length) %
            album.images.length
        );
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
    album,
    onClose,
  ]);

  /* =========================================================
     CHECK THUMBNAIL SCROLL
  ========================================================= */

  const updateScrollState =
    useCallback(() => {
      const scroller =
        thumbnailScrollerRef.current;

      if (!scroller) {
        setCanScrollLeft(false);
        setCanScrollRight(false);

        return;
      }

      const {
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = scroller;

      setCanScrollLeft(
        scrollLeft > 4
      );

      setCanScrollRight(
        scrollLeft +
          clientWidth <
          scrollWidth - 4
      );
    }, []);

  /* =========================================================
     SCROLL LISTENER
  ========================================================= */

  useEffect(() => {
    const scroller =
      thumbnailScrollerRef.current;

    if (!scroller) return;

    updateScrollState();

    const handleScroll = () =>
      updateScrollState();

    const handleResize = () =>
      updateScrollState();

    scroller.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    const observer =
      typeof ResizeObserver !==
      "undefined"
        ? new ResizeObserver(
            updateScrollState
          )
        : null;

    observer?.observe(
      scroller
    );

    return () => {
      scroller.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      observer?.disconnect();
    };
  }, [
    album,
    updateScrollState,
  ]);

  /* =========================================================
     KEEP ACTIVE THUMBNAIL VISIBLE
  ========================================================= */

  useEffect(() => {
    const scroller =
      thumbnailScrollerRef.current;

    const activeThumbnail =
      thumbnailRefs.current[
        index
      ];

    if (
      !scroller ||
      !activeThumbnail
    ) {
      return;
    }

    const thumbnailLeft =
      activeThumbnail.offsetLeft;

    const thumbnailRight =
      thumbnailLeft +
      activeThumbnail.clientWidth;

    const visibleLeft =
      scroller.scrollLeft;

    const visibleRight =
      visibleLeft +
      scroller.clientWidth;

    if (
      thumbnailLeft <
        visibleLeft ||
      thumbnailRight >
        visibleRight
    ) {
      activeThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    const timer =
      window.setTimeout(
        updateScrollState,
        350
      );

    return () =>
      window.clearTimeout(timer);
  }, [
    index,
    updateScrollState,
  ]);

  if (!album) {
    return null;
  }

  const hasMultiple =
    album.images.length > 1;

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const previous = () => {
    setDirection(-1);

    setIndex(
      (current) =>
        (current -
          1 +
          album.images.length) %
        album.images.length
    );
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const next = () => {
    setDirection(1);

    setIndex(
      (current) =>
        (current + 1) %
        album.images.length
    );
  };

  /* =========================================================
     SELECT THUMB
  ========================================================= */

  const selectThumbnail = (
    targetIndex: number
  ) => {
    if (
      targetIndex === index
    ) {
      return;
    }

    setDirection(
      targetIndex > index
        ? 1
        : -1
    );

    setIndex(targetIndex);
  };

  /* =========================================================
     THUMBNAIL STRIP SCROLL
  ========================================================= */

  const scrollThumbnails = (
    direction:
      | "left"
      | "right"
  ) => {
    const scroller =
      thumbnailScrollerRef.current;

    if (!scroller) return;

    const amount = Math.max(
      180,
      scroller.clientWidth *
        0.72
    );

    scroller.scrollBy({
      left:
        direction === "right"
          ? amount
          : -amount,

      behavior: "smooth",
    });

    window.setTimeout(
      updateScrollState,
      400
    );
  };

  /* =========================================================
     MOUSE WHEEL -> HORIZONTAL SCROLL
  ========================================================= */

  const handleThumbnailWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    const scroller =
      thumbnailScrollerRef.current;

    if (!scroller) return;

    if (
      scroller.scrollWidth <=
      scroller.clientWidth
    ) {
      return;
    }

    if (
      Math.abs(
        event.deltaY
      ) >
      Math.abs(
        event.deltaX
      )
    ) {
      event.preventDefault();

      scroller.scrollBy({
        left: event.deltaY,
        behavior: "auto",
      });
    }
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
          duration: 0.28,
        }}
        onMouseDown={onClose}
        className="
          fixed
          inset-0

          z-[99999]

          flex

          items-center
          justify-center

          bg-[#07111E]/80

          p-[6px]

          backdrop-blur-[14px]

          sm:p-[14px]

          lg:p-[22px]
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.965,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 22,
            scale: 0.975,
          }}
          transition={{
            duration: 0.48,
            ease,
          }}
          onMouseDown={(event) =>
            event.stopPropagation()
          }
          role="dialog"
          aria-modal="true"
          aria-label={album.title}
          className="
            relative

            grid

            h-[calc(100dvh-12px)]
            w-full
            max-w-[1280px]

            grid-rows-[auto_minmax(0,1fr)_auto]

            overflow-hidden

            rounded-[14px]

            bg-white

            shadow-[0_40px_140px_rgba(0,0,0,0.38)]

            sm:h-[calc(100dvh-28px)]
            sm:rounded-[18px]

            lg:h-[min(820px,calc(100dvh-44px))]
            lg:rounded-[22px]
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="
              relative

              z-30

              flex

              items-center
              justify-between

              gap-[10px]

              border-b
              border-[#E9EDF2]

              bg-white

              px-[12px]
              py-[10px]

              sm:px-[20px]
              sm:py-[14px]

              lg:px-[27px]
              lg:py-[16px]
            "
          >
            <span
              className="
                absolute

                left-0
                top-0

                h-[3px]
                w-[110px]

                rounded-br-full

                bg-[#0075FF]
              "
            />

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

                  gap-[6px]
                "
              >
                <span
                  className="
                    inline-flex

                    rounded-full

                    bg-[#EDF6FF]

                    px-[8px]
                    py-[4px]

                    font-secondary

                    text-[7px]
                    font-medium

                    uppercase

                    tracking-[0.45px]

                    text-[#0075FF]

                    sm:text-[8px]
                  "
                >
                  {album.category}
                </span>

                <span
                  className="
                    font-secondary

                    text-[8px]

                    text-[#96A1AD]

                    sm:text-[9px]
                  "
                >
                  {album.year}
                </span>
              </div>

              <h3
                className="
                  mt-[4px]

                  truncate

                  font-primary

                  text-[16px]
                  font-semibold

                  leading-[1.15]

                  tracking-[-0.3px]

                  text-[#141A22]

                  sm:text-[21px]

                  lg:text-[24px]
                "
              >
                {album.title}
              </h3>
            </div>

            {/* COUNTER */}

            <div
              className="
                hidden

                shrink-0

                items-center

                gap-[7px]

                rounded-full

                bg-[#F3F7FB]

                px-[11px]
                py-[7px]

                font-secondary

                text-[9px]

                text-[#667381]

                sm:flex
              "
            >
              <Images
                size={12}
                className="
                  text-[#0075FF]
                "
              />

              <span
                className="
                  font-semibold
                  text-[#151B23]
                "
              >
                {String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )}
              </span>

              <span
                className="
                  text-[#BCC4CC]
                "
              >
                /
              </span>

              <span>
                {String(
                  album.images.length
                ).padStart(
                  2,
                  "0"
                )}
              </span>
            </div>

            {/* CLOSE */}

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{
                rotate: 90,
              }}
              whileTap={{
                scale: 0.9,
              }}
              aria-label="Close gallery"
              className="
                flex

                h-[36px]
                w-[36px]

                shrink-0

                items-center
                justify-center

                rounded-[9px]

                border
                border-[#E1E7ED]

                bg-[#F8FAFC]

                text-[#3F4A55]

                transition-all
                duration-300

                hover:border-[#0075FF]
                hover:bg-[#0075FF]
                hover:text-white

                sm:h-[42px]
                sm:w-[42px]
              "
            >
              <X size={18} />
            </motion.button>
          </header>

          {/* =================================================
              IMAGE STAGE
          ================================================= */}

          <main
            className="
              relative

              min-h-0

              overflow-hidden

              bg-[#F3F6F9]
            "
          >
            {/* BACKGROUND BLUR */}

            <AnimatePresence
              initial={false}
              mode="sync"
            >
              <motion.div
                key={`background-${album.id}-${index}`}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 0.12,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="
                  absolute
                  inset-0
                "
              >
                <Image
                  loader={
                    isRemoteImage(
                      album.images[
                        index
                      ].src
                    )
                      ? remoteImageLoader
                      : undefined
                  }
                  unoptimized={
                    isRemoteImage(
                      album.images[
                        index
                      ].src
                    )
                  }
                  src={
                    album.images[
                      index
                    ].src
                  }
                  alt=""
                  fill
                  sizes="100vw"
                  className="
                    scale-[1.15]

                    object-cover

                    blur-[35px]
                  "
                />
              </motion.div>
            </AnimatePresence>

            <div
              className="
                pointer-events-none

                absolute
                inset-0

                bg-white/70
              "
            />

            {/* MAIN IMAGE */}

            <div
              className="
                absolute

                inset-[8px]

                sm:inset-[14px]

                lg:inset-[18px_76px]
              "
            >
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="sync"
              >
                <motion.div
                  key={`${album.id}-modal-${index}`}
                  custom={direction}
                  variants={
                    modalSlideVariants
                  }
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.6,
                    ease,
                  }}
                  className="
                    absolute
                    inset-0
                  "
                >
                  <Image
                    loader={
                      isRemoteImage(
                        album.images[
                          index
                        ].src
                      )
                        ? remoteImageLoader
                        : undefined
                    }
                    unoptimized={
                      isRemoteImage(
                        album.images[
                          index
                        ].src
                      )
                    }
                    src={
                      album.images[
                        index
                      ].src
                    }
                    alt={
                      album.images[
                        index
                      ].alt
                    }
                    fill
                    priority
                    sizes="100vw"
                    className="
                      object-contain
                      object-center
                    "
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* PREVIOUS */}

            {hasMultiple && (
              <motion.button
                type="button"
                onClick={previous}
                whileHover={{
                  x: -3,
                }}
                whileTap={{
                  scale: 0.92,
                }}
                aria-label="Previous image"
                className="
                  absolute

                  left-[8px]
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
                  border-white

                  bg-white/95

                  text-[#0075FF]

                  shadow-[0_10px_30px_rgba(24,48,72,0.13)]

                  backdrop-blur-md

                  transition-all
                  duration-300

                  hover:bg-[#0075FF]
                  hover:text-white

                  sm:left-[15px]
                  sm:h-[46px]
                  sm:w-[46px]

                  lg:left-[24px]
                "
              >
                <ChevronLeft size={20} />
              </motion.button>
            )}

            {/* NEXT */}

            {hasMultiple && (
              <motion.button
                type="button"
                onClick={next}
                whileHover={{
                  x: 3,
                }}
                whileTap={{
                  scale: 0.92,
                }}
                aria-label="Next image"
                className="
                  absolute

                  right-[8px]
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

                  text-white

                  shadow-[0_12px_32px_rgba(0,117,255,0.25)]

                  transition-all
                  duration-300

                  hover:bg-[#0066DD]

                  sm:right-[15px]
                  sm:h-[46px]
                  sm:w-[46px]

                  lg:right-[24px]
                "
              >
                <ChevronRight size={20} />
              </motion.button>
            )}

            {/* MOBILE COUNTER */}

            <div
              className="
                absolute

                bottom-[9px]
                right-[9px]

                z-30

                rounded-full

                bg-[#111827]/75

                px-[9px]
                py-[5px]

                font-secondary

                text-[8px]
                font-medium

                text-white

                backdrop-blur-md

                sm:hidden
              "
            >
              {index + 1}
              {" / "}
              {album.images.length}
            </div>
          </main>

          {/* =================================================
              THUMBNAILS
          ================================================= */}

          {hasMultiple && (
            <footer
              className="
                relative

                z-30

                shrink-0

                border-t
                border-[#E7EDF3]

                bg-white

                px-[8px]
                py-[8px]

                sm:px-[12px]
                sm:py-[10px]

                lg:px-[18px]
              "
            >
              <div
                className="
                  flex

                  min-w-0

                  items-center

                  gap-[7px]

                  sm:gap-[9px]
                "
              >
                {/* LABEL */}

                <div
                  className="
                    hidden

                    w-[100px]
                    shrink-0

                    lg:block
                  "
                >
                  <p
                    className="
                      font-secondary

                      text-[8px]
                      font-medium

                      uppercase

                      tracking-[0.6px]

                      text-[#0075FF]
                    "
                  >
                    Gallery
                  </p>

                  <p
                    className="
                      mt-[2px]

                      font-secondary

                      text-[9px]

                      text-[#98A2AC]
                    "
                  >
                    Select image
                  </p>
                </div>

                {/* SCROLL LEFT */}

                <AnimatePresence>
                  {canScrollLeft && (
                    <motion.button
                      type="button"
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.85,
                      }}
                      onClick={() =>
                        scrollThumbnails(
                          "left"
                        )
                      }
                      className="
                        flex

                        h-[32px]
                        w-[32px]

                        shrink-0

                        items-center
                        justify-center

                        rounded-full

                        border
                        border-[#DCE5EE]

                        bg-white

                        text-[#0075FF]

                        shadow-[0_5px_15px_rgba(20,45,70,0.07)]

                        transition-all
                        duration-300

                        hover:border-[#0075FF]
                        hover:bg-[#0075FF]
                        hover:text-white

                        sm:h-[36px]
                        sm:w-[36px]
                      "
                      aria-label="Scroll thumbnails left"
                    >
                      <ChevronLeft
                        size={16}
                      />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* HORIZONTAL SCROLLER */}

                <div
                  ref={
                    thumbnailScrollerRef
                  }
                  onWheel={
                    handleThumbnailWheel
                  }
                  className="
                    min-w-0
                    flex-1

                    overflow-x-auto
                    overflow-y-hidden

                    scroll-smooth

                    overscroll-x-contain

                    touch-pan-x

                    py-[2px]

                    [scrollbar-width:none]

                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  <div
                    className="
                      flex

                      w-max

                      min-w-full

                      items-center

                      gap-[7px]

                      sm:gap-[8px]
                    "
                  >
                    {album.images.map(
                      (
                        image,
                        thumbnailIndex
                      ) => (
                        <motion.button
                          key={
                            image.id
                          }
                          ref={(
                            element
                          ) => {
                            thumbnailRefs.current[
                              thumbnailIndex
                            ] =
                              element;
                          }}
                          type="button"
                          onClick={() =>
                            selectThumbnail(
                              thumbnailIndex
                            )
                          }
                          whileHover={{
                            y: -2,
                          }}
                          whileTap={{
                            scale: 0.97,
                          }}
                          className={`
                            relative

                            h-[46px]
                            w-[66px]

                            shrink-0

                            overflow-hidden

                            rounded-[7px]

                            border-2

                            bg-[#EEF3F7]

                            transition-all
                            duration-300

                            sm:h-[54px]
                            sm:w-[80px]

                            md:h-[58px]
                            md:w-[88px]

                            ${
                              thumbnailIndex ===
                              index
                                ? `
                                  border-[#0075FF]

                                  opacity-100

                                  shadow-[0_5px_18px_rgba(0,117,255,0.20)]
                                `
                                : `
                                  border-transparent

                                  opacity-50

                                  hover:opacity-90
                                `
                            }
                          `}
                        >
                          <Image
                            loader={
                              isRemoteImage(
                                image.src
                              )
                                ? remoteImageLoader
                                : undefined
                            }
                            unoptimized={
                              isRemoteImage(
                                image.src
                              )
                            }
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="100px"
                            className="
                              object-cover
                              object-center
                            "
                          />

                          <span
                            className={`
                              absolute

                              bottom-[3px]
                              right-[3px]

                              flex

                              h-[15px]
                              min-w-[15px]

                              items-center
                              justify-center

                              rounded-full

                              px-[3px]

                              font-secondary

                              text-[7px]

                              ${
                                thumbnailIndex ===
                                index
                                  ? `
                                    bg-[#0075FF]
                                    text-white
                                  `
                                  : `
                                    bg-black/55
                                    text-white
                                  `
                              }
                            `}
                          >
                            {thumbnailIndex +
                              1}
                          </span>
                        </motion.button>
                      )
                    )}
                  </div>
                </div>

                {/* SCROLL RIGHT */}

                <AnimatePresence>
                  {canScrollRight && (
                    <motion.button
                      type="button"
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.85,
                      }}
                      onClick={() =>
                        scrollThumbnails(
                          "right"
                        )
                      }
                      className="
                        flex

                        h-[32px]
                        w-[32px]

                        shrink-0

                        items-center
                        justify-center

                        rounded-full

                        bg-[#0075FF]

                        text-white

                        shadow-[0_7px_20px_rgba(0,117,255,0.20)]

                        transition-all
                        duration-300

                        hover:bg-[#0066DB]

                        sm:h-[36px]
                        sm:w-[36px]
                      "
                      aria-label="Scroll thumbnails right"
                    >
                      <ChevronRight
                        size={16}
                      />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* IMAGE NAVIGATION */}

                <div
                  className="
                    hidden

                    shrink-0

                    items-center

                    gap-[6px]

                    md:flex
                  "
                >
                  <button
                    type="button"
                    onClick={previous}
                    className="
                      flex

                      h-[36px]
                      w-[36px]

                      items-center
                      justify-center

                      rounded-full

                      border
                      border-[#DBE4EC]

                      bg-white

                      text-[#0075FF]

                      transition-all
                      duration-300

                      hover:border-[#0075FF]
                      hover:bg-[#0075FF]
                      hover:text-white
                    "
                    aria-label="Previous image"
                  >
                    <ChevronLeft
                      size={16}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={next}
                    className="
                      flex

                      h-[36px]
                      w-[36px]

                      items-center
                      justify-center

                      rounded-full

                      bg-[#0075FF]

                      text-white

                      shadow-[0_6px_18px_rgba(0,117,255,0.18)]

                      transition-all
                      duration-300

                      hover:bg-[#0066DB]
                    "
                    aria-label="Next image"
                  >
                    <ChevronRight
                      size={16}
                    />
                  </button>
                </div>
              </div>
            </footer>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================================================
   LOADING CARD
========================================================= */

function GalleryLoadingCard() {
  return (
    <div
      className="
        animate-pulse

        overflow-hidden

        rounded-[14px]

        border
        border-[#E5EBF1]

        bg-white

        shadow-[0_8px_26px_rgba(24,50,80,0.04)]
      "
    >
      <div
        className="
          aspect-[1.48/1]

          bg-[#EAF0F5]
        "
      />

      <div
        className="
          p-[15px]
        "
      >
        <div
          className="
            h-[16px]
            w-[65%]

            rounded

            bg-[#EAF0F5]
          "
        />

        <div
          className="
            mt-[10px]

            h-[10px]
            w-[35%]

            rounded

            bg-[#EEF2F6]
          "
        />
      </div>
    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SchoolHighlightsGallery() {
  /* =========================================================
     DYNAMIC PUBLIC GALLERY
  ========================================================= */

  const [
    galleryAlbums,
    setGalleryAlbums,
  ] = useState<GalleryAlbum[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    selectedYear,
    setSelectedYear,
  ] = useState<number | null>(
    null
  );

  const [
    selectedAlbum,
    setSelectedAlbum,
  ] =
    useState<GalleryAlbum | null>(
      null
    );

  const [
    modalImageIndex,
    setModalImageIndex,
  ] = useState(0);


  /* =========================================================
     LOAD PUBLIC GALLERY
  ========================================================= */

  const loadGallery =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getPublicGalleryAlbums();

          const mappedAlbums =
            response.items
              .map(
                mapPublicGalleryAlbum
              )
              .filter(
                (album) =>
                  album.images.length >
                  0
              );

          setGalleryAlbums(
            mappedAlbums
          );

          const availableYears =
            Array.from(
              new Set(
                mappedAlbums.map(
                  (album) =>
                    album.year
                )
              )
            ).sort(
              (first, second) =>
                second - first
            );

          setSelectedYear(
            (current) => {
              if (
                current !== null &&
                availableYears.includes(
                  current
                )
              ) {
                return current;
              }

              return (
                availableYears[0] ??
                null
              );
            }
          );
        } catch (err) {
          console.error(
            "Unable to load public Gallery:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Gallery."
          );

          setGalleryAlbums([]);
          setSelectedYear(null);
        } finally {
          setLoading(false);
        }
      },
      []
    );


  useEffect(() => {
    void loadGallery();
  }, [
    loadGallery,
  ]);


  /* =========================================================
     YEARS — LATEST FIRST
  ========================================================= */

  const years =
    useMemo(() => {
      return Array.from(
        new Set(
          galleryAlbums.map(
            (album) =>
              album.year
          )
        )
      ).sort(
        (first, second) =>
          second - first
      );
    }, [
      galleryAlbums,
    ]);


  /* =========================================================
     FILTER
  ========================================================= */

  const visibleAlbums =
    useMemo(() => {
      if (
        selectedYear === null
      ) {
        return [];
      }

      return [
        ...galleryAlbums,
      ]
        .filter(
          (album) =>
            album.year ===
            selectedYear
        )
        .sort(
          (first, second) =>
            second.id -
            first.id
        );
    }, [
      galleryAlbums,
      selectedYear,
    ]);


  /* =========================================================
     OPEN MODAL
  ========================================================= */

  const openGallery = (
    album: GalleryAlbum,
    imageIndex: number
  ) => {
    setModalImageIndex(
      imageIndex
    );

    setSelectedAlbum(
      album
    );
  };

  /* =========================================================
     RESPONSIVE GRID
  ========================================================= */

  const gridClass =
    visibleAlbums.length ===
    1
      ? `
        grid-cols-1

        max-w-[450px]
      `
      : visibleAlbums.length ===
          2
        ? `
          grid-cols-1

          sm:grid-cols-2

          max-w-[920px]
        `
        : `
          grid-cols-1

          sm:grid-cols-2

          lg:grid-cols-3

          max-w-[1200px]
        `;

  return (
    <>
      <section
        className="
          relative
          isolate

          w-full

          overflow-hidden

          bg-[#FDFEFE]

          py-[52px]

          sm:py-[64px]

          lg:py-[76px]
        "
      >
        {/* GRID BACKGROUND */}

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
                rgba(37,83,125,0.045) 1px,
                transparent 1px
              ),

              linear-gradient(
                90deg,
                rgba(37,83,125,0.045) 1px,
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

            bg-white/30
          "
        />

        <div
          className="
            relative
            z-10

            mx-auto

            w-full
            max-w-[1280px]

            px-[16px]

            sm:px-[26px]

            md:px-[38px]

            lg:px-[46px]
          "
        >
          {/* HEADER */}

          <motion.div
            variants={
              sectionContainer
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
              variants={fadeUp}
              className="
                inline-flex

                rounded-[4px]

                bg-[#EEF6FF]

                px-[9px]
                py-[5px]

                font-secondary

                text-[9px]
                font-medium

                text-[#0075FF]

                sm:text-[13px]
              "
            >
              Gallery
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="
                mt-[14px]

                font-primary

                text-[30px]
                font-semibold

                leading-[1.08]

                tracking-[-0.65px]

                text-[#171717]

                sm:text-[35px]

                md:text-[38px]

                pt-3
              "
            >
              School Highlights
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="
                mx-auto

                mt-[10px]

                max-w-[580px]

                font-secondary

                text-[12px]

                leading-[1.55]

                text-[#898989]

                sm:text-[13px]

                pt-3
              "
            >
              Celebrating Our Campus,
              Events, Teachers &amp;
              Achievements
            </motion.p>
          </motion.div>

          {/* YEAR */}

          {!loading &&
            !error &&
            years.length > 0 &&
            selectedYear !==
              null && (
              <motion.div
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
                  delay: 0.15,
                  ease,
                }}
                className="
                  mt-[28px]

                  flex
                  justify-center

                  sm:justify-end

                  lg:mt-[32px]
                "
              >
                <YearSelector
                  years={years}
                  selectedYear={
                    selectedYear
                  }
                  onChange={
                    setSelectedYear
                  }
                />
              </motion.div>
            )}


          {/* LOADING */}

          {loading && (
            <div
              className="
                mx-auto

                mt-[36px]

                grid

                w-full
                max-w-[1200px]

                grid-cols-1

                gap-[18px]

                sm:mt-[44px]
                sm:grid-cols-2
                sm:gap-[20px]

                lg:mt-[50px]
                lg:grid-cols-3
                lg:gap-[26px]
              "
            >
              {Array.from({
                length: 3,
              }).map(
                (
                  _,
                  index
                ) => (
                  <GalleryLoadingCard
                    key={
                      index
                    }
                  />
                )
              )}
            </div>
          )}


          {/* ERROR */}

          {!loading &&
            error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  mx-auto

                  mt-[42px]

                  max-w-[560px]

                  rounded-[14px]

                  border
                  border-[#D9E7F5]

                  bg-white

                  px-[22px]
                  py-[28px]

                  text-center

                  shadow-[0_10px_30px_rgba(24,50,80,0.05)]
                "
              >
                <p
                  className="
                    font-primary

                    text-[16px]
                    font-semibold

                    text-[#171B22]
                  "
                >
                  Gallery is temporarily unavailable
                </p>

                <p
                  className="
                    mt-[8px]

                    font-secondary

                    text-[11px]

                    leading-[1.55]

                    text-[#8A94A3]
                  "
                >
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    void loadGallery()
                  }
                  className="
                    mt-[18px]

                    inline-flex

                    h-[38px]

                    items-center
                    justify-center

                    rounded-[8px]

                    bg-[#0075FF]

                    px-[18px]

                    font-secondary

                    text-[10px]
                    font-medium

                    text-white

                    transition-all
                    duration-300

                    hover:bg-[#0066DD]
                  "
                >
                  Try Again
                </button>
              </motion.div>
            )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            galleryAlbums.length ===
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
                className="
                  mx-auto

                  mt-[42px]

                  max-w-[560px]

                  rounded-[14px]

                  border
                  border-dashed
                  border-[#CFDCE8]

                  bg-white/75

                  px-[22px]
                  py-[34px]

                  text-center
                "
              >
                <Images
                  size={25}
                  className="
                    mx-auto
                    text-[#0075FF]
                  "
                />

                <p
                  className="
                    mt-[13px]

                    font-primary

                    text-[16px]
                    font-semibold

                    text-[#171B22]
                  "
                >
                  Gallery updates coming soon
                </p>

                <p
                  className="
                    mt-[7px]

                    font-secondary

                    text-[10px]

                    leading-[1.55]

                    text-[#8A94A3]
                  "
                >
                  Published Gallery albums will appear here.
                </p>
              </motion.div>
            )}


          {/* CARDS */}

          {!loading &&
            !error &&
            visibleAlbums.length >
              0 && (
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.div
                  key={
                    selectedYear
                  }
                  variants={
                    sectionContainer
                  }
                  initial="hidden"
                  animate="visible"
                  exit={{
                    opacity: 0,
                    y: 15,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className={`
                    mx-auto

                    mt-[36px]

                    grid

                    w-full

                    gap-[18px]

                    sm:mt-[44px]
                    sm:gap-[20px]

                    lg:mt-[50px]
                    lg:gap-[26px]

                    ${gridClass}
                  `}
                >
                  {visibleAlbums.map(
                    (album) => (
                      <GalleryCard
                        key={
                          album.id
                        }
                        album={
                          album
                        }
                        onOpen={
                          openGallery
                        }
                      />
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            )}
        </div>
      </section>

      {/* MODAL */}

      <GalleryModal
        album={
          selectedAlbum
        }
        initialIndex={
          modalImageIndex
        }
        onClose={() =>
          setSelectedAlbum(
            null
          )
        }
      />
    </>
  );
}