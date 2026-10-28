"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import {
  Bell,
  LogOut,
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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  async function logout() { setLoggingOut(true); await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/backend"}/api/v1/admin/auth/logout`, { method: "POST", credentials: "include" }); router.replace("/admin/login"); router.refresh(); }
  function searchModule() { const term = search.toLowerCase(); const route = term.includes("admission") ? "/admin/admissions" : term.includes("contact") ? "/admin/contact-enquiries" : term.includes("news") ? "/admin/news" : term.includes("event") ? "/admin/events" : term.includes("notice") ? "/admin/circular-notices" : term.includes("gallery") ? "/admin/gallery" : term.includes("faculty") ? "/admin/faculty" : term.includes("download") ? "/admin/downloads" : term.includes("achievement") ? "/admin/achievements" : term.includes("newsletter") ? "/admin/newsletter" : "/admin/dashboard"; router.push(route); }
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
            value={search}
            onChange={event => setSearch(event.target.value)}
            onKeyDown={event => { if (event.key === "Enter") searchModule(); }}
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

        <div className="relative"><button
          type="button"
          onClick={() => { setNotificationsOpen(value => !value); setAccountOpen(false); }}
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
        </button><AnimatePresence>{notificationsOpen && <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.18 }} className="absolute right-0 top-12 z-50 w-72 origin-top-right rounded-xl border border-slate-200 bg-white p-3 shadow-xl"><p className="px-2 py-1 text-sm font-semibold text-slate-800">Notifications</p><button onClick={() => router.push("/admin/admissions")} className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">Review admission applications</button><button onClick={() => router.push("/admin/contact-enquiries")} className="w-full rounded-lg px-2 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">Review contact enquiries</button><button onClick={() => router.push("/admin/newsletter")} className="w-full rounded-lg px-2 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">Manage newsletter subscribers</button></motion.div>}</AnimatePresence></div>

        <div className="relative">{/* ADMIN */}

        <button
          type="button"
          onClick={() => { setAccountOpen(value => !value); setNotificationsOpen(false); }}
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
        </button><AnimatePresence>{accountOpen && <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.18 }} className="absolute right-0 top-12 z-50 w-44 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl"><button disabled={loggingOut} onClick={() => void logout()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"><LogOut size={16}/>{loggingOut ? "Signing out..." : "Sign out"}</button></motion.div>}</AnimatePresence></div>
      </div>
    </header>
  );
}
