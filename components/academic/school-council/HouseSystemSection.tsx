"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* =========================================================
   TYPES
========================================================= */

type HouseItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  alt: string;
};

/* =========================================================
   DATA

   IMAGE SIZE:
   420px × 500px
========================================================= */

const houses: HouseItem[] = [
  {
    id: 1,
    title: "School Council",
    description: "Rosary Matriculation Hr. Sec. School",
    image: "/images/school-council.png",
    alt: "Rosary School Council",
  },
  {
    id: 2,
    title: "Fatima House",
    description: "Live not for yourself but for others.",
    image: "/images/fatima-house.png",
    alt: "Fatima House",
  },
  {
    id: 3,
    title: "Loretto House",
    description: "To serve and not to be served.",
    image: "/images/loretto-house.png",
    alt: "Loretto House",
  },
  {
    id: 4,
    title: "Lourdes House",
    description: "Charity and Politeness to all.",
    image: "/images/lourdes-house.png",
    alt: "Lourdes House",
  },
  {
    id: 5,
    title: "Carmel House",
    description: "Onward we go and never backward.",
    image: "/images/carmel-house.png",
    alt: "Carmel House",
  },
];

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const headingParent = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
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
      duration: 0.8,
      ease,
    },
  },
};

/* =========================================================
   HOUSE CARD
========================================================= */

function HouseCard({
  item,
  index,
}: {
  item: HouseItem;
  index: number;
}) {
  /*
   * Desktop layout:
   *
   * 1  2  3
   *   4  5
   *
   * Grid has 6 columns.
   * Each card takes 2 columns.
   */
  const desktopPosition =
    index === 3
      ? "lg:col-span-2 lg:col-start-2"
      : index === 4
        ? "lg:col-span-2 lg:col-start-4"
        : "lg:col-span-2";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 46,
        scale: 0.96,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.2,
        margin: "0px 0px -40px 0px",
      }}
      transition={{
        duration: 0.85,
        delay: index * 0.07,
        ease,
      }}
      whileHover={{
        y: -7,
      }}
      className={`
        group

        w-full

        ${desktopPosition}
      `}
    >
      {/* ===================================================
          IMAGE CARD

          420 / 500 = 21 / 25
      ==================================================== */}

      <div
        className="
          relative

          mx-auto

          aspect-[21/25]

          w-full
          max-w-[420px]

          overflow-hidden

          rounded-[14px]

          bg-[#FFF5A8]

          shadow-[0_12px_32px_rgba(31,43,60,0.10)]

          transition-all
          duration-500

          group-hover:shadow-[0_22px_50px_rgba(0,117,255,0.15)]
        "
      >
        {/* =================================================
            IMAGE
        ================================================= */}

        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="
            (max-width:639px) 100vw,
            (max-width:1023px) 50vw,
            420px
          "
          className="
            object-cover
            object-center

            transition-transform
            duration-700
            ease-out

            group-hover:scale-[1.035]
          "
        />

        {/* =================================================
            VERY LIGHT BOTTOM GRADIENT
        ================================================= */}

        <div
          className="
            pointer-events-none

            absolute
            inset-x-0
            bottom-0

            h-[34%]

            bg-gradient-to-t

            from-black/10
            via-black/[0.02]
            to-transparent
          "
        />

        {/* =================================================
            WHITE INFORMATION PANEL
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
            duration: 0.7,
            delay: 0.22 + index * 0.06,
            ease,
          }}
          className="
            absolute

            bottom-[16px]
            left-[22px]
            right-[22px]

            z-20

            flex
            min-h-[78px]

            flex-col

            items-center
            justify-center

            rounded-[7px]

            bg-white

            px-[16px]
            py-[10px]

            text-center

            shadow-[0_8px_22px_rgba(0,0,0,0.10)]

            sm:left-[26px]
            sm:right-[26px]
          "
        >
          {/* BLUE HOUSE NAME */}

          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="
              inline-flex

              min-h-[34px]

              items-center
              justify-center

              rounded-[4px]

              bg-[#0075FF]

              px-[18px]

              font-primary

              text-[11px]
              font-semibold

              uppercase

              tracking-[0.1px]

              !text-white

              shadow-[0_5px_13px_rgba(0,117,255,0.18)]

              sm:text-[12px]
            "
            style={{
              color: "#ffffff",
            }}
          >
            {item.title}
          </motion.div>

          {/* DESCRIPTION */}

          <p
            className="
              mt-[8px]

              font-secondary

              text-[10px]

              leading-[1.4]

              text-[#737B84]

              sm:text-[11px] pt-3
            "
          >
            {item.description}
          </p>
        </motion.div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HouseSystemSection() {
  return (
    <section
      className="
        relative

        w-full

        overflow-hidden

        bg-white

        py-[52px]

        sm:py-[64px]

        lg:py-[76px]
      "
    >
      {/* =====================================================
          VERY SUBTLE BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          left-1/2
          top-[220px]

          h-[500px]
          w-[900px]

          -translate-x-1/2

          rounded-full

          bg-[#FFF3A0]/[0.05]

          blur-[110px]
        "
      />

      {/* =====================================================
          CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto

          w-full
          max-w-[1380px]

          px-[18px]

          sm:px-[28px]

          lg:px-[34px]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          variants={headingParent}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.4,
          }}
          className="
            mx-auto

            max-w-[1180px]

            text-center
          "
        >
          {/* CHIP */}

          <motion.span
            variants={fadeUp}
            className="
              inline-flex

              rounded-[4px]

              bg-[#EEF6FF]

              px-[9px]
              py-[4px]

              font-secondary

              text-[9px]
              font-medium

              text-[#0075FF]

              sm:text-[10px]
            "
          >
            School Council
          </motion.span>

          {/* TITLE */}

          <motion.h2
            variants={fadeUp}
            className="
              mt-[14px]

              font-primary

              text-[28px]
              font-semibold

              uppercase pt-3

              leading-[1.1]

              tracking-[-0.5px]

              text-[#151922]

              sm:text-[32px]

              lg:text-[36px]
            "
          >
            House System
          </motion.h2>

          {/* PARAGRAPH */}

          <motion.p
            variants={fadeUp}
            className="
              mx-auto

              mt-[14px]

              max-w-[1140px]

              font-secondary pt-3

              text-[11px]

              leading-[1.5]

              text-[#7B8188]

              sm:text-[12px]

              lg:text-[13px]
              lg:leading-[1.55]
            "
          >
            Every child from std. I upwards is allocated to one of
            the four houses. This gives a sense of identity, and
            helps a child develop the finer points of loyalty,
            cooperation and a team spirit. High standards are also
            maintained by the stimulation of healthy competition
            between the Houses. Every pupil is expected to play
            her part to the full. All members of the staff are
            fully involved in the educative activities of the
            school. Close co-operation between home and school has
            been one of the dynamic influences in the development
            of this type of education.
          </motion.p>
        </motion.div>

        {/* =================================================
            HOUSE GRID
        ================================================= */}

        <div
          className="
            mx-auto

            mt-[42px]

            grid

            w-full

            grid-cols-1

            gap-[24px]

            sm:grid-cols-2

            sm:gap-[26px]

            lg:mt-[54px]

            lg:grid-cols-6

            lg:gap-x-[28px]
            lg:gap-y-[32px]
          "
        >
          {houses.map((item, index) => (
            <HouseCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}