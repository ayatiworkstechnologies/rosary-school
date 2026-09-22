"use client";

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

import {
  formatPublicFacultyExperience,
  getPublicFacultyCategories,
  getPublicFacultyImageUrl,
  getPublicFacultyMembers,
  type PublicFacultyCategory,
  type PublicFacultyMember,
  sortPublicFacultyCategories,
} from "@/services/publicFacultyService";


/* =========================================================
   TYPES
========================================================= */

type ActiveCategory =
  | "all"
  | string;


/* =========================================================
   MOTION
========================================================= */

const ease = [
  0.22,
  1,
  0.36,
  1,
] as const;


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


function LoadingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="
        h-[24px]
        w-[24px]

        animate-spin

        text-[#0075FF]
      "
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.2"
      />

      <path
        d="M21 12A9 9 0 0 0 12 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(
  name: string
) {
  return name
    .replace("Mrs. ", "")
    .replace("Ms. ", "")
    .replace("Mr. ", "")
    .replace("Dr. ", "")
    .split(" ")
    .filter(Boolean)
    .map(
      (item) =>
        item[0]
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();
}


/* =========================================================
   FACULTY CARD
========================================================= */

function FacultyCard({
  faculty,
  index,
}: {
  faculty: PublicFacultyMember;
  index: number;
}) {
  const [
    imageError,
    setImageError,
  ] = useState(false);


  const imageUrl =
    getPublicFacultyImageUrl(
      faculty.image_url
    );


  const showImage =
    Boolean(imageUrl) &&
    !imageError;


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

        delay:
          Math.min(
            index,
            3
          ) * 0.07,

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

      {/* ===================================================
          IMAGE
      =================================================== */}

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
        {showImage ? (
          <img
            src={imageUrl!}
            alt={faculty.name}
            onError={() =>
              setImageError(true)
            }
            className="
              h-full
              w-full

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
              {getInitials(
                faculty.name
              )}
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


      {/* ===================================================
          GOLD LINE
      =================================================== */}

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


      {/* ===================================================
          CONTENT
      =================================================== */}

      <div
        className="
          px-[20px]

          pb-[22px]
          pt-[18px]

          sm:px-[21px]
          sm:pb-[23px]
          sm:pt-[18px]

          lg:px-[22px]
          lg:pb-[24px]
          lg:pt-[19px]
        "
      >

        {/* TAGS */}

        <div
          className="
            flex
            flex-wrap
            items-center

            gap-[6px]
          "
        >
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

            {formatPublicFacultyExperience(
              faculty.experience_years
            )}
          </span>
        </div>


        {/* NAME */}

        <h3
          className="
            mt-[12px]

            py-1

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
            mt-[6px]

            font-secondary

            text-[10px]

            leading-[1.45]

            text-[#767676]

            sm:text-[10.5px]
          "
        >
          {faculty.designation}
        </p>
      </div>
    </motion.article>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function FacultyShowcase() {

  /* =======================================================
     API DATA
  ======================================================= */

  const [
    facultyMembers,
    setFacultyMembers,
  ] = useState<
    PublicFacultyMember[]
  >([]);


  const [
    categories,
    setCategories,
  ] = useState<
    PublicFacultyCategory[]
  >([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);


  /* =======================================================
     FILTER
  ======================================================= */

  const [
    activeCategory,
    setActiveCategory,
  ] = useState<ActiveCategory>(
    "all"
  );


  /* =======================================================
     CAROUSEL
  ======================================================= */

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);


  const [
    visibleCards,
    setVisibleCards,
  ] = useState(1);


  const [
    cardWidth,
    setCardWidth,
  ] = useState(0);


  const carouselViewportRef =
    useRef<
      HTMLDivElement | null
    >(null);


  const filterContainerRef =
    useRef<
      HTMLDivElement | null
    >(null);


  const filterButtonRefs =
    useRef<
      Record<
        string,
        HTMLButtonElement | null
      >
    >({});


  const gap = 18;


  /* =======================================================
     LOAD API DATA
  ======================================================= */

  const loadFacultyData =
    useCallback(
      async () => {
        try {
          setLoading(true);

          setError(null);


          const [
            categoryResponse,
            facultyResponse,
          ] =
            await Promise.all([
              getPublicFacultyCategories(),

              getPublicFacultyMembers(),
            ]);


          setCategories(
            sortPublicFacultyCategories(
              categoryResponse.items
            )
          );


          setFacultyMembers(
            facultyResponse.items
          );
        } catch (err) {
          console.error(
            "Faculty public API error:",
            err
          );


          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Faculty information."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );


  useEffect(() => {
    loadFacultyData();
  }, [
    loadFacultyData,
  ]);


  /* =======================================================
     FILTERED FACULTY
  ======================================================= */

  const filteredFaculty =
    useMemo(
      () => {
        if (
          activeCategory ===
          "all"
        ) {
          return facultyMembers;
        }


        return facultyMembers.filter(
          (
            faculty
          ) =>
            faculty.category
              .slug ===
            activeCategory
        );
      },
      [
        activeCategory,
        facultyMembers,
      ]
    );


  /* =======================================================
     RESPONSIVE CAROUSEL
  ======================================================= */

  const calculateCarousel =
    useCallback(
      () => {
        if (
          typeof window ===
          "undefined"
        ) {
          return;
        }


        let cards = 1;


        if (
          window.innerWidth >=
            640 &&
          window.innerWidth <
            1024
        ) {
          cards = 2;
        }


        setVisibleCards(
          cards
        );


        requestAnimationFrame(
          () => {
            const viewport =
              carouselViewportRef.current;


            if (!viewport) {
              return;
            }


            const availableWidth =
              viewport.clientWidth;


            const calculatedWidth =
              (
                availableWidth -
                gap *
                  (
                    cards -
                    1
                  )
              ) /
              cards;


            setCardWidth(
              calculatedWidth
            );
          }
        );
      },
      []
    );


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
  }, [
    calculateCarousel,
  ]);


  /* =======================================================
     RECALCULATE AFTER API LOAD
  ======================================================= */

  useEffect(() => {
    if (loading) {
      return;
    }


    const timer =
      window.setTimeout(
        () => {
          calculateCarousel();
        },
        80
      );


    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    loading,
    facultyMembers.length,
    calculateCarousel,
  ]);


  /* =======================================================
     RESET SLIDER AFTER FILTER
  ======================================================= */

  useEffect(() => {
    setCurrentIndex(0);


    const timer =
      window.setTimeout(
        () => {
          calculateCarousel();
        },
        60
      );


    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    activeCategory,
    calculateCarousel,
  ]);


  /* =======================================================
     MAX INDEX
  ======================================================= */

  const maxIndex =
    Math.max(
      0,
      filteredFaculty.length -
        visibleCards
    );


  /* =======================================================
     KEEP CURRENT INDEX VALID
  ======================================================= */

  useEffect(() => {
    setCurrentIndex(
      (
        current
      ) =>
        Math.min(
          current,
          maxIndex
        )
    );
  }, [
    maxIndex,
  ]);


  /* =======================================================
     CAROUSEL CONTROLS
  ======================================================= */

  const nextSlide =
    () => {
      setCurrentIndex(
        (
          current
        ) =>
          Math.min(
            current + 1,
            maxIndex
          )
      );
    };


  const previousSlide =
    () => {
      setCurrentIndex(
        (
          current
        ) =>
          Math.max(
            current - 1,
            0
          )
      );
    };


  const handleDragEnd =
    (
      _:
        | MouseEvent
        | TouchEvent
        | PointerEvent,

      info:
        PanInfo
    ) => {
      if (
        info.offset.x <
        -45
      ) {
        nextSlide();
      }


      if (
        info.offset.x >
        45
      ) {
        previousSlide();
      }
    };


  /* =======================================================
     FILTER CLICK
  ======================================================= */

  const selectCategory =
    (
      category:
        ActiveCategory
    ) => {
      setActiveCategory(
        category
      );


      setCurrentIndex(
        0
      );


      requestAnimationFrame(
        () => {
          const container =
            filterContainerRef.current;


          const button =
            filterButtonRefs.current[
              category
            ];


          if (
            !container ||
            !button
          ) {
            return;
          }


          const target =
            button.offsetLeft +
            button.offsetWidth /
              2 -
            container.clientWidth /
              2;


          container.scrollTo({
            left:
              Math.max(
                0,
                target
              ),

            behavior:
              "smooth",
          });
        }
      );
    };


  /* =======================================================
     UI
  ======================================================= */

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

      {/* ===================================================
          BACKGROUND
      =================================================== */}

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


      {/* ===================================================
          HEADER
      =================================================== */}

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

            pt-3

            font-primary

            text-[27px]
            font-semibold

            leading-[1.06]

            tracking-[-0.6px]

            text-[#161616]

            sm:text-[31px]

            md:text-[33px]

            lg:text-[35px]
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

            pt-3

            font-secondary

            text-[10px]

            leading-[1.5]

            text-[#848484]

            sm:text-[12px]
          "
        >
          Dedicated educators nurturing knowledge,
          character, and confidence in every Rosarian.
        </motion.p>
      </motion.div>


      {/* ===================================================
          LOADING
      =================================================== */}

      {loading && (
        <div
          className="
            relative
            z-10

            mx-auto

            mt-[45px]

            flex
            min-h-[240px]

            w-full
            max-w-[1180px]

            flex-col
            items-center
            justify-center
          "
        >
          <LoadingIcon />

          <p
            className="
              mt-[12px]

              font-secondary

              text-[10px]

              text-[#848484]
            "
          >
            Loading Faculty...
          </p>
        </div>
      )}


      {/* ===================================================
          ERROR
      =================================================== */}

      {!loading &&
        error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              relative
              z-10

              mx-auto

              mt-[42px]

              w-[calc(100%-36px)]
              max-w-[520px]

              rounded-[14px]

              border
              border-red-100

              bg-white

              px-[24px]
              py-[34px]

              text-center

              shadow-[0_12px_35px_rgba(25,45,70,0.05)]
            "
          >
            <p
              className="
                font-secondary

                text-[10px]

                leading-[1.6]

                text-red-600
              "
            >
              {error}
            </p>


            <button
              type="button"
              onClick={
                loadFacultyData
              }
              className="
                mt-[15px]

                rounded-full

                bg-[#0075FF]

                px-[16px]
                py-[8px]

                font-secondary

                text-[9px]
                font-medium

                text-white
              "
            >
              Try Again
            </button>
          </motion.div>
        )}


      {/* ===================================================
          API CONTENT
      =================================================== */}

      {!loading &&
        !error && (
          <>

            {/* =============================================
                FILTERS
            ============================================= */}

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
                ref={
                  filterContainerRef
                }
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

                  {/* ALL FACULTY */}

                  <motion.button
                    ref={(
                      element
                    ) => {
                      filterButtonRefs.current[
                        "all"
                      ] =
                        element;
                    }}
                    type="button"
                    onClick={() =>
                      selectCategory(
                        "all"
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
                        activeCategory ===
                        "all"
                          ? "#0075FF"
                          : "#FFFFFF",

                      borderColor:
                        activeCategory ===
                        "all"
                          ? "#0075FF"
                          : "#DED8CF",

                      color:
                        activeCategory ===
                        "all"
                          ? "#FFFFFF"
                          : "#555555",

                      boxShadow:
                        activeCategory ===
                        "all"
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
                    All Faculty
                  </motion.button>


                  {/* DYNAMIC CATEGORIES */}

                  {categories.map(
                    (
                      category
                    ) => {
                      const active =
                        activeCategory ===
                        category.slug;


                      return (
                        <motion.button
                          key={
                            category.id
                          }
                          ref={(
                            element
                          ) => {
                            filterButtonRefs.current[
                              category.slug
                            ] =
                              element;
                          }}
                          type="button"
                          onClick={() =>
                            selectCategory(
                              category.slug
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
                          {
                            category.name
                          }
                        </motion.button>
                      );
                    }
                  )}
                </div>
              </div>
            </motion.div>


            {/* =============================================
                NO FACULTY DATA
            ============================================= */}

            {facultyMembers.length ===
            0 ? (
              <EmptyFacultyState />
            ) : filteredFaculty.length ===
              0 ? (
              <EmptyCategoryState />
            ) : (
              <>

                {/* =========================================
                    MOBILE + TABLET CAROUSEL
                ========================================= */}

                <AnimatePresence
                  mode="wait"
                >
                  <motion.div
                    key={
                      activeCategory
                    }
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
                        ref={
                          carouselViewportRef
                        }
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
                          dragElastic={
                            0.07
                          }
                          onDragEnd={
                            handleDragEnd
                          }
                          animate={{
                            x:
                              -currentIndex *
                              (
                                cardWidth +
                                gap
                              ),
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
                                key={
                                  faculty.id
                                }
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
                                  index={
                                    index
                                  }
                                />
                              </div>
                            )
                          )}
                        </motion.div>
                      </div>
                    </div>


                    {/* CONTROLS */}

                    {maxIndex >
                      0 && (
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

                        <div
                          className="
                            flex
                            items-center

                            gap-[7px]
                          "
                        >
                          {Array.from({
                            length:
                              maxIndex +
                              1,
                          }).map(
                            (
                              _,
                              index
                            ) => (
                              <motion.button
                                key={
                                  index
                                }
                                type="button"
                                aria-label={`Go to slide ${
                                  index +
                                  1
                                }`}
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
                                  duration:
                                    0.3,

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

                        <div
                          className="
                            flex
                            items-center

                            gap-[8px]
                          "
                        >
                          <motion.button
                            type="button"
                            aria-label="Previous Faculty"
                            onClick={
                              previousSlide
                            }
                            disabled={
                              currentIndex ===
                              0
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
                            aria-label="Next Faculty"
                            onClick={
                              nextSlide
                            }
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


                {/* =========================================
                    DESKTOP GRID
                ========================================= */}

                <AnimatePresence
                  mode="wait"
                >
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
                          index={
                            index
                          }
                        />
                      )
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </>
        )}
    </section>
  );
}


/* =========================================================
   EMPTY FACULTY STATE
========================================================= */

function EmptyFacultyState() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        relative
        z-10

        mx-auto

        mt-[45px]

        max-w-[520px]

        px-[20px]

        text-center
      "
    >
      <div
        className="
          rounded-[14px]

          border
          border-[#E5E0D7]

          bg-white

          px-[24px]
          py-[40px]

          shadow-[0_12px_35px_rgba(25,45,70,0.05)]
        "
      >
        <p
          className="
            font-primary

            text-[16px]
            font-semibold

            text-[#151515]
          "
        >
          Faculty details
          will be available
          soon.
        </p>


        <p
          className="
            mx-auto

            mt-[7px]

            max-w-[330px]

            font-secondary

            text-[10px]

            leading-[1.6]

            text-[#848484]
          "
        >
          Our Faculty
          information is
          currently being
          updated.
        </p>
      </div>
    </motion.div>
  );
}


/* =========================================================
   EMPTY CATEGORY STATE
========================================================= */

function EmptyCategoryState() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        relative
        z-10

        mx-auto

        mt-[45px]

        max-w-[520px]

        px-[20px]

        text-center
      "
    >
      <div
        className="
          rounded-[14px]

          border
          border-[#E5E0D7]

          bg-white

          px-[24px]
          py-[38px]

          shadow-[0_12px_35px_rgba(25,45,70,0.05)]
        "
      >
        <p
          className="
            font-primary

            text-[15px]
            font-semibold

            text-[#151515]
          "
        >
          No Faculty members
          in this category.
        </p>
      </div>
    </motion.div>
  );
}