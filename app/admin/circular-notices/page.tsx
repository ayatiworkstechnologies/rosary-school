"use client";

import Link from "next/link";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    FileText,
    Pencil,
    Plus,
    Search,
    Star,
    Trash2,
} from "lucide-react";

import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import {
    deleteAdminCircularNotice,
    getAdminCircularNotices,
    getCircularNoticePdfUrl,
    type AdminCircularNotice,
    type CircularNoticeType,
} from "@/services/adminCircularNoticeService";


/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_LIMIT = 10;


/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(
    value: string
) {
    if (!value) {
        return "-";
    }

    const date = new Date(
        `${value}T00:00:00`
    );

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


/* =========================================================
   COMPONENT
========================================================= */

export default function CircularNoticesPage() {

    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);


    const [
        items,
        setItems,
    ] = useState<
        AdminCircularNotice[]
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
        search,
        setSearch,
    ] = useState("");


    const [
        contentType,
        setContentType,
    ] = useState<
        CircularNoticeType | ""
    >("");


    const [
        publishFilter,
        setPublishFilter,
    ] = useState<
        "ALL" | "PUBLISHED" | "DRAFT"
    >("ALL");


    const [
        featuredFilter,
        setFeaturedFilter,
    ] = useState<
        "ALL" | "FEATURED" | "NORMAL"
    >("ALL");


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
    ] = useState<
        number | null
    >(null);


    /* =========================================================
       TOTAL PAGES
    ========================================================= */

    const totalPages =
        useMemo(() => {

            return Math.max(
                1,
                Math.ceil(
                    total /
                    PAGE_LIMIT
                )
            );

        }, [total]);


    /* =========================================================
       LOAD DATA
    ========================================================= */

    const loadCircularNotices =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    const response =
                        await getAdminCircularNotices({
                            page,
                            limit: PAGE_LIMIT,

                            content_type:
                                contentType ||
                                undefined,

                            is_published:
                                publishFilter ===
                                    "PUBLISHED"
                                    ? true
                                    : publishFilter ===
                                        "DRAFT"
                                        ? false
                                        : undefined,

                            is_featured:
                                featuredFilter ===
                                    "FEATURED"
                                    ? true
                                    : featuredFilter ===
                                        "NORMAL"
                                        ? false
                                        : undefined,

                            search:
                                search.trim() ||
                                undefined,
                        });


                    setItems(
                        response.items
                    );

                    setTotal(
                        response.total
                    );

                } catch (err) {

                    console.error(
                        "Unable to load Circulars & Notices:",
                        err
                    );


                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load Circulars & Notices."
                    );

                } finally {

                    setLoading(false);

                }

            },
            [
                page,
                search,
                contentType,
                publishFilter,
                featuredFilter,
            ]
        );


    /* =========================================================
       FETCH
    ========================================================= */

    useEffect(() => {

        const timer =
            window.setTimeout(
                () => {

                    loadCircularNotices();

                },
                250
            );


        return () => {

            window.clearTimeout(
                timer
            );

        };

    }, [
        loadCircularNotices,
    ]);


    /* =========================================================
       RESET PAGE WHEN FILTER CHANGES
    ========================================================= */

    useEffect(() => {

        setPage(1);

    }, [
        search,
        contentType,
        publishFilter,
        featuredFilter,
    ]);


    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete =
        async (
            item: AdminCircularNotice
        ) => {

            const confirmed =
                window.confirm(
                    `Delete "${item.title}"?`
                );


            if (!confirmed) {
                return;
            }


            try {

                setDeletingId(
                    item.id
                );

                setError("");


                await deleteAdminCircularNotice(
                    item.id
                );


                await loadCircularNotices();

            } catch (err) {

                console.error(
                    "Delete failed:",
                    err
                );


                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to delete the item."
                );

            } finally {

                setDeletingId(
                    null
                );

            }

        };


    /* =========================================================
       UI
    ========================================================= */

    return (
        <AdminAuthGuard>

            <div
                className="
          min-h-screen
          bg-[#F6F8FB]
        "
            >

                {/* =====================================================
            SIDEBAR
        ====================================================== */}

                <AdminSidebar
                    mobileOpen={
                        mobileOpen
                    }
                    onClose={() =>
                        setMobileOpen(
                            false
                        )
                    }
                />


                {/* =====================================================
            MAIN
        ====================================================== */}

                <main
                    className="
            min-h-screen
            lg:pl-[250px]
          "
                >

                    {/* ===================================================
              HEADER
          ==================================================== */}

                    <AdminHeader
                        onMenuClick={() =>
                            setMobileOpen(
                                true
                            )
                        }
                    />


                    {/* ===================================================
              CONTENT
          ==================================================== */}

                    <div
                        className="
              px-4
              py-6

              sm:px-6

              lg:px-8
              lg:py-8
            "
                    >

                        {/* =================================================
                PAGE HEADER
            ================================================= */}

                        <div
                            className="
                flex
                flex-col
                gap-4

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
                        >

                            <div>

                                <p
                                    className="
                    text-sm
                    font-medium
                    text-[#0075FF]
                  "
                                >
                                    Content Management
                                </p>


                                <h1
                                    className="
                    mt-1
                    text-2xl
                    font-semibold
                    tracking-[-0.4px]
                    text-slate-900

                    sm:text-3xl
                  "
                                >
                                    Circulars & Notices
                                </h1>


                                <p
                                    className="
                    mt-2
                    max-w-[620px]
                    text-sm
                    leading-6
                    text-slate-500
                  "
                                >
                                    Manage school circulars,
                                    notices, featured updates
                                    and downloadable PDF
                                    documents.
                                </p>

                            </div>


                            <Link
                                href="/admin/circular-notices/new"
                                className="
    inline-flex h-11 items-center justify-center gap-2
    rounded-xl bg-[#0075FF] px-5
    text-sm font-semibold !text-white
    shadow-sm transition-all duration-200
    hover:bg-[#0065DC]
  "
                            >
                                <Plus size={17} className="text-white" />
                                Add Circular / Notice
                            </Link>

                        </div>


                        {/* =================================================
                FILTERS
            ================================================= */}

                        <div
                            className="
                mt-7

                rounded-2xl

                border
                border-slate-200

                bg-white

                p-4

                shadow-sm
              "
                        >

                            <div
                                className="
                  grid
                  grid-cols-1
                  gap-3

                  md:grid-cols-2

                  xl:grid-cols-[minmax(250px,1fr)_180px_180px_180px]
                "
                            >

                                {/* SEARCH */}

                                <div
                                    className="
                    relative
                  "
                                >

                                    <Search
                                        size={17}
                                        className="
                      absolute
                      left-4
                      top-1/2

                      -translate-y-1/2

                      text-slate-400
                    "
                                    />


                                    <input
                                        type="text"
                                        value={
                                            search
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search title or description..."
                                        className="
                      h-11
                      w-full

                      rounded-xl

                      border
                      border-slate-200

                      bg-white

                      pl-11
                      pr-4

                      text-sm
                      text-slate-800

                      outline-none

                      transition

                      placeholder:text-slate-400

                      focus:border-[#0075FF]
                      focus:ring-2
                      focus:ring-[#0075FF]/10
                    "
                                    />

                                </div>


                                {/* TYPE */}

                                <select
                                    value={
                                        contentType
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setContentType(
                                            event.target
                                                .value as
                                            CircularNoticeType |
                                            ""
                                        )
                                    }
                                    className="
                    h-11
                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-4

                    text-sm
                    text-slate-700

                    outline-none

                    focus:border-[#0075FF]
                  "
                                >
                                    <option value="">
                                        All Types
                                    </option>

                                    <option value="CIRCULAR">
                                        Circular
                                    </option>

                                    <option value="NOTICE">
                                        Notice
                                    </option>
                                </select>


                                {/* PUBLISHED */}

                                <select
                                    value={
                                        publishFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setPublishFilter(
                                            event.target
                                                .value as
                                            | "ALL"
                                            | "PUBLISHED"
                                            | "DRAFT"
                                        )
                                    }
                                    className="
                    h-11
                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-4

                    text-sm
                    text-slate-700

                    outline-none

                    focus:border-[#0075FF]
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


                                {/* FEATURED */}

                                <select
                                    value={
                                        featuredFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setFeaturedFilter(
                                            event.target
                                                .value as
                                            | "ALL"
                                            | "FEATURED"
                                            | "NORMAL"
                                        )
                                    }
                                    className="
                    h-11
                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-4

                    text-sm
                    text-slate-700

                    outline-none

                    focus:border-[#0075FF]
                  "
                                >
                                    <option value="ALL">
                                        All Items
                                    </option>

                                    <option value="FEATURED">
                                        Featured
                                    </option>

                                    <option value="NORMAL">
                                        Normal
                                    </option>
                                </select>

                            </div>

                        </div>


                        {/* =================================================
                ERROR
            ================================================= */}

                        {error && (

                            <div
                                className="
                  mt-5

                  rounded-xl

                  border
                  border-red-200

                  bg-red-50

                  px-4
                  py-3

                  text-sm
                  text-red-700
                "
                            >
                                {error}
                            </div>

                        )}


                        {/* =================================================
                TABLE
            ================================================= */}

                        <div
                            className="
                mt-5

                overflow-hidden

                rounded-2xl

                border
                border-slate-200

                bg-white

                shadow-sm
              "
                        >

                            <div
                                className="
                  overflow-x-auto
                "
                            >

                                <table
                                    className="
                    w-full
                    min-w-[1050px]
                    border-collapse
                  "
                                >

                                    <thead
                                        className="
                      bg-slate-50
                    "
                                    >
                                        <tr>

                                            <th
                                                className="
                          px-5
                          py-4

                          text-left

                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        "
                                            >
                                                Circular / Notice
                                            </th>


                                            <th
                                                className="
                          px-5
                          py-4

                          text-left

                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        "
                                            >
                                                Date
                                            </th>


                                            <th
                                                className="
                          px-5
                          py-4

                          text-left

                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        "
                                            >
                                                Type
                                            </th>


                                            <th
                                                className="
                          px-5
                          py-4

                          text-left

                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        "
                                            >
                                                PDF
                                            </th>


                                            <th
                                                className="
                          px-5
                          py-4

                          text-left

                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        "
                                            >
                                                Status
                                            </th>


                                            <th
                                                className="
                          px-5
                          py-4

                          text-right

                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-slate-500
                        "
                                            >
                                                Actions
                                            </th>

                                        </tr>
                                    </thead>


                                    <tbody>

                                        {/* =========================================
                        LOADING
                    ========================================== */}

                                        {loading && (

                                            <tr>

                                                <td
                                                    colSpan={6}
                                                    className="
                            px-5
                            py-16

                            text-center

                            text-sm
                            text-slate-500
                          "
                                                >
                                                    Loading Circulars
                                                    & Notices...
                                                </td>

                                            </tr>

                                        )}


                                        {/* =========================================
                        EMPTY
                    ========================================== */}

                                        {!loading &&
                                            items.length ===
                                            0 && (

                                                <tr>

                                                    <td
                                                        colSpan={6}
                                                        className="
                              px-5
                              py-16

                              text-center
                            "
                                                    >

                                                        <FileText
                                                            size={32}
                                                            className="
                                mx-auto
                                text-slate-300
                              "
                                                        />


                                                        <p
                                                            className="
                                mt-3

                                text-sm
                                font-medium
                                text-slate-700
                              "
                                                        >
                                                            No Circulars
                                                            or Notices
                                                            found
                                                        </p>


                                                        <p
                                                            className="
                                mt-1
                                text-xs
                                text-slate-400
                              "
                                                        >
                                                            Add a new
                                                            Circular or
                                                            Notice to get
                                                            started.
                                                        </p>

                                                    </td>

                                                </tr>

                                            )}


                                        {/* =========================================
                        ROWS
                    ========================================== */}

                                        {!loading &&
                                            items.map(
                                                (
                                                    item
                                                ) => {

                                                    const pdfUrl =
                                                        getCircularNoticePdfUrl(
                                                            item.pdf_url
                                                        );


                                                    return (

                                                        <tr
                                                            key={
                                                                item.id
                                                            }
                                                            className="
                                border-t
                                border-slate-100

                                transition-colors

                                hover:bg-slate-50/70
                              "
                                                        >

                                                            {/* =================================
                                  TITLE
                              ================================== */}

                                                            <td
                                                                className="
                                  px-5
                                  py-4
                                "
                                                            >

                                                                <div
                                                                    className="
                                    flex
                                    items-start
                                    gap-3
                                  "
                                                                >

                                                                    <div
                                                                        className="
                                      flex
                                      h-10
                                      w-10
                                      shrink-0
                                      items-center
                                      justify-center

                                      rounded-xl

                                      bg-[#EEF6FF]

                                      text-[#0075FF]
                                    "
                                                                    >
                                                                        <FileText
                                                                            size={18}
                                                                        />
                                                                    </div>


                                                                    <div
                                                                        className="
                                      min-w-0
                                    "
                                                                    >

                                                                        <div
                                                                            className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                      "
                                                                        >

                                                                            <p
                                                                                className="
                                          max-w-[350px]

                                          truncate

                                          text-sm
                                          font-semibold
                                          text-slate-900
                                        "
                                                                            >
                                                                                {
                                                                                    item.title
                                                                                }
                                                                            </p>


                                                                            {item.is_featured && (

                                                                                <span
                                                                                    className="
                                            inline-flex
                                            items-center
                                            gap-1

                                            rounded-full

                                            bg-amber-50

                                            px-2
                                            py-1

                                            text-[10px]
                                            font-semibold
                                            text-amber-700
                                          "
                                                                                >
                                                                                    <Star
                                                                                        size={11}
                                                                                        fill="currentColor"
                                                                                    />

                                                                                    Featured
                                                                                </span>

                                                                            )}

                                                                        </div>


                                                                        <p
                                                                            className="
                                        mt-1

                                        max-w-[410px]

                                        truncate

                                        text-xs
                                        text-slate-500
                                      "
                                                                        >
                                                                            {
                                                                                item.description
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* =================================
                                  DATE
                              ================================== */}

                                                            <td
                                                                className="
                                  whitespace-nowrap

                                  px-5
                                  py-4

                                  text-sm
                                  text-slate-600
                                "
                                                            >
                                                                {formatDate(
                                                                    item.notice_date
                                                                )}
                                                            </td>


                                                            {/* =================================
                                  TYPE
                              ================================== */}

                                                            <td
                                                                className="
                                  px-5
                                  py-4
                                "
                                                            >

                                                                <span
                                                                    className={`
                                    inline-flex

                                    rounded-full

                                    px-2.5
                                    py-1

                                    text-xs
                                    font-semibold

                                    ${item.content_type ===
                                                                            "CIRCULAR"
                                                                            ? "bg-purple-50 text-purple-700"
                                                                            : "bg-blue-50 text-blue-700"
                                                                        }
                                  `}
                                                                >
                                                                    {
                                                                        item.content_type ===
                                                                            "CIRCULAR"
                                                                            ? "Circular"
                                                                            : "Notice"
                                                                    }
                                                                </span>

                                                            </td>


                                                            {/* =================================
                                  PDF
                              ================================== */}

                                                            <td
                                                                className="
                                  px-5
                                  py-4
                                "
                                                            >

                                                                {pdfUrl ? (

                                                                    <a
                                                                        href={
                                                                            pdfUrl
                                                                        }
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="
                                      inline-flex
                                      items-center
                                      gap-1.5

                                      text-xs
                                      font-semibold
                                      text-[#0075FF]

                                      hover:underline
                                    "
                                                                    >
                                                                        View PDF

                                                                        <ExternalLink
                                                                            size={13}
                                                                        />
                                                                    </a>

                                                                ) : (

                                                                    <span
                                                                        className="
                                      text-xs
                                      text-slate-400
                                    "
                                                                    >
                                                                        No PDF
                                                                    </span>

                                                                )}

                                                            </td>


                                                            {/* =================================
                                  STATUS
                              ================================== */}

                                                            <td
                                                                className="
                                  px-5
                                  py-4
                                "
                                                            >

                                                                <span
                                                                    className={`
                                    inline-flex

                                    rounded-full

                                    px-2.5
                                    py-1

                                    text-xs
                                    font-semibold

                                    ${item.is_published
                                                                            ? "bg-emerald-50 text-emerald-700"
                                                                            : "bg-slate-100 text-slate-600"
                                                                        }
                                  `}
                                                                >
                                                                    {
                                                                        item.is_published
                                                                            ? "Published"
                                                                            : "Draft"
                                                                    }
                                                                </span>

                                                            </td>


                                                            {/* =================================
                                  ACTIONS
                              ================================== */}

                                                            <td
                                                                className="
                                  px-5
                                  py-4
                                "
                                                            >

                                                                <div
                                                                    className="
                                    flex
                                    items-center
                                    justify-end
                                    gap-2
                                  "
                                                                >

                                                                    <Link
                                                                        href={`/admin/circular-notices/${item.id}/edit`}
                                                                        className="
                                      flex
                                      h-9
                                      w-9
                                      items-center
                                      justify-center

                                      rounded-lg

                                      border
                                      border-slate-200

                                      bg-white

                                      text-slate-600

                                      transition-all

                                      hover:border-[#0075FF]
                                      hover:bg-[#EEF6FF]
                                      hover:text-[#0075FF]
                                    "
                                                                        title="Edit"
                                                                    >
                                                                        <Pencil
                                                                            size={15}
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
                                                                                item
                                                                            )
                                                                        }
                                                                        className="
                                      flex
                                      h-9
                                      w-9
                                      items-center
                                      justify-center

                                      rounded-lg

                                      border
                                      border-red-100

                                      bg-red-50

                                      text-red-600

                                      transition-all

                                      hover:bg-red-100

                                      disabled:cursor-not-allowed
                                      disabled:opacity-50
                                    "
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2
                                                                            size={15}
                                                                        />
                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    );

                                                }
                                            )}

                                    </tbody>

                                </table>

                            </div>


                            {/* =================================================
                  PAGINATION
              ================================================= */}

                            {!loading &&
                                total > 0 && (

                                    <div
                                        className="
                      flex
                      flex-col
                      gap-3

                      border-t
                      border-slate-100

                      px-5
                      py-4

                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                                    >

                                        <p
                                            className="
                        text-xs
                        text-slate-500
                      "
                                        >
                                            Showing page{" "}
                                            <strong>
                                                {page}
                                            </strong>{" "}
                                            of{" "}
                                            <strong>
                                                {totalPages}
                                            </strong>

                                            {" "}•{" "}

                                            {total} total
                                            item
                                            {total !== 1
                                                ? "s"
                                                : ""}
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
                                                    page <= 1
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
                          inline-flex
                          h-9
                          items-center
                          gap-1

                          rounded-lg

                          border
                          border-slate-200

                          bg-white

                          px-3

                          text-xs
                          font-medium
                          text-slate-600

                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                                            >
                                                <ChevronLeft
                                                    size={14}
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
                          inline-flex
                          h-9
                          items-center
                          gap-1

                          rounded-lg

                          border
                          border-slate-200

                          bg-white

                          px-3

                          text-xs
                          font-medium
                          text-slate-600

                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                                            >
                                                Next

                                                <ChevronRight
                                                    size={14}
                                                />
                                            </button>

                                        </div>

                                    </div>

                                )}

                        </div>

                    </div>

                </main>

            </div>

        </AdminAuthGuard>
    );
}