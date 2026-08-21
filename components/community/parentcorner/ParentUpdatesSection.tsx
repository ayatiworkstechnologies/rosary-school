"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  CreditCard,
  FileText,
  ArrowRight,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type QuickItem = {
  id: number;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: React.ElementType;
};

type AnnouncementItem = {
  id: number;
  date: string;
  category: string;
  title: string;
  description: string;
};

/* =========================================================
   DATA
========================================================= */

const quickItems: QuickItem[] = [
  {
    id: 1,
    title: "Circulars & Notices",
    description:
      "View important school announcements, daily alerts, and formal policies sent home.",
    cta: "View Circulars",
    href: "#",
    icon: Bell,
  },
  {
    id: 2,
    title: "Academic Calendar",
    description:
      "Check exams, holidays, events, key dates, and scheduled teacher development days.",
    cta: "View Calendar",
    href: "#",
    icon: CalendarDays,
  },
  {
    id: 3,
    title: "Fee Information",
    description:
      "Access fee schedules, online portals, term payment schedules, and financial queries.",
    cta: "Fee Details",
    href: "#",
    icon: CreditCard,
  },
  {
    id: 4,
    title: "Forms & Downloads",
    description:
      "Download commonly required school forms, health consent slips, and field trip permission requests.",
    cta: "Get Forms",
    href: "#",
    icon: FileText,
  },
];

const announcements: AnnouncementItem[] = [
  {
    id: 1,
    date: "March 18, 2026",
    category: "Parent-Teacher Meeting",
    title: "Term 2 Evaluation PTM Scheduled",
    description:
      "Interactive session scheduled on Saturday to discuss Term 2 academic reports, individual progress maps, and holistic development targets.",
  },
  {
    id: 2,
    date: "March 15, 2026",
    category: "Examination Schedule",
    title: "Final Examinations Matrix Published",
    description:
      "The definitive final examination timetable and structured learning syllabi have been released online for grades VI through XII.",
  },
  {
    id: 3,
    date: "March 10, 2026",
    category: "Holiday Notice",
    title: "Upcoming Easter Spring Break Schedule",
    description:
      "The school will remain closed for spring holidays starting April 2, reopening on April 9. Holiday study modules have been shared.",
  },
  {
    id: 4,
    date: "March 08, 2026",
    category: "School Event Update",
    title: "Annual Science Exhibition 'Sci-Tech 2026'",
    description:
      "Parents are cordially invited to visit the young innovators' project pavilions on March 25 in the Central Auditorium.",
  },
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
    y: 28,
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

const cardReveal = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.9,
      ease,
    },
  },
};

/* =========================================================
   QUICK CARD
========================================================= */

function QuickAccessCard({
  item,
}: {
  item: QuickItem;
}) {
  const Icon = item.icon;

  return (
    <motion.article
      variants={cardReveal}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.35,
        ease,
      }}
      className="h-full"
    >
      <Link
        href={item.href}
        className="
          group
          relative

          flex
          h-full
          min-h-[230px]
          w-full

          flex-col
          items-center
          justify-center

          overflow-hidden

          rounded-[12px]

          border
          border-[#82BEFF]

          bg-white

          px-[24px]
          py-[28px]

          text-center

          shadow-[0_8px_24px_rgba(22,56,90,0.035)]

          transition-all
          duration-500

          hover:border-[#0075FF]
          hover:shadow-[0_20px_46px_rgba(0,117,255,0.12)]

          sm:min-h-[245px]

          lg:min-h-[220px]

          xl:min-h-[230px]
        "
      >
        {/* =================================================
            BLUE CORNER GLOW
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute

            -right-[55px]
            -top-[60px]

            h-[150px]
            w-[150px]

            rounded-full

            bg-[#0075FF]/55

            blur-[28px]

            transition-all
            duration-700

            group-hover:-right-[30px]
            group-hover:-top-[35px]
            group-hover:bg-[#0075FF]/70
          "
        />

        {/* =================================================
            ICON
        ================================================= */}

        <motion.div
          whileHover={{
            scale: 1.08,
            rotate: 3,
          }}
          className="
            relative
            z-10

            flex
            h-[45px]
            w-[45px]

            items-center
            justify-center

            rounded-[11px]

            bg-[#EDF6FF]

            text-[#0075FF]

            shadow-[0_6px_18px_rgba(0,117,255,0.08)]

            transition-all
            duration-500

            group-hover:bg-[#0075FF]
            group-hover:text-white
          "
        >
          <Icon
            size={20}
            strokeWidth={2}
          />
        </motion.div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h3
          className="
            relative
            z-10

            mt-[18px]

            font-primary

            text-[16px]
            font-semibold

            leading-[1.2]

            tracking-[-0.2px]

            text-[#222222]

            sm:text-[17px]
          "
        >
          {item.title}
        </h3>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p
          className="
            relative
            z-10

            mt-[9px]

            max-w-[235px]

            font-secondary

            text-[12px]

            leading-[1.5]

            text-[#757575]

            sm:text-[12.5px]
          "
        >
          {item.description}
        </p>

        {/* =================================================
            CTA
        ================================================= */}

        <span
          className="
            relative
            z-10

            mt-[20px]

            inline-flex
            items-center

            gap-[5px]

            font-secondary

            text-[11px]
            font-medium

            text-[#0075FF]

            transition-all
            duration-400

            group-hover:gap-[8px]

            sm:text-[11.5px]
          "
        >
          {item.cta}

          <ArrowRight
            size={12}
            strokeWidth={2}
          />
        </span>
      </Link>
    </motion.article>
  );
}

/* =========================================================
   ANNOUNCEMENT CARD
========================================================= */

function AnnouncementCard({
  item,
}: {
  item: AnnouncementItem;
}) {
  return (
    <motion.article
      variants={cardReveal}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.35,
        ease,
      }}
      className="
        group

        relative

        overflow-hidden

        rounded-[8px]

        border
        border-[#E8DCCB]

        bg-white/95

        px-[20px]
        py-[20px]

        shadow-[0_6px_18px_rgba(30,45,60,0.02)]

        transition-all
        duration-500

        hover:border-[#C8E1FC]
        hover:shadow-[0_16px_35px_rgba(0,117,255,0.08)]

        sm:px-[23px]
        sm:py-[22px]
      "
    >
      {/* ACTIVE LEFT LINE */}

      <span
        className="
          absolute
          bottom-[12px]
          left-0
          top-[12px]

          w-[2px]

          scale-y-0

          rounded-r-full

          bg-[#0075FF]

          transition-transform
          duration-500

          group-hover:scale-y-100
        "
      />

      {/* TOP */}

      <div
        className="
          flex
          flex-wrap

          items-center
          justify-between

          gap-[8px]
        "
      >
        <span
          className="
            font-secondary

            text-[10px]

            text-[#8A8A8A]

            sm:text-[10.5px]
          "
        >
          {item.date}
        </span>

        <span
          className="
            rounded-[4px]

            bg-[#EDF6FF]

            px-[8px]
            py-[4px]

            font-secondary

            text-[8px]
            font-medium

            uppercase

            leading-none

            text-[#0075FF]

            sm:text-[8.5px]
          "
        >
          {item.category}
        </span>
      </div>

      {/* TITLE */}

      <h3
        className="
          mt-[13px]

          font-primary

          text-[15px]
          font-semibold

          leading-[1.25]

          tracking-[-0.2px]

          text-[#222222]

          sm:text-[16px]

          lg:text-[17px]
        "
      >
        {item.title}
      </h3>

      {/* DESCRIPTION */}

      <p
        className="
          mt-[8px]

          font-secondary

          text-[11px]

          leading-[1.55]

          text-[#858585]

          sm:text-[11.5px]

          lg:text-[12px]
        "
      >
        {item.description}
      </p>

      {/* SOFT HOVER GLOW */}

      <div
        className="
          pointer-events-none

          absolute

          -bottom-[50px]
          -right-[45px]

          h-[110px]
          w-[110px]

          rounded-full

          bg-[#0075FF]/0

          blur-[30px]

          transition-all
          duration-500

          group-hover:bg-[#0075FF]/[0.06]
        "
      />
    </motion.article>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ParentUpdatesSection() {
  return (
    <section
      className="
        relative
        isolate

        w-full

        overflow-hidden

        bg-white

        py-[55px]

        sm:py-[68px]

        lg:py-[80px]
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

          -z-20 hidden lg:block

          bg-center
          bg-cover
          bg-no-repeat 

          opacity-[0.75]
        "
        style={{
          backgroundImage:
            "url('/images/academics-bg.png')",
        }}
      />

      {/* WHITE WASH */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          -z-10

          bg-white/18
        "
      />

      {/* =====================================================
          MAIN WRAPPER
      ====================================================== */}

      <div
        className="
          relative
          z-10

          mx-auto

          w-full
          max-w-[1240px]

          px-[16px]

          sm:px-[26px]

          md:px-[38px]

          lg:px-[46px]
        "
      >
        {/* =================================================
            TOP HEADING
        ================================================= */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="
            flex

            flex-col
            items-center

            text-center
          "
        >
          <motion.span
            variants={fadeUp}
            className="
              inline-flex

              rounded-[3px]

              bg-[#EDF6FF]

              px-[8px]
              py-[4px]

              font-secondary

              text-[9px]
              font-medium

              text-[#0075FF]

              sm:text-[13px]
            "
          >
            Parent Updates
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="
              mt-[13px]

              font-primary

              text-[27px]
              font-semibold

              leading-[1.08]

              tracking-[-0.6px]

              text-[#171717]

              sm:text-[32px]

              lg:text-[34px] pt-3
            "
          >
            Stay Connected
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="
              mx-auto

              mt-[10px]

              max-w-[520px]

              font-secondary

              text-[11px]

              leading-[1.5]

              text-[#888888]

              sm:text-[12px] pt-3
            "
          >
            Stay informed, connected, and involved in your
            child&apos;s learning journey.
          </motion.p>
        </motion.div>

        {/* =================================================
            QUICK ACCESS CARDS
        ================================================= */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          className="
            mt-[40px]

            grid
            grid-cols-1

            gap-[15px]

            sm:grid-cols-2
            sm:gap-[18px]

            lg:mt-[46px]
            lg:grid-cols-4
            lg:gap-[20px]
          "
        >
          {quickItems.map((item) => (
            <QuickAccessCard
              key={item.id}
              item={item}
            />
          ))}
        </motion.div>

        {/* =================================================
            ANNOUNCEMENT HEADING
        ================================================= */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="
            mt-[62px]

            flex
            flex-col

            items-center

            text-center

            sm:mt-[72px]

            lg:mt-[80px]
          "
        >
          <motion.span
            variants={fadeUp}
            className="
              rounded-[3px]

              bg-[#EDF6FF]

              px-[8px]
              py-[4px]

              font-secondary

              text-[9px]
              font-medium

              uppercase

              text-[#0075FF]

              sm:text-[10px]
            "
          >
            Updates
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="
              mt-[13px]

              font-primary

              text-[27px]
              font-semibold

              leading-[1.08]

              tracking-[-0.55px]

              text-[#171717]

              sm:text-[32px]

              lg:text-[34px]
            "
          >
            Latest Announcements
          </motion.h2>
        </motion.div>

        {/* =================================================
            ANNOUNCEMENTS GRID

            Mobile = 1
            Tablet/Desktop = 2
        ================================================= */}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.08,
          }}
          className="
            mt-[34px]

            grid
            grid-cols-1

            gap-[14px]

            sm:mt-[38px]

            md:grid-cols-2
            md:gap-[16px]

            lg:gap-[18px]
          "
        >
          {announcements.map((item) => (
            <AnnouncementCard
              key={item.id}
              item={item}
            />
          ))}
        </motion.div>

        {/* =================================================
            VIEW ALL
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 22,
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
            delay: 0.2,
            ease,
          }}
          className="
            mt-[28px]

            flex
            justify-center
          "
        >
          <motion.div
            whileHover={{
              y: -3,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/news"
              className="
                inline-flex

                h-[43px]

                items-center
                justify-center

                rounded-[5px]

                bg-[#0075FF]

                px-[24px]

                font-secondary

                text-[10px]
                font-medium

                uppercase

                tracking-[0.2px]

                !text-white

                shadow-[0_9px_24px_rgba(0,117,255,0.2)]

                transition-all
                duration-300

                hover:bg-[#0068E5]

                hover:shadow-[0_13px_30px_rgba(0,117,255,0.27)]

                sm:h-[45px]
                sm:px-[28px]
                sm:text-[10.5px]
              "
            >
              View All Updates
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}