"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
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
      duration: 0.95,
      ease,
    },
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.05,
      ease,
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 34,
    scale: 0.975,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 1.1,
      ease,
    },
  },
};

/* =========================================================
   DOTTED CORNER
========================================================= */

function CornerDecoration({
  type,
}: {
  type: "top-left" | "bottom-right";
}) {
  const isTopLeft = type === "top-left";

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.85,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 1,
        delay: 0.4,
        ease,
      }}
      className={`
        pointer-events-none
        absolute
        z-[4]
        hidden
        h-[82px]
        w-[100px]

        lg:block

        ${isTopLeft
          ? `
              left-[36px]
              top-[38px]
            `
          : `
              bottom-[42px]
              right-[42px]
            `
        }
      `}
    >
      {/* VERTICAL */}

      <span
        className={`
          absolute
          h-[70px]
          border-l
          border-dashed
          border-[#0075FF]/65

          ${isTopLeft
            ? `
                left-0
                top-0
              `
            : `
                bottom-0
                right-0
              `
          }
        `}
      />

      {/* HORIZONTAL */}

      <span
        className={`
          absolute
          w-[78px]
          border-t
          border-dashed
          border-[#0075FF]/65

          ${isTopLeft
            ? `
                left-0
                top-0
              `
            : `
                bottom-0
                right-0
              `
          }
        `}
      />

      {/* DOT */}

      <span
        className={`
          absolute
          h-[4px]
          w-[4px]
          rounded-full
          bg-[#0075FF]

          ${isTopLeft
            ? `
                -left-[1px]
                -top-[1px]
              `
            : `
                -bottom-[1px]
                -right-[1px]
              `
          }
        `}
      />
    </motion.div>
  );
}

/* =========================================================
   BLUE EDGE SHAPE

   IMPORTANT:
   Fixed aspect ratio.
   No preserveAspectRatio="none".
   Therefore mobile/tablet will NOT stretch vertically.
========================================================= */

function BlueEdgeShape() {
  return (
    <motion.svg
      initial={{
        opacity: 0,
        x: -55,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 1.35,
        ease,
      }}
      viewBox="0 0 220 420"
      preserveAspectRatio="xMinYMax meet"
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        bottom-0
        left-0
        z-[1]

        h-[180px]
        w-[55px]

        sm:h-[220px]
        sm:w-[70px]

        md:h-[260px]
        md:w-[86px]

        lg:h-[350px]
        lg:w-[135px]

        xl:h-[410px]
        xl:w-[165px]
      "
    >
      <path
        d="
          M0 0
          C 8 95,
            32 205,
            80 290
          C 120 360,
            165 400,
            220 420
          L0 420
          Z
        "
        fill="#0075FF"
      />
    </motion.svg>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DepartmentsOverview() {
  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-[#FCFDFE]

        py-[47px]

        sm:py-[42px]

        md:py-[40px]

        lg:py-[50px]

        xl:py-[64px]
      "
    >
      {/* =====================================================
          SQUARE / CHECKED BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(25,71,120,0.055) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(25,71,120,0.055) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "36px 36px",
          backgroundPosition: "0 0",
        }}
      />

      {/* =====================================================
          SMALL SOFT GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[24%]
          top-[18%]
          -z-10

          h-[320px]
          w-[320px]

          rounded-full

          bg-[#0075FF]/[0.018]

          blur-[100px]
        "
      />

      {/* =====================================================
          BLUE EDGE
      ====================================================== */}

      <BlueEdgeShape />

      {/* =====================================================
          CORNER DECORATIONS
      ====================================================== */}

      <CornerDecoration type="top-left" />

      <CornerDecoration type="bottom-right" />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.1,
          margin: "0px 0px -60px 0px",
        }}
        className="
          relative
          z-10

          mx-auto

          grid

          w-full
          max-w-[1240px]

          grid-cols-1

          items-center

          gap-[42px]

          px-[20px]

          sm:px-[30px]

          md:gap-[52px]
          md:px-[44px]

          lg:grid-cols-[0.94fr_1.06fr]
          lg:gap-[74px]
          lg:px-[72px]

          xl:gap-[90px]
          xl:px-[82px]
        "
      >
        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <motion.div
          variants={fadeLeft}
          className="
            relative
            z-20

            mx-auto

            w-full
            max-w-[555px]

            lg:mx-0
          "
        >
          {/* CHIP */}

          <motion.span
            variants={fadeUp}
            className="
    inline-flex
    items-center
    justify-center

    rounded-[5px]

    bg-[#F1F7FF]

    px-[12px]
    py-[7px]

    font-secondary

    text-[11px]
    font-medium

    leading-none

    tracking-[0.2px]

    text-[#0075FF]

    sm:px-[13px]
    sm:py-[7px]
    sm:text-[12px]

    md:px-[14px]
    md:py-[8px]
    md:text-[12.5px]

    lg:text-[13px] mb-3
  "
          >
            Departments
          </motion.span>

          {/* TITLE */}

          <motion.h2
            variants={fadeUp}
            className="
              mt-[15px]

              max-w-[550px]

              font-primary

              text-[29px]
              font-semibold

              leading-[1.05]

              tracking-[-0.8px]

              text-[#121212]

              sm:text-[34px]

              md:text-[37px]

              lg:text-[35px]

              xl:text-[39px] pb-3
            "
          >
            Academic Departments
            <br />
            That Inspire Excellence
          </motion.h2>

          {/* PARAGRAPH 1 */}

          <motion.p
            variants={fadeUp}
            className="
              mt-[18px]

              max-w-[545px]

              font-secondary

              text-[12px]

              leading-[1.65]

              text-[#737373]

              sm:text-[12.5px]

              md:text-[13px]
            "
          >
            Our academic departments are designed to provide
            students with strong subject knowledge, practical
            understanding, and meaningful learning experiences.
            Each department follows a structured approach that
            encourages curiosity, critical thinking, creativity,
            and academic confidence.
          </motion.p>

          {/* PARAGRAPH 2 */}

          <motion.p
            variants={fadeUp}
            className="
              mt-[10px]

              max-w-[545px]

              font-secondary

              text-[12px]

              leading-[1.65]

              text-[#737373]

              sm:text-[12.5px]

              md:text-[13px]
            "
          >
            From languages and mathematics to science, social
            science, computer science, and commerce, every
            subject area is supported by dedicated educators
            who help students understand concepts beyond the
            classroom.
          </motion.p>

          {/* PARAGRAPH 3 */}

          <motion.p
            variants={fadeUp}
            className="
              mt-[10px]

              max-w-[545px]

              font-secondary

              text-[12px]

              leading-[1.65]

              text-[#737373]

              sm:text-[12.5px]

              md:text-[13px]
            "
          >
            Through interactive teaching, practical activities,
            projects, discussions, and continuous assessment,
            students are encouraged to explore, question, apply,
            and grow while preparing for higher education and
            future opportunities.
          </motion.p>
        </motion.div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <motion.div
          variants={fadeRight}
          className="
            relative
            z-20

            mx-auto

            w-full
            max-w-[600px]

            lg:mx-0
          "
        >
          {/* =================================================
              IMAGE
          ================================================= */}

          <motion.div
            whileHover={{
              y: -4,
            }}
            transition={{
              duration: 0.5,
              ease,
            }}
            className="
              relative

              ml-auto

              aspect-[4/3]

              w-full

              overflow-hidden

              rounded-[5px]

              bg-[#EFF2F4]

              shadow-[0_18px_50px_rgba(20,52,84,0.08)]

              sm:aspect-[1.22/1]

              lg:max-w-[500px]
              lg:aspect-[1.13/1]

              xl:max-w-[520px]
            "
          >
            <Image
              src="/images/departments-overview.png"
              alt="Rosary School academic departments"
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 80vw, 520px"
              className="
                object-cover
                object-center

                transition-transform
                duration-[1200ms]
                ease-out

                hover:scale-[1.03]
              "
            />
          </motion.div>

          {/* =================================================
              QUOTE CARD

              IMPORTANT:
              MOBILE = completely below image
              TABLET = completely below image
              DESKTOP = slightly overlaps lower edge only
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 26,
              scale: 0.97,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.95,
              delay: 0.32,
              ease,
            }}
            className="
              relative
              z-30

              mx-auto

              mt-[20px]

              w-full

              rounded-[4px]

              bg-white

              px-[20px]
              py-[20px]

              shadow-[0_15px_38px_rgba(20,45,70,0.10)]

              sm:mt-[22px]
              sm:w-[82%]
              sm:px-[24px]
              sm:py-[22px]

              md:mt-[24px]
              md:w-[70%]

              lg:-mt-[22px]
              lg:mr-[30px]
              lg:w-[300px]

              xl:mr-[45px]
              xl:w-[315px]
            "
          >
            {/* BLUE LINE */}

            <motion.span
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
                duration: 0.8,
                delay: 0.5,
                ease,
              }}
              className="
                mb-[14px]

                block

                h-[2px]
                w-[34px]

                origin-left

                bg-[#0075FF]
              "
            />

            {/* QUOTE */}

            <h3
              className="
                font-primary

                text-[15px]
                font-semibold

                leading-[1.25]

                tracking-[-0.25px]

                text-[#242424]

                sm:text-[16px]
              "
            >
              Knowledge grows when curiosity
              meets the right guidance.
            </h3>

            {/* SIGNATURE */}

            <p
              className="
                mt-[15px]

                text-right

                font-secondary

                text-[10px]

                text-[#999999]

                sm:text-[11px]
              "
            >
              — Rosary School
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}