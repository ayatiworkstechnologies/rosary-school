"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    ChevronRight,
    Globe2,
    HandHeart,
    HeartHandshake,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type TabType = "spot" | "eminent";

type Alumni = {
    id: number;
    name: string;
    image: string;
    paragraphs: string[];
};

type AlumniSlide = {
    image: string;
    title: string;
    subtitle: string;
};

/* =========================================================
   ALUMNI SPOT SLIDES
========================================================= */

const alumniSlides: AlumniSlide[] = [
    {
        image: "/images/alumni-spot-1.png",
        title: "Once a Rosarian, Always a Rosarian!",
        subtitle:
            "Welcome home. Welcome to where it all began.",
    },
    {
        image: "/images/alumni-spot-2.png",
        title: "Together Through Every Generation",
        subtitle:
            "Celebrating memories, achievements and lifelong Rosarian bonds.",
    },
];

/* =========================================================
   EMINENT ALUMNI DATA
========================================================= */

const alumniData: Alumni[] = [
    {
        id: 1,
        name: "Chandrika K. Raman Murthy",
        image: "/images/al-1.png",
        paragraphs: [
            "Chandrika K. Raman Murthy (Batch 1976), with expertise in communications, began her career at Cycle Corporation of India in 1982 after earning an MA and PG in Corporate Communications.",
            "She held pioneering roles at RPG Cellular and HMV, collaborating with M.S. Subbulakshmi, and served as Head of Communications at Airtel and Protocol Officer to Tamil Nadu’s CM.",
            "She managed Tamil Nadu’s foreign investments, later leading communications at Murugappa Group, crediting mentors for shaping her distinguished corporate and public-sector journey.",
        ],
    },
    {
        id: 2,
        name: "Sumithra Ravichandran",
        image: "/images/al-2.png",
        paragraphs: [
            "Sumithra Ravichandran is a Fellow Chartered Accountant and Partner at M/s N.C. Rajagopal & Co., with expertise in taxation and auditing.",
            "She has represented clients before the Income Tax Department and Appellate Tribunal, and signed balance sheets for major banks, including RBI.",
            "She previously served as an Independent Director at REPCO Home Finance Ltd and held leadership roles in Rotary International.",
        ],
    },
    {
        id: 3,
        name: "Dr. Shivi S. Sivanantham",
        image: "/images/al-3.png",
        paragraphs: [
            "Dr. Shivi S. Sivanantham is a gastroenterologist and Assistant Professor specializing in Crohn’s disease, ulcerative colitis, and general gastroenterology.",
            "She trained globally, earned her MD in 1997, and completed an IBD fellowship at the University of Chicago in 2016.",
            "Her research focuses on IBD care, nutrition, and intestinal ultrasound; she is active with leading gastroenterology foundations and associations.",
        ],
    },
    {
        id: 4,
        name: "Pushpa Kandaswamy",
        image: "/images/al-4.png",
        paragraphs: [
            "Pushpa Kandaswamy, of the 1976 batch, is a National Award-winning film and TV producer and creative head of Kavithalayaa, with over 50 films and 1000+ hours of TV content.",
            "She secured top academic honors and pioneered film education through industry-academia ties with IIMs and ISB.",
            "A trailblazer in Indian cinema, she served on the CBFC and received multiple awards for her leadership in a traditionally male-dominated field.",
        ],
    },
    {
        id: 5,
        name: "Smt. Revathi Ramachandran",
        image: "/images/al-5.png",
        paragraphs: [
            "Smt. Revathi Ramachandran (1976 batch) holds master’s degrees in Economics and Fine Arts and is a renowned Bharatanatyam dancer, teacher, and choreographer.",
            "She formerly directed Kalakshetra and now serves as Director of Nada Gurukulam at Sri Sathya Sai University.",
            "A recipient of the Kalaimamani Award, she has made significant contributions to classical dance and education.",
        ],
    },
    {
        id: 6,
        name: "Dr. Maheswari Natarajan",
        image: "/images/al-6.png",
        paragraphs: [
            "Dr. Maheswari Natarajan (1976 batch) is an educationist with multiple degrees, including M.A.s in Psychology and Education, and a D.Litt.",
            "She founded a CBSE school, initiated India–Singapore twinning, and trained educators as a Master Trainer for CBSE and UNESCO.",
            "Author of textbooks and articles, she was felicitated by Dr. APJ Abdul Kalam and currently serves as Director of Agurchand Manmull Jain School.",
        ],
    },
    {
        id: 7,
        name: "Dr. Malika Hakim Haque",
        image: "/images/al-7.png",
        paragraphs: [
            "Dr. Malika Hakim Haque, MD, is a pediatrician with more than 50 years of experience. A gold medalist from Madras Medical College and Stella Maris College, she is a Clinical Professor at The Ohio State University.",
            "Founder of Noor Community Free Clinic in Ohio, she holds three patents for antiviral treatments.",
            "She received the Medal of Merit from President Reagan and has been honored for lifelong service to underserved communities.",
        ],
    },
    {
        id: 8,
        name: "Shyamala Lakshmanan",
        image: "/images/al-8.png",
        paragraphs: [
            "Batch Year: 1987. She completed her B.Com and M.Com from Meenakshi College.",
            "She moved to Texas, USA in 1997, worked as a Montessori teacher and tax consultant, and returned to Chennai in 2012 to care for her aging parents.",
            "She founded Lochani Home Care in 2024, offering elder-care support including staff, attendants, doctor contacts, and emotional support.",
            "She has also worked as a dubbing artist and actor in recent years.",
        ],
    },
    {
        id: 9,
        name: "Srinidhi Srinath",
        image: "/images/al-9.png",
        paragraphs: [
            "Batch of 2013. She achieved State Rank 4 in Class XII and State Rank 24 in Class X.",
            "She holds an MBA from the Indian Institute of Management (IIM), Lucknow and is a qualified Chartered Accountant (CA) and Company Secretary (CS).",
            "She previously worked at Investec India in the Venture Advisory division, advising early-stage companies across Consumer, SaaS, and Fintech sectors.",
            "She is currently an investment professional at Evolvence Equity Partners, a Middle Eastern-based Private Equity platform.",
        ],
    },
    {
        id: 10,
        name: "Justice Prabha Sridevan",
        image: "/images/al-10.png",
        paragraphs: [
            "Justice Prabha Sridevan (Retd.), Batch of 1963, served as Judge of the Madras High Court from 2000 to 2010.",
            "Former Chairperson of the Intellectual Property Appellate Board and contributor to the Think Tank on India’s IPR Policy, she has been recognized among the 50 most influential figures in global intellectual property.",
            "She received The Hindu Lifetime Achievement Award in 2025 and the Tamil Nadu Government’s Sirantha Mozhipeyarpalar Virudhu in 2023.",
            "A noted translator of 15 books, she also received the University of Chennai Award in 2010.",
        ],
    },
];

/* =========================================================
   GOALS
========================================================= */

const goals = [
    {
        title: "Global Connection",
        description:
            "To build a comprehensive database and online community to connect Rosary Alumni worldwide, celebrating the values of truth and charity.",
        icon: Globe2,
    },
    {
        title: "Philanthropy",
        description:
            "To organize and support initiatives that benefit the school and society, including infrastructure development and educational support.",
        icon: HandHeart,
    },
    {
        title: "Kinship and Support",
        description:
            "To foster mutual support, mentorship, networking opportunities, learning, career development, and community-building activities.",
        icon: HeartHandshake,
    },
];

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 24,
    },

    visible: {
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.65,
            ease,
        },
    },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AlumniSection() {
    const [activeTab, setActiveTab] =
        useState<TabType>("spot");

    const [activeAlumni, setActiveAlumni] =
        useState<Alumni>(alumniData[0]);

    return (
        <main className="w-full overflow-x-clip bg-white">

            {/* =====================================================
          TOP TAB
      ===================================================== */}

            <div className="relative z-30 bg-white py-5 sm:py-6">

                <div className="mx-auto flex max-w-[1280px] justify-center px-4">

                    <div className="inline-flex items-center justify-center gap-2">

                        {/* ALUMNI SPOT */}

                        <button
                            type="button"
                            onClick={() => setActiveTab("spot")}
                            className={`
                flex
                min-h-[34px]
                items-center
                justify-center
                rounded-full
                px-4
                py-2
                text-[11px]
                font-medium
                transition-all
                duration-300

                sm:min-h-[36px]
                sm:px-5
                sm:text-[12px]

                ${activeTab === "spot"
                                    ? `
                      bg-[#0075FF]
                      text-white
                      shadow-[0_6px_18px_rgba(0,117,255,0.22)]
                    `
                                    : `
                      text-[#0075FF]
                      hover:bg-[#F2F8FF]
                    `
                                }
              `}
                        >
                            Alumni Spot
                        </button>

                        {/* DIVIDER */}

                        <div className="h-[24px] w-px bg-[#BDD7F4] sm:h-[27px]" />

                        {/* EMINENT */}

                        <button
                            type="button"
                            onClick={() => setActiveTab("eminent")}
                            className={`
                flex
                min-h-[34px]
                items-center
                justify-center
                rounded-full
                px-4
                py-2
                text-[11px]
                font-medium
                transition-all
                duration-300

                sm:min-h-[36px]
                sm:px-5
                sm:text-[12px]

                ${activeTab === "eminent"
                                    ? `
                      bg-[#0075FF]
                      text-white
                      shadow-[0_6px_18px_rgba(0,117,255,0.22)]
                    `
                                    : `
                      text-[#0075FF]
                      hover:bg-[#F2F8FF]
                    `
                                }
              `}
                        >
                            Eminent Alumni
                        </button>

                    </div>

                </div>

            </div>

            {/* =====================================================
          TAB CONTENT
      ===================================================== */}

            <AnimatePresence mode="wait">

                {activeTab === "spot" ? (
                    <AlumniSpot key="spot" />
                ) : (
                    <EminentAlumni
                        key="eminent"
                        activeAlumni={activeAlumni}
                        setActiveAlumni={setActiveAlumni}
                    />
                )}

            </AnimatePresence>

        </main>
    );
}

/* =========================================================
   ALUMNI SPOT
========================================================= */

function AlumniSpot() {

    /* =========================================================
       SLIDER STATE
    ========================================================= */

    const [currentSlide, setCurrentSlide] =
        useState(0);

    const [direction, setDirection] =
        useState(1);

    const [isHovering, setIsHovering] =
        useState(false);

    /* =========================================================
       NEXT SLIDE
    ========================================================= */

    const nextSlide = useCallback(() => {
        setDirection(1);

        setCurrentSlide((prev) =>
            prev === alumniSlides.length - 1
                ? 0
                : prev + 1
        );
    }, []);

    /* =========================================================
       PREVIOUS
    ========================================================= */

    const previousSlide = useCallback(() => {
        setDirection(-1);

        setCurrentSlide((prev) =>
            prev === 0
                ? alumniSlides.length - 1
                : prev - 1
        );
    }, []);

    /* =========================================================
       AUTO PLAY
    ========================================================= */

    useEffect(() => {

        if (isHovering) {
            return;
        }

        const timer = window.setInterval(
            () => {
                nextSlide();
            },
            4000
        );

        return () => {
            window.clearInterval(timer);
        };

    }, [
        currentSlide,
        isHovering,
        nextSlide,
    ]);

    /* =========================================================
       SLIDER ANIMATION
    ========================================================= */

    const slideVariants = {
        enter: (direction: number) => ({
            x:
                direction > 0
                    ? "12%"
                    : "-12%",
            opacity: 0,
            scale: 1.03,
        }),

        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },

        exit: (direction: number) => ({
            x:
                direction > 0
                    ? "-10%"
                    : "10%",
            opacity: 0,
            scale: 1.01,
        }),
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
            }}
            transition={{
                duration: 0.35,
            }}
        >

            {/* =====================================================
          FIRST SECTION
      ===================================================== */}

            <section className="relative">

                {/* ===================================================
            BACKGROUND IMAGE
        =================================================== */}

                <div
                    className="
            pointer-events-none
            absolute
            inset-0
            bg-cover
            bg-center
            bg-no-repeat
          "
                    style={{
                        backgroundImage:
                            "url('/images/academics-bg.png')",
                    }}
                />

                {/* <div className="pointer-events-none absolute inset-0 bg-white/72" /> */}

                {/* ===================================================
            CONTENT
        =================================================== */}

                <div
                    className="
            relative
            z-10
            mx-auto
            grid
            max-w-[1280px]
            items-center
            gap-10

            px-5
            pb-16
            pt-12

            sm:px-7
            sm:pb-20
            sm:pt-14

            md:px-10
            md:py-20

            lg:grid-cols-[0.95fr_1.05fr]
            lg:gap-16
            lg:py-24

            xl:px-6
          "
                >

                    {/* =================================================
              LEFT
          ================================================= */}

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.15,
                        }}
                        className="order-2 lg:order-1"
                    >

                        <p
                            className="
                mb-4
                text-[10px]
                font-bold
                uppercase
                tracking-[0.23em]
                text-[#0075FF]
              "
                        >
                            FMM Sisters
                        </p>

                        <h1
                            className="
                max-w-[600px]

                text-[30px]
                font-semibold
                leading-[1.13]
                tracking-[-0.035em]

                text-[#111827]

                sm:text-[36px]
                md:text-[42px]
                lg:text-[46px]
              "
                        >
                            Welcome to the Rosarian Alumni Spot!
                        </h1>

                        <div
                            className="
                mt-6
                max-w-[620px]
                space-y-3

                text-[14px]
                leading-[1.8]
                text-[#59677A]

                sm:text-[15px]
              "
                        >

                            <p>
                                Founded in 1950 by the dedicated and visionary
                                FMM Sisters, Rosary Matriculation Higher
                                Secondary School has proudly upheld a tradition
                                of excellence for over 75 glorious years.
                            </p>

                            <p>
                                Rooted in the values of discipline, compassion,
                                integrity, and holistic education, Rosary has
                                nurtured generations of students, equipping them
                                to succeed both personally and professionally.
                            </p>

                            <p>
                                Throughout its remarkable journey, Rosary has
                                produced distinguished alumni who have made their
                                mark across diverse fields — from doctors,
                                lawyers, auditors, artists, engineers,
                                entrepreneurs, teachers, and community leaders.
                            </p>

                            <p>
                                This portal is a celebration of our shared
                                history, achievements, and lifelong bonds formed
                                within the walls of Rosary. It is a space to
                                reconnect, reminisce, and continue building a
                                vibrant and inspiring alumni community.
                            </p>

                        </div>

                    </motion.div>

                    {/* =================================================
              RIGHT IMAGE SLIDER
          ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 30,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: 0.75,
                            ease,
                        }}
                        className="
              order-1
              mx-auto
              w-full
              max-w-[610px]

              lg:order-2
            "
                    >

                        <div
                            className="relative"
                            onMouseEnter={() =>
                                setIsHovering(true)
                            }
                            onMouseLeave={() =>
                                setIsHovering(false)
                            }
                        >

                            {/* =============================================
                  SLIDER IMAGE CONTAINER
              ============================================= */}

                            <div
                                className="
                  group
                  relative

                  aspect-[1.20/1]

                  overflow-hidden

                  rounded-[18px]

                  bg-[#EAF2FA]

                  shadow-[0_22px_60px_rgba(26,68,110,0.10)]

                  sm:aspect-[1.32/1]

                  lg:aspect-[1.25/1]
                "
                            >

                                <AnimatePresence
                                    initial={false}
                                    custom={direction}
                                    mode="popLayout"
                                >

                                    <motion.img
                                        key={currentSlide}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: {
                                                duration: 0.7,
                                                ease,
                                            },
                                            opacity: {
                                                duration: 0.45,
                                            },
                                            scale: {
                                                duration: 0.8,
                                                ease,
                                            },
                                        }}
                                        src={
                                            alumniSlides[
                                                currentSlide
                                            ].image
                                        }
                                        alt={
                                            alumniSlides[
                                                currentSlide
                                            ].title
                                        }
                                        className="
                      absolute
                      inset-0

                      block

                      h-full
                      w-full

                      object-cover
                      object-center
                    "
                                    />

                                </AnimatePresence>

                                {/* Soft gradient */}

                                <div
                                    className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-0
                    z-10

                    h-[30%]

                    bg-gradient-to-t
                    from-black/20
                    to-transparent
                  "
                                />

                                {/* =============================================
                    PREV BUTTON
                ============================================= */}

                                <button
                                    type="button"
                                    aria-label="Previous slide"
                                    onClick={previousSlide}
                                    className="
                    absolute
                    left-3
                    top-1/2
                    z-20

                    hidden
                    h-[42px]
                    w-[42px]

                    -translate-y-1/2

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-white/50

                    bg-white/90

                    text-[#0075FF]

                    opacity-0

                    shadow-[0_8px_25px_rgba(0,0,0,0.10)]

                    backdrop-blur-md

                    transition-all
                    duration-300

                    hover:bg-[#0075FF]
                    hover:text-white

                    group-hover:opacity-100

                    sm:flex
                  "
                                >
                                    <ArrowLeft size={18} />
                                </button>

                                {/* =============================================
                    NEXT BUTTON
                ============================================= */}

                                <button
                                    type="button"
                                    aria-label="Next slide"
                                    onClick={nextSlide}
                                    className="
                    absolute
                    right-3
                    top-1/2
                    z-20

                    hidden
                    h-[42px]
                    w-[42px]

                    -translate-y-1/2

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-white/50

                    bg-white/90

                    text-[#0075FF]

                    opacity-0

                    shadow-[0_8px_25px_rgba(0,0,0,0.10)]

                    backdrop-blur-md

                    transition-all
                    duration-300

                    hover:bg-[#0075FF]
                    hover:text-white

                    group-hover:opacity-100

                    sm:flex
                  "
                                >
                                    <ArrowRight size={18} />
                                </button>

                                {/* =============================================
                    DOT INDICATORS
                ============================================= */}

                                <div
                                    className="
                    absolute
                    bottom-5
                    left-1/2
                    z-30

                    flex
                    -translate-x-1/2

                    items-center
                    gap-2
                  "
                                >

                                    {alumniSlides.map(
                                        (_, index) => {

                                            const active =
                                                currentSlide ===
                                                index;

                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    aria-label={`Go to slide ${index + 1
                                                        }`}
                                                    onClick={() => {
                                                        setDirection(
                                                            index >
                                                                currentSlide
                                                                ? 1
                                                                : -1
                                                        );

                                                        setCurrentSlide(
                                                            index
                                                        );
                                                    }}
                                                    className={`
                            relative
                            h-[7px]

                            overflow-hidden

                            rounded-full

                            transition-all
                            duration-500

                            ${active
                                                            ? `
                                  w-[34px]
                                  bg-white
                                `
                                                            : `
                                  w-[7px]
                                  bg-white/60

                                  hover:bg-white
                                `
                                                        }
                          `}
                                                >
                                                    {active && (
                                                        <motion.span
                                                            key={`progress-${currentSlide}`}
                                                            initial={{
                                                                scaleX: 0,
                                                            }}
                                                            animate={{
                                                                scaleX: 1,
                                                            }}
                                                            transition={{
                                                                duration: 4,
                                                                ease: "linear",
                                                            }}
                                                            className="
                                absolute
                                inset-0

                                origin-left

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

                            </div>

                            {/* =============================================
                  CAPTION
              ============================================= */}

                            <AnimatePresence mode="wait">

                                <motion.div
                                    key={`caption-${currentSlide}`}
                                    initial={{
                                        opacity: 0,
                                        y: 15,
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
                    z-20

                    -mt-7

                    ml-auto
                    mr-3

                    w-[92%]

                    rounded-[12px]

                    border
                    border-[#E5ECF3]

                    bg-white/95

                    px-4
                    py-3

                    shadow-[0_16px_38px_rgba(18,58,96,0.11)]

                    backdrop-blur-md

                    sm:mr-5
                    sm:w-[76%]
                    sm:px-5
                    sm:py-4

                    lg:w-[72%]
                  "
                                >

                                    <p
                                        className="
                      text-[9px]
                      font-bold
                      uppercase

                      tracking-[0.17em]

                      text-[#0075FF]

                      sm:text-[10px]
                    "
                                    >
                                        {
                                            alumniSlides[
                                                currentSlide
                                            ].title
                                        }
                                    </p>

                                    <p
                                        className="
                      mt-1

                      text-[11px]
                      leading-5

                      text-[#758195]

                      sm:text-[12px]
                    "
                                    >
                                        {
                                            alumniSlides[
                                                currentSlide
                                            ].subtitle
                                        }
                                    </p>

                                </motion.div>

                            </AnimatePresence>

                        </div>

                    </motion.div>

                </div>

            </section>

            {/* =====================================================
          GOALS
      ===================================================== */}

            <section className="bg-white py-16 sm:py-20 lg:py-24">

                <div
                    className="
            mx-auto
            max-w-[1280px]

            px-5
            sm:px-7
            md:px-10
            xl:px-6
          "
                >

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                        }}
                        className="
              mx-auto
              max-w-[700px]

              text-center
            "
                    >

                        <p
                            className="
                text-[10px]
                font-bold
                uppercase

                tracking-[0.23em]

                text-[#0075FF]
              "
                        >
                            Goals
                        </p>

                        <h2
                            className="
                mt-3

                text-[27px]
                font-semibold

                tracking-[-0.03em]

                text-[#111827]

                sm:text-[34px]
                lg:text-[38px]
              "
                        >
                            Our Alumni Charter or Goals
                        </h2>

                        <p
                            className="
                mx-auto
                mt-3
                max-w-[580px]

                text-[13px]
                leading-6

                text-[#798698]

                sm:text-[14px]
              "
                        >
                            Connecting Rosarians across generations
                            through purpose, service, and lifelong
                            relationships.
                        </p>

                    </motion.div>

                    <div
                        className="
              mt-10

              grid
              gap-5

              md:grid-cols-2

              lg:grid-cols-3
              lg:gap-6
            "
                    >

                        {goals.map((goal, index) => {

                            const Icon = goal.icon;

                            return (
                                <motion.div
                                    key={goal.title}
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
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.08,
                                        ease,
                                    }}
                                    whileHover={{
                                        y: -6,
                                    }}
                                    className="
                    group
                    relative

                    flex
                    min-h-[230px]

                    flex-col
                    items-center
                    justify-center

                    overflow-hidden

                    rounded-[16px]

                    border
                    border-[#B9D8FF]

                    bg-white

                    px-7
                    py-8

                    text-center

                    transition-shadow
                    duration-300

                    hover:shadow-[0_20px_55px_rgba(0,117,255,0.09)]
                  "
                                >

                                    <div
                                        className="
                      flex
                      h-[54px]
                      w-[54px]

                      items-center
                      justify-center

                      rounded-full

                      bg-[#EAF4FF]

                      transition-all
                      duration-300

                      group-hover:bg-[#0075FF]
                    "
                                    >

                                        <Icon
                                            size={23}
                                            strokeWidth={1.8}
                                            className="
                        text-[#0075FF]

                        transition-colors
                        duration-300

                        group-hover:text-white
                      "
                                        />

                                    </div>

                                    <h3
                                        className="
                      mt-5

                      text-[17px]
                      font-semibold

                      text-[#111827]
                    "
                                    >
                                        {goal.title}
                                    </h3>

                                    <p
                                        className="
                      mt-3
                      max-w-[310px]

                      text-[13px]
                      leading-[1.75]

                      text-[#738094]
                    "
                                    >
                                        {goal.description}
                                    </p>

                                </motion.div>
                            );
                        })}

                    </div>

                </div>

            </section>

            {/* =====================================================
          JOIN
      ===================================================== */}

            <section className="pb-24 pt-2">

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                    }}
                    className="
            mx-auto
            max-w-[720px]

            px-5

            text-center
          "
                >

                    <p
                        className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.23em]

              text-[#0075FF]
            "
                    >
                        Get Involved
                    </p>

                    <h2
                        className="
              mt-3

              text-[28px]
              font-semibold

              tracking-[-0.03em]

              text-[#111827]

              sm:text-[34px]
            "
                    >
                        Join Us
                    </h2>

                    <p
                        className="
              mx-auto
              mt-3
              max-w-[670px]

              text-[14px]
              leading-6

              text-[#7B8798]
            "
                    >
                        Become part of the Rosary Alumni community
                        to shape the future of our alma mater and
                        beyond.
                    </p>

                    <motion.a
                        href="#alumni-form"
                        whileHover={{
                            y: -2,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                        className="
    mt-7
    inline-flex
    h-[46px]
    items-center
    justify-center
    gap-2
    rounded-[8px]
    bg-[#0075FF]
    px-6
    text-[13px]
    font-medium
    !text-white
    cursor-pointer
    shadow-[0_12px_30px_rgba(0,117,255,0.22)]
  "
                    >
                        Join Alumni Community
                        <ArrowUpRight size={16} />
                    </motion.a>

                </motion.div>

            </section>

        </motion.div>
    );
}

/* =========================================================
   EMINENT ALUMNI
========================================================= */

function EminentAlumni({
    activeAlumni,
    setActiveAlumni,
}: {
    activeAlumni: Alumni;
    setActiveAlumni: (alumni: Alumni) => void;
}) {

    const profileRef =
        useRef<HTMLDivElement | null>(null);

    const mobileScrollerRef =
        useRef<HTMLDivElement | null>(null);

    const mobileButtonRefs =
        useRef<
            Record<number, HTMLButtonElement | null>
        >({});

    /* =========================================================
       CENTER MOBILE BUTTON
    ========================================================= */

    const centerMobileButton =
        useCallback((id: number) => {

            const scroller =
                mobileScrollerRef.current;

            const button =
                mobileButtonRefs.current[id];

            if (!scroller || !button) return;

            const buttonCenter =
                button.offsetLeft +
                button.offsetWidth / 2;

            const containerCenter =
                scroller.clientWidth / 2;

            let left =
                buttonCenter -
                containerCenter;

            const max =
                scroller.scrollWidth -
                scroller.clientWidth;

            left = Math.max(
                0,
                Math.min(left, max)
            );

            scroller.scrollTo({
                left,
                behavior: "smooth",
            });

        }, []);

    /* =========================================================
       SELECT
    ========================================================= */

    const handleSelect = (
        alumni: Alumni
    ) => {

        setActiveAlumni(alumni);

        requestAnimationFrame(() => {
            centerMobileButton(
                alumni.id
            );
        });

        if (
            typeof window !==
            "undefined" &&
            window.innerWidth < 1024
        ) {

            window.setTimeout(() => {

                const profile =
                    profileRef.current;

                if (!profile) return;

                const top =
                    window.scrollY +
                    profile
                        .getBoundingClientRect()
                        .top -
                    90;

                window.scrollTo({
                    top,
                    behavior: "smooth",
                });

            }, 140);

        }
    };

    return (
        <motion.section
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
            }}
            transition={{
                duration: 0.35,
            }}
            className="
        relative

        bg-[#F7F9FC]

        pb-20
        pt-10

        md:pt-14

        lg:pb-28
        lg:pt-16
      "
        >

            {/* BACKGROUND */}

            <div
                className="
          pointer-events-none
          absolute
          inset-0

          bg-cover
          bg-center

          opacity-[0.36]
        "
                style={{
                    backgroundImage:
                        "url('/images/academics-bg.png')",
                }}
            />

            <div
                className="
          relative
          z-10

          mx-auto
          max-w-[1280px]

          px-4
          sm:px-6
          md:px-8
          lg:px-10
          xl:px-6
        "
            >

                {/* HEADING */}

                <div className="mx-auto max-w-[700px] text-center">

                    <p
                        className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.22em]

              text-[#0075FF]
            "
                    >
                        Celebrating Excellence
                    </p>

                    <h1
                        className="
              mt-3

              text-[28px]
              font-semibold
              uppercase

              tracking-[-0.035em]

              text-[#111827]

              sm:text-[34px]
              md:text-[38px]
              lg:text-[40px]
            "
                    >
                        Eminent Alumni
                    </h1>

                    <p
                        className="
              mt-3

              text-[13px]
              font-medium

              text-[#0075FF]

              sm:text-[15px]
            "
                    >
                        Once a Rosarian, Always a Rosarian!
                    </p>

                </div>

                {/* ===================================================
            MOBILE NAMES
        =================================================== */}

                <div className="mt-8 lg:hidden">

                    <div
                        ref={mobileScrollerRef}
                        className="
              overflow-x-auto
              overflow-y-hidden

              pb-3

              [scrollbar-width:none]

              [&::-webkit-scrollbar]:hidden
            "
                    >

                        <div className="flex w-max gap-2 px-1">

                            {alumniData.map((alumni) => {

                                const selected =
                                    alumni.id ===
                                    activeAlumni.id;

                                return (
                                    <button
                                        key={alumni.id}
                                        ref={(el) => {
                                            mobileButtonRefs.current[
                                                alumni.id
                                            ] = el;
                                        }}
                                        onClick={() =>
                                            handleSelect(alumni)
                                        }
                                        className={`
                      h-[46px]

                      shrink-0

                      whitespace-nowrap

                      rounded-full

                      border

                      px-5

                      text-[13px]
                      font-medium

                      transition-all

                      ${selected
                                                ? `
                            border-[#0075FF]
                            bg-[#0075FF]
                            text-white
                          `
                                                : `
                            border-[#D6E2EE]
                            bg-white
                            text-[#596B7F]
                          `
                                            }
                    `}
                                    >
                                        {alumni.name}
                                    </button>
                                );
                            })}

                        </div>

                    </div>

                </div>

                {/* ===================================================
            GRID
        =================================================== */}

                <div
                    className="
            mt-7

            grid
            items-start

            gap-7

            lg:mt-12
            lg:grid-cols-[300px_minmax(0,1fr)]
            lg:gap-8

            xl:grid-cols-[320px_minmax(0,1fr)]
            xl:gap-10
          "
                >

                    {/* LEFT */}

                    <aside className="hidden lg:block">

                        <div
                            className="
                sticky
                top-[165px]

                rounded-[16px]

                border
                border-[#DEE7F0]

                bg-white

                p-3

                shadow-[0_16px_45px_rgba(30,65,100,0.065)]
              "
                        >

                            <p
                                className="
                  px-3
                  pb-3
                  pt-2

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]

                  text-[#91A0B1]
                "
                            >
                                Select Alumni
                            </p>

                            {alumniData.map((alumni) => {

                                const selected =
                                    alumni.id ===
                                    activeAlumni.id;

                                return (
                                    <button
                                        key={alumni.id}
                                        onClick={() =>
                                            handleSelect(
                                                alumni
                                            )
                                        }
                                        className={`
                      group

                      mb-1

                      flex
                      w-full
                      items-center
                      justify-between

                      rounded-[9px]

                      px-4
                      py-3

                      text-left
                      text-[13px]
                      font-medium

                      transition-all

                      ${selected
                                                ? `
                            bg-[#0075FF]
                            text-white
                          `
                                                : `
                            text-[#344054]

                            hover:bg-[#F1F7FD]
                            hover:text-[#0075FF]
                          `
                                            }
                    `}
                                    >

                                        <span className="truncate">
                                            {alumni.name}
                                        </span>

                                        <ChevronRight
                                            size={15}
                                            className={
                                                selected
                                                    ? "opacity-100"
                                                    : "opacity-0 group-hover:opacity-100"
                                            }
                                        />

                                    </button>
                                );
                            })}

                        </div>

                    </aside>

                    {/* RIGHT */}

                    <div
                        ref={profileRef}
                        className="
              min-w-0

              lg:sticky
              lg:top-[165px]
            "
                    >

                        <AnimatePresence mode="wait">

                            <motion.div
                                key={activeAlumni.id}
                                initial={{
                                    opacity: 0,
                                    y: 15,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10,
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease,
                                }}
                                className="
                  relative

                  rounded-[18px]

                  border
                  border-[#DEE7F0]

                  bg-white

                  px-5
                  py-7

                  shadow-[0_18px_55px_rgba(30,65,100,0.07)]

                  sm:px-7
                  sm:py-8

                  lg:px-9
                  lg:py-9
                "
                            >

                                <div
                                    className="
                    absolute
                    left-0
                    top-0

                    h-[3px]
                    w-full

                    rounded-t-[18px]

                    bg-gradient-to-r
                    from-[#0075FF]
                    via-[#74B7FF]
                    to-transparent
                  "
                                />

                                <div
                                    className="
                    flex
                    flex-col

                    gap-7

                    md:flex-row
                    md:items-start
                    md:gap-8
                  "
                                >

                                    {/* IMAGE */}

                                    <div
                                        className="
                      mx-auto

                      h-[150px]
                      w-[150px]

                      shrink-0

                      overflow-hidden

                      rounded-[14px]

                      bg-[#EDF3F8]

                      md:mx-0
                    "
                                    >

                                        <img
                                            src={
                                                activeAlumni.image
                                            }
                                            alt={
                                                activeAlumni.name
                                            }
                                            className="
                        h-full
                        w-full

                        object-cover
                        object-center
                      "
                                        />

                                    </div>

                                    {/* TEXT */}

                                    <div className="min-w-0 flex-1">

                                        <span
                                            className="
                        inline-flex

                        rounded-full

                        bg-[#EAF4FF]

                        px-3
                        py-[6px]

                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.17em]

                        text-[#0075FF]
                      "
                                        >
                                            Eminent Alumni
                                        </span>

                                        <h2
                                            className="
                        mt-3

                        text-[23px]
                        font-semibold

                        tracking-[-0.03em]

                        text-[#111827]

                        sm:text-[27px]
                      "
                                        >
                                            {activeAlumni.name}
                                        </h2>

                                        <div
                                            className="
                        mt-4

                        h-[2px]
                        w-[36px]

                        bg-[#0075FF]
                      "
                                        />

                                        <div
                                            className="
                        mt-5

                        space-y-3

                        text-[13px]
                        leading-[1.8]

                        text-[#647286]

                        sm:text-[14px]
                      "
                                        >

                                            {activeAlumni.paragraphs.map(
                                                (
                                                    paragraph,
                                                    index
                                                ) => (
                                                    <p
                                                        key={index}
                                                    >
                                                        {
                                                            paragraph
                                                        }
                                                    </p>
                                                )
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </motion.div>

                        </AnimatePresence>

                    </div>

                </div>

            </div>

        </motion.section>
    );
}