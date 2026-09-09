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

import {
  getPublicGalleryImageUrl,
  getPublicHomepageGallery,
  sortHomepageGalleryImages,
  type PublicHomepageGalleryImage,
} from "@/services/publicGalleryService";

/* =========================================================
   TYPES
========================================================= */

type GalleryItem = {
  id: number;

  image: string;

  alt: string;

  homepageOrder: number;
};


type AnimationDirection =
  | "left"
  | "right"
  | "top"
  | "bottom";


/* =========================================================
   NEXT IMAGE HELPER

   Gallery API images are served by FastAPI, for example:
   http://localhost:8000/uploads/gallery/example.jpg

   A small passthrough loader lets this component render
   backend images without requiring a hard-coded hostname
   in next.config.ts during local development.
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
   FALLBACK IMAGES

   These preserve the existing homepage design while the
   admin is still filling Homepage Positions 1–6.

   As soon as an Admin assigns a position through Gallery
   Management, that position is replaced by API data.
========================================================= */

const fallbackGalleryImages: GalleryItem[] = [
  {
    id: -1,
    image: "/images/g-1.png",
    alt: "Rosary School campus",
    homepageOrder: 1,
  },
  {
    id: -2,
    image: "/images/g-2.png",
    alt: "Rosary School student activity",
    homepageOrder: 2,
  },
  {
    id: -3,
    image: "/images/g-3.png",
    alt: "Students at Rosary School",
    homepageOrder: 3,
  },
  {
    id: -4,
    image: "/images/g-4.png",
    alt: "Rosary School classroom activity",
    homepageOrder: 4,
  },
  {
    id: -5,
    image: "/images/g-5.png",
    alt: "Students learning at Rosary School",
    homepageOrder: 5,
  },
  {
    id: -6,
    image: "/images/g-6.png",
    alt: "Rosary School building",
    homepageOrder: 6,
  },
];


/* =========================================================
   BUILD THE SIX HOMEPAGE POSITIONS
========================================================= */

function buildHomepageGallery(
  apiImages:
    PublicHomepageGalleryImage[]
): GalleryItem[] {
  const sorted =
    sortHomepageGalleryImages(
      apiImages
    );

  return fallbackGalleryImages.map(
    (fallback) => {
      const apiImage =
        sorted.find(
          (image) =>
            image.homepage_order ===
            fallback.homepageOrder
        );

      if (!apiImage) {
        return fallback;
      }

      return {
        id:
          apiImage.id,

        image:
          getPublicGalleryImageUrl(
            apiImage.image_url
          ),

        alt:
          apiImage.alt_text,

        homepageOrder:
          apiImage.homepage_order,
      };
    }
  );
}


/* =========================================================
   COMPONENT
========================================================= */

export default function GallerySection() {
  const [
    galleryImages,
    setGalleryImages,
  ] = useState<GalleryItem[]>(
    fallbackGalleryImages
  );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    direction,
    setDirection,
  ] = useState(1);

  const [
    isPaused,
    setIsPaused,
  ] = useState(false);


  /* =========================================================
     LOAD HOMEPAGE GALLERY

     API:
     GET /api/v1/gallery/homepage

     Positions:
     1 -> Large Left Top
     2 -> Small Left Bottom 1
     3 -> Small Left Bottom 2
     4 -> Small Right Top 1
     5 -> Small Right Top 2
     6 -> Large Right Bottom
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadHomepageGallery =
      async () => {
        try {
          const response =
            await getPublicHomepageGallery();

          if (!mounted) {
            return;
          }

          setGalleryImages(
            buildHomepageGallery(
              response.items
            )
          );

          setActiveIndex(0);
        } catch (error) {
          /*
           * Keep the existing local images as a safe
           * visual fallback if the public Gallery API is
           * temporarily unavailable.
           */

          console.error(
            "Unable to load homepage Gallery:",
            error
          );
        }
      };

    void loadHomepageGallery();

    return () => {
      mounted = false;
    };
  }, []);


  /* =========================================================
     KEEP ACTIVE INDEX SAFE
  ========================================================= */

  useEffect(() => {
    if (
      galleryImages.length === 0
    ) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex(
      (current) =>
        Math.min(
          current,
          galleryImages.length - 1
        )
    );
  }, [
    galleryImages.length,
  ]);


  /* =========================================================
     AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (
      isPaused ||
      galleryImages.length <= 1
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
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
  }, [
    isPaused,
    galleryImages.length,
  ]);

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
    galleryImages[
      Math.min(
        activeIndex,
        galleryImages.length - 1
      )
    ];

  const nextImage =
    galleryImages[
      galleryImages.length > 0
        ? (
            activeIndex + 1
          ) %
          galleryImages.length
        : 0
    ];


  if (
    !activeImage ||
    !nextImage
  ) {
    return null;
  }


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
          opacity-[0.95]
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(17,17,17,0.065) 1px, transparent 1px),
            linear-gradient(90deg, rgba(17,17,17,0.065) 1px, transparent 1px)
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
            items={
              galleryImages
            }
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
                rounded-md

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
                    loader={
                      isRemoteImage(
                        activeImage.image
                      )
                        ? remoteImageLoader
                        : undefined
                    }
                    unoptimized={
                      isRemoteImage(
                        activeImage.image
                      )
                    }
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
              items={
                galleryImages
              }
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
            href="/gallery"
            className="
              group

              inline-flex

              min-h-[46px]
              min-w-[170px]

              items-center
              justify-center

              rounded-md

              bg-[#0075FF]

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

              active:translate-y-0
              active:scale-[0.98]
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
        rounded-md

        bg-[#eeeeee]

        shadow-[0_8px_25px_rgba(0,0,0,0.06)]

        ${className}
      `}
    >
      <Image
        loader={
          isRemoteImage(
            item.image
          )
            ? remoteImageLoader
            : undefined
        }
        unoptimized={
          isRemoteImage(
            item.image
          )
        }
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
        rounded-md

        bg-[#eeeeee]

        shadow-[0_8px_26px_rgba(0,0,0,0.07)]
      "
    >
      <Image
        loader={
          isRemoteImage(
            item.image
          )
            ? remoteImageLoader
            : undefined
        }
        unoptimized={
          isRemoteImage(
            item.image
          )
        }
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
  items,
  activeIndex,
  goToSlide,
}: {
  items: GalleryItem[];

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
      {items.map(
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