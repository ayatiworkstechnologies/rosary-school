"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  type PanInfo,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type FacultyCategory =
  | "All Faculty"
  | "Leadership"
  | "Kindergarten"
  | "Primary"
  | "Middle School"
  | "High School"
  | "Higher Secondary";

type FacultyMember = {
  id: number;
  name: string;
  designation: string;
  subject: string;
  experience: string;
  category: Exclude<FacultyCategory, "All Faculty">;
  image: string;
};

/* =========================================================
   DATA
========================================================= */

const facultyMembers: FacultyMember[] = [
  {
    id: 1,
    name: "Mrs. Maria Joseph",
    designation: "Senior Mathematics Teacher",
    subject: "Mathematics",
    experience: "12 Years Exp",
    category: "Higher Secondary",
    image: "/images/faculty/faculty-01.png",
  },
  {
    id: 2,
    name: "Ms. Anitha Raj",
    designation: "English Teacher",
    subject: "English",
    experience: "8 Years Exp",
    category: "High School",
    image: "/images/faculty/faculty-02.png",
  },
  {
    id: 3,
    name: "Mrs. Grace Mary",
    designation: "Science Teacher",
    subject: "Science",
    experience: "10 Years Exp",
    category: "Middle School",
    image: "/images/faculty/faculty-03.png",
  },
  {
    id: 4,
    name: "Mrs. Stella Thomas",
    designation: "Primary School Teacher",
    subject: "Primary",
    experience: "9 Years Exp",
    category: "Primary",
    image: "/images/faculty/faculty-01.png",
  },
  {
    id: 5,
    name: "Ms. Janet Mary",
    designation: "Kindergarten Educator",
    subject: "Kindergarten",
    experience: "7 Years Exp",
    category: "Kindergarten",
    image: "/images/faculty/faculty-02.png",
  },
  {
    id: 6,
    name: "Mrs. Teresa John",
    designation: "Academic Coordinator",
    subject: "Leadership",
    experience: "18 Years Exp",
    category: "Leadership",
    image: "/images/faculty/faculty-03.png",
  },
];

const categories: FacultyCategory[] = [
  "All Faculty",
  "Leadership",
  "Kindergarten",
  "Primary",
  "Middle School",
  "High School",
  "Higher Secondary",
];

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
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
   ICONS
========================================================= */

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[13px] w-[13px]"
      aria-hidden="true"
    >
      <path
        d="M5 12H18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M13 7L18 12L13 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[17px] w-[17px]"
    >
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[17px] w-[17px]"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExperienceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[11px] w-[11px]"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M12 8V12L15 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   FACULTY CARD
========================================================= */

function FacultyCard({
  faculty,
  index,
}: {
  faculty: FacultyMember;
  index: number;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 36,
        scale: 0.98,
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
        duration: 0.8,
        delay: Math.min(index, 3) * 0.07,
        ease,
      }}
      whileHover={{
        y: -6,
      }}
      className="
        group
        relative
        w-full

        overflow-hidden

        rounded-[14px]

        border
        border-[#E5E0D7]

        bg-white

        shadow-[0_12px_35px_rgba(25,45,70,0.07)]

        transition-shadow
        duration-500

        hover:shadow-[0_24px_55px_rgba(25,45,70,0.13)]
      "
    >
      {/* IMAGE */}

      <div
        className="
          relative
          aspect-[1.28/1]
          w-full

          overflow-hidden

          bg-[#F3F3F3]

          lg:aspect-[1.34/1]
        "
      >
        {!imageError ? (
          <Image
            src={faculty.image}
            alt={faculty.name}
            fill
            sizes="
              (max-width: 639px) 90vw,
              (max-width: 1023px) 45vw,
              31vw
            "
            onError={() => setImageError(true)}
            className="
              object-cover
              object-center

              transition-transform
              duration-[900ms]

              ease-[cubic-bezier(0.22,1,0.36,1)]

              group-hover:scale-[1.045]
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0

              flex
              items-center
              justify-center

              bg-[#F3F4F5]
            "
          >
            <div
              className="
                flex
                h-[74px]
                w-[74px]

                items-center
                justify-center

                rounded-full

                bg-[#EAF4FF]

                font-primary
                text-[21px]
                font-semibold

                text-[#0075FF]
              "
            >
              {faculty.name
                .replace("Mrs. ", "")
                .replace("Ms. ", "")
                .split(" ")
                .map((item) => item[0])
                .slice(0, 2)
                .join("")}
            </div>
          </div>
        )}

        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-gradient-to-t
            from-black/[0.08]
            to-transparent

            opacity-0

            transition-opacity
            duration-500

            group-hover:opacity-100
          "
        />
      </div>

      {/* GOLD LINE */}

      <motion.div
        initial={{
          scaleX: 0,
        }}
        whileInView={{
          scaleX: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
          ease,
        }}
        className="
          h-[3px]
          w-full

          origin-left

          bg-[#E5B72B]
        "
      />

      {/* CONTENT */}

      <div
        className="
          px-[17px]
          pb-[18px]
          pt-[14px]

          sm:px-[18px]

          lg:px-[20px]
          lg:pb-[21px]
          lg:pt-[16px]
        "
      >
        {/* TAGS */}

        <div className="flex flex-wrap items-center gap-[6px]">
          <span
            className="
              inline-flex
              items-center

              rounded-[4px]

              bg-[#FFF2A7]

              px-[8px]
              py-[4px]

              font-secondary

              text-[8px]
              font-medium

              leading-none

              text-[#5C5520]

              sm:text-[8.5px]
            "
          >
            {faculty.subject}
          </span>

          <span
            className="
              inline-flex
              items-center

              gap-[4px]

              rounded-[4px]

              bg-[#F3F3F3]

              px-[7px]
              py-[4px]

              font-secondary

              text-[8px]

              leading-none

              text-[#777]

              sm:text-[8.5px]
            "
          >
            <ExperienceIcon />

            {faculty.experience}
          </span>
        </div>

        {/* NAME */}

        <h3
          className="
            mt-[10px]

            font-primary

            text-[16px]
            font-semibold

            leading-[1.12]

            tracking-[-0.3px]

            text-[#151515]

            sm:text-[17px]

            lg:text-[18px]
          "
        >
          {faculty.name}
        </h3>

        {/* DESIGNATION */}

        <p
          className="
            mt-[4px]

            font-secondary

            text-[10px]

            leading-[1.45]

            text-[#767676]

            sm:text-[10.5px]
          "
        >
          {faculty.designation}
        </p>

        {/* PROFILE */}

        <motion.button
          type="button"
          whileHover={{
            x: 4,
          }}
          whileTap={{
            scale: 0.97,
          }}
          className="
            mt-[15px]

            inline-flex
            items-center

            gap-[7px]

            font-secondary

            text-[9.5px]
            font-semibold

            text-[#0075FF]

            sm:text-[10px]
          "
        >
          View Profile

          <ArrowIcon />
        </motion.button>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function FacultyShowcase() {
  const [activeCategory, setActiveCategory] =
    useState<FacultyCategory>("All Faculty");

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [visibleCards, setVisibleCards] =
    useState(1);

  const [cardWidth, setCardWidth] =
    useState(0);

  const carouselViewportRef =
    useRef<HTMLDivElement | null>(null);

  const filterContainerRef =
    useRef<HTMLDivElement | null>(null);

  const filterButtonRefs =
    useRef<Record<string, HTMLButtonElement | null>>({});

  const gap = 18;

  /* =========================================================
     FILTERED FACULTY
  ========================================================= */

  const filteredFaculty = useMemo(() => {
    if (activeCategory === "All Faculty") {
      return facultyMembers;
    }

    return facultyMembers.filter(
      (faculty) =>
        faculty.category === activeCategory
    );
  }, [activeCategory]);

  /* =========================================================
     RESPONSIVE CAROUSEL
  ========================================================= */

  const calculateCarousel = useCallback(() => {
    if (typeof window === "undefined") return;

    let cards = 1;

    if (
      window.innerWidth >= 640 &&
      window.innerWidth < 1024
    ) {
      cards = 2;
    }

    setVisibleCards(cards);

    requestAnimationFrame(() => {
      const viewport =
        carouselViewportRef.current;

      if (!viewport) return;

      const availableWidth =
        viewport.clientWidth;

      const calculatedWidth =
        (availableWidth -
          gap * (cards - 1)) /
        cards;

      setCardWidth(calculatedWidth);
    });
  }, []);

  useEffect(() => {
    calculateCarousel();

    window.addEventListener(
      "resize",
      calculateCarousel
    );

    return () =>
      window.removeEventListener(
        "resize",
        calculateCarousel
      );
  }, [calculateCarousel]);

  useEffect(() => {
    setCurrentIndex(0);

    const timer = window.setTimeout(
      calculateCarousel,
      60
    );

    return () =>
      window.clearTimeout(timer);
  }, [activeCategory, calculateCarousel]);

  const maxIndex = Math.max(
    0,
    filteredFaculty.length - visibleCards
  );

  /* =========================================================
     CAROUSEL CONTROLS
  ========================================================= */

  const nextSlide = () => {
    setCurrentIndex((current) =>
      Math.min(
        current + 1,
        maxIndex
      )
    );
  };

  const previousSlide = () => {
    setCurrentIndex((current) =>
      Math.max(
        current - 1,
        0
      )
    );
  };

  const handleDragEnd = (
    _:
      | MouseEvent
      | TouchEvent
      | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -45) {
      nextSlide();
    }

    if (info.offset.x > 45) {
      previousSlide();
    }
  };

  /* =========================================================
     FILTER CLICK
  ========================================================= */

  const selectCategory = (
    category: FacultyCategory
  ) => {
    setActiveCategory(category);
    setCurrentIndex(0);

    requestAnimationFrame(() => {
      const container =
        filterContainerRef.current;

      const button =
        filterButtonRefs.current[
          category
        ];

      if (!container || !button) {
        return;
      }

      const target =
        button.offsetLeft +
        button.offsetWidth / 2 -
        container.clientWidth / 2;

      container.scrollTo({
        left: Math.max(0, target),
        behavior: "smooth",
      });
    });
  };

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

        md:py-[68px]

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

          [background-size:100%_auto]

          lg:bg-center
          lg:bg-no-repeat
          lg:[background-size:cover]
        "
        style={{
          backgroundImage:
            "url('/images/academics-bg.png')",
        }}
      />

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
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.25,
        }}
        className="
          relative
          z-10

          mx-auto

          flex
          w-full
          max-w-[1200px]

          flex-col
          items-center

          px-[18px]

          text-center
        "
      >
        <motion.span
          variants={fadeUp}
          className="
            inline-flex
            items-center
            justify-center

            rounded-[4px]

            bg-[#EFF6FF]

            px-[9px]
            py-[5px]

            font-secondary

            text-[13px]
            font-medium

            leading-none

            text-[#0075FF]
          "
        >
          Faculty
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="
            mt-[13px]

            font-primary

            text-[27px]
            font-semibold

            leading-[1.06]

            tracking-[-0.6px]

            text-[#161616]

            sm:text-[31px]

            md:text-[33px]

            lg:text-[35px] pt-3
          "
        >
          Meet Our Educators
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="
            mx-auto

            mt-[8px]

            max-w-[490px]

            font-secondary

            text-[10px]

            leading-[1.5]

            text-[#848484]

            sm:text-[12px] pt-3
          "
        >
          Dedicated educators nurturing knowledge,
          character, and confidence in every Rosarian.
        </motion.p>
      </motion.div>

      {/* =====================================================
          FILTERS

          TRUE CAPSULE SHAPE
      ====================================================== */}

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
          duration: 0.75,
          delay: 0.2,
          ease,
        }}
        className="
          relative
          z-20

          mt-[30px]

          w-full

          lg:mt-[34px]
        "
      >
        <div
          ref={filterContainerRef}
          className="
            w-full

            overflow-x-auto
            overflow-y-visible

            scroll-smooth

            [scrollbar-width:none]

            [&::-webkit-scrollbar]:hidden
          "
        >
          <div
            className="
              mx-auto

              flex

              w-max
              min-w-full

              items-center

              gap-[8px]

              px-[16px]
              py-[6px]

              sm:px-[24px]

              md:px-[30px]

              lg:justify-center
              lg:px-[40px]
            "
          >
            {categories.map(
              (category) => {
                const active =
                  category ===
                  activeCategory;

                return (
                  <motion.button
                    key={category}
                    ref={(element) => {
                      filterButtonRefs.current[
                        category
                      ] = element;
                    }}
                    type="button"
                    onClick={() =>
                      selectCategory(
                        category
                      )
                    }
                    whileHover={{
                      y: -1,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    animate={{
                      backgroundColor:
                        active
                          ? "#0075FF"
                          : "#FFFFFF",

                      borderColor:
                        active
                          ? "#0075FF"
                          : "#DED8CF",

                      color:
                        active
                          ? "#FFFFFF"
                          : "#555555",

                      boxShadow:
                        active
                          ? "0 7px 18px rgba(0,117,255,0.16)"
                          : "0 2px 8px rgba(20,40,60,0.025)",
                    }}
                    transition={{
                      duration: 0.3,
                      ease,
                    }}
                    style={{
                      borderRadius:
                        "9999px",
                    }}
                    className="
                      relative

                      flex

                      h-[28px]

                      shrink-0

                      items-center
                      justify-center

                      !rounded-full

                      border

                      px-[13px]

                      font-secondary

                      text-[8px]
                      font-medium

                      leading-none

                      whitespace-nowrap

                      outline-none

                      sm:h-[29px]
                      sm:px-[14px]
                      sm:text-[8.5px]

                      md:h-[30px]
                      md:px-[15px]

                      lg:h-[29px]
                      lg:px-[15px]
                      lg:text-[8.5px]
                    "
                  >
                    {category}
                  </motion.button>
                );
              }
            )}
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          MOBILE + TABLET CAROUSEL
      ====================================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{
            opacity: 0,
            y: 18,
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
            duration: 0.45,
            ease,
          }}
          className="
            relative
            z-10

            mt-[40px]

            lg:hidden
          "
        >
          <div
            className="
              px-[16px]

              sm:px-[24px]

              md:px-[30px]
            "
          >
            <div
              ref={carouselViewportRef}
              className="
                w-full

                overflow-hidden
              "
            >
              <motion.div
                drag="x"
                dragConstraints={{
                  left: 0,
                  right: 0,
                }}
                dragElastic={0.07}
                onDragEnd={handleDragEnd}
                animate={{
                  x:
                    -currentIndex *
                    (cardWidth + gap),
                }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 27,
                  mass: 0.82,
                }}
                className="
                  flex

                  cursor-grab

                  gap-[18px]

                  pb-[8px]

                  active:cursor-grabbing
                "
              >
                {filteredFaculty.map(
                  (
                    faculty,
                    index
                  ) => (
                    <div
                      key={faculty.id}
                      style={{
                        width:
                          cardWidth ||
                          "100%",
                      }}
                      className="
                        shrink-0
                      "
                    >
                      <FacultyCard
                        faculty={
                          faculty
                        }
                        index={index}
                      />
                    </div>
                  )
                )}
              </motion.div>
            </div>
          </div>

          {/* CONTROLS */}

          {maxIndex > 0 && (
            <div
              className="
                mx-auto

                mt-[18px]

                flex
                w-full
                max-w-[960px]

                items-center
                justify-between

                px-[18px]

                sm:px-[24px]

                md:px-[30px]
              "
            >
              {/* DOTS */}

              <div className="flex items-center gap-[7px]">
                {Array.from({
                  length:
                    maxIndex + 1,
                }).map(
                  (_, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() =>
                        setCurrentIndex(
                          index
                        )
                      }
                      animate={{
                        width:
                          currentIndex ===
                          index
                            ? 20
                            : 6,

                        opacity:
                          currentIndex ===
                          index
                            ? 1
                            : 0.25,
                      }}
                      transition={{
                        duration: 0.3,
                        ease,
                      }}
                      className="
                        h-[6px]

                        rounded-full

                        bg-[#0075FF]
                      "
                    />
                  )
                )}
              </div>

              {/* ARROWS */}

              <div className="flex items-center gap-[8px]">
                <motion.button
                  type="button"
                  onClick={
                    previousSlide
                  }
                  disabled={
                    currentIndex === 0
                  }
                  whileTap={{
                    scale: 0.94,
                  }}
                  className="
                    flex

                    h-[40px]
                    w-[40px]

                    items-center
                    justify-center

                    rounded-[10px]

                    border
                    border-[#DCE5EE]

                    bg-white

                    text-[#0075FF]

                    shadow-[0_7px_20px_rgba(25,60,90,0.07)]

                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  <ChevronLeft />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={nextSlide}
                  disabled={
                    currentIndex ===
                    maxIndex
                  }
                  whileTap={{
                    scale: 0.94,
                  }}
                  className="
                    flex

                    h-[40px]
                    w-[40px]

                    items-center
                    justify-center

                    rounded-[10px]

                    bg-[#0075FF]

                    text-white

                    shadow-[0_8px_22px_rgba(0,117,255,0.18)]

                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  <ChevronRight />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* =====================================================
          DESKTOP GRID
      ====================================================== */}

      <AnimatePresence mode="wait">
        <motion.div
          key={`desktop-${activeCategory}`}
          initial={{
            opacity: 0,
            y: 18,
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
            relative
            z-10

            mx-auto

            mt-[46px]

            hidden

            w-full
            max-w-[1180px]

            grid-cols-3

            gap-[24px]

            px-[38px]

            lg:grid

            xl:gap-[28px]
            xl:px-[44px]
          "
        >
          {filteredFaculty.map(
            (
              faculty,
              index
            ) => (
              <FacultyCard
                key={
                  faculty.id
                }
                faculty={
                  faculty
                }
                index={index}
              />
            )
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}