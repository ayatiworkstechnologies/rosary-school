"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  index?: number;
};

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  index = 0,
}: DashboardStatCardProps) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[16px]
        border border-[#E8EDF3]
        bg-white
        p-5
        shadow-[0_7px_24px_rgba(16,24,40,0.045)]
        transition-[box-shadow,border-color]
        duration-300
        hover:border-[#CFE4FF]
        hover:shadow-[0_14px_35px_rgba(0,117,255,0.09)]
      "
    >
      <div
        className="
          absolute left-0 top-0
          h-[3px] w-0
          bg-[#0075FF]
          transition-all duration-500
          group-hover:w-full
        "
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="
              font-secondary
              text-[12px]
              font-medium
              text-[#7A8595]
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-2
              font-primary
              text-[30px]
              font-semibold
              leading-none
              tracking-[-0.7px]
              text-[#111827]
            "
          >
            {value}
          </h3>
        </div>

        <div
          className="
            flex h-[44px] w-[44px]
            shrink-0
            items-center justify-center
            rounded-[12px]
            bg-[#EEF6FF]
            text-[#0075FF]
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:bg-[#0075FF]
            group-hover:text-white
          "
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      <p
        className="
          mt-4
          font-secondary
          text-[11px]
          text-[#98A1AE]
        "
      >
        {subtitle}
      </p>
    </motion.article>
  );
}