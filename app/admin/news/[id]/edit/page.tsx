"use client";

import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
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
  BellRing,
  CalendarDays,
  CheckCircle2,
  FileText,
  ImageIcon,
  LoaderCircle,
  Newspaper,
  Save,
  Star,
  Upload,
  X,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

import {
  getAdminNewsById,
  getNewsImageUrl,
  NewsContentType,
  updateAdminNews,
  uploadNewsImage,
} from "@/services/adminNewsService";


// =========================================================
// PAGE
// =========================================================

export default function EditNewsPage() {
  const router = useRouter();

  const params = useParams();

  const itemId = Number(
    params.id
  );


  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  // =======================================================
  // PAGE STATE
  // =======================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");


  // =======================================================
  // FORM VALUES
  // =======================================================

  const [
    contentType,
    setContentType,
  ] = useState<NewsContentType>(
    "NEWS"
  );

  const [
    label,
    setLabel,
  ] = useState("");

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    shortDescription,
    setShortDescription,
  ] = useState("");

  const [
    content,
    setContent,
  ] = useState("");

  const [
    publishedAt,
    setPublishedAt,
  ] = useState("");

  const [
    isPublished,
    setIsPublished,
  ] = useState(false);

  const [
    isFeatured,
    setIsFeatured,
  ] = useState(false);


  // =======================================================
  // IMAGE STATE
  // =======================================================

  const [
    existingImageUrl,
    setExistingImageUrl,
  ] = useState<string | null>(
    null
  );

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<File | null>(
    null
  );

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string | null>(
    null
  );

  const [
    removeExistingImage,
    setRemoveExistingImage,
  ] = useState(false);


  // =======================================================
  // LOAD EXISTING CONTENT
  // =======================================================

  useEffect(() => {
    if (
      !Number.isInteger(itemId) ||
      itemId <= 0
    ) {
      setError(
        "Invalid News item ID."
      );

      setLoading(false);

      return;
    }


    let mounted = true;


    const loadItem =
      async () => {
        try {
          setLoading(true);

          setError("");


          const item =
            await getAdminNewsById(
              itemId
            );


          if (!mounted) {
            return;
          }


          // -----------------------------------------------
          // FILL FORM
          // -----------------------------------------------

          setContentType(
            item.content_type
          );

          setLabel(
            item.label ?? ""
          );

          setTitle(
            item.title
          );

          setShortDescription(
            item.short_description
          );

          setContent(
            item.content
          );

          setPublishedAt(
            toDateTimeLocal(
              item.published_at
            )
          );

          setIsPublished(
            item.is_published
          );

          setIsFeatured(
            item.is_featured
          );

          setExistingImageUrl(
            item.image_url
          );

        } catch (error) {
          console.error(
            "Unable to load News item:",
            error
          );


          if (mounted) {
            setError(
              error instanceof Error
                ? error.message
                : "Unable to load this content."
            );
          }

        } finally {
          if (mounted) {
            setLoading(
              false
            );
          }
        }
      };


    loadItem();


    return () => {
      mounted = false;
    };

  }, [itemId]);


  // =======================================================
  // CLEAN LOCAL PREVIEW URL
  // =======================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [previewUrl]);


  // =======================================================
  // IMAGE CHANGE
  // =======================================================

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
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
        file.type
      )
    ) {
      setError(
        "Please select a JPG, PNG or WEBP image."
      );

      event.target.value = "";

      return;
    }


    const maxSize =
      5 * 1024 * 1024;


    if (
      file.size > maxSize
    ) {
      setError(
        "Image must be smaller than 5 MB."
      );

      event.target.value = "";

      return;
    }


    setError("");


    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }


    const localPreview =
      URL.createObjectURL(
        file
      );


    setSelectedImage(
      file
    );

    setPreviewUrl(
      localPreview
    );

    setRemoveExistingImage(
      false
    );
  };


  // =======================================================
  // REMOVE IMAGE
  // =======================================================

  const handleRemoveImage =
    () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }


      setSelectedImage(
        null
      );

      setPreviewUrl(
        null
      );

      setRemoveExistingImage(
        true
      );
    };


  // =======================================================
  // VALIDATION
  // =======================================================

  const validateForm = () => {
    if (
      title.trim().length < 3
    ) {
      setError(
        "Please enter a title with at least 3 characters."
      );

      return false;
    }


    if (
      shortDescription
        .trim()
        .length < 3
    ) {
      setError(
        "Please enter a short description."
      );

      return false;
    }


    if (
      content.trim().length < 3
    ) {
      setError(
        "Please enter the full content."
      );

      return false;
    }


    return true;
  };


  // =======================================================
  // UPDATE
  // =======================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();


    setError("");
    setSuccess("");


    if (!validateForm()) {
      return;
    }


    try {
      setSubmitting(
        true
      );


      // ===================================================
      // STEP 1:
      // DETERMINE FINAL IMAGE URL
      // ===================================================

      let finalImageUrl:
        | string
        | null =
        existingImageUrl;


      // Admin selected a NEW image.
      if (selectedImage) {
        const uploadResponse =
          await uploadNewsImage(
            selectedImage
          );


        finalImageUrl =
          uploadResponse.image_url;
      }


      // Admin removed image.
      if (
        removeExistingImage &&
        !selectedImage
      ) {
        finalImageUrl =
          null;
      }


      // ===================================================
      // STEP 2:
      // UPDATE DATABASE RECORD
      // ===================================================

      await updateAdminNews(
        itemId,
        {
          content_type:
            contentType,

          label:
            label.trim() ||
            null,

          title:
            title.trim(),

          short_description:
            shortDescription.trim(),

          content:
            content.trim(),

          image_url:
            finalImageUrl,

          published_at:
            publishedAt ||
            null,

          is_published:
            isPublished,

          is_featured:
            isFeatured,
        }
      );


      setSuccess(
        "Content updated successfully."
      );


      setTimeout(() => {
        router.push(
          "/admin/news"
        );

        router.refresh();
      }, 700);

    } catch (error) {
      console.error(
        "Update News failed:",
        error
      );


      setError(
        error instanceof Error
          ? error.message
          : "Unable to update content."
      );

    } finally {
      setSubmitting(
        false
      );
    }
  };


  // =======================================================
  // IMAGE TO DISPLAY
  // =======================================================

  const currentImage =
    previewUrl
      ? previewUrl
      : removeExistingImage
        ? null
        : getNewsImageUrl(
            existingImageUrl
          );


  // =======================================================
  // LOADING PAGE
  // =======================================================

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="min-h-screen bg-[#F7F9FC]">

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


          <div className="min-h-screen lg:pl-[250px]">

            <AdminHeader
              onMenuClick={() =>
                setMobileSidebarOpen(
                  true
                )
              }
            />


            <div
              className="
                flex
                min-h-[calc(100vh-76px)]
                items-center
                justify-center
              "
            >
              <div className="text-center">

                <LoaderCircle
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
                    text-[12px]
                    text-[#84909F]
                  "
                >
                  Loading content...
                </p>

              </div>
            </div>

          </div>

        </div>
      </AdminAuthGuard>
    );
  }


  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F7F9FC]">

        {/* =================================================
            SIDEBAR
        ================================================== */}

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
        ================================================== */}

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
              max-w-[1450px]

              px-4
              py-6

              sm:px-6
              sm:py-7

              lg:px-8
              lg:py-8
            "
          >

            {/* ===============================================
                HEADER
            ================================================ */}

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
              }}
            >

              <Link
                href="/admin/news"
                className="
                  inline-flex
                  items-center
                  gap-2

                  font-secondary
                  text-[11px]
                  font-medium
                  text-[#687486]

                  transition-colors

                  hover:text-[#0075FF]
                "
              >
                <ArrowLeft
                  size={14}
                />

                Back to News
              </Link>


              <p
                className="
                  mt-5

                  font-secondary
                  text-[10px]
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
                Edit News or Announcement
              </h1>


              <p
                className="
                  mt-2

                  font-secondary
                  text-[12px]
                  leading-[1.7]
                  text-[#7B8797]
                "
              >
                Update existing school content
                and publishing settings.
              </p>

            </motion.div>


            {/* ===============================================
                ERROR
            ================================================ */}

            {error && (
              <div
                className="
                  mt-6

                  rounded-[12px]

                  border
                  border-[#FFD1D1]

                  bg-[#FFF5F5]

                  px-4
                  py-3

                  font-secondary
                  text-[12px]
                  text-[#D14343]
                "
              >
                {error}
              </div>
            )}


            {/* ===============================================
                SUCCESS
            ================================================ */}

            {success && (
              <div
                className="
                  mt-6

                  flex
                  items-center
                  gap-2

                  rounded-[12px]

                  border
                  border-[#CDEEDB]

                  bg-[#F1FBF5]

                  px-4
                  py-3

                  font-secondary
                  text-[12px]
                  text-[#23834D]
                "
              >
                <CheckCircle2
                  size={16}
                />

                {success}
              </div>
            )}


            {/* ===============================================
                FORM
            ================================================ */}

            <form
              onSubmit={
                handleSubmit
              }
              className="
                mt-6

                grid
                grid-cols-1
                gap-6

                xl:grid-cols-[1fr_360px]
              "
            >

              {/* =============================================
                  LEFT SIDE
              ============================================== */}

              <div className="space-y-5">

                {/* TYPE */}

                <FormSection
                  title="Content Type"
                  description="Choose whether this item is News or an Announcement."
                  icon={
                    Newspaper
                  }
                >

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-3

                      sm:grid-cols-2
                    "
                  >

                    <TypeOption
                      active={
                        contentType ===
                        "NEWS"
                      }
                      icon={
                        Newspaper
                      }
                      title="News"
                      description="School updates, achievements and stories."
                      onClick={() =>
                        setContentType(
                          "NEWS"
                        )
                      }
                    />


                    <TypeOption
                      active={
                        contentType ===
                        "ANNOUNCEMENT"
                      }
                      icon={
                        BellRing
                      }
                      title="Announcement"
                      description="Important information for parents and students."
                      onClick={() =>
                        setContentType(
                          "ANNOUNCEMENT"
                        )
                      }
                    />

                  </div>

                </FormSection>


                {/* DETAILS */}

                <FormSection
                  title="Content Details"
                  description="Edit the information displayed on the school website."
                  icon={
                    FileText
                  }
                >

                  <div className="space-y-4">

                    <FormField
                      label="Label"
                      optional
                    >
                      <input
                        type="text"
                        maxLength={
                          100
                        }
                        value={
                          label
                        }
                        onChange={(
                          event
                        ) =>
                          setLabel(
                            event.target
                              .value
                          )
                        }
                        placeholder="Example: School Updates, Sports"
                        className={
                          inputClassName
                        }
                      />
                    </FormField>


                    <FormField
                      label="Title"
                      required
                    >
                      <input
                        type="text"
                        maxLength={
                          255
                        }
                        value={
                          title
                        }
                        onChange={(
                          event
                        ) =>
                          setTitle(
                            event.target
                              .value
                          )
                        }
                        className={
                          inputClassName
                        }
                      />

                      <CharacterCount
                        current={
                          title.length
                        }
                        max={
                          255
                        }
                      />
                    </FormField>


                    <FormField
                      label="Short Description"
                      required
                    >
                      <textarea
                        maxLength={
                          500
                        }
                        rows={4}
                        value={
                          shortDescription
                        }
                        onChange={(
                          event
                        ) =>
                          setShortDescription(
                            event.target
                              .value
                          )
                        }
                        className={`
                          ${inputClassName}
                          min-h-[105px]
                          resize-y
                          py-3
                        `}
                      />

                      <CharacterCount
                        current={
                          shortDescription
                            .length
                        }
                        max={
                          500
                        }
                      />
                    </FormField>


                    <FormField
                      label="Full Content"
                      required
                    >
                      <textarea
                        rows={10}
                        value={
                          content
                        }
                        onChange={(
                          event
                        ) =>
                          setContent(
                            event.target
                              .value
                          )
                        }
                        className={`
                          ${inputClassName}
                          min-h-[220px]
                          resize-y
                          py-3
                        `}
                      />
                    </FormField>

                  </div>

                </FormSection>

              </div>


              {/* =============================================
                  RIGHT SIDE
              ============================================== */}

              <div className="space-y-5">

                {/* IMAGE */}

                <FormSection
                  title="Featured Image"
                  description="Keep the current image or upload a replacement."
                  icon={
                    ImageIcon
                  }
                >

                  {currentImage ? (

                    <div>

                      <div
                        className="
                          relative

                          overflow-hidden

                          rounded-[12px]

                          border
                          border-[#E3E9F0]

                          bg-[#F5F7FA]
                        "
                      >

                        <img
                          src={
                            currentImage
                          }
                          alt={
                            title ||
                            "News image"
                          }
                          className="
                            h-[210px]
                            w-full
                            object-cover
                          "
                        />


                        <button
                          type="button"
                          title="Remove image"
                          onClick={
                            handleRemoveImage
                          }
                          className="
                            absolute
                            right-3
                            top-3

                            flex
                            h-[34px]
                            w-[34px]

                            items-center
                            justify-center

                            rounded-full

                            bg-white/95

                            text-[#E5484D]

                            shadow-md
                          "
                        >
                          <X
                            size={15}
                          />
                        </button>

                      </div>


                      <label
                        className="
                          mt-3

                          inline-flex
                          h-[38px]
                          w-full
                          cursor-pointer

                          items-center
                          justify-center
                          gap-2

                          rounded-[9px]

                          border
                          border-[#DDE5EE]

                          bg-white

                          font-secondary
                          text-[10px]
                          font-semibold
                          text-[#596678]

                          transition-all

                          hover:border-[#A7CFFF]
                          hover:text-[#0075FF]
                        "
                      >

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={
                            handleImageChange
                          }
                          className="hidden"
                        />


                        <Upload
                          size={14}
                        />

                        Replace Image

                      </label>

                    </div>

                  ) : (

                    <label
                      className="
                        flex
                        min-h-[210px]
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center

                        rounded-[12px]

                        border
                        border-dashed
                        border-[#CDD9E6]

                        bg-[#FAFBFC]

                        px-4

                        text-center

                        transition-all

                        hover:border-[#8FC4FF]
                        hover:bg-[#F7FBFF]
                      "
                    >

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />


                      <div
                        className="
                          flex
                          h-[48px]
                          w-[48px]

                          items-center
                          justify-center

                          rounded-[12px]

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

                          font-secondary
                          text-[12px]
                          font-semibold
                          text-[#344054]
                        "
                      >
                        Choose image
                      </p>


                      <p
                        className="
                          mt-1

                          font-secondary
                          text-[10px]
                          leading-[1.6]
                          text-[#929CAA]
                        "
                      >
                        JPG, PNG or WEBP
                        <br />
                        Maximum 5 MB
                      </p>

                    </label>

                  )}

                </FormSection>


                {/* PUBLISHING */}

                <FormSection
                  title="Publishing"
                  description="Update the publishing status and date."
                  icon={
                    CalendarDays
                  }
                >

                  <div className="space-y-4">

                    <FormField
                      label="Published Date"
                      optional
                    >
                      <input
                        type="datetime-local"
                        value={
                          publishedAt
                        }
                        onChange={(
                          event
                        ) =>
                          setPublishedAt(
                            event.target
                              .value
                          )
                        }
                        className={
                          inputClassName
                        }
                      />
                    </FormField>


                    <ToggleField
                      checked={
                        isPublished
                      }
                      onChange={
                        setIsPublished
                      }
                      title="Published"
                      description="Show this content on the public website."
                    />


                    <ToggleField
                      checked={
                        isFeatured
                      }
                      onChange={
                        setIsFeatured
                      }
                      title="Featured Content"
                      description="Highlight this content as important."
                      icon={
                        Star
                      }
                    />

                  </div>

                </FormSection>


                {/* SAVE */}

                <div
                  className="
                    rounded-[16px]

                    border
                    border-[#E6ECF2]

                    bg-white

                    p-4

                    shadow-[0_6px_20px_rgba(16,24,40,0.035)]
                  "
                >

                  <button
                    type="submit"
                    disabled={
                      submitting
                    }
                    className="
                      inline-flex
                      h-[46px]
                      w-full

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

                      transition-all

                      hover:bg-[#006BE8]

                      disabled:cursor-not-allowed
                      disabled:opacity-65
                    "
                  >

                    {submitting ? (
                      <>
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />

                        Updating...
                      </>
                    ) : (
                      <>
                        <Save
                          size={16}
                        />

                        Update Content
                      </>
                    )}

                  </button>


                  <Link
                    href="/admin/news"
                    className="
                      mt-2

                      inline-flex
                      h-[40px]
                      w-full

                      items-center
                      justify-center

                      rounded-[9px]

                      border
                      border-[#E1E7EE]

                      bg-white

                      font-secondary
                      text-[11px]
                      font-medium
                      text-[#687486]
                    "
                  >
                    Cancel
                  </Link>

                </div>

              </div>

            </form>

          </main>

        </div>

      </div>
    </AdminAuthGuard>
  );
}


// =========================================================
// FORM SECTION
// =========================================================

function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Newspaper;
  children: ReactNode;
}) {
  return (
    <section
      className="
        rounded-[16px]

        border
        border-[#E6ECF2]

        bg-white

        p-5

        shadow-[0_6px_20px_rgba(16,24,40,0.035)]

        sm:p-6
      "
    >

      <div className="flex items-start gap-3">

        <div
          className="
            flex
            h-[40px]
            w-[40px]
            shrink-0

            items-center
            justify-center

            rounded-[10px]

            bg-[#EEF6FF]

            text-[#0075FF]
          "
        >
          <Icon
            size={18}
            strokeWidth={1.8}
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
            {title}
          </h2>


          <p
            className="
              mt-1

              font-secondary
              text-[10px]
              leading-[1.6]
              text-[#8B95A5]
            "
          >
            {description}
          </p>

        </div>

      </div>


      <div className="mt-5">
        {children}
      </div>

    </section>
  );
}


// =========================================================
// FORM FIELD
// =========================================================

function FormField({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center gap-1">

        <label
          className="
            font-secondary
            text-[11px]
            font-semibold
            text-[#344054]
          "
        >
          {label}
        </label>


        {required && (
          <span className="text-[#E5484D]">
            *
          </span>
        )}


        {optional && (
          <span
            className="
              font-secondary
              text-[9px]
              text-[#A0A8B4]
            "
          >
            (optional)
          </span>
        )}

      </div>


      {children}

    </div>
  );
}


// =========================================================
// TYPE OPTION
// =========================================================

function TypeOption({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: typeof Newspaper;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        items-start
        gap-3

        rounded-[12px]

        border

        p-4

        text-left

        transition-all

        ${
          active
            ? "border-[#8FC4FF] bg-[#F2F8FF]"
            : "border-[#E2E8EF] bg-white hover:border-[#B8D8FF]"
        }
      `}
    >

      <span
        className={`
          flex
          h-[38px]
          w-[38px]
          shrink-0

          items-center
          justify-center

          rounded-[9px]

          ${
            active
              ? "bg-[#0075FF] text-white"
              : "bg-[#F2F5F8] text-[#7A8695]"
          }
        `}
      >
        <Icon
          size={17}
        />
      </span>


      <span>

        <span
          className="
            block

            font-secondary
            text-[12px]
            font-semibold
            text-[#263244]
          "
        >
          {title}
        </span>


        <span
          className="
            mt-1
            block

            font-secondary
            text-[10px]
            leading-[1.5]
            text-[#8994A3]
          "
        >
          {description}
        </span>

      </span>

    </button>
  );
}


// =========================================================
// TOGGLE FIELD
// =========================================================

function ToggleField({
  checked,
  onChange,
  title,
  description,
  icon: Icon,
}: {
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
  title: string;
  description: string;
  icon?: typeof Star;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4

        rounded-[11px]

        border
        border-[#E5EAF0]

        bg-[#FAFBFC]

        p-3
      "
    >

      <div className="flex items-start gap-2">

        {Icon && (
          <Icon
            size={15}
            className="
              mt-[2px]
              shrink-0
              text-[#0075FF]
            "
          />
        )}


        <div>

          <p
            className="
              font-secondary
              text-[11px]
              font-semibold
              text-[#344054]
            "
          >
            {title}
          </p>


          <p
            className="
              mt-[2px]

              font-secondary
              text-[9px]
              leading-[1.5]
              text-[#8D97A4]
            "
          >
            {description}
          </p>

        </div>

      </div>


      <button
        type="button"
        aria-pressed={
          checked
        }
        onClick={() =>
          onChange(
            !checked
          )
        }
        className={`
          relative

          h-[24px]
          w-[43px]
          shrink-0

          rounded-full

          transition-colors

          ${
            checked
              ? "bg-[#0075FF]"
              : "bg-[#CDD5DF]"
          }
        `}
      >

        <span
          className={`
            absolute
            top-[3px]

            h-[18px]
            w-[18px]

            rounded-full

            bg-white

            shadow-sm

            transition-all

            ${
              checked
                ? "left-[22px]"
                : "left-[3px]"
            }
          `}
        />

      </button>

    </div>
  );
}


// =========================================================
// CHARACTER COUNT
// =========================================================

function CharacterCount({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  return (
    <p
      className="
        mt-1
        text-right

        font-secondary
        text-[9px]
        text-[#9AA4B1]
      "
    >
      {current}/{max}
    </p>
  );
}


// =========================================================
// DATE → DATETIME-LOCAL
// =========================================================

function toDateTimeLocal(
  value: string | null
) {
  if (!value) {
    return "";
  }

  /*
   * Backend:
   * 2026-09-02T09:00:00
   *
   * HTML datetime-local:
   * 2026-09-02T09:00
   */

  return value.slice(
    0,
    16
  );
}


// =========================================================
// INPUT STYLE
// =========================================================

const inputClassName = `
  h-[44px]
  w-full

  rounded-[10px]

  border
  border-[#DEE5ED]

  bg-[#FAFBFC]

  px-3

  font-secondary
  text-[12px]
  text-[#263244]

  outline-none

  transition-all

  placeholder:text-[#A0A8B4]

  focus:border-[#82BEFF]
  focus:bg-white
  focus:ring-2
  focus:ring-[#0075FF]/5
`;