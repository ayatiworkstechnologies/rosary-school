"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CurriculumIntro() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white

        py-[40px]

        sm:py-[50px]

        lg:py-[65px]
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[120px]
          top-[50%]

          h-[300px]
          w-[300px]

          -translate-y-1/2

          rounded-full
          bg-[#0075FF]/[0.025]

          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-[100px]
          top-[20px]

          h-[260px]
          w-[260px]

          rounded-full
          bg-[#0075FF]/[0.02]

          blur-[90px]
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 35,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 1.05,
          ease,
        }}
        className="
          relative
          z-10

          mx-auto

          w-full
          max-w-[1240px]

          px-[16px]

          sm:px-[26px]

          lg:px-[40px]
        "
      >
        {/* =================================================
            CARD
        ================================================= */}

        <div
          className="
            relative
            overflow-hidden

            rounded-[8px]

            border
            border-[#E8EDF3]

            bg-white

            px-[20px]
            py-[26px]

            shadow-[0_16px_45px_rgba(26,50,80,0.04)]

            sm:px-[28px]
            sm:py-[32px]

            md:px-[36px]
            md:py-[38px]

            lg:px-[50px]
            lg:py-[42px]
          "
        >
          {/* =================================================
              TOP BLUE ACCENT
          ================================================= */}

          <motion.span
            initial={{
              width: 0,
            }}
            whileInView={{
              width: 58,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease,
            }}
            className="
              absolute
              left-0
              top-0

              h-[2px]

              bg-[#0075FF]
            "
          />

          {/* =================================================
              GRID
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1

              gap-[30px]

              md:grid-cols-[1.15fr_0.85fr]
              md:items-center

              md:gap-[38px]

              lg:grid-cols-[1.35fr_0.65fr]
              lg:gap-[55px]
            "
          >
            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: -35,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 1,
                delay: 0.1,
                ease,
              }}
              className="
                order-2

                md:order-1
              "
            >
              {/* CHIP */}

              <motion.span
                initial={{
                  opacity: 0,
                  y: 12,
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
                  delay: 0.15,
                  ease,
                }}
                className="
                  inline-flex

                  rounded-[3px]

                  bg-[#F0F7FF]

                  px-[7px]
                  py-[4px]

                  font-secondary
                  text-[9px]
                  font-medium
                  leading-none

                  text-[#0075FF]

                  sm:text-[13px] mb-3
                "
              >
                Curriculum
              </motion.span>

              {/* TITLE */}

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 18,
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
                  delay: 0.2,
                  ease,
                }}
                className="
                  mt-[12px]

                  font-primary

                  text-[25px]
                  font-semibold
                  leading-[1.15]
                  tracking-[-0.6px]

                  !text-[#111111]

                  sm:text-[29px]

                  lg:text-[34px] pb-4
                "
              >
                Learning Designed for Every Stage
              </motion.h2>

              {/* SUBTITLE */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 18,
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
                  delay: 0.28,
                  ease,
                }}
                className="
                  mt-[10px]

                  font-secondary

                  text-[13px]
                  font-medium
                  leading-[1.55]

                  text-[#0075FF]

                  sm:text-[14px] pb-2
                "
              >
                Building Knowledge. Encouraging Curiosity. Preparing for the
                Future.
              </motion.p>

              {/* DESCRIPTION */}

              <motion.p
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
                  duration: 1,
                  delay: 0.35,
                  ease,
                }}
                className="
                  mt-[15px]

                  max-w-[680px]

                  font-secondary

                  text-[12.5px]
                  font-normal
                  leading-[1.75]

                  text-[#666666]

                  sm:text-[13px]

                  lg:text-[14px]
                "
              >
                Our curriculum is thoughtfully designed to provide students
                with a strong academic foundation while encouraging
                creativity, critical thinking, communication, and independent
                learning. Each stage of education focuses on age-appropriate
                learning experiences that help students understand concepts,
                apply knowledge, and build confidence.
              </motion.p>

              {/* SECOND DESCRIPTION */}

              <motion.p
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
                  duration: 1,
                  delay: 0.42,
                  ease,
                }}
                className="
                  mt-[9px]

                  max-w-[680px]

                  font-secondary

                  text-[12.5px]
                  font-normal
                  leading-[1.75]

                  text-[#666666]

                  sm:text-[13px]

                  lg:text-[14px]
                "
              >
                Along with core academic subjects, students are encouraged to
                explore practical learning, collaborative activities, digital
                skills, arts, sports, and values-based education, creating a
                balanced learning experience for every child.
              </motion.p>

              {/* =================================================
                  HIGHLIGHTS
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
                  duration: 0.9,
                  delay: 0.5,
                  ease,
                }}
                className="
                  mt-[20px]

                  flex
                  flex-wrap

                  gap-[8px]
                "
              >
                {[
                  "Academic Excellence",
                  "Creative Learning",
                  "Practical Skills",
                  "Holistic Development",
                ].map((item) => (
                  <span
                    key={item}
                    className="
                      rounded-full

                      border
                      border-[#0075FF]/15

                      bg-[#F7FBFF]

                      px-[10px]
                      py-[6px]

                      font-secondary
                      text-[10px]
                      font-medium

                      text-[#4A5662]

                      sm:text-[11px]
                    "
                  >
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* =================================================
                RIGHT IMAGE
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: 35,
                scale: 0.96,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 1.15,
                delay: 0.12,
                ease,
              }}
              className="
                order-1

                flex
                justify-center

                md:order-2
                md:justify-end
              "
            >
              <div
                className="
                  group
                  relative

                  h-[260px]
                  w-full
                  max-w-[340px]

                  overflow-hidden

                  rounded-[6px]

                  bg-[#F4F4F4]

                  shadow-[0_20px_45px_rgba(20,45,75,0.09)]

                  sm:h-[310px]
                  sm:max-w-[400px]

                  md:h-[300px]
                  md:max-w-[330px]

                  lg:h-[330px]
                  lg:max-w-[360px]
                "
              >
                <Image
                  src="/images/curriculam-1.png"
                  alt="Rosary School principal"
                  fill
                  sizes="
                    (max-width: 639px) 100vw,
                    (max-width: 1023px) 50vw,
                    360px
                  "
                  className="
                    object-cover
                    object-center

                    transition-transform
                    duration-[1400ms]
                    ease-out

                    group-hover:scale-[1.045]
                  "
                />

                {/* SOFT IMAGE OVERLAY */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0

                    bg-gradient-to-t
                    from-black/[0.12]
                    via-transparent
                    to-transparent
                  "
                />

                {/* IMAGE LABEL */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.55,
                    ease,
                  }}
                  className="
                    absolute
                    bottom-[14px]
                    left-[14px]

                    rounded-[4px]

                    bg-white/95

                    px-[10px]
                    py-[6px]

                    font-secondary

                    text-[9px]
                    font-medium

                    text-[#0075FF]

                    shadow-[0_8px_20px_rgba(0,0,0,0.08)]

                    sm:text-[10px]
                  "
                >
                  Curriculum & Learning
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}