"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
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

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.95,
      ease,
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ParentCommunicationSupport() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white
      "
    >
      {/* =====================================================
          PART 01
          PARENT / TEACHER COMMUNICATION
      ====================================================== */}

      <div
        className="
          relative

          flex
          min-h-[390px]
          w-full

          items-center
          justify-center

          px-[18px]
          py-[56px]

          sm:min-h-[420px]
          sm:px-[28px]
          sm:py-[68px]

          md:min-h-[450px]
          md:px-[40px]

          lg:min-h-[430px]
          lg:py-[72px]
        "
      >
        {/* SOFT BACKGROUND GLOW */}

        <div
          className="
            pointer-events-none
            absolute

            left-1/2
            top-1/2

            h-[260px]
            w-[70%]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-[#EEF5FC]/45

            blur-[90px]
          "
        />

        {/* =================================================
            COMMUNICATION CARD
        ================================================= */}

        <motion.div
          variants={cardReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="
            relative
            z-10

            mx-auto

            flex
            w-full
            max-w-[650px]

            flex-col
            items-center

            rounded-[8px]

            bg-white

            px-[22px]
            py-[38px]

            text-center

            shadow-[0_22px_60px_rgba(27,55,88,0.10)]

            sm:px-[42px]
            sm:py-[46px]

            md:max-w-[720px]
            md:px-[60px]

            lg:max-w-[680px]
            lg:px-[54px]
            lg:py-[48px]
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

              bg-[#EFF6FF]

              px-[8px]
              py-[4px]

              font-secondary

              text-[9px]
              font-medium

              uppercase

              leading-none
              tracking-[0.35px]

              text-[#0075FF]

              sm:text-[10px]
            "
          >
            Communication
          </motion.span>

          {/* TITLE */}

          <motion.h2
            variants={fadeUp}
            className="
              mt-[16px]

              font-primary

              text-[25px]
              font-semibold

              leading-[1.1]

              tracking-[-0.55px]

              text-[#181818]

              sm:text-[30px]

              md:text-[32px]

              lg:text-[30px] pt-3
            "
          >
            Stay Connected With Teachers
          </motion.h2>

          {/* DESCRIPTION */}

          <motion.p
            variants={fadeUp}
            className="
              mx-auto

              mt-[14px]

              max-w-[560px]

              font-secondary

              text-[11.5px]

              leading-[1.65]

              text-[#7B7B7B]

              sm:text-[12.5px]

              md:text-[13px] pt-3
            "
          >
            Active communication bridges classroom lessons and
            domestic coaching. Connect directly with grade tutors,
            view contact schedules, or request virtual appointment
            meetings seamlessly.
          </motion.p>

          {/* CTA */}

          <motion.div
            variants={fadeUp}
            className="
              mt-[22px]
            "
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
                href="/contact-us"
                className="
                  inline-flex

                  h-[40px]

                  items-center
                  justify-center

                  rounded-[5px]

                  bg-[#0075FF]

                  px-[24px]

                  font-secondary

                  text-[10px]
                  font-medium

                  uppercase

                  tracking-[0.2px]

                  !text-white

                  shadow-[0_8px_22px_rgba(0,117,255,0.20)]

                  transition-all
                  duration-300

                  hover:bg-[#0068E5]

                  hover:shadow-[0_12px_28px_rgba(0,117,255,0.27)]

                  sm:h-[42px]
                  sm:px-[28px]
                  sm:text-[10.5px]
                "
              >
                Contact School
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* =====================================================
          PART 02
          HELP / SUPPORT
      ====================================================== */}

      <div
        className="
          relative

          flex
          min-h-[270px]
          w-full

          items-center
          justify-center

          overflow-hidden

          px-[18px]
          py-[46px]

          sm:min-h-[290px]
          sm:px-[28px]

          md:min-h-[300px]
          md:px-[42px]

          lg:min-h-[300px]
          lg:px-[50px]
        "
      >
        {/* =================================================
            BLUE BACKGROUND IMAGE

            public/images/schedule-bg.png
        ================================================= */}

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            bg-center
            bg-cover
            bg-no-repeat
          "
          style={{
            backgroundImage:
              "url('/images/schedule-bg.png')",
          }}
        />

        {/* VERY LIGHT BLUE OVERLAY */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-[#0075FF]/[0.02]
          "
        />

        {/* =================================================
            SUPPORT CARD
        ================================================= */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="
            relative
            z-10

            mx-auto

            flex
            w-full
            max-w-[980px]

            flex-col

            gap-[22px]

            rounded-[10px]

            bg-white

            px-[22px]
            py-[28px]

            shadow-[0_18px_45px_rgba(0,55,130,0.13)]

            sm:px-[30px]
            sm:py-[32px]

            md:max-w-[1050px]
            md:flex-row
            md:items-center
            md:justify-between

            md:gap-[35px]

            lg:px-[34px]
            lg:py-[30px]
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <motion.div
            variants={fadeUp}
            className="
              min-w-0
              flex-1

              text-center

              md:text-left
            "
          >
            {/* CHIP */}

            <span
              className="
                inline-flex

                items-center
                justify-center

                rounded-[3px]

                bg-[#EFF6FF]

                px-[8px]
                py-[4px]

                font-secondary

                text-[9px]
                font-medium

                uppercase

                leading-none
                tracking-[0.3px]

                text-[#0075FF]
              "
            >
              Support
            </span>

            {/* TITLE */}

            <h3
              className="
                mt-[12px]

                font-primary

                text-[24px]
                font-semibold

                leading-[1.1]

                tracking-[-0.5px]

                text-[#1A1A1A]

                sm:text-[27px]

                lg:text-[28px] pt-3
              "
            >
              Have a Question?
            </h3>

            {/* TEXT */}

            <p
              className="
                mx-auto

                mt-[9px]

                max-w-[650px]

                font-secondary

                text-[11px] pt-2

                leading-[1.6]

                text-[#808080]

                sm:text-[12px]

                md:mx-0

                lg:text-[12.5px] 
              "
            >
              Our dedicated parent helpdesk team is always available
              to resolve academic queries, general inquiries, or
              fee-related guidelines. Reach out today.
            </p>
          </motion.div>

          {/* =================================================
              BUTTON
          ================================================= */}

          <motion.div
            variants={fadeUp}
            className="
              flex

              shrink-0

              justify-center

              md:justify-end
            "
          >
            <motion.div
              whileHover={{
                x: 3,
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <Link
                href="/contact-us"
                className="
                  inline-flex

                  h-[42px]

                  min-w-[135px]

                  items-center
                  justify-center

                  rounded-full

                  bg-[#0075FF]

                  px-[22px]

                  font-secondary

                  text-[10px]
                  font-medium

                  !text-white

                  shadow-[0_8px_22px_rgba(0,117,255,0.19)]

                  transition-all
                  duration-300

                  hover:bg-[#0068E5]

                  hover:shadow-[0_12px_28px_rgba(0,117,255,0.25)]

                  sm:h-[44px]
                  sm:min-w-[145px]
                  sm:text-[11px]
                "
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}