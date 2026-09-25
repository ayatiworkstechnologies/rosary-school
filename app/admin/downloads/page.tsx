"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleSlash2,
  ClipboardList,
  Clock3,
  Download,
  ExternalLink,
  FileBarChart2,
  FileSpreadsheet,
  FileText,
  Loader2,
  NotebookPen,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  TableProperties,
  Trash2,
} from "lucide-react";

import AdminAuthGuard from "../../../components/admin/AdminAuthGuard";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";

import {
  deleteDownload,
  formatDownloadFileSize,
  getAdminDownloads,
  getDownloadAssetUrl,
  type AdminDownload,
  type DownloadIconType,
  updateDownloadStatus,
} from "../../../services/adminDownloadService";


/* =========================================================
   LUCIDE ICON MAP

   Database stores only a key such as:
   clock
   book
   calendar

   It does NOT store React components.
========================================================= */

const downloadIcons = {
  clock: Clock3,
  book: BookOpen,
  calendar: CalendarDays,
  report: FileBarChart2,
  clipboard: ClipboardList,
  spreadsheet: FileSpreadsheet,
  exam: NotebookPen,
  handbook: TableProperties,
} as const;


/* =========================================================
   TYPES
========================================================= */

type StatusFilter =
  | "all"
  | "active"
  | "inactive";

type IconFilter =
  | "all"
  | DownloadIconType;


/* =========================================================
   GET ICON COMPONENT
========================================================= */

function getLucideIcon(
  iconKey: string | null,
) {
  if (!iconKey) {
    return FileText;
  }

  return (
    downloadIcons[
      iconKey as keyof typeof downloadIcons
    ] || FileText
  );
}


/* =========================================================
   ICON PREVIEW
========================================================= */

function DownloadIconPreview({
  item,
}: {
  item: AdminDownload;
}) {
  if (
    item.icon_type === "image" &&
    item.icon_url
  ) {
    return (
      <div
        className="
          flex
          h-[46px]
          w-[46px]
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-[12px]
          border
          border-[#E6ECF3]
          bg-white
        "
      >
        <img
          src={getDownloadAssetUrl(
            item.icon_url,
          )}
          alt={`${item.title} icon`}
          className="
            h-full
            w-full
            object-contain
            p-2
          "
        />
      </div>
    );
  }

  const Icon =
    getLucideIcon(
      item.icon_key,
    );

  return (
    <div
      className="
        flex
        h-[46px]
        w-[46px]
        shrink-0
        items-center
        justify-center
        rounded-[12px]
        bg-[#EAF4FF]
        text-[#0075FF]
      "
    >
      <Icon size={21} />
    </div>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  if (active) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          bg-[#ECFDF3]
          px-2.5
          py-1
          text-[11px]
          font-semibold
          text-[#027A48]
        "
      >
        <CheckCircle2 size={13} />

        Active
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        bg-[#F2F4F7]
        px-2.5
        py-1
        text-[11px]
        font-semibold
        text-[#667085]
      "
    >
      <CircleSlash2 size={13} />

      Inactive
    </span>
  );
}


/* =========================================================
   MAIN PAGE
========================================================= */

export default function AdminDownloadsPage() {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const [
    downloads,
    setDownloads,
  ] = useState<
    AdminDownload[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>(
    "all",
  );

  const [
    iconFilter,
    setIconFilter,
  ] = useState<IconFilter>(
    "all",
  );

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    number | null
  >(null);

  const [
    statusUpdatingId,
    setStatusUpdatingId,
  ] = useState<
    number | null
  >(null);


  /* =======================================================
     LOAD DOWNLOADS
  ======================================================= */

  const loadDownloads =
    useCallback(
      async (
        isRefresh = false,
      ) => {
        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError("");

          const response =
            await getAdminDownloads({
              page: 1,
              limit: 100,
            });

          setDownloads(
            response.items || [],
          );
        } catch (err) {
          console.error(
            "Downloads load error:",
            err,
          );

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load downloads.",
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [],
    );


  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);


  /* =======================================================
     FILTERED ITEMS
  ======================================================= */

  const filteredDownloads =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return downloads.filter(
        (item) => {
          const matchesSearch =
            !query ||
            item.title
              .toLowerCase()
              .includes(query) ||
            item.description
              .toLowerCase()
              .includes(query) ||
            (
              item.original_file_name ||
              ""
            )
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === "all" ||
            (
              statusFilter ===
                "active" &&
              item.is_active
            ) ||
            (
              statusFilter ===
                "inactive" &&
              !item.is_active
            );

          const matchesIcon =
            iconFilter === "all" ||
            item.icon_type ===
              iconFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesIcon
          );
        },
      );
    }, [
      downloads,
      search,
      statusFilter,
      iconFilter,
    ]);


  /* =======================================================
     COUNTS
  ======================================================= */

  const activeCount =
    useMemo(
      () =>
        downloads.filter(
          (item) =>
            item.is_active,
        ).length,
      [downloads],
    );

  const inactiveCount =
    downloads.length -
    activeCount;


  /* =======================================================
     TOGGLE STATUS
  ======================================================= */

  async function handleStatusToggle(
    item: AdminDownload,
  ) {
    try {
      setStatusUpdatingId(
        item.id,
      );

      setError("");

      const updated =
        await updateDownloadStatus(
          item.id,
          !item.is_active,
        );

      setDownloads(
        (current) =>
          current.map(
            (download) =>
              download.id ===
              updated.id
                ? updated
                : download,
          ),
      );
    } catch (err) {
      console.error(
        "Download status error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update status.",
      );
    } finally {
      setStatusUpdatingId(
        null,
      );
    }
  }


  /* =======================================================
     DELETE
  ======================================================= */

  async function handleDelete(
    item: AdminDownload,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${item.title}"?\n\nThis will also remove its uploaded PDF and custom icon file.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        item.id,
      );

      setError("");

      await deleteDownload(
        item.id,
      );

      setDownloads(
        (current) =>
          current.filter(
            (download) =>
              download.id !==
              item.id,
          ),
      );
    } catch (err) {
      console.error(
        "Download delete error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete download.",
      );
    } finally {
      setDeletingId(
        null,
      );
    }
  }


  /* =======================================================
     UI
  ======================================================= */

  return (
    <AdminAuthGuard>
      <div
        className="
          min-h-screen
          bg-[#F7F9FC]
        "
      >
        {/* SIDEBAR */}

        <AdminSidebar
          mobileOpen={
            mobileSidebarOpen
          }
          onClose={() =>
            setMobileSidebarOpen(
              false,
            )
          }
        />


        {/* MAIN */}

        <div
          className="
            min-h-screen
            lg:pl-[250px]
          "
        >
          <AdminHeader
            onMenuClick={() =>
              setMobileSidebarOpen(
                true,
              )
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
            {/* PAGE HEADER */}

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
                duration: 0.55,
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
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-[#0075FF]
                  "
                >
                  Website Content
                </p>

                <h1
                  className="
                    mt-2
                    font-primary
                    text-[26px]
                    font-semibold
                    tracking-[-0.5px]
                    text-[#111827]
                    sm:text-[30px]
                  "
                >
                  Downloads
                </h1>

                <p
                  className="
                    mt-2
                    max-w-[650px]
                    font-secondary
                    text-[12px]
                    leading-[1.6]
                    text-[#7B8797]
                    sm:text-[13px]
                  "
                >
                  Manage downloadable
                  school resources,
                  PDFs, icons and their
                  display order.
                </p>
              </div>


              <Link
                href="/admin/downloads/new"
                className="
                  inline-flex
                  h-[43px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[10px]
                  bg-[#0075FF]
                  px-5
                  font-secondary
                  text-[12px]
                  font-semibold
                  !text-white
                  shadow-[0_8px_22px_rgba(0,117,255,0.22)]
                  transition-all
                  hover:bg-[#0068E5]
                "
              >
                <Plus size={16} />

                Add Download
              </Link>
            </motion.div>


            {/* STATS */}

            <section
              className="
                mt-7
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-3
              "
            >
              <div
                className="
                  rounded-[12px]
                  border
                  border-[#E7EDF4]
                  bg-white
                  p-5
                  shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.06em]
                        text-[#98A2B3]
                      "
                    >
                      Total
                    </p>

                    <p
                      className="
                        mt-2
                        text-[28px]
                        font-semibold
                        text-[#101828]
                      "
                    >
                      {
                        downloads.length
                      }
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[11px]
                      bg-[#EAF4FF]
                      text-[#0075FF]
                    "
                  >
                    <Download
                      size={20}
                    />
                  </div>
                </div>
              </div>


              <div
                className="
                  rounded-[12px]
                  border
                  border-[#E7EDF4]
                  bg-white
                  p-5
                  shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.06em]
                        text-[#98A2B3]
                      "
                    >
                      Active
                    </p>

                    <p
                      className="
                        mt-2
                        text-[28px]
                        font-semibold
                        text-[#101828]
                      "
                    >
                      {
                        activeCount
                      }
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[11px]
                      bg-[#ECFDF3]
                      text-[#039855]
                    "
                  >
                    <CheckCircle2
                      size={20}
                    />
                  </div>
                </div>
              </div>


              <div
                className="
                  rounded-[12px]
                  border
                  border-[#E7EDF4]
                  bg-white
                  p-5
                  shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.06em]
                        text-[#98A2B3]
                      "
                    >
                      Inactive
                    </p>

                    <p
                      className="
                        mt-2
                        text-[28px]
                        font-semibold
                        text-[#101828]
                      "
                    >
                      {
                        inactiveCount
                      }
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[11px]
                      bg-[#F2F4F7]
                      text-[#667085]
                    "
                  >
                    <CircleSlash2
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </section>


            {/* ERROR */}

            {error && (
              <div
                className="
                  mt-5
                  rounded-[10px]
                  border
                  border-[#FDA29B]
                  bg-[#FFFBFA]
                  px-4
                  py-3
                  text-[12px]
                  font-medium
                  text-[#B42318]
                "
              >
                {error}
              </div>
            )}


            {/* FILTER CARD */}

            <section
              className="
                mt-6
                rounded-[12px]
                border
                border-[#E7EDF4]
                bg-white
                p-4
                shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                sm:p-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                "
              >
                <div
                  className="
                    grid
                    flex-1
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                  "
                >
                  {/* SEARCH */}

                  <div
                    className="
                      relative
                    "
                  >
                    <Search
                      size={16}
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-[#98A2B3]
                      "
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Search downloads..."
                      className="
                        h-[42px]
                        w-full
                        rounded-[9px]
                        border
                        border-[#DDE4EC]
                        bg-white
                        pl-10
                        pr-3
                        text-[12px]
                        text-[#344054]
                        outline-none
                        transition
                        placeholder:text-[#98A2B3]
                        focus:border-[#0075FF]
                      "
                    />
                  </div>


                  {/* STATUS */}

                  <select
                    value={
                      statusFilter
                    }
                    onChange={(event) =>
                      setStatusFilter(
                        event.target
                          .value as
                          StatusFilter,
                      )
                    }
                    className="
                      h-[42px]
                      rounded-[9px]
                      border
                      border-[#DDE4EC]
                      bg-white
                      px-3
                      text-[12px]
                      text-[#344054]
                      outline-none
                      focus:border-[#0075FF]
                    "
                  >
                    <option value="all">
                      All statuses
                    </option>

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </select>


                  {/* ICON TYPE */}

                  <select
                    value={
                      iconFilter
                    }
                    onChange={(event) =>
                      setIconFilter(
                        event.target
                          .value as
                          IconFilter,
                      )
                    }
                    className="
                      h-[42px]
                      rounded-[9px]
                      border
                      border-[#DDE4EC]
                      bg-white
                      px-3
                      text-[12px]
                      text-[#344054]
                      outline-none
                      focus:border-[#0075FF]
                    "
                  >
                    <option value="all">
                      All icon types
                    </option>

                    <option value="lucide">
                      Lucide Icon
                    </option>

                    <option value="image">
                      Custom Image
                    </option>
                  </select>
                </div>


                <button
                  type="button"
                  onClick={() =>
                    loadDownloads(
                      true,
                    )
                  }
                  disabled={
                    refreshing
                  }
                  className="
                    inline-flex
                    h-[42px]
                    items-center
                    justify-center
                    gap-2
                    rounded-[9px]
                    border
                    border-[#DDE4EC]
                    bg-white
                    px-4
                    text-[12px]
                    font-semibold
                    text-[#475467]
                    transition
                    hover:border-[#A7CFFF]
                    hover:text-[#0075FF]
                    disabled:opacity-50
                  "
                >
                  <RefreshCcw
                    size={15}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>
              </div>
            </section>


            {/* CONTENT */}

            <section className="mt-5">
              {loading ? (
                <div
                  className="
                    flex
                    min-h-[320px]
                    items-center
                    justify-center
                    rounded-[12px]
                    border
                    border-[#E7EDF4]
                    bg-white
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      gap-3
                      text-[#667085]
                    "
                  >
                    <Loader2
                      size={25}
                      className="
                        animate-spin
                        text-[#0075FF]
                      "
                    />

                    <p
                      className="
                        text-[12px]
                        font-medium
                      "
                    >
                      Loading downloads...
                    </p>
                  </div>
                </div>
              ) : filteredDownloads.length ===
                0 ? (
                <div
                  className="
                    flex
                    min-h-[320px]
                    flex-col
                    items-center
                    justify-center
                    rounded-[12px]
                    border
                    border-dashed
                    border-[#D6DFEA]
                    bg-white
                    px-4
                    text-center
                  "
                >
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-[#EAF4FF]
                      text-[#0075FF]
                    "
                  >
                    <Download
                      size={23}
                    />
                  </div>

                  <h3
                    className="
                      mt-4
                      text-[15px]
                      font-semibold
                      text-[#101828]
                    "
                  >
                    No downloads found
                  </h3>

                  <p
                    className="
                      mt-1
                      max-w-[420px]
                      text-[12px]
                      leading-5
                      text-[#98A2B3]
                    "
                  >
                    Add your first
                    downloadable resource
                    or change the current
                    filters.
                  </p>

                  <Link
                    href="/admin/downloads/new"
                    className="
                      mt-5
                      inline-flex
                      h-10
                      items-center
                      gap-2
                      rounded-[9px]
                      bg-[#0075FF]
                      px-4
                      text-[12px]
                      font-semibold
                      !text-white
                    "
                  >
                    <Plus size={15} />

                    Add Download
                  </Link>
                </div>
              ) : (
                <>
                  {/* DESKTOP TABLE */}

                  <div
                    className="
                      hidden
                      overflow-hidden
                      rounded-[12px]
                      border
                      border-[#E7EDF4]
                      bg-white
                      shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                      lg:block
                    "
                  >
                    <div
                      className="
                        grid
                        grid-cols-[80px_minmax(240px,1.4fr)_minmax(210px,1fr)_130px_110px_130px]
                        items-center
                        gap-4
                        border-b
                        border-[#EDF1F5]
                        bg-[#FAFBFC]
                        px-5
                        py-3.5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.06em]
                        text-[#98A2B3]
                      "
                    >
                      <div>
                        Order
                      </div>

                      <div>
                        Resource
                      </div>

                      <div>
                        File
                      </div>

                      <div>
                        Icon
                      </div>

                      <div>
                        Status
                      </div>

                      <div className="text-right">
                        Actions
                      </div>
                    </div>


                    {filteredDownloads.map(
                      (item) => (
                        <div
                          key={
                            item.id
                          }
                          className="
                            grid
                            grid-cols-[80px_minmax(240px,1.4fr)_minmax(210px,1fr)_130px_110px_130px]
                            items-center
                            gap-4
                            border-b
                            border-[#F0F3F6]
                            px-5
                            py-4
                            transition-colors
                            last:border-b-0
                            hover:bg-[#FBFCFE]
                          "
                        >
                          {/* ORDER */}

                          <div
                            className="
                              text-[13px]
                              font-semibold
                              text-[#475467]
                            "
                          >
                            #
                            {
                              item.display_order
                            }
                          </div>


                          {/* RESOURCE */}

                          <div
                            className="
                              flex
                              min-w-0
                              items-center
                              gap-3
                            "
                          >
                            <DownloadIconPreview
                              item={
                                item
                              }
                            />

                            <div className="min-w-0">
                              <p
                                className="
                                  truncate
                                  text-[13px]
                                  font-semibold
                                  text-[#101828]
                                "
                              >
                                {
                                  item.title
                                }
                              </p>

                              <p
                                className="
                                  mt-1
                                  line-clamp-1
                                  text-[11px]
                                  leading-[1.5]
                                  text-[#98A2B3]
                                "
                              >
                                {
                                  item.description
                                }
                              </p>
                            </div>
                          </div>


                          {/* FILE */}

                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-[12px]
                                font-medium
                                text-[#475467]
                              "
                            >
                              {item.original_file_name ||
                                "PDF document"}
                            </p>

                            <p
                              className="
                                mt-1
                                text-[10px]
                                text-[#98A2B3]
                              "
                            >
                              {formatDownloadFileSize(
                                item.file_size_bytes,
                              )}
                            </p>
                          </div>


                          {/* ICON TYPE */}

                          <div>
                            <span
                              className="
                                inline-flex
                                rounded-full
                                bg-[#F2F4F7]
                                px-2.5
                                py-1
                                text-[10px]
                                font-semibold
                                capitalize
                                text-[#475467]
                              "
                            >
                              {
                                item.icon_type
                              }
                            </span>
                          </div>


                          {/* STATUS */}

                          <div>
                            <StatusBadge
                              active={
                                item.is_active
                              }
                            />
                          </div>


                          {/* ACTIONS */}

                          <div
                            className="
                              flex
                              items-center
                              justify-end
                              gap-1.5
                            "
                          >
                            <a
                              href={getDownloadAssetUrl(
                                item.file_url,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              title="Open PDF"
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-[8px]
                                border
                                border-[#E4E7EC]
                                text-[#667085]
                                transition
                                hover:border-[#A7CFFF]
                                hover:bg-[#F5FAFF]
                                hover:text-[#0075FF]
                              "
                            >
                              <ExternalLink
                                size={14}
                              />
                            </a>


                            <button
                              type="button"
                              title={
                                item.is_active
                                  ? "Deactivate"
                                  : "Activate"
                              }
                              disabled={
                                statusUpdatingId ===
                                item.id
                              }
                              onClick={() =>
                                handleStatusToggle(
                                  item,
                                )
                              }
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-[8px]
                                border
                                border-[#E4E7EC]
                                text-[#667085]
                                transition
                                hover:border-[#A7CFFF]
                                hover:text-[#0075FF]
                                disabled:opacity-50
                              "
                            >
                              {statusUpdatingId ===
                              item.id ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : item.is_active ? (
                                <CircleSlash2
                                  size={14}
                                />
                              ) : (
                                <CheckCircle2
                                  size={14}
                                />
                              )}
                            </button>


                            <Link
                              href={`/admin/downloads/${item.id}/edit`}
                              title="Edit"
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-[8px]
                                border
                                border-[#E4E7EC]
                                text-[#667085]
                                transition
                                hover:border-[#A7CFFF]
                                hover:bg-[#F5FAFF]
                                hover:text-[#0075FF]
                              "
                            >
                              <Pencil
                                size={14}
                              />
                            </Link>


                            <button
                              type="button"
                              title="Delete"
                              disabled={
                                deletingId ===
                                item.id
                              }
                              onClick={() =>
                                handleDelete(
                                  item,
                                )
                              }
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-[8px]
                                border
                                border-[#FEE4E2]
                                text-[#D92D20]
                                transition
                                hover:bg-[#FEF3F2]
                                disabled:opacity-50
                              "
                            >
                              {deletingId ===
                              item.id ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={14}
                                />
                              )}
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>


                  {/* MOBILE / TABLET CARDS */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-4
                      sm:grid-cols-2
                      lg:hidden
                    "
                  >
                    {filteredDownloads.map(
                      (item) => (
                        <article
                          key={
                            item.id
                          }
                          className="
                            rounded-[12px]
                            border
                            border-[#E7EDF4]
                            bg-white
                            p-4
                            shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                          "
                        >
                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-3
                            "
                          >
                            <div
                              className="
                                flex
                                min-w-0
                                items-center
                                gap-3
                              "
                            >
                              <DownloadIconPreview
                                item={
                                  item
                                }
                              />

                              <div className="min-w-0">
                                <p
                                  className="
                                    truncate
                                    text-[13px]
                                    font-semibold
                                    text-[#101828]
                                  "
                                >
                                  {
                                    item.title
                                  }
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-[10px]
                                    text-[#98A2B3]
                                  "
                                >
                                  Order #
                                  {
                                    item.display_order
                                  }
                                </p>
                              </div>
                            </div>

                            <StatusBadge
                              active={
                                item.is_active
                              }
                            />
                          </div>


                          <p
                            className="
                              mt-4
                              line-clamp-2
                              text-[11px]
                              leading-[1.65]
                              text-[#667085]
                            "
                          >
                            {
                              item.description
                            }
                          </p>


                          <div
                            className="
                              mt-4
                              rounded-[9px]
                              bg-[#F8FAFC]
                              p-3
                            "
                          >
                            <p
                              className="
                                truncate
                                text-[11px]
                                font-medium
                                text-[#475467]
                              "
                            >
                              {item.original_file_name ||
                                "PDF document"}
                            </p>

                            <p
                              className="
                                mt-1
                                text-[10px]
                                text-[#98A2B3]
                              "
                            >
                              {formatDownloadFileSize(
                                item.file_size_bytes,
                              )}
                              {" • "}
                              {
                                item.icon_type
                              }{" "}
                              icon
                            </p>
                          </div>


                          <div
                            className="
                              mt-4
                              grid
                              grid-cols-4
                              gap-2
                            "
                          >
                            <a
                              href={getDownloadAssetUrl(
                                item.file_url,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="
                                flex
                                h-9
                                items-center
                                justify-center
                                rounded-[8px]
                                border
                                border-[#E4E7EC]
                                text-[#667085]
                              "
                            >
                              <ExternalLink
                                size={14}
                              />
                            </a>


                            <button
                              type="button"
                              disabled={
                                statusUpdatingId ===
                                item.id
                              }
                              onClick={() =>
                                handleStatusToggle(
                                  item,
                                )
                              }
                              className="
                                flex
                                h-9
                                items-center
                                justify-center
                                rounded-[8px]
                                border
                                border-[#E4E7EC]
                                text-[#667085]
                              "
                            >
                              {statusUpdatingId ===
                              item.id ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : item.is_active ? (
                                <CircleSlash2
                                  size={14}
                                />
                              ) : (
                                <CheckCircle2
                                  size={14}
                                />
                              )}
                            </button>


                            <Link
                              href={`/admin/downloads/${item.id}/edit`}
                              className="
                                flex
                                h-9
                                items-center
                                justify-center
                                rounded-[8px]
                                border
                                border-[#E4E7EC]
                                text-[#0075FF]
                              "
                            >
                              <Pencil
                                size={14}
                              />
                            </Link>


                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                item.id
                              }
                              onClick={() =>
                                handleDelete(
                                  item,
                                )
                              }
                              className="
                                flex
                                h-9
                                items-center
                                justify-center
                                rounded-[8px]
                                border
                                border-[#FEE4E2]
                                text-[#D92D20]
                              "
                            >
                              {deletingId ===
                              item.id ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={14}
                                />
                              )}
                            </button>
                          </div>
                        </article>
                      ),
                    )}
                  </div>
                </>
              )}
            </section>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}