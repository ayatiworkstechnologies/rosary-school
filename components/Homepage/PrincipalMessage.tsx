"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    x: -25,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    x: 30,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

/* =========================================================
   PRINCIPAL MESSAGE
========================================================= */

export default function PrincipalMessage() {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white
        px-[18px]
        py-[30px]

        sm:px-[28px]
        sm:py-[30px]

        md:px-[40px]
        md:py-[34px]

        lg:px-[55px]
        lg:py-[38px]
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
          bg-center
          bg-repeat
        "
        style={{
          backgroundImage: "url('/images/notice-bg.png')",
          backgroundSize: "auto",
        }}
      />

      {/* =====================================================
          MAIN WHITE CARD
      ====================================================== */}

      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.22,
        }}
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[956px]
          bg-white
          px-[24px]
          py-[36px]

          shadow-[0_8px_35px_rgba(0,0,0,0.045)]

          sm:px-[38px]
          sm:py-[44px]

          md:px-[46px]
          md:py-[50px]

          lg:min-h-[435px]
          lg:px-[56px]
          lg:py-[60px]
          rounded-[16px]
        "
      >
        {/* =====================================================
            DESKTOP GRID
        ====================================================== */}

        <div
          className="
            flex
            flex-col
            gap-[38px]

            lg:grid
            lg:grid-cols-[445px_247px]
            lg:items-start
            lg:justify-between
            lg:gap-[120px]
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <motion.div
            variants={contentVariants}
            className="
              w-full
              min-w-0

              lg:pt-[1px]
            "
          >
            {/* ===============================================
                SMALL LABEL
            ================================================ */}

            <span
              className="
                inline-flex
                items-center
                justify-center
                bg-[#F3F8FF]
                px-[6px]
                py-[3px]

                font-secondary
                text-[12px]
                font-medium
                leading-none
                text-[#0075FF]
              "
            >
              Message
            </span>

            {/* ===============================================
                TITLE
            ================================================ */}

            <h2
              className="
                mt-[31px]
                font-primary
                text-[27px]
                font-semibold
                leading-[1.08]
                tracking-[-0.6px]
                text-[#111111]

                sm:text-[29px]

                lg:text-[29px]
                pt-5
              "
            >
              From The Principal
            </h2>

            {/* ===============================================
                TAGLINE
            ================================================ */}

            <p
              className="
                mt-[26px]
                font-primary
                text-[13px]
                font-medium
                leading-[1.4]
                text-[#0075FF]

                sm:text-[14px]

                lg:text-[14px]
                pt-5
              "
            >
              Nurturing Minds. Shaping Character. Inspiring Purpose.
            </p>

            {/* ===============================================
                DESCRIPTION
            ================================================ */}

            <p
              className="
                mt-[25px]
                max-w-[445px]

                font-secondary
                text-[12px]
                font-normal
                leading-[1.32]
                tracking-[-0.1px]
                text-[#888888]

                sm:text-[13px] pt-5

                lg:text-[13px]
                lg:leading-[1.28]
              "
            >
              At Rosary, education goes beyond academic excellence. We strive
              to nurture young minds with knowledge, strengthen them with
              values, and inspire them to grow into confident and compassionate
              individuals. Guided by truth, love and a spirit of service, we
              encourage every student to discover her potential and contribute
              meaningfully to the world around her.
            </p>

            {/* ===============================================
                EXPLORE MORE
            ================================================ */}

            <motion.div
              initial="rest"
              whileHover="hover"
              className="
                mt-[39px]
                w-fit
              "
            >
              <Link
                href="/about/principal-message"
                className="
                  flex
                  w-[178px]
                  items-center
                  justify-between
                  border-b
                  border-[#0075FF]
                  pb-[10px]

                  font-primary
                  text-[12px]
                  font-medium
                  uppercase
                  text-[#0075FF]

                  sm:text-[13px]
                "
              >
                <span>Explore More</span>

                <motion.span
                  variants={{
                    rest: {
                      x: 0,
                    },
                    hover: {
                      x: 6,
                    },
                  }}
                  transition={{
                    duration: 0.22,
                    ease: "easeOut",
                  }}
                  className="
                    flex
                    items-center
                    justify-center
                    text-[#0075FF]
                  "
                >
                  <ArrowRight
                    size={19}
                    strokeWidth={1.5}
                  />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* =================================================
              RIGHT IMAGE
          ================================================= */}

          <motion.div
            variants={imageVariants}
            className="
              relative
              mx-auto
              h-[310px]
              w-full
              max-w-[280px]
              shrink-0
              overflow-hidden

              sm:h-[330px]
              sm:max-w-[300px]

              lg:mx-0
              lg:mt-[17px]
              lg:h-[277px]
              lg:w-[247px]
            "
          >
            <motion.div
              whileHover={{
                scale: 1.025,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                h-full
                w-full
                overflow-hidden
              "
            >
              <Image
                src="/images/principal.png"
                alt="Principal of Rosary Matriculation Higher Secondary School"
                fill
                sizes="
                  (max-width: 639px) 280px,
                  (max-width: 1023px) 300px,
                  247px
                "
                className="
                  object-cover
                  object-center
                "
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}