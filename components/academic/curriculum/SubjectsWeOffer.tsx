"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* =========================================================
   TYPES
========================================================= */

type Stage = {
  id: number;
  short: string;
  label: string;
  title: string;
  description: string;
  subjects: string[];
};

/* =========================================================
   DATA
========================================================= */

const stages: Stage[] = [
  {
    id: 1,
    short: "Primary",
    label: "Primary School",
    title: "Primary School",
    description:
      "Building strong foundations through language, numeracy, environmental awareness, creativity and values.",
    subjects: [
      "English",
      "Tamil",
      "Mathematics",
      "Environmental Science",
      "Computer Science",
      "Value Education",
      "General Knowledge",
      "Creative Learning",
    ],
  },

  {
    id: 2,
    short: "Middle",
    label: "Middle School",
    title: "Middle School",
    description:
      "Developing deeper subject understanding, communication, independent thinking and practical learning.",
    subjects: [
      "English",
      "Tamil",
      "Mathematics",
      "Science",
      "Social Science",
      "Computer Science",
      "General Knowledge",
      "Value Education",
    ],
  },

  {
    id: 3,
    short: "Secondary",
    label: "Secondary School",
    title: "Secondary School",
    description:
      "Strengthening academic concepts, analytical thinking, application skills and examination readiness.",
    subjects: [
      "English",
      "Tamil",
      "Mathematics",
      "Science",
      "Social Science",
      "Computer Applications",
      "Value Education",
      "Career Awareness",
    ],
  },

  {
    id: 4,
    short: "Higher Secondary",
    label: "Higher Secondary",
    title: "Higher Secondary",
    description:
      "Focused academic pathways designed to prepare students for higher education and future opportunities.",
    subjects: [
      "English",
      "Tamil",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Computer Science",
      "Commerce",
      "Accountancy",
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

/* =========================================================
   LEVEL ICON
========================================================= */

function LevelIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="
        h-[19px]
        w-[19px]
        shrink-0
      "
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="#0075FF"
        strokeWidth="1.5"
      />

      <circle
        cx="9"
        cy="10"
        r="1"
        fill="#0075FF"
      />

      <circle
        cx="15"
        cy="10"
        r="1"
        fill="#0075FF"
      />

      <path
        d="M8.5 14C9.4 15.1 10.6 15.7 12 15.7C13.4 15.7 14.6 15.1 15.5 14"
        stroke="#0075FF"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   SUBJECT ITEM
========================================================= */

function SubjectItem({
  subject,
  index,
}: {
  subject: string;
  index: number;
}) {
  return (
    <motion.div
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
        delay: index * 0.035,
        ease,
      }}
      className="
        group/subject

        flex
        min-h-[42px]
        items-center
        gap-[9px]

        rounded-[5px]

        border
        border-[#E5EAF0]

        bg-white

        px-[12px]
        py-[9px]

        cursor-default

        transition-all
        duration-500
        ease-out

        hover:-translate-y-[2px]
        hover:border-[#0075FF]
        hover:bg-[#0075FF]

        hover:shadow-[0_10px_24px_rgba(0,117,255,0.15)]
      "
    >
      {/* DOUBLE ARROW */}

      <span
        className="
          flex
          shrink-0
          items-center

          text-[#555555]

          transition-colors
          duration-500

          group-hover/subject:text-white
        "
      >
        <span
          className="
            block
            h-[7px]
            w-[7px]

            rotate-45

            border-r-[1.5px]
            border-t-[1.5px]

            border-current
          "
        />

        <span
          className="
            -ml-[2px]

            block
            h-[7px]
            w-[7px]

            rotate-45

            border-r-[1.5px]
            border-t-[1.5px]

            border-current
          "
        />
      </span>

      <span
        className="
          font-secondary

          text-[12px]
          font-medium

          leading-[1.25]

          text-[#292929]

          transition-colors
          duration-500

          group-hover/subject:text-white

          sm:text-[12.5px]

          lg:text-[13px]
        "
      >
        {subject}
      </span>
    </motion.div>
  );
}

/* =========================================================
   SUBJECT PANEL
========================================================= */

function SubjectsPanel({
  stage,
  activeStage,
}: {
  stage: Stage;
  activeStage: number;
}) {
  const nextStage =
    stages[
      (activeStage + 1) %
        stages.length
    ];

  return (
    <div
      className="
        relative

        mx-auto

        w-full
        max-w-[700px]

        pt-[32px]
        pb-[34px]

        sm:pt-[34px]
        sm:pb-[36px]

        lg:max-w-[700px]
        lg:pt-[36px]
        lg:pb-[38px]
      "
    >
      {/* =====================================================
          TOP ACTIVE STAGE PILL
      ====================================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={`top-${stage.id}`}
          initial={{
            opacity: 0,
            y: 14,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -10,
          }}
          transition={{
            duration: 0.55,
            ease,
          }}
          className="
            absolute

            left-1/2
            top-0

            z-30

            flex

            -translate-x-1/2

            items-center
            gap-[9px]

            whitespace-nowrap

            rounded-[9px]

            border
            border-[#E5EBF1]

            bg-white

            px-[14px]
            py-[9px]

            shadow-[0_10px_26px_rgba(18,42,68,0.10)]

            sm:px-[16px]
            sm:py-[10px]
          "
        >
          <LevelIcon />

          <span
            className="
              font-primary

              text-[13px]
              font-semibold

              text-[#202020]

              sm:text-[14px]

              lg:text-[15px]
            "
          >
            {stage.label}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <motion.div
        layout
        className="
          relative

          overflow-hidden

          rounded-[11px]

          border
          border-[#9DCCFF]

          bg-white/95

          px-[18px]
          pb-[22px]
          pt-[42px]

          shadow-[0_20px_55px_rgba(20,65,105,0.10)]

          backdrop-blur-[5px]

          sm:px-[26px]
          sm:pb-[25px]
          sm:pt-[44px]

          lg:px-[42px]
          lg:pb-[28px]
          lg:pt-[48px]
        "
      >
        {/* BLUE GLOW */}

        <div
          className="
            pointer-events-none

            absolute

            -left-[100px]
            -top-[100px]

            h-[260px]
            w-[260px]

            rounded-full

            bg-[#0075FF]/[0.035]

            blur-[75px]
          "
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -14,
            }}
            transition={{
              duration: 0.55,
              ease,
            }}
            className="
              relative
              z-10
            "
          >
            {/* =================================================
                STAGE
            ================================================= */}

            <span
              className="
                font-secondary

                text-[10px]
                font-medium

                uppercase

                tracking-[0.08em]

                text-[#0075FF]

                sm:text-[10.5px]
              "
            >
              Academic Stage{" "}
              {String(
                stage.id
              ).padStart(
                2,
                "0"
              )}
            </span>

            <h3
              className="
                mt-[5px]

                font-primary

                text-[22px]
                font-semibold

                leading-[1.1]

                text-[#1A1A1A]

                sm:text-[24px]

                lg:text-[26px]
              "
            >
              {stage.title}
            </h3>

            <p
              className="
                mt-[7px]

                max-w-[580px]

                font-secondary

                text-[12px]

                leading-[1.55]

                text-[#777777]

                sm:text-[12.5px]

                lg:text-[13px]
              "
            >
              {
                stage.description
              }
            </p>

            {/* DIVIDER */}

            <motion.div
              initial={{
                scaleX: 0,
              }}
              animate={{
                scaleX: 1,
              }}
              transition={{
                duration: 0.65,
                delay: 0.12,
                ease,
              }}
              className="
                my-[20px]

                h-px
                w-full

                origin-left

                bg-[#E5E9EE]
              "
            />

            {/* SUBJECT GRID */}

            <div
              className="
                grid
                grid-cols-1

                gap-[9px]

                min-[480px]:grid-cols-2

                sm:gap-x-[30px]
                sm:gap-y-[11px]
              "
            >
              {stage.subjects.map(
                (
                  subject,
                  index
                ) => (
                  <SubjectItem
                    key={`${stage.id}-${subject}`}
                    subject={
                      subject
                    }
                    index={
                      index
                    }
                  />
                )
              )}
            </div>

            {/* =================================================
                UPDATED BLUE NOTE
            ================================================= */}

            <p
              className="
                pt-3

                font-secondary

                text-[11.5px]
                font-medium

                leading-[1.5]

                text-[#0075FF]

                sm:text-[12px]

                lg:text-[12.5px]
              "
            >
              Subjects offered
              may vary by grade
              level and academic
              stream. Please
              contact the school
              for the latest
              curriculum and
              subject
              combinations.
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* =====================================================
          NEXT STAGE
      ====================================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={`bottom-${stage.id}`}
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 8,
          }}
          transition={{
            duration: 0.5,
            ease,
          }}
          className="
            absolute

            bottom-0
            left-1/2

            z-30

            flex

            -translate-x-1/2

            items-center
            gap-[9px]

            whitespace-nowrap

            rounded-[9px]

            border
            border-[#E5EBF1]

            bg-white

            px-[14px]
            py-[9px]

            shadow-[0_9px_22px_rgba(20,45,75,0.09)]
          "
        >
          <LevelIcon />

          <span
            className="
              font-primary

              text-[12.5px]
              font-semibold

              text-[#292929]

              sm:text-[13.5px]
            "
          >
            {
              nextStage.label
            }
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   MOBILE / TABLET
========================================================= */

function MobileSubjects() {
  const [
    activeStage,
    setActiveStage,
  ] = useState(0);

  return (
    <div className="lg:hidden">
      {/* =====================================================
          RESPONSIVE STAGE SELECTOR

          MOBILE = 2 x 2
          TABLET = 4 columns
          No horizontal cutting.
      ====================================================== */}

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
          amount: 0.3,
        }}
        transition={{
          duration: 0.85,
          ease,
        }}
        className="
          mx-auto

          grid

          w-full
          max-w-[760px]

          grid-cols-2

          gap-[9px]

          px-[16px]

          sm:grid-cols-4
          sm:gap-[10px]
          sm:px-[24px]
        "
      >
        {stages.map(
          (
            stage,
            index
          ) => {
            const active =
              activeStage ===
              index;

            return (
              <motion.button
                key={
                  stage.id
                }
                type="button"
                onClick={() =>
                  setActiveStage(
                    index
                  )
                }
                whileTap={{
                  scale: 0.98,
                }}
                className={`
                  flex

                  min-h-[50px]

                  w-full

                  items-center
                  justify-center

                  rounded-[9px]

                  border

                  px-[10px]
                  py-[10px]

                  text-center

                  font-primary

                  text-[12px]
                  font-semibold

                  leading-[1.15]

                  transition-all
                  duration-500

                  sm:min-h-[54px]
                  sm:text-[13px]

                  ${
                    active
                      ? `
                        border-[#0075FF]
                        bg-[#0075FF]
                        text-white
                        shadow-[0_10px_24px_rgba(0,117,255,0.16)]
                      `
                      : `
                        border-[#E1E7ED]
                        bg-white
                        text-[#0075FF]

                        hover:border-[#0075FF]/50
                      `
                  }
                `}
              >
                {
                  stage.short
                }
              </motion.button>
            );
          }
        )}
      </motion.div>

      {/* PANEL */}

      <motion.div
        initial={{
          opacity: 0,
          y: 28,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.08,
        }}
        transition={{
          duration: 0.9,
          delay: 0.08,
          ease,
        }}
        className="
          mx-auto

          mt-[20px]

          w-full
          max-w-[720px]

          px-[16px]

          sm:mt-[24px]
          sm:px-[24px]
        "
      >
        <SubjectsPanel
          stage={
            stages[
              activeStage
            ]
          }
          activeStage={
            activeStage
          }
        />
      </motion.div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function SubjectsWeOffer() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const pinnedRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    activeStage,
    setActiveStage,
  ] = useState(0);

  /* =========================================================
     DESKTOP GSAP
  ========================================================= */

  useLayoutEffect(() => {
    if (
      !sectionRef.current
    )
      return;

    const ctx =
      gsap.context(() => {
        const mm =
          gsap.matchMedia();

        mm.add(
          "(min-width: 1024px)",
          () => {
            let previousStage =
              -1;

            /* HEADER */

            gsap.fromTo(
              ".academic-pathways-header",
              {
                opacity: 0,
                y: 35,
              },
              {
                opacity: 1,
                y: 0,

                duration:
                  1.1,

                ease:
                  "power3.out",

                scrollTrigger:
                  {
                    trigger:
                      sectionRef.current,

                    start:
                      "top 75%",
                  },
              }
            );

            /* LEFT WORD */

            gsap.fromTo(
              ".subject-vertical-word",
              {
                opacity: 0,
                x: -32,
              },
              {
                opacity: 1,
                x: 0,

                duration:
                  1.2,

                ease:
                  "power3.out",

                scrollTrigger:
                  {
                    trigger:
                      sectionRef.current,

                    start:
                      "top 75%",
                  },
              }
            );

            /* PANEL */

            gsap.fromTo(
              ".desktop-subject-panel",
              {
                opacity: 0,
                y: 45,
                scale: 0.97,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,

                duration:
                  1.15,

                ease:
                  "power3.out",

                scrollTrigger:
                  {
                    trigger:
                      sectionRef.current,

                    start:
                      "top 72%",
                  },
              }
            );

            /* PIN */

            ScrollTrigger.create({
              trigger:
                sectionRef.current,

              start:
                "top top",

              end:
                "+=2200",

              pin:
                pinnedRef.current,

              pinSpacing:
                true,

              scrub: 0.7,

              anticipatePin:
                1,

              onUpdate:
                (self) => {
                  const stage =
                    Math.min(
                      stages.length -
                        1,

                      Math.floor(
                        self.progress *
                          stages.length
                      )
                    );

                  if (
                    stage !==
                    previousStage
                  ) {
                    previousStage =
                      stage;

                    setActiveStage(
                      stage
                    );
                  }
                },
            });
          }
        );

        return () =>
          mm.revert();
      }, sectionRef);

    return () =>
      ctx.revert();
  }, []);

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          ScrollTrigger.refresh();
        },
        250
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative

        w-full

        overflow-hidden

        bg-white
      "
    >
      {/* =====================================================
          DESKTOP
      ====================================================== */}

      <div
        ref={pinnedRef}
        className="
          relative

          hidden

          min-h-[720px]

          w-full

          overflow-hidden

          lg:block

          xl:min-h-[750px]
        "
      >
        {/* BG */}

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            bg-[url('/images/notice-bg.png')]

            bg-cover
            bg-center

            opacity-[0.62]
          "
        />

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            bg-white/30
          "
        />

        {/* BLUE GLOW */}

        <div
          className="
            pointer-events-none

            absolute

            left-[25%]
            top-[30%]

            h-[360px]
            w-[360px]

            rounded-full

            bg-[#0075FF]/[0.07]

            blur-[125px]
          "
        />

        {/* ===================================================
            VERTICAL SUBJECT
        ==================================================== */}

        <div
          className="
            subject-vertical-word

            pointer-events-none

            absolute

            left-[5%]
            top-1/2

            z-[2]

            -translate-y-1/2
          "
        >
          <span
            className="
              block

              rotate-180

              font-primary

              text-[108px]
              font-semibold

              leading-none

              tracking-[-5px]

              text-transparent

              [-webkit-text-stroke:1px_rgba(0,117,255,0.30)]

              [writing-mode:vertical-rl]

              xl:text-[125px]
            "
          >
            Subject
          </span>
        </div>

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div
          className="
            academic-pathways-header

            absolute

            left-1/2
            top-[7%]

            z-10

            -translate-x-1/2

            text-center
          "
        >
          <span
            className="
              inline-flex

              rounded-[3px]

              bg-[#F2F7FF]

              px-[7px]
              py-[4px]

              font-secondary

              text-[9px]
              font-medium

              uppercase

              tracking-[0.35px]

              text-[#0075FF]
            "
          >
            Academic
            Pathways
          </span>

          <h2
            className="
              mt-[12px]

              font-primary

              text-[35px]
              font-semibold

              leading-[1.08]

              tracking-[-0.7px]

              text-[#111111]

              xl:text-[39px]
            "
          >
            Subjects We
            Offer
          </h2>
        </div>

        {/* ===================================================
            CENTER PANEL
        ==================================================== */}

        <div
          className="
            desktop-subject-panel

            absolute

            left-1/2
            top-[52%]

            z-10

            w-full
            max-w-[700px]

            -translate-x-1/2
            -translate-y-1/2
          "
        >
          <SubjectsPanel
            stage={
              stages[
                activeStage
              ]
            }
            activeStage={
              activeStage
            }
          />
        </div>

        {/* ===================================================
            RIGHT PROGRESS
        ==================================================== */}

        <div
          className="
            absolute

            right-[17%]
            top-1/2

            z-10

            flex

            -translate-y-1/2

            items-center

            gap-[18px]
          "
        >
          <div
            className="
              relative

              h-[220px]
              w-[2px]

              overflow-hidden

              bg-[#E5E9ED]
            "
          >
            <motion.span
              animate={{
                height: `${
                  ((
                    activeStage +
                    1
                  ) /
                    stages.length) *
                  100
                }%`,
              }}
              transition={{
                duration: 0.55,
                ease,
              }}
              className="
                absolute

                left-0
                top-0

                w-full

                bg-[#0075FF]
              "
            />
          </div>

          <div
            className="
              flex

              h-[220px]

              flex-col

              justify-between
            "
          >
            {stages.map(
              (
                stage,
                index
              ) => (
                <motion.span
                  key={
                    stage.id
                  }
                  animate={{
                    color:
                      activeStage ===
                      index
                        ? "#0075FF"
                        : "#B3BAC2",

                    scale:
                      activeStage ===
                      index
                        ? 1
                        : 0.92,
                  }}
                  transition={{
                    duration:
                      0.4,
                  }}
                  className="
                    font-primary

                    text-[10px]
                    font-semibold
                  "
                >
                  0
                  {
                    stage.id
                  }
                </motion.span>
              )
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE + TABLET
      ====================================================== */}

      <div
        className="
          relative

          overflow-hidden

          py-[55px]

          sm:py-[68px]

          lg:hidden
        "
      >
        {/* BG */}

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            bg-[url('/images/notice-bg.png')]

            bg-cover
            bg-center

            opacity-[0.56]
          "
        />

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            bg-white/38
          "
        />

        {/* HEADER */}

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
            amount: 0.25,
          }}
          transition={{
            duration: 0.95,
            ease,
          }}
          className="
            relative

            z-10

            mx-auto

            max-w-[650px]

            px-[18px]

            text-center
          "
        >
          <span
            className="
              inline-flex

              rounded-[3px]

              bg-[#F2F7FF]

              px-[7px]
              py-[4px]

              font-secondary

              text-[9px]
              font-medium

              uppercase

              text-[#0075FF]
            "
          >
            Academic
            Pathways
          </span>

          <h2
            className="
              mt-[10px]

              font-primary

              text-[28px]
              font-semibold

              leading-[1.08]

              tracking-[-0.6px]

              text-[#111111]

              sm:text-[33px]
            "
          >
            Subjects We
            Offer
          </h2>

          <p
            className="
              mx-auto

              mt-[9px]

              max-w-[500px]

              font-secondary

              text-[12px]
              leading-[1.55]

              text-[#777777]

              sm:text-[13px]
            "
          >
            Explore the
            subjects and
            learning pathways
            available across
            every stage of
            school.
          </p>
        </motion.div>

        <div
          className="
            relative

            z-10

            mt-[30px]
          "
        >
          <MobileSubjects />
        </div>
      </div>
    </section>
  );
}