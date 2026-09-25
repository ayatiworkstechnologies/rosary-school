"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  ExternalLink,
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

import AdminAuthGuard from "../../../../../components/admin/AdminAuthGuard";
import AdminSidebar from "../../../../../components/admin/AdminSidebar";
import AdminHeader from "../../../../../components/admin/AdminHeader";

import {
  formatDownloadFileSize,
  getAdminDownload,
  getDownloadAssetUrl,
  type AdminDownload,
  type DownloadIconType,
  updateDownload,
  uploadDownloadFile,
  uploadDownloadIcon,
} from "../../../../../services/adminDownloadService";


/* =========================================================
   AVAILABLE BUILT-IN ICONS
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
   PAGE
========================================================= */

export default function EditDownloadPage() {
  const router =
    useRouter();

  const params =
    useParams<{
      id: string;
    }>();


  const downloadId =
    Number(
      params.id,
    );


  /* =======================================================
     ADMIN SHELL
  ======================================================= */

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  /* =======================================================
     ORIGINAL RECORD
  ======================================================= */

  const [
    download,
    setDownload,
  ] = useState<
    AdminDownload | null
  >(null);


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
    existingIconUrl,
    setExistingIconUrl,
  ] = useState<
    string | null
  >(null);

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
     REPLACEMENT FILES
  ======================================================= */

  const [
    newPdfFile,
    setNewPdfFile,
  ] = useState<
    File | null
  >(null);

  const [
    newIconFile,
    setNewIconFile,
  ] = useState<
    File | null
  >(null);

  const [
    newIconPreview,
    setNewIconPreview,
  ] = useState<
    string | null
  >(null);


  /* =======================================================
     STATE
  ======================================================= */

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

  const [
    saveStep,
    setSaveStep,
  ] = useState("");


  /* =======================================================
     LOAD DOWNLOAD
  ======================================================= */

  const loadDownload =
    useCallback(
      async () => {
        if (
          !Number.isInteger(
            downloadId,
          ) ||
          downloadId < 1
        ) {
          setError(
            "Invalid download ID.",
          );

          setLoading(false);

          return;
        }


        try {
          setLoading(true);

          setError("");


          const item =
            await getAdminDownload(
              downloadId,
            );


          setDownload(
            item,
          );


          setTitle(
            item.title,
          );

          setDescription(
            item.description,
          );

          setIconType(
            item.icon_type,
          );

          setIconKey(
            item.icon_key ||
              "clock",
          );

          setExistingIconUrl(
            item.icon_url,
          );

          setDisplayOrder(
            String(
              item.display_order,
            ),
          );

          setIsActive(
            item.is_active,
          );

        } catch (err) {
          console.error(
            "Download load error:",
            err,
          );


          setError(
            err instanceof Error
              ? err.message
              : "Unable to load download.",
          );

        } finally {
          setLoading(false);
        }
      },
      [downloadId],
    );


  useEffect(() => {
    loadDownload();
  }, [loadDownload]);


  /* =======================================================
     SELECTED BUILT-IN ICON
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


    setNewPdfFile(
      file,
    );
  }


  /* =======================================================
     CUSTOM ICON SELECT
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
      newIconPreview
    ) {
      URL.revokeObjectURL(
        newIconPreview,
      );
    }


    const preview =
      URL.createObjectURL(
        file,
      );


    setNewIconFile(
      file,
    );

    setNewIconPreview(
      preview,
    );
  }


  /* =======================================================
     REMOVE NEW ICON
  ======================================================= */

  function removeNewIcon() {
    if (
      newIconPreview
    ) {
      URL.revokeObjectURL(
        newIconPreview,
      );
    }


    setNewIconFile(
      null,
    );

    setNewIconPreview(
      null,
    );
  }


  /* =======================================================
     ICON TYPE CHANGE
  ======================================================= */

  function changeIconType(
    type: DownloadIconType,
  ) {
    setIconType(
      type,
    );

    setError("");


    if (
      type === "lucide"
    ) {
      removeNewIcon();
    }
  }


  /* =======================================================
     CUSTOM ICON PREVIEW
  ======================================================= */

  const customIconPreview =
    newIconPreview ||
    (
      existingIconUrl
        ? getDownloadAssetUrl(
            existingIconUrl,
          )
        : null
    );


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
      iconType ===
        "lucide" &&
      !iconKey
    ) {
      return "Please select a built-in icon.";
    }


    if (
      iconType ===
        "image" &&
      !newIconFile &&
      !existingIconUrl
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
     UPDATE
  ======================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    if (
      !download
    ) {
      return;
    }


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


    try {
      setSaving(true);

      setError("");


      /* ---------------------------------------------------
         FINAL FILE VALUES

         Start with existing DB values.
      --------------------------------------------------- */

      let finalFileUrl =
        download.file_url;

      let finalFileName =
        download.original_file_name;

      let finalFileSize =
        download.file_size_bytes;


      /* ---------------------------------------------------
         REPLACE PDF ONLY IF NEW PDF SELECTED
      --------------------------------------------------- */

      if (
        newPdfFile
      ) {
        setSaveStep(
          "Uploading new PDF...",
        );


        const pdfResult =
          await uploadDownloadFile(
            newPdfFile,
          );


        finalFileUrl =
          pdfResult.file_url;

        finalFileName =
          pdfResult.original_name;

        finalFileSize =
          pdfResult.size;
      }


      /* ---------------------------------------------------
         ICON
      --------------------------------------------------- */

      let finalIconUrl:
        | string
        | null =
        null;


      if (
        iconType ===
        "image"
      ) {
        if (
          newIconFile
        ) {
          setSaveStep(
            "Uploading new icon...",
          );


          const iconResult =
            await uploadDownloadIcon(
              newIconFile,
            );


          finalIconUrl =
            iconResult.icon_url;

        } else {
          finalIconUrl =
            existingIconUrl;
        }
      }


      /* ---------------------------------------------------
         UPDATE DATABASE
      --------------------------------------------------- */

      setSaveStep(
        "Saving changes...",
      );


      await updateDownload(
        downloadId,
        {
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
              ? finalIconUrl
              : null,

          file_url:
            finalFileUrl,

          original_file_name:
            finalFileName,

          file_size_bytes:
            finalFileSize,

          display_order:
            Number(
              displayOrder,
            ),

          is_active:
            isActive,
        },
      );


      setSaveStep(
        "Changes saved.",
      );


      router.push(
        "/admin/downloads",
      );

      router.refresh();

    } catch (err) {
      console.error(
        "Download update error:",
        err,
      );


      setError(
        err instanceof Error
          ? err.message
          : "Unable to update download.",
      );

    } finally {
      setSaving(false);

      setSaveStep("");
    }
  }


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <AdminAuthGuard>
      <div
        className="
          min-h-screen
          bg-[#F7F9FC]
        "
      >
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
            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (
              <div
                className="
                  flex
                  min-h-[500px]
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    items-center
                    gap-3
                  "
                >
                  <Loader2
                    size={28}
                    className="
                      animate-spin
                      text-[#0075FF]
                    "
                  />

                  <p
                    className="
                      text-[12px]
                      font-medium
                      text-[#667085]
                    "
                  >
                    Loading download...
                  </p>
                </div>
              </div>
            ) : !download ? (
              <div
                className="
                  rounded-[12px]
                  border
                  border-[#E7EDF4]
                  bg-white
                  p-8
                  text-center
                "
              >
                <FileText
                  size={30}
                  className="
                    mx-auto
                    text-[#98A2B3]
                  "
                />

                <h2
                  className="
                    mt-4
                    text-[16px]
                    font-semibold
                    text-[#101828]
                  "
                >
                  Download not found
                </h2>

                <p
                  className="
                    mt-2
                    text-[12px]
                    text-[#98A2B3]
                  "
                >
                  {error ||
                    "The requested resource could not be found."}
                </p>

                <Link
                  href="/admin/downloads"
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
                    text-white
                  "
                >
                  <ArrowLeft
                    size={14}
                  />

                  Back to Downloads
                </Link>
              </div>
            ) : (
              <>
                {/* =================================================
                    HEADER
                ================================================= */}

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
                        Edit Download
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
                        Update the resource,
                        replace its document
                        or icon, and manage
                        publishing settings.
                      </p>
                    </div>


                    <a
                      href={getDownloadAssetUrl(
                        download.file_url,
                      )}
                      target="_blank"
                      rel="noreferrer"
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
                      "
                    >
                      <ExternalLink
                        size={15}
                      />

                      Current PDF
                    </a>
                  </div>
                </motion.div>


                {/* =================================================
                    ERROR
                ================================================= */}

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


                {/* =================================================
                    FORM
                ================================================= */}

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
                  {/* ===============================================
                      LEFT
                  =============================================== */}

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
                          text-[#98A2B3]
                        "
                      >
                        Update the public
                        title and description.
                      </p>


                      <div
                        className="
                          mt-6
                          space-y-5
                        "
                      >
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
                            maxLength={
                              150
                            }
                            className="
                              h-[44px]
                              w-full
                              rounded-[9px]
                              border
                              border-[#DDE4EC]
                              px-3.5
                              text-[13px]
                              text-[#344054]
                              outline-none
                              focus:border-[#0075FF]
                            "
                          />
                        </div>


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
                              px-3.5
                              py-3
                              text-[13px]
                              leading-6
                              text-[#344054]
                              outline-none
                              focus:border-[#0075FF]
                            "
                          />

                          <p
                            className="
                              mt-1
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


                    {/* =================================================
                        PDF
                    ================================================= */}

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
                          text-[#98A2B3]
                        "
                      >
                        Keep the existing
                        PDF or select a new
                        one to replace it.
                      </p>


                      {/* CURRENT */}

                      {!newPdfFile && (
                        <div
                          className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-[10px]
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
                                {download.original_file_name ||
                                  "Current PDF"}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-[10px]
                                  text-[#98A2B3]
                                "
                              >
                                {formatDownloadFileSize(
                                  download.file_size_bytes,
                                )}
                                {" • "}
                                Current file
                              </p>
                            </div>
                          </div>

                          <a
                            href={getDownloadAssetUrl(
                              download.file_url,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-[8px]
                              border
                              border-[#DDE4EC]
                              bg-white
                              text-[#667085]
                              hover:text-[#0075FF]
                            "
                          >
                            <ExternalLink
                              size={14}
                            />
                          </a>
                        </div>
                      )}


                      {/* NEW PDF */}

                      {newPdfFile && (
                        <div
                          className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-[10px]
                            border
                            border-[#B2DDFF]
                            bg-[#F5FAFF]
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
                                  newPdfFile.name
                                }
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-[10px]
                                  text-[#0075FF]
                                "
                              >
                                {formatDownloadFileSize(
                                  newPdfFile.size,
                                )}
                                {" • "}
                                New PDF
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={
                              saving
                            }
                            onClick={() =>
                              setNewPdfFile(
                                null,
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
                              bg-white
                              text-[#D92D20]
                            "
                          >
                            <X
                              size={14}
                            />
                          </button>
                        </div>
                      )}


                      <label
                        className="
                          mt-4
                          flex
                          h-[42px]
                          cursor-pointer
                          items-center
                          justify-center
                          gap-2
                          rounded-[9px]
                          border
                          border-dashed
                          border-[#B8C6D6]
                          text-[11px]
                          font-semibold
                          text-[#667085]
                          transition
                          hover:border-[#0075FF]
                          hover:text-[#0075FF]
                        "
                      >
                        <Upload
                          size={15}
                        />

                        {newPdfFile
                          ? "Choose Different PDF"
                          : "Replace PDF"}

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

                      <p
                        className="
                          mt-2
                          text-[10px]
                          text-[#98A2B3]
                        "
                      >
                        PDF only · Maximum
                        50 MB
                      </p>
                    </section>


                    {/* =================================================
                        ICON
                    ================================================= */}

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
                          text-[#98A2B3]
                        "
                      >
                        Switch between a
                        built-in icon and a
                        custom uploaded
                        image.
                      </p>


                      {/* TYPE */}

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


                      {/* BUILT-IN */}

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
                                item.key ===
                                iconKey;

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
                          {/* IMAGE PREVIEW */}

                          {customIconPreview && (
                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                rounded-[10px]
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
                                <img
                                  src={
                                    customIconPreview
                                  }
                                  alt="Custom icon"
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

                                <div>
                                  <p
                                    className="
                                      text-[12px]
                                      font-semibold
                                      text-[#344054]
                                    "
                                  >
                                    {newIconFile
                                      ? newIconFile.name
                                      : "Current custom icon"}
                                  </p>

                                  <p
                                    className="
                                      mt-1
                                      text-[10px]
                                      text-[#98A2B3]
                                    "
                                  >
                                    {newIconFile
                                      ? `${formatDownloadFileSize(
                                          newIconFile.size,
                                        )} • New icon`
                                      : "Existing uploaded icon"}
                                  </p>
                                </div>
                              </div>

                              {newIconFile && (
                                <button
                                  type="button"
                                  disabled={
                                    saving
                                  }
                                  onClick={
                                    removeNewIcon
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
                                    bg-white
                                    text-[#D92D20]
                                  "
                                >
                                  <X
                                    size={14}
                                  />
                                </button>
                              )}
                            </div>
                          )}


                          {!customIconPreview && (
                            <div
                              className="
                                flex
                                min-h-[130px]
                                flex-col
                                items-center
                                justify-center
                                rounded-[10px]
                                border
                                border-dashed
                                border-[#C9D5E3]
                                bg-[#FAFCFF]
                              "
                            >
                              <ImageIcon
                                size={24}
                                className="
                                  text-[#98A2B3]
                                "
                              />

                              <p
                                className="
                                  mt-2
                                  text-[11px]
                                  font-medium
                                  text-[#667085]
                                "
                              >
                                No custom icon
                              </p>
                            </div>
                          )}


                          <label
                            className="
                              mt-4
                              flex
                              h-[42px]
                              cursor-pointer
                              items-center
                              justify-center
                              gap-2
                              rounded-[9px]
                              border
                              border-dashed
                              border-[#B8C6D6]
                              text-[11px]
                              font-semibold
                              text-[#667085]
                              hover:border-[#0075FF]
                              hover:text-[#0075FF]
                            "
                          >
                            <Upload
                              size={15}
                            />

                            {customIconPreview
                              ? "Replace Custom Icon"
                              : "Upload Custom Icon"}

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

                          <p
                            className="
                              mt-2
                              text-[10px]
                              text-[#98A2B3]
                            "
                          >
                            JPG, JPEG, PNG
                            or WEBP · Maximum
                            5 MB
                          </p>
                        </div>
                      )}
                    </section>
                  </div>


                  {/* ===============================================
                      RIGHT
                  =============================================== */}

                  <div
                    className="
                      space-y-6
                    "
                  >
                    {/* PUBLISHING */}

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
                          Lower numbers
                          appear first.
                        </p>
                      </div>


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
                            Display this
                            resource publicly.
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


                    {/* PREVIEW */}

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
                        Preview
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
                          ) : customIconPreview ? (
                            <img
                              src={
                                customIconPreview
                              }
                              alt="Preview"
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
                              "Resource description"}
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
                        saveStep && (
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
                              saveStep
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

                            Save Changes
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
                          hover:border-[#A7CFFF]
                          hover:text-[#0075FF]
                        "
                      >
                        Cancel
                      </Link>
                    </section>
                  </div>
                </form>
              </>
            )}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}