"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type CurriculumStage = {
  id: number;
  stage: string;
  classes: string;
  summary: string;
  approachTitle: string;
  points: string[];
};

/* =========================================================
   ROSARY SCHOOL CONTENT
========================================================= */

const curriculumStages: CurriculumStage[] = [
  {
    id: 1,
    stage: "PRIMARY\nSCHOOL",
    classes: "Classes I–V",
    summary:
      "Strong foundation in language, numeracy, environmental awareness, creativity and values.",
    approachTitle: "Learning Approach",
    points: [
      "Activity-based learning",
      "Interactive classroom learning",
      "Projects and creative assignments",
      "Reading and language development",
      "Foundational numeracy skills",
      "Value-based learning",
    ],
  },
  {
    id: 2,
    stage: "MIDDLE\nSCHOOL",
    classes: "Classes VI–VIII",
    summary:
      "Expanding subject knowledge, independent learning, communication and practical understanding.",
    approachTitle: "Learning Approach",
    points: [
      "Concept-oriented classroom learning",
      "Science and mathematics exploration",
      "Project-based assignments",
      "Language and communication development",
      "Digital and research skills",
      "Collaborative learning activities",
    ],
  },
  {
    id: 3,
    stage: "SECONDARY\nSCHOOL",
    classes: "Classes IX–X",
    summary:
      "Strengthening concepts, analytical thinking, examination readiness and responsible learning.",
    approachTitle: "Learning Approach",
    points: [
      "Structured academic preparation",
      "Concept reinforcement and revision",
      "Practical and laboratory learning",
      "Assessment-based progress tracking",
      "Problem-solving and analytical thinking",
      "Exam preparation and study guidance",
    ],
  },
  {
    id: 4,
    stage: "HIGHER\nSECONDARY",
    classes: "Classes XI–XII",
    summary:
      "Focused academic pathways, advanced subject learning, career awareness and higher education preparation.",
    approachTitle: "Learning Approach",
    points: [
      "Advanced subject-focused learning",
      "Practical and application-based study",
      "Career and higher education awareness",
      "Independent study and research",
      "Regular academic assessments",
      "Board examination preparation",
    ],
  },
];

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.95,
      ease,
    },
  },
};

/* =========================================================
   ACCORDION ITEM
========================================================= */

function CurriculumItem({
  item,
  index,
  activeIndex,
  setActiveIndex,
}: {
  item: CurriculumStage;
  index: number;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}) {
  const isOpen = activeIndex === index;

  const handleClick = () => {
    setActiveIndex(isOpen ? null : index);
  };

  return (
    <motion.article
      variants={fadeUp}
      className={`
        relative
        overflow-hidden
        bg-white

        transition-[border-color,box-shadow]
        duration-500

        ${
          isOpen
            ? `
              z-10
              rounded-[8px]
              border
              border-[#0075FF]/65
              shadow-[0_16px_45px_rgba(0,117,255,0.07)]
            `
            : `
              rounded-[7px]
              border
              border-[#E8EDF3]
              shadow-[0_8px_24px_rgba(20,45,75,0.035)]
            `
        }
      `}
    >
      {/* =====================================================
          CLICKABLE HEADER
      ====================================================== */}

      <button
        type="button"
        onClick={handleClick}
        aria-expanded={isOpen}
        className="
          group
          grid
          w-full
          grid-cols-1
          text-left

          md:grid-cols-[170px_1fr]
        "
      >
        {/* =================================================
            LEFT STAGE
        ================================================= */}

        <div
          className="
            relative
            flex
            items-center

            px-[18px]
            pb-[4px]
            pt-[17px]

            md:min-h-[82px]
            md:px-[20px]
            md:py-[18px]
          "
        >
          <div
            className="
              hidden
              absolute
              bottom-[16px]
              right-0
              top-[16px]
              w-px
              bg-[#E3E8EE]

              md:block
            "
          />

          <p
            className="
              whitespace-pre-line
              font-primary

              text-[12px]
              font-semibold
              uppercase
              leading-[1.02]

              text-[#0075FF]

              sm:text-[13px]

              lg:text-[14px]
            "
          >
            {item.stage}
          </p>
        </div>

        {/* =================================================
            RIGHT SUMMARY
        ================================================= */}

        <div
          className="
            flex
            min-w-0
            items-center
            justify-between
            gap-[15px]

            px-[18px]
            pb-[17px]
            pt-[7px]

            md:min-h-[82px]
            md:px-[28px]
            md:py-[18px]
          "
        >
          <div className="min-w-0">
            <h3
              className="
                font-primary
                text-[18px]
                font-semibold
                leading-[1.15]
                tracking-[-0.35px]

                !text-[#161616]

                sm:text-[19px]

                lg:text-[20px]
              "
            >
              {item.classes}
            </h3>

            <p
              className="
                mt-[7px]
                max-w-[720px]

                font-secondary
                text-[11px]
                font-normal
                leading-[1.5]

                text-[#868686]

                sm:text-[12px]

                lg:text-[12.5px]
              "
            >
              {item.summary}
            </p>
          </div>

          {/* PLUS / MINUS */}

          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
            }}
            transition={{
              duration: 0.5,
              ease,
            }}
            className="
              flex
              h-[30px]
              w-[30px]
              shrink-0
              items-center
              justify-center
            "
          >
            <div className="relative h-[14px] w-[14px]">
              {/* horizontal line */}

              <span
                className="
                  absolute
                  left-0
                  top-1/2
                  h-[2px]
                  w-full
                  -translate-y-1/2
                  rounded-full
                  bg-[#0075FF]
                "
              />

              {/* vertical line */}

              <motion.span
                animate={{
                  scaleY: isOpen ? 0 : 1,
                  opacity: isOpen ? 0 : 1,
                }}
                transition={{
                  duration: 0.4,
                  ease,
                }}
                className="
                  absolute
                  left-1/2
                  top-0
                  h-full
                  w-[2px]
                  -translate-x-1/2
                  rounded-full
                  bg-[#0075FF]
                "
              />
            </div>
          </motion.div>
        </div>
      </button>

      {/* =====================================================
          EXPANDED CONTENT
      ====================================================== */}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.65,
                ease,
              },
              opacity: {
                duration: 0.4,
              },
            }}
            className="overflow-hidden"
          >
            <div
              className="
                grid
                grid-cols-1

                md:grid-cols-[170px_1fr]
              "
            >
              {/* EMPTY LEFT SPACE */}

              <div
                className="
                  hidden
                  relative

                  md:block
                "
              >
                <div
                  className="
                    absolute
                    bottom-[20px]
                    right-0
                    top-0
                    w-px
                    bg-[#E3E8EE]
                  "
                />
              </div>

              {/* CONTENT */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  delay: 0.12,
                  ease,
                }}
                className="
                  mx-[18px]
                  border-t
                  border-[#E5E9EE]

                  pb-[22px]
                  pt-[18px]

                  md:mx-[28px]
                  md:pb-[25px]
                  md:pt-[20px]
                "
              >
                <h4
                  className="
                    font-primary
                    text-[15px]
                    font-semibold
                    leading-[1.2]

                    !text-[#171717]

                    sm:text-[16px]
                  "
                >
                  {item.approachTitle}
                </h4>

                <div
                  className="
                    mt-[11px]
                    grid
                    grid-cols-1
                    gap-x-[30px]
                    gap-y-[5px]

                    sm:grid-cols-2

                    lg:max-w-[720px]
                  "
                >
                  {item.points.map((point, pointIndex) => (
                    <motion.div
                      key={point}
                      initial={{
                        opacity: 0,
                        x: -8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.45,
                        delay: 0.15 + pointIndex * 0.05,
                        ease,
                      }}
                      className="
                        flex
                        items-start
                        gap-[8px]
                      "
                    >
                      <span
                        className="
                          mt-[7px]
                          h-[4px]
                          w-[4px]
                          shrink-0
                          rounded-full
                          bg-[#0075FF]
                        "
                      />

                      <p
                        className="
                          font-secondary
                          text-[11px]
                          leading-[1.5]

                          text-[#777777]

                          sm:text-[11.5px]

                          lg:text-[12px]
                        "
                      >
                        {point}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CurriculumStages() {
  // First item open like your reference.
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden

        bg-[#FCFDFE]

        py-[50px]

        sm:py-[62px]

        lg:py-[78px]
      "
    >
      {/* =====================================================
          CHECKED / GRID BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(25, 71, 120, 0.055) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(25, 71, 120, 0.055) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "42px 42px",
        }}
      />

      {/* =====================================================
          BLUE GLOW — LEFT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute

          -left-[150px]
          top-[180px]

          -z-10

          h-[420px]
          w-[420px]

          rounded-full

          bg-[#0075FF]/[0.05]

          blur-[120px]
        "
      />

      {/* =====================================================
          WARM GLOW — RIGHT BOTTOM
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute

          -bottom-[180px]
          -right-[140px]

          -z-10

          h-[420px]
          w-[420px]

          rounded-full

          bg-[#E0AA3E]/[0.06]

          blur-[120px]
        "
      />

      {/* =====================================================
          VERY LIGHT CENTER WASH
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10

          bg-gradient-to-b
          from-white/20
          via-white/5
          to-white/25
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.08,
          margin: "0px 0px -60px 0px",
        }}
        className="
          relative
          z-10

          mx-auto

          w-full
          max-w-[1080px]

          px-[16px]

          sm:px-[26px]

          lg:px-[36px]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          variants={fadeUp}
          className="
            flex
            w-full
            flex-col
            items-center
            justify-center

            text-center
          "
        >
          {/* CHIP */}

          <span
            className="
              inline-flex

              rounded-[3px]

              bg-[#F0F7FF]

              px-[7px]
              py-[4px]

              font-secondary

              text-[9px]
              font-medium

              leading-none

              text-[#0075FF]

              sm:text-[13px]
            "
          >
            Curriculum
          </span>

          {/* TITLE */}

          <h2
            className="
              mx-auto

              mt-[12px]

              font-primary

              text-[26px]
              font-semibold

              leading-[1.15]
              tracking-[-0.6px]

              !text-[#111111]

              sm:text-[31px]

              lg:text-[35px] pt-2 and pb-2
            "
          >
            Curriculum Across Every Stage
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto

              mt-[10px]

              max-w-[570px]

              font-secondary

              text-[12px]
              font-normal
              leading-[1.6]

              text-[#858585]

              sm:text-[13px]
            "
          >
            Explore the learning focus and academic development planned for
            students at different stages of their journey at Rosary
            Matriculation Higher Secondary School.
          </p>
        </motion.div>

        {/* =================================================
            ACCORDION
        ================================================= */}

        <motion.div
          variants={container}
          className="
            mx-auto

            mt-[32px]

            flex
            w-full
            max-w-[940px]

            flex-col

            gap-[7px]

            sm:mt-[38px]

            lg:mt-[42px]
          "
        >
          {curriculumStages.map((item, index) => (
            <CurriculumItem
              key={item.id}
              item={item}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}