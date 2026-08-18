"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type TabType = "timetable" | "holiday";

type DropdownType = "class" | "section" | null;

type DropdownProps = {
  type: "class" | "section";
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

/* =========================================================
   DATA
========================================================= */

const classOptions = [
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V",
  "Class VI",
  "Class VII",
  "Class VIII",
  "Class IX",
  "Class X",
  "Class XI",
  "Class XII",
];

const sectionOptions = [
  "Section A",
  "Section B",
  "Section C",
  "Section D",
];

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

/* =========================================================
   CHEVRON ICON
========================================================= */

function ChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      animate={{
        rotate: open ? 180 : 0,
      }}
      transition={{
        duration: 0.3,
        ease,
      }}
      className="
        h-[17px]
        w-[17px]
        shrink-0
        text-[#0075FF]
      "
      aria-hidden="true"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/* =========================================================
   CHECK ICON
========================================================= */

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="
        h-[14px]
        w-[14px]
        shrink-0
        text-[#0075FF]
      "
      aria-hidden="true"
    >
      <path
        d="M5 12.5L9.2 16.5L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   CUSTOM DROPDOWN

   NO SCROLLBAR.
   NO ABSOLUTE FLOATING PANEL.
   OPTIONS EXPAND INSIDE CARD.
========================================================= */

function CustomDropdown({
  type,
  label,
  placeholder,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: DropdownProps) {
  return (
    <motion.div
      layout
      transition={{
        layout: {
          duration: 0.45,
          ease,
        },
      }}
      className="
        relative
        w-full
      "
    >
      {/* LABEL */}

      <label
        className="
          mb-[8px]
          block
          font-primary
          text-[11px]
          font-semibold
          leading-none
          text-[#1E1E1E]

          sm:text-[12px]
        "
      >
        {label}
      </label>

      {/* SELECT BUTTON */}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`
          flex
          h-[46px]
          w-full
          items-center
          justify-between
          gap-[12px]

          rounded-[6px]
          border
          bg-white

          px-[14px]

          text-left
          outline-none

          transition-all
          duration-300

          ${
            isOpen
              ? `
                border-[#0075FF]
                shadow-[0_0_0_3px_rgba(0,117,255,0.07)]
              `
              : `
                border-[#8CBFFF]
                hover:border-[#0075FF]
              `
          }
        `}
      >
        <span
          className={`
            min-w-0
            flex-1
            truncate

            font-secondary
            text-[12px]

            sm:text-[12.5px]

            ${
              value
                ? "text-[#303030]"
                : "text-[#989898]"
            }
          `}
        >
          {value || placeholder}
        </span>

        <ChevronIcon open={isOpen} />
      </button>

      {/* =====================================================
          OPTIONS GRID
      ====================================================== */}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              marginTop: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              marginTop: 8,
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0,
            }}
            transition={{
              duration: 0.42,
              ease,
            }}
            className="
              overflow-hidden
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
                scale: 0.985,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -5,
                scale: 0.985,
              }}
              transition={{
                duration: 0.32,
                ease,
              }}
              className="
                rounded-[8px]

                border
                border-[#DFE7EF]

                bg-[#FBFDFF]

                p-[7px]

                shadow-[0_12px_28px_rgba(20,48,80,0.08)]
              "
            >
              <div
                className={`
                  grid
                  gap-[6px]

                  ${
                    type === "class"
                      ? `
                        grid-cols-2
                        sm:grid-cols-3
                      `
                      : `
                        grid-cols-2
                      `
                  }
                `}
              >
                {options.map(
                  (
                    option,
                    index
                  ) => {
                    const selected =
                      value === option;

                    return (
                      <motion.button
                        key={option}
                        type="button"
                        initial={{
                          opacity: 0,
                          y: 7,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.28,
                          delay:
                            index *
                            0.018,
                          ease,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        onClick={() =>
                          onSelect(
                            option
                          )
                        }
                        className={`
                          flex

                          min-h-[37px]
                          w-full

                          items-center
                          justify-between

                          gap-[6px]

                          rounded-[5px]

                          border

                          px-[9px]

                          text-left

                          font-secondary
                          text-[11px]
                          font-medium

                          transition-all
                          duration-300

                          sm:min-h-[39px]
                          sm:text-[11.5px]

                          ${
                            selected
                              ? `
                                border-[#B8DAFF]
                                bg-[#EDF6FF]
                                text-[#0075FF]
                              `
                              : `
                                border-transparent
                                bg-white
                                text-[#454545]

                                hover:border-[#B8DAFF]
                                hover:bg-[#F2F8FF]
                                hover:text-[#0075FF]
                              `
                          }
                        `}
                      >
                        <span className="truncate">
                          {option}
                        </span>

                        {selected && (
                          <CheckIcon />
                        )}
                      </motion.button>
                    );
                  }
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AcademicSchedule() {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<TabType>(
      "timetable"
    );

  const [
    openDropdown,
    setOpenDropdown,
  ] =
    useState<DropdownType>(
      null
    );

  const [
    selectedClass,
    setSelectedClass,
  ] = useState("");

  const [
    selectedSection,
    setSelectedSection,
  ] = useState("");

  /* =========================================================
     SELECT CLASS
  ========================================================= */

  const handleClassSelect = (
    value: string
  ) => {
    setSelectedClass(value);

    setOpenDropdown(null);
  };

  /* =========================================================
     SELECT SECTION
  ========================================================= */

  const handleSectionSelect = (
    value: string
  ) => {
    setSelectedSection(value);

    setOpenDropdown(null);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = () => {
    if (
      !selectedClass ||
      !selectedSection
    ) {
      return;
    }

    console.log({
      type: activeTab,
      class: selectedClass,
      section:
        selectedSection,
    });
  };

  return (
    <motion.section
      layout
      transition={{
        layout: {
          duration: 0.5,
          ease,
        },
      }}
      className="
        relative
        isolate

        w-full

        overflow-hidden

        bg-[#0075FF]

        py-[44px]

        sm:py-[52px]

        md:py-[58px]

        lg:py-[62px]

        xl:min-h-[390px]
        xl:py-[68px]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          -z-20

          overflow-hidden
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 1.045,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 1.5,
            ease,
          }}
          className="
            absolute
            inset-0

            bg-cover
            bg-center
            bg-no-repeat
          "
          style={{
            backgroundImage:
              "url('/images/schedule-bg.png')",
          }}
        />

        {/* subtle overlay */}

        <div
          className="
            absolute
            inset-0

            bg-[#0075FF]/[0.025]
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <motion.div
        layout
        className="
          relative
          z-10

          mx-auto

          grid

          w-full
          max-w-[1220px]

          grid-cols-1

          items-center

          gap-[32px]

          px-[16px]

          sm:px-[24px]

          md:px-[34px]

          lg:px-[40px]

          xl:grid-cols-[0.72fr_1.28fr]
          xl:gap-[70px]
          xl:px-[50px]
        "
      >
        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: -42,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1.1,
            ease,
          }}
          className="
            relative

            mx-auto

            w-full
            max-w-[390px]

            text-center

            xl:mx-0
            xl:text-left
          "
        >
          {/* TITLE */}

          <motion.h2
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
            }}
            transition={{
              duration: 0.95,
              delay: 0.08,
              ease,
            }}
            className="
              font-primary

              text-[30px]
              font-semibold

              leading-[1.02]

              tracking-[-0.8px]

              !text-white

              sm:text-[34px]

              md:text-[36px]

              xl:text-[40px]
            "
          >
            Academic
            <br />
            Schedule &amp;
            <br />
            Calendar
          </motion.h2>

          {/* DESCRIPTION */}

          <motion.p
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
              duration: 0.9,
              delay: 0.18,
              ease,
            }}
            className="
              mx-auto

              mt-[14px]

              max-w-[330px]

              font-secondary

              text-[12px]

              leading-[1.55]

              text-white/90

              sm:text-[13px]

              xl:mx-0
            "
          >
            Stay organized with school
            timetables, important academic
            dates, holidays, and scheduled
            breaks throughout the academic
            year.
          </motion.p>

          {/* =================================================
              DOTTED ARROW

              DESKTOP ONLY
              Mobile = hidden
              Tablet = hidden
          ================================================= */}

          <motion.svg
            initial={{
              opacity: 0,
              x: -12,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1,
              delay: 0.35,
              ease,
            }}
            viewBox="0 0 250 100"
            fill="none"
            aria-hidden="true"
            className="
              pointer-events-none

              absolute

              left-[215px]
              top-[51px]

              hidden

              h-[100px]
              w-[250px]

              xl:block
            "
          >
            <defs>
              <marker
                id="academicArrow"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="4.5"
                orient="auto"
              >
                <path
                  d="M1 1 L7 4.5 L1 8"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>

            <motion.path
              initial={{
                strokeDashoffset: 85,
              }}
              whileInView={{
                strokeDashoffset: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.6,
                delay: 0.4,
                ease,
              }}
              d="
                M5 20
                C38 30 70 51 109 56
                C146 61 168 47 171 25
                C174 10 185 7 198 14
              "
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeDasharray="3 6"
              strokeLinecap="round"
              markerEnd="url(#academicArrow)"
            />
          </motion.svg>
        </motion.div>

        {/* =================================================
            FORM CARD
        ================================================= */}

        <motion.div
          layout
          initial={{
            opacity: 0,
            x: 40,
            y: 25,
            scale: 0.97,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 1.05,
            delay: 0.1,
            ease,

            layout: {
              duration: 0.5,
              ease,
            },
          }}
          className="
            mx-auto

            w-full
            max-w-[620px]

            rounded-[12px]

            bg-white

            p-[17px]

            shadow-[0_22px_55px_rgba(0,49,110,0.16)]

            sm:p-[21px]

            md:max-w-[680px]
            md:p-[25px]

            xl:max-w-[720px]
            xl:p-[28px]
          "
        >
          {/* =================================================
              TABS
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
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
              delay: 0.14,
              ease,
            }}
            className="
              grid

              w-full

              grid-cols-2

              gap-[9px]

              sm:max-w-[400px]
              sm:gap-[10px]
            "
          >
            {/* TIMETABLE */}

            <motion.button
              type="button"
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => {
                setActiveTab(
                  "timetable"
                );

                setOpenDropdown(
                  null
                );
              }}
              className={`
                min-h-[43px]

                rounded-[5px]

                border

                px-[10px]

                font-secondary

                text-[11px]
                font-medium

                transition-colors
                duration-300

                sm:min-h-[44px]
                sm:text-[12px]

                ${
                  activeTab ===
                  "timetable"
                    ? `
                      border-[#0075FF]
                      bg-[#0075FF]
                      text-white
                      shadow-[0_8px_20px_rgba(0,117,255,0.16)]
                    `
                    : `
                      border-[#0075FF]
                      bg-white
                      text-[#222222]

                      hover:bg-[#F4F9FF]
                    `
                }
              `}
            >
              Timetable
            </motion.button>

            {/* HOLIDAY */}

            <motion.button
              type="button"
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => {
                setActiveTab(
                  "holiday"
                );

                setOpenDropdown(
                  null
                );
              }}
              className={`
                min-h-[43px]

                rounded-[5px]

                border

                px-[10px]

                font-secondary

                text-[11px]
                font-medium

                transition-colors
                duration-300

                sm:min-h-[44px]
                sm:text-[12px]

                ${
                  activeTab ===
                  "holiday"
                    ? `
                      border-[#0075FF]
                      bg-[#0075FF]
                      text-white
                      shadow-[0_8px_20px_rgba(0,117,255,0.16)]
                    `
                    : `
                      border-[#0075FF]
                      bg-white
                      text-[#222222]

                      hover:bg-[#F4F9FF]
                    `
                }
              `}
            >
              Holiday List
            </motion.button>
          </motion.div>

          {/* =================================================
              FORM
          ================================================= */}

          <AnimatePresence
            mode="wait"
          >
            <motion.div
              layout
              key={activeTab}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.4,
                ease,

                layout: {
                  duration: 0.45,
                  ease,
                },
              }}
              className="
                mt-[21px]

                grid

                grid-cols-1

                items-start

                gap-[16px]

                md:grid-cols-2
                md:gap-[18px]
              "
            >
              {/* CLASS */}

              <CustomDropdown
                type="class"
                label="Class"
                placeholder="Select Your Class"
                value={
                  selectedClass
                }
                options={
                  classOptions
                }
                isOpen={
                  openDropdown ===
                  "class"
                }
                onToggle={() =>
                  setOpenDropdown(
                    (
                      current
                    ) =>
                      current ===
                      "class"
                        ? null
                        : "class"
                  )
                }
                onSelect={
                  handleClassSelect
                }
              />

              {/* SECTION */}

              <CustomDropdown
                type="section"
                label="Section"
                placeholder="Select Your Section"
                value={
                  selectedSection
                }
                options={
                  sectionOptions
                }
                isOpen={
                  openDropdown ===
                  "section"
                }
                onToggle={() =>
                  setOpenDropdown(
                    (
                      current
                    ) =>
                      current ===
                      "section"
                        ? null
                        : "section"
                  )
                }
                onSelect={
                  handleSectionSelect
                }
              />
            </motion.div>
          </AnimatePresence>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <motion.button
            layout
            type="button"
            onClick={
              handleSubmit
            }
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
              duration: 0.7,
              delay: 0.27,
              ease,

              layout: {
                duration: 0.45,
                ease,
              },
            }}
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="
              mt-[19px]

              flex

              min-h-[44px]

              w-full

              items-center
              justify-center

              rounded-[6px]

              bg-[#0075FF]

              px-[24px]

              font-primary

              text-[12px]
              font-semibold

              uppercase

              text-white

              shadow-[0_10px_24px_rgba(0,117,255,0.18)]

              transition-colors
              duration-300

              hover:bg-[#0069E5]

              sm:w-[180px]
            "
          >
            Submit
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}