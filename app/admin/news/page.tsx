"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  BellRing,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  FileText,
  ImageIcon,
  LoaderCircle,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import AdminAuthGuard from "../../../components/admin/AdminAuthGuard";

import {
  deleteAdminNews,
  getAdminNews,
  getNewsImageUrl,
  NewsContentType,
  NewsItem,
} from "../../../services/adminNewsService";


// =========================================================
// FILTER TYPES
// =========================================================

type PublishFilter =
  | "ALL"
  | "PUBLISHED"
  | "DRAFT";

type TypeFilter =
  | "ALL"
  | NewsContentType;


// =========================================================
// PAGE
// =========================================================

export default function AdminNewsPage() {
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const [
    items,
    setItems,
  ] = useState<NewsItem[]>([]);

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
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] = useState<TypeFilter>("ALL");

  const [
    publishFilter,
    setPublishFilter,
  ] = useState<PublishFilter>("ALL");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    deletingId,
    setDeletingId,
  ] = useState<number | null>(null);


  const limit = 8;


  // =========================================================
  // LOAD NEWS
  // =========================================================

  const loadNews = useCallback(
    async (
      showRefreshLoader = false
    ) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await getAdminNews({
            page,
            limit,

            content_type:
              typeFilter === "ALL"
                ? undefined
                : typeFilter,

            is_published:
              publishFilter === "ALL"
                ? undefined
                : publishFilter ===
                  "PUBLISHED",

            search:
              searchQuery ||
              undefined,
          });

        setItems(
          response.items
        );

        setTotal(
          response.total
        );
      } catch (error) {
        console.error(
          "Failed to load admin news:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load News and Announcements."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      page,
      typeFilter,
      publishFilter,
      searchQuery,
    ]
  );


  // =========================================================
  // INITIAL LOAD + FILTER CHANGE
  // =========================================================

  useEffect(() => {
    loadNews();
  }, [loadNews]);


  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setPage(1);

    setSearchQuery(
      searchInput.trim()
    );
  };


  // =========================================================
  // TYPE FILTER
  // =========================================================

  const handleTypeFilter = (
    value: TypeFilter
  ) => {
    setTypeFilter(value);
    setPage(1);
  };


  // =========================================================
  // PUBLISH FILTER
  // =========================================================

  const handlePublishFilter = (
    value: PublishFilter
  ) => {
    setPublishFilter(value);
    setPage(1);
  };


  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (
    item: NewsItem
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        item.id
      );

      setError("");

      await deleteAdminNews(
        item.id
      );

      /*
       * If the last item on the current
       * page is deleted and we're not on
       * page 1, move back one page.
       */
      if (
        items.length === 1 &&
        page > 1
      ) {
        setPage(
          (current) =>
            current - 1
        );

        return;
      }

      await loadNews(
        true
      );
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete this item."
      );
    } finally {
      setDeletingId(
        null
      );
    }
  };


  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / limit
      )
    );


  // =========================================================
  // COUNTS
  // =========================================================

  const publishedCount =
    items.filter(
      (item) =>
        item.is_published
    ).length;

  const draftCount =
    items.filter(
      (item) =>
        !item.is_published
    ).length;


  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F7F9FC]">

        {/* ===================================================
            SIDEBAR
        ==================================================== */}

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


        {/* ===================================================
            MAIN AREA
        ==================================================== */}

        <div className="min-h-screen lg:pl-[250px]">

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

            {/* =================================================
                PAGE HEADER
            ================================================== */}

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
              }}
              className="
                flex
                flex-col
                gap-4

                lg:flex-row
                lg:items-end
                lg:justify-between
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
                  Content Management
                </p>


                <h1
                  className="
                    mt-2
                    font-primary
                    text-[27px]
                    font-semibold
                    tracking-[-0.5px]
                    text-[#111827]

                    sm:text-[30px]
                  "
                >
                  News & Announcements
                </h1>


                <p
                  className="
                    mt-2
                    max-w-[650px]
                    font-secondary
                    text-[12px]
                    leading-[1.7]
                    text-[#7B8797]

                    sm:text-[13px]
                  "
                >
                  Manage school News and Announcements
                  displayed on the Rosary School website.
                </p>

              </div>


              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  disabled={refreshing}
                  onClick={() =>
                    loadNews(true)
                  }
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
                    font-semibold
                    text-[#495568]

                    transition-all

                    hover:border-[#B8D7FF]
                    hover:text-[#0075FF]

                    disabled:opacity-60
                  "
                >
                  <RefreshCw
                    size={15}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>


                <Link
                  href="/admin/news/new"
                  className="
                    inline-flex
                    h-[42px]
                    items-center
                    justify-center
                    gap-2

                    rounded-[10px]

                    bg-[#0075FF]

                    px-4

                    font-secondary
                    text-[12px]
                    font-semibold
                    !text-white

                    shadow-[0_8px_20px_rgba(0,117,255,0.18)]

                    transition-all

                    hover:bg-[#006BE8]
                  "
                >
                  <Plus size={16} />

                  Add Content
                </Link>

              </div>
            </motion.div>


            {/* =================================================
                SUMMARY CARDS
            ================================================== */}

            <section
              className="
                mt-7
                grid
                grid-cols-1
                gap-4

                sm:grid-cols-3
              "
            >

              <SummaryCard
                icon={FileText}
                label="Total Content"
                value={total}
              />

              <SummaryCard
                icon={Eye}
                label="Published on Page"
                value={publishedCount}
              />

              <SummaryCard
                icon={Edit3}
                label="Drafts on Page"
                value={draftCount}
              />

            </section>


            {/* =================================================
                FILTER AREA
            ================================================== */}

            <section
              className="
                mt-6

                rounded-[16px]

                border
                border-[#E6ECF2]

                bg-white

                p-4

                shadow-[0_6px_22px_rgba(16,24,40,0.035)]
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-4

                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                "
              >

                {/* SEARCH */}

                <form
                  onSubmit={
                    handleSearch
                  }
                  className="
                    flex
                    w-full
                    max-w-[430px]
                    items-center

                    rounded-[10px]

                    border
                    border-[#E0E7EF]

                    bg-[#FAFBFC]

                    transition-all

                    focus-within:border-[#8FC4FF]
                    focus-within:bg-white
                  "
                >
                  <span
                    className="
                      flex
                      h-[42px]
                      w-[42px]
                      shrink-0
                      items-center
                      justify-center
                      text-[#8B95A5]
                    "
                  >
                    <Search
                      size={16}
                    />
                  </span>


                  <input
                    value={
                      searchInput
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchInput(
                        event.target
                          .value
                      )
                    }
                    placeholder="Search title, label or description..."
                    className="
                      h-[42px]
                      min-w-0
                      flex-1
                      bg-transparent
                      pr-3

                      font-secondary
                      text-[12px]
                      text-[#263244]

                      outline-none

                      placeholder:text-[#A0A8B4]
                    "
                  />


                  <button
                    type="submit"
                    className="
                      mr-1
                      h-[34px]

                      rounded-[8px]

                      bg-[#0075FF]

                      px-4

                      font-secondary
                      text-[11px]
                      font-semibold
                      !text-white
                    "
                  >
                    Search
                  </button>
                </form>


                {/* TYPE FILTER */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <FilterButton
                    active={
                      typeFilter ===
                      "ALL"
                    }
                    onClick={() =>
                      handleTypeFilter(
                        "ALL"
                      )
                    }
                  >
                    All Types
                  </FilterButton>

                  <FilterButton
                    active={
                      typeFilter ===
                      "NEWS"
                    }
                    onClick={() =>
                      handleTypeFilter(
                        "NEWS"
                      )
                    }
                  >
                    News
                  </FilterButton>

                  <FilterButton
                    active={
                      typeFilter ===
                      "ANNOUNCEMENT"
                    }
                    onClick={() =>
                      handleTypeFilter(
                        "ANNOUNCEMENT"
                      )
                    }
                  >
                    Announcements
                  </FilterButton>
                </div>

              </div>


              {/* STATUS */}

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  gap-2

                  border-t
                  border-[#EEF1F4]

                  pt-4
                "
              >
                <FilterButton
                  active={
                    publishFilter ===
                    "ALL"
                  }
                  onClick={() =>
                    handlePublishFilter(
                      "ALL"
                    )
                  }
                >
                  All Status
                </FilterButton>

                <FilterButton
                  active={
                    publishFilter ===
                    "PUBLISHED"
                  }
                  onClick={() =>
                    handlePublishFilter(
                      "PUBLISHED"
                    )
                  }
                >
                  Published
                </FilterButton>

                <FilterButton
                  active={
                    publishFilter ===
                    "DRAFT"
                  }
                  onClick={() =>
                    handlePublishFilter(
                      "DRAFT"
                    )
                  }
                >
                  Draft
                </FilterButton>
              </div>

            </section>


            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div
                className="
                  mt-5

                  rounded-[12px]

                  border
                  border-[#FFD4D4]

                  bg-[#FFF6F6]

                  px-4
                  py-3

                  font-secondary
                  text-[12px]
                  text-[#D74343]
                "
              >
                {error}
              </div>
            )}


            {/* =================================================
                CONTENT
            ================================================== */}

            <section className="mt-5">

              {loading ? (
                <LoadingState />
              ) : items.length ===
                0 ? (
                <EmptyState />
              ) : (
                <div
                  className="
                    overflow-hidden

                    rounded-[16px]

                    border
                    border-[#E6ECF2]

                    bg-white

                    shadow-[0_6px_22px_rgba(16,24,40,0.035)]
                  "
                >

                  {/* DESKTOP TABLE */}

                  <div className="hidden overflow-x-auto lg:block">

                    <table className="w-full">

                      <thead>
                        <tr
                          className="
                            border-b
                            border-[#E9EEF4]

                            bg-[#FAFBFC]
                          "
                        >
                          <TableHeading>
                            Content
                          </TableHeading>

                          <TableHeading>
                            Type
                          </TableHeading>

                          <TableHeading>
                            Status
                          </TableHeading>

                          <TableHeading>
                            Published
                          </TableHeading>

                          <TableHeading>
                            Actions
                          </TableHeading>
                        </tr>
                      </thead>


                      <tbody>

                        {items.map(
                          (item) => (
                            <NewsTableRow
                              key={
                                item.id
                              }
                              item={
                                item
                              }
                              deleting={
                                deletingId ===
                                item.id
                              }
                              onDelete={() =>
                                handleDelete(
                                  item
                                )
                              }
                            />
                          )
                        )}

                      </tbody>

                    </table>

                  </div>


                  {/* MOBILE / TABLET CARDS */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-3
                      p-4

                      sm:grid-cols-2

                      lg:hidden
                    "
                  >
                    {items.map(
                      (item) => (
                        <NewsMobileCard
                          key={
                            item.id
                          }
                          item={
                            item
                          }
                          deleting={
                            deletingId ===
                            item.id
                          }
                          onDelete={() =>
                            handleDelete(
                              item
                            )
                          }
                        />
                      )
                    )}
                  </div>

                </div>
              )}

            </section>


            {/* =================================================
                PAGINATION
            ================================================== */}

            {!loading &&
              total > 0 && (
                <div
                  className="
                    mt-5

                    flex
                    flex-col
                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <p
                    className="
                      font-secondary
                      text-[11px]
                      text-[#8B95A5]
                    "
                  >
                    Page {page} of{" "}
                    {totalPages} ·{" "}
                    {total} total
                    item
                    {total !== 1
                      ? "s"
                      : ""}
                  </p>


                  <div className="flex gap-2">

                    <button
                      type="button"
                      disabled={
                        page <= 1
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            current -
                            1
                        )
                      }
                      className="
                        inline-flex
                        h-[38px]
                        items-center
                        justify-center
                        gap-1

                        rounded-[9px]

                        border
                        border-[#DDE5EE]

                        bg-white

                        px-3

                        font-secondary
                        text-[11px]
                        font-medium
                        text-[#4F5D70]

                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      <ChevronLeft
                        size={15}
                      />

                      Previous
                    </button>


                    <button
                      type="button"
                      disabled={
                        page >=
                        totalPages
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            current +
                            1
                        )
                      }
                      className="
                        inline-flex
                        h-[38px]
                        items-center
                        justify-center
                        gap-1

                        rounded-[9px]

                        border
                        border-[#DDE5EE]

                        bg-white

                        px-3

                        font-secondary
                        text-[11px]
                        font-medium
                        text-[#4F5D70]

                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      Next

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


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Newspaper;
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3

        rounded-[14px]

        border
        border-[#E6ECF2]

        bg-white

        p-4

        shadow-[0_5px_18px_rgba(16,24,40,0.035)]
      "
    >
      <div
        className="
          flex
          h-[44px]
          w-[44px]
          shrink-0

          items-center
          justify-center

          rounded-[11px]

          bg-[#EEF6FF]

          text-[#0075FF]
        "
      >
        <Icon
          size={19}
          strokeWidth={1.8}
        />
      </div>


      <div>
        <p
          className="
            font-primary
            text-[21px]
            font-semibold
            text-[#111827]
          "
        >
          {value}
        </p>

        <p
          className="
            mt-[1px]
            font-secondary
            text-[10px]
            text-[#8D97A5]
          "
        >
          {label}
        </p>
      </div>
    </div>
  );
}


// =========================================================
// FILTER BUTTON
// =========================================================

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-[34px]

        rounded-[8px]

        border

        px-3

        font-secondary
        text-[10px]
        font-semibold

        transition-all

        ${
          active
            ? "border-[#B8D8FF] bg-[#EDF6FF] text-[#0075FF]"
            : "border-[#E1E7EE] bg-white text-[#687486] hover:border-[#B8D8FF]"
        }
      `}
    >
      {children}
    </button>
  );
}


// =========================================================
// TABLE HEADING
// =========================================================

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th
      className="
        px-5
        py-3
        text-left

        font-secondary
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.05em]
        text-[#8E98A6]
      "
    >
      {children}
    </th>
  );
}


// =========================================================
// TABLE ROW
// =========================================================

function NewsTableRow({
  item,
  deleting,
  onDelete,
}: {
  item: NewsItem;
  deleting: boolean;
  onDelete: () => void;
}) {
  const imageUrl =
    getNewsImageUrl(
      item.image_url
    );

  return (
    <tr
      className="
        border-b
        border-[#EEF1F4]

        transition-colors

        last:border-b-0

        hover:bg-[#FBFCFD]
      "
    >

      {/* CONTENT */}

      <td className="px-5 py-4">

        <div className="flex max-w-[480px] items-center gap-3">

          <div
            className="
              flex
              h-[58px]
              w-[76px]
              shrink-0

              items-center
              justify-center

              overflow-hidden

              rounded-[9px]

              bg-[#F0F4F8]
            "
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={
                  item.title
                }
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <ImageIcon
                size={20}
                className="text-[#A2ACB8]"
              />
            )}
          </div>


          <div className="min-w-0">

            <p
              className="
                truncate

                font-secondary
                text-[12px]
                font-semibold
                text-[#263244]
              "
            >
              {item.title}
            </p>


            <p
              className="
                mt-[4px]

                line-clamp-2

                font-secondary
                text-[10px]
                leading-[1.5]
                text-[#8A95A4]
              "
            >
              {
                item.short_description
              }
            </p>


            {item.label && (
              <span
                className="
                  mt-[6px]
                  inline-block

                  rounded-full

                  bg-[#F0F6FF]

                  px-2
                  py-[3px]

                  font-secondary
                  text-[9px]
                  font-medium
                  text-[#0075FF]
                "
              >
                {item.label}
              </span>
            )}

          </div>

        </div>

      </td>


      {/* TYPE */}

      <td className="px-5 py-4">

        <TypeBadge
          type={
            item.content_type
          }
        />

      </td>


      {/* STATUS */}

      <td className="px-5 py-4">

        <StatusBadge
          published={
            item.is_published
          }
        />

      </td>


      {/* DATE */}

      <td
        className="
          whitespace-nowrap
          px-5
          py-4

          font-secondary
          text-[11px]
          text-[#6F7B8A]
        "
      >
        {formatDate(
          item.published_at
        )}
      </td>


      {/* ACTIONS */}

      <td className="px-5 py-4">

        <div className="flex items-center gap-2">

          <Link
            href={`/admin/news/${item.id}/edit`}
            title="Edit"
            className="
              flex
              h-[34px]
              w-[34px]

              items-center
              justify-center

              rounded-[8px]

              border
              border-[#DDE5EE]

              bg-white

              text-[#657386]

              transition-all

              hover:border-[#B8D8FF]
              hover:text-[#0075FF]
            "
          >
            <Edit3
              size={14}
            />
          </Link>


          <button
            type="button"
            title="Delete"
            disabled={
              deleting
            }
            onClick={
              onDelete
            }
            className="
              flex
              h-[34px]
              w-[34px]

              items-center
              justify-center

              rounded-[8px]

              border
              border-[#F1D4D4]

              bg-white

              text-[#E5484D]

              transition-all

              hover:bg-[#FFF4F4]

              disabled:opacity-50
            "
          >
            {deleting ? (
              <LoaderCircle
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

      </td>

    </tr>
  );
}


// =========================================================
// MOBILE CARD
// =========================================================

function NewsMobileCard({
  item,
  deleting,
  onDelete,
}: {
  item: NewsItem;
  deleting: boolean;
  onDelete: () => void;
}) {
  const imageUrl =
    getNewsImageUrl(
      item.image_url
    );

  return (
    <div
      className="
        overflow-hidden

        rounded-[13px]

        border
        border-[#E6ECF2]

        bg-white
      "
    >

      <div
        className="
          flex
          h-[150px]
          items-center
          justify-center

          overflow-hidden

          bg-[#F1F5F9]
        "
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={
              item.title
            }
            className="
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <ImageIcon
            size={28}
            className="text-[#A4AEBB]"
          />
        )}
      </div>


      <div className="p-4">

        <div className="flex flex-wrap gap-2">

          <TypeBadge
            type={
              item.content_type
            }
          />

          <StatusBadge
            published={
              item.is_published
            }
          />

        </div>


        <h3
          className="
            mt-3

            font-primary
            text-[15px]
            font-semibold
            leading-[1.35]
            text-[#1F2937]
          "
        >
          {item.title}
        </h3>


        <p
          className="
            mt-2

            line-clamp-2

            font-secondary
            text-[11px]
            leading-[1.6]
            text-[#84909F]
          "
        >
          {
            item.short_description
          }
        </p>


        <div
          className="
            mt-4

            flex
            items-center
            justify-between

            border-t
            border-[#EEF1F4]

            pt-3
          "
        >

          <span
            className="
              font-secondary
              text-[10px]
              text-[#8994A2]
            "
          >
            {formatDate(
              item.published_at
            )}
          </span>


          <div className="flex gap-2">

            <Link
              href={`/admin/news/${item.id}/edit`}
              className="
                flex
                h-[32px]
                w-[32px]

                items-center
                justify-center

                rounded-[8px]

                border
                border-[#DDE5EE]

                text-[#0075FF]
              "
            >
              <Edit3
                size={13}
              />
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
                flex
                h-[32px]
                w-[32px]

                items-center
                justify-center

                rounded-[8px]

                border
                border-[#F1D4D4]

                text-[#E5484D]

                disabled:opacity-50
              "
            >
              {deleting ? (
                <LoaderCircle
                  size={13}
                  className="animate-spin"
                />
              ) : (
                <Trash2
                  size={13}
                />
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


// =========================================================
// TYPE BADGE
// =========================================================

function TypeBadge({
  type,
}: {
  type: NewsContentType;
}) {
  const announcement =
    type ===
    "ANNOUNCEMENT";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1

        rounded-full

        px-2
        py-[4px]

        font-secondary
        text-[9px]
        font-semibold

        ${
          announcement
            ? "bg-[#FFF7E8] text-[#C67A00]"
            : "bg-[#EDF6FF] text-[#0075FF]"
        }
      `}
    >
      {announcement ? (
        <BellRing size={10} />
      ) : (
        <Newspaper size={10} />
      )}

      {announcement
        ? "Announcement"
        : "News"}
    </span>
  );
}


// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
  published,
}: {
  published: boolean;
}) {
  return (
    <span
      className={`
        inline-flex

        rounded-full

        px-2
        py-[4px]

        font-secondary
        text-[9px]
        font-semibold

        ${
          published
            ? "bg-[#ECF9F1] text-[#248A52]"
            : "bg-[#F1F3F6] text-[#727D8B]"
        }
      `}
    >
      {published
        ? "Published"
        : "Draft"}
    </span>
  );
}


// =========================================================
// LOADING
// =========================================================

function LoadingState() {
  return (
    <div
      className="
        flex
        min-h-[300px]

        flex-col
        items-center
        justify-center

        rounded-[16px]

        border
        border-[#E6ECF2]

        bg-white
      "
    >
      <LoaderCircle
        size={26}
        className="
          animate-spin
          text-[#0075FF]
        "
      />

      <p
        className="
          mt-3
          font-secondary
          text-[12px]
          text-[#8692A1]
        "
      >
        Loading News and
        Announcements...
      </p>
    </div>
  );
}


// =========================================================
// EMPTY
// =========================================================

function EmptyState() {
  return (
    <div
      className="
        flex
        min-h-[300px]

        flex-col
        items-center
        justify-center

        rounded-[16px]

        border
        border-dashed
        border-[#DCE5EF]

        bg-white

        px-5
        text-center
      "
    >
      <div
        className="
          flex
          h-[54px]
          w-[54px]

          items-center
          justify-center

          rounded-[14px]

          bg-[#EEF6FF]

          text-[#0075FF]
        "
      >
        <Newspaper
          size={23}
        />
      </div>

      <h3
        className="
          mt-4
          font-primary
          text-[16px]
          font-semibold
          text-[#1F2937]
        "
      >
        No content found
      </h3>

      <p
        className="
          mt-1
          max-w-[330px]
          font-secondary
          text-[11px]
          leading-[1.6]
          text-[#8A95A4]
        "
      >
        No News or Announcements
        matched your current
        filters.
      </p>
    </div>
  );
}


// =========================================================
// DATE FORMAT
// =========================================================

function formatDate(
  value: string | null
) {
  if (!value) {
    return "Not published";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}
