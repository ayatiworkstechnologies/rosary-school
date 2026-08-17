"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease,
    },
  },
};

const imageReveal = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease,
    },
  },
};

export default function FoundressSection() {
  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-20">
        {/* TOP GOLD AREA */}
        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-[210px]

            sm:h-[230px]

            md:h-[250px]

            lg:h-[280px]
          "
          style={{
            background:
              "linear-gradient(90deg, #F9F295 0%, #E0AA3E 50%, #FAF398 75%, #B88A44 100%)",
          }}
        />

        {/* BOTTOM PATTERN AREA */}
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            top-[210px]

            bg-[url('/images/notice-bg.png')]
            bg-cover
            bg-top
            bg-repeat

            sm:top-[230px]

            md:top-[250px]

            lg:top-[280px]
          "
        />
      </div>

      {/* soft overlay */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          top-[210px]
          -z-10
          bg-white/[0.08]

          sm:top-[230px]

          md:top-[250px]

          lg:top-[280px]
        "
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.08,
          margin: "0px 0px -70px 0px",
        }}
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-[1280px]
          flex-col
          items-center

          px-[16px]
          pb-[38px]
          pt-[24px]

          sm:px-[22px]
          sm:pb-[44px]
          sm:pt-[28px]

          md:px-[30px]
          md:pb-[48px]

          lg:px-[45px]
          lg:pb-[58px]
          lg:pt-[32px]
        "
      >
        {/* TITLE */}
        <motion.h2
          variants={fadeUp}
          className="
            text-center
            font-primary
            text-[22px]
            font-semibold
            uppercase
            leading-[1.15]
            tracking-[-0.3px]
            !text-white

            sm:text-[25px]

            md:text-[28px]

            lg:text-[32px]
          "
        >
          Our Foundress
        </motion.h2>

        {/* IMAGE */}
        <motion.div
          variants={imageReveal}
          className="
            relative
            mt-[18px]
            h-[260px]
            w-[230px]
            overflow-hidden
            rounded-[5px]
            bg-[#D7DDE0]
            shadow-[0_18px_45px_rgba(0,0,0,0.15)]

            sm:mt-[20px]
            sm:h-[285px]
            sm:w-[255px]

            md:h-[315px]
            md:w-[285px]

            lg:mt-[26px]
            lg:h-[350px]
            lg:w-[320px]
          "
        >
          <motion.div
            initial={{ scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              ease,
            }}
            className="h-full w-full"
          >
            <Image
              src="/images/foundress.png"
              alt="Mary of the Passion"
              width={320}
              height={350}
              loading="lazy"
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
        </motion.div>

        {/* NAME */}
        <motion.h3
          variants={fadeUp}
          className="
            mt-[12px]
            text-center
            font-primary
            text-[18px]
            font-semibold
            leading-[1.2]
            !text-[#161616]

            sm:text-[20px]

            md:text-[22px]

            lg:text-[24px]
          "
        >
          Mary of the Passion
        </motion.h3>

        {/* DECORATION LINE */}
        <motion.div
          initial={{
            width: 0,
            opacity: 0,
          }}
          whileInView={{
            width: 54,
            opacity: 1,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            delay: 0.35,
            ease,
          }}
          className="
            mt-[10px]
            h-[2px]
            bg-[#DDA52E]
          "
        />

        {/* TEXT CONTENT */}
        <motion.div
          variants={container}
          className="
            mt-[18px]
            w-full
            max-w-[1100px]

            text-left

            lg:mt-[22px]
            lg:text-center
          "
        >
          <motion.p
            variants={fadeUp}
            className="
              font-secondary
              text-[13px]
              font-normal
              leading-[1.8]
              text-[#555555]

              sm:text-[13.5px]

              md:text-[14px]

              lg:text-[14px]
              lg:leading-[1.8]
            "
          >
            Born on 21st May 1839 in Nantes, France, into a noble Christian
            family, Helene Marie Philippine de Chappotin, in religion Mary of
            the Passion, was an exceptional woman marked by an inextinguishable
            love of the absolute. She was gifted with an uncommon superior
            intelligence, an open mind and resolute will given fully to God.
            The Institute of the Franciscan Missionaries of Mary was founded
            in 1877 by Blessed Mary of the Passion at Ootacamund, Tamil Nadu.
            It is an international religious congregation of women spread
            across the five continents around the globe.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="
              mt-[12px]
              font-secondary
              text-[13px]
              font-normal
              leading-[1.8]
              text-[#555555]

              sm:text-[13.5px]

              md:text-[14px]

              lg:text-[14px]
              lg:leading-[1.8]
            "
          >
            As a young sister, Mother Mary of the Passion came to India and
            had spent 11 years of her life at the service of the people of
            Tamil Nadu mostly among the children. The zeal of the foundress
            knew no bounds in responding to the needs of the poor and the
            abandoned. She was particularly interested in the promotion of
            women and their empowerment. Her intense activity drew its
            dynamism from contemplation of the great mysteries of faith. We
            discover Christ&apos;s message of love through their life of prayer
            and work and transmit this to our sisters and brothers by our
            varied activities.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="
              mt-[12px]
              font-secondary
              text-[13px]
              font-normal
              leading-[1.8]
              text-[#555555]

              sm:text-[13.5px]

              md:text-[14px]

              lg:text-[14px]
              lg:leading-[1.8]
            "
          >
            Our preference is to work for the poor and the marginalised,
            whoever they may be, to create a more just and human society. One
            of our major activities in India is providing formal education at
            all levels. We commit ourselves to serve the economically weak,
            socially backward and needy. Students are admitted irrespective
            of caste and creed.
          </motion.p>
        </motion.div>

        {/* bottom decoration */}
        <motion.div
          initial={{
            opacity: 0,
            scaleX: 0,
          }}
          whileInView={{
            opacity: 1,
            scaleX: 1,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 1.15,
            delay: 0.6,
            ease,
          }}
          className="
            mt-[22px]
            h-px
            w-[90px]
            origin-center
            bg-gradient-to-r
            from-transparent
            via-[#DDA52E]
            to-transparent
          "
        />
      </motion.div>
    </section>
  );
}