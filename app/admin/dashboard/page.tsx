"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Newspaper,
  CalendarDays,
  BellRing,
  Images,
  UsersRound,
  Download,
  Plus,
  ArrowRight,
  Clock3,
} from "lucide-react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import DashboardStatCard from "../../../components/admin/DashboardStatCard";
import AdminAuthGuard from "../../../components/admin/AdminAuthGuard";


const stats = [
  {
    title: "News",
    value: 12,
    subtitle: "Published news articles",
    icon: Newspaper,
  },
  {
    title: "Events",
    value: 8,
    subtitle: "Upcoming school events",
    icon: CalendarDays,
  },
  {
    title: "Notices",
    value: 15,
    subtitle: "Circulars and notices",
    icon: BellRing,
  },
  {
    title: "Gallery",
    value: 24,
    subtitle: "Gallery collections",
    icon: Images,
  },
  {
    title: "Faculty",
    value: 38,
    subtitle: "Faculty members",
    icon: UsersRound,
  },
  {
    title: "Downloads",
    value: 8,
    subtitle: "Downloadable resources",
    icon: Download,
  },
];


const quickActions = [
  {
    title: "Add News",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Create Event",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    title: "Add Notice",
    href: "/admin/circular-notices",
    icon: BellRing,
  },
  {
    title: "Upload Gallery",
    href: "/admin/gallery",
    icon: Images,
  },
];


const recentActivities = [
  {
    title: "Annual Sports Day news published",
    module: "News",
    time: "10 minutes ago",
  },
  {
    title: "Parent-Teacher Meeting updated",
    module: "Events",
    time: "35 minutes ago",
  },
  {
    title: "September circular uploaded",
    module: "Notices",
    time: "2 hours ago",
  },
  {
    title: "Faculty information updated",
    module: "Faculty",
    time: "Yesterday",
  },
];


export default function AdminDashboardPage() {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


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

                  xl:grid-cols-3

                  2xl:grid-cols-6
                "
              >
                {stats.map(
                  (item, index) => (
                    <DashboardStatCard
                      key={item.title}
                      {...item}
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


                  <button
                    type="button"
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
                  </button>

                </div>


                <div className="mt-4">

                  {recentActivities.map(
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