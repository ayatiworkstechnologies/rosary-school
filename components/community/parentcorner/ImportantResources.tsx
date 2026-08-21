"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  BusFront,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Shirt,
} from "lucide-react";
import { useEffect, useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type ResourceItem = {
  id: number;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: React.ElementType;
};

/* =========================================================
   DATA
========================================================= */

const resources: ResourceItem[] = [
  {
    id: 1,
    title: "School Timings",
    category: "Schedule",

    shortDescription:
      "Stay updated with regular school hours, assembly timings, breaks, and important schedule changes throughout the academic year.",

    description:
      "Find details about regular school hours, morning assembly, class timings, lunch breaks, dispersal time, examination schedules, and any special changes announced by the school.",

    image: "/images/school-timings-ex.png",

    icon: Clock3,
  },

  {
    id: 2,
    title: "Transport",
    category: "Transport",

    shortDescription:
      "Access essential information about school transport routes, boarding points, safety guidelines, and daily travel arrangements.",

    description:
      "Our school transport service is planned to provide students with safe and reliable travel. Parents can refer to route details, pickup and drop timings, transport guidelines, and important travel updates.",

    image: "/images/school-timings-ex.png",

    icon: BusFront,
  },

  {
    id: 3,
    title: "School Uniform",
    category: "Guidelines",

    shortDescription:
      "Understand the prescribed school uniform, grooming standards, footwear requirements, and regular uniform guidelines.",

    description:
      "Students are expected to maintain a neat and disciplined appearance. Refer to the approved uniform pattern, designated footwear, accessories, grooming expectations, and special uniform instructions.",

    image: "/images/school-timings-ex.png",

    icon: Shirt,
  },
];

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const headerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
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
      duration: 0.85,
      ease,
    },
  },
};

/* =========================================================
   CAROUSEL MOTION
========================================================= */

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 65 : -65,
    scale: 0.985,
  }),

  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },

  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -65 : 65,
    scale: 0.985,
  }),
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ImportantResources() {
  const [activeIndex, setActiveIndex] = useState(0);

  const [direction, setDirection] = useState(1);

  const [paused, setPaused] = useState(false);

  /* =========================================================
     NEXT
  ========================================================= */

  const handleNext = () => {
    setDirection(1);

    setActiveIndex(
      (current) => (current + 1) % resources.length
    );
  };

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const handlePrevious = () => {
    setDirection(-1);

    setActiveIndex(
      (current) =>
        (current - 1 + resources.length) %
        resources.length
    );
  };

  /* =========================================================
     AUTOPLAY
  ========================================================= */

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setDirection(1);

      setActiveIndex(
        (current) => (current + 1) % resources.length
      );
    }, 4500);

    return () => {
      window.clearInterval(timer);
    };
  }, [paused]);

  const activeResource = resources[activeIndex];

  const ActiveIcon = activeResource.icon;

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-white

        py-[50px]

        sm:py-[60px]

        md:py-[70px]

        lg:py-[80px]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        variants={headerContainer}
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
        {/* LABEL */}

        <motion.span
          variants={fadeUp}
          className="
            inline-flex

            rounded-[4px]

            bg-[#EEF6FF]

            px-[9px]
            py-[5px]

            font-secondary

            text-[9px]
            font-medium

            uppercase

            leading-none
            tracking-[0.35px]

            text-[#0075FF]

            sm:text-[10px]
          "
        >
          Guidelines
        </motion.span>

        {/* TITLE */}

        <motion.h2
          variants={fadeUp}
          className="
            mt-[14px]

            font-primary

            text-[29px]
            font-semibold

            leading-[1.08]

            tracking-[-0.6px]

            text-[#171717]

            sm:text-[34px]

            lg:text-[38px]
          "
        >
          Important Resources
        </motion.h2>
      </motion.div>

      {/* =====================================================
          CAROUSEL
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 34,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.95,
          delay: 0.12,
          ease,
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="
          relative
          z-10

          mx-auto

          mt-[38px]

          w-full
          max-w-[940px]

          px-[16px]

          sm:mt-[46px]
          sm:px-[24px]

          md:mt-[52px]
          md:px-[45px]

          lg:mt-[58px]
          lg:px-[70px]
        "
      >
        <div
          className="
            relative

            mx-auto

            w-full
            max-w-[760px]
          "
        >
          {/* =================================================
              DESKTOP LEFT ARROW
          ================================================= */}

          <motion.button
            type="button"
            onClick={handlePrevious}
            whileHover={{
              x: -3,
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.92,
            }}
            aria-label="Previous resource"
            className="
              absolute

              left-[-28px]
              top-1/2

              z-40

              hidden

              h-[44px]
              w-[44px]

              -translate-x-1/2
              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              border
              border-[#CDE5FF]

              bg-white

              text-[#0075FF]

              shadow-[0_9px_24px_rgba(0,117,255,0.13)]

              transition-all
              duration-300

              hover:bg-[#0075FF]
              hover:text-white

              lg:flex
            "
          >
            <ChevronLeft
              size={20}
              strokeWidth={2}
            />
          </motion.button>

          {/* =================================================
              DESKTOP RIGHT ARROW
          ================================================= */}

          <motion.button
            type="button"
            onClick={handleNext}
            whileHover={{
              x: 3,
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.92,
            }}
            aria-label="Next resource"
            className="
              absolute

              right-[-28px]
              top-1/2

              z-40

              hidden

              h-[44px]
              w-[44px]

              translate-x-1/2
              -translate-y-1/2

              items-center
              justify-center

              rounded-full

              border
              border-[#CDE5FF]

              bg-white

              text-[#0075FF]

              shadow-[0_9px_24px_rgba(0,117,255,0.13)]

              transition-all
              duration-300

              hover:bg-[#0075FF]
              hover:text-white

              lg:flex
            "
          >
            <ChevronRight
              size={20}
              strokeWidth={2}
            />
          </motion.button>

          {/* =================================================
              CARD WRAPPER
          ================================================= */}

          <div
            className="
              relative

              overflow-hidden

              py-[8px]
            "
          >
            <AnimatePresence
              mode="wait"
              custom={direction}
              initial={false}
            >
              <motion.article
                key={activeResource.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.62,
                  ease,
                }}
                className="
                  relative

                  mx-auto

                  flex
                  w-full

                  flex-col

                  overflow-hidden

                  rounded-[10px]

                  border
                  border-[#66ACFF]

                  bg-white

                  shadow-[0_14px_38px_rgba(25,55,90,0.08)]

                  md:min-h-[300px]
                  md:flex-row
                "
              >
                {/* =================================================
                    IMAGE
                ================================================= */}

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 1.015,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.75,
                    ease,
                  }}
                  className="
                    relative

                    h-[230px]
                    w-full

                    shrink-0

                    overflow-hidden

                    bg-[#F5F5F5]

                    sm:h-[260px]

                    md:h-[300px]
                    md:w-[220px]

                    lg:h-[300px]
                    lg:w-[220px]
                  "
                >
                  {/* =============================================
                      IMPORTANT FIX

                      Keep "sizes" on ONE LINE.

                      Don't write it like:
                      
                      sizes="
                        (max-width: 767px) 100vw,
                        220px
                      "

                      because Turbopack was generating an invalid
                      imagesizes selector.
                  ============================================= */}

                  <Image
                    src={activeResource.image}
                    alt={activeResource.title}
                    fill
                    preload={activeIndex === 0}
                    sizes="(max-width: 767px) 100vw, 220px"
                    className="object-cover object-center"
                  />
                </motion.div>

                {/* =================================================
                    FLOATING ICON
                ================================================= */}

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.18,
                    ease,
                  }}
                  className="
                    absolute

                    left-[220px]
                    top-[42px]

                    z-30

                    hidden

                    h-[40px]
                    w-[40px]

                    -translate-x-1/2

                    items-center
                    justify-center

                    rounded-full

                    border-[3px]
                    border-white

                    bg-[#0075FF]

                    text-white

                    shadow-[0_7px_18px_rgba(0,117,255,0.25)]

                    md:flex
                  "
                >
                  <ActiveIcon
                    size={18}
                    strokeWidth={2}
                  />
                </motion.div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div
                  className="
                    relative

                    flex
                    min-w-0
                    flex-1

                    flex-col
                    justify-center

                    px-[20px]
                    pb-[26px]
                    pt-[34px]

                    sm:px-[26px]

                    md:min-h-[300px]
                    md:px-[38px]
                    md:py-[35px]

                    lg:px-[42px]
                  "
                >
                  {/* CATEGORY */}

                  <motion.span
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1,
                    }}
                    className="
                      absolute

                      right-[16px]
                      top-[16px]

                      rounded-full

                      bg-[#EDF6FF]

                      px-[9px]
                      py-[4px]

                      font-secondary

                      text-[8px]
                      font-medium

                      leading-none

                      text-[#0075FF]

                      md:right-[20px]
                      md:top-[18px]
                    "
                  >
                    {activeResource.category}
                  </motion.span>

                  {/* TITLE */}

                  <motion.h3
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.08,
                      ease,
                    }}
                    className="
                      pr-[75px]

                      font-primary

                      text-[21px]
                      font-semibold

                      leading-[1.15]

                      tracking-[-0.35px]

                      text-[#202020]

                      sm:text-[22px]

                      md:text-[22px]

                      lg:text-[24px]
                    "
                  >
                    {activeResource.title}
                  </motion.h3>

                  {/* SHORT DESCRIPTION */}

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: 0.14,
                      ease,
                    }}
                    className="
                      mt-[10px]

                      max-w-[470px]

                      font-secondary

                      text-[12px]

                      leading-[1.6]

                      text-[#777777]

                      sm:text-[12.5px]

                      md:text-[12px]

                      lg:text-[12.5px]
                    "
                  >
                    {activeResource.shortDescription}
                  </motion.p>

                  {/* SEPARATOR */}

                  <motion.div
                    initial={{
                      scaleX: 0,
                    }}
                    animate={{
                      scaleX: 1,
                    }}
                    transition={{
                      duration: 0.65,
                      delay: 0.18,
                      ease,
                    }}
                    className="
                      my-[16px]

                      h-px
                      w-full

                      origin-left

                      bg-[#E8EDF2]
                    "
                  />

                  {/* DESCRIPTION */}

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: 0.2,
                      ease,
                    }}
                    className="
                      max-w-[480px]

                      font-secondary

                      text-[11.5px]

                      leading-[1.7]

                      text-[#777777]

                      sm:text-[12px]

                      lg:text-[12.5px]
                    "
                  >
                    {activeResource.description}
                  </motion.p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* =================================================
            MOBILE + TABLET CONTROLS
        ================================================= */}

        <div
          className="
            mt-[18px]

            flex
            items-center
            justify-center

            gap-[10px]

            lg:hidden
          "
        >
          {/* PREVIOUS */}

          <motion.button
            type="button"
            onClick={handlePrevious}
            whileTap={{
              scale: 0.9,
            }}
            whileHover={{
              x: -2,
            }}
            aria-label="Previous resource"
            className="
              flex

              h-[42px]
              w-[42px]

              items-center
              justify-center

              rounded-full

              border
              border-[#CDE5FF]

              bg-white

              text-[#0075FF]

              shadow-[0_7px_18px_rgba(0,117,255,0.11)]
            "
          >
            <ChevronLeft
              size={19}
              strokeWidth={2}
            />
          </motion.button>

          {/* CURRENT COUNTER */}

          <div
            className="
              min-w-[52px]

              text-center

              font-secondary

              text-[11px]
              font-medium

              text-[#8D9AAA]
            "
          >
            <span
              className="
                font-semibold
                text-[#0075FF]
              "
            >
              {String(
                activeIndex + 1
              ).padStart(2, "0")}
            </span>

            <span className="mx-[4px]">
              /
            </span>

            <span>
              {String(
                resources.length
              ).padStart(2, "0")}
            </span>
          </div>

          {/* NEXT */}

          <motion.button
            type="button"
            onClick={handleNext}
            whileTap={{
              scale: 0.9,
            }}
            whileHover={{
              x: 2,
            }}
            aria-label="Next resource"
            className="
              flex

              h-[42px]
              w-[42px]

              items-center
              justify-center

              rounded-full

              bg-[#0075FF]

              text-white

              shadow-[0_8px_20px_rgba(0,117,255,0.20)]
            "
          >
            <ChevronRight
              size={19}
              strokeWidth={2}
            />
          </motion.button>
        </div>

        {/* =================================================
            DESKTOP INDICATORS
        ================================================= */}

        <div
          className="
            mt-[20px]

            hidden

            items-center
            justify-center

            gap-[7px]

            lg:flex
          "
        >
          {resources.map(
            (_, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => {
                  if (
                    index ===
                    activeIndex
                  ) {
                    return;
                  }

                  setDirection(
                    index >
                      activeIndex
                      ? 1
                      : -1
                  );

                  setActiveIndex(
                    index
                  );
                }}
                animate={{
                  width:
                    activeIndex ===
                    index
                      ? 25
                      : 7,

                  opacity:
                    activeIndex ===
                    index
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
                aria-label={`View ${resources[index].title}`}
              />
            )
          )}
        </div>
      </motion.div>
    </section>
  );
}