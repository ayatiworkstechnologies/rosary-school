"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* =========================================================
   IMAGE PATHS

   public/images/support-bg.png
   public/images/student-support.png
========================================================= */

const BACKGROUND_IMAGE = "/images/support-bg.png";
const SUPPORT_IMAGE = "/images/student-support.png";

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
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
    y: 22,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.85,
      ease,
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function StudentSupportSection() {
  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-white

        min-h-[430px]

        sm:min-h-[470px]

        md:min-h-[500px]

        lg:min-h-[380px]

        xl:min-h-[400px]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20

          bg-center
          bg-cover
          bg-no-repeat

          opacity-[0.70]
        "
        style={{
          backgroundImage: `url('${BACKGROUND_IMAGE}')`,
        }}
      />

      {/* =====================================================
          VERY LIGHT WHITE WASH
          Keeps the pattern visible like reference
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10

          bg-white/[0.10]
        "
      />

      {/* =====================================================
          DESKTOP CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto

          hidden
          min-h-[380px]
          w-full
          max-w-[1280px]

          items-center
          justify-center

          px-[40px]

          lg:flex

          xl:min-h-[400px]
        "
      >
        {/* =================================================
            CENTER CONTENT

            Important:
            This stays centered regardless of right image.
        ================================================== */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="
            relative
            z-20

            flex
            w-full
            max-w-[650px]

            flex-col
            items-center

            text-center
          "
        >
          {/* CHIP */}

          <motion.span
            variants={fadeUp}
            className="
              inline-flex
              items-center
              justify-center

              rounded-[3px]

              bg-[#EEF6FF]

              px-[8px]
              py-[4px]

              font-secondary

              text-[8px]
              font-medium

              uppercase

              leading-none
              tracking-[0.25px]

              text-[#0075FF]

              xl:text-[12px]
            "
          >
            Support
          </motion.span>

          {/* HEADING */}

          <motion.h2
            variants={fadeUp}
            className="
              mt-[15px]

              font-primary

              text-[28px]
              font-semibold

              leading-[1.08]

              tracking-[-0.6px]

              text-[#151515]

              xl:text-[31px] pt-3
            "
          >
            Need Guidance or Help?
          </motion.h2>

          {/* PARAGRAPH */}

          <motion.p
            variants={fadeUp}
            className="
              mt-[16px]

              max-w-[590px]

              font-secondary

              text-[11px]

              leading-[1.65]

              text-[#7A7A7A]

              xl:max-w-[620px]
              xl:text-[11.5px] pt-3
            "
          >
            The student support cell is always open. Whether you have
            questions regarding school services, academic queries, or
            general counseling, feel free to reach out.
          </motion.p>

          {/* BUTTON */}

          <motion.div
            variants={fadeUp}
            className="mt-[22px]"
          >
            <motion.div
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <Link
                href="/community/student-corner"
                className="
                  inline-flex

                  h-[39px]

                  items-center
                  justify-center

                  rounded-full

                  bg-[#0075FF]

                  px-[24px]

                  font-secondary

                  text-[10px]
                  font-medium

                  !text-white

                  shadow-[0_8px_22px_rgba(0,117,255,0.18)]

                  transition-all
                  duration-300

                  hover:bg-[#0068E5]

                  hover:shadow-[0_12px_28px_rgba(0,117,255,0.24)]

                  xl:h-[42px]
                  xl:px-[28px]
                  xl:text-[11px]
                "
              >
                Get Student Support
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* =================================================
            RIGHT IMAGE

            Absolute so it does NOT affect
            center alignment of text.
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 40,
            y: 18,
            scale: 0.94,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1,
            delay: 0.18,
            ease,
          }}
          className="
            absolute

            right-[4%]
            top-[47%]

            h-[180px]
            w-[180px]

            -translate-y-1/2

            xl:right-[5%]
            xl:h-[205px]
            xl:w-[205px]

            2xl:right-[7%]
            2xl:h-[220px]
            2xl:w-[220px]
          "
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 4.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              relative
              h-full
              w-full
            "
          >
            <Image
              src={SUPPORT_IMAGE}
              alt="Student support"
              fill
              sizes="220px"
              className="
                object-contain
                object-center
              "
            />
          </motion.div>
        </motion.div>
      </div>

      {/* =====================================================
          TABLET + MOBILE
      ====================================================== */}

      <div
        className="
          relative
          z-10

          flex
          min-h-[430px]
          w-full

          flex-col

          items-center
          justify-center

          px-[20px]
          py-[48px]

          sm:min-h-[470px]
          sm:px-[32px]
          sm:py-[58px]

          md:min-h-[500px]
          md:px-[50px]
          md:py-[64px]

          lg:hidden
        "
      >
        {/* CONTENT */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="
            mx-auto

            flex
            w-full
            max-w-[620px]

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

              uppercase

              leading-none

              text-[#0075FF]

              sm:text-[10px]
            "
          >
            Support
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="
              mt-[14px]

              font-primary

              text-[28px]
              font-semibold

              leading-[1.08]

              tracking-[-0.6px]

              text-[#151515]

              sm:text-[34px]

              md:text-[38px]
            "
          >
            Need Guidance or Help?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="
              mt-[14px]

              max-w-[540px]

              font-secondary

              text-[12px]

              leading-[1.7]

              text-[#787878]

              sm:text-[13px]

              md:text-[14px]
            "
          >
            The student support cell is always open. Whether you have
            questions regarding school services, academic queries, or
            general counseling, feel free to reach out.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-[21px]"
          >
            <Link
              href="/community/student-corner"
              className="
                inline-flex

                h-[42px]

                items-center
                justify-center

                rounded-full

                bg-[#0075FF]

                px-[25px]

                font-secondary

                text-[11px]
                font-medium

                !text-white

                shadow-[0_8px_22px_rgba(0,117,255,0.18)]

                transition-all
                duration-300

                hover:bg-[#0068E5]

                sm:h-[44px]
                sm:px-[28px]
                sm:text-[12px]
              "
            >
              Get Student Support
            </Link>
          </motion.div>
        </motion.div>

        {/* =================================================
            IMAGE BELOW CONTENT
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 28,
            scale: 0.94,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.9,
            delay: 0.18,
            ease,
          }}
          className="
            relative

            mt-[28px]

            h-[145px]
            w-[145px]

            sm:mt-[32px]
            sm:h-[175px]
            sm:w-[175px]

            md:h-[195px]
            md:w-[195px]
          "
        >
          <Image
            src={SUPPORT_IMAGE}
            alt="Student support"
            fill
            sizes="
              (max-width: 639px) 145px,
              (max-width: 767px) 175px,
              195px
            "
            className="
              object-contain
              object-center
            "
          />
        </motion.div>
      </div>
    </section>
  );
}