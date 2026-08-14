"use client";

import Image from "next/image";

import {
  AnimatePresence,
  motion,
  Variants,
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
   SMOOTH ANIMATION
========================================================= */

const smoothEase = [
  0.22,
  1,
  0.36,
  1,
] as const;

/* =========================================================
   WHOLE SECTION

   Controls the order in which the different parts
   appear when this section comes into the viewport.
========================================================= */

const sectionVariants: Variants = {
  hidden: {
    opacity: 1,
  },

  visible: {
    opacity: 1,

    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.18,
    },
  },
};

/* =========================================================
   LARGE ROSARY TEXT
========================================================= */

const rosaryVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -45,
    y: 8,
    filter: "blur(5px)",
  },

  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 1.15,
      ease: smoothEase,
    },
  },
};

/* =========================================================
   SCHOOL VERTICAL TEXT
========================================================= */

const schoolVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 38,
    y: 12,
    filter: "blur(5px)",
  },

  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 1.15,
      ease: smoothEase,
    },
  },
};

/* =========================================================
   SLIDER WRAPPER
========================================================= */

const sliderVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 38,
    scale: 0.985,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 1.05,
      ease: smoothEase,

      delayChildren: 0.18,
      staggerChildren: 0.15,
    },
  },
};

/* =========================================================
   INDICATORS
========================================================= */

const indicatorContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.8,
      ease: smoothEase,

      delayChildren: 0.08,
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
      duration: 0.55,
      ease: smoothEase,
    },
  },
};

/* =========================================================
   MOBILE TEXT
========================================================= */

const mobileTextContainer: Variants = {
  hidden: {},

  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.16,
    },
  },
};

const mobileTextVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    letterSpacing: "0.24em",
  },

  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.18em",

    transition: {
      duration: 0.8,
      ease: smoothEase,
    },
  },
};

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
          amount: 0.1,
        }}
        transition={{
          duration: 1.4,
          ease: smoothEase,
        }}
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

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.14,
        }}
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
        ==================================================== */}

        <motion.div
          variants={rosaryVariants}
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
          <motion.span
            initial={{
              opacity: 0,
              clipPath:
                "inset(0 100% 0 0)",
            }}
            whileInView={{
              opacity: 1,
              clipPath:
                "inset(0 0% 0 0)",
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1.3,
              delay: 0.15,
              ease: smoothEase,
            }}
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
          </motion.span>
        </motion.div>

        {/* ===================================================
            SCHOOL VERTICAL TEXT
        ==================================================== */}

        <motion.div
          variants={schoolVariants}
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
          <motion.span
            initial={{
              opacity: 0,
              clipPath:
                "inset(0 0 100% 0)",
            }}
            whileInView={{
              opacity: 1,
              clipPath:
                "inset(0 0 0% 0)",
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1.25,
              delay: 0.3,
              ease: smoothEase,
            }}
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
          </motion.span>
        </motion.div>

        {/* ===================================================
            SLIDER
        ==================================================== */}

        <motion.div
          variants={sliderVariants}
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
            variants={{
              hidden: {
                opacity: 0,
                y: 32,
                scale: 0.98,
              },

              visible: {
                opacity: 1,
                y: 0,
                scale: 1,

                transition: {
                  duration: 1,
                  ease: smoothEase,
                },
              },
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
                key={currentSlide.id}
                custom={direction}
                variants={{
                  enter: (
                    direction: number
                  ) => ({
                    opacity: 0,

                    x:
                      direction > 0
                        ? 42
                        : -42,

                    scale:
                      1.025,

                    filter:
                      "blur(2px)",
                  }),

                  center: {
                    opacity: 1,

                    x: 0,

                    scale: 1,

                    filter:
                      "blur(0px)",
                  },

                  exit: (
                    direction: number
                  ) => ({
                    opacity: 0,

                    x:
                      direction > 0
                        ? -42
                        : 42,

                    scale:
                      1.015,

                    filter:
                      "blur(2px)",
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration:
                    0.85,

                  ease:
                    smoothEase,
                }}
                className="
                  absolute
                  inset-0
                "
              >
                {/* ===========================================
                    IMAGE
                ============================================ */}

                <motion.div
                  initial={{
                    scale: 1.04,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: smoothEase,
                  }}
                  className="
                    absolute
                    inset-0
                  "
                >
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 94vw, 844px"
                    className="
                      object-cover
                      object-center
                    "
                  />
                </motion.div>

                {/* ===========================================
                    BOTTOM GRADIENT
                ============================================ */}

                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15,
                    ease: smoothEase,
                  }}
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
                    y: 24,
                    filter:
                      "blur(4px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter:
                      "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: -12,
                    filter:
                      "blur(3px)",
                  }}
                  transition={{
                    duration:
                      0.9,

                    delay:
                      0.25,

                    ease:
                      smoothEase,
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
                  <motion.h3
                    initial={{
                      opacity: 0,
                      y: 14,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.35,
                      ease: smoothEase,
                    }}
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
                  </motion.h3>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* =================================================
              INDICATORS
          ================================================== */}

          <motion.div
            variants={
              indicatorContainerVariants
            }
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
                  <motion.button
                    variants={
                      indicatorVariants
                    }
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

                    whileHover={{
                      scale: 1.12,
                    }}

                    whileTap={{
                      scale: 0.9,
                    }}

                    transition={{
                      duration: 0.25,
                    }}

                    className={`
                      block

                      rounded-full

                      transition-all
                      duration-500

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
          </motion.div>
        </motion.div>

        {/* ===================================================
            MOBILE

            Same design.
            Only smooth text reveal added.
        ==================================================== */}

        <motion.div
          variants={
            mobileTextContainer
          }
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
          {/* ROSARY */}

          <motion.span
            variants={
              mobileTextVariants
            }
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
          </motion.span>

          {/* SCHOOL */}

          <motion.span
            variants={
              mobileTextVariants
            }
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
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}