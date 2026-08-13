"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  useEffect,
  useState,
} from "react";

/* =========================================================
   SLIDER DATA
========================================================= */

const slides = [
  {
    id: 1,
    title: "Quarterly Examination\nTimetable",
    image: "/images/rosary-01.png",
    alt: "Rosary School campus",
  },
  {
    id: 2,
    title: "Parent–Teacher\nMeeting",
    image: "/images/rosary-01.png",
    alt: "Rosary School parent teacher meeting",
  },
  {
    id: 3,
    title: "Holiday\nAnnouncement",
    image: "/images/rosary-01.png",
    alt: "Rosary School holiday announcement",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function RosaryShowcase() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [direction, setDirection] =
    useState(1);

  /* =========================================================
     AUTO PLAY
  ========================================================= */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDirection(1);

      setActiveIndex(
        (current) =>
          (current + 1) %
          slides.length
      );
    }, 4500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /* =========================================================
     INDICATOR CLICK
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

  const currentSlide =
    slides[activeIndex];

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#fafafa]

        pb-10
      "
    >
      {/* =====================================================
          DOTTED BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.45]
        "
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",

          backgroundSize:
            "24px 24px",
        }}
      />

      {/* =====================================================
          BLUE BLUR
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute

          bottom-[-100px]
          left-[-120px]

          h-[350px]
          w-[350px]

          rounded-full

          bg-[#0075FF]/20

          blur-[120px]

          lg:h-[430px]
          lg:w-[430px]
        "
      />

      {/* =====================================================
          MAIN WRAPPER
      ====================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto
          w-full

          max-w-[1260px]

          lg:pt-[125px]
          xl:pt-[145px]
      "
      >
        {/* ===================================================
            LARGE ROSARY TEXT

            DESKTOP / TABLET ONLY

            Extra vertical room above slider prevents
            the word from colliding with the image.
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: -30,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
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

            left-[8px]
            top-[35px]

            z-0

            hidden
            select-none

            lg:block
          "
        >
          <span
            className="
              block

              whitespace-nowrap

              font-primary
              font-normal

              text-[92px]

              leading-[0.85]

              tracking-[0.015em]

              text-transparent

              xl:text-[122px]

              2xl:text-[122px]
            "
            style={{
              WebkitTextStroke:
                "1px rgba(0,117,255,0.44)",
            }}
          >
            Rosary
          </span>
        </motion.div>

        {/* ===================================================
            SCHOOL VERTICAL TEXT
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 25,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.12,

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

            right-[16px]

            top-[155px]

            z-0

            hidden
            select-none

            lg:block
          "
        >
          <span
            className="
              block

              whitespace-nowrap

              font-primary
              font-normal

              text-[62px]

              uppercase

              leading-none

              tracking-[0.025em]

              text-transparent

              xl:text-[94px]

              2xl:text-[100px]
            "
            style={{
              WebkitTextStroke:
                "1px rgba(17,17,17,0.38)",

              writingMode:
                "vertical-rl",

              textOrientation:
                "mixed",
            }}
          >
            School
          </span>
        </motion.div>

        {/* ===================================================
            SLIDER
        ==================================================== */}

        <div
          className="
            relative
            z-10

            mx-auto
            w-full

            max-w-[844px]
          "
        >
          {/* =================================================
              IMAGE FRAME
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              relative

              aspect-[844/470]

              w-full

              overflow-hidden

              bg-black

              shadow-[0_8px_24px_rgba(0,0,0,0.18)]
            "
          >
            <AnimatePresence
              initial={false}
              mode="wait"
              custom={direction}
            >
              <motion.div
                key={
                  currentSlide.id
                }
                custom={direction}
                variants={{
                  enter: (
                    direction: number
                  ) => ({
                    opacity: 0,

                    x:
                      direction > 0
                        ? 55
                        : -55,

                    scale:
                      1.025,
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
                        ? -55
                        : 55,

                    scale:
                      1.015,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration:
                    0.65,

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
                {/* ===========================================
                    IMAGE
                ============================================ */}

                <Image
                  src={
                    currentSlide.image
                  }
                  alt={
                    currentSlide.alt
                  }
                  fill
                  priority={
                    activeIndex === 0
                  }

                  /* IMPORTANT:
                     Keep sizes in ONE LINE.
                  */
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 94vw, 844px"

                  className="
                    object-cover
                    object-center
                  "
                />

                {/* ===========================================
                    BOTTOM GRADIENT
                ============================================ */}

                <div
                  className="
                    pointer-events-none

                    absolute

                    inset-x-0
                    bottom-0

                    h-[42%]

                    bg-gradient-to-t

                    from-black/65
                    via-black/15
                    to-transparent
                  "
                />

                {/* ===========================================
                    SLIDE TITLE
                ============================================ */}

                <motion.div
                  key={`text-${currentSlide.id}`}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration:
                      0.5,

                    delay:
                      0.2,

                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="
                    absolute

                    bottom-5
                    left-5

                    z-20

                    sm:bottom-6
                    sm:left-7

                    lg:bottom-8
                    lg:left-8
                  "
                >
                  <h3
                    className="
                      max-w-[220px]

                      whitespace-pre-line

                      font-primary

                      text-[17px]

                      font-semibold

                      leading-[1.02]

                      tracking-[-0.035em]

                      !text-white

                      drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]

                      sm:max-w-[280px]
                      sm:text-[20px]

                      md:text-[22px]

                      lg:max-w-[320px]
                      lg:text-[24px]
                    "
                    style={{
                      color:
                        "#ffffff",
                    }}
                  >
                    {
                      currentSlide.title
                    }
                  </h3>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* =================================================
              INDICATORS
          ================================================== */}

          <div
            className="
              mt-5

              flex
              items-center
              justify-center

              gap-[9px]
            "
          >
            {slides.map(
              (
                slide,
                index
              ) => {
                const active =
                  index ===
                  activeIndex;

                return (
                  <button
                    key={
                      slide.id
                    }
                    type="button"

                    onClick={() =>
                      goToSlide(
                        index
                      )
                    }

                    aria-label={`Go to slide ${
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
                            w-[30px]
                            bg-primary
                          `
                          : `
                            h-[7px]
                            w-[7px]
                            bg-[#BFC1C4]

                            hover:bg-primary/50
                          `
                      }
                    `}
                  />
                );
              }
            )}
          </div>
        </div>

        {/* ===================================================
            MOBILE

            NO DESIGN CHANGE.

            This is exactly the same simple bottom
            Rosary / School treatment you currently have.
        ==================================================== */}

        <div
          aria-hidden="true"
          className="
            mt-5

            flex
            items-center
            justify-center

            gap-3

            lg:hidden
          "
        >
          <span
            className="
              font-primary

              text-[11px]

              font-medium

              uppercase

              tracking-[0.18em]

              text-primary/50
            "
          >
            Rosary
          </span>

          <span
            className="
              font-primary

              text-[11px]

              font-medium

              uppercase

              tracking-[0.18em]

              text-black/30
            "
          >
            School
          </span>
        </div>
      </div>
    </section>
  );
}