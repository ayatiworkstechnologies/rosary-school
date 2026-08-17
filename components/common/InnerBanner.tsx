"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface InnerBannerProps {
  title: string;
  desktopImage: string;
  mobileImage?: string;
  alt?: string;
  subtitle?: string;
}

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
        w-full
        overflow-hidden
        bg-black
      "
    >
      {/* =====================================================
          DESKTOP / TABLET IMAGE
      ====================================================== */}

      <div
        className="
          relative
          hidden
          h-[450px]
          w-full
          md:block
        "
      >
        <Image
          src={desktopImage}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-center
          "
        />
      </div>

      {/* =====================================================
          MOBILE IMAGE
      ====================================================== */}

      <div
        className="
          relative
          block
          h-[320px]
          w-full
          md:hidden
        "
      >
        <Image
          src={mobileImage || desktopImage}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-center
          "
        />
      </div>

      {/* =====================================================
          DARK OVERLAY
      ====================================================== */}

      {/* <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/30
        "
      /> */}

      {/* =====================================================
          BOTTOM GRADIENT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/60
          via-black/10
          to-transparent
        "
      />

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
          px-5
          pb-[42px]
          text-center

          sm:pb-[48px]

          md:pb-[58px]

          lg:pb-[65px]
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mx-auto
            w-full
            max-w-[850px]
            text-center
          "
        >
          {/* TITLE */}

          <motion.h1
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
              duration: 0.8,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              m-0
              font-primary
              text-[28px]
              font-semibold
              leading-[1.15]
              tracking-[-0.5px]
              !text-white

              drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]

              sm:text-[32px]

              md:text-[38px]

              lg:text-[42px]
            "
          >
            {title}
          </motion.h1>

          {/* SUBTITLE */}

          {subtitle && (
            <motion.p
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
                duration: 0.8,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mx-auto
                mt-[10px]
                max-w-[650px]
                font-secondary
                text-[14px]
                font-medium
                leading-[1.6]
                !text-white/90

                sm:text-[15px]

                md:text-[16px]
              "
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}