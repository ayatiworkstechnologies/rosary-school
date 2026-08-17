"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* =========================================================
   TYPES
========================================================= */

type GoalItem = {
  id: number;
  text: string;
};

/* =========================================================
   CONTENT
   Add as many items as you want.
========================================================= */

const goals: GoalItem[] = [
  {
    id: 1,
    text: "A deep respect for the human person.",
  },
  {
    id: 2,
    text: "A sound philosophy of life based on faith in God.",
  },
  {
    id: 3,
    text: "A formation in values of truth, love, justice, freedom and peace.",
  },
  {
    id: 4,
    text: "Right relationship among people and nature.",
  },
  {
    id: 5,
    text: "Preparing women who fulfil their professional duties with a high sense of duty and citizenship whatever career they may adopt.",
  },

  
  {
    id: 6,
    text: "Developing leadership through responsibility and service.",
  },
  // {
  //   id: 7,
  //   text: "Preparing students to face the future with confidence.",
  // },
];

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const revealContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
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
      duration: 1.05,
      ease,
    },
  },
};

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(number: number) {
  return String(number).padStart(2, "0");
}

/* =========================================================
   MOVING ACTIVE BOX CAROUSEL
========================================================= */

type GoalsCarouselProps = {
  items: GoalItem[];
  activeIndex: number;
  onChange: (index: number) => void;

  /* layout */
  visibleCount: number;
  rowHeight: number;
  viewportHeight: number;

  /* responsive positioning */
  numberWidth: number;
  contentLeft: number;
};

function GoalsCarousel({
  items,
  activeIndex,
  onChange,
  visibleCount,
  rowHeight,
  viewportHeight,
  numberWidth,
  contentLeft,
}: GoalsCarouselProps) {
  /* =======================================================
     WINDOW POSITION

     01 -> active box row 1
     02 -> active box row 2
     03 -> active box row 3
     ...

     When there are more items than visibleCount,
     the track begins scrolling upward one row at a time.
  ======================================================= */

  const { windowStart, activePosition } = useMemo(() => {
    if (activeIndex < visibleCount) {
      return {
        windowStart: 0,
        activePosition: activeIndex,
      };
    }

    return {
      windowStart: activeIndex - visibleCount + 1,
      activePosition: visibleCount - 1,
    };
  }, [activeIndex, visibleCount]);

  const activeBoxTop =
    activePosition * rowHeight + Math.round((rowHeight - 56) / 2);

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
      "
      style={{
        height: viewportHeight,
      }}
    >
      {/* =====================================================
          VERTICAL TIMELINE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          top-0
          z-20
          w-px
          bg-[#E4E7EB]
        "
      />

      {/* =====================================================
          MOVING ACTIVE BOX
          This is the box that travels DOWN the list.
      ====================================================== */}

      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{
          y: activeBoxTop,
        }}
        transition={{
          duration: 1.25,
          ease,
        }}
        className="
          pointer-events-none
          absolute
          right-[4px]
          top-0
          z-[5]
          h-[56px]
          border
          border-[#0075FF]
          bg-white
          shadow-[0_9px_26px_rgba(0,117,255,0.08)]
        "
        style={{
          left: contentLeft,
        }}
      >
        {/* very subtle blue fill */}
        <div
          className="
            absolute
            inset-0
            bg-[#0075FF]/[0.018]
          "
        />
      </motion.div>

      {/* =====================================================
          TRACK
          Only starts moving upward after the active box
          reaches the last visible row.
      ====================================================== */}

      <motion.div
        initial={false}
        animate={{
          y: -(windowStart * rowHeight),
        }}
        transition={{
          duration: 1.25,
          ease,
        }}
        className="
          absolute
          left-0
          right-0
          top-0
          z-10
        "
      >
        {items.map((item, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(index)}
              className="
                relative
                flex
                w-full
                items-center
                text-left
                outline-none
              "
              style={{
                height: rowHeight,
              }}
            >
              {/* =============================================
                  TIMELINE DOT
              ============================================== */}

              <motion.span
                initial={false}
                animate={{
                  scale: active ? 1 : 0.74,
                  opacity: active ? 1 : 0.15,
                }}
                transition={{
                  duration: 0.9,
                  ease,
                }}
                className={`
                  absolute
                  left-[0px]
                  top-1/2
                  z-30
                  h-[9px]
                  w-[9px]
                  -translate-y-1/2
                  rounded-full
                  border-[2px]
                  border-white

                  ${
                    active
                      ? "bg-[#0075FF] shadow-[0_0_0_4px_rgba(0,117,255,0.07)]"
                      : "bg-[#D9DDE2]"
                  }
                `}
              />

              {/* =============================================
                  NUMBER
              ============================================== */}

              <div
                className="
                  relative
                  z-20
                  shrink-0
                  pl-[28px]

                  sm:pl-[32px]
                "
                style={{
                  width: numberWidth,
                }}
              >
                <motion.span
                  initial={false}
                  animate={{
                    scale: active ? 1.08 : 1,
                    x: active ? 1 : 0,
                  }}
                  transition={{
                    duration: 1,
                    ease,
                  }}
                  className={`
                    block
                    origin-left
                    font-primary
                    font-semibold
                    leading-none
                    tracking-[-1px]
                    transition-colors
                    duration-[1000ms]

                    ${
                      active
                        ? "text-[30px] !text-[#0075FF] sm:text-[34px]"
                        : "text-[21px] !text-[#C9CDD2] sm:text-[23px]"
                    }
                  `}
                >
                  {formatNumber(item.id)}
                </motion.span>
              </div>

              {/* =============================================
                  TEXT
              ============================================== */}

              <motion.div
                initial={false}
                animate={{
                  x: active ? 0 : -3,
                }}
                transition={{
                  duration: 1,
                  ease,
                }}
                className="
                  relative
                  z-20
                  min-w-0
                  flex-1
                  px-[13px]
                  py-[8px]
                "
              >
                <p
                  className={`
                    max-w-[720px]
                    font-secondary
                    font-medium
                    leading-[1.45]
                    transition-all
                    duration-[1000ms]

                    ${
                      active
                        ? "text-[13px] !text-[#2D2D2D] sm:text-[14px] lg:text-[15px]"
                        : "text-[11.5px] !text-[#454545] sm:text-[12.5px] lg:text-[13px]"
                    }
                  `}
                >
                  {item.text}
                </p>
              </motion.div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GoalsObjectives() {
  /* Start from 01 */
  const [activeIndex, setActiveIndex] = useState(0);

  const [paused, setPaused] = useState(false);

  /* =======================================================
     MANUAL SELECT

     Clicking an objective changes the active item only.
     It does not permanently stop autoplay.

     Desktop:
     - Hover = pause
     - Mouse leave = resume
     - Next automatic change happens after 3 seconds

     Mobile / tablet:
     - Tap changes the active item
     - Autoplay continues automatically
  ======================================================= */

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  /* =======================================================
     AUTO PLAY
     Changes every 3 seconds.
  ======================================================= */

  useEffect(() => {
    if (paused || goals.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        return current === goals.length - 1
          ? 0
          : current + 1;
      });
    }, 3000);

    return () => {
      window.clearInterval(timer);
    };
  }, [paused]);

  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-white
      "
      style={{
        backgroundImage: `
          radial-gradient(
            circle,
            rgba(0, 117, 255, 0.045) 2px,
            transparent 2px
          )
        `,
        backgroundSize: "34px 34px",
      }}
    >
      

      

      {/* =====================================================
          SOFT CORNER GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[170px]
          -right-[130px]
          -z-10
          h-[430px]
          w-[430px]
          rounded-full
          bg-[#0075FF]/[0.03]
          blur-[115px]
        "
      />

      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <motion.div
        variants={revealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.12,
        }}
        className="
          mx-auto
          hidden
          min-h-[500px]
          w-full
          max-w-[1440px]
          grid-cols-[36%_64%]
          px-[45px]

          lg:grid

          xl:px-[70px]
        "
      >
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <motion.div
          variants={revealContainer}
          className="
            relative
            flex
            items-center
            border-r
            border-[#E4E7EB]
            pr-[58px]
          "
        >
          <div
            className="
              ml-auto
              w-full
              max-w-[350px]
            "
          >
            {/* CHIP */}

            <motion.span
              variants={fadeUp}
              className="
                inline-flex
                rounded-[3px]
                bg-[#F0F7FF]
                px-[7px]
                py-[4px]
                font-secondary
                text-[10px]
                font-medium
                leading-none
                text-[#0075FF]
              "
            >
              Events
            </motion.span>

            {/* HEADING */}

            <motion.h2
              variants={fadeUp}
              className="
                mt-[13px]
                font-primary
                text-[27px]
                font-semibold
                leading-[1.15]
                tracking-[-0.6px]
                !text-[#111111]

                xl:text-[30px]
              "
            >
              Goals And Objectives
            </motion.h2>

            {/* DESCRIPTION */}

            <motion.p
              variants={fadeUp}
              className="
                mt-[11px]
                max-w-[310px]
                font-secondary
                text-[13px]
                font-normal
                leading-[1.48]
                text-[#6F6F6F]

                xl:text-[14px]
              "
            >
              Guiding every student towards academic excellence,
              strong values, personal growth, and responsible citizenship.
            </motion.p>

            {/* BLUE LINE */}

            <motion.div
              variants={fadeUp}
              className="
                mt-[22px]
                h-[2px]
                w-[44px]
                bg-[#0075FF]
              "
            />
          </div>
        </motion.div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <motion.div
          variants={fadeUp}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="
            relative
            flex
            items-center
            overflow-hidden
            pl-0
          "
        >
          <div className="h-[430px] w-full">
            <GoalsCarousel
              items={goals}
              activeIndex={activeIndex}
              onChange={handleSelect}
              visibleCount={5}
              rowHeight={86}
              viewportHeight={430}
              numberWidth={92}
              contentLeft={92}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* =====================================================
          MOBILE + TABLET
      ====================================================== */}

      <motion.div
        variants={revealContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.08,
        }}
        className="
          mx-auto
          w-full
          max-w-[850px]
          px-[18px]
          py-[38px]

          sm:px-[28px]
          sm:py-[45px]

          lg:hidden
        "
      >
        {/* =================================================
            TOP CONTENT
        ================================================= */}

        <motion.div variants={revealContainer}>
          <motion.span
            variants={fadeUp}
            className="
              inline-flex
              rounded-[3px]
              bg-[#F0F7FF]
              px-[7px]
              py-[4px]
              font-secondary
              text-[10px]
              font-medium
              leading-none
              text-[#0075FF]
            "
          >
            Events
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="
              mt-[11px]
              font-primary
              text-[24px]
              font-semibold
              leading-[1.15]
              tracking-[-0.5px]
              !text-[#111111]

              sm:text-[29px]
            "
          >
            Goals And Objectives
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="
              mt-[9px]
              max-w-[470px]
              font-secondary
              text-[13px]
              leading-[1.55]
              text-[#707070]

              sm:text-[14px]
            "
          >
            Guiding every student towards academic excellence,
            strong values, personal growth, and responsible citizenship.
          </motion.p>
        </motion.div>

        {/* =================================================
            MOBILE CAROUSEL
        ================================================= */}

        <motion.div
          variants={fadeUp}
          className="
            relative
            mt-[26px]
            w-full
            overflow-hidden
          "
        >
          <GoalsCarousel
            items={goals}
            activeIndex={activeIndex}
            onChange={handleSelect}
            visibleCount={3}
            rowHeight={92}
            viewportHeight={276}
            numberWidth={72}
            contentLeft={72}
          />
        </motion.div>

        {/* =================================================
            PROGRESS INDICATORS
        ================================================= */}

        <motion.div
          variants={fadeUp}
          className="
            mt-[18px]
            flex
            items-center
            justify-center
            gap-[7px]
          "
        >
          {goals.map((goal, index) => (
            <button
              key={`goal-dot-${goal.id}`}
              type="button"
              aria-label={`Show objective ${index + 1}`}
              onClick={() => handleSelect(index)}
              className={`
                h-[5px]
                rounded-full
                transition-all
                duration-[1000ms]

                ${
                  activeIndex === index
                    ? "w-[24px] bg-[#0075FF]"
                    : "w-[5px] bg-[#D8DDE3]"
                }
              `}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}