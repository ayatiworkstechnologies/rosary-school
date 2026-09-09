"use client";

import Link from "next/link";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Check,
  ImagePlus,
  Images,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  createAdminGalleryAlbum,
  createAdminGalleryImage,
  deleteAdminGalleryAlbum,
  uploadAdminGalleryImages,
  validateGalleryFiles,
} from "@/services/adminGalleryService";


/* =========================================================
   CONFIG
========================================================= */

const smoothEase = [
  0.22,
  1,
  0.36,
  1,
] as const;


const suggestedCategories = [
  "Campus",
  "Faculty",
  "Celebration",
  "Achievements",
  "Academics",
  "Events",
  "Sports",
  "Activities",
];


/* =========================================================
   SELECTED IMAGE TYPE
========================================================= */

type SelectedGalleryFile = {
  id: string;

  file: File;

  previewUrl: string;

  altText: string;
};


/* =========================================================
   CREATE LOCAL ID
========================================================= */

function createLocalId() {
  return (
    `${Date.now()}-` +
    `${Math.random()
      .toString(36)
      .slice(2)}`
  );
}


/* =========================================================
   FILE NAME -> DEFAULT ALT TEXT
========================================================= */

function createDefaultAltText(
  fileName: string,
  albumTitle: string
) {
  const cleanName =
    fileName
      .replace(
        /\.[^/.]+$/,
        ""
      )
      .replace(
        /[-_]+/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();


  if (albumTitle.trim()) {
    return (
      `${albumTitle.trim()} - ${cleanName}`
    ).slice(
      0,
      255
    );
  }


  return (
    cleanName ||
    "Rosary School Gallery"
  ).slice(
    0,
    255
  );
}


/* =========================================================
   COMPONENT
========================================================= */

export default function NewGalleryAlbumPage() {
  const router =
    useRouter();


  /* =========================================================
     ADMIN LAYOUT
  ========================================================= */

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  /* =========================================================
     FORM
  ========================================================= */

  const [
    title,
    setTitle,
  ] = useState("");


  const [
    category,
    setCategory,
  ] = useState("");


  const [
    year,
    setYear,
  ] = useState(
    String(
      new Date()
        .getFullYear()
    )
  );


  const [
    isPublished,
    setIsPublished,
  ] = useState(true);


  /* =========================================================
     IMAGES
  ========================================================= */

  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState<
    SelectedGalleryFile[]
  >([]);


  /* =========================================================
     SUBMIT STATE
  ========================================================= */

  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    progressText,
    setProgressText,
  ] = useState("");


  /* =========================================================
     PREVIEW CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      selectedFiles.forEach(
        (item) => {
          URL.revokeObjectURL(
            item.previewUrl
          );
        }
      );
    };
  }, [
    selectedFiles,
  ]);


  /* =========================================================
     ALBUM INFORMATION VALIDATION
  ========================================================= */

  const parsedYear =
    Number(
      year
    );


  const formValid =
    useMemo(() => {
      return (
        title.trim().length >=
          2 &&
        category.trim().length >=
          2 &&
        Number.isInteger(
          parsedYear
        ) &&
        parsedYear >= 1900 &&
        parsedYear <= 2100 &&
        selectedFiles.length > 0
      );
    }, [
      title,
      category,
      parsedYear,
      selectedFiles.length,
    ]);


  /* =========================================================
     SELECT IMAGES
  ========================================================= */

  const handleFilesSelected = (
    event:
      ChangeEvent<HTMLInputElement>
  ) => {
    const files =
      Array.from(
        event.target.files ||
          []
      );


    event.target.value =
      "";


    if (!files.length) {
      return;
    }


    const combinedFiles = [
      ...selectedFiles.map(
        (item) =>
          item.file
      ),
      ...files,
    ];


    const validationError =
      validateGalleryFiles(
        combinedFiles
      );


    if (validationError) {
      setError(
        validationError
      );

      return;
    }


    setError("");


    const newItems =
      files.map(
        (
          file
        ): SelectedGalleryFile => ({
          id:
            createLocalId(),

          file,

          previewUrl:
            URL.createObjectURL(
              file
            ),

          altText:
            createDefaultAltText(
              file.name,
              title
            ),
        })
      );


    setSelectedFiles(
      (
        current
      ) => [
        ...current,
        ...newItems,
      ]
    );
  };


  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const removeSelectedImage = (
    imageId: string
  ) => {
    setSelectedFiles(
      (
        current
      ) => {
        const target =
          current.find(
            (item) =>
              item.id ===
              imageId
          );


        if (target) {
          URL.revokeObjectURL(
            target.previewUrl
          );
        }


        return current.filter(
          (item) =>
            item.id !==
            imageId
        );
      }
    );
  };


  /* =========================================================
     UPDATE ALT TEXT
  ========================================================= */

  const updateAltText = (
    imageId: string,
    value: string
  ) => {
    setSelectedFiles(
      (
        current
      ) =>
        current.map(
          (item) =>
            item.id ===
            imageId
              ? {
                  ...item,

                  altText:
                    value,
                }
              : item
        )
    );
  };


  /* =========================================================
     CLEAR ALL IMAGES
  ========================================================= */

  const clearImages = () => {
    selectedFiles.forEach(
      (item) => {
        URL.revokeObjectURL(
          item.previewUrl
        );
      }
    );


    setSelectedFiles([]);
  };


  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();


      if (submitting) {
        return;
      }


      setError("");


      /* -----------------------------------------------------
         TITLE
      ----------------------------------------------------- */

      if (
        title.trim().length <
        2
      ) {
        setError(
          "Please enter an Album title."
        );

        return;
      }


      /* -----------------------------------------------------
         CATEGORY
      ----------------------------------------------------- */

      if (
        category.trim().length <
        2
      ) {
        setError(
          "Please enter a Gallery category."
        );

        return;
      }


      /* -----------------------------------------------------
         YEAR
      ----------------------------------------------------- */

      if (
        !Number.isInteger(
          parsedYear
        ) ||
        parsedYear < 1900 ||
        parsedYear > 2100
      ) {
        setError(
          "Please enter a valid year between 1900 and 2100."
        );

        return;
      }


      /* -----------------------------------------------------
         IMAGES
      ----------------------------------------------------- */

      const files =
        selectedFiles.map(
          (item) =>
            item.file
        );


      const fileError =
        validateGalleryFiles(
          files
        );


      if (fileError) {
        setError(
          fileError
        );

        return;
      }


      /* -----------------------------------------------------
         ALT TEXT
      ----------------------------------------------------- */

      const invalidAlt =
        selectedFiles.find(
          (item) =>
            item.altText
              .trim()
              .length < 2
        );


      if (invalidAlt) {
        setError(
          `Please enter valid alt text for "${invalidAlt.file.name}".`
        );

        return;
      }


      let createdAlbumId:
        number | null =
        null;


      try {
        setSubmitting(
          true
        );


        /* =================================================
           1. CREATE ALBUM
        ================================================= */

        setProgressText(
          "Creating Gallery album..."
        );


        const album =
          await createAdminGalleryAlbum(
            {
              title:
                title.trim(),

              category:
                category.trim(),

              year:
                parsedYear,

              is_published:
                isPublished,
            }
          );


        createdAlbumId =
          album.id;


        /* =================================================
           2. UPLOAD PHYSICAL FILES
        ================================================= */

        setProgressText(
          `Uploading ${selectedFiles.length} image${
            selectedFiles.length ===
            1
              ? ""
              : "s"
          }...`
        );


        const uploadResponse =
          await uploadAdminGalleryImages(
            files
          );


        /* =================================================
           3. ATTACH IMAGES TO ALBUM
        ================================================= */

        for (
          let index = 0;
          index <
          uploadResponse.items.length;
          index++
        ) {
          const uploaded =
            uploadResponse.items[
              index
            ];


          const selected =
            selectedFiles[
              index
            ];


          setProgressText(
            `Saving image ${
              index + 1
            } of ${
              uploadResponse.items
                .length
            }...`
          );


          await createAdminGalleryImage(
            album.id,
            {
              image_url:
                uploaded.image_url,

              alt_text:
                selected.altText
                  .trim(),

              sort_order:
                index + 1,

              is_homepage:
                false,

              homepage_order:
                null,
            }
          );
        }


        /* =================================================
           SUCCESS
        ================================================= */

        setProgressText(
          "Gallery album created successfully."
        );


        router.push(
          `/admin/gallery/${album.id}/edit?created=1`
        );
      } catch (err) {
        console.error(
          "Unable to create Gallery album:",
          err
        );


        /*
         * If album creation succeeded but
         * the upload failed immediately,
         * try to remove the empty album.
         *
         * If images were already attached,
         * deleting the album also removes
         * those image DB records/files.
         */

        if (
          createdAlbumId !==
          null
        ) {
          try {
            await deleteAdminGalleryAlbum(
              createdAlbumId
            );
          } catch (
            cleanupError
          ) {
            console.error(
              "Unable to rollback Gallery album:",
              cleanupError
            );
          }
        }


        setProgressText("");


        setError(
          err instanceof Error
            ? err.message
            : "Unable to create Gallery album."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };


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
            CONTENT
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
              max-w-[1400px]

              px-4
              py-6

              sm:px-6
              sm:py-7

              lg:px-8
              lg:py-8
            "
          >
            {/* =============================================
                PAGE HEADER
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
                duration: 0.65,
                ease: smoothEase,
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
                <Link
                  href="/admin/gallery"
                  className="
                    inline-flex

                    items-center

                    gap-2

                    font-secondary

                    text-[11px]
                    font-medium

                    text-[#0075FF]

                    transition-opacity

                    hover:opacity-70
                  "
                >
                  <ArrowLeft
                    size={14}
                  />

                  Back to Gallery
                </Link>


                <h1
                  className="
                    mt-4

                    font-primary

                    text-[26px]
                    font-semibold

                    tracking-[-0.5px]

                    text-[#111827]

                    sm:text-[30px]
                  "
                >
                  Add Gallery Album
                </h1>


                <p
                  className="
                    mt-2

                    max-w-[650px]

                    font-secondary

                    text-[12px]

                    leading-[1.6]

                    text-[#7B8794]

                    sm:text-[13px]
                  "
                >
                  Create a Gallery
                  album and upload
                  multiple photos in a
                  single workflow.
                </p>
              </div>


              <div
                className="
                  inline-flex

                  items-center

                  gap-2

                  rounded-[9px]

                  border
                  border-[#DDE8F5]

                  bg-white

                  px-4
                  py-2.5

                  font-secondary

                  text-[10px]

                  text-[#667085]
                "
              >
                <Images
                  size={14}
                  className="
                    text-[#0075FF]
                  "
                />

                {selectedFiles.length}
                {" "}
                image
                {selectedFiles.length ===
                1
                  ? ""
                  : "s"}
                {" selected"}
              </div>
            </motion.div>


            {/* =============================================
                ERROR
            ============================================= */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  mt-6

                  flex

                  items-start

                  gap-3

                  rounded-[11px]

                  border
                  border-red-200

                  bg-red-50

                  px-4
                  py-3
                "
              >
                <X
                  size={16}
                  className="
                    mt-[1px]

                    shrink-0

                    text-red-500
                  "
                />

                <p
                  className="
                    font-secondary

                    text-[12px]

                    leading-[1.5]

                    text-red-700
                  "
                >
                  {error}
                </p>
              </motion.div>
            )}


            {/* =============================================
                FORM
            ============================================= */}

            <form
              onSubmit={
                handleSubmit
              }
              className="
                mt-7
              "
            >
              <div
                className="
                  grid

                  grid-cols-1

                  gap-6

                  xl:grid-cols-[380px_minmax(0,1fr)]
                "
              >
                {/* =========================================
                    LEFT - ALBUM DETAILS
                ========================================= */}

                <motion.section
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.08,
                    ease: smoothEase,
                  }}
                  className="
                    h-fit

                    rounded-[15px]

                    border
                    border-[#E5EAF0]

                    bg-white

                    p-5

                    shadow-[0_7px_24px_rgba(16,24,40,0.035)]

                    sm:p-6
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

                        h-[40px]
                        w-[40px]

                        items-center
                        justify-center

                        rounded-[9px]

                        bg-[#EDF6FF]

                        text-[#0075FF]
                      "
                    >
                      <Plus
                        size={18}
                      />
                    </div>


                    <div>
                      <h2
                        className="
                          font-primary

                          text-[16px]
                          font-semibold

                          text-[#111827]
                        "
                      >
                        Album Details
                      </h2>

                      <p
                        className="
                          mt-[2px]

                          font-secondary

                          text-[9px]

                          text-[#98A2B3]
                        "
                      >
                        Main Gallery information
                      </p>
                    </div>
                  </div>


                  <div
                    className="
                      mt-6

                      space-y-5
                    "
                  >
                    {/* TITLE */}

                    <FieldLabel
                      label="Album Title"
                      required
                    >
                      <input
                        type="text"
                        value={
                          title
                        }
                        maxLength={
                          255
                        }
                        disabled={
                          submitting
                        }
                        onChange={(
                          event
                        ) =>
                          setTitle(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="e.g. Annual Cultural Celebration"
                        className={
                          inputClass
                        }
                      />
                    </FieldLabel>


                    {/* CATEGORY */}

                    <FieldLabel
                      label="Category"
                      required
                    >
                      <input
                        type="text"
                        list="gallery-categories"
                        value={
                          category
                        }
                        maxLength={
                          120
                        }
                        disabled={
                          submitting
                        }
                        onChange={(
                          event
                        ) =>
                          setCategory(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="e.g. Celebration"
                        className={
                          inputClass
                        }
                      />


                      <datalist id="gallery-categories">
                        {suggestedCategories.map(
                          (
                            item
                          ) => (
                            <option
                              key={
                                item
                              }
                              value={
                                item
                              }
                            />
                          )
                        )}
                      </datalist>
                    </FieldLabel>


                    {/* YEAR */}

                    <FieldLabel
                      label="Year"
                      required
                    >
                      <input
                        type="number"
                        min={1900}
                        max={2100}
                        value={
                          year
                        }
                        disabled={
                          submitting
                        }
                        onChange={(
                          event
                        ) =>
                          setYear(
                            event
                              .target
                              .value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </FieldLabel>


                    {/* PUBLISHED */}

                    <div>
                      <label
                        className="
                          mb-2

                          block

                          font-secondary

                          text-[10px]
                          font-medium

                          text-[#475467]
                        "
                      >
                        Visibility
                      </label>


                      <button
                        type="button"
                        disabled={
                          submitting
                        }
                        onClick={() =>
                          setIsPublished(
                            (
                              current
                            ) =>
                              !current
                          )
                        }
                        className={`
                          flex

                          w-full

                          items-center
                          justify-between

                          rounded-[10px]

                          border

                          px-4
                          py-3.5

                          text-left

                          transition-all

                          ${
                            isPublished
                              ? `
                                border-[#B8DCF9]
                                bg-[#F4FAFF]
                              `
                              : `
                                border-[#E1E6EC]
                                bg-[#FAFBFC]
                              `
                          }
                        `}
                      >
                        <div>
                          <p
                            className="
                              font-secondary

                              text-[11px]
                              font-medium

                              text-[#344054]
                            "
                          >
                            {isPublished
                              ? "Published"
                              : "Draft"}
                          </p>


                          <p
                            className="
                              mt-1

                              font-secondary

                              text-[9px]

                              leading-[1.45]

                              text-[#98A2B3]
                            "
                          >
                            {isPublished
                              ? "Album can appear on the public Gallery page."
                              : "Album remains visible only in Admin."}
                          </p>
                        </div>


                        <span
                          className={`
                            relative

                            h-[22px]
                            w-[40px]

                            shrink-0

                            rounded-full

                            transition-colors

                            ${
                              isPublished
                                ? "bg-[#0075FF]"
                                : "bg-[#CBD2DA]"
                            }
                          `}
                        >
                          <span
                            className={`
                              absolute

                              top-[3px]

                              h-[16px]
                              w-[16px]

                              rounded-full

                              bg-white

                              shadow

                              transition-all

                              ${
                                isPublished
                                  ? "left-[21px]"
                                  : "left-[3px]"
                              }
                            `}
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.section>


                {/* =========================================
                    RIGHT - IMAGES
                ========================================= */}

                <motion.section
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.65,
                    delay: 0.12,
                    ease: smoothEase,
                  }}
                  className="
                    rounded-[15px]

                    border
                    border-[#E5EAF0]

                    bg-white

                    p-5

                    shadow-[0_7px_24px_rgba(16,24,40,0.035)]

                    sm:p-6
                  "
                >
                  {/* HEADER */}

                  <div
                    className="
                      flex

                      flex-col

                      gap-3

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
                        <ImagePlus
                          size={18}
                        />
                      </div>


                      <div>
                        <h2
                          className="
                            font-primary

                            text-[16px]
                            font-semibold

                            text-[#111827]
                          "
                        >
                          Album Images
                        </h2>

                        <p
                          className="
                            mt-[2px]

                            font-secondary

                            text-[9px]

                            text-[#98A2B3]
                          "
                        >
                          JPG, PNG or WEBP · maximum 5 MB each
                        </p>
                      </div>
                    </div>


                    {selectedFiles.length >
                      0 && (
                      <button
                        type="button"
                        disabled={
                          submitting
                        }
                        onClick={
                          clearImages
                        }
                        className="
                          inline-flex

                          h-[34px]

                          items-center
                          justify-center

                          gap-1.5

                          rounded-[8px]

                          border
                          border-red-100

                          bg-red-50

                          px-3

                          font-secondary

                          text-[9px]
                          font-medium

                          text-red-500

                          transition-all

                          hover:bg-red-100
                        "
                      >
                        <Trash2
                          size={12}
                        />

                        Clear All
                      </button>
                    )}
                  </div>


                  {/* =========================================
                      UPLOAD AREA
                  ========================================= */}

                  <label
                    className={`
                      mt-6

                      flex

                      min-h-[185px]

                      cursor-pointer

                      flex-col

                      items-center
                      justify-center

                      rounded-[13px]

                      border-2
                      border-dashed

                      px-6
                      py-8

                      text-center

                      transition-all

                      ${
                        submitting
                          ? `
                            cursor-not-allowed
                            border-[#E2E7EC]
                            bg-[#FAFBFC]
                            opacity-60
                          `
                          : `
                            border-[#C9D9EA]
                            bg-[#FAFCFE]

                            hover:border-[#0075FF]
                            hover:bg-[#F5FAFF]
                          `
                      }
                    `}
                  >
                    <input
                      type="file"
                      accept="
                        image/jpeg,
                        image/png,
                        image/webp
                      "
                      multiple
                      disabled={
                        submitting
                      }
                      onChange={
                        handleFilesSelected
                      }
                      className="
                        hidden
                      "
                    />


                    <div
                      className="
                        flex

                        h-[52px]
                        w-[52px]

                        items-center
                        justify-center

                        rounded-[13px]

                        bg-[#EAF4FF]

                        text-[#0075FF]
                      "
                    >
                      <UploadCloud
                        size={23}
                      />
                    </div>


                    <p
                      className="
                        mt-4

                        font-primary

                        text-[14px]
                        font-semibold

                        text-[#344054]
                      "
                    >
                      Select Gallery Images
                    </p>


                    <p
                      className="
                        mt-2

                        max-w-[390px]

                        font-secondary

                        text-[10px]

                        leading-[1.55]

                        text-[#98A2B3]
                      "
                    >
                      Select up to 20
                      images. You can
                      manage homepage
                      positions and image
                      order after the album
                      has been created.
                    </p>


                    <span
                      className="
                        mt-4

                        inline-flex

                        h-[34px]

                        items-center
                        justify-center

                        rounded-[8px]

                        bg-[#0075FF]

                        px-4

                        font-secondary

                        text-[9px]
                        font-medium

                        text-white
                      "
                    >
                      Choose Images
                    </span>
                  </label>


                  {/* =========================================
                      SELECTED IMAGES
                  ========================================= */}

                  {selectedFiles.length >
                    0 && (
                    <div
                      className="
                        mt-6
                      "
                    >
                      <div
                        className="
                          flex

                          items-center
                          justify-between

                          gap-3
                        "
                      >
                        <p
                          className="
                            font-secondary

                            text-[10px]
                            font-medium

                            text-[#475467]
                          "
                        >
                          Selected Images
                        </p>


                        <span
                          className="
                            font-secondary

                            text-[9px]

                            text-[#98A2B3]
                          "
                        >
                          {
                            selectedFiles.length
                          }
                          {" / 20"}
                        </span>
                      </div>


                      <div
                        className="
                          mt-3

                          grid

                          grid-cols-1

                          gap-3

                          md:grid-cols-2
                        "
                      >
                        {selectedFiles.map(
                          (
                            item,
                            index
                          ) => (
                            <SelectedImageCard
                              key={
                                item.id
                              }
                              item={
                                item
                              }
                              index={
                                index
                              }
                              disabled={
                                submitting
                              }
                              onRemove={() =>
                                removeSelectedImage(
                                  item.id
                                )
                              }
                              onAltTextChange={(
                                value
                              ) =>
                                updateAltText(
                                  item.id,
                                  value
                                )
                              }
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}
                </motion.section>
              </div>


              {/* =============================================
                  FOOTER ACTIONS
              ============================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.18,
                  ease: smoothEase,
                }}
                className="
                  mt-6

                  flex

                  flex-col

                  gap-3

                  rounded-[13px]

                  border
                  border-[#E5EAF0]

                  bg-white

                  px-4
                  py-4

                  shadow-[0_6px_20px_rgba(16,24,40,0.03)]

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  {progressText ? (
                    <p
                      className="
                        inline-flex

                        items-center

                        gap-2

                        font-secondary

                        text-[10px]
                        font-medium

                        text-[#0075FF]
                      "
                    >
                      {submitting ? (
                        <Loader2
                          size={13}
                          className="
                            animate-spin
                          "
                        />
                      ) : (
                        <Check
                          size={13}
                        />
                      )}

                      {progressText}
                    </p>
                  ) : (
                    <p
                      className="
                        font-secondary

                        text-[9px]

                        leading-[1.5]

                        text-[#98A2B3]
                      "
                    >
                      After creation,
                      images can be
                      reordered and
                      selected for
                      homepage positions
                      1–6.
                    </p>
                  )}
                </div>


                <div
                  className="
                    flex

                    items-center

                    gap-2
                  "
                >
                  <Link
                    href="/admin/gallery"
                    className={`
                      inline-flex

                      h-[42px]

                      items-center
                      justify-center

                      rounded-[9px]

                      border
                      border-[#DCE3EA]

                      bg-white

                      px-5

                      font-secondary

                      text-[10px]
                      font-medium

                      text-[#475467]

                      transition-all

                      hover:border-[#B8C7D8]

                      ${
                        submitting
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    `}
                  >
                    Cancel
                  </Link>


                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !formValid
                    }
                    className="
                      inline-flex

                      h-[42px]

                      min-w-[145px]

                      items-center
                      justify-center

                      gap-2

                      rounded-[9px]

                      bg-[#0075FF]

                      px-5

                      font-secondary

                      text-[10px]
                      font-medium

                      text-white

                      shadow-[0_8px_20px_rgba(0,117,255,0.18)]

                      transition-all

                      hover:bg-[#006BE8]
                      hover:shadow-[0_12px_26px_rgba(0,117,255,0.25)]

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      disabled:shadow-none
                    "
                  >
                    {submitting ? (
                      <>
                        <Loader2
                          size={14}
                          className="
                            animate-spin
                          "
                        />

                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus
                          size={14}
                        />

                        Create Album
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </form>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}


/* =========================================================
   FIELD LABEL
========================================================= */

function FieldLabel({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children:
    React.ReactNode;
}) {
  return (
    <label
      className="
        block
      "
    >
      <span
        className="
          mb-2

          block

          font-secondary

          text-[10px]
          font-medium

          text-[#475467]
        "
      >
        {label}

        {required && (
          <span
            className="
              ml-1
              text-red-500
            "
          >
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}


/* =========================================================
   SELECTED IMAGE CARD
========================================================= */

function SelectedImageCard({
  item,
  index,
  disabled,
  onRemove,
  onAltTextChange,
}: {
  item:
    SelectedGalleryFile;

  index: number;

  disabled: boolean;

  onRemove:
    () => void;

  onAltTextChange:
    (
      value: string
    ) => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
        delay:
          index * 0.035,
        ease:
          smoothEase,
      }}
      className="
        overflow-hidden

        rounded-[11px]

        border
        border-[#E1E7ED]

        bg-[#FBFCFD]
      "
    >
      {/* IMAGE */}

      <div
        className="
          relative

          aspect-[1.6/1]

          overflow-hidden

          bg-[#EDF2F6]
        "
      >
        <img
          src={
            item.previewUrl
          }
          alt=""
          className="
            h-full
            w-full

            object-cover
            object-center
          "
        />


        <span
          className="
            absolute

            left-2
            top-2

            flex

            h-[23px]
            min-w-[23px]

            items-center
            justify-center

            rounded-full

            bg-black/65

            px-2

            font-secondary

            text-[8px]
            font-medium

            text-white

            backdrop-blur
          "
        >
          {index + 1}
        </span>


        <button
          type="button"
          disabled={
            disabled
          }
          onClick={
            onRemove
          }
          className="
            absolute

            right-2
            top-2

            flex

            h-[28px]
            w-[28px]

            items-center
            justify-center

            rounded-full

            bg-white/95

            text-red-500

            shadow-[0_4px_14px_rgba(0,0,0,0.14)]

            transition-all

            hover:bg-red-500
            hover:text-white

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Trash2
            size={12}
          />
        </button>
      </div>


      {/* DETAILS */}

      <div
        className="
          p-3
        "
      >
        <p
          className="
            truncate

            font-secondary

            text-[9px]
            font-medium

            text-[#475467]
          "
          title={
            item.file.name
          }
        >
          {item.file.name}
        </p>


        <p
          className="
            mt-1

            font-secondary

            text-[8px]

            text-[#98A2B3]
          "
        >
          {(
            item.file.size /
            1024 /
            1024
          ).toFixed(
            2
          )}
          {" MB"}
        </p>


        <label
          className="
            mt-3
            block
          "
        >
          <span
            className="
              mb-1.5

              block

              font-secondary

              text-[8px]
              font-medium

              text-[#667085]
            "
          >
            Alt Text
          </span>


          <input
            type="text"
            value={
              item.altText
            }
            maxLength={
              255
            }
            disabled={
              disabled
            }
            onChange={(
              event
            ) =>
              onAltTextChange(
                event
                  .target
                  .value
              )
            }
            className="
              h-[36px]
              w-full

              rounded-[7px]

              border
              border-[#DCE3EA]

              bg-white

              px-2.5

              font-secondary

              text-[9px]

              text-[#344054]

              outline-none

              focus:border-[#0075FF]
            "
          />
        </label>
      </div>
    </motion.div>
  );
}


/* =========================================================
   COMMON INPUT CLASS
========================================================= */

const inputClass = `
  h-[43px]
  w-full

  rounded-[9px]

  border
  border-[#DCE3EA]

  bg-[#FBFCFD]

  px-3

  font-secondary

  text-[11px]

  text-[#344054]

  outline-none

  transition-all

  placeholder:text-[#A3ACB8]

  focus:border-[#0075FF]
  focus:bg-white
  focus:ring-4
  focus:ring-[#0075FF]/[0.05]

  disabled:cursor-not-allowed
  disabled:opacity-60
`;