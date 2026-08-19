"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type SubjectKey =
  | "computer"
  | "science"
  | "mathematics"
  | "languages"
  | "social"
  | "commerce";

type LearningItem = {
  title: string;
  description: string;
};

type LearningCard = {
  number: string;
  title: string;
  items: LearningItem[];
};

type SubjectData = {
  label: string;
  cards: LearningCard[];
};

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

/* =========================================================
   SUBJECT ORDER
========================================================= */

const subjectOrder: SubjectKey[] = [
  "computer",
  "science",
  "mathematics",
  "languages",
  "social",
  "commerce",
];

/* =========================================================
   DATA
========================================================= */

const subjectData: Record<SubjectKey, SubjectData> = {
  /* =======================================================
     COMPUTER SCIENCE
  ======================================================= */

  computer: {
    label: "Computer Science",

    cards: [
      {
        number: "01",
        title: "Key Learning Areas",

        items: [
          {
            title: "Digital Foundations",
            description:
              "Builds understanding of computers, devices and essential digital tools.",
          },
          {
            title: "Computational Thinking",
            description:
              "Develops logical approaches to analysing and solving problems.",
          },
          {
            title: "Programming",
            description:
              "Introduces coding concepts through age-appropriate learning activities.",
          },
          {
            title: "Data & Information",
            description:
              "Explores how digital information is organised and represented.",
          },
          {
            title: "Digital Citizenship",
            description:
              "Encourages safe, responsible and thoughtful technology use.",
          },
        ],
      },

      {
        number: "02",
        title: "Our Approach",

        items: [
          {
            title: "Hands-On Learning",
            description:
              "Students explore technology through structured practical activities.",
          },
          {
            title: "Project Learning",
            description:
              "Digital concepts are strengthened through meaningful projects.",
          },
          {
            title: "Problem-Solving",
            description:
              "Encourages logical thinking and independent solutions.",
          },
          {
            title: "Guided Exploration",
            description:
              "Students confidently experiment with digital tools.",
          },
          {
            title: "Continuous Practice",
            description:
              "Regular activities build confidence and digital fluency.",
          },
        ],
      },

      {
        number: "03",
        title: "Skills Developed",

        items: [
          {
            title: "Logical Thinking",
            description:
              "Strengthens structured thinking and sequencing skills.",
          },
          {
            title: "Digital Literacy",
            description:
              "Builds confidence in using digital technologies.",
          },
          {
            title: "Problem Solving",
            description:
              "Encourages students to develop and test solutions.",
          },
          {
            title: "Creativity",
            description:
              "Supports creative expression using technology.",
          },
        ],
      },

      {
        number: "04",
        title: "Classes",

        items: [
          {
            title: "Primary",
            description:
              "Introduces digital awareness and basic computer skills.",
          },
          {
            title: "Middle School",
            description:
              "Builds computational thinking and practical application.",
          },
          {
            title: "Secondary",
            description:
              "Develops programming and problem-solving concepts.",
          },
          {
            title: "Higher Secondary",
            description:
              "Supports advanced digital and academic pathways.",
          },
        ],
      },
    ],
  },

  /* =======================================================
     SCIENCE
  ======================================================= */

  science: {
    label: "Science",

    cards: [
      {
        number: "01",
        title: "Key Learning Areas",

        items: [
          {
            title: "Living World",
            description:
              "Explores plants, animals, human life and biological systems.",
          },
          {
            title: "Matter & Materials",
            description:
              "Develops understanding of materials and their properties.",
          },
          {
            title: "Energy",
            description:
              "Introduces force, motion, light, heat and energy.",
          },
          {
            title: "Environment",
            description:
              "Builds awareness of ecosystems and responsible living.",
          },
          {
            title: "Scientific Enquiry",
            description:
              "Encourages observation, questions and investigation.",
          },
        ],
      },

      {
        number: "02",
        title: "Our Approach",

        items: [
          {
            title: "Observation",
            description:
              "Students explore scientific concepts through observation.",
          },
          {
            title: "Experiments",
            description:
              "Practical work connects scientific theory with evidence.",
          },
          {
            title: "Inquiry Learning",
            description:
              "Questions guide students towards deeper understanding.",
          },
          {
            title: "Demonstrations",
            description:
              "Visual learning simplifies complex scientific concepts.",
          },
          {
            title: "Real-World Learning",
            description:
              "Science is connected with everyday experiences.",
          },
        ],
      },

      {
        number: "03",
        title: "Skills Developed",

        items: [
          {
            title: "Scientific Reasoning",
            description:
              "Develops evidence-based thinking and explanations.",
          },
          {
            title: "Observation",
            description:
              "Strengthens attention to patterns and changes.",
          },
          {
            title: "Analysis",
            description:
              "Helps interpret scientific information and results.",
          },
          {
            title: "Problem Solving",
            description:
              "Applies scientific knowledge to practical challenges.",
          },
        ],
      },

      {
        number: "04",
        title: "Classes",

        items: [
          {
            title: "Primary",
            description:
              "Builds curiosity through environmental awareness.",
          },
          {
            title: "Middle School",
            description:
              "Expands science through practical enquiry.",
          },
          {
            title: "Secondary",
            description:
              "Strengthens concepts and laboratory learning.",
          },
          {
            title: "Higher Secondary",
            description:
              "Prepares students for specialised science pathways.",
          },
        ],
      },
    ],
  },

  /* =======================================================
     MATHEMATICS
  ======================================================= */

  mathematics: {
    label: "Mathematics",

    cards: [
      {
        number: "01",
        title: "Key Learning Areas",

        items: [
          {
            title: "Number Concepts",
            description:
              "Builds strong foundations in numerical understanding.",
          },
          {
            title: "Algebra",
            description:
              "Develops logical thinking through symbolic problem-solving.",
          },
          {
            title: "Geometry",
            description:
              "Explores shapes, space, patterns and measurements.",
          },
          {
            title: "Measurement",
            description:
              "Applies mathematical skills to everyday quantities.",
          },
          {
            title: "Data Handling",
            description:
              "Interprets information using charts, tables and graphs.",
          },
        ],
      },

      {
        number: "02",
        title: "Our Approach",

        items: [
          {
            title: "Concept-Based Learning",
            description:
              "Builds understanding through clear mathematical concepts.",
          },
          {
            title: "Problem-Solving",
            description:
              "Encourages structured thinking for practical challenges.",
          },
          {
            title: "Practical Applications",
            description:
              "Connects classroom mathematics with real situations.",
          },
          {
            title: "Collaborative Activities",
            description:
              "Promotes teamwork through shared learning experiences.",
          },
          {
            title: "Continuous Assessment",
            description:
              "Tracks progress through regular learning evaluations.",
          },
        ],
      },

      {
        number: "03",
        title: "Skills Developed",

        items: [
          {
            title: "Logical Reasoning",
            description:
              "Strengthens thinking through patterns and relationships.",
          },
          {
            title: "Analytical Thinking",
            description:
              "Develops thoughtful approaches to complex problems.",
          },
          {
            title: "Accuracy",
            description:
              "Builds precision through careful mathematical practice.",
          },
          {
            title: "Problem Solving",
            description:
              "Applies strategies to solve varied challenges.",
          },
        ],
      },

      {
        number: "04",
        title: "Classes",

        items: [
          {
            title: "Primary",
            description:
              "Builds foundational mathematical understanding early.",
          },
          {
            title: "Middle School",
            description:
              "Expands concepts through deeper mathematical exploration.",
          },
          {
            title: "Secondary",
            description:
              "Strengthens reasoning and examination readiness.",
          },
          {
            title: "Higher Secondary",
            description:
              "Prepares students for specialised pathways.",
          },
        ],
      },
    ],
  },

  /* =======================================================
     LANGUAGES
  ======================================================= */

  languages: {
    label: "Languages",

    cards: [
      {
        number: "01",
        title: "Key Learning Areas",

        items: [
          {
            title: "Reading",
            description:
              "Develops fluency, comprehension and interpretation.",
          },
          {
            title: "Writing",
            description:
              "Builds clear and creative written communication.",
          },
          {
            title: "Grammar",
            description:
              "Strengthens language structure and accurate usage.",
          },
          {
            title: "Communication",
            description:
              "Develops confidence in speaking and listening.",
          },
          {
            title: "Literature",
            description:
              "Encourages appreciation of stories, poetry and ideas.",
          },
        ],
      },

      {
        number: "02",
        title: "Our Approach",

        items: [
          {
            title: "Interactive Learning",
            description:
              "Language develops through active classroom participation.",
          },
          {
            title: "Reading Practice",
            description:
              "Regular reading supports fluency and understanding.",
          },
          {
            title: "Creative Writing",
            description:
              "Students express ideas through varied writing activities.",
          },
          {
            title: "Conversation",
            description:
              "Speaking activities build confidence and expression.",
          },
          {
            title: "Literary Exploration",
            description:
              "Texts encourage reflection, values and imagination.",
          },
        ],
      },

      {
        number: "03",
        title: "Skills Developed",

        items: [
          {
            title: "Communication",
            description:
              "Builds confident expression of ideas.",
          },
          {
            title: "Comprehension",
            description:
              "Strengthens written and spoken understanding.",
          },
          {
            title: "Vocabulary",
            description:
              "Expands expressive and academic language.",
          },
          {
            title: "Creativity",
            description:
              "Encourages imagination through language.",
          },
        ],
      },

      {
        number: "04",
        title: "Classes",

        items: [
          {
            title: "Primary",
            description:
              "Establishes reading and communication foundations.",
          },
          {
            title: "Middle School",
            description:
              "Expands vocabulary, grammar and writing.",
          },
          {
            title: "Secondary",
            description:
              "Develops advanced academic communication.",
          },
          {
            title: "Higher Secondary",
            description:
              "Refines language skills for higher learning.",
          },
        ],
      },
    ],
  },

  /* =======================================================
     SOCIAL SCIENCE
  ======================================================= */

  social: {
    label: "Social Science",

    cards: [
      {
        number: "01",
        title: "Key Learning Areas",

        items: [
          {
            title: "History",
            description:
              "Explores people, events and developments across time.",
          },
          {
            title: "Geography",
            description:
              "Develops understanding of places and environments.",
          },
          {
            title: "Civics",
            description:
              "Builds awareness of citizenship and responsibility.",
          },
          {
            title: "Economics",
            description:
              "Introduces resources, choices and economic activities.",
          },
          {
            title: "Society & Culture",
            description:
              "Encourages understanding of communities and diversity.",
          },
        ],
      },

      {
        number: "02",
        title: "Our Approach",

        items: [
          {
            title: "Contextual Learning",
            description:
              "Connects social concepts with real contexts.",
          },
          {
            title: "Map Learning",
            description:
              "Uses maps to understand places and environments.",
          },
          {
            title: "Discussion",
            description:
              "Encourages thoughtful classroom dialogue.",
          },
          {
            title: "Source Analysis",
            description:
              "Introduces students to evidence and interpretation.",
          },
          {
            title: "Current Connections",
            description:
              "Links learning with contemporary society.",
          },
        ],
      },

      {
        number: "03",
        title: "Skills Developed",

        items: [
          {
            title: "Critical Thinking",
            description:
              "Encourages analysis of events and perspectives.",
          },
          {
            title: "Awareness",
            description:
              "Develops understanding of society.",
          },
          {
            title: "Research",
            description:
              "Builds information-gathering skills.",
          },
          {
            title: "Citizenship",
            description:
              "Encourages responsibility and social understanding.",
          },
        ],
      },

      {
        number: "04",
        title: "Classes",

        items: [
          {
            title: "Primary",
            description:
              "Introduces community and environment.",
          },
          {
            title: "Middle School",
            description:
              "Expands historical and civic awareness.",
          },
          {
            title: "Secondary",
            description:
              "Develops analytical study of society.",
          },
          {
            title: "Higher Secondary",
            description:
              "Supports deeper academic enquiry.",
          },
        ],
      },
    ],
  },

  /* =======================================================
     COMMERCE
  ======================================================= */

  commerce: {
    label: "Commerce",

    cards: [
      {
        number: "01",
        title: "Key Learning Areas",

        items: [
          {
            title: "Accountancy",
            description:
              "Develops understanding of financial principles.",
          },
          {
            title: "Commerce",
            description:
              "Introduces business and commercial activities.",
          },
          {
            title: "Economics",
            description:
              "Explores markets and economic decision-making.",
          },
          {
            title: "Business Concepts",
            description:
              "Builds awareness of organisations and management.",
          },
          {
            title: "Entrepreneurship",
            description:
              "Encourages initiative and innovative thinking.",
          },
        ],
      },

      {
        number: "02",
        title: "Our Approach",

        items: [
          {
            title: "Conceptual Learning",
            description:
              "Establishes strong understanding of business principles.",
          },
          {
            title: "Case-Based Learning",
            description:
              "Connects concepts with business situations.",
          },
          {
            title: "Numerical Practice",
            description:
              "Strengthens confidence in accounting applications.",
          },
          {
            title: "Business Awareness",
            description:
              "Relates concepts to contemporary commerce.",
          },
          {
            title: "Continuous Assessment",
            description:
              "Supports examination readiness.",
          },
        ],
      },

      {
        number: "03",
        title: "Skills Developed",

        items: [
          {
            title: "Financial Literacy",
            description:
              "Builds understanding of financial information.",
          },
          {
            title: "Analytical Thinking",
            description:
              "Strengthens business interpretation.",
          },
          {
            title: "Accuracy",
            description:
              "Encourages precision in financial work.",
          },
          {
            title: "Decision Making",
            description:
              "Develops structured business thinking.",
          },
        ],
      },

      {
        number: "04",
        title: "Classes",

        items: [
          {
            title: "Higher Secondary",
            description:
              "Introduces focused commerce pathways.",
          },
          {
            title: "Academic Foundation",
            description:
              "Builds knowledge for higher education.",
          },
          {
            title: "Practical Learning",
            description:
              "Connects principles with commercial situations.",
          },
          {
            title: "Career Preparation",
            description:
              "Supports commerce-related career pathways.",
          },
        ],
      },
    ],
  },
};

/* =========================================================
   ICONS
========================================================= */

function LeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[16px] w-[16px]"
    >
      <path
        d="M14.5 6.5L9 12L14.5 17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[16px] w-[16px]"
    >
      <path
        d="M9.5 6.5L15 12L9.5 17.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   LEARNING CARD
========================================================= */

function StudentLearningCard({
  card,
  index,
}: {
  card: LearningCard;
  index: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 38,
        scale: 0.975,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.9,
        delay: index * 0.09,
        ease,
      }}
      className="
        flex
        h-full
        min-w-0
        flex-col
      "
    >
      {/* =====================================================
          TOP NUMBER / TITLE
      ====================================================== */}

      <div
        className="
          relative

          flex
          min-h-[36px]

          items-center

          pl-[12px]
        "
      >
        <span
          className="
            absolute
            bottom-0
            left-0
            top-0

            w-[2px]

            bg-[#0075FF]
          "
        />

        <span
          className="
            font-primary

            text-[25px]
            font-semibold

            leading-none

            tracking-[-1px]

            text-[#0075FF]

            lg:text-[27px]
          "
        >
          {card.number}
        </span>

        <h3
          className="
            ml-[3px]

            min-w-0

            font-primary

            text-[13px]
            font-semibold

            leading-[1.1]

            text-[#222222]

            sm:text-[13.5px]

            lg:text-[14px]
          "
        >
          {card.title}
        </h3>
      </div>

      {/* =====================================================
          CARD
      ====================================================== */}

      <motion.article
        whileHover={{
          y: -5,
        }}
        transition={{
          duration: 0.4,
          ease,
        }}
        className="
          mt-[10px]

          flex
          flex-1
          flex-col

          rounded-[8px]

          border
          border-[#8CC5FF]

          bg-white

          px-[18px]
          py-[19px]

          shadow-[0_15px_35px_rgba(20,55,88,0.07)]

          transition-shadow
          duration-500

          hover:shadow-[0_22px_48px_rgba(0,117,255,0.11)]

          sm:px-[19px]

          lg:min-h-[350px]
        "
      >
        <div
          className="
            flex
            flex-col

            gap-[17px]
          "
        >
          {card.items.map(
            (
              item,
              itemIndex
            ) => (
              <motion.div
                key={`${card.number}-${item.title}`}
                initial={{
                  opacity: 0,
                  x: -9,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.55,
                  delay:
                    itemIndex *
                    0.045,
                  ease,
                }}
                className="
                  group/item

                  flex
                  items-start
                "
              >
                <span
                  className="
                    mt-[2px]

                    h-[14px]
                    w-[2px]

                    shrink-0

                    bg-[#0075FF]
                  "
                />

                <div
                  className="
                    min-w-0
                    pl-[7px]
                  "
                >
                  <h4
                    className="
                      font-primary

                      text-[11.5px]
                      font-semibold

                      leading-[1.2]

                      text-[#282828]

                      transition-colors
                      duration-300

                      group-hover/item:text-[#0075FF]

                      sm:text-[12px]
                    "
                  >
                    {item.title}
                  </h4>

                  <p
                    className="
                      mt-[4px]

                      font-secondary

                      text-[10px]

                      leading-[1.35]

                      text-[#777777]

                      sm:text-[10.5px]
                    "
                  >
                    {
                      item.description
                    }
                  </p>
                </div>
              </motion.div>
            )
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function WhatStudentsLearn() {
  const [
    activeSubject,
    setActiveSubject,
  ] =
    useState<SubjectKey>(
      "mathematics"
    );

  const [
    carouselPage,
    setCarouselPage,
  ] = useState(0);

  const [
    itemsPerPage,
    setItemsPerPage,
  ] = useState(1);

  const tabsRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const tabRefs =
    useRef<
      Partial<
        Record<
          SubjectKey,
          HTMLButtonElement | null
        >
      >
    >({});

  const subject =
    subjectData[
      activeSubject
    ];

  /* =========================================================
     MOBILE / TABLET BREAKPOINT

     <640    = 1 card
     640-1023 = 2 cards
     >=1024 = desktop grid
  ========================================================= */

  useEffect(() => {
    const update =
      () => {
        if (
          window.innerWidth >=
          640
        ) {
          setItemsPerPage(
            2
          );
        } else {
          setItemsPerPage(
            1
          );
        }
      };

    update();

    window.addEventListener(
      "resize",
      update
    );

    return () =>
      window.removeEventListener(
        "resize",
        update
      );
  }, []);

  /* =========================================================
     RESET CAROUSEL
  ========================================================= */

  useEffect(() => {
    setCarouselPage(0);
  }, [
    activeSubject,
    itemsPerPage,
  ]);

  /* =========================================================
     CENTER ACTIVE SUBJECT
  ========================================================= */

  useEffect(() => {
    const element =
      tabRefs.current[
        activeSubject
      ];

    if (!element)
      return;

    element.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeSubject]);

  /* =========================================================
     SUBJECT CONTROL
  ========================================================= */

  const changeSubject = (
    key: SubjectKey
  ) => {
    setActiveSubject(key);
    setCarouselPage(0);
  };

  const moveSubject = (
    direction: -1 | 1
  ) => {
    const index =
      subjectOrder.indexOf(
        activeSubject
      );

    const next =
      (index +
        direction +
        subjectOrder.length) %
      subjectOrder.length;

    changeSubject(
      subjectOrder[next]
    );
  };

  /* =========================================================
     MOBILE/TABLET PAGES
  ========================================================= */

  const pages: LearningCard[][] =
    [];

  for (
    let i = 0;
    i <
    subject.cards.length;
    i += itemsPerPage
  ) {
    pages.push(
      subject.cards.slice(
        i,
        i + itemsPerPage
      )
    );
  }

  const previousPage =
    () => {
      setCarouselPage(
        (current) =>
          Math.max(
            0,
            current - 1
          )
      );
    };

  const nextPage =
    () => {
      setCarouselPage(
        (current) =>
          Math.min(
            pages.length - 1,
            current + 1
          )
      );
    };

  return (
    <section
      className="
        relative

        w-full

        overflow-hidden

        bg-[#FCFDFE]

        py-[50px]

        sm:py-[60px]

        lg:py-[72px]
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
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(25,71,120,0.055) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(25,71,120,0.055) 1px,
              transparent 1px
            )
          `,

          backgroundSize:
            "36px 36px",
        }}
      />

      {/* glow */}

      <div
        className="
          pointer-events-none

          absolute

          bottom-[-180px]
          left-1/2

          h-[350px]
          w-[85%]

          -translate-x-1/2

          rounded-full

          bg-[#0075FF]/[0.035]

          blur-[100px]
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
          max-w-[1220px]

          px-[16px]

          sm:px-[24px]

          lg:px-[36px]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
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
            duration: 0.95,
            ease,
          }}
          className="
            flex
            flex-col

            items-center

            text-center
          "
        >
          <span
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

              tracking-[0.4px]

              text-[#0075FF]

              sm:text-[9px]
            "
          >
            Our Approach
          </span>

          <h2
            className="
              mt-[12px]

              font-primary

              text-[28px]
              font-semibold

              leading-[1.08]

              tracking-[-0.7px]

              text-[#111111]

              sm:text-[32px]

              lg:text-[35px]
            "
          >
            What Students Learn
          </h2>
        </motion.div>

        {/* =================================================
            SUBJECT NAV
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
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
            delay: 0.12,
            ease,
          }}
          className="
            mx-auto

            mt-[34px]

            flex

            w-full
            max-w-[820px]

            items-center

            sm:mt-[38px]
          "
        >
          {/* LEFT */}

          <button
            type="button"
            onClick={() =>
              moveSubject(-1)
            }
            className="
              flex

              h-[38px]
              w-[38px]

              shrink-0

              items-center
              justify-center

              rounded-full

              text-[#777777]

              transition-all
              duration-300

              hover:bg-white
              hover:text-[#0075FF]
              hover:shadow-md
            "
          >
            <LeftIcon />
          </button>

          {/* SUBJECTS */}

          <div
            ref={tabsRef}
            className="
              flex

              min-w-0
              flex-1

              items-center

              overflow-x-auto

              scroll-smooth

              px-[4px]

              [scrollbar-width:none]

              [&::-webkit-scrollbar]:hidden

              lg:justify-center
            "
          >
            {subjectOrder.map(
              (key) => {
                const active =
                  activeSubject ===
                  key;

                return (
                  <button
                    key={key}
                    ref={(
                      element
                    ) => {
                      tabRefs.current[
                        key
                      ] =
                        element;
                    }}
                    type="button"
                    onClick={() =>
                      changeSubject(
                        key
                      )
                    }
                    className={`
                      relative

                      shrink-0

                      rounded-[5px]

                      px-[14px]
                      py-[10px]

                      font-secondary

                      text-[11px]

                      whitespace-nowrap

                      transition-all
                      duration-400

                      sm:px-[17px]

                      lg:px-[20px]

                      ${
                        active
                          ? `
                            bg-white

                            font-semibold

                            text-[#0075FF]

                            shadow-[0_7px_22px_rgba(20,48,78,0.09)]
                          `
                          : `
                            text-[#AAAAAA]

                            hover:text-[#555555]
                          `
                      }
                    `}
                  >
                    {
                      subjectData[
                        key
                      ].label
                    }

                    {active && (
                      <motion.span
                        layoutId="active-subject"
                        className="
                          absolute

                          bottom-0
                          left-[20%]

                          h-[2px]
                          w-[60%]

                          rounded-full

                          bg-[#0075FF]
                        "
                      />
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* RIGHT */}

          <button
            type="button"
            onClick={() =>
              moveSubject(1)
            }
            className="
              flex

              h-[38px]
              w-[38px]

              shrink-0

              items-center
              justify-center

              rounded-full

              text-[#777777]

              transition-all
              duration-300

              hover:bg-white
              hover:text-[#0075FF]
              hover:shadow-md
            "
          >
            <RightIcon />
          </button>
        </motion.div>

        {/* =================================================
            DESKTOP
            EXACT 4 CARD STRUCTURE
        ================================================= */}

        <AnimatePresence
          mode="wait"
        >
          <motion.div
            key={`desktop-${activeSubject}`}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            transition={{
              duration: 0.5,
              ease,
            }}
            className="
              mt-[48px]

              hidden

              grid-cols-4

              gap-[20px]

              lg:grid
            "
          >
            {subject.cards.map(
              (
                card,
                index
              ) => (
                <StudentLearningCard
                  key={`${activeSubject}-${card.number}`}
                  card={card}
                  index={index}
                />
              )
            )}
          </motion.div>
        </AnimatePresence>

        {/* =================================================
            MOBILE / TABLET CAROUSEL
        ================================================= */}

        <div
          className="
            mt-[32px]

            lg:hidden
          "
        >
          {/* CONTROLS */}

          <div
            className="
              mb-[18px]

              flex

              items-center
              justify-between
            "
          >
            <span
              className="
                font-secondary

                text-[10px]
                font-medium

                uppercase

                tracking-[0.08em]

                text-[#98A2B3]
              "
            >
              Swipe to explore
            </span>

            <div
              className="
                flex
                gap-[8px]
              "
            >
              <button
                type="button"
                onClick={
                  previousPage
                }
                disabled={
                  carouselPage ===
                  0
                }
                className="
                  flex

                  h-[38px]
                  w-[38px]

                  items-center
                  justify-center

                  rounded-[8px]

                  border
                  border-[#E0E8F1]

                  bg-white

                  text-[#0075FF]

                  shadow-[0_5px_15px_rgba(20,50,80,0.06)]

                  transition-all

                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <LeftIcon />
              </button>

              <button
                type="button"
                onClick={
                  nextPage
                }
                disabled={
                  carouselPage ===
                  pages.length -
                    1
                }
                className="
                  flex

                  h-[38px]
                  w-[38px]

                  items-center
                  justify-center

                  rounded-[8px]

                  border
                  border-[#DCE6F0]

                  bg-white

                  text-[#0075FF]

                  shadow-[0_5px_15px_rgba(20,50,80,0.08)]

                  transition-all

                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <RightIcon />
              </button>
            </div>
          </div>

          {/* =================================================
              CAROUSEL VIEWPORT

              No horizontal native scroll.
              No cut cards.
          ================================================= */}

          <div
            className="
              w-full

              overflow-hidden
            "
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={`${activeSubject}-${carouselPage}-${itemsPerPage}`}
                initial={{
                  opacity: 0,
                  x: 25,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -25,
                }}
                transition={{
                  duration: 0.5,
                  ease,
                }}
                className={`
                  grid
                  w-full

                  items-stretch

                  gap-[16px]

                  ${
                    itemsPerPage ===
                    2
                      ? "grid-cols-2"
                      : "grid-cols-1"
                  }
                `}
              >
                {pages[
                  carouselPage
                ]?.map(
                  (
                    card,
                    index
                  ) => (
                    <StudentLearningCard
                      key={`${activeSubject}-${card.number}`}
                      card={
                        card
                      }
                      index={
                        index
                      }
                    />
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* =================================================
              DOT INDICATORS
          ================================================= */}

          <div
            className="
              mt-[22px]

              flex

              items-center
              justify-center

              gap-[8px]
            "
          >
            {pages.map(
              (
                _,
                index
              ) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setCarouselPage(
                      index
                    )
                  }
                  className="
                    flex
                    h-[12px]
                    items-center
                    justify-center
                  "
                >
                  <motion.span
                    animate={{
                      width:
                        carouselPage ===
                        index
                          ? 24
                          : 8,

                      backgroundColor:
                        carouselPage ===
                        index
                          ? "#0075FF"
                          : "#D3DDE7",
                    }}
                    transition={{
                      duration: 0.35,
                      ease,
                    }}
                    className="
                      block

                      h-[7px]

                      rounded-full
                    "
                  />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}