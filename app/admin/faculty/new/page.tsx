"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";

import AdminAuthGuard from "../../../../components/admin/AdminAuthGuard";
import AdminHeader from "../../../../components/admin/AdminHeader";
import AdminSidebar from "../../../../components/admin/AdminSidebar";

import {
  createAdminFacultyMember,
  FacultyCategory,
  getAdminFacultyCategories,
  uploadAdminFacultyImage,
  validateFacultyImage,
} from "../../../../services/adminFacultyService";


// =========================================================
// MESSAGE TYPE
// =========================================================

type MessageState =
  | {
      type:
        | "success"
        | "error";

      text:
        string;
    }
  | null;


// =========================================================
// PAGE
// =========================================================

export default function AddFacultyPage() {
  const router =
    useRouter();


  // =======================================================
  // ADMIN LAYOUT
  // =======================================================

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  // =======================================================
  // FORM
  // =======================================================

  const [
    name,
    setName,
  ] = useState("");


  const [
    designation,
    setDesignation,
  ] = useState("");


  const [
    subject,
    setSubject,
  ] = useState("");


  const [
    experienceYears,
    setExperienceYears,
  ] = useState(0);


  const [
    categoryId,
    setCategoryId,
  ] = useState("");


  const [
    displayOrder,
    setDisplayOrder,
  ] = useState(1);


  const [
    isActive,
    setIsActive,
  ] = useState(true);


  // =======================================================
  // CATEGORIES
  // =======================================================

  const [
    categories,
    setCategories,
  ] = useState<
    FacultyCategory[]
  >([]);


  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);


  // =======================================================
  // IMAGE
  // =======================================================

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<
    File | null
  >(null);


  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<
    string | null
  >(null);


  // =======================================================
  // SAVE
  // =======================================================

  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    uploading,
    setUploading,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState<MessageState>(
    null
  );


  // =======================================================
  // LOAD CATEGORIES
  // =======================================================

  useEffect(() => {
    const loadCategories =
      async () => {
        try {
          setCategoriesLoading(
            true
          );


          const data =
            await getAdminFacultyCategories();


          setCategories(
            data.items
          );


          // Select first category
          // automatically.

          if (
            data.items.length >
            0
          ) {
            setCategoryId(
              String(
                data.items[0]
                  .id
              )
            );
          }
        } catch (error) {
          setMessage({
            type:
              "error",

            text:
              error instanceof
              Error
                ? error.message
                : "Unable to load Faculty categories.",
          });
        } finally {
          setCategoriesLoading(
            false
          );
        }
      };


    loadCategories();
  }, []);


  // =======================================================
  // PREVIEW CLEANUP
  // =======================================================

  useEffect(() => {
    return () => {
      if (
        previewUrl
      ) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [
    previewUrl,
  ]);


  // =======================================================
  // IMAGE SELECT
  // =======================================================

  const handleImageChange =
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      try {
        validateFacultyImage(
          file
        );


        if (
          previewUrl
        ) {
          URL.revokeObjectURL(
            previewUrl
          );
        }


        const nextPreview =
          URL.createObjectURL(
            file
          );


        setSelectedImage(
          file
        );

        setPreviewUrl(
          nextPreview
        );

        setMessage(
          null
        );
      } catch (error) {
        event.target.value =
          "";


        setMessage({
          type:
            "error",

          text:
            error instanceof
            Error
              ? error.message
              : "Invalid Faculty image.",
        });
      }
    };


  // =======================================================
  // REMOVE IMAGE
  // =======================================================

  const removeImage =
    () => {
      if (
        previewUrl
      ) {
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
    };


  // =======================================================
  // VALIDATE FORM
  // =======================================================

  const validateForm =
    (): string | null => {
      if (
        !name.trim()
      ) {
        return (
          "Faculty name is required."
        );
      }


      if (
        name.trim().length <
        2
      ) {
        return (
          "Faculty name must contain at least 2 characters."
        );
      }


      if (
        !designation.trim()
      ) {
        return (
          "Designation is required."
        );
      }


      if (
        !subject.trim()
      ) {
        return (
          "Subject is required."
        );
      }


      if (
        !categoryId
      ) {
        return (
          "Please select a Faculty category."
        );
      }


      if (
        experienceYears <
          0 ||
        experienceYears >
          80
      ) {
        return (
          "Experience must be between 0 and 80 years."
        );
      }


      if (
        displayOrder <
        1
      ) {
        return (
          "Display order must be at least 1."
        );
      }


      return null;
    };


  // =======================================================
  // SUBMIT
  // =======================================================

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();


      const validationError =
        validateForm();


      if (
        validationError
      ) {
        setMessage({
          type:
            "error",

          text:
            validationError,
        });

        return;
      }


      try {
        setSaving(
          true
        );

        setMessage(
          null
        );


        let imageUrl:
          string | null =
          null;


        // -----------------------------------------------
        // UPLOAD IMAGE FIRST
        // -----------------------------------------------

        if (
          selectedImage
        ) {
          setUploading(
            true
          );


          const uploaded =
            await uploadAdminFacultyImage(
              selectedImage
            );


          imageUrl =
            uploaded.image_url;


          setUploading(
            false
          );
        }


        // -----------------------------------------------
        // CREATE FACULTY MEMBER
        // -----------------------------------------------

        await createAdminFacultyMember(
          {
            name:
              name.trim(),

            designation:
              designation.trim(),

            subject:
              subject.trim(),

            experience_years:
              experienceYears,

            category_id:
              Number(
                categoryId
              ),

            image_url:
              imageUrl,

            display_order:
              displayOrder,

            is_active:
              isActive,
          }
        );


        setMessage({
          type:
            "success",

          text:
            "Faculty member created successfully.",
        });


        // Small delay so success
        // message can be seen.

        window.setTimeout(
          () => {
            router.push(
              "/admin/faculty"
            );
          },
          500
        );
      } catch (error) {
        setMessage({
          type:
            "error",

          text:
            error instanceof
            Error
              ? error.message
              : "Unable to create Faculty member.",
        });
      } finally {
        setSaving(
          false
        );

        setUploading(
          false
        );
      }
    };


  // =======================================================
  // UI
  // =======================================================

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F7F9FC]">

        {/* ===============================================
            SIDEBAR
        =============================================== */}

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


        {/* ===============================================
            CONTENT
        =============================================== */}

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
              max-w-[1400px]
              px-4
              py-6
              sm:px-6
              sm:py-7
              lg:px-8
              lg:py-8
            "
          >

            {/* ===========================================
                HEADER
            =========================================== */}

            <div className="mb-6">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/admin/faculty"
                  )
                }
                className="
                  mb-4
                  inline-flex
                  items-center
                  gap-2
                  font-secondary
                  text-[11px]
                  font-medium
                  text-[#667085]
                  transition
                  hover:text-[#0075FF]
                "
              >
                <ArrowLeft
                  size={15}
                />

                Back to Faculty
              </button>


              <p className="font-secondary text-[11px] font-medium uppercase tracking-[0.08em] text-[#0075FF]">
                Faculty Management
              </p>


              <h1 className="mt-2 font-primary text-[26px] font-semibold tracking-[-0.5px] text-[#111827] sm:text-[30px]">
                Add Faculty
              </h1>


              <p className="mt-2 max-w-[650px] font-secondary text-[12px] leading-[1.6] text-[#7B8797] sm:text-[13px]">
                Add a new Faculty
                member and control
                how the profile is
                displayed on the
                school website.
              </p>
            </div>


            {/* ===========================================
                MESSAGE
            =========================================== */}

            {message && (
              <div
                className={`
                  mb-5
                  flex
                  items-start
                  gap-2
                  rounded-[10px]
                  border
                  px-4
                  py-3
                  font-secondary
                  text-[12px]
                  font-medium
                  ${
                    message.type ===
                    "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                `}
              >
                {message.type ===
                "success" ? (
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0"
                  />
                ) : (
                  <XCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                  />
                )}

                {
                  message.text
                }
              </div>
            )}


            {/* ===========================================
                FORM
            =========================================== */}

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">

                {/* =======================================
                    LEFT
                ======================================= */}

                <div className="space-y-5">

                  {/* BASIC DETAILS */}

                  <section className="rounded-[12px] border border-[#E4EAF2] bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5">
                      <h2 className="font-primary text-[15px] font-semibold text-[#111827]">
                        Faculty Details
                      </h2>

                      <p className="mt-1 font-secondary text-[11px] text-[#7B8797]">
                        Enter the Faculty
                        member&apos;s basic
                        information.
                      </p>
                    </div>


                    <div className="grid gap-5 sm:grid-cols-2">

                      {/* NAME */}

                      <FormField
                        label="Faculty Name"
                        required
                      >
                        <input
                          type="text"
                          value={
                            name
                          }
                          onChange={(
                            event
                          ) =>
                            setName(
                              event
                                .target
                                .value
                            )
                          }
                          maxLength={
                            150
                          }
                          placeholder="Example: Maria Joseph"
                          className={
                            inputClassName
                          }
                        />
                      </FormField>


                      {/* DESIGNATION */}

                      <FormField
                        label="Designation"
                        required
                      >
                        <input
                          type="text"
                          value={
                            designation
                          }
                          onChange={(
                            event
                          ) =>
                            setDesignation(
                              event
                                .target
                                .value
                            )
                          }
                          maxLength={
                            180
                          }
                          placeholder="Senior Mathematics Teacher"
                          className={
                            inputClassName
                          }
                        />
                      </FormField>


                      {/* SUBJECT */}

                      <FormField
                        label="Subject"
                        required
                      >
                        <input
                          type="text"
                          value={
                            subject
                          }
                          onChange={(
                            event
                          ) =>
                            setSubject(
                              event
                                .target
                                .value
                            )
                          }
                          maxLength={
                            120
                          }
                          placeholder="Mathematics"
                          className={
                            inputClassName
                          }
                        />
                      </FormField>


                      {/* EXPERIENCE */}

                      <FormField
                        label="Experience"
                        required
                        hint="Years"
                      >
                        <input
                          type="number"
                          min={0}
                          max={80}
                          value={
                            experienceYears
                          }
                          onChange={(
                            event
                          ) =>
                            setExperienceYears(
                              Math.max(
                                0,
                                Math.min(
                                  80,
                                  Number(
                                    event
                                      .target
                                      .value
                                  ) ||
                                    0
                                )
                              )
                            )
                          }
                          className={
                            inputClassName
                          }
                        />
                      </FormField>


                      {/* CATEGORY */}

                      <FormField
                        label="Category"
                        required
                      >
                        <select
                          value={
                            categoryId
                          }
                          disabled={
                            categoriesLoading
                          }
                          onChange={(
                            event
                          ) =>
                            setCategoryId(
                              event
                                .target
                                .value
                            )
                          }
                          className={
                            inputClassName
                          }
                        >
                          {categoriesLoading ? (
                            <option value="">
                              Loading categories...
                            </option>
                          ) : categories.length ===
                            0 ? (
                            <option value="">
                              No categories available
                            </option>
                          ) : (
                            categories.map(
                              (
                                category
                              ) => (
                                <option
                                  key={
                                    category.id
                                  }
                                  value={
                                    category.id
                                  }
                                >
                                  {
                                    category.name
                                  }
                                  {!category.is_active
                                    ? " (Inactive)"
                                    : ""}
                                </option>
                              )
                            )
                          )}
                        </select>
                      </FormField>


                      {/* DISPLAY ORDER */}

                      <FormField
                        label="Display Order"
                        required
                        hint="Lower number appears first"
                      >
                        <input
                          type="number"
                          min={1}
                          value={
                            displayOrder
                          }
                          onChange={(
                            event
                          ) =>
                            setDisplayOrder(
                              Math.max(
                                1,
                                Number(
                                  event
                                    .target
                                    .value
                                ) ||
                                  1
                              )
                            )
                          }
                          className={
                            inputClassName
                          }
                        />
                      </FormField>
                    </div>
                  </section>


                  {/* VISIBILITY */}

                  <section className="rounded-[12px] border border-[#E4EAF2] bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="font-primary text-[15px] font-semibold text-[#111827]">
                      Visibility
                    </h2>

                    <p className="mt-1 font-secondary text-[11px] text-[#7B8797]">
                      Control whether this
                      Faculty member is
                      visible on the public
                      website.
                    </p>


                    <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[10px] border border-[#E4EAF2] bg-[#FAFBFC] p-4">
                      <input
                        type="checkbox"
                        checked={
                          isActive
                        }
                        onChange={(
                          event
                        ) =>
                          setIsActive(
                            event
                              .target
                              .checked
                          )
                        }
                        className="mt-0.5 h-4 w-4 accent-[#0075FF]"
                      />

                      <div>
                        <p className="font-secondary text-[12px] font-semibold text-[#344054]">
                          Active Faculty
                        </p>

                        <p className="mt-1 font-secondary text-[10px] leading-5 text-[#7B8797]">
                          When active, this
                          Faculty profile can
                          appear on the public
                          Faculty page if its
                          category is also
                          active.
                        </p>
                      </div>
                    </label>
                  </section>
                </div>


                {/* =======================================
                    RIGHT - IMAGE
                ======================================= */}

                <aside>
                  <section className="rounded-[12px] border border-[#E4EAF2] bg-white p-5 shadow-sm">
                    <h2 className="font-primary text-[15px] font-semibold text-[#111827]">
                      Faculty Photo
                    </h2>

                    <p className="mt-1 font-secondary text-[11px] leading-5 text-[#7B8797]">
                      JPG, PNG or WEBP.
                      Maximum 5 MB.
                    </p>


                    {/* PREVIEW */}

                    <div className="mt-5 overflow-hidden rounded-[12px] border border-[#E4EAF2] bg-[#F8FAFC]">

                      {previewUrl ? (
                        <div className="relative aspect-[4/5] w-full">
                          <img
                            src={
                              previewUrl
                            }
                            alt="Faculty preview"
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={
                              removeImage
                            }
                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50"
                            title="Remove image"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      ) : (
                        <div className="flex aspect-[4/5] flex-col items-center justify-center px-5 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF6FF] text-[#0075FF]">
                            <UserRound
                              size={25}
                            />
                          </div>

                          <p className="mt-3 font-secondary text-[11px] font-medium text-[#667085]">
                            No photo selected
                          </p>
                        </div>
                      )}
                    </div>


                    {/* UPLOAD */}

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
                        border-[#DDE6F0]
                        bg-white
                        font-secondary
                        text-[11px]
                        font-semibold
                        text-[#344054]
                        transition
                        hover:border-[#0075FF]
                        hover:text-[#0075FF]
                      "
                    >
                      <ImagePlus
                        size={16}
                      />

                      {selectedImage
                        ? "Change Photo"
                        : "Choose Photo"}

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />
                    </label>


                    {selectedImage && (
                      <div className="mt-3 rounded-[9px] bg-[#F8FAFC] p-3">
                        <p className="truncate font-secondary text-[10px] font-medium text-[#344054]">
                          {
                            selectedImage.name
                          }
                        </p>

                        <p className="mt-1 font-secondary text-[9px] text-[#98A2B3]">
                          {(
                            selectedImage.size /
                            1024 /
                            1024
                          ).toFixed(
                            2
                          )}{" "}
                          MB
                        </p>
                      </div>
                    )}
                  </section>
                </aside>
              </div>


              {/* =========================================
                  ACTIONS
              ========================================= */}

              <div className="mt-5 flex flex-col-reverse gap-3 rounded-[12px] border border-[#E4EAF2] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-end">

                <button
                  type="button"
                  disabled={
                    saving
                  }
                  onClick={() =>
                    router.push(
                      "/admin/faculty"
                    )
                  }
                  className="
                    h-[42px]
                    rounded-[9px]
                    border
                    border-[#DDE6F0]
                    bg-white
                    px-5
                    font-secondary
                    text-[11px]
                    font-semibold
                    text-[#475467]
                    transition
                    hover:bg-[#F8FAFC]
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={
                    saving ||
                    categoriesLoading ||
                    categories.length ===
                      0
                  }
                  className="
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
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#0068E4]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      {uploading
                        ? "Uploading Photo..."
                        : "Saving Faculty..."}
                    </>
                  ) : (
                    <>
                      <Save
                        size={16}
                      />

                      Save Faculty
                    </>
                  )}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}


// =========================================================
// FORM FIELD
// =========================================================

function FormField({
  label,
  required = false,
  hint,
  children,
}: {
  label:
    string;

  required?:
    boolean;

  hint?:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label className="font-secondary text-[11px] font-medium text-[#344054]">
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>


        {hint && (
          <span className="font-secondary text-[9px] text-[#98A2B3]">
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}


// =========================================================
// INPUT STYLE
// =========================================================

const inputClassName = `
  h-[42px]
  w-full
  rounded-[9px]
  border
  border-[#DDE6F0]
  bg-white
  px-3.5
  font-secondary
  text-[12px]
  text-[#344054]
  outline-none
  transition
  placeholder:text-[#98A2B3]
  focus:border-[#0075FF]
  focus:ring-2
  focus:ring-[#0075FF]/10
  disabled:cursor-not-allowed
  disabled:bg-[#F8FAFC]
`;