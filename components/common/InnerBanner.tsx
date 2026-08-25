"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* =========================================================
   TYPES
========================================================= */

interface InnerBannerProps {
  title: string;
  desktopImage: string;
  mobileImage?: string;
  alt?: string;
  subtitle?: string;
}

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

/* =========================================================
   COMPONENT
========================================================= */

export default function InnerBanner({
  title,
  desktopImage,
  mobileImage,
  alt = "Rosary School Banner",
  subtitle,
}: InnerBannerProps) {
  return (
    <section
      className="
        relative
        isolate

        w-full

        overflow-hidden

        bg-black
      "
    >
      {/* =====================================================
          DESKTOP / TABLET IMAGE

          1440 x 600
          Aspect ratio = 12 / 5

          1440px width => exactly 600px height
      ====================================================== */}

      <div
        className="
          relative

          hidden

          w-full

          aspect-[12/5]

          overflow-hidden

          bg-black

          md:block
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 1.02,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease,
          }}
          className="
            absolute
            inset-0
          "
        >
          <Image
            src={desktopImage}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="
              object-contain
              object-center
            "
          />
        </motion.div>
      </div>

      {/* =====================================================
          MOBILE IMAGE

          420 x 600
          Aspect ratio = 7 / 10

          420px width => exactly 600px height
      ====================================================== */}

      <div
        className="
          relative

          block

          w-full

          aspect-[7/10]

          overflow-hidden

          bg-black

          md:hidden
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 1.02,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease,
          }}
          className="
            absolute
            inset-0
          "
        >
          <Image
            src={mobileImage || desktopImage}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="
              object-contain
              object-center
            "
          />
        </motion.div>
      </div>

      {/* =====================================================
          BOTTOM GRADIENT
      ====================================================== */}

      {/* <div
        className="
          pointer-events-none

          absolute
          inset-0

          z-[2]

          bg-gradient-to-t

          from-black/15
          via-black/5
          to-transparent
        "
      /> */}

      {/* =====================================================
          OPTIONAL SIDE DARKNESS

          Helps text visibility without making entire
          image too dark.
      ====================================================== */}

      {/* <div
        className="
          pointer-events-none

          absolute
          inset-0

          z-[2]

          bg-black/[0.03]
        "
      /> */}

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          absolute
          inset-0

          z-10

          flex

          items-end
          justify-center

          px-[18px]

          pb-[58px]

          text-center

          sm:px-[24px]
          sm:pb-[44px]

          md:px-[32px]
          md:pb-[50px]

          lg:pb-[58px]

          xl:pb-[84px]
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 28,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease,
          }}
          className="
            mx-auto

            w-full
            max-w-[900px]

            text-center
          "
        >
          {/* =================================================
              TITLE
          ================================================= */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease,
            }}
            className="
              m-0

              font-primary

              text-[30px]
              font-semibold

              leading-[1.12]

              tracking-[-0.6px]

              !text-white

              drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)]

              sm:text-[34px]

              md:text-[38px]

              lg:text-[42px]

              xl:text-[46px]
            "
            style={{
              color: "#ffffff",
            }}
          >
            {title}
          </motion.h1>

          {/* =================================================
              SUBTITLE
          ================================================= */}

          {subtitle && (
            <motion.p
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.35,
                ease,
              }}
              className="
                mx-auto

                mt-[10px]

                max-w-[680px]

                font-secondary

                text-[13px]
                font-medium

                leading-[1.6]

                !text-white

                drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]

                sm:text-[14px]

                md:text-[15px]

                lg:text-[16px]
              "
              style={{
                color: "rgba(255,255,255,0.92)",
              }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}