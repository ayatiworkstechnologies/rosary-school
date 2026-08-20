"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
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
      duration: 0.85,
      ease,
    },
  },
};

/* =========================================================
   ICON
========================================================= */

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[14px] w-[14px]"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M9 7H17V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   TEXT CONTENT
========================================================= */

function BeyondContent({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.25,
      }}
      className={`
        relative
        z-20
        w-full

        ${
          mobile
            ? `
              mx-auto
              max-w-[600px]
              text-center
            `
            : `
              max-w-[420px]
              text-left
            `
        }
      `}
    >
      {/* CHIP */}

      <motion.span
        variants={fadeUp}
        className="
          inline-flex
          items-center
          justify-center

          rounded-[4px]

          bg-[#EFF6FF]

          px-[10px]
          py-[6px]

          font-secondary

          text-[10px]
          font-medium

          leading-none

          text-[#0075FF]

          sm:text-[11px]

          lg:px-[8px]
          lg:py-[5px]
          lg:text-[9px]
        "
      >
        Clubs &amp; Activities
      </motion.span>

      {/* TITLE */}

      <motion.h2
        variants={fadeUp}
        className="
          mt-[14px]

          font-primary

          text-[30px]
          font-semibold

          leading-[1.06]

          tracking-[-0.8px]

          text-[#141414]

          sm:text-[36px]

          md:text-[40px]

          lg:text-[31px]

          xl:text-[34px]
        "
      >
        Explore Beyond the
        <br />
        Classroom
      </motion.h2>

      {/* DESCRIPTION */}

      <motion.p
        variants={fadeUp}
        className={`
          mt-[15px]

          font-secondary

          text-[13px]

          leading-[1.65]

          text-[#747474]

          sm:text-[14px]

          lg:text-[11px]

          ${
            mobile
              ? `
                mx-auto
                max-w-[500px]
              `
              : `
                max-w-[390px]
              `
          }
        `}
      >
        Discover clubs, sports, competitions,
        cultural activities, and opportunities to
        develop new skills.
      </motion.p>

      {/* BUTTON */}

      <motion.div
        variants={fadeUp}
        className={`
          mt-[22px]

          flex

          ${
            mobile
              ? "justify-center"
              : "justify-start"
          }
        `}
      >
        <Link
          href="/academics/clubs"
          className="
            group

            inline-flex

            h-[44px]

            items-center
            justify-center

            gap-[9px]

            rounded-full

            bg-[#0075FF]

            px-[24px]

            font-secondary

            text-[11px]
            font-medium

            !text-white

            shadow-[0_8px_22px_rgba(0,117,255,0.18)]

            transition-all
            duration-500

            hover:-translate-y-[2px]

            hover:bg-[#0069E6]

            hover:shadow-[0_13px_28px_rgba(0,117,255,0.24)]

            sm:h-[46px]
            sm:px-[27px]
            sm:text-[12px]

            lg:h-[40px]
            lg:px-[21px]
            lg:text-[10px]
          "
        >
          Explore Activities

          <span
            className="
              transition-transform
              duration-500

              group-hover:translate-x-[2px]
              group-hover:-translate-y-[2px]
            "
          >
            <ArrowUpRightIcon />
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ExploreBeyondClassroom() {
  return (
    <section
      className="
        relative
        isolate

        w-full

        overflow-hidden

        bg-white
      "
    >
      {/* =====================================================
          MOBILE + TABLET
          IMAGE ABOVE — CONTENT BELOW
          NO IMAGE BACKGROUND COLOR
          NO ARROW
      ====================================================== */}

      <div
        className="
          relative

          lg:hidden
        "
      >
        {/* =================================================
            IMAGE AREA

            No blue bg
            No container color
            No clipping
            Smaller centered image
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 28,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 1,
            ease,
          }}
          className="
            relative

            flex
            w-full

            items-center
            justify-center

            px-[20px]
            pb-[14px]
            pt-[24px]

            sm:px-[35px]
            sm:pb-[18px]
            sm:pt-[30px]

            md:px-[55px]
            md:pb-[22px]
            md:pt-[36px]
          "
        >
          <Image
            src="/images/class-1.png"
            alt="Rosary School clubs and activities"
            width={800}
            height={800}
            priority={false}
            sizes="
              (max-width: 639px) 78vw,
              (max-width: 1023px) 60vw
            "
            className="
              h-auto

              w-[78%]

              max-w-[360px]

              object-contain

              sm:w-[68%]
              sm:max-w-[440px]

              md:w-[58%]
              md:max-w-[500px]
            "
          />
        </motion.div>

        {/* =================================================
            CONTENT BELOW IMAGE
        ================================================== */}

        <div
          className="
            relative

            px-[20px]

            pb-[58px]
            pt-[24px]

            sm:px-[34px]
            sm:pb-[68px]
            sm:pt-[28px]

            md:px-[54px]
            md:pb-[76px]
            md:pt-[32px]
          "
        >
          {/* SUBTLE DECORATION */}

          <div
            className="
              pointer-events-none

              absolute

              -bottom-[120px]
              -left-[120px]

              -z-10

              h-[300px]
              w-[300px]

              rotate-45

              opacity-[0.16]
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(120,145,170,0.18) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(120,145,170,0.18) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "34px 34px",
            }}
          />

          <BeyondContent mobile />
        </div>
      </div>

      {/* =====================================================
          DESKTOP
          BACKGROUND ARTWORK
      ====================================================== */}

      <div
        className="
          relative

          hidden
          w-full

          overflow-hidden

          lg:block
        "
      >
        {/* =================================================
            DESKTOP ART

            Natural section aspect ratio.
            No 100% 100% stretching.
        ================================================== */}

        <div
          className="
            relative

            w-full

            aspect-[1440/500]

            min-h-[360px]
            max-h-[500px]
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 1.015,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 1.15,
              ease,
            }}
            className="
              absolute
              inset-0
            "
          >
            <Image
              src="/images/beyond-classroom.png"
              alt=""
              fill
              sizes="100vw"
              priority={false}
              className="
                object-cover
                object-center
              "
            />
          </motion.div>

          {/* =================================================
              DESKTOP CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-20

              mx-auto

              flex

              h-full
              w-full
              max-w-[1320px]

              items-center

              px-[54px]

              xl:px-[68px]

              2xl:px-[78px]
            "
          >
            <BeyondContent />
          </div>

          {/* =================================================
              DOTTED ARROW
              DESKTOP ONLY
          ================================================== */}

          <motion.svg
            viewBox="0 0 440 160"
            fill="none"
            className="
              pointer-events-none

              absolute

              bottom-[17%]
              left-[30%]

              z-30

              h-[125px]
              w-[390px]

              xl:left-[31%]
              xl:h-[135px]
              xl:w-[425px]
            "
          >
            <motion.path
              initial={{
                pathLength: 0,
                opacity: 0,
              }}
              whileInView={{
                pathLength: 1,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.75,
                delay: 0.42,
                ease,
              }}
              d="
                M 10 74

                C 58 104,
                  98 124,
                  140 124

                C 181 124,
                  157 55,
                  198 54

                C 239 53,
                  297 120,
                  341 121

                C 383 122,
                  389 90,
                  389 45
              "
              stroke="#0075FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />

            <motion.path
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.4,
                delay: 1.95,
              }}
              d="
                M 381 54
                L 389 44
                L 397 54
              "
              stroke="#0075FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </div>
    </section>
  );
}