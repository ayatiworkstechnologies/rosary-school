"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import {
  ArrowLeft,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  createAdminCircularNotice,
  uploadCircularNoticePdf,
  type CircularNoticeType,
} from "@/services/adminCircularNoticeService";


/* =========================================================
   CONSTANTS
========================================================= */

const MAX_PDF_SIZE =
  10 * 1024 * 1024;


/* =========================================================
   COMPONENT
========================================================= */

export default function NewCircularNoticePage() {
  const router = useRouter();


  /* =========================================================
     ADMIN LAYOUT
  ========================================================= */

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);


  /* =========================================================
     FORM STATE
  ========================================================= */

  const [
    contentType,
    setContentType,
  ] = useState<CircularNoticeType>(
    "NOTICE"
  );


  const [
    title,
    setTitle,
  ] = useState("");


  const [
    description,
    setDescription,
  ] = useState("");


  const [
    noticeDate,
    setNoticeDate,
  ] = useState("");


  const [
    pdfFile,
    setPdfFile,
  ] = useState<File | null>(
    null
  );


  const [
    isPublished,
    setIsPublished,
  ] = useState(true);


  const [
    isFeatured,
    setIsFeatured,
  ] = useState(false);


  /* =========================================================
     REQUEST STATE
  ========================================================= */

  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* =========================================================
     PDF SELECT
  ========================================================= */

  const handlePdfChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setError("");


    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    /* =====================================================
       FILE TYPE
    ===================================================== */

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();


    if (
      file.type !==
        "application/pdf" &&
      extension !== "pdf"
    ) {
      setError(
        "Please select a PDF file."
      );

      event.target.value = "";

      return;
    }


    /* =====================================================
       FILE SIZE
    ===================================================== */

    if (
      file.size >
      MAX_PDF_SIZE
    ) {
      setError(
        "PDF file size must not exceed 10 MB."
      );

      event.target.value = "";

      return;
    }


    setPdfFile(
      file
    );
  };


  /* =========================================================
     REMOVE SELECTED PDF
  ========================================================= */

  const removePdf = () => {
    setPdfFile(
      null
    );
  };


  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();


    if (saving) {
      return;
    }


    setError("");


    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    const cleanedTitle =
      title.trim();


    const cleanedDescription =
      description.trim();


    if (
      cleanedTitle.length < 2
    ) {
      setError(
        "Title must contain at least 2 characters."
      );

      return;
    }


    if (
      cleanedDescription.length < 2
    ) {
      setError(
        "Description must contain at least 2 characters."
      );

      return;
    }


    if (!noticeDate) {
      setError(
        "Please select a Circular / Notice date."
      );

      return;
    }


    try {
      setSaving(true);


      /* ===================================================
         STEP 1
         UPLOAD PDF IF SELECTED
      ==================================================== */

      let pdfUrl:
        string | null = null;


      if (pdfFile) {
        const uploadResponse =
          await uploadCircularNoticePdf(
            pdfFile
          );


        pdfUrl =
          uploadResponse.pdf_url;
      }


      /* ===================================================
         STEP 2
         CREATE DATABASE RECORD
      ==================================================== */

      await createAdminCircularNotice({
        content_type:
          contentType,

        title:
          cleanedTitle,

        description:
          cleanedDescription,

        notice_date:
          noticeDate,

        pdf_url:
          pdfUrl,

        is_published:
          isPublished,

        is_featured:
          isFeatured,
      });


      /* ===================================================
         SUCCESS
      ==================================================== */

      router.push(
        "/admin/circular-notices"
      );

      router.refresh();

    } catch (err) {
      console.error(
        "Unable to create Circular / Notice:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Unable to create Circular / Notice."
      );

    } finally {
      setSaving(false);
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
              mx-auto
              w-full
              max-w-[1100px]

              px-4
              py-6

              sm:px-6

              lg:px-8
              lg:py-8
            "
          >

            {/* =================================================
                BACK
            ================================================= */}

            <Link
              href="/admin/circular-notices"
              className="
                inline-flex
                items-center
                gap-2

                text-sm
                font-medium
                text-slate-500

                transition

                hover:text-[#0075FF]
              "
            >
              <ArrowLeft
                size={17}
              />

              Back to Circulars & Notices
            </Link>


            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                mt-5
              "
            >

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
                Add Circular / Notice
              </h1>


              <p
                className="
                  mt-2

                  max-w-[650px]

                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Create a school Circular or Notice,
                optionally upload a PDF document and
                choose whether it should be published
                or featured on the website.
              </p>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div
                className="
                  mt-6

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
                FORM
            ================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="
                mt-6

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
                  p-5

                  sm:p-6

                  lg:p-8
                "
              >

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-6

                    md:grid-cols-2
                  "
                >

                  {/* ===========================================
                      TYPE
                  ============================================ */}

                  <div>

                    <label
                      className="
                        mb-2
                        block

                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Content Type
                    </label>


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
                            CircularNoticeType
                        )
                      }
                      className="
                        h-12
                        w-full

                        rounded-xl

                        border
                        border-slate-200

                        bg-white

                        px-4

                        text-sm
                        text-slate-800

                        outline-none

                        transition

                        focus:border-[#0075FF]
                        focus:ring-2
                        focus:ring-[#0075FF]/10
                      "
                    >
                      <option value="NOTICE">
                        Notice
                      </option>

                      <option value="CIRCULAR">
                        Circular
                      </option>
                    </select>

                  </div>


                  {/* ===========================================
                      DATE
                  ============================================ */}

                  <div>

                    <label
                      className="
                        mb-2
                        block

                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Date
                    </label>


                    <input
                      type="date"
                      value={
                        noticeDate
                      }
                      onChange={(
                        event
                      ) =>
                        setNoticeDate(
                          event.target.value
                        )
                      }
                      required
                      className="
                        h-12
                        w-full

                        rounded-xl

                        border
                        border-slate-200

                        bg-white

                        px-4

                        text-sm
                        text-slate-800

                        outline-none

                        transition

                        focus:border-[#0075FF]
                        focus:ring-2
                        focus:ring-[#0075FF]/10
                      "
                    />

                  </div>


                  {/* ===========================================
                      TITLE
                  ============================================ */}

                  <div
                    className="
                      md:col-span-2
                    "
                  >

                    <label
                      className="
                        mb-2
                        block

                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Title
                    </label>


                    <input
                      type="text"
                      value={
                        title
                      }
                      onChange={(
                        event
                      ) =>
                        setTitle(
                          event.target.value
                        )
                      }
                      placeholder="Example: Quarterly Examination Timetable"
                      maxLength={255}
                      required
                      className="
                        h-12
                        w-full

                        rounded-xl

                        border
                        border-slate-200

                        bg-white

                        px-4

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


                  {/* ===========================================
                      DESCRIPTION
                  ============================================ */}

                  <div
                    className="
                      md:col-span-2
                    "
                  >

                    <label
                      className="
                        mb-2
                        block

                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Description
                    </label>


                    <textarea
                      value={
                        description
                      }
                      onChange={(
                        event
                      ) =>
                        setDescription(
                          event.target.value
                        )
                      }
                      placeholder="Enter a short description..."
                      rows={5}
                      required
                      className="
                        w-full

                        resize-none

                        rounded-xl

                        border
                        border-slate-200

                        bg-white

                        px-4
                        py-3

                        text-sm
                        leading-6
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


                  {/* ===========================================
                      PDF UPLOAD
                  ============================================ */}

                  <div
                    className="
                      md:col-span-2
                    "
                  >

                    <label
                      className="
                        mb-2
                        block

                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      PDF Document
                    </label>


                    {!pdfFile ? (

                      <label
                        className="
                          flex
                          cursor-pointer
                          flex-col
                          items-center
                          justify-center

                          rounded-2xl

                          border-2
                          border-dashed
                          border-slate-200

                          bg-slate-50/60

                          px-5
                          py-9

                          text-center

                          transition-all

                          hover:border-[#0075FF]/50
                          hover:bg-[#F4F9FF]
                        "
                      >

                        <div
                          className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center

                            rounded-xl

                            bg-[#EAF4FF]

                            text-[#0075FF]
                          "
                        >
                          <Upload
                            size={21}
                          />
                        </div>


                        <p
                          className="
                            mt-3

                            text-sm
                            font-semibold
                            text-slate-700
                          "
                        >
                          Choose PDF document
                        </p>


                        <p
                          className="
                            mt-1

                            text-xs
                            text-slate-400
                          "
                        >
                          PDF only • Maximum 10 MB
                        </p>


                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={
                            handlePdfChange
                          }
                          className="
                            hidden
                          "
                        />

                      </label>

                    ) : (

                      <div
                        className="
                          flex
                          flex-col
                          gap-4

                          rounded-2xl

                          border
                          border-[#0075FF]/20

                          bg-[#F7FBFF]

                          p-4

                          sm:flex-row
                          sm:items-center
                          sm:justify-between
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

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center

                              rounded-xl

                              bg-[#E5F2FF]

                              text-[#0075FF]
                            "
                          >
                            <FileText
                              size={20}
                            />
                          </div>


                          <div
                            className="
                              min-w-0
                            "
                          >

                            <p
                              className="
                                truncate

                                text-sm
                                font-semibold
                                text-slate-800
                              "
                            >
                              {
                                pdfFile.name
                              }
                            </p>


                            <p
                              className="
                                mt-1

                                text-xs
                                text-slate-400
                              "
                            >
                              {(
                                pdfFile.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>

                          </div>

                        </div>


                        <button
                          type="button"
                          onClick={
                            removePdf
                          }
                          className="
                            inline-flex
                            h-9
                            items-center
                            justify-center
                            gap-2

                            rounded-lg

                            border
                            border-red-100

                            bg-white

                            px-3

                            text-xs
                            font-semibold
                            text-red-600

                            transition

                            hover:bg-red-50
                          "
                        >
                          <X
                            size={14}
                          />

                          Remove
                        </button>

                      </div>

                    )}


                    <p
                      className="
                        mt-2

                        text-xs
                        leading-5
                        text-slate-400
                      "
                    >
                      PDF is optional while creating a
                      draft. You can upload or replace it
                      later from the Edit page.
                    </p>

                  </div>

                </div>


                {/* =================================================
                    SETTINGS
                ================================================= */}

                <div
                  className="
                    mt-8

                    border-t
                    border-slate-100

                    pt-6
                  "
                >

                  <h2
                    className="
                      text-base
                      font-semibold
                      text-slate-900
                    "
                  >
                    Publishing Settings
                  </h2>


                  <div
                    className="
                      mt-4

                      grid
                      grid-cols-1
                      gap-4

                      md:grid-cols-2
                    "
                  >

                    {/* ===========================================
                        PUBLISHED
                    ============================================ */}

                    <label
                      className="
                        flex
                        cursor-pointer
                        items-start
                        justify-between
                        gap-4

                        rounded-xl

                        border
                        border-slate-200

                        p-4

                        transition

                        hover:border-[#0075FF]/30
                      "
                    >

                      <div>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                        >
                          Published
                        </p>


                        <p
                          className="
                            mt-1

                            text-xs
                            leading-5
                            text-slate-500
                          "
                        >
                          Show this Circular / Notice
                          on the public school website.
                        </p>

                      </div>


                      <input
                        type="checkbox"
                        checked={
                          isPublished
                        }
                        onChange={(
                          event
                        ) =>
                          setIsPublished(
                            event.target.checked
                          )
                        }
                        className="
                          mt-1
                          h-4
                          w-4

                          accent-[#0075FF]
                        "
                      />

                    </label>


                    {/* ===========================================
                        FEATURED
                    ============================================ */}

                    <label
                      className="
                        flex
                        cursor-pointer
                        items-start
                        justify-between
                        gap-4

                        rounded-xl

                        border
                        border-slate-200

                        p-4

                        transition

                        hover:border-[#0075FF]/30
                      "
                    >

                      <div>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                        >
                          Featured
                        </p>


                        <p
                          className="
                            mt-1

                            text-xs
                            leading-5
                            text-slate-500
                          "
                        >
                          Display this item in the
                          large highlighted card on
                          the public Notice Board.
                        </p>


                        <p
                          className="
                            mt-2

                            text-[11px]
                            font-medium
                            text-amber-600
                          "
                        >
                          Only one item can be featured
                          at a time.
                        </p>

                      </div>


                      <input
                        type="checkbox"
                        checked={
                          isFeatured
                        }
                        onChange={(
                          event
                        ) =>
                          setIsFeatured(
                            event.target.checked
                          )
                        }
                        className="
                          mt-1
                          h-4
                          w-4

                          accent-[#0075FF]
                        "
                      />

                    </label>

                  </div>

                </div>

              </div>


              {/* =================================================
                  ACTION BAR
              ================================================= */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3

                  border-t
                  border-slate-100

                  bg-slate-50/60

                  px-5
                  py-4

                  sm:flex-row
                  sm:items-center
                  sm:justify-end

                  sm:px-6

                  lg:px-8
                "
              >

                <Link
                  href="/admin/circular-notices"
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center

                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-5

                    text-sm
                    font-semibold
                    text-slate-600

                    transition

                    hover:bg-slate-50
                  "
                >
                  Cancel
                </Link>


                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    bg-[#0075FF]

                    px-6

                    text-sm
                    font-semibold
                    text-white

                    transition-all

                    hover:bg-[#0065DC]

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {saving && (
                    <Loader2
                      size={17}
                      className="
                        animate-spin
                      "
                    />
                  )}


                  {saving
                    ? pdfFile
                      ? "Uploading & Saving..."
                      : "Saving..."
                    : "Create Circular / Notice"}

                </button>

              </div>

            </form>

          </div>

        </main>

      </div>

    </AdminAuthGuard>
  );
}