"use client";

import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  FileBarChart2,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Loader2,
  NotebookPen,
  Save,
  TableProperties,
  Upload,
  X,
} from "lucide-react";

import AdminAuthGuard from "../../../../components/admin/AdminAuthGuard";
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import AdminHeader from "../../../../components/admin/AdminHeader";

import {
  createDownload,
  formatDownloadFileSize,
  type DownloadIconType,
  uploadDownloadFile,
  uploadDownloadIcon,
} from "../../../../services/adminDownloadService";


/* =========================================================
   LUCIDE ICON OPTIONS

   IMPORTANT:
   The backend stores only the key.

   Example:

   icon_key = "clock"

   React component itself is NOT stored in DB.
========================================================= */

const lucideIcons = [
  {
    key: "clock",
    label: "Clock",
    icon: Clock3,
  },
  {
    key: "book",
    label: "Book",
    icon: BookOpen,
  },
  {
    key: "calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    key: "report",
    label: "Report",
    icon: FileBarChart2,
  },
  {
    key: "clipboard",
    label: "Clipboard",
    icon: ClipboardList,
  },
  {
    key: "spreadsheet",
    label: "Spreadsheet",
    icon: FileSpreadsheet,
  },
  {
    key: "exam",
    label: "Exam",
    icon: NotebookPen,
  },
  {
    key: "handbook",
    label: "Handbook",
    icon: TableProperties,
  },
] as const;


/* =========================================================
   MAIN PAGE
========================================================= */

export default function AddDownloadPage() {
  const router =
    useRouter();


  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  /* =======================================================
     FORM
  ======================================================= */

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    iconType,
    setIconType,
  ] = useState<DownloadIconType>(
    "lucide",
  );

  const [
    iconKey,
    setIconKey,
  ] = useState(
    "clock",
  );

  const [
    displayOrder,
    setDisplayOrder,
  ] = useState(
    "1",
  );

  const [
    isActive,
    setIsActive,
  ] = useState(true);


  /* =======================================================
     FILES
  ======================================================= */

  const [
    pdfFile,
    setPdfFile,
  ] = useState<
    File | null
  >(null);

  const [
    iconFile,
    setIconFile,
  ] = useState<
    File | null
  >(null);

  const [
    iconPreview,
    setIconPreview,
  ] = useState<
    string | null
  >(null);


  /* =======================================================
     UI STATE
  ======================================================= */

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    uploadStep,
    setUploadStep,
  ] = useState("");


  /* =======================================================
     SELECTED LUCIDE ICON
  ======================================================= */

  const selectedLucide =
    useMemo(
      () =>
        lucideIcons.find(
          (item) =>
            item.key === iconKey,
        ) ||
        lucideIcons[0],
      [iconKey],
    );

  const SelectedIcon =
    selectedLucide.icon;


  /* =======================================================
     PDF SELECT
  ======================================================= */

  function handlePdfChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setError("");

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    /* -----------------------------------------------------
       PDF TYPE
    ----------------------------------------------------- */

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();


    if (
      extension !== "pdf"
    ) {
      setError(
        "Please select a PDF file.",
      );

      event.target.value =
        "";

      return;
    }


    /* -----------------------------------------------------
       50 MB
    ----------------------------------------------------- */

    const maxSize =
      50 *
      1024 *
      1024;


    if (
      file.size >
      maxSize
    ) {
      setError(
        "PDF file size cannot exceed 50 MB.",
      );

      event.target.value =
        "";

      return;
    }


    setPdfFile(
      file,
    );
  }


  /* =======================================================
     ICON SELECT
  ======================================================= */

  function handleIconChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setError("");

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];


    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      setError(
        "Custom icon must be JPG, JPEG, PNG or WEBP.",
      );

      event.target.value =
        "";

      return;
    }


    const maxSize =
      5 *
      1024 *
      1024;


    if (
      file.size >
      maxSize
    ) {
      setError(
        "Custom icon size cannot exceed 5 MB.",
      );

      event.target.value =
        "";

      return;
    }


    if (
      iconPreview
    ) {
      URL.revokeObjectURL(
        iconPreview,
      );
    }


    const preview =
      URL.createObjectURL(
        file,
      );


    setIconFile(
      file,
    );

    setIconPreview(
      preview,
    );
  }


  /* =======================================================
     REMOVE ICON FILE
  ======================================================= */

  function removeIconFile() {
    if (
      iconPreview
    ) {
      URL.revokeObjectURL(
        iconPreview,
      );
    }

    setIconFile(
      null,
    );

    setIconPreview(
      null,
    );
  }


  /* =======================================================
     CHANGE ICON TYPE
  ======================================================= */

  function changeIconType(
    value: DownloadIconType,
  ) {
    setIconType(
      value,
    );

    setError("");


    if (
      value === "lucide"
    ) {
      removeIconFile();
    }
  }


  /* =======================================================
     VALIDATION
  ======================================================= */

  function validateForm() {
    if (
      !title.trim()
    ) {
      return "Title is required.";
    }


    if (
      title.trim().length <
      2
    ) {
      return "Title must contain at least 2 characters.";
    }


    if (
      !description.trim()
    ) {
      return "Description is required.";
    }


    if (
      description.trim()
        .length < 2
    ) {
      return "Description must contain at least 2 characters.";
    }


    if (
      !pdfFile
    ) {
      return "Please select a PDF file.";
    }


    if (
      iconType ===
        "lucide" &&
      !iconKey
    ) {
      return "Please select a Lucide icon.";
    }


    if (
      iconType ===
        "image" &&
      !iconFile
    ) {
      return "Please upload a custom icon.";
    }


    const order =
      Number(
        displayOrder,
      );


    if (
      !Number.isInteger(
        order,
      ) ||
      order < 1
    ) {
      return "Display order must be 1 or greater.";
    }


    return null;
  }


  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    const validationError =
      validateForm();


    if (
      validationError
    ) {
      setError(
        validationError,
      );

      return;
    }


    if (
      !pdfFile
    ) {
      return;
    }


    try {
      setSaving(true);

      setError("");


      /* ---------------------------------------------------
         STEP 1
         UPLOAD PDF
      --------------------------------------------------- */

      setUploadStep(
        "Uploading PDF...",
      );


      const pdfResult =
        await uploadDownloadFile(
          pdfFile,
        );


      /* ---------------------------------------------------
         STEP 2
         CUSTOM ICON IF REQUIRED
      --------------------------------------------------- */

      let uploadedIconUrl:
        | string
        | null =
        null;


      if (
        iconType ===
        "image"
      ) {
        if (
          !iconFile
        ) {
          throw new Error(
            "Please select a custom icon.",
          );
        }


        setUploadStep(
          "Uploading icon...",
        );


        const iconResult =
          await uploadDownloadIcon(
            iconFile,
          );


        uploadedIconUrl =
          iconResult.icon_url;
      }


      /* ---------------------------------------------------
         STEP 3
         CREATE DATABASE RECORD
      --------------------------------------------------- */

      setUploadStep(
        "Saving download...",
      );


      await createDownload({
        title:
          title.trim(),

        description:
          description.trim(),

        icon_type:
          iconType,

        icon_key:
          iconType ===
          "lucide"
            ? iconKey
            : null,

        icon_url:
          iconType ===
          "image"
            ? uploadedIconUrl
            : null,

        file_url:
          pdfResult.file_url,

        original_file_name:
          pdfResult.original_name,

        file_size_bytes:
          pdfResult.size,

        display_order:
          Number(
            displayOrder,
          ),

        is_active:
          isActive,
      });


      setUploadStep(
        "Download created.",
      );


      router.push(
        "/admin/downloads",
      );

      router.refresh();

    } catch (err) {
      console.error(
        "Create download error:",
        err,
      );


      setError(
        err instanceof Error
          ? err.message
          : "Unable to create download.",
      );

    } finally {
      setSaving(false);

      setUploadStep("");
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
              max-w-[1400px]
              px-4
              py-6
              sm:px-6
              sm:py-7
              lg:px-8
              lg:py-8
            "
          >
            {/* HEADER */}

            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <Link
                href="/admin/downloads"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-[12px]
                  font-medium
                  text-[#667085]
                  transition
                  hover:text-[#0075FF]
                "
              >
                <ArrowLeft
                  size={15}
                />

                Back to Downloads
              </Link>


              <div
                className="
                  mt-5
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
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-[#0075FF]
                    "
                  >
                    Downloads
                  </p>

                  <h1
                    className="
                      mt-2
                      font-primary
                      text-[26px]
                      font-semibold
                      tracking-[-0.5px]
                      text-[#101828]
                      sm:text-[30px]
                    "
                  >
                    Add Download
                  </h1>

                  <p
                    className="
                      mt-2
                      max-w-[650px]
                      text-[12px]
                      leading-[1.6]
                      text-[#7B8797]
                      sm:text-[13px]
                    "
                  >
                    Add a downloadable
                    school resource and
                    choose either a built-in
                    icon or your own custom
                    icon.
                  </p>
                </div>
              </div>
            </motion.div>


            {/* ERROR */}

            {error && (
              <div
                className="
                  mt-6
                  flex
                  items-start
                  justify-between
                  gap-3
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
                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setError("")
                  }
                >
                  <X
                    size={15}
                  />
                </button>
              </div>
            )}


            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="
                mt-6
                grid
                grid-cols-1
                gap-6
                xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.65fr)]
              "
            >
              {/* ===========================================
                  LEFT COLUMN
              =========================================== */}

              <div
                className="
                  space-y-6
                "
              >
                {/* BASIC INFO */}

                <section
                  className="
                    rounded-[12px]
                    border
                    border-[#E7EDF4]
                    bg-white
                    p-5
                    shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                    sm:p-6
                  "
                >
                  <div>
                    <h2
                      className="
                        text-[15px]
                        font-semibold
                        text-[#101828]
                      "
                    >
                      Resource Information
                    </h2>

                    <p
                      className="
                        mt-1
                        text-[11px]
                        leading-5
                        text-[#98A2B3]
                      "
                    >
                      Enter the title and
                      description shown on
                      the Downloads page.
                    </p>
                  </div>


                  <div
                    className="
                      mt-6
                      space-y-5
                    "
                  >
                    {/* TITLE */}

                    <div>
                      <label
                        className="
                          mb-2
                          block
                          text-[12px]
                          font-semibold
                          text-[#344054]
                        "
                      >
                        Title
                        <span
                          className="
                            ml-1
                            text-[#F04438]
                          "
                        >
                          *
                        </span>
                      </label>

                      <input
                        type="text"
                        value={
                          title
                        }
                        onChange={(
                          event,
                        ) =>
                          setTitle(
                            event
                              .target
                              .value,
                          )
                        }
                        disabled={
                          saving
                        }
                        placeholder="Example: Timetable"
                        maxLength={
                          150
                        }
                        className="
                          h-[44px]
                          w-full
                          rounded-[9px]
                          border
                          border-[#DDE4EC]
                          bg-white
                          px-3.5
                          text-[13px]
                          text-[#344054]
                          outline-none
                          transition
                          placeholder:text-[#98A2B3]
                          focus:border-[#0075FF]
                          disabled:bg-[#F8FAFC]
                        "
                      />
                    </div>


                    {/* DESCRIPTION */}

                    <div>
                      <label
                        className="
                          mb-2
                          block
                          text-[12px]
                          font-semibold
                          text-[#344054]
                        "
                      >
                        Description
                        <span
                          className="
                            ml-1
                            text-[#F04438]
                          "
                        >
                          *
                        </span>
                      </label>

                      <textarea
                        value={
                          description
                        }
                        onChange={(
                          event,
                        ) =>
                          setDescription(
                            event
                              .target
                              .value,
                          )
                        }
                        disabled={
                          saving
                        }
                        placeholder="Briefly describe this downloadable resource..."
                        rows={5}
                        maxLength={
                          2000
                        }
                        className="
                          w-full
                          resize-none
                          rounded-[9px]
                          border
                          border-[#DDE4EC]
                          bg-white
                          px-3.5
                          py-3
                          text-[13px]
                          leading-6
                          text-[#344054]
                          outline-none
                          transition
                          placeholder:text-[#98A2B3]
                          focus:border-[#0075FF]
                          disabled:bg-[#F8FAFC]
                        "
                      />

                      <p
                        className="
                          mt-1.5
                          text-right
                          text-[10px]
                          text-[#98A2B3]
                        "
                      >
                        {
                          description
                            .length
                        }
                        /2000
                      </p>
                    </div>
                  </div>
                </section>


                {/* PDF */}

                <section
                  className="
                    rounded-[12px]
                    border
                    border-[#E7EDF4]
                    bg-white
                    p-5
                    shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                    sm:p-6
                  "
                >
                  <h2
                    className="
                      text-[15px]
                      font-semibold
                      text-[#101828]
                    "
                  >
                    PDF Document
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-[#98A2B3]
                    "
                  >
                    Upload the document
                    visitors will download.
                    PDF only, maximum 50 MB.
                  </p>


                  <div
                    className="
                      mt-5
                    "
                  >
                    {!pdfFile ? (
                      <label
                        className="
                          flex
                          min-h-[170px]
                          cursor-pointer
                          flex-col
                          items-center
                          justify-center
                          rounded-[11px]
                          border
                          border-dashed
                          border-[#C9D5E3]
                          bg-[#FAFCFF]
                          px-5
                          text-center
                          transition
                          hover:border-[#0075FF]
                          hover:bg-[#F7FBFF]
                        "
                      >
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
                          <Upload
                            size={20}
                          />
                        </div>

                        <p
                          className="
                            mt-3
                            text-[12px]
                            font-semibold
                            text-[#344054]
                          "
                        >
                          Select PDF
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            text-[#98A2B3]
                          "
                        >
                          Maximum file size
                          50 MB
                        </p>

                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          disabled={
                            saving
                          }
                          onChange={
                            handlePdfChange
                          }
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-[11px]
                          border
                          border-[#DDE7F0]
                          bg-[#F8FBFF]
                          p-4
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
                              rounded-[10px]
                              bg-[#EAF4FF]
                              text-[#0075FF]
                            "
                          >
                            <FileText
                              size={20}
                            />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-[12px]
                                font-semibold
                                text-[#344054]
                              "
                            >
                              {
                                pdfFile.name
                              }
                            </p>

                            <p
                              className="
                                mt-1
                                text-[10px]
                                text-[#98A2B3]
                              "
                            >
                              {formatDownloadFileSize(
                                pdfFile.size,
                              )}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={
                            saving
                          }
                          onClick={() =>
                            setPdfFile(
                              null,
                            )
                          }
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-[8px]
                            border
                            border-[#FEE4E2]
                            text-[#D92D20]
                            transition
                            hover:bg-[#FEF3F2]
                          "
                        >
                          <X
                            size={14}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </section>


                {/* ICON */}

                <section
                  className="
                    rounded-[12px]
                    border
                    border-[#E7EDF4]
                    bg-white
                    p-5
                    shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                    sm:p-6
                  "
                >
                  <h2
                    className="
                      text-[15px]
                      font-semibold
                      text-[#101828]
                    "
                  >
                    Resource Icon
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-[#98A2B3]
                    "
                  >
                    Choose one of the
                    existing website icons
                    or upload a custom image.
                  </p>


                  {/* TYPE SWITCH */}

                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-2
                      rounded-[10px]
                      bg-[#F2F4F7]
                      p-1
                    "
                  >
                    <button
                      type="button"
                      disabled={
                        saving
                      }
                      onClick={() =>
                        changeIconType(
                          "lucide",
                        )
                      }
                      className={`
                        h-[40px]
                        rounded-[8px]
                        text-[11px]
                        font-semibold
                        transition
                        ${
                          iconType ===
                          "lucide"
                            ? "bg-white text-[#0075FF] shadow-sm"
                            : "text-[#667085]"
                        }
                      `}
                    >
                      Built-in Icon
                    </button>

                    <button
                      type="button"
                      disabled={
                        saving
                      }
                      onClick={() =>
                        changeIconType(
                          "image",
                        )
                      }
                      className={`
                        h-[40px]
                        rounded-[8px]
                        text-[11px]
                        font-semibold
                        transition
                        ${
                          iconType ===
                          "image"
                            ? "bg-white text-[#0075FF] shadow-sm"
                            : "text-[#667085]"
                        }
                      `}
                    >
                      Custom Image
                    </button>
                  </div>


                  {/* LUCIDE */}

                  {iconType ===
                  "lucide" ? (
                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-4
                      "
                    >
                      {lucideIcons.map(
                        (item) => {
                          const Icon =
                            item.icon;

                          const selected =
                            iconKey ===
                            item.key;

                          return (
                            <button
                              key={
                                item.key
                              }
                              type="button"
                              disabled={
                                saving
                              }
                              onClick={() =>
                                setIconKey(
                                  item.key,
                                )
                              }
                              className={`
                                relative
                                flex
                                min-h-[90px]
                                flex-col
                                items-center
                                justify-center
                                gap-2
                                rounded-[10px]
                                border
                                transition
                                ${
                                  selected
                                    ? "border-[#0075FF] bg-[#F5FAFF] text-[#0075FF]"
                                    : "border-[#E4E7EC] bg-white text-[#667085] hover:border-[#A7CFFF]"
                                }
                              `}
                            >
                              {selected && (
                                <span
                                  className="
                                    absolute
                                    right-2
                                    top-2
                                    flex
                                    h-5
                                    w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#0075FF]
                                    text-white
                                  "
                                >
                                  <Check
                                    size={
                                      11
                                    }
                                  />
                                </span>
                              )}

                              <Icon
                                size={20}
                              />

                              <span
                                className="
                                  text-[10px]
                                  font-semibold
                                "
                              >
                                {
                                  item.label
                                }
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  ) : (
                    <div
                      className="
                        mt-5
                      "
                    >
                      {!iconFile ? (
                        <label
                          className="
                            flex
                            min-h-[150px]
                            cursor-pointer
                            flex-col
                            items-center
                            justify-center
                            rounded-[11px]
                            border
                            border-dashed
                            border-[#C9D5E3]
                            bg-[#FAFCFF]
                            px-5
                            text-center
                            transition
                            hover:border-[#0075FF]
                          "
                        >
                          <ImageIcon
                            size={24}
                            className="
                              text-[#0075FF]
                            "
                          />

                          <p
                            className="
                              mt-3
                              text-[12px]
                              font-semibold
                              text-[#344054]
                            "
                          >
                            Upload custom icon
                          </p>

                          <p
                            className="
                              mt-1
                              text-[10px]
                              text-[#98A2B3]
                            "
                          >
                            JPG, JPEG, PNG or
                            WEBP · Max 5 MB
                          </p>

                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            disabled={
                              saving
                            }
                            onChange={
                              handleIconChange
                            }
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-[11px]
                            border
                            border-[#DDE7F0]
                            bg-[#F8FBFF]
                            p-4
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
                            {iconPreview && (
                              <img
                                src={
                                  iconPreview
                                }
                                alt="Icon preview"
                                className="
                                  h-12
                                  w-12
                                  rounded-[9px]
                                  border
                                  border-[#E4E7EC]
                                  bg-white
                                  object-contain
                                  p-1
                                "
                              />
                            )}

                            <div className="min-w-0">
                              <p
                                className="
                                  truncate
                                  text-[12px]
                                  font-semibold
                                  text-[#344054]
                                "
                              >
                                {
                                  iconFile.name
                                }
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-[10px]
                                  text-[#98A2B3]
                                "
                              >
                                {formatDownloadFileSize(
                                  iconFile.size,
                                )}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={
                              saving
                            }
                            onClick={
                              removeIconFile
                            }
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-[8px]
                              border
                              border-[#FEE4E2]
                              text-[#D92D20]
                            "
                          >
                            <X
                              size={14}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </div>


              {/* ===========================================
                  RIGHT COLUMN
              =========================================== */}

              <div
                className="
                  space-y-6
                "
              >
                {/* SETTINGS */}

                <section
                  className="
                    rounded-[12px]
                    border
                    border-[#E7EDF4]
                    bg-white
                    p-5
                    shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                  "
                >
                  <h2
                    className="
                      text-[14px]
                      font-semibold
                      text-[#101828]
                    "
                  >
                    Publishing
                  </h2>


                  {/* ORDER */}

                  <div
                    className="
                      mt-5
                    "
                  >
                    <label
                      className="
                        mb-2
                        block
                        text-[12px]
                        font-semibold
                        text-[#344054]
                      "
                    >
                      Display Order
                    </label>

                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={
                        displayOrder
                      }
                      disabled={
                        saving
                      }
                      onChange={(
                        event,
                      ) =>
                        setDisplayOrder(
                          event
                            .target
                            .value,
                        )
                      }
                      className="
                        h-[43px]
                        w-full
                        rounded-[9px]
                        border
                        border-[#DDE4EC]
                        px-3
                        text-[12px]
                        text-[#344054]
                        outline-none
                        focus:border-[#0075FF]
                      "
                    />

                    <p
                      className="
                        mt-1.5
                        text-[10px]
                        leading-4
                        text-[#98A2B3]
                      "
                    >
                      Lower numbers appear
                      first on the public
                      Downloads page.
                    </p>
                  </div>


                  {/* STATUS */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      gap-4
                      rounded-[10px]
                      border
                      border-[#E7EDF4]
                      bg-[#FAFBFC]
                      p-4
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[12px]
                          font-semibold
                          text-[#344054]
                        "
                      >
                        Active
                      </p>

                      <p
                        className="
                          mt-1
                          text-[10px]
                          leading-4
                          text-[#98A2B3]
                        "
                      >
                        Show this resource
                        on the public
                        website.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        saving
                      }
                      onClick={() =>
                        setIsActive(
                          (current) =>
                            !current,
                        )
                      }
                      className={`
                        relative
                        h-[25px]
                        w-[45px]
                        shrink-0
                        rounded-full
                        transition
                        ${
                          isActive
                            ? "bg-[#0075FF]"
                            : "bg-[#D0D5DD]"
                        }
                      `}
                    >
                      <span
                        className={`
                          absolute
                          top-[3px]
                          h-[19px]
                          w-[19px]
                          rounded-full
                          bg-white
                          shadow
                          transition-all
                          ${
                            isActive
                              ? "left-[23px]"
                              : "left-[3px]"
                          }
                        `}
                      />
                    </button>
                  </div>
                </section>


                {/* LIVE PREVIEW */}

                <section
                  className="
                    rounded-[12px]
                    border
                    border-[#E7EDF4]
                    bg-white
                    p-5
                    shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                  "
                >
                  <p
                    className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.06em]
                      text-[#98A2B3]
                    "
                  >
                    Icon Preview
                  </p>


                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        h-16
                        w-16
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-[15px]
                        bg-[#FFF6D8]
                        text-[#D49A00]
                      "
                    >
                      {iconType ===
                        "lucide" ? (
                        <SelectedIcon
                          size={26}
                        />
                      ) : iconPreview ? (
                        <img
                          src={
                            iconPreview
                          }
                          alt="Custom icon"
                          className="
                            h-full
                            w-full
                            object-contain
                            p-2
                          "
                        />
                      ) : (
                        <ImageIcon
                          size={25}
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-[14px]
                          font-semibold
                          text-[#101828]
                        "
                      >
                        {title.trim() ||
                          "Resource Title"}
                      </p>

                      <p
                        className="
                          mt-1
                          line-clamp-2
                          text-[10px]
                          leading-4
                          text-[#98A2B3]
                        "
                      >
                        {description.trim() ||
                          "Your download description will appear here."}
                      </p>
                    </div>
                  </div>
                </section>


                {/* SAVE */}

                <section
                  className="
                    rounded-[12px]
                    border
                    border-[#E7EDF4]
                    bg-white
                    p-5
                    shadow-[0_6px_22px_rgba(15,23,42,0.04)]
                  "
                >
                  {saving &&
                    uploadStep && (
                      <div
                        className="
                          mb-4
                          flex
                          items-center
                          gap-2
                          rounded-[9px]
                          bg-[#F5FAFF]
                          px-3
                          py-2.5
                          text-[11px]
                          font-medium
                          text-[#0075FF]
                        "
                      >
                        <Loader2
                          size={14}
                          className="
                            animate-spin
                          "
                        />

                        {
                          uploadStep
                        }
                      </div>
                    )}


                  <button
                    type="submit"
                    disabled={
                      saving
                    }
                    className="
                      inline-flex
                      h-[44px]
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-[10px]
                      bg-[#0075FF]
                      px-5
                      text-[12px]
                      font-semibold
                      text-white
                      shadow-[0_8px_22px_rgba(0,117,255,0.22)]
                      transition
                      hover:bg-[#0068E5]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={16}
                          className="
                            animate-spin
                          "
                        />

                        Saving...
                      </>
                    ) : (
                      <>
                        <Save
                          size={16}
                        />

                        Create Download
                      </>
                    )}
                  </button>


                  <Link
                    href="/admin/downloads"
                    className="
                      mt-3
                      flex
                      h-[42px]
                      w-full
                      items-center
                      justify-center
                      rounded-[9px]
                      border
                      border-[#DDE4EC]
                      bg-white
                      text-[12px]
                      font-semibold
                      text-[#667085]
                      transition
                      hover:border-[#A7CFFF]
                      hover:text-[#0075FF]
                    "
                  >
                    Cancel
                  </Link>
                </section>
              </div>
            </form>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}