"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  Variants,
} from "framer-motion";

/* =========================================================
   TYPES
========================================================= */

type BannerButton = {
  label: string;
  href: string;
  variant: "primary" | "outline";
};

type Banner = {
  id: number;
  indicator: string;
  title: string;
  desktopImage: string;
  mobileImage: string;
  imageAlt: string;
  buttons: BannerButton[];
};

/* =========================================================
   BANNERS
========================================================= */

const banners: Banner[] = [
  {
    id: 1,
    indicator: "OUR PURPOSE",

    title:
      "EDUCATING FOR KNOWLEDGE, TRUTH\n& HUMAN DEVELOPMENT",

    desktopImage: "/images/banner-01.png",
    mobileImage: "/images/banner-mobile-01.png",

    imageAlt: "Rosary School students",

    buttons: [
      {
        label: "EXPLORE ROSARY",
        href: "/about",
        variant: "primary",
      },
      {
        label: "ADMISSION",
        href: "/admissions",
        variant: "outline",
      },
    ],
  },

  {
    id: 2,
    indicator: "ACADEMIC EXCELLENCE",

    title:
      "CELEBRATING OUR\nACHIEVERS",

    desktopImage: "/images/banner-01.png",
    mobileImage: "/images/banner-mobile-01.png",

    imageAlt: "Rosary School academic excellence",

    buttons: [
      {
        label: "OUR ACHIEVEMENTS",
        href: "/achievements",
        variant: "primary",
      },
      {
        label: "ACADEMICS",
        href: "/academics",
        variant: "outline",
      },
    ],
  },

  {
    id: 3,
    indicator: "STUDENT LIFE",

    title:
      "LEARN. DISCOVER.\nLEAD.",

    desktopImage: "/images/banner-01.png",
    mobileImage: "/images/banner-mobile-01.png",

    imageAlt: "Student life at Rosary School",

    buttons: [
      {
        label: "STUDENT CORNER",
        href: "/community/student-corner",
        variant: "primary",
      },
      {
        label: "EXPLORE CLUBS",
        href: "/academics/clubs",
        variant: "outline",
      },
    ],
  },

  {
    id: 4,
    indicator: "OUR HERITAGE",

    title:
      "A LEGACY OF EDUCATION\nSINCE 1950",

    desktopImage: "/images/banner-01.png",
    mobileImage: "/images/banner-mobile-01.png",

    imageAlt: "Rosary School heritage",

    buttons: [
      {
        label: "OUR HISTORY",
        href: "/about",
        variant: "primary",
      },
    ],
  },

  {
    id: 5,
    indicator: "ADMISSIONS",

    title:
      "BEGIN YOUR JOURNEY\nWITH ROSARY",

    desktopImage: "/images/banner-01.png",
    mobileImage: "/images/banner-mobile-01.png",

    imageAlt: "Rosary School admissions",

    buttons: [
      {
        label: "ADMISSION",
        href: "/admissions",
        variant: "primary",
      },
      {
        label: "CONTACT US",
        href: "/contact-us",
        variant: "outline",
      },
    ],
  },
];

/* =========================================================
   SMOOTH ANIMATION
========================================================= */

const smoothEase: [number, number, number, number] = [
  0.22,
  1,
  0.36,
  1,
];

/* Whole content stagger */

const contentContainer: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.15,
    },
  },

  exit: {
    opacity: 0,

    transition: {
      duration: 0.35,
      ease: smoothEase,
    },
  },
};

/* Every text element */

const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(5px)",
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

/* Smaller label animation */

const labelReveal: Variants = {
  hidden: {
    opacity: 0,
    x: -18,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.8,
      ease: smoothEase,
    },
  },
};

/* Button animation */

const buttonReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.75,
      ease: smoothEase,
    },
  },
};

/* Right indicator list */

const indicatorContainer: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const indicatorItem: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.75,
      ease: smoothEase,
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeBanner = banners[activeIndex];

  /* =======================================================
     AUTO SLIDER
  ======================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) =>
        current === banners.length - 1
          ? 0
          : current + 1
      );
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section
      aria-label="Rosary School Highlights"
      className="
        relative
        h-[680px]
        w-full
        overflow-hidden
        bg-black

        md:h-[650px]
        lg:h-[680px]
        xl:h-[720px]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGES
      ====================================================== */}

      {banners.map((banner, index) => {
        const active = activeIndex === index;

        return (
          <div
            key={banner.id}
            className={`
              absolute
              inset-0

              transition-opacity
              duration-[1200ms]
              ease-in-out

              ${
                active
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }
            `}
          >
            {/* DESKTOP IMAGE */}

            <div className="absolute inset-0 hidden md:block">
              <Image
                src={banner.desktopImage}
                alt={banner.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="
                  object-cover
                  object-center
                "
              />
            </div>

            {/* MOBILE IMAGE */}

            <div className="absolute inset-0 md:hidden">
              <Image
                src={banner.mobileImage}
                alt={banner.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="
                  object-cover
                  object-center
                "
              />
            </div>
          </div>
        );
      })}

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          h-full
          w-full
          max-w-[1440px]
        "
      >
        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeBanner.id}

            variants={contentContainer}

            initial="hidden"
            animate="visible"
            exit="exit"

            className="
              absolute
              bottom-[75px]
              left-[24px]
              right-[24px]

              sm:left-[34px]
              sm:right-auto

              md:bottom-[75px]
              md:max-w-[520px]

              lg:bottom-[82px]
              lg:left-[42px]

              xl:left-[45px]
            "
          >
            {/* ===============================================
                MOBILE LABEL
            ================================================ */}

            <motion.div
              variants={labelReveal}
              className="
                mb-[12px]
                flex
                items-center
                gap-[9px]

                lg:hidden
              "
            >
              {/* BLUE SMALL LINE */}

              <motion.span
                initial={{
                  scaleX: 0,
                }}
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: smoothEase,
                }}
                style={{
                  transformOrigin: "left center",
                }}
                className="
                  h-[2px]
                  w-[30px]
                  bg-[#0075FF]
                "
              />

              {/* LABEL */}

              <span
                className="
                  font-secondary
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[1.2px]
                  !text-white
                "
              >
                {activeBanner.indicator}
              </span>
            </motion.div>

            {/* ===============================================
                TITLE
            ================================================ */}

            <motion.h1
              variants={textReveal}
              className="
                m-0
                whitespace-pre-line

                font-secondary
                text-[27px]
                font-semibold
                uppercase
                leading-[1.08]
                tracking-[-0.5px]

                !text-white

                sm:text-[30px]

                md:text-[27px]

                lg:text-[25px]

                xl:text-[28px]
              "
            >
              {activeBanner.title}
            </motion.h1>

            {/* ===============================================
                BLUE + WHITE LINE
            ================================================ */}

            <motion.div
              variants={textReveal}
              className="
                mt-[10px]
                flex
                h-[2px]
                w-[125px]
              "
            >
              <motion.div
                initial={{
                  scaleX: 0,
                }}
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: smoothEase,
                }}
                style={{
                  transformOrigin: "left center",
                }}
                className="
                  flex
                  h-full
                  w-full
                "
              >
                <span
                  className="
                    h-full
                    w-[55px]
                    bg-[#0075FF]
                  "
                />

                <span
                  className="
                    h-full
                    flex-1
                    bg-white/60
                  "
                />
              </motion.div>
            </motion.div>

            {/* =================================================
                NO PARAGRAPH
            ================================================= */}

            {/* ===============================================
                BUTTONS
            ================================================ */}

            <motion.div
              variants={contentContainer}
              className="
                mt-[22px]
                flex
                flex-wrap
                items-center
                gap-[12px]
              "
            >
              {activeBanner.buttons.map((button) => (
                <motion.div
                  key={button.label}
                  variants={buttonReveal}

                  whileHover={{
                    y: -3,
                    scale: 1.02,
                  }}

                  whileTap={{
                    scale: 0.97,
                  }}

                  transition={{
                    duration: 0.3,
                    ease: smoothEase,
                  }}
                >
                  <Link
                    href={button.href}
                    className={
                      button.variant === "primary"
                        ? `
                          flex
                          h-[40px]
                          min-w-[145px]
                          items-center
                          justify-center

                          bg-[#0075FF]
                          rounded-md

                          px-[20px]

                          font-secondary
                          text-[12px]
                          font-semibold

                          !text-white

                          transition-all
                          duration-300

                          hover:bg-[#0067E5]
                          hover:!text-white

                          sm:h-[42px]
                        `
                        : `
                          flex
                          h-[40px]
                          min-w-[125px]
                          items-center
                          justify-center

                          border
                          border-white

                          bg-transparent

                          px-[20px]

                          font-secondary
                          rounded-md
                          text-[12px]
                          font-semibold

                          !text-white

                          transition-all
                          duration-300

                          hover:border-[#0075FF]
                          hover:bg-[#0075FF]
                          hover:!text-white

                          sm:h-[42px]
                        `
                    }
                  >
                    {button.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* =================================================
            RIGHT DESKTOP INDICATORS
        ================================================= */}

        <motion.div
          variants={indicatorContainer}
          initial="hidden"
          whileInView="visible"

          viewport={{
            once: true,
            amount: 0.3,
          }}

          className="
            absolute
            right-[28px]
            top-1/2

            hidden
            w-[230px]
            -translate-y-[10%]

            lg:block

            xl:right-[36px]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-[22px]
            "
          >
            {banners.map((banner, index) => {
              const active =
                activeIndex === index;

              return (
                <motion.div
                  key={banner.id}
                  variants={indicatorItem}
                >
                  <motion.button
                    type="button"
                    aria-label={`Show ${banner.indicator}`}

                    onClick={() =>
                      setActiveIndex(index)
                    }

                    whileHover={{
                      x: -3,
                    }}

                    transition={{
                      duration: 0.3,
                      ease: smoothEase,
                    }}

                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-between
                      gap-[15px]

                      border-0
                      bg-transparent
                      p-0

                      text-left
                    "
                  >
                    {/* INDICATOR LABEL */}

                    <span
                      className={`
                        relative
                        whitespace-nowrap

                        font-secondary
                        text-[12px]
                        font-medium
                        uppercase

                        transition-colors
                        duration-300

                        ${
                          active
                            ? "!text-white"
                            : "!text-white/60 group-hover:!text-white"
                        }
                      `}
                    >
                      {banner.indicator}

                      {/* BLUE UNDERLINE */}

                      <span
                        className={`
                          absolute
                          -bottom-[5px]
                          left-0

                          h-[1.5px]
                          bg-[#0075FF]

                          transition-all
                          duration-500

                          ${
                            active
                              ? "w-full"
                              : "w-0"
                          }
                        `}
                      />
                    </span>

                    {/* DOT */}

                    <span
                      className="
                        relative

                        flex
                        h-[10px]
                        w-[32px]

                        items-center
                        justify-end
                      "
                    >
                      {/* ACTIVE LINE */}

                      <span
                        className={`
                          absolute
                          right-[4px]

                          h-[1.5px]
                          bg-[#0075FF]

                          transition-all
                          duration-500

                          ${
                            active
                              ? "w-[23px] opacity-100"
                              : "w-0 opacity-0"
                          }
                        `}
                      />

                      {/* DOT */}

                      <span
                        className={`
                          relative
                          z-10

                          h-[5px]
                          w-[5px]
                          rounded-full

                          transition-all
                          duration-500

                          ${
                            active
                              ? "bg-[#0075FF]"
                              : "bg-white/45"
                          }
                        `}
                      />
                    </span>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* =================================================
            MOBILE INDICATORS
        ================================================= */}

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
            duration: 0.9,
            delay: 0.5,
            ease: smoothEase,
          }}

          className="
            absolute
            bottom-[25px]
            left-[24px]
            right-[24px]

            flex
            items-center
            gap-[8px]

            lg:hidden
          "
        >
          {banners.map((banner, index) => {
            const active =
              activeIndex === index;

            return (
              <motion.button
                key={banner.id}
                type="button"
                aria-label={`Show banner ${index + 1}`}

                onClick={() =>
                  setActiveIndex(index)
                }

                whileTap={{
                  scale: 0.9,
                }}

                className="
                  flex
                  h-[12px]
                  items-center
                "
              >
                <span
                  className={`
                    block
                    h-[2px]

                    transition-all
                    duration-500

                    ${
                      active
                        ? "w-[36px] bg-[#0075FF]"
                        : "w-[13px] bg-white/50"
                    }
                  `}
                />
              </motion.button>
            );
          })}

          {/* MOBILE COUNTER */}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}

              initial={{
                opacity: 0,
                y: 7,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                y: -7,
              }}

              transition={{
                duration: 0.5,
                ease: smoothEase,
              }}

              className="
                ml-auto

                font-secondary
                text-[11px]
                font-semibold

                !text-white/60
              "
            >
              <span className="!text-white">
                {String(activeIndex + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <span className="mx-[5px] !text-white/40">
                /
              </span>

              <span>
                {String(banners.length).padStart(
                  2,
                  "0"
                )}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}