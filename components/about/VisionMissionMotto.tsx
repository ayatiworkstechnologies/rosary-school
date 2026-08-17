"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* =========================================================
   ANIMATION SETTINGS
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},

  visible: {
    transition: {
      delayChildren: 0.14,
      staggerChildren: 0.16,
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
      duration: 1.15,
      ease,
    },
  },
};

const scaleReveal = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: -8,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      duration: 1.2,
      ease,
    },
  },
};

const panelReveal = {
  hidden: {
    opacity: 0,
    y: 32,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 1.3,
      ease,
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function VisionMissionMotto() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.08,
      }}
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-black

        lg:h-[389px]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <motion.div
        initial={{
          scale: 1.06,
          opacity: 0.85,
        }}
        whileInView={{
          scale: 1,
          opacity: 1,
        }}
        viewport={{
          once: true,
          amount: 0.1,
        }}
        transition={{
          duration: 2,
          ease,
        }}
        className="
          absolute
          inset-0
          -z-20
        "
      >
        <Image
          src="/images/vision-mission-bg.png"
          alt="Students on campus"
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-center
          "
        />
      </motion.div>

      {/* =====================================================
          BACKGROUND OVERLAY
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-black/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-gradient-to-b
          from-black/[0.04]
          via-transparent
          to-black/10
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-[1440px]
          flex-col
          px-[16px]
          pb-[16px]
          pt-[12px]

          sm:px-[20px]
          sm:pb-[18px]
          sm:pt-[14px]

          md:px-[26px]
          md:pb-[20px]
          md:pt-[16px]

          lg:h-full
          lg:px-[36px]
          lg:pb-[20px]
          lg:pt-[18px]
        "
      >
        {/* =================================================
            TOP CONTENT
        ================================================= */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          className="
            flex
            flex-col
            items-center
            text-center
          "
        >
          {/* CHIP */}

          <motion.span
            variants={scaleReveal}
            className="
              inline-flex
              w-fit
              items-center
              rounded-[3px]
              bg-white/95
              px-[8px]
              py-[4px]
              font-secondary
              text-[9px]
              font-medium
              leading-none
              text-[#0075FF]
              shadow-[0_5px_18px_rgba(0,0,0,0.10)]
              backdrop-blur-[8px]

              sm:text-[10px]

              md:text-[11px]
            "
          >
            Inspiring Minds
          </motion.span>

          {/* HEADING */}

          <motion.h2
            variants={fadeUp}
            className="
              mt-[8px]
              max-w-[900px]
              px-[4px]
              font-primary
              text-[23px]
              font-semibold
              leading-[1.14]
              tracking-[-0.6px]
              !text-white
              drop-shadow-[0_3px_16px_rgba(0,0,0,0.30)]

              sm:mt-[9px]
              sm:text-[27px]

              md:text-[30px]

              lg:mt-[10px]
              lg:text-[29px]

              xl:text-[34px]
            "
          >
            Educating with Purpose, Growing with Values.
          </motion.h2>
        </motion.div>

        {/* =================================================
            DESKTOP SPACER ONLY
        ================================================= */}

        <div
          className="
            hidden

            lg:block
            lg:flex-1
          "
        />

        {/* =================================================
            GLASS PANEL
        ================================================= */}

        <motion.div
          variants={panelReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.08,
          }}
          className="
            relative
            mt-[24px]
            w-full
            overflow-hidden
            bg-black/45
            shadow-[0_18px_50px_rgba(0,0,0,0.22)]
            backdrop-blur-[8px]

            sm:mt-[26px]

            md:mt-[28px]

            lg:mt-0
          "
        >
          {/* TOP LINE */}

          <motion.div
            initial={{
              scaleX: 0,
            }}
            whileInView={{
              scaleX: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1.5,
              delay: 0.35,
              ease,
            }}
            className="
              absolute
              left-0
              top-0
              h-[1px]
              w-full
              origin-center
              bg-white/15
            "
          />

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.08,
            }}
            className="
              grid
              grid-cols-1

              md:grid-cols-2

              lg:grid-cols-3
            "
          >
            {/* =================================================
                VISION
            ================================================= */}

            <motion.div
              variants={fadeUp}
              whileHover={{
                backgroundColor: "rgba(255,255,255,0.045)",
              }}
              transition={{
                duration: 0.4,
              }}
              className="
                group
                relative
                min-h-[145px]
                px-[20px]
                py-[20px]

                sm:px-[24px]
                sm:py-[22px]

                md:min-h-[170px]

                lg:min-h-[148px]
                lg:px-[27px]
                lg:py-[24px]
              "
            >
              {/* NUMBER */}

              <span
                className="
                  pointer-events-none
                  absolute
                  right-[18px]
                  top-[14px]
                  font-primary
                  text-[42px]
                  font-semibold
                  leading-none
                  text-white/30
                "
              >
                01
              </span>

              {/* TITLE */}

              <motion.h3
                variants={fadeUp}
                className="
                  relative
                  z-10
                  font-primary
                  text-[19px]
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[-0.2px]
                  !text-white

                  sm:text-[20px]

                  lg:text-[21px]
                "
              >
                Vision
              </motion.h3>

              {/* BLUE LINE */}

              <motion.div
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: 30,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.25,
                  delay: 0.55,
                  ease,
                }}
                className="
                  mt-[10px]
                  h-[2px]
                  bg-[#0075FF]
                "
              />

              {/* TEXT */}

              <motion.p
                variants={fadeUp}
                className="
                  mt-[11px]
                  max-w-[300px]
                  font-secondary
                  text-[13px]
                  font-normal
                  leading-[1.5]
                  !text-white

                  sm:text-[13.5px]

                  lg:text-[14px]
                "
              >
                Education to Knowledge,
                <br />
                Education to Truth,
                <br />
                Education to Human Development
              </motion.p>

              {/* HOVER LINE */}

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-0
                  bg-[#0075FF]
                  transition-all
                  duration-700

                  group-hover:w-full
                "
              />
            </motion.div>

            {/* =================================================
                MISSION
            ================================================= */}

            <motion.div
              variants={fadeUp}
              whileHover={{
                backgroundColor: "rgba(255,255,255,0.045)",
              }}
              transition={{
                duration: 0.4,
              }}
              className="
                group
                relative
                min-h-[165px]
                border-t
                border-white/10
                px-[20px]
                py-[20px]

                sm:px-[24px]
                sm:py-[22px]

                md:min-h-[170px]
                md:border-l
                md:border-t-0

                lg:min-h-[148px]
                lg:px-[27px]
                lg:py-[24px]
              "
            >
              {/* NUMBER */}

              <span
                className="
                  pointer-events-none
                  absolute
                  right-[18px]
                  top-[14px]
                  font-primary
                  text-[42px]
                  font-semibold
                  leading-none
                  text-white/30
                "
              >
                02
              </span>

              {/* TITLE */}

              <motion.h3
                variants={fadeUp}
                className="
                  relative
                  z-10
                  font-primary
                  text-[19px]
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[-0.2px]
                  !text-white

                  sm:text-[20px]

                  lg:text-[21px]
                "
              >
                Mission
              </motion.h3>

              {/* BLUE LINE */}

              <motion.div
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: 30,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.25,
                  delay: 0.75,
                  ease,
                }}
                className="
                  mt-[10px]
                  h-[2px]
                  bg-[#0075FF]
                "
              />

              {/* TEXT */}

              <motion.p
                variants={fadeUp}
                className="
                  mt-[11px]
                  max-w-[390px]
                  font-secondary
                  text-[13px]
                  font-normal
                  leading-[1.5]
                  !text-white

                  sm:text-[13.5px]

                  lg:text-[14px]
                "
              >
                To help in the integral formation of the girl child, with love
                and truth as the motivating factor. To create women of substance
                and life witnesses by awakening the spiritual towards social
                commitment.
              </motion.p>

              {/* HOVER LINE */}

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-0
                  bg-[#0075FF]
                  transition-all
                  duration-700

                  group-hover:w-full
                "
              />
            </motion.div>

            {/* =================================================
                MOTTO
            ================================================= */}

            <motion.div
              variants={fadeUp}
              whileHover={{
                backgroundColor: "rgba(255,255,255,0.045)",
              }}
              transition={{
                duration: 0.4,
              }}
              className="
                group
                relative
                min-h-[130px]
                border-t
                border-white/10
                px-[20px]
                py-[20px]

                sm:px-[24px]
                sm:py-[22px]

                md:col-span-2
                md:min-h-[145px]

                lg:col-span-1
                lg:min-h-[148px]
                lg:border-l
                lg:border-t-0
                lg:px-[27px]
                lg:py-[24px]
              "
            >
              {/* NUMBER */}

              <span
                className="
                  pointer-events-none
                  absolute
                  right-[18px]
                  top-[14px]
                  font-primary
                  text-[42px]
                  font-semibold
                  leading-none
                  text-white/30
                "
              >
                03
              </span>

              {/* TITLE */}

              <motion.h3
                variants={fadeUp}
                className="
                  relative
                  z-10
                  font-primary
                  text-[19px]
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[-0.2px]
                  !text-white

                  sm:text-[20px]

                  lg:text-[21px]
                "
              >
                Motto
              </motion.h3>

              {/* BLUE LINE */}

              <motion.div
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: 30,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.25,
                  delay: 0.95,
                  ease,
                }}
                className="
                  mt-[10px]
                  h-[2px]
                  bg-[#0075FF]
                "
              />

              {/* TEXT */}

              <motion.p
                variants={fadeUp}
                className="
                  mt-[11px]
                  max-w-[240px]
                  font-secondary
                  text-[13px]
                  font-normal
                  leading-[1.5]
                  !text-white

                  sm:text-[13.5px]

                  lg:text-[14px]
                "
              >
                Through Love
                <br />
                Let us seek for Truth
              </motion.p>

              {/* HOVER LINE */}

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-0
                  bg-[#0075FF]
                  transition-all
                  duration-700

                  group-hover:w-full
                "
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}