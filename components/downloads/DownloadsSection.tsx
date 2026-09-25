"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Clock3,
  Download,
  FileBarChart2,
  FileSpreadsheet,
  FileText,
  NotebookPen,
  TableProperties,
  type LucideIcon,
} from "lucide-react";

import {
  getPublicDownloadFileUrl,
  getPublicDownloadIconUrl,
  getPublicDownloads,
  sortPublicDownloads,
  type PublicDownload,
} from "@/services/publicDownloadService";


/* =========================================================
   TYPES
========================================================= */

type DownloadItem = {
  id: number;

  title: string;

  description: string;

  icon: LucideIcon;

  iconUrl: string | null;

  href: string;

  originalFileName: string | null;
};


/* =========================================================
   ICON MAP

   Database stores only:

   clock
   book
   calendar
   report
   clipboard
   spreadsheet
   exam
   handbook

   React component is selected here.
========================================================= */

const downloadIconMap: Record<
  string,
  LucideIcon
> = {
  clock: Clock3,

  book: BookOpen,

  calendar: CalendarDays,

  report: FileBarChart2,

  clipboard: ClipboardList,

  spreadsheet: FileSpreadsheet,

  exam: NotebookPen,

  handbook: TableProperties,
};


function getDownloadIcon(
  iconKey: string | null,
): LucideIcon {
  if (!iconKey) {
    return FileText;
  }

  return (
    downloadIconMap[
      iconKey
    ] || FileText
  );
}


/* =========================================================
   CONVERT API DATA TO CARD DATA
========================================================= */

function buildDownloadItems(
  apiItems: PublicDownload[],
): DownloadItem[] {
  return sortPublicDownloads(
    apiItems,
  ).map(
    (item) => ({
      id:
        item.id,

      title:
        item.title,

      description:
        item.description,

      icon:
        item.icon_type ===
        "lucide"
          ? getDownloadIcon(
              item.icon_key,
            )
          : FileText,

      iconUrl:
        item.icon_type ===
          "image" &&
        item.icon_url
          ? getPublicDownloadIconUrl(
              item.icon_url,
            )
          : null,

      href:
        getPublicDownloadFileUrl(
          item.file_url,
        ),

      originalFileName:
        item.original_file_name,
    }),
  );
}


/* =========================================================
   ANIMATION
========================================================= */

const ease = [
  0.22,
  1,
  0.36,
  1,
] as const;


const headingParent = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren:
        0.09,

      delayChildren:
        0.05,
    },
  },
};


const fadeUp = {
  hidden: {
    opacity: 0,

    y: 20,
  },

  visible: {
    opacity: 1,

    y: 0,

    transition: {
      duration:
        0.7,

      ease,
    },
  },
};


/* =========================================================
   DOWNLOAD CARD
========================================================= */

function DownloadCard({
  item,
  index,
}: {
  item: DownloadItem;

  index: number;
}) {
  const Icon =
    item.icon;


  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.965,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.2,
        margin:
          "0px 0px -25px 0px",
      }}
      transition={{
        duration:
          0.72,

        delay:
          index * 0.055,

        ease,
      }}
      whileHover={{
        y: -6,
      }}
      className="
        group
        relative
        flex
        h-[132px]
        w-full
        flex-col
        overflow-hidden
        rounded-[13px]
        border
        border-[#E4E9EF]
        bg-white
        px-[14px]
        pb-[11px]
        pt-[12px]
        shadow-[0_7px_20px_rgba(18,38,63,0.09)]
        transition-[border-color,box-shadow]
        duration-500
        hover:border-[#9DCDFF]
        hover:shadow-[0_16px_34px_rgba(0,117,255,0.14)]
        sm:h-[132px]
      "
    >
      {/* BLUE TOP LINE */}

      <div
        className="
          absolute
          left-0
          top-0
          h-[3px]
          w-full
          bg-[#0075FF]
        "
      />


      {/* HOVER BLUE LINE */}

      <div
        className="
          absolute
          left-0
          top-0
          h-[3px]
          w-0
          bg-[#68B2FF]
          transition-all
          duration-500
          group-hover:w-full
        "
      />


      {/* TITLE + ICON */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-[10px]
        "
      >
        <div
          className="
            min-w-0
            flex-1
          "
        >
          <h3
            className="
              font-primary
              text-[14px]
              font-semibold
              leading-[1.15]
              text-[#18212C]
              sm:text-[14.5px]
            "
          >
            {item.title}
          </h3>


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
              duration:
                0.55,

              delay:
                index *
                  0.04 +
                0.15,

              ease,
            }}
            className="
              mt-[4px]
              block
              h-[1px]
              w-[22px]
              origin-left
              bg-[#0075FF]
            "
          />
        </div>


        {/* ICON */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.72,
            rotate: -7,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration:
              0.55,

            delay:
              index *
                0.045 +
              0.12,

            ease,
          }}
          whileHover={{
            scale: 1.12,

            rotate: 6,
          }}
          className="
            flex
            h-[29px]
            w-[29px]
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-[#FFF08A]
            text-[#DDBD16]
            transition-shadow
            duration-300
            group-hover:shadow-[0_5px_14px_rgba(221,189,22,0.22)]
          "
        >
          {item.iconUrl ? (
            <img
              src={
                item.iconUrl
              }
              alt={`${item.title} icon`}
              className="
                h-[17px]
                w-[17px]
                object-contain
              "
            />
          ) : (
            <Icon
              size={14.5}
              strokeWidth={
                1.7
              }
            />
          )}
        </motion.div>
      </div>


      {/* DESCRIPTION */}

      <p
        className="
          mt-[9px]
          min-h-[34px]
          font-secondary
          text-[10.5px]
          leading-[1.5]
          text-[#717B87]
          sm:text-[11px]
        "
      >
        {item.description}
      </p>


      {/* DOWNLOAD BUTTON */}

      <motion.a
        href={
          item.href
        }
        download={
          item.originalFileName ||
          true
        }
        whileTap={{
          scale:
            0.97,
        }}
        className="
          group/download
          relative
          mt-auto
          flex
          h-[30px]
          w-full
          shrink-0
          items-center
          justify-center
          gap-[24px]
          overflow-hidden
          rounded-full
          border
          border-[#69ADFF]
          bg-white
          px-[12px]
          font-secondary
          text-[9.5px]
          font-medium
          !text-[#687583]
          no-underline
          shadow-[0_3px_9px_rgba(0,117,255,0.02)]
          transition-all
          duration-300
          hover:border-[#0075FF]
          hover:bg-[#0075FF]
          hover:!text-white
          hover:shadow-[0_8px_18px_rgba(0,117,255,0.20)]
        "
      >
        {/* SHINE */}

        <span
          className="
            pointer-events-none
            absolute
            -left-[50px]
            top-0
            h-full
            w-[35px]
            -skew-x-[20deg]
            bg-white/25
            transition-all
            duration-500
            group-hover/download:left-[110%]
          "
        />


        <span
          className="
            relative
            z-10
            transition-colors
            duration-300
            group-hover/download:!text-white
          "
        >
          Download
        </span>


        <Download
          size={13}
          strokeWidth={
            1.9
          }
          className="
            relative
            z-10
            text-[#0075FF]
            transition-all
            duration-300
            group-hover/download:translate-y-[2px]
            group-hover/download:!text-white
          "
        />
      </motion.a>
    </motion.article>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DownloadsSection() {
  const [
    downloads,
    setDownloads,
  ] = useState<
    DownloadItem[]
  >([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  /* =======================================================
     LOAD DOWNLOADS
  ======================================================= */

  useEffect(() => {
    let mounted =
      true;


    async function loadDownloads() {
      try {
        setLoading(
          true,
        );


        const response =
          await getPublicDownloads();


        if (
          !mounted
        ) {
          return;
        }


        setDownloads(
          buildDownloadItems(
            response.items ||
              [],
          ),
        );
      } catch (
        error
      ) {
        console.error(
          "Unable to load public Downloads:",
          error,
        );


        if (
          mounted
        ) {
          setDownloads(
            [],
          );
        }
      } finally {
        if (
          mounted
        ) {
          setLoading(
            false,
          );
        }
      }
    }


    loadDownloads();


    return () => {
      mounted =
        false;
    };
  }, []);


  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-white
        py-[38px]
        sm:py-[44px]
        lg:py-[48px]
      "
    >
      {/* DESKTOP BACKGROUND */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
          hidden
          bg-cover
          bg-center
          bg-no-repeat
          opacity-[0.88]
          lg:block
        "
        style={{
          backgroundImage:
            "url('/images/academics-bg.png')",
        }}
      />


      {/* WHITE OVERLAY */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-white/55
          lg:bg-white/16
        "
      />


      {/* CONTAINER */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1080px]
          px-[18px]
          sm:px-[24px]
          lg:px-[20px]
        "
      >
        {/* HEADER */}

        <motion.div
          variants={
            headingParent
          }
          initial="hidden"
          whileInView="visible"
          viewport={{
            once:
              true,

            amount:
              0.4,
          }}
          className="
            mx-auto
            max-w-[460px]
            text-center
          "
        >
          <motion.span
            variants={
              fadeUp
            }
            className="
              inline-flex
              rounded-[3px]
              bg-[#EEF6FF]
              px-[7px]
              py-[3px]
              font-secondary
              text-[8px]
              font-medium
              text-[#0075FF]
              sm:text-[9px]
            "
          >
            Downloads
          </motion.span>


          <motion.h2
            variants={
              fadeUp
            }
            className="
              mt-[8px]
              font-primary
              text-[28px]
              font-semibold
              leading-[1.08]
              tracking-[-0.5px]
              text-[#111827]
              sm:text-[31px]
              lg:text-[32px]
            "
          >
            Downloads
          </motion.h2>


          <motion.p
            variants={
              fadeUp
            }
            className="
              mx-auto
              mt-[7px]
              max-w-[390px]
              font-secondary
              text-[10.5px]
              leading-[1.55]
              text-[#89919A]
              sm:text-[11.5px]
            "
          >
            Access and
            download essential
            school documents,
            forms, and resources
            all in one place.
          </motion.p>
        </motion.div>


        {/* DOWNLOAD GRID */}

        <div
          className="
            mx-auto
            mt-[27px]
            grid
            w-full
            grid-cols-1
            items-stretch
            gap-[17px]
            sm:grid-cols-2
            sm:gap-[19px]
            lg:mt-[30px]
            lg:grid-cols-4
            lg:gap-x-[44px]
            lg:gap-y-[26px]
          "
        >
          {loading ? (
            <>
              {Array.from({
                length: 8,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="
                      h-[132px]
                      animate-pulse
                      rounded-[13px]
                      border
                      border-[#E4E9EF]
                      bg-white/80
                    "
                  />
                ),
              )}
            </>
          ) : (
            downloads.map(
              (
                item,
                index,
              ) => (
                <DownloadCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  index={
                    index
                  }
                />
              ),
            )
          )}
        </div>


        {/* EMPTY STATE */}

        {!loading &&
          downloads.length ===
            0 && (
            <motion.div
              initial={{
                opacity:
                  0,

                y: 12,
              }}
              animate={{
                opacity:
                  1,

                y: 0,
              }}
              className="
                mx-auto
                mt-[28px]
                max-w-[420px]
                rounded-[12px]
                border
                border-dashed
                border-[#DCE6EF]
                bg-white/80
                px-5
                py-7
                text-center
              "
            >
              <FileText
                size={22}
                className="
                  mx-auto
                  text-[#0075FF]
                "
              />

              <p
                className="
                  mt-3
                  font-secondary
                  text-[11px]
                  text-[#7B8797]
                "
              >
                Downloads
                will be
                available
                here soon.
              </p>
            </motion.div>
          )}


        {/* BOTTOM SUPPORT */}

        <motion.div
          initial={{
            opacity:
              0,

            y: 26,
          }}
          whileInView={{
            opacity:
              1,

            y: 0,
          }}
          viewport={{
            once:
              true,

            amount:
              0.25,
          }}
          transition={{
            duration:
              0.8,

            ease,
          }}
          className="
            mx-auto
            mt-[32px]
            w-full
            pt-[15px]
            sm:mt-[36px]
            lg:mt-[38px]
            lg:pt-[17px]
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              gap-[15px]
              text-center
              md:flex-row
              md:items-center
              md:text-left
            "
          >
            {/* SUPPORT IMAGE */}

            <motion.div
              initial={{
                opacity:
                  0,

                x: -20,

                scale:
                  0.9,
              }}
              whileInView={{
                opacity:
                  1,

                x: 0,

                scale:
                  1,
              }}
              viewport={{
                once:
                  true,
              }}
              transition={{
                duration:
                  0.7,

                ease,
              }}
              whileHover={{
                y: -4,

                scale:
                  1.03,
              }}
              className="
                relative
                h-[88px]
                w-[100px]
                shrink-0
                sm:h-[94px]
                sm:w-[108px]
                lg:h-[98px]
                lg:w-[112px]
              "
            >
              <Image
                src="/images/download-support.png"
                alt="Download support"
                fill
                sizes="112px"
                className="
                  object-contain
                  object-center
                "
              />
            </motion.div>


            {/* SUPPORT TEXT */}

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <motion.h3
                initial={{
                  opacity:
                    0,

                  y: 12,
                }}
                whileInView={{
                  opacity:
                    1,

                  y: 0,
                }}
                viewport={{
                  once:
                    true,
                }}
                transition={{
                  duration:
                    0.7,

                  delay:
                    0.08,

                  ease,
                }}
                className="
                  font-primary
                  text-[23px]
                  font-semibold
                  leading-[1.12]
                  tracking-[-0.35px]
                  text-[#141922]
                  sm:text-[26px]
                  lg:text-[28px]
                "
              >
                Can&apos;t
                find what you
                need?
              </motion.h3>


              <motion.p
                initial={{
                  opacity:
                    0,

                  y: 10,
                }}
                whileInView={{
                  opacity:
                    1,

                  y: 0,
                }}
                viewport={{
                  once:
                    true,
                }}
                transition={{
                  duration:
                    0.7,

                  delay:
                    0.14,

                  ease,
                }}
                className="
                  mt-[6px]
                  max-w-[600px]
                  font-secondary
                  text-[11px]
                  leading-[1.55]
                  text-[#8B939C]
                  sm:text-[12px]
                "
              >
                If you&apos;re
                looking for a
                specific document
                or need any
                assistance, our
                school office is
                here to help.
              </motion.p>
            </div>


            {/* CONTACT BUTTON */}

            <motion.div
              initial={{
                opacity:
                  0,

                x: 20,
              }}
              whileInView={{
                opacity:
                  1,

                x: 0,
              }}
              viewport={{
                once:
                  true,
              }}
              transition={{
                duration:
                  0.7,

                delay:
                  0.18,

                ease,
              }}
              className="
                w-full
                md:w-auto
                md:shrink-0
              "
            >
              <motion.div
                whileHover={{
                  y: -3,
                }}
                whileTap={{
                  scale:
                    0.97,
                }}
              >
                <Link
                  href="/contact-us"
                  className="
                    group/contact
                    relative
                    flex
                    h-[43px]
                    w-full
                    items-center
                    justify-center
                    gap-[14px]
                    overflow-hidden
                    rounded-full
                    bg-[#0075FF]
                    px-[22px]
                    font-secondary
                    text-[11px]
                    font-medium
                    !text-white
                    shadow-[0_10px_22px_rgba(0,117,255,0.20)]
                    transition-all
                    duration-300
                    hover:bg-[#0068E5]
                    hover:shadow-[0_14px_30px_rgba(0,117,255,0.30)]
                    md:min-w-[205px]
                    sm:text-[12px]
                  "
                >
                  <span
                    className="
                      relative
                      z-10
                    "
                  >
                    Contact
                    School Office
                  </span>


                  <ArrowRight
                    size={15}
                    strokeWidth={
                      2
                    }
                    className="
                      relative
                      z-10
                      transition-transform
                      duration-300
                      group-hover/contact:translate-x-[5px]
                    "
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}