"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type ApproachItem = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

/* =========================================================
   DATA
========================================================= */

const approachItems: ApproachItem[] = [
  {
    id: 1,
    title: "Conceptual Learning",
    description:
      "Building strong understanding beyond memorisation.",
    icon: "/icons/target.svg",
  },
  {
    id: 2,
    title: "Critical Thinking",
    description:
      "Encouraging students to analyse, question and solve problems.",
    icon: "/icons/target.svg",
  },
  {
    id: 3,
    title: "Creative Exploration",
    description:
      "Supporting imagination through projects and activities.",
    icon: "/icons/target.svg",
  },
  {
    id: 4,
    title: "Values & Character",
    description:
      "Integrating responsibility, discipline and compassion into learning.",
    icon: "/icons/target.svg",
  },
];

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

/* =========================================================
   CARD
========================================================= */

function ApproachCard({
  item,
  index,
  activeIndex,
  setActiveIndex,
}: {
  item: ApproachItem;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  const active = activeIndex === index;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 45,
        scale: 0.965,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.18,
        margin: "0px 0px -45px 0px",
      }}
      transition={{
        duration: 1.05,
        delay: index * 0.1,
        ease,
      }}
      onMouseEnter={() => setActiveIndex(index)}
      onFocus={() => setActiveIndex(index)}
      animate={{
        borderColor: active
          ? "rgba(0,117,255,0.68)"
          : "rgba(228,233,238,1)",

        boxShadow: active
          ? "0 18px 42px rgba(0,117,255,0.11)"
          : "0 12px 30px rgba(25,45,72,0.055)",
      }}
      className="
        relative
        z-10

        mx-auto

        flex

        h-[245px]
        w-full
        max-w-[330px]

        flex-col

        overflow-hidden

        rounded-[7px]

        border

        bg-white

        px-[17px]
        pb-[17px]
        pt-[16px]

        sm:h-[240px]
        sm:max-w-none

        md:h-[245px]

        lg:h-[235px]
        lg:w-[175px]

        xl:h-[240px]
        xl:w-[180px]
      "
    >
      {/* NUMBER */}

      <span
        className="
          font-primary

          text-[10px]
          font-semibold

          leading-none

          text-[#171717]

          sm:text-[11px]
        "
      >
        {String(item.id).padStart(2, "0")}
      </span>

      {/* ICON */}

      <div
        className="
          flex
          flex-1

          items-center
          justify-center

          py-[12px]
        "
      >
        <motion.div
          animate={{
            scale: active ? 1.07 : 1,
          }}
          transition={{
            duration: 0.55,
            ease,
          }}
          className="
            h-[62px]
            w-[62px]

            sm:h-[65px]
            sm:w-[65px]
          "
          style={{
            backgroundColor: active ? "#0075FF" : "#171717",

            WebkitMaskImage: `url("${item.icon}")`,
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",

            maskImage: `url("${item.icon}")`,
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
          }}
        />
      </div>

      {/* CONTENT */}

      <div>
        <motion.h3
          animate={{
            color: active ? "#111111" : "#151515",
          }}
          transition={{
            duration: 0.4,
          }}
          className="
            font-primary

            text-[14px]
            font-semibold

            leading-[1.18]

            tracking-[-0.25px]

            sm:text-[15px]
          "
        >
          {item.title}
        </motion.h3>

        <p
          className="
            mt-[7px]

            font-secondary

            text-[10px]
            font-normal

            leading-[1.45]

            text-[#606060]

            sm:text-[10.5px]
          "
        >
          {item.description}
        </p>
      </div>

      {/* ACTIVE GLOW */}

      <motion.div
        animate={{
          opacity: active ? 1 : 0,
        }}
        transition={{
          duration: 0.55,
        }}
        className="
          pointer-events-none

          absolute

          -left-[55px]
          -top-[55px]

          h-[140px]
          w-[140px]

          rounded-full

          bg-[#0075FF]/[0.035]

          blur-[42px]
        "
      />
    </motion.article>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function LearningApproach() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      className="
        relative
        isolate

        w-full

        overflow-hidden

        bg-[#FCFDFE]

        py-[58px]

        sm:py-[68px]

        md:py-[76px]

        lg:min-h-[560px]
        lg:py-[72px]

        xl:min-h-[580px]
      "
    >
      {/* =====================================================
          GRID BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          -z-30
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(25,71,120,0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(25,71,120,0.05) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "42px 42px",
        }}
      />

      {/* LEFT GLOW */}

      <div
        className="
          pointer-events-none

          absolute

          -left-[150px]
          top-[170px]

          -z-20

          h-[420px]
          w-[420px]

          rounded-full

          bg-[#0075FF]/[0.04]

          blur-[125px]
        "
      />

      {/* =====================================================
          RIGHT BLUE VECTOR
      ====================================================== */}

      <motion.svg
        initial={{
          opacity: 0,
          x: 110,
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
          duration: 1.55,
          ease,
        }}
        viewBox="0 0 1125 1139"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          right-0
          top-0

          -z-20

          hidden

          h-[500px]
          w-[300px]

          md:block

          lg:h-[560px]
          lg:w-[360px]

          xl:h-[580px]
          xl:w-[390px]
        "
      >
        <path
          d="
            M 0 0

            H 1125

            V 1139

            H 930

            C 1035 965
              1030 785
              945 625

            C 863 470
              725 368
              568 278

            C 423 195
              270 130
              143 60

            C 88 30
              40 9
              0 0

            Z
          "
          fill="#0075FF"
        />
      </motion.svg>

      {/* =====================================================
          ONE DOTTED ARROW
          DESKTOP ONLY
      ====================================================== */}

      <motion.svg
        initial={{
          opacity: 0,
          x: -18,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 1.1,
          delay: 0.2,
          ease,
        }}
        viewBox="0 0 483 165"
        fill="none"
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          left-[20px]
          top-[92px]

          z-[2]

          hidden

          h-[135px]
          w-[390px]

          lg:block

          xl:left-[38px]
          xl:top-[126px]
          xl:h-[145px]
          xl:w-[585px]
        "
      >
        <defs>
          <marker
            id="approachArrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
          >
            <path
              d="M1 1 L8 5 L1 9"
              fill="none"
              stroke="#0075FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        <motion.path
          initial={{
            strokeDashoffset: 120,
          }}
          whileInView={{
            strokeDashoffset: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.8,
            delay: 0.3,
            ease,
          }}
          d="
            M 470 16

            C 465 43
              454 61
              432 72

            C 404 86
              372 84
              338 73

            C 292 58
              249 39
              206 26

            C 161 12
              118 8
              82 16

            C 48 23
              26 39
              16 61

            C 7 82
              10 102
              25 117

            C 40 132
              59 138
              86 139
          "
          stroke="#0075FF"
          strokeWidth="2"
          strokeDasharray="3 8"
          strokeLinecap="round"
          markerEnd="url(#approachArrow)"
        />
      </motion.svg>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto

          w-full
          max-w-[1000px]

          px-[16px]

          sm:px-[24px]

          lg:px-[20px]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 32,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.35,
          }}
          transition={{
            duration: 1.05,
            ease,
          }}
          className="
            relative
            z-10

            flex

            flex-col

            items-center
            justify-center

            text-center
          "
        >
          {/* CHIP */}

          <motion.span
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.75,
              ease,
            }}
            className="
              inline-flex

              rounded-[3px]

              bg-[#F1F7FF]

              px-[7px]
              py-[4px]

              font-secondary

              text-[8px]
              font-medium

              uppercase

              leading-none

              tracking-[0.35px]

              text-[#0075FF]

              sm:text-[9px]
            "
          >
            Our Approach
          </motion.span>

          {/* TITLE */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 22,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease,
            }}
            className="
              mx-auto

              mt-[11px]

              max-w-[450px]

              font-primary

              text-[26px]
              font-semibold

              leading-[1.02]

              tracking-[-0.7px]

              !text-[#111111]

              sm:text-[30px]

              lg:text-[34px]
            "
          >
            Learning That Builds Strong
            <br />
            Foundations
          </motion.h2>

          {/* small accent */}

          <motion.div
            initial={{
              scaleX: 0,
              opacity: 0,
            }}
            whileInView={{
              scaleX: 1,
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.9,
              delay: 0.35,
              ease,
            }}
            className="
              mt-[16px]

              h-[2px]
              w-[44px]

              origin-center

              bg-[#0075FF]
            "
          />
        </motion.div>

        {/* =================================================
            CARDS
        ================================================= */}

        <div
          onMouseLeave={() => setActiveIndex(0)}
          className="
            relative
            z-10

            mx-auto

            mt-[48px]

            grid

            w-full

            grid-cols-1

            gap-[18px]

            sm:mt-[52px]
            sm:grid-cols-2
            sm:gap-[20px]

            md:mt-[56px]

            lg:mt-[60px]
            lg:w-[840px]
            lg:grid-cols-4
            lg:gap-[40px]

            xl:w-[860px]
          "
        >
          {approachItems.map((item, index) => (
            <ApproachCard
              key={item.id}
              item={item}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}