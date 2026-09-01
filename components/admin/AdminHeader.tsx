"use client";

import {
  Bell,
  Menu,
  Search,
  ChevronDown,
} from "lucide-react";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header
      className="
        sticky top-0 z-30
        flex h-[72px]
        w-full
        items-center
        justify-between
        border-b border-[#E7ECF2]
        bg-white/90
        px-4
        backdrop-blur-xl
        sm:px-6
        lg:px-8
      "
    >
      {/* LEFT */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="
            flex h-[40px] w-[40px]
            items-center justify-center
            rounded-[10px]
            border border-[#E3E9F0]
            bg-white
            text-[#263244]
            shadow-sm
            lg:hidden
          "
        >
          <Menu size={19} />
        </button>

        <div className="hidden sm:block">
          <h1
            className="
              font-primary
              text-[18px]
              font-semibold
              text-[#111827]
            "
          >
            Admin Dashboard
          </h1>

          <p
            className="
              mt-[1px]
              font-secondary
              text-[11px]
              text-[#8C95A3]
            "
          >
            Manage Rosary School content
          </p>
        </div>

        <div className="block sm:hidden">
          <h1
            className="
              font-primary
              text-[16px]
              font-semibold
              text-[#111827]
            "
          >
            Dashboard
          </h1>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-2 sm:gap-3">
        {/* SEARCH */}

        <div
          className="
            hidden
            h-[40px]
            w-[220px]
            items-center
            gap-2
            rounded-[10px]
            border border-[#E5EAF0]
            bg-[#F8FAFC]
            px-3
            md:flex
          "
        >
          <Search size={16} className="text-[#8B95A5]" />

          <input
            type="text"
            placeholder="Search dashboard..."
            className="
              min-w-0 flex-1
              bg-transparent
              font-secondary
              text-[12px]
              text-[#344054]
              outline-none
              placeholder:text-[#9BA3AE]
            "
          />
        </div>

        {/* NOTIFICATION */}

        <button
          type="button"
          className="
            relative
            flex h-[40px] w-[40px]
            items-center justify-center
            rounded-[10px]
            border border-[#E5EAF0]
            bg-white
            text-[#5E6978]
            transition-all
            duration-300
            hover:border-[#BBD8FF]
            hover:bg-[#F3F8FF]
            hover:text-[#0075FF]
          "
        >
          <Bell size={18} />

          <span
            className="
              absolute right-[8px] top-[8px]
              h-[7px] w-[7px]
              rounded-full
              border-2 border-white
              bg-[#EF4444]
            "
          />
        </button>

        {/* ADMIN */}

        <button
          type="button"
          className="
            flex items-center
            gap-2
            rounded-[10px]
            p-[4px]
            pr-2
            transition-colors
            hover:bg-[#F6F8FA]
          "
        >
          <div
            className="
              flex h-[34px] w-[34px]
              items-center justify-center
              rounded-[9px]
              bg-[#0075FF]
              font-primary
              text-[12px]
              font-semibold
              text-white
            "
          >
            AD
          </div>

          <div className="hidden text-left sm:block">
            <p
              className="
                font-secondary
                text-[12px]
                font-semibold
                text-[#1F2937]
              "
            >
              Admin
            </p>

            <p
              className="
                text-[10px]
                text-[#98A1AE]
              "
            >
              Super Admin
            </p>
          </div>

          <ChevronDown
            size={14}
            className="hidden text-[#8C95A3] sm:block"
          />
        </button>
      </div>
    </header>
  );
}