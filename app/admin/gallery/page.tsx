"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Home,
  ImageIcon,
  Images,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import AdminAuthGuard from "../../../components/admin/AdminAuthGuard";
import AdminHeader from "../../../components/admin/AdminHeader";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import {
  deleteAdminGalleryAlbum,
  getAdminGalleryAlbums,
  getAdminGalleryImageUrl,
  type AdminGalleryAlbum,
} from "@/services/adminGalleryService";


/* =========================================================
   CONFIG
========================================================= */

const PAGE_LIMIT = 9;

const smoothEase = [
  0.22,
  1,
  0.36,
  1,
] as const;


/* =========================================================
   PAGE
========================================================= */

export default function AdminGalleryPage() {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const [
    albums,
    setAlbums,
  ] = useState<
    AdminGalleryAlbum[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState<
    number | null
  >(null);

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    total,
    setTotal,
  ] = useState(0);


  /* =========================================================
     FILTERS
  ========================================================= */

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    yearFilter,
    setYearFilter,
  ] = useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "ALL" | "PUBLISHED" | "DRAFT"
  >("ALL");


  /* =========================================================
     SEARCH DEBOUNCE
  ========================================================= */

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        setPage(1);

        setSearch(
          searchInput.trim()
        );
      }, 300);

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    searchInput,
  ]);


  /* =========================================================
     LOAD ALBUMS
  ========================================================= */

  const loadAlbums =
    useCallback(
      async (
        showLoader = true
      ) => {
        try {
          if (showLoader) {
            setLoading(true);
          }

          setError("");

          const year =
            yearFilter
              ? Number(
                  yearFilter
                )
              : undefined;

          const isPublished =
            statusFilter ===
            "PUBLISHED"
              ? true
              : statusFilter ===
                  "DRAFT"
                ? false
                : undefined;

          const response =
            await getAdminGalleryAlbums(
              {
                page,
                limit:
                  PAGE_LIMIT,

                search:
                  search ||
                  undefined,

                year:
                  year &&
                  Number.isFinite(
                    year
                  )
                    ? year
                    : undefined,

                category:
                  categoryFilter.trim() ||
                  undefined,

                is_published:
                  isPublished,
              }
            );

          setAlbums(
            response.items
          );

          setTotal(
            response.total
          );
        } catch (err) {
          console.error(
            "Unable to load Gallery albums:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Gallery albums."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        page,
        search,
        yearFilter,
        categoryFilter,
        statusFilter,
      ]
    );


  useEffect(() => {
    loadAlbums();
  }, [
    loadAlbums,
  ]);


  /* =========================================================
     FILTER CHANGE HELPERS
  ========================================================= */

  const handleYearChange = (
    value: string
  ) => {
    setPage(1);

    setYearFilter(
      value
    );
  };


  const handleCategoryChange = (
    value: string
  ) => {
    setPage(1);

    setCategoryFilter(
      value
    );
  };


  const handleStatusChange = (
    value:
      | "ALL"
      | "PUBLISHED"
      | "DRAFT"
  ) => {
    setPage(1);

    setStatusFilter(
      value
    );
  };


  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete =
    async (
      album:
        AdminGalleryAlbum
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${album.title}"?\n\nThis will also delete all images belonging to this album.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          album.id
        );

        setError("");

        await deleteAdminGalleryAlbum(
          album.id
        );

        /*
         * If this was the final album
         * on a page greater than 1,
         * move back one page.
         */

        if (
          albums.length ===
            1 &&
          page > 1
        ) {
          setPage(
            (current) =>
              current - 1
          );

          return;
        }

        await loadAlbums(
          false
        );
      } catch (err) {
        console.error(
          "Unable to delete Gallery album:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete Gallery album."
        );
      } finally {
        setDeletingId(
          null
        );
      }
    };


  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total /
          PAGE_LIMIT
      )
    );


  const startItem =
    total === 0
      ? 0
      : (
          page - 1
        ) *
          PAGE_LIMIT +
        1;


  const endItem =
    Math.min(
      page *
        PAGE_LIMIT,

      total
    );


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <AdminAuthGuard>
      <div
        className="
          min-h-screen
          bg-[#F7F9FC]
        "
      >
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <AdminSidebar
          mobileOpen={
            mobileSidebarOpen
          }
          onClose={() =>
            setMobileSidebarOpen(
              false
            )
          }
        />


        {/* =================================================
            MAIN
        ================================================= */}

        <div
          className="
            min-h-screen
            lg:pl-[250px]
          "
        >
          <AdminHeader
            onMenuClick={() =>
              setMobileSidebarOpen(
                true
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
            {/* =============================================
                HEADER
            ============================================= */}

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
                duration:
                  0.65,
                ease:
                  smoothEase,
              }}
              className="
                flex

                flex-col

                gap-5

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
                  Website Content
                </p>

                <h1
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
                  Gallery Management
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
                  Create Gallery albums,
                  upload photos and choose
                  which images appear on the
                  Rosary School homepage.
                </p>
              </div>


              <Link
                href="/admin/gallery/new"
                className="
                  inline-flex

                  h-[44px]

                  shrink-0

                  items-center
                  justify-center

                  gap-2

                  rounded-[10px]

                  bg-[#0075FF]

                  px-5

                  font-secondary

                  text-[12px]
                  font-medium

                  !text-white

                  shadow-[0_8px_20px_rgba(0,117,255,0.20)]

                  transition-all
                  duration-300

                  hover:-translate-y-[2px]
                  hover:bg-[#006BE8]
                  hover:shadow-[0_12px_28px_rgba(0,117,255,0.28)]
                "
                style={{
                  color:
                    "#ffffff",
                }}
              >
                <Plus
                  size={16}
                />

                Add Album
              </Link>
            </motion.div>


            {/* =============================================
                SUMMARY
            ============================================= */}

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
                duration:
                  0.65,
                delay:
                  0.08,
                ease:
                  smoothEase,
              }}
              className="
                mt-7

                grid

                grid-cols-1

                gap-3

                sm:grid-cols-3
              "
            >
              <SummaryCard
                icon={
                  FolderOpen
                }
                label="Albums"
                value={total}
              />

              <SummaryCard
                icon={
                  Images
                }
                label="Visible on this page"
                value={
                  albums.length
                }
              />

              <SummaryCard
                icon={
                  Home
                }
                label="Homepage selected"
                value={
                  albums.reduce(
                    (
                      count,
                      album
                    ) =>
                      count +
                      album.images.filter(
                        (
                          image
                        ) =>
                          image.is_homepage
                      ).length,
                    0
                  )
                }
              />
            </motion.div>


            {/* =============================================
                FILTERS
            ============================================= */}

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
                duration:
                  0.65,
                delay:
                  0.12,
                ease:
                  smoothEase,
              }}
              className="
                mt-6

                rounded-[14px]

                border
                border-[#E5EAF0]

                bg-white

                p-4

                shadow-[0_6px_22px_rgba(16,24,40,0.035)]
              "
            >
              <div
                className="
                  grid

                  grid-cols-1

                  gap-3

                  md:grid-cols-2

                  xl:grid-cols-[minmax(260px,1fr)_150px_180px_180px_auto]
                "
              >
                {/* SEARCH */}

                <div
                  className="
                    relative
                  "
                >
                  <Search
                    size={15}
                    className="
                      absolute

                      left-3
                      top-1/2

                      -translate-y-1/2

                      text-[#98A2B3]
                    "
                  />

                  <input
                    type="text"
                    value={
                      searchInput
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchInput(
                        event.target.value
                      )
                    }
                    placeholder="Search album or category..."
                    className="
                      h-[42px]
                      w-full

                      rounded-[9px]

                      border
                      border-[#DCE3EA]

                      bg-[#FBFCFD]

                      pl-9
                      pr-3

                      font-secondary

                      text-[12px]

                      text-[#344054]

                      outline-none

                      transition-all

                      placeholder:text-[#A3ACB8]

                      focus:border-[#0075FF]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#0075FF]/[0.06]
                    "
                  />
                </div>


                {/* YEAR */}

                <div
                  className="
                    relative
                  "
                >
                  <CalendarDays
                    size={14}
                    className="
                      pointer-events-none

                      absolute

                      left-3
                      top-1/2

                      -translate-y-1/2

                      text-[#98A2B3]
                    "
                  />

                  <input
                    type="number"
                    min={1900}
                    max={2100}
                    value={
                      yearFilter
                    }
                    onChange={(
                      event
                    ) =>
                      handleYearChange(
                        event.target.value
                      )
                    }
                    placeholder="Year"
                    className="
                      h-[42px]
                      w-full

                      rounded-[9px]

                      border
                      border-[#DCE3EA]

                      bg-[#FBFCFD]

                      pl-9
                      pr-3

                      font-secondary

                      text-[12px]

                      text-[#344054]

                      outline-none

                      focus:border-[#0075FF]
                      focus:bg-white
                    "
                  />
                </div>


                {/* CATEGORY */}

                <input
                  type="text"
                  value={
                    categoryFilter
                  }
                  onChange={(
                    event
                  ) =>
                    handleCategoryChange(
                      event.target.value
                    )
                  }
                  placeholder="Category"
                  className="
                    h-[42px]
                    w-full

                    rounded-[9px]

                    border
                    border-[#DCE3EA]

                    bg-[#FBFCFD]

                    px-3

                    font-secondary

                    text-[12px]

                    text-[#344054]

                    outline-none

                    placeholder:text-[#A3ACB8]

                    focus:border-[#0075FF]
                    focus:bg-white
                  "
                />


                {/* STATUS */}

                <select
                  value={
                    statusFilter
                  }
                  onChange={(
                    event
                  ) =>
                    handleStatusChange(
                      event.target
                        .value as
                        | "ALL"
                        | "PUBLISHED"
                        | "DRAFT"
                    )
                  }
                  className="
                    h-[42px]

                    rounded-[9px]

                    border
                    border-[#DCE3EA]

                    bg-[#FBFCFD]

                    px-3

                    font-secondary

                    text-[12px]

                    text-[#344054]

                    outline-none

                    focus:border-[#0075FF]
                    focus:bg-white
                  "
                >
                  <option value="ALL">
                    All Status
                  </option>

                  <option value="PUBLISHED">
                    Published
                  </option>

                  <option value="DRAFT">
                    Draft
                  </option>
                </select>


                {/* REFRESH */}

                <button
                  type="button"
                  onClick={() =>
                    loadAlbums()
                  }
                  disabled={
                    loading
                  }
                  className="
                    inline-flex

                    h-[42px]

                    items-center
                    justify-center

                    gap-2

                    rounded-[9px]

                    border
                    border-[#DCE3EA]

                    bg-white

                    px-4

                    font-secondary

                    text-[11px]
                    font-medium

                    text-[#475467]

                    transition-all

                    hover:border-[#A8CFFF]
                    hover:text-[#0075FF]

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <RefreshCw
                    size={14}
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>
              </div>
            </motion.div>


            {/* =============================================
                ERROR
            ============================================= */}

            {error && (
              <div
                className="
                  mt-5

                  rounded-[10px]

                  border
                  border-red-200

                  bg-red-50

                  px-4
                  py-3

                  font-secondary

                  text-[12px]

                  text-red-700
                "
              >
                {error}
              </div>
            )}


            {/* =============================================
                LOADING
            ============================================= */}

            {loading ? (
              <div
                className="
                  mt-6

                  grid

                  grid-cols-1

                  gap-5

                  sm:grid-cols-2

                  xl:grid-cols-3
                "
              >
                {Array.from({
                  length: 6,
                }).map(
                  (
                    _,
                    index
                  ) => (
                    <GallerySkeleton
                      key={
                        index
                      }
                    />
                  )
                )}
              </div>
            ) : albums.length ===
              0 ? (
              /* ===========================================
                 EMPTY
              =========================================== */

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  mt-6

                  flex

                  min-h-[360px]

                  flex-col

                  items-center
                  justify-center

                  rounded-[16px]

                  border
                  border-dashed
                  border-[#D7E1EB]

                  bg-white

                  px-6

                  text-center
                "
              >
                <div
                  className="
                    flex

                    h-[58px]
                    w-[58px]

                    items-center
                    justify-center

                    rounded-[14px]

                    bg-[#EDF6FF]

                    text-[#0075FF]
                  "
                >
                  <Images
                    size={26}
                  />
                </div>

                <h3
                  className="
                    mt-5

                    font-primary

                    text-[18px]
                    font-semibold

                    text-[#111827]
                  "
                >
                  No Gallery albums
                </h3>

                <p
                  className="
                    mt-2

                    max-w-[420px]

                    font-secondary

                    text-[12px]

                    leading-[1.6]

                    text-[#8A94A3]
                  "
                >
                  Create your first
                  Gallery album and
                  upload images for the
                  Gallery page and
                  homepage.
                </p>

                <Link
                  href="/admin/gallery/new"
                  className="
                    mt-5

                    inline-flex

                    h-[42px]

                    items-center
                    justify-center

                    gap-2

                    rounded-[9px]

                    bg-[#0075FF]

                    px-5

                    font-secondary

                    text-[11px]
                    font-medium

                    !text-white
                  "
                  style={{
                    color:
                      "#ffffff",
                  }}
                >
                  <Plus
                    size={14}
                  />

                  Add Album
                </Link>
              </motion.div>
            ) : (
              /* ===========================================
                 ALBUM GRID
              =========================================== */

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="
                  mt-6

                  grid

                  grid-cols-1

                  gap-5

                  sm:grid-cols-2

                  xl:grid-cols-3
                "
              >
                {albums.map(
                  (
                    album,
                    index
                  ) => (
                    <GalleryAlbumCard
                      key={
                        album.id
                      }
                      album={
                        album
                      }
                      index={
                        index
                      }
                      deleting={
                        deletingId ===
                        album.id
                      }
                      onDelete={() =>
                        handleDelete(
                          album
                        )
                      }
                    />
                  )
                )}
              </motion.div>
            )}


            {/* =============================================
                PAGINATION
            ============================================= */}

            {!loading &&
              total > 0 && (
                <div
                  className="
                    mt-7

                    flex

                    flex-col

                    gap-3

                    rounded-[12px]

                    border
                    border-[#E6EBF0]

                    bg-white

                    px-4
                    py-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <p
                    className="
                      font-secondary

                      text-[11px]

                      text-[#7B8794]
                    "
                  >
                    Showing{" "}
                    <strong
                      className="
                        font-medium
                        text-[#344054]
                      "
                    >
                      {startItem}
                    </strong>
                    {" – "}
                    <strong
                      className="
                        font-medium
                        text-[#344054]
                      "
                    >
                      {endItem}
                    </strong>
                    {" of "}
                    <strong
                      className="
                        font-medium
                        text-[#344054]
                      "
                    >
                      {total}
                    </strong>
                    {" albums"}
                  </p>


                  <div
                    className="
                      flex
                      items-center

                      gap-2
                    "
                  >
                    <button
                      type="button"
                      disabled={
                        page <=
                        1
                      }
                      onClick={() =>
                        setPage(
                          (
                            current
                          ) =>
                            Math.max(
                              1,
                              current -
                                1
                            )
                        )
                      }
                      className="
                        flex

                        h-[36px]
                        w-[36px]

                        items-center
                        justify-center

                        rounded-[8px]

                        border
                        border-[#DDE4EB]

                        bg-white

                        text-[#56616F]

                        transition-all

                        hover:border-[#0075FF]
                        hover:text-[#0075FF]

                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      <ChevronLeft
                        size={15}
                      />
                    </button>


                    <div
                      className="
                        min-w-[82px]

                        text-center

                        font-secondary

                        text-[11px]

                        text-[#667085]
                      "
                    >
                      Page{" "}
                      <span
                        className="
                          font-semibold
                          text-[#111827]
                        "
                      >
                        {page}
                      </span>
                      {" / "}
                      {totalPages}
                    </div>


                    <button
                      type="button"
                      disabled={
                        page >=
                        totalPages
                      }
                      onClick={() =>
                        setPage(
                          (
                            current
                          ) =>
                            Math.min(
                              totalPages,
                              current +
                                1
                            )
                        )
                      }
                      className="
                        flex

                        h-[36px]
                        w-[36px]

                        items-center
                        justify-center

                        rounded-[8px]

                        border
                        border-[#DDE4EB]

                        bg-white

                        text-[#56616F]

                        transition-all

                        hover:border-[#0075FF]
                        hover:text-[#0075FF]

                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      <ChevronRight
                        size={15}
                      />
                    </button>
                  </div>
                </div>
              )}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}


/* =========================================================
   ALBUM CARD
========================================================= */

function GalleryAlbumCard({
  album,
  index,
  deleting,
  onDelete,
}: {
  album: AdminGalleryAlbum;
  index: number;
  deleting: boolean;
  onDelete: () => void;
}) {
  const cover =
    album.images[0];

  const homepageCount =
    album.images.filter(
      (image) =>
        image.is_homepage
    ).length;


  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 22,
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration:
          0.6,

        delay:
          index * 0.05,

        ease:
          smoothEase,
      }}
      className="
        group

        overflow-hidden

        rounded-[15px]

        border
        border-[#E5EAF0]

        bg-white

        shadow-[0_7px_24px_rgba(16,24,40,0.035)]

        transition-all
        duration-300

        hover:-translate-y-[3px]
        hover:border-[#CFE3FA]
        hover:shadow-[0_15px_38px_rgba(0,117,255,0.08)]
      "
    >
      {/* =================================================
          COVER
      ================================================= */}

      <div
        className="
          relative

          aspect-[1.55/1]

          overflow-hidden

          bg-[#EEF3F7]
        "
      >
        {cover ? (
          <img
            src={
              getAdminGalleryImageUrl(
                cover.image_url
              )
            }
            alt={
              cover.alt_text ||
              album.title
            }
            className="
              h-full
              w-full

              object-cover
              object-center

              transition-transform
              duration-700

              group-hover:scale-[1.045]
            "
          />
        ) : (
          <div
            className="
              flex

              h-full
              w-full

              flex-col

              items-center
              justify-center

              text-[#A6B1BC]
            "
          >
            <ImageIcon
              size={28}
            />

            <span
              className="
                mt-2

                font-secondary

                text-[10px]
              "
            >
              No images
            </span>
          </div>
        )}


        {/* STATUS */}

        <span
          className={`
            absolute

            left-3
            top-3

            rounded-full

            px-[9px]
            py-[5px]

            font-secondary

            text-[8px]
            font-medium

            backdrop-blur-md

            ${
              album.is_published
                ? `
                  bg-emerald-500/90
                  text-white
                `
                : `
                  bg-[#111827]/75
                  text-white
                `
            }
          `}
        >
          {album.is_published
            ? "Published"
            : "Draft"}
        </span>


        {/* IMAGE COUNT */}

        <span
          className="
            absolute

            right-3
            top-3

            inline-flex

            items-center

            gap-1

            rounded-full

            bg-black/55

            px-[9px]
            py-[5px]

            font-secondary

            text-[8px]

            text-white

            backdrop-blur-md
          "
        >
          <Images
            size={11}
          />

          {album.images.length}
        </span>
      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          p-5
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
          <div
            className="
              min-w-0
            "
          >
            <span
              className="
                inline-flex

                rounded-[5px]

                bg-[#EDF6FF]

                px-[8px]
                py-[4px]

                font-secondary

                text-[8px]
                font-medium

                text-[#0075FF]
              "
            >
              {album.category}
            </span>

            <h2
              className="
                mt-3

                line-clamp-2

                font-primary

                text-[17px]
                font-semibold

                leading-[1.25]

                text-[#111827]
              "
            >
              {album.title}
            </h2>
          </div>


          <span
            className="
              shrink-0

              rounded-[7px]

              border
              border-[#E3E8EE]

              bg-[#FAFBFC]

              px-[9px]
              py-[6px]

              font-secondary

              text-[10px]
              font-medium

              text-[#596473]
            "
          >
            {album.year}
          </span>
        </div>


        {/* STATS */}

        <div
          className="
            mt-5

            grid

            grid-cols-2

            gap-2
          "
        >
          <div
            className="
              rounded-[9px]

              bg-[#F7F9FB]

              px-3
              py-2.5
            "
          >
            <p
              className="
                font-secondary

                text-[8px]

                uppercase

                tracking-[0.05em]

                text-[#98A2B3]
              "
            >
              Images
            </p>

            <p
              className="
                mt-1

                font-primary

                text-[14px]
                font-semibold

                text-[#344054]
              "
            >
              {album.images.length}
            </p>
          </div>


          <div
            className="
              rounded-[9px]

              bg-[#F7F9FB]

              px-3
              py-2.5
            "
          >
            <p
              className="
                font-secondary

                text-[8px]

                uppercase

                tracking-[0.05em]

                text-[#98A2B3]
              "
            >
              Homepage
            </p>

            <p
              className="
                mt-1

                font-primary

                text-[14px]
                font-semibold

                text-[#344054]
              "
            >
              {homepageCount}
            </p>
          </div>
        </div>


        {/* ACTIONS */}

        <div
          className="
            mt-5

            flex

            items-center

            gap-2

            border-t
            border-[#EEF1F4]

            pt-4
          "
        >
          <Link
            href={`/admin/gallery/${album.id}/edit`}
            className="
              inline-flex

              h-[36px]

              flex-1

              items-center
              justify-center

              gap-2

              rounded-[8px]

              border
              border-[#CFE2F8]

              bg-[#F7FBFF]

              font-secondary

              text-[10px]
              font-medium

              text-[#0075FF]

              transition-all

              hover:border-[#0075FF]
              hover:bg-[#EDF6FF]
            "
          >
            <Pencil
              size={13}
            />

            Manage
          </Link>


          <button
            type="button"
            onClick={
              onDelete
            }
            disabled={
              deleting
            }
            className="
              inline-flex

              h-[36px]
              w-[38px]

              items-center
              justify-center

              rounded-[8px]

              border
              border-red-100

              bg-red-50

              text-red-500

              transition-all

              hover:border-red-200
              hover:bg-red-100

              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label={`Delete ${album.title}`}
          >
            {deleting ? (
              <RefreshCw
                size={13}
                className="
                  animate-spin
                "
              />
            ) : (
              <Trash2
                size={13}
              />
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Images;
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        flex

        items-center

        gap-3

        rounded-[12px]

        border
        border-[#E5EAF0]

        bg-white

        px-4
        py-4

        shadow-[0_5px_18px_rgba(16,24,40,0.03)]
      "
    >
      <div
        className="
          flex

          h-[40px]
          w-[40px]

          shrink-0

          items-center
          justify-center

          rounded-[9px]

          bg-[#EDF6FF]

          text-[#0075FF]
        "
      >
        <Icon
          size={18}
        />
      </div>

      <div>
        <p
          className="
            font-primary

            text-[19px]
            font-semibold

            text-[#111827]
          "
        >
          {value}
        </p>

        <p
          className="
            mt-[2px]

            font-secondary

            text-[9px]

            text-[#929BA8]
          "
        >
          {label}
        </p>
      </div>
    </div>
  );
}


/* =========================================================
   SKELETON
========================================================= */

function GallerySkeleton() {
  return (
    <div
      className="
        animate-pulse

        overflow-hidden

        rounded-[15px]

        border
        border-[#E9EDF2]

        bg-white
      "
    >
      <div
        className="
          aspect-[1.55/1]

          bg-[#EDF1F5]
        "
      />

      <div
        className="
          p-5
        "
      >
        <div
          className="
            h-[18px]
            w-[80px]

            rounded

            bg-[#EDF1F5]
          "
        />

        <div
          className="
            mt-4

            h-[22px]
            w-[70%]

            rounded

            bg-[#EDF1F5]
          "
        />

        <div
          className="
            mt-5

            grid
            grid-cols-2

            gap-2
          "
        >
          <div
            className="
              h-[56px]

              rounded-[9px]

              bg-[#F0F3F6]
            "
          />

          <div
            className="
              h-[56px]

              rounded-[9px]

              bg-[#F0F3F6]
            "
          />
        </div>
      </div>
    </div>
  );
}