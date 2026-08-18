"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* =========================================================
   DATA
========================================================= */

const academics = [
  {
    id: 1,
    title: "Curriculum",
    description:
      "A balanced curriculum that builds knowledge, creativity, confidence, and essential skills at every stage of learning.",
    image: "/images/curriculum.png",
    href: "/academics/curriculum",
  },
  {
    id: 2,
    title: "Departments",
    description:
      "Explore diverse academic departments that build strong subject knowledge and practical skills.",
    image: "/images/departments.png",
    href: "/academics/departments",
  },
  {
    id: 3,
    title: "Faculty",
    description:
      "Meet our experienced educators dedicated to guiding, inspiring, and supporting every student.",
    image: "/images/faculty.png",
    href: "/academics/faculty",
  },
  {
    id: 4,
    title: "Clubs",
    description:
      "Discover engaging clubs that encourage creativity, teamwork, leadership, and individual talents.",
    image: "/images/clubs.png",
    href: "/academics/clubs",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

/* =========================================================
   ACADEMIC CARD
========================================================= */

function AcademicCard({
  item,
  index,
}: {
  item: (typeof academics)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 42,
        scale: 0.975,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.2,
        margin: "0px 0px -50px 0px",
      }}
      transition={{
        duration: 1,
        delay: (index % 2) * 0.1,
        ease,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="
        relative
        h-[225px]
        w-full
        overflow-hidden
        rounded-[10px]
        border
        border-[#0075FF]/60
        bg-white

        transition-[border-color,box-shadow]
        duration-700

        sm:h-[245px]

        md:h-[230px]

        lg:h-[250px]

        xl:h-[260px]
      "
      animate={{
        boxShadow: hovered
          ? "0 24px 55px rgba(0,117,255,0.13)"
          : "0 12px 34px rgba(20,45,75,0.06)",
        borderColor: hovered
          ? "rgba(0,117,255,0.95)"
          : "rgba(0,117,255,0.60)",
      }}
    >
      {/* =====================================================
          WHITE BASE
      ====================================================== */}

      <div className="absolute inset-0 bg-white" />

      {/* =====================================================
          BLUE SHUFFLE

          NORMAL:
          blue left / white right

          HOVER:
          white left / blue right

          Card itself DOES NOT MOVE.
      ====================================================== */}

      <motion.div
        initial={false}
        animate={{
          clipPath: hovered
            ? "polygon(57% 0%, 100% 0%, 100% 100%, 36% 100%)"
            : "polygon(0% 0%, 73% 0%, 47% 100%, 0% 100%)",
        }}
        transition={{
          duration: 0.95,
          ease,
        }}
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[#0075FF]
          will-change-[clip-path]
        "
      />

      {/* very subtle depth */}

      <motion.div
        initial={false}
        animate={{
          clipPath: hovered
            ? "polygon(57% 0%, 100% 0%, 100% 100%, 36% 100%)"
            : "polygon(0% 0%, 73% 0%, 47% 100%, 0% 100%)",
        }}
        transition={{
          duration: 0.95,
          ease,
        }}
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-white/[0.06]
          via-transparent
          to-black/[0.025]
        "
      />

      {/* =====================================================
          TEXT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          items-center

          px-[18px]

          sm:px-[22px]

          md:px-[20px]

          lg:px-[26px]
        "
      >
        <div
          className="
            w-[58%]

            sm:w-[56%]

            md:w-[57%]

            lg:w-[55%]
          "
        >
          {/* TITLE */}

          <h3
            className={`
              font-primary
              text-[18px]
              font-semibold
              uppercase
              leading-[1.06]
              tracking-[-0.35px]

              transition-colors
              duration-700

              sm:text-[20px]

              lg:text-[23px]

              xl:text-[24px]

              ${
                hovered
                  ? "!text-[#111111]"
                  : "!text-white"
              }
            `}
          >
            {item.title}
          </h3>

          {/* DESCRIPTION */}

          <p
            className={`
              mt-[9px]
              max-w-[230px]

              font-secondary
              text-[9.5px]
              font-normal
              leading-[1.45]

              transition-colors
              duration-700

              sm:mt-[11px]
              sm:text-[10.5px]

              lg:text-[11.5px]

              xl:text-[12px]

              ${
                hovered
                  ? "text-[#484848]"
                  : "text-white/90"
              }
            `}
          >
            {item.description}
          </p>

          {/* =================================================
              BUTTON
          ================================================= */}

          <Link
            href={item.href}
            className={`
              mt-[13px]

              inline-flex
              items-center
              gap-[8px]

              rounded-full

              px-[11px]
              py-[6px]

              font-primary
              text-[9px]
              font-semibold

              shadow-[0_5px_15px_rgba(0,0,0,0.08)]

              transition-all
              duration-500

              hover:gap-[11px]

              sm:mt-[15px]
              sm:px-[12px]
              sm:text-[9.5px]

              lg:px-[13px]
              lg:text-[10px]

              ${
                hovered
                  ? "bg-[#0075FF] text-white"
                  : "bg-white text-[#111111]"
              }
            `}
          >
            View More

            <span
              className={`
                flex
                h-[21px]
                w-[21px]
                items-center
                justify-center
                rounded-full

                transition-all
                duration-500

                ${
                  hovered
                    ? "rotate-45 bg-white text-[#0075FF]"
                    : "bg-[#0075FF] text-white"
                }
              `}
            >
              <ArrowRight size={12} />
            </span>
          </Link>
        </div>
      </div>

      {/* =====================================================
          IMAGE

          NO BORDER ADDED.
          Your original image border/design remains untouched.
      ====================================================== */}

      <motion.div
        initial={false}
        animate={{
          scale: hovered ? 1.015 : 1,
          y: hovered ? -2 : 0,
        }}
        transition={{
          duration: 0.9,
          ease,
        }}
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          z-20

          h-[125px]
          w-[120px]

          overflow-hidden

          rounded-tl-[76px]

          sm:h-[140px]
          sm:w-[135px]

          md:h-[130px]
          md:w-[125px]

          lg:h-[158px]
          lg:w-[152px]

          xl:h-[170px]
          xl:w-[175px]
        "
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="
            (max-width: 639px) 120px,
            (max-width: 767px) 135px,
            (max-width: 1023px) 125px,
            (max-width: 1279px) 152px,
            164px
          "
          className="
            object-cover
            object-center
          "
        />

        {/* very soft image zoom */}

        <motion.div
          initial={false}
          animate={{
            opacity: hovered ? 0.03 : 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black
          "
        />
      </motion.div>
    </motion.article>
  );
}

/* =========================================================
   MAIN SECTION
========================================================= */

export default function AcademicsOverview() {
  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-white

        py-[44px]

        sm:py-[56px]

        lg:py-[70px]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE

          public/images/academics-bg.png
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
        "
        style={{
          backgroundImage:
            "url('/images/academics-bg.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* LIGHT WASH */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-white/[0.04]
        "
      />

      {/* =====================================================
          MAIN CONTENT
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

          lg:px-[38px]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

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
            amount: 0.3,
          }}
          transition={{
            duration: 1,
            ease,
          }}
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

          <motion.span
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease,
            }}
            className="
              inline-flex
              rounded-[3px]
              bg-[#F1F7FF]
              px-[7px]
              py-[4px]

              font-secondary
              text-[9px]
              font-medium
              leading-none

              text-[#0075FF]

              sm:text-[10px]
            "
          >
            Academics
          </motion.span>

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
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: 0.1,
              ease,
            }}
            className="
              mx-auto
              mt-[11px]

              w-full
              max-w-[850px]

              font-primary
              text-[22px]
              font-semibold
              leading-[1.16]
              tracking-[-0.6px]

              !text-[#111111]

              sm:text-[27px]

              md:text-[29px]

              lg:text-[32px]
            "
          >
            Explore our Curriculum, Departments, Faculty, and Clubs, designed
            to support academic excellence and overall student development.
          </motion.h2>
        </motion.div>

        {/* =================================================
            GRID
        ================================================= */}

        <div
          className="
            mt-[27px]

            grid
            grid-cols-1
            gap-[16px]

            sm:mt-[32px]

            md:grid-cols-2
            md:gap-[20px]

            lg:mt-[38px]
            lg:gap-[25px]
          "
        >
          {academics.map((item, index) => (
            <AcademicCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}