"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   TYPES
========================================================= */

type Club = {
  id: number;
  title: string;
  icon: string;
  shortDescription: string;
  content: ReactNode;
};

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.11,
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
      duration: 0.9,
      ease,
    },
  },
};

const itemReveal = {
  hidden: {
    opacity: 0,
    y: 42,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.95,
      ease,
    },
  },
};

/* =========================================================
   ARROW ICON
========================================================= */

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[14px] w-[14px]"
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

/* =========================================================
   CLOSE ICON
========================================================= */

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[19px] w-[19px]"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   CLUB DATA
========================================================= */

const clubs: Club[] = [
  {
    id: 1,
    title: "GUIDES CLUB",
    icon: "/icons/guides.svg",

    shortDescription:
      "Builds leadership, discipline, teamwork, service, and responsibility among students.",

    content: (
      <p>
        A guide is one who leads others towards their goals, by
        the virtue of self discipline, obedience and leadership
        skills. The Rosary Guide Company works to contribute to
        the development of these qualities in every guide by
        means of value system based on the Guide Law and Guide
        promise. This helps the girl guides to build a better
        world for themselves and others around them. The values
        taught to them during guides class and annual camp helps
        to inculcate a sense of responsibility, improve their
        talents, gain self confidence and learn life skills
        through team work. The Rosary Guide Company strives to
        keep the spirit of guiding a commitment for life for
        every guide, which means they blossom to be responsible
        young citizens and incorporate the morals learnt in the
        company and be a part of constructive society.
      </p>
    ),
  },

  {
    id: 2,
    title: "NSS CLUB",
    icon: "/icons/nss.svg",

    shortDescription:
      "Encourages community service, social awareness, responsibility, and active citizenship.",

    content: (
      <p>
        The National Service Scheme (NSS) is a Central Sector
        Scheme of Government of India, Ministry of Youth Affairs
        &amp; Sports. It provides opportunity to the student
        youth of 11th &amp; 12th Class of schools at +2 Board
        level and student youth of Technical Institution,
        Graduate &amp; Post Graduate at colleges and University
        level of India to take part in various government led
        community service activities &amp; programmes. The sole
        aim of the NSS is to provide hands on experience to
        young students in delivering community service. Since
        inception of the NSS in the year 1969, the number of
        students strength increased from 40,000 to over 3.8
        million up to the end of March 2018 students in various
        universities, colleges and Institutions of higher
        learning have volunteered to take part in various
        community service programmes.
      </p>
    ),
  },

  {
    id: 3,
    title: "RSP CLUB",
    icon: "/icons/rsp-club.svg",

    shortDescription:
      "Promotes road safety awareness, traffic discipline, service, and responsible citizenship.",

    content: (
      <>
        <p>
          The road safety patrol is a service to mankind that
          ensures an accident-free life. The idea of school
          students helping the police to regulate traffic was
          introduced by the fact that it was not possible to
          depute a police officer for each and every school.
        </p>

        <p className="mt-4">
          This concept was an instant success and it soon spread
          to many states of India. RSP Chennai unit was
          initiated by the madras traffic wardens organization
          team with government approval in the year 1982. RSP
          cadets are the medium through which road safety
          education is disseminated to society. Every year RSP
          wardens give RSP training for RSP cadets to inculcate
          traffic discipline. They conduct various competitions
          to create road safety awareness among RSP cadets.
        </p>
      </>
    ),
  },

  {
    id: 4,
    title: "ENGLISH LITERARY CLUB",
    icon: "/icons/english-literary-club.svg",

    shortDescription:
      "Develops reading, writing, speaking, creativity, communication, and literary appreciation.",

    content: (
      <p>
        Rosary Matriculation Higher Secondary School. The club
        invites students who are interested in English language
        to explore the opportunities given to improve their
        literary skills. Students from std.VI to VIII were
        divided equally into six groups bearing names of famous
        literary figures. Every class started with a word game,
        followed by the main activity of the day like -debate,
        speeches-extempore and prepared beforehand,
        conversation based on given situation, enacting,
        interviews with famous personalities, talk about social
        issues, story telling, poem recitation etc. Students
        also got involved in creative writing -poetry writing,
        essay writting, story writing, article writing etc.
        Group activities like -find the Proverb, guess the
        literary figure, spell the word, dumbshadar, slogan
        writing, advertising the given product, quiz on famous
        authors and books and solving crossword puzzles helped
        them work in teams. Students enjoyed all the activities
        while improving their reading, writing and speaking
        skills through the club activities.
      </p>
    ),
  },

  {
    id: 5,
    title: "TAMIL LITERARY CLUB",
    icon: "/icons/tamil-literary-club.svg",

    shortDescription:
      "Celebrates Tamil language, literature, culture, creativity, and its rich literary heritage.",

    content: (
      <p>
        <strong>Tamil literature</strong> has a rich and long
        literary tradition spanning more than two thousand
        years. The oldest extant works show signs of maturity
        indicating an even longer period of evolution.
        Contributors to the Tamil literature are mainly from
        Tamil people from South India, including the land now
        comprising Tamil Nadu, Kerala, Eelam Tamils from Sri
        Lanka, as well as the Tamil diaspora.
      </p>
    ),
  },

  {
    id: 6,
    title: "MATH CLUB",
    icon: "/icons/math-club.svg",

    shortDescription:
      "Makes Mathematics engaging through games, activities, discussion, and logical thinking.",

    content: (
      <p>
        The students of Std. VIII and IX were given the
        opportunity to select Maths club for their Club activity
        this academic year. The main aim of the Maths Club is to
        motivate students to learn Maths through a fun way.
        Teachers in charge of the club planned many activities
        based on Maths and its related topics. Students had a
        group discussion on how Maths is useful in day – to –
        day life and the importance of learning Maths. Many
        games and activities were conducted to enhance the depth
        of Maths and to improve logical thinking.
      </p>
    ),
  },

  {
    id: 7,
    title: "ARTS & CRAFTS CLUB",
    icon: "/icons/arts-crafts-club.svg",

    shortDescription:
      "Encourages creativity, imagination, reuse of materials, innovation, and artistic expression.",

    content: (
      <>
        <p className="font-semibold !text-[#171717]">
          No one is born with skills but everyone is born with
          the ability to create his or her skills.
        </p>

        <p className="mt-4">
          It gives an opportunity to think out of the box and
          work with different and unique materials. This club
          aids the students to do many innovative items by using
          paper cups, waste clothes, used chart papers, old
          woollen threads etc. Using wastes they make many
          interesting items like door mats, chess boards, paper
          flowers, cartoon wall hangings etc., this club is
          created as a gateway to enter into the world of
          reusing.
        </p>
      </>
    ),
  },

  {
    id: 8,
    title: "ECO CLUB",
    icon: "/icons/eco-club.svg",

    shortDescription:
      "Builds environmental awareness through conservation, recycling, sustainability, and green activities.",

    content: (
      <>
        <p className="font-semibold !text-[#171717]">
          Mother Nature needs us now
        </p>

        <p className="mt-4">
          The Eco club of Rosary school has been active for more
          than ten years. The need to respect and conserve
          nature is an essential value inculcated in our FMM
          schools following the footsteps of our patron of the
          environment, St.Francis of Assisi. Several awareness
          programmes are conducted and it is actualized through
          interesting and essential activities such as avoiding
          plastics making paper bags, reusing and recycling
          waste vermicomposting growing herbal plants and
          kitchen gardens, recycling paper, preparing organic
          sanitisers and many more sustainable activities.
          Rosary school is also a proud recipient of several
          green awards. Students are made to love and nurture
          nature.
        </p>
      </>
    ),
  },
];

/* =========================================================
   CLUB ICON
========================================================= */

function ClubIcon({
  club,
  modal = false,
}: {
  club: Club;
  modal?: boolean;
}) {
  return (
    <div
      className={`
        relative
        shrink-0
        overflow-hidden
        rounded-full

        bg-[#F1F7FF]

        ${
          modal
            ? `
              h-[78px]
              w-[78px]

              sm:h-[88px]
              sm:w-[88px]

              lg:h-[92px]
              lg:w-[92px]
            `
            : `
              h-[82px]
              w-[82px]

              sm:h-[88px]
              sm:w-[88px]

              lg:h-[84px]
              lg:w-[84px]
            `
        }
      `}
    >
      <Image
        src={club.icon}
        alt={club.title}
        fill
        sizes={modal ? "92px" : "88px"}
        className="
          object-contain
          object-center

          p-[5px]
        "
      />
    </div>
  );
}

/* =========================================================
   MORE DETAILS BUTTON
========================================================= */

function MoreDetailsButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      whileTap={{
        scale: 0.97,
      }}
      className="
        group/button
        relative

        mt-[15px]

        flex

        h-[40px]
        min-w-[164px]

        items-center
        justify-between

        overflow-hidden

        rounded-full

        border
        border-[#9DCEFF]

        bg-white

        pl-[17px]
        pr-[4px]

        shadow-[0_8px_24px_rgba(0,117,255,0.09)]

        sm:h-[42px]
        sm:min-w-[172px]
      "
    >
      {/* BLUE HOVER FILL */}

      <motion.span
        variants={{
          rest: {
            scaleX: 0,
          },

          hover: {
            scaleX: 1,
          },
        }}
        transition={{
          duration: 0.55,
          ease,
        }}
        className="
          pointer-events-none

          absolute
          inset-0

          origin-right

          bg-[#0075FF]
        "
      />

      {/* TEXT */}

      <motion.span
        variants={{
          rest: {
            color: "#0075FF",
          },

          hover: {
            color: "#FFFFFF",
          },
        }}
        transition={{
          duration: 0.3,
        }}
        className="
          relative
          z-10

          whitespace-nowrap

          font-secondary

          text-[10px]
          font-medium

          uppercase

          tracking-[0.55px]

          sm:text-[10.5px]
        "
      >
        More Details
      </motion.span>

      {/* ARROW */}

      <motion.span
        variants={{
          rest: {
            x: 0,
            rotate: 0,

            backgroundColor: "#0075FF",
            color: "#FFFFFF",
          },

          hover: {
            x: 1,
            rotate: -7,

            backgroundColor: "#FFFFFF",
            color: "#0075FF",
          },
        }}
        transition={{
          duration: 0.4,
          ease,
        }}
        className="
          relative
          z-10

          flex

          h-[32px]
          w-[32px]

          shrink-0

          items-center
          justify-center

          rounded-full

          sm:h-[34px]
          sm:w-[34px]
        "
      >
        <ArrowIcon />
      </motion.span>
    </motion.button>
  );
}

/* =========================================================
   CLUB ITEM
========================================================= */

function ClubItem({
  club,
  onOpen,
}: {
  club: Club;
  onOpen: (club: Club) => void;
}) {
  return (
    <motion.article
      variants={itemReveal}
      className="
        group

        flex
        w-full

        flex-col
        items-center

        text-center
      "
    >
      {/* ICON */}

      <motion.button
        type="button"
        onClick={() => onOpen(club)}
        initial={{
          scale: 1,
        }}
        whileHover={{
          y: -7,
          scale: 1.055,
        }}
        whileTap={{
          scale: 0.96,
        }}
        transition={{
          duration: 0.45,
          ease,
        }}
        className="
          relative
          rounded-full
          outline-none
        "
        aria-label={`View ${club.title}`}
      >
        {/* HOVER GLOW */}

        <span
          className="
            pointer-events-none

            absolute
            inset-[8px]

            rounded-full

            bg-[#0075FF]/20

            opacity-0
            blur-[18px]

            transition-opacity
            duration-500

            group-hover:opacity-100
          "
        />

        <ClubIcon club={club} />
      </motion.button>

      {/* TITLE */}

      <motion.h3
        className="
          mt-[14px]

          flex

          min-h-[34px]

          max-w-[220px]

          items-start
          justify-center

          font-primary

          text-[12.5px]
          font-semibold

          uppercase

          leading-[1.2]

          text-[#151515]

          sm:text-[13px]

          lg:text-[13px]
        "
      >
        {club.title}
      </motion.h3>

      {/* DESCRIPTION */}

      <p
        className="
          mt-[5px]

          min-h-[45px]

          max-w-[220px]

          font-secondary

          text-[9px]

          leading-[1.5]

          text-[#7D7D7D]

          sm:text-[9.5px]

          lg:text-[9.5px]
        "
      >
        {club.shortDescription}
      </p>

      {/* BUTTON */}

      <MoreDetailsButton
        onClick={() => onOpen(club)}
      />
    </motion.article>
  );
}

/* =========================================================
   MODAL
========================================================= */

function ClubModal({
  club,
  onClose,
}: {
  club: Club | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!club) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [club, onClose]);

  return (
    <AnimatePresence>
      {club && (
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
            duration: 0.3,
          }}
          onMouseDown={onClose}
          className="
            fixed
            inset-0

            z-[9999]

            flex
            items-end
            justify-center

            bg-[#06131F]/60

            px-[8px]

            backdrop-blur-[9px]

            sm:items-center
            sm:px-[24px]
            sm:py-[28px]
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 90,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 50,
              scale: 0.97,
            }}
            transition={{
              duration: 0.55,
              ease,
            }}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-label={club.title}
            className="
              relative

              flex

              max-h-[92dvh]
              w-full
              max-w-[900px]

              flex-col

              overflow-hidden

              rounded-t-[22px]

              bg-white

              shadow-[0_35px_110px_rgba(0,0,0,0.28)]

              sm:max-h-[84vh]
              sm:rounded-[20px]
            "
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                relative

                shrink-0

                overflow-hidden

                border-b
                border-[#E5EDF5]

                bg-white

                px-[18px]
                pb-[20px]
                pt-[20px]

                sm:px-[26px]
                sm:pb-[22px]
                sm:pt-[22px]

                lg:px-[28px]
                lg:pb-[24px]
                lg:pt-[24px]
              "
            >
              {/* =================================================
                  DESKTOP ONLY IMAGE BACKGROUND

                  MOBILE / TABLET = NO IMAGE BG
              ================================================= */}

              <div
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  hidden

                  bg-cover
                  bg-center
                  bg-no-repeat

                  opacity-[0.14]

                  lg:block
                "
                style={{
                  backgroundImage:
                    "url('/images/academics-bg.png')",
                }}
              />

              {/* DESKTOP LIGHT GRADIENT */}

              <div
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  hidden

                  bg-gradient-to-r

                  from-[#EDF7FF]/95
                  via-white/95
                  to-white/92

                  lg:block
                "
              />

              {/* MOBILE/TABLET CLEAN GLOW */}

              <div
                className="
                  pointer-events-none

                  absolute

                  -right-[70px]
                  -top-[70px]

                  h-[180px]
                  w-[180px]

                  rounded-full

                  bg-[#0075FF]/[0.045]

                  blur-[45px]

                  lg:hidden
                "
              />

              {/* TOP LINE */}

              <motion.div
                initial={{
                  scaleX: 0,
                }}
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  duration: 0.8,
                  ease,
                }}
                className="
                  absolute
                  left-0
                  top-0

                  h-[4px]
                  w-full

                  origin-left

                  bg-[#0075FF]
                "
              />

              <div
                className="
                  relative
                  z-10

                  flex
                  items-center

                  gap-[13px]

                  sm:gap-[17px]
                "
              >
                {/* MODAL ICON */}

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.82,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.08,
                    ease,
                  }}
                >
                  <ClubIcon
                    club={club}
                    modal
                  />
                </motion.div>

                {/* MODAL INFO */}

                <motion.div
                  initial={{
                    opacity: 0,
                    x: 15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.12,
                    ease,
                  }}
                  className="
                    min-w-0
                    flex-1

                    pr-[42px]
                  "
                >
                  <span
                    className="
                      inline-flex

                      rounded-[4px]

                      bg-[#E9F4FF]

                      px-[9px]
                      py-[5px]

                      font-secondary

                      text-[9px]
                      font-medium

                      uppercase

                      tracking-[0.6px]

                      text-[#0075FF]

                      sm:text-[9.5px]
                    "
                  >
                    Student Club
                  </span>

                  <h3
                    className="
                      mt-[8px]

                      font-primary

                      text-[19px]
                      font-semibold

                      uppercase

                      leading-[1.08]

                      tracking-[-0.45px]

                      text-[#151B24]

                      sm:text-[23px]

                      lg:text-[25px]
                    "
                  >
                    {club.title}
                  </h3>

                  <p
                    className="
                      mt-[6px]

                      hidden

                      max-w-[530px]

                      font-secondary

                      text-[10px]

                      leading-[1.5]

                      text-[#788391]

                      sm:block
                    "
                  >
                    {club.shortDescription}
                  </p>
                </motion.div>
              </div>

              {/* CLOSE */}

              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{
                  rotate: 90,
                  backgroundColor:
                    "#0075FF",
                  color: "#ffffff",
                }}
                whileTap={{
                  scale: 0.9,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="
                  absolute

                  right-[14px]
                  top-[15px]

                  z-20

                  flex

                  h-[38px]
                  w-[38px]

                  items-center
                  justify-center

                  rounded-full

                  border
                  border-[#DCE7F2]

                  bg-white

                  text-[#3D4855]

                  shadow-[0_7px_20px_rgba(18,45,70,0.08)]

                  sm:right-[20px]
                  sm:top-[20px]
                "
                aria-label="Close"
              >
                <CloseIcon />
              </motion.button>
            </div>

            {/* =================================================
                BODY
            ================================================= */}

            <div
              className="
                relative

                flex-1

                overflow-y-auto

                bg-white

                px-[18px]
                py-[22px]

                [scrollbar-color:#BADBFF_transparent]
                [scrollbar-width:thin]

                sm:px-[30px]
                sm:py-[28px]
              "
            >
              {/* DESKTOP ONLY CHECKED BG */}

              <div
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  hidden

                  opacity-[0.5]

                  lg:block
                "
                style={{
                  backgroundImage: `
                    linear-gradient(
                      rgba(0,117,255,0.035) 1px,
                      transparent 1px
                    ),
                    linear-gradient(
                      90deg,
                      rgba(0,117,255,0.035) 1px,
                      transparent 1px
                    )
                  `,
                  backgroundSize:
                    "38px 38px",
                }}
              />

              <div
                className="
                  relative
                  z-10

                  mx-auto

                  max-w-[790px]
                "
              >
                {/* ABOUT */}

                <motion.div
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15,
                    ease,
                  }}
                  className="
                    flex
                    items-center

                    gap-[9px]
                  "
                >
                  <motion.span
                    initial={{
                      scaleX: 0,
                    }}
                    animate={{
                      scaleX: 1,
                    }}
                    transition={{
                      duration: 0.65,
                      delay: 0.2,
                      ease,
                    }}
                    className="
                      h-[2px]
                      w-[32px]

                      origin-left

                      bg-[#0075FF]
                    "
                  />

                  <span
                    className="
                      font-secondary

                      text-[9px]
                      font-medium

                      uppercase

                      tracking-[0.9px]

                      text-[#0075FF]
                    "
                  >
                    About the Club
                  </span>
                </motion.div>

                {/* CONTENT */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.2,
                    ease,
                  }}
                  className="
                    mt-[19px]

                    font-secondary

                    text-[12px]

                    leading-[1.78]

                    text-[#606A77]

                    sm:text-[13px]
                    sm:leading-[1.88]

                    [&_strong]:font-primary
                    [&_strong]:font-semibold
                    [&_strong]:text-[#171E26]
                  "
                >
                  {club.content}
                </motion.div>

                {/* VALUE BLOCK */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3,
                    ease,
                  }}
                  className="
                    mt-[25px]

                    flex

                    overflow-hidden

                    rounded-[10px]

                    border
                    border-[#DAEAFB]

                    bg-[#FCFEFF]

                    shadow-[0_10px_30px_rgba(20,60,95,0.045)]
                  "
                >
                  <span
                    className="
                      w-[4px]
                      shrink-0

                      bg-[#0075FF]
                    "
                  />

                  <div
                    className="
                      px-[15px]
                      py-[13px]

                      sm:px-[18px]
                      sm:py-[15px]
                    "
                  >
                    <span
                      className="
                        font-secondary

                        text-[8px]
                        font-medium

                        uppercase

                        tracking-[0.7px]

                        text-[#0075FF]
                      "
                    >
                      Student Development
                    </span>

                    <p
                      className="
                        mt-[5px]

                        font-secondary

                        text-[10px]

                        leading-[1.6]

                        text-[#687485]

                        sm:text-[10.5px]
                      "
                    >
                      Encouraging students
                      to learn beyond
                      academics through
                      creativity,
                      participation,
                      teamwork, service and
                      responsibility.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="
                relative
                z-20

                flex

                shrink-0

                items-center
                justify-between

                gap-[12px]

                border-t
                border-[#E4ECF4]

                bg-[#FAFCFE]

                px-[18px]
                py-[12px]

                sm:px-[30px]
                sm:py-[14px]
              "
            >
              <div>
                <p
                  className="
                    font-primary

                    text-[9px]
                    font-semibold

                    text-[#344054]
                  "
                >
                  Rosary Matriculation
                  Higher Secondary School
                </p>

                <p
                  className="
                    mt-[2px]

                    hidden

                    font-secondary

                    text-[8px]

                    text-[#98A2B3]

                    sm:block
                  "
                >
                  Learn • Lead • Serve •
                  Grow
                </p>
              </div>

              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{
                  y: -2,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  inline-flex

                  items-center

                  gap-[8px]

                  rounded-full

                  bg-[#0075FF]

                  px-[17px]
                  py-[10px]

                  font-secondary

                  text-[9px]
                  font-medium

                  uppercase

                  tracking-[0.4px]

                  text-white

                  shadow-[0_8px_22px_rgba(0,117,255,0.20)]
                "
              >
                Close
                <ArrowIcon />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function StudentClubsActivities() {
  const [
    selectedClub,
    setSelectedClub,
  ] = useState<Club | null>(
    null
  );

  return (
    <>
      <section
        className="
          relative
          isolate

          w-full

          overflow-hidden

          bg-white

          py-[62px]

          sm:py-[70px]

          md:py-[76px]

          lg:py-[82px]
        "
      >
        {/* =====================================================
            DESKTOP BACKGROUND ONLY

            MOBILE = NONE
            TABLET = NONE
            DESKTOP = academics-bg.png
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 1.4,
            ease,
          }}
          className="
            pointer-events-none

            absolute
            inset-0

            -z-30

            hidden

            bg-cover
            bg-center
            bg-no-repeat

            lg:block
          "
          style={{
            backgroundImage:
              "url('/images/academics-bg.png')",
          }}
        />

        {/* DESKTOP OVERLAY */}

        <div
          className="
            pointer-events-none

            absolute
            inset-0

            -z-20

            hidden

            bg-white/[0.08]

            lg:block
          "
        />

        {/* =====================================================
            MOBILE/TABLET VERY SOFT DECORATION
            NOT AN IMAGE BACKGROUND
        ====================================================== */}

        <div
          className="
            pointer-events-none

            absolute

            -left-[130px]
            top-[90px]

            -z-10

            h-[320px]
            w-[320px]

            rounded-full

            bg-[#0075FF]/[0.025]

            blur-[100px]

            lg:hidden
          "
        />

        <div
          className="
            pointer-events-none

            absolute

            -right-[150px]
            bottom-[100px]

            -z-10

            h-[320px]
            w-[320px]

            rounded-full

            bg-[#0075FF]/[0.02]

            blur-[100px]

            lg:hidden
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
            margin:
              "0px 0px -40px 0px",
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

            sm:px-[28px]
          "
        >
          {/* CLUB CHIP */}

          <motion.span
            variants={fadeUp}
            className="
              inline-flex

              items-center
              justify-center

              rounded-[4px]

              bg-[#EEF6FF]

              px-[10px]
              py-[6px]

              font-secondary

              text-[10px]
              font-medium

              leading-none

              tracking-[0.35px]

              text-[#0075FF]

              shadow-[0_3px_12px_rgba(0,117,255,0.05)]

              sm:px-[11px]
              sm:text-[10.5px]

              md:px-[12px]
              md:py-[7px]
              md:text-[11px]
            "
          >
            Clubs
          </motion.span>

          {/* TITLE */}

          <motion.h2
            variants={fadeUp}
            className="
              mt-[16px] pb-3

              font-primary

              text-[27px]
              font-semibold

              leading-[1.08]

              tracking-[-0.65px]

              text-[#171717]

              sm:mt-[17px]
              sm:text-[31px]

              md:text-[34px]

              lg:mt-[18px]
              lg:text-[36px]
            "
          >
            Student Clubs &amp;
            Activities
          </motion.h2>

          {/* DESCRIPTION */}

          <motion.p
            variants={fadeUp}
            className="
              mx-auto

              mt-[11px]

              max-w-[590px]

              font-secondary

              text-[10.5px]

              leading-[1.6]

              text-[#7A7A7A]

              sm:mt-[12px]
              sm:text-[11px]

              md:max-w-[620px]
              md:text-[11.5px]

              lg:text-[13px]
            "
          >
            Discover engaging clubs that
            encourage creativity,
            teamwork, leadership,
            service, and individual
            talents.
          </motion.p>

          {/* SMALL BLUE LINE */}

          <motion.span
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
              duration: 0.8,
              delay: 0.35,
              ease,
            }}
            className="
              mt-[15px]

              h-[2px]
              w-[34px]

              origin-center

              bg-[#0075FF]

              sm:mt-[16px]
            "
          />
        </motion.div>

        {/* =====================================================
            CLUB GRID

            MOBILE  = 1 COLUMN
            TABLET  = 2 COLUMNS
            DESKTOP = 4 COLUMNS
        ====================================================== */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.04,
            margin:
              "0px 0px -40px 0px",
          }}
          className="
            relative
            z-10

            mx-auto

            mt-[46px]

            grid

            w-full
            max-w-[1200px]

            grid-cols-1

            gap-x-[30px]
            gap-y-[52px]

            px-[20px]

            sm:mt-[52px]
            sm:grid-cols-2
            sm:gap-x-[42px]
            sm:gap-y-[58px]
            sm:px-[36px]

            md:mt-[56px]
            md:gap-x-[50px]
            md:gap-y-[60px]
            md:px-[48px]

            lg:mt-[60px]
            lg:grid-cols-4
            lg:gap-x-[48px]
            lg:gap-y-[58px]

            xl:gap-x-[62px]
          "
        >
          {clubs.map(
            (club) => (
              <ClubItem
                key={club.id}
                club={club}
                onOpen={
                  setSelectedClub
                }
              />
            )
          )}
        </motion.div>
      </section>

      {/* =====================================================
          MODAL
      ====================================================== */}

      <ClubModal
        club={selectedClub}
        onClose={() =>
          setSelectedClub(null)
        }
      />
    </>
  );
}