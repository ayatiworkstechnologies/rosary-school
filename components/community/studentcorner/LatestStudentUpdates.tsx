"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useEffect,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type StudentUpdate = {
  id: number;
  category: string;
  title: string;
  date: string;
};

/* =========================================================
   DATA
========================================================= */

const studentUpdates: StudentUpdate[] = [
  {
    id: 1,
    category: "Examinations",
    title:
      "Final Term Examination Schedule Released (Grade VI to XII)",
    date: "March 15, 2026",
  },
  {
    id: 2,
    category: "Competitions",
    title:
      "Registration Open: Annual Inter-School Science & Tech Fair 2026",
    date: "March 12, 2026",
  },
  {
    id: 3,
    category: "Club Activities",
    title:
      "Weekly Club Activity Update: Eco-Club Tree Planting Drive",
    date: "March 10, 2026",
  },
  {
    id: 4,
    category: "Events",
    title:
      "School Event Announcement: Annual Cultural Day Preparation",
    date: "March 08, 2026",
  },
];

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 26,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.9,
      ease,
    },
  },
};

/* =========================================================
   UPDATE ROW
========================================================= */

function UpdateRow({
  item,
  index,
  activeIndex,
  onActivate,
  onPause,
  onResume,
}: {
  item: StudentUpdate;
  index: number;
  activeIndex: number;
  onActivate: (index: number) => void;
  onPause: () => void;
  onResume: () => void;
}) {
  const active =
    activeIndex === index;

  const reduceMotion =
    useReducedMotion();

  return (
    <motion.article
      variants={fadeUp}
      onMouseEnter={() => {
        onActivate(index);
        onPause();
      }}
      onMouseLeave={onResume}
      onFocus={() => {
        onActivate(index);
        onPause();
      }}
      onBlur={onResume}
      animate={{
        opacity: active ? 1 : 0.65,
        scale: active ? 1 : 0.997,
        y: active ? -2 : 0,
      }}
      transition={{
        duration: reduceMotion
          ? 0
          : 0.6,
        ease,
      }}
      tabIndex={0}
      className="
        group
        relative

        w-full

        cursor-pointer

        rounded-[10px]

        outline-none
      "
    >
      {/* =====================================================
          ACTIVE MOVING BACKGROUND
      ====================================================== */}

      {active && (
        <motion.div
          layoutId="student-update-active"
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 29,
            mass: 0.95,
          }}
          className="
            pointer-events-none

            absolute
            inset-0

            rounded-[10px]

            border
            border-[#CDE4FC]

            bg-white

            shadow-[0_14px_38px_rgba(0,117,255,0.08)]
          "
        />
      )}

      {/* =====================================================
          INACTIVE BACKGROUND
      ====================================================== */}

      {!active && (
        <div
          className="
            pointer-events-none

            absolute
            inset-0

            rounded-[10px]

            border
            border-[#E5DCCF]

            bg-white/80
          "
        />
      )}

      {/* =====================================================
          ACTIVE LEFT LINE
      ====================================================== */}

      {active && (
        <motion.span
          layoutId="student-update-line"
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 29,
          }}
          className="
            absolute

            bottom-[10px]
            left-0
            top-[10px]

            z-20

            w-[2px]

            rounded-r-full

            bg-[#0075FF]
          "
        />
      )}

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10

          grid

          min-h-[78px]

          grid-cols-[auto_1fr]

          items-center

          gap-x-[10px]
          gap-y-[9px]

          px-[15px]
          py-[14px]

          sm:min-h-[72px]

          sm:grid-cols-[auto_auto_1fr_auto]

          sm:gap-x-[14px]

          sm:px-[19px]
          sm:py-[13px]

          md:min-h-[74px]
          md:px-[22px]

          lg:min-h-[76px]
          lg:px-[25px]

          xl:px-[28px]
      "
      >
        {/* =================================================
            DOT
        ================================================= */}

        <motion.div
          animate={{
            scale: active
              ? 1
              : 0.72,

            opacity: active
              ? 1
              : 0.38,
          }}
          transition={{
            duration: 0.45,
            ease,
          }}
          className="
            relative

            flex

            h-[14px]
            w-[14px]

            shrink-0

            items-center
            justify-center
          "
        >
          {active && (
            <motion.span
              initial={{
                opacity: 0,
                scale: 0.4,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
                ease,
              }}
              className="
                absolute

                h-[14px]
                w-[14px]

                rounded-full

                bg-[#0075FF]/10
              "
            />
          )}

          <span
            className="
              relative

              h-[6px]
              w-[6px]

              rounded-full

              bg-[#0075FF]
            "
          />
        </motion.div>

        {/* =================================================
            CATEGORY
        ================================================= */}

        <motion.span
          animate={{
            backgroundColor: active
              ? "#EAF4FF"
              : "#F2F7FC",

            color: active
              ? "#0075FF"
              : "#90BCEB",
          }}
          transition={{
            duration: 0.5,
            ease,
          }}
          className="
            inline-flex

            w-fit

            items-center
            justify-center

            rounded-[5px]

            px-[9px]
            py-[5px]

            font-secondary

            text-[10px]
            font-medium

            leading-none

            whitespace-nowrap

            sm:px-[10px]
            sm:text-[10.5px]

            md:text-[11px]

            lg:px-[11px]
            lg:text-[11px]
          "
        >
          {item.category}
        </motion.span>

        {/* =================================================
            TITLE
        ================================================= */}

        <motion.h3
          animate={{
            color: active
              ? "#1E1E1E"
              : "#777777",
          }}
          transition={{
            duration: 0.5,
            ease,
          }}
          className="
            col-span-2

            font-secondary

            text-[13px]
            font-medium

            leading-[1.5]

            tracking-[-0.15px]

            sm:col-span-1
            sm:text-[13px]

            md:text-[13.5px]

            lg:text-[14px]

            xl:text-[14.5px]
          "
        >
          {item.title}
        </motion.h3>

        {/* =================================================
            DATE
        ================================================= */}

        <motion.span
          animate={{
            color: active
              ? "#5E5E5E"
              : "#969696",
          }}
          transition={{
            duration: 0.5,
            ease,
          }}
          className="
            col-span-2

            pl-[24px]

            font-secondary

            text-[10.5px]
            font-medium

            leading-none

            whitespace-nowrap

            sm:col-span-1
            sm:pl-0
            sm:text-[10.5px]

            md:text-[11px]

            lg:text-[11.5px]
          "
        >
          {item.date}
        </motion.span>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function LatestStudentUpdates() {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    paused,
    setPaused,
  ] = useState(false);

  const reduceMotion =
    useReducedMotion();

  /* =========================================================
     AUTO LOOP
  ========================================================= */

  useEffect(() => {
    if (
      paused ||
      reduceMotion
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setActiveIndex(
            (current) =>
              (current + 1) %
              studentUpdates.length
          );
        },
        3000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    paused,
    reduceMotion,
  ]);

  return (
    <section
      className="
        relative
        isolate

        w-full

        overflow-hidden

        bg-white

        py-[52px]

        sm:py-[62px]

        md:py-[70px]

        lg:py-[78px]
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          -z-30

          bg-top
          bg-repeat-y

          opacity-[0.7]

          [background-size:1050px_auto]

          sm:[background-size:1250px_auto]

          md:[background-size:1450px_auto]

          lg:bg-center
          lg:bg-no-repeat
          lg:[background-size:cover]
        "
        style={{
          backgroundImage:
            "url('/images/academics-bg.png')",
        }}
      />

      {/* WHITE WASH */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          -z-20

          bg-white/20
        "
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.div
        variants={
          containerVariants
        }
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.3,
        }}
        className="
          relative
          z-10

          mx-auto

          flex

          w-full
          max-w-[1100px]

          flex-col
          items-center

          px-[18px]

          text-center
        "
      >
        {/* =================================================
            CHIP
        ================================================= */}

        <motion.span
          variants={fadeUp}
          className="
            inline-flex

            items-center
            justify-center

            rounded-[4px]

            bg-[#EEF6FF]

            px-[10px]
            py-[5px]

            font-secondary

            text-[10px]
            font-medium

            uppercase

            leading-none

            tracking-[0.3px]

            text-[#0075FF]

            sm:text-[11px]

            lg:text-[12px]
          "
        >
          Updates
        </motion.span>

        {/* =================================================
            HEADING
        ================================================= */}

        <motion.h2
          variants={fadeUp}
          className="
            mt-[15px]

            font-primary

            text-[28px]
            font-semibold

            leading-[1.08]

            tracking-[-0.65px]

            text-[#151515]

            sm:text-[32px]

            md:text-[35px]

            lg:text-[38px] pt-3
          "
        >
          Latest Student Updates
        </motion.h2>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <motion.p
          variants={fadeUp}
          className="
            mx-auto

            mt-[11px]

            max-w-[520px] pt-3

            font-secondary

            text-[12px]

            leading-[1.55]

            text-[#7E7E7E]

            sm:text-[12.5px]

            md:text-[13px]

            lg:text-[13.5px]
          "
        >
          Learn, explore,
          participate, and grow
          with confidence.
        </motion.p>
      </motion.div>

      {/* =====================================================
          UPDATE LIST
      ====================================================== */}

      <motion.div
        variants={
          containerVariants
        }
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.08,
        }}
        className="
          relative
          z-10

          mx-auto

          mt-[38px]

          w-full
          max-w-[1260px]

          px-[15px]

          sm:mt-[44px]
          sm:px-[26px]

          md:px-[38px]

          lg:mt-[50px]
          lg:px-[48px]

          xl:px-[54px]
        "
      >
        {/* =================================================
            ROWS
        ================================================= */}

        <div
          className="
            relative

            flex
            flex-col

            gap-[11px]

            sm:gap-[12px]

            md:gap-[13px]
          "
        >
          {studentUpdates.map(
            (
              item,
              index
            ) => (
              <UpdateRow
                key={item.id}
                item={item}
                index={index}
                activeIndex={
                  activeIndex
                }
                onActivate={
                  setActiveIndex
                }
                onPause={() =>
                  setPaused(
                    true
                  )
                }
                onResume={() =>
                  setPaused(
                    false
                  )
                }
              />
            )
          )}
        </div>

        {/* =================================================
            MOBILE PROGRESS
        ================================================= */}

        <div
          className="
            mt-[18px]

            flex
            items-center
            justify-center

            gap-[7px]

            sm:hidden
          "
        >
          {studentUpdates.map(
            (_, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() =>
                  setActiveIndex(
                    index
                  )
                }
                animate={{
                  width:
                    index ===
                    activeIndex
                      ? 24
                      : 7,

                  opacity:
                    index ===
                    activeIndex
                      ? 1
                      : 0.25,
                }}
                transition={{
                  duration: 0.4,
                  ease,
                }}
                className="
                  h-[7px]

                  rounded-full

                  bg-[#0075FF]
                "
                aria-label={`Show update ${
                  index + 1
                }`}
              />
            )
          )}
        </div>

        {/* =================================================
            VIEW ALL
        ================================================= */}

        <motion.div
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
            duration: 0.85,
            delay: 0.22,
            ease,
          }}
          className="
            mt-[24px]

            flex

            justify-center

            sm:mt-[26px]
            sm:justify-end

            lg:mt-[28px]
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
              href="/news"
              className="
                inline-flex

                h-[44px]

                items-center
                justify-center

                rounded-[6px]

                bg-[#0075FF]

                px-[22px]

                font-secondary

                text-[10.5px]
                font-medium

                uppercase

                tracking-[0.15px]

                !text-white

                shadow-[0_9px_24px_rgba(0,117,255,0.20)]

                transition-all
                duration-300

                hover:bg-[#0068E4]

                hover:shadow-[0_13px_30px_rgba(0,117,255,0.27)]

                sm:h-[46px]
                sm:px-[26px]
                sm:text-[11px]

                lg:h-[48px]
                lg:px-[28px]
                lg:text-[11.5px]
              "
            >
              View All Updates
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}