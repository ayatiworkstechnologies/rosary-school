"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  useEffect,
  useState,
} from "react";

/* =========================================================
   GALLERY DATA

   Replace image paths with your images.

   Recommended maximum source size:
   483px × 373px
========================================================= */

const galleryImages = [
  {
    id: 1,
    image: "/images/gallery-01.png",
    alt: "Rosary School campus",
  },
  {
    id: 2,
    image: "/images/gallery-01.png",
    alt: "Rosary School student activity",
  },
  {
    id: 3,
    image: "/images/gallery-01.png",
    alt: "Students at Rosary School",
  },
  {
    id: 4,
    image: "/images/gallery-01.png",
    alt: "Rosary School classroom activity",
  },
  {
    id: 5,
    image: "/images/gallery-01.png",
    alt: "Students learning at Rosary School",
  },
  {
    id: 6,
    image: "/images/gallery-01.png",
    alt: "Rosary School building",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function GallerySection() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [direction, setDirection] =
    useState(1);

  const [isPaused, setIsPaused] =
    useState(false);

  /* =========================================================
     AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setDirection(1);

      setActiveIndex(
        (current) =>
          (current + 1) %
          galleryImages.length
      );
    }, 3500);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused]);

  /* =========================================================
     MANUAL NAVIGATION
  ========================================================= */

  const goToSlide = (
    index: number
  ) => {
    if (index === activeIndex) return;

    setDirection(
      index > activeIndex ? 1 : -1
    );

    setActiveIndex(index);
  };

  const activeImage =
    galleryImages[activeIndex];

  const nextImage =
    galleryImages[
      (activeIndex + 1) %
        galleryImages.length
    ];

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#fbfbfb]

        px-4
        py-14

        sm:px-6
        sm:py-16

        lg:px-8
        lg:py-[76px]
      "
    >
      {/* =====================================================
          GRID BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.45]
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(17,17,17,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17,17,17,0.055) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* =====================================================
          BLUE RIGHT GLOW
      ====================================================== */}

     <div
  className="
    pointer-events-none
    absolute

    right-[-70px]
    top-[-40px]

    h-[180px]
    w-[180px]

    rounded-full

    bg-[#0075FF]/18

    blur-[75px]

    sm:h-[220px]
    sm:w-[220px]

    lg:h-[260px]
    lg:w-[260px]
  "
/>

      {/* =====================================================
          SOFT WHITE GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2

          h-[380px]
          w-[700px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          bg-white/50

          blur-[120px]
        "
      />

      {/* =====================================================
          CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto
          w-full

          max-w-[1100px]
        "
      >
        {/* ===================================================
            HEADER
        ==================================================== */}

        <motion.div
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
            amount: 0.4,
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
          className="text-center"
        >
          <motion.span
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              inline-flex

              bg-[#F3F8FF]

              px-2
              py-[4px]

              font-secondary
              text-[10px] mb-3
              font-medium

              text-primary

              sm:text-[15px]
            "
          >
            Gallery
          </motion.span>

          <h2
            className="
              mt-3

              font-primary

              text-[30px]
              font-semibold

              leading-none

              tracking-[-0.035em]

              text-[#111111]

              sm:text-[36px]

              lg:text-[40px]
            "
          >
            Life at Rosary
          </h2>
        </motion.div>

        {/* ===================================================
            DESKTOP COLLAGE

            >= 1024px
        ==================================================== */}

        <div
          className="
            relative
            mt-12

            hidden

            lg:block
          "
        >
          {/* =================================================
              LARGE GALLERY OUTLINE
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -65,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 1,
              delay: 0.25,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            aria-hidden="true"
            className="
              pointer-events-none

              absolute
              bottom-[-105px]
              left-[-95px]

              z-0
            "
          >
            <span
              className="
                block
                select-none

                font-primary

                text-[125px]
                font-normal

                leading-none

                tracking-[0.01em]

                text-transparent

                xl:text-[150px]
              "
              style={{
                WebkitTextStroke:
                  "1px rgba(0,117,255,0.62)",
              }}
            >
              Gallery
            </span>
          </motion.div>

          {/* =================================================
              COLLAGE
          ================================================== */}

          <div
            className="
              relative
              z-10

              grid
              grid-cols-2

              gap-[20px]
            "
          >
            {/* =================================================
                LEFT
            ================================================== */}

            <div
              className="
                flex
                flex-col

                gap-[20px]
              "
            >
              {/* LARGE */}

              <GalleryImage
                item={galleryImages[0]}
                index={0}
                direction="left"
                className="
                  aspect-[483/260]
                  w-full
                "
              />

              {/* TWO SMALL */}

              <div
                className="
                  grid
                  grid-cols-2

                  gap-[20px]
                "
              >
                <GalleryImage
                  item={galleryImages[1]}
                  index={1}
                  direction="bottom"
                  className="
                    aspect-[1.48/1]
                    w-full
                  "
                />

                <GalleryImage
                  item={galleryImages[2]}
                  index={2}
                  direction="bottom"
                  className="
                    aspect-[1.48/1]
                    w-full
                  "
                />
              </div>
            </div>

            {/* =================================================
                RIGHT
            ================================================== */}

            <div
              className="
                flex
                flex-col

                gap-[20px]
              "
            >
              {/* TWO SMALL */}

              <div
                className="
                  grid
                  grid-cols-2

                  gap-[20px]
                "
              >
                <GalleryImage
                  item={galleryImages[3]}
                  index={3}
                  direction="top"
                  className="
                    aspect-[1.48/1]
                    w-full
                  "
                />

                <GalleryImage
                  item={galleryImages[4]}
                  index={4}
                  direction="top"
                  className="
                    aspect-[1.48/1]
                    w-full
                  "
                />
              </div>

              {/* LARGE */}

              <GalleryImage
                item={galleryImages[5]}
                index={5}
                direction="right"
                className="
                  aspect-[483/260]
                  w-full
                "
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            TABLET SLIDER

            640px - 1023px
            TWO IMAGES
        ==================================================== */}

        <div
          className="
            mt-10

            hidden

            sm:block
            lg:hidden
          "
          onMouseEnter={() =>
            setIsPaused(true)
          }
          onMouseLeave={() =>
            setIsPaused(false)
          }
        >
          <AnimatePresence
            initial={false}
            mode="wait"
            custom={direction}
          >
            <motion.div
              key={`tablet-${activeIndex}`}
              custom={direction}
              variants={{
                enter: (
                  direction: number
                ) => ({
                  opacity: 0,
                  x:
                    direction > 0
                      ? 40
                      : -40,
                }),

                center: {
                  opacity: 1,
                  x: 0,
                },

                exit: (
                  direction: number
                ) => ({
                  opacity: 0,
                  x:
                    direction > 0
                      ? -40
                      : 40,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.6,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                grid
                grid-cols-2

                gap-4
              "
            >
              <TabletGalleryImage
                item={activeImage}
              />

              <TabletGalleryImage
                item={nextImage}
              />
            </motion.div>
          </AnimatePresence>

          <SliderDots
            activeIndex={
              activeIndex
            }
            goToSlide={
              goToSlide
            }
          />
        </div>

        {/* ===================================================
            MOBILE SLIDER

            < 640px
            ONE IMAGE
        ==================================================== */}

        <div
          className="
            mt-9

            sm:hidden
          "
        >
          <div
            className="
              mx-auto
              w-full

              max-w-[483px]
            "
          >
            <div
              className="
                relative

                aspect-[483/373]

                w-full

                overflow-hidden

                bg-[#eeeeee]

                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
              "
            >
              <AnimatePresence
                initial={false}
                mode="wait"
                custom={direction}
              >
                <motion.div
                  key={`mobile-${activeImage.id}`}
                  custom={direction}
                  variants={{
                    enter: (
                      direction: number
                    ) => ({
                      opacity: 0,

                      x:
                        direction > 0
                          ? 35
                          : -35,

                      scale: 1.03,
                    }),

                    center: {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                    },

                    exit: (
                      direction: number
                    ) => ({
                      opacity: 0,

                      x:
                        direction > 0
                          ? -35
                          : 35,

                      scale: 1.02,
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
                  "
                >
                  <Image
                    src={
                      activeImage.image
                    }
                    alt={
                      activeImage.alt
                    }
                    fill
                    sizes="(max-width: 639px) 92vw, 483px"
                    className="
                      object-cover
                      object-center
                    "
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <SliderDots
              activeIndex={
                activeIndex
              }
              goToSlide={
                goToSlide
              }
            />
          </div>
        </div>

        {/* ===================================================
            VIEW ALL
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.65,
            delay: 0.18,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            relative
            z-20

            mt-9

            flex
            justify-center

            lg:mt-11 
          "
        >
          <Link
            href="#"
            onClick={(event) =>
              event.preventDefault()
            }
            className="
              group

              inline-flex

              min-h-[46px]
              min-w-[170px]

              items-center
              justify-center

              bg-[#0075FF] rounded-md

              px-8

              font-primary

              text-[12px]
              font-medium

              uppercase

              tracking-[0.03em]

              !text-white

              shadow-[0_8px_20px_rgba(0,117,255,0.18)]

              transition-all
              duration-300
              ease-out

              hover:-translate-y-[3px]

              hover:bg-[#006AE8]

              hover:shadow-[0_14px_30px_rgba(0,117,255,0.28)]
            "
            style={{
              color: "#ffffff",
            }}
          >
            <span
              className="
                !text-white

                transition-transform
                duration-300

                group-hover:scale-[1.04]
              "
              style={{
                color:
                  "#ffffff",
              }}
            >
              View All
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   TYPES
========================================================= */

type GalleryItem =
  (typeof galleryImages)[number];

type AnimationDirection =
  | "left"
  | "right"
  | "top"
  | "bottom";

/* =========================================================
   DESKTOP GALLERY IMAGE
========================================================= */

function GalleryImage({
  item,
  index,
  className,
  direction,
}: {
  item: GalleryItem;
  index: number;
  className: string;
  direction: AnimationDirection;
}) {
  const initialPosition = {
    left: {
      x: -45,
      y: 0,
    },

    right: {
      x: 45,
      y: 0,
    },

    top: {
      x: 0,
      y: -35,
    },

    bottom: {
      x: 0,
      y: 35,
    },
  }[direction];

  return (
    <motion.div
      initial={{
        opacity: 0,

        x:
          initialPosition.x,

        y:
          initialPosition.y,

        scale: 0.975,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.22,
      }}
      transition={{
        duration: 0.7,

        delay:
          index * 0.07,

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={`
        group

        relative

        overflow-hidden

        bg-[#eeeeee]

        shadow-[0_8px_25px_rgba(0,0,0,0.06)]

        ${className}
      `}
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(max-width: 1100px) 45vw, 483px"
        className="
          object-cover
          object-center

          transition-transform
          duration-700
          ease-out

          group-hover:scale-[1.045]
        "
      />

      {/* hover overlay */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          bg-primary/0

          transition-all
          duration-500

          group-hover:bg-primary/[0.035]
        "
      />
    </motion.div>
  );
}

/* =========================================================
   TABLET IMAGE
========================================================= */

function TabletGalleryImage({
  item,
}: {
  item: GalleryItem;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="
        group

        relative

        aspect-[483/373]

        w-full

        overflow-hidden

        bg-[#eeeeee]

        shadow-[0_8px_26px_rgba(0,0,0,0.07)]
      "
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(min-width: 640px) and (max-width: 1023px) 46vw, 483px"
        className="
          object-cover

          transition-transform
          duration-700

          group-hover:scale-[1.04]
        "
      />
    </motion.div>
  );
}

/* =========================================================
   INDICATOR DOTS
========================================================= */

function SliderDots({
  activeIndex,
  goToSlide,
}: {
  activeIndex: number;

  goToSlide: (
    index: number
  ) => void;
}) {
  return (
    <div
      className="
        mt-5

        flex
        items-center
        justify-center

        gap-[8px]
      "
    >
      {galleryImages.map(
        (image, index) => {
          const active =
            index === activeIndex;

          return (
            <button
              key={image.id}
              type="button"
              onClick={() =>
                goToSlide(index)
              }
              aria-label={`View gallery image ${
                index + 1
              }`}
              className={`
                block

                rounded-full

                transition-all
                duration-300

                ${
                  active
                    ? `
                      h-[7px]
                      w-[26px]
                      bg-primary
                    `
                    : `
                      h-[7px]
                      w-[7px]

                      bg-black/20

                      hover:bg-primary/50
                    `
                }
              `}
            />
          );
        }
      )}
    </div>
  );
}