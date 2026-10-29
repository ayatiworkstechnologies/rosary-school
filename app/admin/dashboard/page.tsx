"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Newspaper,
  CalendarDays,
  BellRing,
  Images,
  UsersRound,
  Download,
  Trophy,
  ClipboardList,
  MessageSquare,
  MailPlus,
  Plus,
  ArrowRight,
  Clock3,
} from "lucide-react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import DashboardStatCard from "../../../components/admin/DashboardStatCard";
import AdminAuthGuard from "../../../components/admin/AdminAuthGuard";
import { getAdminNews } from "@/services/adminNewsService";
import { getAdminEvents } from "@/services/adminEventService";
import { getAdminCircularNotices } from "@/services/adminCircularNoticeService";
import { getAdminGalleryAlbums } from "@/services/adminGalleryService";
import { getAdminFacultyMembers } from "@/services/adminFacultyService";
import { getAdminDownloads } from "@/services/adminDownloadService";
import { getAdminAchievements } from "@/services/adminAchievementService";
import { getAdmissions, getContacts } from "@/services/adminSubmissionService";
import { getNewsletterSubscriptions } from "@/services/adminNewsletterService";


const stats = [
  {
    title: "News",
    value: 12,
    subtitle: "Published news articles",
    icon: Newspaper,
    href: "/admin/news",
  },
  {
    title: "Events",
    value: 8,
    subtitle: "Upcoming school events",
    icon: CalendarDays,
    href: "/admin/events",
  },
  {
    title: "Notices",
    value: 15,
    subtitle: "Circulars and notices",
    icon: BellRing,
    href: "/admin/circular-notices",
  },
  {
    title: "Gallery",
    value: 24,
    subtitle: "Gallery collections",
    icon: Images,
    href: "/admin/gallery",
  },
  {
    title: "Faculty",
    value: 38,
    subtitle: "Faculty members",
    icon: UsersRound,
    href: "/admin/faculty",
  },
  {
    title: "Downloads",
    value: 8,
    subtitle: "Downloadable resources",
    icon: Download,
    href: "/admin/downloads",
  },
  {
    title: "Achievements",
    value: 0,
    subtitle: "School achievements",
    icon: Trophy,
    href: "/admin/achievements",
  },
  {
    title: "Admissions",
    value: 0,
    subtitle: "Admission applications",
    icon: ClipboardList,
    href: "/admin/admissions",
  },
  {
    title: "Contact Enquiries",
    value: 0,
    subtitle: "Website enquiries",
    icon: MessageSquare,
    href: "/admin/contact-enquiries",
  },
  {
    title: "Newsletter",
    value: 0,
    subtitle: "Newsletter subscribers",
    icon: MailPlus,
    href: "/admin/newsletter",
  },
];


const quickActions = [
  {
    title: "Add News",
    href: "/admin/news/new",
    icon: Newspaper,
  },
  {
    title: "Create Event",
    href: "/admin/events/new",
    icon: CalendarDays,
  },
  {
    title: "Add Notice",
    href: "/admin/circular-notices/new",
    icon: BellRing,
  },
  {
    title: "Upload Gallery",
    href: "/admin/gallery/new",
    icon: Images,
  },
];


type Activity = { title: string; module: string; time: string; createdAt: string };
const recentActivities: Activity[] = [
  {
    title: "Annual Sports Day news published",
    module: "News",
    time: "10 minutes ago", createdAt: "",
  },
  {
    title: "Parent-Teacher Meeting updated",
    module: "Events",
    time: "35 minutes ago", createdAt: "",
  },
  {
    title: "September circular uploaded",
    module: "Notices",
    time: "2 hours ago", createdAt: "",
  },
  {
    title: "Faculty information updated",
    module: "Faculty",
    time: "Yesterday", createdAt: "",
  },
];


export default function AdminDashboardPage() {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);
  const [liveCounts, setLiveCounts] = useState<Record<string, number>>({});
  const [activities, setActivities] = useState<Activity[]>(recentActivities);

  useEffect(() => {
    let active = true;
    const relativeTime = (date: string) => {
      const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
      if (seconds < 60) return "Just now";
      if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
      return `${Math.floor(seconds / 86400)} days ago`;
    };
    void Promise.all([
      getAdminNews({ page: 1, limit: 100 }), getAdminEvents({ page: 1, limit: 100 }),
      getAdminCircularNotices({ page: 1, limit: 100 }), getAdminGalleryAlbums({ page: 1, limit: 100 }),
      getAdminFacultyMembers({ page: 1, limit: 100 }), getAdminDownloads({ page: 1, limit: 100 }),
      getAdminAchievements({ page: 1, limit: 100 }),
      getAdmissions("", 1, 1), getContacts("", 1, 1), getNewsletterSubscriptions("", 1, 1),
    ]).then(([news, events, notices, gallery, faculty, downloads, achievements, admissions, contacts, newsletter]) => {
      if (!active) return;
      setLiveCounts({
        News: news.total,
        Events: events.total,
        Notices: notices.total,
        Gallery: gallery.total,
        Faculty: faculty.total,
        Downloads: downloads.total,
        Achievements: achievements.total,
        Admissions: admissions.total,
        "Contact Enquiries": contacts.total,
        Newsletter: newsletter.total,
      });
      const latest: Activity[] = [
        ...news.items.map(item => ({ title: `${item.title} ${item.created_at === item.updated_at ? "created" : "updated"}`, module: "News", createdAt: item.updated_at, time: relativeTime(item.updated_at) })),
        ...events.items.map(item => ({ title: `${item.title} ${item.created_at === item.updated_at ? "created" : "updated"}`, module: "Events", createdAt: item.updated_at, time: relativeTime(item.updated_at) })),
        ...notices.items.map(item => ({ title: `${item.title} ${item.created_at === item.updated_at ? "created" : "updated"}`, module: "Notices", createdAt: item.updated_at, time: relativeTime(item.updated_at) })),
        ...gallery.items.map(item => ({ title: `${item.title} ${item.created_at === item.updated_at ? "created" : "updated"}`, module: "Gallery", createdAt: item.updated_at, time: relativeTime(item.updated_at) })),
        ...faculty.items.map(item => ({ title: `${item.name} ${item.created_at === item.updated_at ? "created" : "updated"}`, module: "Faculty", createdAt: item.updated_at, time: relativeTime(item.updated_at) })),
        ...downloads.items.map(item => ({ title: `${item.title} ${item.created_at === item.updated_at ? "created" : "updated"}`, module: "Downloads", createdAt: item.updated_at, time: relativeTime(item.updated_at) })),
        ...achievements.items.map(item => ({ title: `${item.title} ${item.created_at === item.updated_at ? "created" : "updated"}`, module: "Achievements", createdAt: item.updated_at, time: relativeTime(item.updated_at) })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
      if (latest.length) setActivities(latest);
    }).catch(() => { /* The dashboard keeps its fallback display if an API is temporarily unavailable. */ });
    return () => { active = false; };
  }, []);


  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F7F9FC]">

        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() =>
            setMobileSidebarOpen(false)
          }
        />


        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="min-h-screen lg:pl-[250px]">

          <AdminHeader
            onMenuClick={() =>
              setMobileSidebarOpen(true)
            }
          />


          <main
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-4
              py-6

              sm:px-6
              sm:py-7

              lg:px-8
              lg:py-8
            "
          >

            {/* =================================================
                WELCOME SECTION
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                flex
                flex-col
                gap-4

                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>

                <p
                  className="
                    font-secondary
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.08em]
                    text-[#0075FF]
                  "
                >
                  Overview
                </p>


                <h2
                  className="
                    mt-2
                    font-primary
                    text-[26px]
                    font-semibold
                    leading-[1.15]
                    tracking-[-0.5px]
                    text-[#111827]

                    sm:text-[30px]
                  "
                >
                  Welcome back, Admin 👋
                </h2>


                <p
                  className="
                    mt-2
                    max-w-[620px]
                    font-secondary
                    text-[12px]
                    leading-[1.6]
                    text-[#7B8797]

                    sm:text-[13px]
                  "
                >
                  Manage Rosary School&apos;s website
                  content, updates and resources from
                  one place.
                </p>

              </div>


              <Link
                href="/"
                target="_blank"
                className="
                  inline-flex
                  h-[42px]
                  items-center
                  justify-center
                  gap-2

                  rounded-[10px]

                  border
                  border-[#DDE6F0]

                  bg-white

                  px-4

                  font-secondary
                  text-[12px]
                  font-medium
                  text-[#344054]

                  shadow-sm

                  transition-all
                  duration-300

                  hover:border-[#A7CFFF]
                  hover:text-[#0075FF]
                "
              >
                View Website

                <ArrowRight
                  size={14}
                />
              </Link>
            </motion.div>


            {/* =================================================
                STATS
            ================================================= */}

            <section className="mt-7">

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4

                  sm:grid-cols-2

                  lg:grid-cols-4
                "
              >
                {stats.map(
                  (item, index) => (
                    <DashboardStatCard
                      key={item.title}
                      {...item}
                      value={liveCounts[item.title] ?? "—"}
                      index={index}
                    />
                  )
                )}
              </div>

            </section>


            {/* =================================================
                LOWER GRID
            ================================================= */}

            <section
              className="
                mt-7
                grid
                grid-cols-1
                gap-5

                xl:grid-cols-[1fr_1.35fr]
              "
            >

              {/* ===============================================
                  QUICK ACTIONS
              ================================================ */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.25,
                }}
                className="
                  rounded-[16px]

                  border
                  border-[#E7ECF2]

                  bg-white

                  p-5

                  shadow-[0_7px_24px_rgba(16,24,40,0.04)]
                "
              >
                <div>

                  <h3
                    className="
                      font-primary
                      text-[17px]
                      font-semibold
                      text-[#111827]
                    "
                  >
                    Quick Actions
                  </h3>


                  <p
                    className="
                      mt-1
                      font-secondary
                      text-[11px]
                      text-[#919AA7]
                    "
                  >
                    Add new website content quickly.
                  </p>

                </div>


                <div
                  className="
                    mt-5
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2
                  "
                >
                  {quickActions.map(
                    (action) => {

                      const Icon =
                        action.icon;


                      return (
                        <Link
                          key={
                            action.title
                          }
                          href={
                            action.href
                          }
                          className="
                            group

                            flex
                            min-h-[74px]
                            items-center
                            gap-3

                            rounded-[12px]

                            border
                            border-[#E6ECF2]

                            bg-[#FAFBFD]

                            p-3

                            transition-all
                            duration-300

                            hover:-translate-y-[2px]
                            hover:border-[#BBD9FF]
                            hover:bg-[#F3F8FF]
                          "
                        >
                          <span
                            className="
                              flex
                              h-[40px]
                              w-[40px]
                              shrink-0

                              items-center
                              justify-center

                              rounded-[10px]

                              bg-white

                              text-[#0075FF]

                              shadow-sm

                              transition-all

                              group-hover:bg-[#0075FF]
                              group-hover:text-white
                            "
                          >
                            <Icon
                              size={18}
                            />
                          </span>


                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <p
                              className="
                                font-secondary
                                text-[12px]
                                font-semibold
                                text-[#263244]
                              "
                            >
                              {action.title}
                            </p>


                            <p
                              className="
                                mt-[2px]
                                text-[10px]
                                text-[#97A0AC]
                              "
                            >
                              Create new content
                            </p>
                          </div>


                          <Plus
                            size={15}
                            className="
                              text-[#A0A9B5]

                              transition-transform
                              duration-300

                              group-hover:rotate-90
                              group-hover:text-[#0075FF]
                            "
                          />

                        </Link>
                      );
                    }
                  )}
                </div>

              </motion.div>


              {/* ===============================================
                  RECENT ACTIVITY
              ================================================ */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.32,
                }}
                className="
                  rounded-[16px]

                  border
                  border-[#E7ECF2]

                  bg-white

                  p-5

                  shadow-[0_7px_24px_rgba(16,24,40,0.04)]
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  <div>

                    <h3
                      className="
                        font-primary
                        text-[17px]
                        font-semibold
                        text-[#111827]
                      "
                    >
                      Recent Activity
                    </h3>


                    <p
                      className="
                        mt-1
                        font-secondary
                        text-[11px]
                        text-[#919AA7]
                      "
                    >
                      Latest admin content changes.
                    </p>

                  </div>


                  <Link
                    href="/admin/news"
                    className="
                      font-secondary
                      text-[11px]
                      font-medium
                      text-[#0075FF]

                      transition-opacity

                      hover:opacity-70
                    "
                  >
                    View all
                  </Link>

                </div>


                <div className="mt-4">

                  {activities.map(
                    (
                      activity,
                      index
                    ) => (
                      <div
                        key={
                          activity.title
                        }
                        className={`
                          flex
                          items-start
                          gap-3
                          py-3

                          ${
                            index !==
                            recentActivities.length -
                              1
                              ? "border-b border-[#EEF1F4]"
                              : ""
                          }
                        `}
                      >

                        <div
                          className="
                            mt-[2px]

                            flex
                            h-[34px]
                            w-[34px]
                            shrink-0

                            items-center
                            justify-center

                            rounded-[9px]

                            bg-[#EEF6FF]

                            text-[#0075FF]
                          "
                        >
                          <Clock3
                            size={15}
                          />
                        </div>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              font-secondary
                              text-[12px]
                              font-medium
                              leading-[1.4]
                              text-[#344054]
                            "
                          >
                            {activity.title}
                          </p>


                          <div
                            className="
                              mt-[5px]

                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >

                            <span
                              className="
                                rounded-full

                                bg-[#F0F6FF]

                                px-2
                                py-[3px]

                                text-[9px]
                                font-medium
                                text-[#0075FF]
                              "
                            >
                              {
                                activity.module
                              }
                            </span>


                            <span
                              className="
                                text-[10px]
                                text-[#98A1AE]
                              "
                            >
                              {
                                activity.time
                              }
                            </span>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </motion.div>

            </section>

          </main>

        </div>

      </div>
    </AdminAuthGuard>
  );
}
