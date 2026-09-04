"use client";

import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  getAdminCircularNoticeById,
  getCircularNoticePdfUrl,
  updateAdminCircularNotice,
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

export default function EditCircularNoticePage() {
  const router = useRouter();

  const params = useParams<{
    id: string;
  }>();


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
    isPublished,
    setIsPublished,
  ] = useState(false);


  const [
    isFeatured,
    setIsFeatured,
  ] = useState(false);


  /* =========================================================
     PDF STATE
  ========================================================= */

  const [
    existingPdfUrl,
    setExistingPdfUrl,
  ] = useState<string | null>(
    null
  );


  const [
    pdfFile,
    setPdfFile,
  ] = useState<File | null>(
    null
  );


  /* =========================================================
     REQUEST STATE
  ========================================================= */

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* =========================================================
     EVENT ID
  ========================================================= */

  const circularNoticeId =
    Number(
      params.id
    );


  /* =========================================================
     LOAD EXISTING DATA
  ========================================================= */

  useEffect(() => {
    let mounted = true;


    const loadItem =
      async () => {
        if (
          !Number.isInteger(
            circularNoticeId
          ) ||
          circularNoticeId <= 0
        ) {
          setError(
            "Invalid Circular / Notice ID."
          );

          setLoading(false);

          return;
        }


        try {
          setLoading(true);

          setError("");


          const item =
            await getAdminCircularNoticeById(
              circularNoticeId
            );


          if (!mounted) {
            return;
          }


          setContentType(
            item.content_type
          );

          setTitle(
            item.title
          );

          setDescription(
            item.description
          );

          setNoticeDate(
            item.notice_date
          );

          setExistingPdfUrl(
            item.pdf_url
          );

          setIsPublished(
            item.is_published
          );

          setIsFeatured(
            item.is_featured
          );

        } catch (err) {
          console.error(
            "Unable to load Circular / Notice:",
            err
          );


          if (mounted) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to load Circular / Notice."
            );
          }

        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };


    loadItem();


    return () => {
      mounted = false;
    };

  }, [
    circularNoticeId,
  ]);


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


    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();


    /* =====================================================
       CHECK TYPE
    ===================================================== */

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
       CHECK SIZE
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
     REMOVE NEW SELECTED PDF
  ========================================================= */

  const removeSelectedPdf = () => {
    setPdfFile(
      null
    );
  };


  /* =========================================================
     REMOVE EXISTING PDF
  ========================================================= */

  const removeExistingPdf = () => {
    setExistingPdfUrl(
      null
    );

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


    const cleanedTitle =
      title.trim();


    const cleanedDescription =
      description.trim();


    /* =====================================================
       VALIDATION
    ===================================================== */

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


    if (
      !Number.isInteger(
        circularNoticeId
      ) ||
      circularNoticeId <= 0
    ) {
      setError(
        "Invalid Circular / Notice ID."
      );

      return;
    }


    try {
      setSaving(true);


      /* ===================================================
         CURRENT PDF
      ==================================================== */

      let finalPdfUrl =
        existingPdfUrl;


      /* ===================================================
         UPLOAD REPLACEMENT PDF
      ==================================================== */

      if (pdfFile) {
        const uploadResponse =
          await uploadCircularNoticePdf(
            pdfFile
          );


        finalPdfUrl =
          uploadResponse.pdf_url;
      }


      /* ===================================================
         UPDATE DATABASE
      ==================================================== */

      await updateAdminCircularNotice(
        circularNoticeId,
        {
          content_type:
            contentType,

          title:
            cleanedTitle,

          description:
            cleanedDescription,

          notice_date:
            noticeDate,

          pdf_url:
            finalPdfUrl,

          is_published:
            isPublished,

          is_featured:
            isFeatured,
        }
      );


      /* ===================================================
         SUCCESS
      ==================================================== */

      router.push(
        "/admin/circular-notices"
      );

      router.refresh();

    } catch (err) {
      console.error(
        "Unable to update Circular / Notice:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Unable to update Circular / Notice."
      );

    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     CURRENT PUBLIC PDF URL
  ========================================================= */

  const currentPdfFullUrl =
    getCircularNoticePdfUrl(
      existingPdfUrl
    );


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
                Edit Circular / Notice
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
                Update the content, replace the
                attached PDF or modify publishing
                and featured settings.
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
                LOADING
            ================================================= */}

            {loading ? (

              <div
                className="
                  mt-6

                  flex
                  min-h-[350px]
                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-slate-200

                  bg-white

                  shadow-sm
                "
              >
                <div
                  className="
                    text-center
                  "
                >
                  <Loader2
                    size={28}
                    className="
                      mx-auto
                      animate-spin
                      text-[#0075FF]
                    "
                  />

                  <p
                    className="
                      mt-3

                      text-sm
                      text-slate-500
                    "
                  >
                    Loading Circular / Notice...
                  </p>
                </div>
              </div>

            ) : (

              /* =================================================
                 FORM
              ================================================= */

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

                    {/* =========================================
                        TYPE
                    ========================================== */}

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


                    {/* =========================================
                        DATE
                    ========================================== */}

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

                          focus:border-[#0075FF]
                          focus:ring-2
                          focus:ring-[#0075FF]/10
                        "
                      />
                    </div>


                    {/* =========================================
                        TITLE
                    ========================================== */}

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

                          focus:border-[#0075FF]
                          focus:ring-2
                          focus:ring-[#0075FF]/10
                        "
                      />
                    </div>


                    {/* =========================================
                        DESCRIPTION
                    ========================================== */}

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

                          focus:border-[#0075FF]
                          focus:ring-2
                          focus:ring-[#0075FF]/10
                        "
                      />
                    </div>


                    {/* =========================================
                        PDF
                    ========================================== */}

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


                      {/* =======================================
                          NEW SELECTED PDF
                      ======================================== */}

                      {pdfFile ? (

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
                                {pdfFile.name}
                              </p>


                              <p
                                className="
                                  mt-1

                                  text-xs
                                  text-slate-400
                                "
                              >
                                New PDF •{" "}
                                {(
                                  pdfFile.size /
                                  1024 /
                                  1024
                                ).toFixed(
                                  2
                                )}{" "}
                                MB
                              </p>
                            </div>
                          </div>


                          <button
                            type="button"
                            onClick={
                              removeSelectedPdf
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

                              hover:bg-red-50
                            "
                          >
                            <X
                              size={14}
                            />

                            Remove
                          </button>
                        </div>

                      ) : currentPdfFullUrl ? (

                        /* =====================================
                           EXISTING PDF
                        ====================================== */

                        <div
                          className="
                            flex
                            flex-col
                            gap-4

                            rounded-2xl

                            border
                            border-slate-200

                            bg-slate-50

                            p-4

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <div
                              className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center

                                rounded-xl

                                bg-[#EAF4FF]

                                text-[#0075FF]
                              "
                            >
                              <FileText
                                size={20}
                              />
                            </div>


                            <div>
                              <p
                                className="
                                  text-sm
                                  font-semibold
                                  text-slate-800
                                "
                              >
                                Current PDF Document
                              </p>


                              <a
                                href={
                                  currentPdfFullUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="
                                  mt-1

                                  inline-flex
                                  items-center
                                  gap-1

                                  text-xs
                                  font-semibold
                                  text-[#0075FF]

                                  hover:underline
                                "
                              >
                                View PDF

                                <ExternalLink
                                  size={12}
                                />
                              </a>
                            </div>
                          </div>


                          <button
                            type="button"
                            onClick={
                              removeExistingPdf
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

                              hover:bg-red-50
                            "
                          >
                            <X
                              size={14}
                            />

                            Remove PDF
                          </button>
                        </div>

                      ) : (

                        /* =====================================
                           UPLOAD NEW PDF
                        ====================================== */

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

                            transition

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
                            className="hidden"
                          />
                        </label>

                      )}


                      {/* =======================================
                          REPLACE BUTTON
                      ======================================== */}

                      {!pdfFile &&
                        currentPdfFullUrl && (

                          <label
                            className="
                              mt-3

                              inline-flex
                              cursor-pointer
                              items-center
                              gap-2

                              text-xs
                              font-semibold
                              text-[#0075FF]

                              hover:underline
                            "
                          >
                            <Upload
                              size={14}
                            />

                            Replace with another PDF

                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={
                                handlePdfChange
                              }
                              className="hidden"
                            />
                          </label>

                        )}
                    </div>

                  </div>


                  {/* =================================================
                      PUBLISHING
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

                      {/* PUBLISHED */}

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
                            Show this item on
                            the public website.
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


                      {/* FEATURED */}

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
                            Show this item in
                            the large highlighted
                            Notice Board card.
                          </p>


                          <p
                            className="
                              mt-2

                              text-[11px]
                              font-medium
                              text-amber-600
                            "
                          >
                            Only one item can be
                            featured at a time.
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

                      transition

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
                        ? "Uploading & Updating..."
                        : "Updating..."
                      : "Update Circular / Notice"}
                  </button>
                </div>

              </form>

            )}

          </div>

        </main>

      </div>

    </AdminAuthGuard>
  );
}