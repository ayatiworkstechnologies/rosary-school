"use client";

import Link from "next/link";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Check,
  GripVertical,
  Home,
  ImagePlus,
  Images,
  Loader2,
  RefreshCw,
  Save,
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
  createAdminGalleryImage,
  deleteAdminGalleryAlbum,
  deleteAdminGalleryImage,
  getAdminGalleryAlbumById,
  getAdminGalleryImageUrl,
  updateAdminGalleryAlbum,
  updateAdminGalleryImage,
  uploadAdminGalleryImages,
  validateGalleryFiles,
  type AdminGalleryAlbum,
  type AdminGalleryImage,
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
   HOMEPAGE POSITIONS
========================================================= */

const homepagePositions = [
  {
    value: 1,
    label:
      "Position 1 — Large Left Top",
  },
  {
    value: 2,
    label:
      "Position 2 — Small Left Bottom 1",
  },
  {
    value: 3,
    label:
      "Position 3 — Small Left Bottom 2",
  },
  {
    value: 4,
    label:
      "Position 4 — Small Right Top 1",
  },
  {
    value: 5,
    label:
      "Position 5 — Small Right Top 2",
  },
  {
    value: 6,
    label:
      "Position 6 — Large Right Bottom",
  },
];


/* =========================================================
   IMAGE EDIT DRAFT
========================================================= */

type ImageDraft = {
  altText: string;

  sortOrder: string;

  isHomepage: boolean;

  homepageOrder: string;
};


/* =========================================================
   DEFAULT ALT TEXT
========================================================= */

function createDefaultAltText(
  fileName: string,
  albumTitle: string
) {
  const cleaned =
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


  return (
    `${albumTitle.trim()} - ${cleaned}`
  )
    .trim()
    .slice(
      0,
      255
    );
}


/* =========================================================
   PAGE
========================================================= */

export default function EditGalleryAlbumPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const router =
    useRouter();


  const albumId =
    Number(
      params.id
    );


  /* =========================================================
     ADMIN LAYOUT
  ========================================================= */

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  /* =========================================================
     ALBUM
  ========================================================= */

  const [
    album,
    setAlbum,
  ] = useState<
    AdminGalleryAlbum | null
  >(null);


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
  ] = useState("");


  const [
    isPublished,
    setIsPublished,
  ] = useState(false);


  /* =========================================================
     IMAGE EDIT DRAFTS
  ========================================================= */

  const [
    imageDrafts,
    setImageDrafts,
  ] = useState<
    Record<
      number,
      ImageDraft
    >
  >({});


  /* =========================================================
     PAGE STATES
  ========================================================= */

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    savingAlbum,
    setSavingAlbum,
  ] = useState(false);


  const [
    uploading,
    setUploading,
  ] = useState(false);


  const [
    savingImageId,
    setSavingImageId,
  ] = useState<
    number | null
  >(null);


  const [
    deletingImageId,
    setDeletingImageId,
  ] = useState<
    number | null
  >(null);


  const [
    deletingAlbum,
    setDeletingAlbum,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  /* =========================================================
     CREATE IMAGE DRAFT
  ========================================================= */

  const createDrafts = (
    images:
      AdminGalleryImage[]
  ) => {
    const drafts:
      Record<
        number,
        ImageDraft
      > = {};


    images.forEach(
      (image) => {
        drafts[
          image.id
        ] = {
          altText:
            image.alt_text,

          sortOrder:
            String(
              image.sort_order
            ),

          isHomepage:
            image.is_homepage,

          homepageOrder:
            image.homepage_order
              ? String(
                  image.homepage_order
                )
              : "",
        };
      }
    );


    setImageDrafts(
      drafts
    );
  };


  /* =========================================================
     LOAD ALBUM
  ========================================================= */

  const loadAlbum =
    useCallback(
      async (
        showLoader = true
      ) => {
        if (
          !Number.isInteger(
            albumId
          ) ||
          albumId <= 0
        ) {
          setError(
            "Invalid Gallery album ID."
          );

          setLoading(
            false
          );

          return;
        }


        try {
          if (
            showLoader
          ) {
            setLoading(
              true
            );
          }


          setError("");


          const response =
            await getAdminGalleryAlbumById(
              albumId
            );


          setAlbum(
            response
          );


          setTitle(
            response.title
          );


          setCategory(
            response.category
          );


          setYear(
            String(
              response.year
            )
          );


          setIsPublished(
            response.is_published
          );


          createDrafts(
            response.images
          );
        } catch (err) {
          console.error(
            "Unable to load Gallery album:",
            err
          );


          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Gallery album."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        albumId,
      ]
    );


  useEffect(() => {
    loadAlbum();
  }, [
    loadAlbum,
  ]);


  /* =========================================================
     FLASH MESSAGE
  ========================================================= */

  const showSuccess = (
    message: string
  ) => {
    setSuccess(
      message
    );


    window.setTimeout(
      () => {
        setSuccess("");
      },
      3000
    );
  };


  /* =========================================================
     SAVE ALBUM DETAILS
  ========================================================= */

  const handleSaveAlbum =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();


      if (
        !album
      ) {
        return;
      }


      const parsedYear =
        Number(
          year
        );


      if (
        title.trim().length <
        2
      ) {
        setError(
          "Please enter a valid Album title."
        );

        return;
      }


      if (
        category.trim()
          .length < 2
      ) {
        setError(
          "Please enter a valid category."
        );

        return;
      }


      if (
        !Number.isInteger(
          parsedYear
        ) ||
        parsedYear < 1900 ||
        parsedYear > 2100
      ) {
        setError(
          "Please enter a valid Gallery year."
        );

        return;
      }


      try {
        setSavingAlbum(
          true
        );

        setError("");


        const updated =
          await updateAdminGalleryAlbum(
            album.id,
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


        setAlbum(
          updated
        );


        showSuccess(
          "Album details updated successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update Gallery album."
        );
      } finally {
        setSavingAlbum(
          false
        );
      }
    };


  /* =========================================================
     UPLOAD MORE IMAGES
  ========================================================= */

  const handleUploadImages =
    async (
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


      if (
        !files.length ||
        !album
      ) {
        return;
      }


      const validationError =
        validateGalleryFiles(
          files
        );


      if (
        validationError
      ) {
        setError(
          validationError
        );

        return;
      }


      try {
        setUploading(
          true
        );

        setError("");


        const uploadResponse =
          await uploadAdminGalleryImages(
            files
          );


        const maxSortOrder =
          album.images.reduce(
            (
              maximum,
              image
            ) =>
              Math.max(
                maximum,
                image.sort_order
              ),
            0
          );


        for (
          let index = 0;
          index <
          uploadResponse.items
            .length;
          index++
        ) {
          const uploaded =
            uploadResponse.items[
              index
            ];


          const originalFile =
            files[
              index
            ];


          await createAdminGalleryImage(
            album.id,
            {
              image_url:
                uploaded.image_url,

              alt_text:
                createDefaultAltText(
                  originalFile.name,
                  album.title
                ),

              sort_order:
                maxSortOrder +
                index +
                1,

              is_homepage:
                false,

              homepage_order:
                null,
            }
          );
        }


        await loadAlbum(
          false
        );


        showSuccess(
          `${uploadResponse.items.length} image${
            uploadResponse.items.length ===
            1
              ? ""
              : "s"
          } uploaded successfully.`
        );
      } catch (err) {
        console.error(
          "Unable to upload Gallery images:",
          err
        );


        setError(
          err instanceof Error
            ? err.message
            : "Unable to upload Gallery images."
        );
      } finally {
        setUploading(
          false
        );
      }
    };


  /* =========================================================
     UPDATE DRAFT FIELD
  ========================================================= */

  const updateImageDraft = (
    imageId: number,
    patch:
      Partial<ImageDraft>
  ) => {
    setImageDrafts(
      (
        current
      ) => ({
        ...current,

        [imageId]: {
          ...current[
            imageId
          ],

          ...patch,
        },
      })
    );
  };


  /* =========================================================
     SAVE IMAGE
  ========================================================= */

  const handleSaveImage =
    async (
      image:
        AdminGalleryImage
    ) => {
      const draft =
        imageDrafts[
          image.id
        ];


      if (
        !draft
      ) {
        return;
      }


      const altText =
        draft.altText
          .trim();


      if (
        altText.length <
        2
      ) {
        setError(
          "Image alt text must contain at least 2 characters."
        );

        return;
      }


      const sortOrder =
        Number(
          draft.sortOrder
        );


      if (
        !Number.isInteger(
          sortOrder
        ) ||
        sortOrder < 1
      ) {
        setError(
          "Image sort order must be 1 or greater."
        );

        return;
      }


      let homepageOrder:
        number | null =
        null;


      if (
        draft.isHomepage
      ) {
        homepageOrder =
          Number(
            draft.homepageOrder
          );


        if (
          !Number.isInteger(
            homepageOrder
          ) ||
          homepageOrder < 1 ||
          homepageOrder > 6
        ) {
          setError(
            "Select a homepage position from 1 to 6."
          );

          return;
        }
      }


      try {
        setSavingImageId(
          image.id
        );

        setError("");


        await updateAdminGalleryImage(
          image.id,
          {
            alt_text:
              altText,

            sort_order:
              sortOrder,

            is_homepage:
              draft.isHomepage,

            homepage_order:
              draft.isHomepage
                ? homepageOrder
                : null,
          }
        );


        /*
         * Reload because assigning a homepage
         * position can automatically remove the
         * previous image from the same position.
         */

        await loadAlbum(
          false
        );


        showSuccess(
          "Gallery image updated successfully."
        );
      } catch (err) {
        console.error(
          "Unable to update Gallery image:",
          err
        );


        setError(
          err instanceof Error
            ? err.message
            : "Unable to update Gallery image."
        );
      } finally {
        setSavingImageId(
          null
        );
      }
    };


  /* =========================================================
     DELETE IMAGE
  ========================================================= */

  const handleDeleteImage =
    async (
      image:
        AdminGalleryImage
    ) => {
      const confirmed =
        window.confirm(
          "Delete this Gallery image?\n\nThe physical image file will also be removed."
        );


      if (
        !confirmed
      ) {
        return;
      }


      try {
        setDeletingImageId(
          image.id
        );

        setError("");


        await deleteAdminGalleryImage(
          image.id
        );


        await loadAlbum(
          false
        );


        showSuccess(
          "Gallery image deleted successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete Gallery image."
        );
      } finally {
        setDeletingImageId(
          null
        );
      }
    };


  /* =========================================================
     DELETE ALBUM
  ========================================================= */

  const handleDeleteAlbum =
    async () => {
      if (
        !album
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          `Delete "${album.title}"?\n\nThis will permanently delete the album and all of its Gallery images.`
        );


      if (
        !confirmed
      ) {
        return;
      }


      try {
        setDeletingAlbum(
          true
        );

        setError("");


        await deleteAdminGalleryAlbum(
          album.id
        );


        router.push(
          "/admin/gallery"
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete Gallery album."
        );


        setDeletingAlbum(
          false
        );
      }
    };


  /* =========================================================
     ORDERED IMAGES
  ========================================================= */

  const orderedImages =
    useMemo(() => {
      if (
        !album
      ) {
        return [];
      }


      return [
        ...album.images,
      ].sort(
        (
          first,
          second
        ) =>
          first.sort_order -
          second.sort_order
      );
    }, [
      album,
    ]);


  /* =========================================================
     HOMEPAGE COUNT
  ========================================================= */

  const homepageCount =
    album?.images.filter(
      (image) =>
        image.is_homepage
    ).length || 0;


  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading
  ) {
    return (
      <AdminAuthGuard>
        <div
          className="
            flex

            min-h-screen

            items-center
            justify-center

            bg-[#F7F9FC]
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

                font-secondary

                text-[11px]

                text-[#7B8794]
              "
            >
              Loading Gallery album...
            </p>
          </div>
        </div>
      </AdminAuthGuard>
    );
  }


  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (
    !album
  ) {
    return (
      <AdminAuthGuard>
        <div
          className="
            flex

            min-h-screen

            items-center
            justify-center

            bg-[#F7F9FC]

            p-6
          "
        >
          <div
            className="
              max-w-[430px]

              rounded-[14px]

              border
              border-[#E4E9EF]

              bg-white

              p-7

              text-center
            "
          >
            <X
              size={26}
              className="
                mx-auto
                text-red-500
              "
            />

            <h1
              className="
                mt-4

                font-primary

                text-[20px]
                font-semibold

                text-[#111827]
              "
            >
              Gallery Album Not Found
            </h1>

            <p
              className="
                mt-2

                font-secondary

                text-[11px]

                text-[#8A94A3]
              "
            >
              {error ||
                "The requested Gallery album does not exist."}
            </p>

            <Link
              href="/admin/gallery"
              className="
                mt-5

                inline-flex

                h-[40px]

                items-center
                justify-center

                rounded-[8px]

                bg-[#0075FF]

                px-5

                font-secondary

                text-[10px]
                font-medium

                !text-white
              "
              style={{
                color:
                  "#ffffff",
              }}
            >
              Back to Gallery
            </Link>
          </div>
        </div>
      </AdminAuthGuard>
    );
  }


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
              max-w-[1500px]

              px-4
              py-6

              sm:px-6

              lg:px-8
              lg:py-8
            "
          >
            {/* =================================================
                HEADER
            ================================================= */}

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

                gap-5

                lg:flex-row
                lg:items-end
                lg:justify-between
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
                  Manage Gallery Album
                </h1>


                <p
                  className="
                    mt-2

                    font-secondary

                    text-[12px]

                    text-[#7B8794]
                  "
                >
                  {album.title}
                </p>
              </div>


              <div
                className="
                  flex

                  flex-wrap

                  gap-2
                "
              >
                <StatBadge
                  icon={
                    Images
                  }
                  label={`${album.images.length} Images`}
                />

                <StatBadge
                  icon={
                    Home
                  }
                  label={`${homepageCount} Homepage`}
                />
              </div>
            </motion.div>


            {/* =================================================
                MESSAGES
            ================================================= */}

            {error && (
              <div
                className="
                  mt-6

                  flex

                  items-start

                  gap-2

                  rounded-[10px]

                  border
                  border-red-200

                  bg-red-50

                  px-4
                  py-3

                  font-secondary

                  text-[11px]

                  text-red-700
                "
              >
                <X
                  size={15}
                />

                {error}
              </div>
            )}


            {success && (
              <div
                className="
                  mt-6

                  flex

                  items-center

                  gap-2

                  rounded-[10px]

                  border
                  border-emerald-200

                  bg-emerald-50

                  px-4
                  py-3

                  font-secondary

                  text-[11px]

                  text-emerald-700
                "
              >
                <Check
                  size={15}
                />

                {success}
              </div>
            )}


            {/* =================================================
                ALBUM DETAILS
            ================================================= */}

            <motion.form
              onSubmit={
                handleSaveAlbum
              }
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
                delay: 0.08,
                ease: smoothEase,
              }}
              className="
                mt-7

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

                  flex-col

                  gap-3

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <h2
                    className="
                      font-primary

                      text-[17px]
                      font-semibold

                      text-[#111827]
                    "
                  >
                    Album Details
                  </h2>

                  <p
                    className="
                      mt-1

                      font-secondary

                      text-[9px]

                      text-[#98A2B3]
                    "
                  >
                    Update the Gallery album information.
                  </p>
                </div>


                <button
                  type="submit"
                  disabled={
                    savingAlbum
                  }
                  className="
                    inline-flex

                    h-[39px]

                    items-center
                    justify-center

                    gap-2

                    rounded-[8px]

                    bg-[#0075FF]

                    px-4

                    font-secondary

                    text-[10px]
                    font-medium

                    text-white

                    disabled:opacity-50
                  "
                >
                  {savingAlbum ? (
                    <Loader2
                      size={13}
                      className="
                        animate-spin
                      "
                    />
                  ) : (
                    <Save
                      size={13}
                    />
                  )}

                  Save Album
                </button>
              </div>


              <div
                className="
                  mt-6

                  grid

                  grid-cols-1

                  gap-4

                  md:grid-cols-2

                  xl:grid-cols-4
                "
              >
                <Field>
                  <FieldTitle>
                    Album Title
                  </FieldTitle>

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
                    className={
                      inputClass
                    }
                  />
                </Field>


                <Field>
                  <FieldTitle>
                    Category
                  </FieldTitle>

                  <input
                    type="text"
                    list="gallery-category-list"
                    value={
                      category
                    }
                    onChange={(
                      event
                    ) =>
                      setCategory(
                        event.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  />

                  <datalist id="gallery-category-list">
                    {suggestedCategories.map(
                      (
                        value
                      ) => (
                        <option
                          key={
                            value
                          }
                          value={
                            value
                          }
                        />
                      )
                    )}
                  </datalist>
                </Field>


                <Field>
                  <FieldTitle>
                    Year
                  </FieldTitle>

                  <input
                    type="number"
                    min={1900}
                    max={2100}
                    value={
                      year
                    }
                    onChange={(
                      event
                    ) =>
                      setYear(
                        event.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  />
                </Field>


                <Field>
                  <FieldTitle>
                    Visibility
                  </FieldTitle>

                  <button
                    type="button"
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

                      h-[43px]
                      w-full

                      items-center
                      justify-between

                      rounded-[9px]

                      border

                      px-3

                      ${
                        isPublished
                          ? `
                            border-[#B9DCFB]
                            bg-[#F2F9FF]
                          `
                          : `
                            border-[#DCE3EA]
                            bg-[#FBFCFD]
                          `
                      }
                    `}
                  >
                    <span
                      className="
                        font-secondary

                        text-[10px]
                        font-medium

                        text-[#475467]
                      "
                    >
                      {isPublished
                        ? "Published"
                        : "Draft"}
                    </span>

                    <span
                      className={`
                        relative

                        h-[20px]
                        w-[36px]

                        rounded-full

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

                          h-[14px]
                          w-[14px]

                          rounded-full

                          bg-white

                          transition-all

                          ${
                            isPublished
                              ? "left-[19px]"
                              : "left-[3px]"
                          }
                        `}
                      />
                    </span>
                  </button>
                </Field>
              </div>
            </motion.form>


            {/* =================================================
                HOMEPAGE INFO
            ================================================= */}

            <div
              className="
                mt-6

                rounded-[13px]

                border
                border-[#CFE5FA]

                bg-[#F5FAFF]

                p-4

                sm:p-5
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

                    h-[38px]
                    w-[38px]

                    shrink-0

                    items-center
                    justify-center

                    rounded-[9px]

                    bg-white

                    text-[#0075FF]
                  "
                >
                  <Home
                    size={17}
                  />
                </div>


                <div>
                  <p
                    className="
                      font-primary

                      text-[14px]
                      font-semibold

                      text-[#25364A]
                    "
                  >
                    Homepage — Life at Rosary
                  </p>


                  <p
                    className="
                      mt-1

                      font-secondary

                      text-[9px]

                      leading-[1.6]

                      text-[#718096]
                    "
                  >
                    Select up to six
                    Gallery images and
                    assign positions
                    1–6. If a position is
                    already occupied,
                    selecting another
                    image for that
                    position automatically
                    replaces the previous
                    one.
                  </p>
                </div>
              </div>
            </div>


            {/* =================================================
                IMAGES HEADER
            ================================================= */}

            <div
              className="
                mt-7

                flex

                flex-col

                gap-4

                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h2
                  className="
                    font-primary

                    text-[20px]
                    font-semibold

                    text-[#111827]
                  "
                >
                  Gallery Images
                </h2>

                <p
                  className="
                    mt-1

                    font-secondary

                    text-[10px]

                    text-[#8A94A3]
                  "
                >
                  Manage image order,
                  alt text and homepage
                  placement.
                </p>
              </div>


              {/* UPLOAD */}

              <label
                className={`
                  inline-flex

                  h-[41px]

                  cursor-pointer

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

                  ${
                    uploading
                      ? "pointer-events-none opacity-60"
                      : ""
                  }
                `}
              >
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="
                    hidden
                  "
                  disabled={
                    uploading
                  }
                  onChange={
                    handleUploadImages
                  }
                />

                {uploading ? (
                  <Loader2
                    size={14}
                    className="
                      animate-spin
                    "
                  />
                ) : (
                  <UploadCloud
                    size={14}
                  />
                )}

                {uploading
                  ? "Uploading..."
                  : "Upload Images"}
              </label>
            </div>


            {/* =================================================
                EMPTY IMAGES
            ================================================= */}

            {orderedImages.length ===
            0 ? (
              <div
                className="
                  mt-5

                  flex

                  min-h-[300px]

                  flex-col

                  items-center
                  justify-center

                  rounded-[14px]

                  border
                  border-dashed
                  border-[#D2DCE6]

                  bg-white

                  p-6

                  text-center
                "
              >
                <ImagePlus
                  size={30}
                  className="
                    text-[#0075FF]
                  "
                />

                <p
                  className="
                    mt-4

                    font-primary

                    text-[16px]
                    font-semibold

                    text-[#344054]
                  "
                >
                  No Gallery images
                </p>

                <p
                  className="
                    mt-2

                    font-secondary

                    text-[10px]

                    text-[#98A2B3]
                  "
                >
                  Upload images to make
                  this album visible on
                  the public Gallery.
                </p>
              </div>
            ) : (
              /* =================================================
                  IMAGE GRID
              ================================================= */

              <div
                className="
                  mt-5

                  grid

                  grid-cols-1

                  gap-5

                  md:grid-cols-2

                  2xl:grid-cols-3
                "
              >
                {orderedImages.map(
                  (
                    image,
                    index
                  ) => {
                    const draft =
                      imageDrafts[
                        image.id
                      ];


                    if (
                      !draft
                    ) {
                      return null;
                    }


                    return (
                      <GalleryImageEditor
                        key={
                          image.id
                        }
                        image={
                          image
                        }
                        draft={
                          draft
                        }
                        index={
                          index
                        }
                        saving={
                          savingImageId ===
                          image.id
                        }
                        deleting={
                          deletingImageId ===
                          image.id
                        }
                        onDraftChange={(
                          patch
                        ) =>
                          updateImageDraft(
                            image.id,
                            patch
                          )
                        }
                        onSave={() =>
                          handleSaveImage(
                            image
                          )
                        }
                        onDelete={() =>
                          handleDeleteImage(
                            image
                          )
                        }
                      />
                    );
                  }
                )}
              </div>
            )}


            {/* =================================================
                DANGER ZONE
            ================================================= */}

            <div
              className="
                mt-8

                rounded-[13px]

                border
                border-red-200

                bg-white

                p-5
              "
            >
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
                  <h3
                    className="
                      font-primary

                      text-[15px]
                      font-semibold

                      text-red-600
                    "
                  >
                    Delete Album
                  </h3>

                  <p
                    className="
                      mt-1

                      font-secondary

                      text-[9px]

                      text-[#8A94A3]
                    "
                  >
                    This permanently
                    removes the album,
                    database image
                    records and physical
                    Gallery files.
                  </p>
                </div>


                <button
                  type="button"
                  disabled={
                    deletingAlbum
                  }
                  onClick={
                    handleDeleteAlbum
                  }
                  className="
                    inline-flex

                    h-[39px]

                    items-center
                    justify-center

                    gap-2

                    rounded-[8px]

                    bg-red-500

                    px-4

                    font-secondary

                    text-[10px]
                    font-medium

                    text-white

                    transition-all

                    hover:bg-red-600

                    disabled:opacity-50
                  "
                >
                  {deletingAlbum ? (
                    <Loader2
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

                  Delete Album
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}


/* =========================================================
   IMAGE EDITOR
========================================================= */

function GalleryImageEditor({
  image,
  draft,
  index,
  saving,
  deleting,
  onDraftChange,
  onSave,
  onDelete,
}: {
  image:
    AdminGalleryImage;

  draft:
    ImageDraft;

  index:
    number;

  saving:
    boolean;

  deleting:
    boolean;

  onDraftChange:
    (
      patch:
        Partial<ImageDraft>
    ) => void;

  onSave:
    () => void;

  onDelete:
    () => void;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.55,
        delay:
          index * 0.04,
        ease:
          smoothEase,
      }}
      className="
        overflow-hidden

        rounded-[14px]

        border
        border-[#E1E7ED]

        bg-white

        shadow-[0_7px_24px_rgba(16,24,40,0.035)]
      "
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      <div
        className="
          relative

          aspect-[1.5/1]

          overflow-hidden

          bg-[#EEF2F6]
        "
      >
        <img
          src={
            getAdminGalleryImageUrl(
              image.image_url
            )
          }
          alt={
            image.alt_text
          }
          className="
            h-full
            w-full

            object-cover
            object-center
          "
        />


        <div
          className="
            absolute

            left-3
            top-3

            inline-flex

            items-center

            gap-1.5

            rounded-full

            bg-black/60

            px-2.5
            py-1.5

            font-secondary

            text-[8px]

            text-white

            backdrop-blur
          "
        >
          <GripVertical
            size={10}
          />

          Image {index + 1}
        </div>


        {image.is_homepage &&
          image.homepage_order && (
            <div
              className="
                absolute

                right-3
                top-3

                inline-flex

                items-center

                gap-1.5

                rounded-full

                bg-[#0075FF]

                px-2.5
                py-1.5

                font-secondary

                text-[8px]
                font-medium

                text-white
              "
            >
              <Home
                size={10}
              />

              Position{" "}
              {
                image.homepage_order
              }
            </div>
          )}
      </div>


      {/* =================================================
          EDIT CONTROLS
      ================================================= */}

      <div
        className="
          p-4
        "
      >
        {/* ALT */}

        <Field>
          <FieldTitle>
            Alt Text
          </FieldTitle>

          <input
            type="text"
            maxLength={255}
            value={
              draft.altText
            }
            onChange={(
              event
            ) =>
              onDraftChange({
                altText:
                  event.target.value,
              })
            }
            className={
              inputClass
            }
          />
        </Field>


        {/* SORT */}

        <div
          className="
            mt-4
          "
        >
          <Field>
            <FieldTitle>
              Image Order
            </FieldTitle>

            <input
              type="number"
              min={1}
              value={
                draft.sortOrder
              }
              onChange={(
                event
              ) =>
                onDraftChange({
                  sortOrder:
                    event.target.value,
                })
              }
              className={
                inputClass
              }
            />
          </Field>
        </div>


        {/* HOMEPAGE */}

        <div
          className="
            mt-4

            rounded-[10px]

            border
            border-[#E2E8EF]

            bg-[#FAFCFE]

            p-3
          "
        >
          <button
            type="button"
            onClick={() =>
              onDraftChange({
                isHomepage:
                  !draft.isHomepage,

                homepageOrder:
                  draft.isHomepage
                    ? ""
                    : draft.homepageOrder,
              })
            }
            className="
              flex

              w-full

              items-center
              justify-between

              gap-3
            "
          >
            <div
              className="
                text-left
              "
            >
              <p
                className="
                  font-secondary

                  text-[10px]
                  font-medium

                  text-[#344054]
                "
              >
                Show on Homepage
              </p>

              <p
                className="
                  mt-1

                  font-secondary

                  text-[8px]

                  text-[#98A2B3]
                "
              >
                Life at Rosary
                collage
              </p>
            </div>


            <span
              className={`
                relative

                h-[21px]
                w-[38px]

                shrink-0

                rounded-full

                transition-colors

                ${
                  draft.isHomepage
                    ? "bg-[#0075FF]"
                    : "bg-[#CDD4DC]"
                }
              `}
            >
              <span
                className={`
                  absolute

                  top-[3px]

                  h-[15px]
                  w-[15px]

                  rounded-full

                  bg-white

                  transition-all

                  ${
                    draft.isHomepage
                      ? "left-[20px]"
                      : "left-[3px]"
                  }
                `}
              />
            </span>
          </button>


          {draft.isHomepage && (
            <div
              className="
                mt-3
              "
            >
              <select
                value={
                  draft.homepageOrder
                }
                onChange={(
                  event
                ) =>
                  onDraftChange({
                    homepageOrder:
                      event.target.value,
                  })
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Select homepage position
                </option>

                {homepagePositions.map(
                  (
                    position
                  ) => (
                    <option
                      key={
                        position.value
                      }
                      value={
                        position.value
                      }
                    >
                      {position.label}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
        </div>


        {/* ACTIONS */}

        <div
          className="
            mt-4

            flex

            gap-2

            border-t
            border-[#EEF1F4]

            pt-4
          "
        >
          <button
            type="button"
            disabled={
              saving ||
              deleting
            }
            onClick={
              onSave
            }
            className="
              inline-flex

              h-[37px]

              flex-1

              items-center
              justify-center

              gap-2

              rounded-[8px]

              bg-[#0075FF]

              font-secondary

              text-[9px]
              font-medium

              text-white

              transition-all

              hover:bg-[#006BE8]

              disabled:opacity-50
            "
          >
            {saving ? (
              <Loader2
                size={12}
                className="
                  animate-spin
                "
              />
            ) : (
              <Save
                size={12}
              />
            )}

            Save Image
          </button>


          <button
            type="button"
            disabled={
              saving ||
              deleting
            }
            onClick={
              onDelete
            }
            className="
              flex

              h-[37px]
              w-[39px]

              items-center
              justify-center

              rounded-[8px]

              border
              border-red-100

              bg-red-50

              text-red-500

              transition-all

              hover:bg-red-100

              disabled:opacity-50
            "
          >
            {deleting ? (
              <RefreshCw
                size={12}
                className="
                  animate-spin
                "
              />
            ) : (
              <Trash2
                size={12}
              />
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}


/* =========================================================
   STAT BADGE
========================================================= */

function StatBadge({
  icon: Icon,
  label,
}: {
  icon:
    typeof Images;

  label:
    string;
}) {
  return (
    <div
      className="
        inline-flex

        items-center

        gap-2

        rounded-[9px]

        border
        border-[#DCE6F0]

        bg-white

        px-3
        py-2.5

        font-secondary

        text-[9px]

        text-[#667085]
      "
    >
      <Icon
        size={13}
        className="
          text-[#0075FF]
        "
      />

      {label}
    </div>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label
      className="
        block
      "
    >
      {children}
    </label>
  );
}


/* =========================================================
   FIELD TITLE
========================================================= */

function FieldTitle({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span
      className="
        mb-2

        block

        font-secondary

        text-[9px]
        font-medium

        text-[#667085]
      "
    >
      {children}
    </span>
  );
}


/* =========================================================
   INPUT
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

  text-[10px]

  text-[#344054]

  outline-none

  transition-all

  focus:border-[#0075FF]
  focus:bg-white
  focus:ring-4
  focus:ring-[#0075FF]/[0.05]
`;