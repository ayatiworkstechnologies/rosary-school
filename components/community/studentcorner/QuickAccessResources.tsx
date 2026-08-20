"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  HeartHandshake,
  ShieldCheck,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type ResourceItem = {
  id: number;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

/* =========================================================
   DATA
========================================================= */

const resources: ResourceItem[] = [
  {
    id: 1,
    title: "Academic Calendar",
    description:
      "Updated on key academic dates, exams, holidays, and school events.",
    href: "#",
    icon: CalendarDays,
  },
  {
    id: 2,
    title: "Student Support",
    description:
      "Get guidance for academics and student concerns.",
    href: "#",
    icon: HeartHandshake,
  },
  {
    id: 3,
    title: "School Rules",
    description:
      "View the official student code of conduct.",
    href: "#",
    icon: ShieldCheck,
  },
  {
    id: 4,
    title: "Alumni Network",
    description:
      "Reconnect, explore alumni activities and stay involved.",
    href: "#",
    icon: GraduationCap,
  },
];

/* =========================================================
   MOTION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const headingVariant = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.75,
      ease,
    },
  },
};

const cardVariant = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.8,
      ease,
    },
  },
};

/* =========================================================
   RESOURCE CARD
========================================================= */

function ResourceCard({
  item,
}: {
  item: ResourceItem;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{
        y: -5,
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
          min-h-[94px]
          w-full

          items-center

          gap-[14px]

          overflow-hidden

          rounded-[12px]

          border
          border-[#E7DDD0]

          bg-white

          px-[15px]
          py-[14px]

          shadow-[0_5px_16px_rgba(29,45,65,0.025)]

          transition-all
          duration-500

          hover:border-[#0075FF]/45
          hover:shadow-[0_14px_34px_rgba(0,117,255,0.10)]

          sm:min-h-[100px]
          sm:px-[17px]

          lg:min-h-[98px]
          lg:gap-[13px]
          lg:px-[15px]

          xl:px-[18px]
        "
      >
        {/* =================================================
            HOVER BACKGROUND
        ================================================= */}

        <span
          className="
            pointer-events-none
            absolute

            -right-[50px]
            -top-[60px]

            h-[120px]
            w-[120px]

            rounded-full

            bg-[#0075FF]/[0.035]

            opacity-0

            blur-[25px]

            transition-all
            duration-700

            group-hover:opacity-100
          "
        />

        {/* =================================================
            ICON
        ================================================= */}

        <motion.div
          className="
            relative
            z-10

            flex

            h-[42px]
            w-[42px]

            shrink-0

            items-center
            justify-center

            rounded-[10px]

            bg-[#EEF6FF]

            text-[#0075FF]

            transition-all
            duration-500

            group-hover:bg-[#0075FF]
            group-hover:text-white

            sm:h-[44px]
            sm:w-[44px]
          "
        >
          <Icon
            size={19}
            strokeWidth={2}
          />
        </motion.div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            relative
            z-10

            min-w-0
            flex-1
          "
        >
          <h3
            className="
              font-primary

              text-[14px]
              font-semibold

              leading-[1.2]

              tracking-[-0.2px]

              text-[#1C1C1C]

              sm:text-[14.5px]

              lg:text-[13px]

              xl:text-[14px]
            "
          >
            {item.title}
          </h3>

          <p
            className="
              mt-[5px]

              max-w-[220px]

              font-secondary

              text-[10.5px]

              leading-[1.35]

              text-[#838383]

              sm:text-[11px]

              lg:text-[9.5px]

              xl:text-[10.5px]
            "
          >
            {item.description}
          </p>
        </div>

        {/* =================================================
            HOVER ARROW
        ================================================= */}

        <motion.span
          className="
            absolute

            right-[13px]
            top-[13px]

            flex

            h-[25px]
            w-[25px]

            items-center
            justify-center

            rounded-full

            bg-[#EFF6FF]

            text-[#0075FF]

            opacity-0

            transition-all
            duration-400

            group-hover:opacity-100
          "
        >
          <ArrowUpRight
            size={13}
            strokeWidth={2}
          />
        </motion.span>

        {/* =================================================
            BOTTOM ACTIVE LINE
        ================================================= */}

        <span
          className="
            absolute
            bottom-0
            left-1/2

            h-[2px]
            w-0

            -translate-x-1/2

            bg-[#0075FF]

            transition-all
            duration-500

            group-hover:w-[64%]
          "
        />
      </Link>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function QuickAccessResources() {
  return (
    <section
      className="
        relative
        isolate

        w-full

        overflow-hidden

        bg-white

        py-[42px]

        sm:py-[50px]

        lg:py-[56px]
      "
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
          margin: "0px 0px -50px 0px",
        }}
        className="
          relative
          z-10

          mx-auto

          w-full
          max-w-[1240px]

          px-[16px]

          sm:px-[26px]

          md:px-[34px]

          lg:px-[42px]
        "
      >
        {/* =================================================
            HEADING
        ================================================= */}

        <motion.div
          variants={headingVariant}
          className="
            flex

            items-center
            justify-center

            text-center
          "
        >
          <span
            className="
              font-primary

              text-[11px]
              font-semibold

              uppercase

              tracking-[0.25px]

              text-[#0075FF]

              sm:text-[12px]

              lg:text-[11px]
            "
          >
            Quick Access Resources
          </span>
        </motion.div>

        {/* =================================================
            CARDS

            Mobile  = 1
            Tablet  = 2
            Desktop = 4
        ================================================= */}

        <motion.div
          variants={containerVariants}
          className="
            mt-[20px]

            grid
            grid-cols-1

            gap-[12px]

            sm:mt-[23px]
            sm:grid-cols-2
            sm:gap-[14px]

            lg:mt-[24px]
            lg:grid-cols-4
            lg:gap-[14px]

            xl:gap-[16px]
          "
        >
          {resources.map((item) => (
            <ResourceCard
              key={item.id}
              item={item}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}