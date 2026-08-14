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

    desktopImage: "/images/banner1.png",
    mobileImage: "/images/banner-mobile-1.png",

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

    desktopImage: "/images/banner-2.png",
    mobileImage: "/images/banner-mobile-2.png",

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

    desktopImage: "/images/banner-3.png",
    mobileImage: "/images/banner-mobile-3.png",

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

    desktopImage: "/images/banner-4.png",
    mobileImage: "/images/banner-mobile-4.png",

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

    desktopImage: "/images/banner-5.png",
    mobileImage: "/images/banner-mobile-5.png",

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
   ANIMATION
========================================================= */

const smoothEase = [
  0.22,
  1,
  0.36,
  1,
] as const;

const contentContainer: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.14,
    },
  },

  exit: {
    opacity: 0,

    transition: {
      duration: 0.3,
      ease: smoothEase,
    },
  },
};

const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: "blur(4px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.85,
      ease: smoothEase,
    },
  },
};

const labelReveal: Variants = {
  hidden: {
    opacity: 0,
    x: -16,
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

const buttonReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.97,
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

const indicatorContainer: Variants = {
  hidden: {
    opacity: 0,
    x: 18,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.8,
      delayChildren: 0.25,
      staggerChildren: 0.08,
      ease: smoothEase,
    },
  },
};

const indicatorItem: Variants = {
  hidden: {
    opacity: 0,
    x: 15,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.65,
      ease: smoothEase,
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const activeBanner =
    banners[activeIndex];

  /* =======================================================
     AUTO SLIDER
  ======================================================= */

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setActiveIndex(
          (current) =>
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
        h-[600px]
        w-full
        overflow-hidden
        bg-black
      "
    >
      {/* =====================================================
          BANNER IMAGES
      ====================================================== */}

      {banners.map((banner, index) => {
        const active =
          activeIndex === index;

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
            {/* =================================================
                DESKTOP / LAPTOP

                SOURCE IMAGE:
                1440 × 600
            ================================================= */}

            <div
              className="
                absolute
                inset-0
                hidden
                md:block
              "
            >
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

            {/* =================================================
                MOBILE

                SOURCE IMAGE:
                420 × 600
            ================================================= */}

            <div
              className="
                absolute
                inset-0
                md:hidden
              "
            >
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
          VERY LIGHT BOTTOM GRADIENT

          Only for text readability.
          Image remains bright.
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-[2]

          h-[45%]

          bg-gradient-to-t
          from-black/45
          via-black/10
          to-transparent

          md:h-[46%]
        "
      />

      {/* =====================================================
          SUBTLE LEFT GRADIENT

          NOT full black overlay.
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          z-[2]

          w-[68%]

          bg-gradient-to-r
          from-black/15
          via-black/[0.04]
          to-transparent

          lg:w-[52%]
        "
      />

      {/* =====================================================
          CONTENT WRAPPER
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

              bottom-[68px]

              left-[20px]
              right-[20px]

              z-20

              sm:left-[30px]
              sm:right-auto

              md:bottom-[70px]
              md:max-w-[570px]

              lg:left-[45px]

              xl:left-[55px]
            "
          >
            {/* ===============================================
                MOBILE / TABLET LABEL
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
                  transformOrigin:
                    "left center",
                }}
                className="
                  h-[2px]
                  w-[30px]

                  bg-[#0075FF]
                "
              />

              <span
                className="
                  font-secondary

                  text-[11px]
                  font-semibold

                  uppercase

                  tracking-[1.2px]

                  !text-white

                  drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]
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

                max-w-[600px]

                whitespace-pre-line

                font-secondary

                text-[25px]
                font-semibold

                uppercase

                leading-[1.1]

                tracking-[-0.5px]

                !text-white

                drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)]

                sm:text-[29px]

                md:text-[30px]

                lg:text-[30px]

                xl:text-[32px]
              "
            >
              {activeBanner.title}
            </motion.h1>

            {/* ===============================================
                BLUE / WHITE LINE
            ================================================ */}

            <motion.div
              variants={textReveal}
              className="
                mt-[12px]

                flex

                h-[2px]
                w-[140px]
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
                  delay: 0.45,
                  ease: smoothEase,
                }}
                style={{
                  transformOrigin:
                    "left center",
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
                    w-[60px]

                    bg-[#0075FF]
                  "
                />

                <span
                  className="
                    h-full
                    flex-1

                    bg-white/80
                  "
                />
              </motion.div>
            </motion.div>

            {/* ===============================================
                BUTTONS
            ================================================ */}

            <motion.div
              variants={contentContainer}
              className="
                mt-[24px]

                flex
                flex-wrap

                items-center

                gap-[10px]

                sm:gap-[12px]
              "
            >
              {activeBanner.buttons.map(
                (button) => (
                  <motion.div
                    key={button.label}
                    variants={buttonReveal}
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    <Link
                      href={button.href}
                      className={
                        button.variant ===
                        "primary"
                          ? `
                            flex

                            h-[42px]
                            min-w-[145px]

                            items-center
                            justify-center

                            rounded-[8px]

                            bg-[#0075FF]

                            px-[20px]

                            font-secondary

                            text-[11px]
                            font-semibold

                            !text-white

                            shadow-[0_8px_22px_rgba(0,117,255,0.24)]

                            transition-all
                            duration-300

                            hover:bg-[#0067E5]

                            sm:text-[12px]
                          `
                          : `
                            flex

                            h-[42px]
                            min-w-[130px]

                            items-center
                            justify-center

                            rounded-[8px]

                            border
                            border-white/90

                            bg-black/5

                            px-[20px]

                            font-secondary

                            text-[11px]
                            font-semibold

                            !text-white

                            backdrop-blur-[2px]

                            transition-all
                            duration-300

                            hover:border-[#0075FF]
                            hover:bg-[#0075FF]

                            sm:text-[12px]
                          `
                      }
                    >
                      {button.label}
                    </Link>
                  </motion.div>
                )
              )}
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

            z-20

            hidden

            w-[245px]

            -translate-y-1/2

            rounded-[12px]

            border
            border-white/15

            bg-black/[0.10]

            px-[16px]
            py-[18px]

            backdrop-blur-[3px]

            lg:block

            xl:right-[42px]
          "
        >
          <div
            className="
              flex
              flex-col

              gap-[20px]
            "
          >
            {banners.map(
              (
                banner,
                index
              ) => {
                const active =
                  activeIndex ===
                  index;

                return (
                  <motion.div
                    key={banner.id}
                    variants={
                      indicatorItem
                    }
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

                        gap-[14px]

                        border-0

                        bg-transparent

                        p-0

                        text-left
                      "
                    >
                      {/* LABEL */}

                      <span
                        className={`
                          relative

                          whitespace-nowrap

                          font-secondary

                          text-[11px]
                          font-medium

                          uppercase

                          tracking-[0.02em]

                          drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]

                          transition-all
                          duration-500

                          ${
                            active
                              ? "!text-white"
                              : "!text-white/70 group-hover:!text-white"
                          }
                        `}
                      >
                        {banner.indicator}

                        <span
                          className={`
                            absolute

                            -bottom-[6px]
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

                      {/* RIGHT INDICATOR */}

                      <span
                        className="
                          relative

                          flex

                          h-[12px]
                          w-[38px]

                          shrink-0

                          items-center
                          justify-end
                        "
                      >
                        <span
                          className={`
                            absolute

                            right-[5px]

                            h-[1.5px]

                            bg-[#0075FF]

                            transition-all
                            duration-500

                            ${
                              active
                                ? "w-[27px] opacity-100"
                                : "w-0 opacity-0"
                            }
                          `}
                        />

                        <span
                          className={`
                            relative
                            z-10

                            rounded-full

                            transition-all
                            duration-500

                            ${
                              active
                                ? `
                                  h-[7px]
                                  w-[7px]

                                  bg-[#0075FF]

                                  shadow-[0_0_8px_rgba(0,117,255,0.7)]
                                `
                                : `
                                  h-[5px]
                                  w-[5px]

                                  bg-white/75
                                `
                            }
                          `}
                        />
                      </span>
                    </motion.button>
                  </motion.div>
                );
              }
            )}
          </div>
        </motion.div>

        {/* =================================================
            MOBILE INDICATORS
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.85,
            delay: 0.45,
            ease: smoothEase,
          }}
          className="
            absolute

            bottom-[20px]

            left-[20px]
            right-[20px]

            z-20

            flex

            items-center

            gap-[8px]

            lg:hidden

            sm:left-[30px]
            sm:right-[30px]
          "
        >
          {banners.map(
            (
              banner,
              index
            ) => {
              const active =
                activeIndex ===
                index;

              return (
                <motion.button
                  key={banner.id}
                  type="button"
                  aria-label={`Show banner ${
                    index + 1
                  }`}
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  whileTap={{
                    scale: 0.9,
                  }}
                  className="
                    flex

                    h-[14px]

                    items-center
                  "
                >
                  <span
                    className={`
                      block

                      h-[2px]

                      rounded-full

                      transition-all
                      duration-500

                      ${
                        active
                          ? `
                            w-[36px]
                            bg-[#0075FF]
                          `
                          : `
                            w-[14px]
                            bg-white/80
                          `
                      }
                    `}
                  />
                </motion.button>
              );
            }
          )}

          {/* COUNTER */}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -6,
              }}
              transition={{
                duration: 0.4,
                ease: smoothEase,
              }}
              className="
                ml-auto

                font-secondary

                text-[11px]
                font-semibold

                drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]

                !text-white/65
              "
            >
              <span className="!text-white">
                {String(
                  activeIndex + 1
                ).padStart(2, "0")}
              </span>

              <span className="mx-[5px] !text-white/45">
                /
              </span>

              <span>
                {String(
                  banners.length
                ).padStart(2, "0")}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}