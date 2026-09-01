"use client";

import { useState } from "react";
import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  BellRing,
  Images,
  UsersRound,
  Download,
  LogOut,
  X,
  School,
  LoaderCircle,
} from "lucide-react";


type AdminSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";


const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "News",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    label: "Circulars & Notices",
    href: "/admin/notices",
    icon: BellRing,
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    label: "Faculty",
    href: "/admin/faculty",
    icon: UsersRound,
  },
  {
    label: "Downloads",
    href: "/admin/downloads",
    icon: Download,
  },
];


export default function AdminSidebar({
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/auth/logout`,
        {
          method: "POST",

          /*
           * IMPORTANT
           *
           * Authentication is stored in an
           * HttpOnly cookie.
           *
           * credentials: "include"
           * allows the browser to send that cookie
           * to FastAPI so it can be removed.
           */
          credentials: "include",
        }
      );


      if (!response.ok) {
        throw new Error(
          `Logout failed with status ${response.status}`
        );
      }


      // Close mobile sidebar if open
      onClose();


      // Redirect to admin login
      router.replace(
        "/admin/login"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Admin logout failed:",
        error
      );

      setLoggingOut(false);
    }
  };


  // =========================================================
  // SIDEBAR CONTENT
  // =========================================================

  const SidebarContent = () => (
    <div className="flex h-full flex-col">

      {/* =====================================================
          LOGO
      ====================================================== */}

      <div
        className="
          flex
          h-[76px]
          items-center
          gap-3
          border-b
          border-[#E9EEF5]
          px-5
        "
      >
        <div
          className="
            flex
            h-[42px]
            w-[42px]
            items-center
            justify-center
            rounded-[12px]
            bg-[#0075FF]
            text-white
            shadow-[0_8px_20px_rgba(0,117,255,0.22)]
          "
        >
          <School
            size={22}
          />
        </div>


        <div className="min-w-0">

          <h2
            className="
              font-primary
              text-[16px]
              font-semibold
              text-[#111827]
            "
          >
            Rosary Admin
          </h2>


          <p
            className="
              mt-[1px]
              font-secondary
              text-[11px]
              text-[#8B95A5]
            "
          >
            School Management
          </p>

        </div>
      </div>


      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-3
          py-5
        "
      >
        <p
          className="
            mb-2
            px-3
            font-secondary
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-[#A0A8B5]
          "
        >
          Main Menu
        </p>


        <div className="space-y-[6px]">

          {menuItems.map(
            (item) => {

              const Icon =
                item.icon;


              const active =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );


              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group
                    relative

                    flex
                    min-h-[46px]

                    items-center
                    gap-3

                    overflow-hidden

                    rounded-[10px]

                    px-3

                    font-secondary
                    text-[13px]
                    font-medium

                    transition-all
                    duration-300

                    ${
                      active
                        ? "bg-[#EDF6FF] text-[#0075FF]"
                        : "text-[#5F6B7A] hover:bg-[#F6F8FB] hover:text-[#111827]"
                    }
                  `}
                >

                  {/* ACTIVE LEFT INDICATOR */}

                  {active && (
                    <motion.span
                      layoutId="admin-sidebar-active"
                      className="
                        absolute
                        left-0
                        top-1/2

                        h-[26px]
                        w-[3px]

                        -translate-y-1/2

                        rounded-r-full

                        bg-[#0075FF]
                      "
                    />
                  )}


                  {/* ICON */}

                  <span
                    className={`
                      flex
                      h-[32px]
                      w-[32px]
                      shrink-0

                      items-center
                      justify-center

                      rounded-[8px]

                      transition-all
                      duration-300

                      ${
                        active
                          ? "bg-white text-[#0075FF] shadow-sm"
                          : "bg-transparent text-[#7C8795] group-hover:bg-white"
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                    />
                  </span>


                  {/* LABEL */}

                  <span className="truncate">
                    {item.label}
                  </span>

                </Link>
              );
            }
          )}

        </div>
      </div>


      {/* =====================================================
          LOGOUT
      ====================================================== */}

      <div
        className="
          border-t
          border-[#E9EEF5]
          p-3
        "
      >
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            group

            flex
            min-h-[46px]
            w-full

            items-center
            gap-3

            rounded-[10px]

            px-3

            font-secondary
            text-[13px]
            font-medium

            text-[#E5484D]

            transition-all
            duration-300

            hover:bg-[#FFF2F2]

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          <span
            className="
              flex
              h-[32px]
              w-[32px]

              items-center
              justify-center

              rounded-[8px]

              bg-[#FFF4F4]

              transition-transform
              duration-300

              group-hover:scale-105
            "
          >

            {loggingOut ? (
              <LoaderCircle
                size={17}
                className="
                  animate-spin
                "
              />
            ) : (
              <LogOut
                size={17}
              />
            )}

          </span>


          {loggingOut
            ? "Logging out..."
            : "Logout"}

        </button>
      </div>

    </div>
  );


  return (
    <>

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside
        className="
          fixed
          left-0
          top-0
          z-40

          hidden

          h-screen
          w-[250px]

          border-r
          border-[#E7ECF2]

          bg-white

          lg:block
        "
      >
        <SidebarContent />
      </aside>


      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

      <AnimatePresence>

        {mobileOpen && (
          <>

            {/* OVERLAY */}

            <motion.button
              type="button"
              aria-label="Close sidebar"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={onClose}
              className="
                fixed
                inset-0
                z-[70]

                bg-[#111827]/35

                backdrop-blur-[2px]

                lg:hidden
              "
            />


            {/* SIDEBAR */}

            <motion.aside
              initial={{
                x: -280,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -280,
              }}
              transition={{
                duration: 0.35,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                fixed
                left-0
                top-0
                z-[80]

                h-screen
                w-[280px]

                bg-white

                shadow-[20px_0_50px_rgba(15,23,42,0.16)]

                lg:hidden
              "
            >

              {/* CLOSE */}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="
                  absolute
                  right-3
                  top-3
                  z-10

                  flex
                  h-[36px]
                  w-[36px]

                  items-center
                  justify-center

                  rounded-[9px]

                  border
                  border-[#E4EAF1]

                  bg-white

                  text-[#596579]

                  transition-all
                  duration-300

                  hover:border-[#BBD9FF]
                  hover:text-[#0075FF]
                "
              >
                <X
                  size={18}
                />
              </button>


              <SidebarContent />

            </motion.aside>

          </>
        )}

      </AnimatePresence>

    </>
  );
}