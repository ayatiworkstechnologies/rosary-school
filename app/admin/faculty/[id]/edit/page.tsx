"use client";

import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";

import AdminAuthGuard from "../../../../../components/admin/AdminAuthGuard";
import AdminHeader from "../../../../../components/admin/AdminHeader";
import AdminSidebar from "../../../../../components/admin/AdminSidebar";

import {
  FacultyCategory,
  FacultyMember,
  FacultyMemberUpdatePayload,
  getAdminFacultyCategories,
  getAdminFacultyMember,
  getFacultyImageUrl,
  updateAdminFacultyMember,
  uploadAdminFacultyImage,
  validateFacultyImage,
} from "../../../../../services/adminFacultyService";


// =========================================================
// TYPES
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

export default function EditFacultyPage() {
  const router =
    useRouter();

  const params =
    useParams<{
      id: string;
    }>();


  const memberId =
    Number(
      params.id
    );


  // =======================================================
  // ADMIN LAYOUT
  // =======================================================

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);


  // =======================================================
  // DATA
  // =======================================================

  const [
    member,
    setMember,
  ] = useState<
    FacultyMember | null
  >(null);


  const [
    categories,
    setCategories,
  ] = useState<
    FacultyCategory[]
  >([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


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
  // IMAGE STATE
  // =======================================================

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<
    File | null
  >(null);


  const [
    selectedPreviewUrl,
    setSelectedPreviewUrl,
  ] = useState<
    string | null
  >(null);


  const [
    removeExistingImage,
    setRemoveExistingImage,
  ] = useState(false);


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
  // LOAD MEMBER + CATEGORIES
  // =======================================================

  useEffect(() => {
    const loadData =
      async () => {
        if (
          !Number.isInteger(
            memberId
          ) ||
          memberId < 1
        ) {
          setMessage({
            type:
              "error",

            text:
              "Invalid Faculty member ID.",
          });

          setLoading(
            false
          );

          return;
        }


        try {
          setLoading(
            true
          );


          const [
            memberData,
            categoryData,
          ] =
            await Promise.all([
              getAdminFacultyMember(
                memberId
              ),

              getAdminFacultyCategories(),
            ]);


          setMember(
            memberData
          );


          setCategories(
            categoryData.items
          );


          // -----------------------------------------------
          // POPULATE FORM
          // -----------------------------------------------

          setName(
            memberData.name
          );

          setDesignation(
            memberData.designation
          );

          setSubject(
            memberData.subject
          );

          setExperienceYears(
            memberData.experience_years
          );

          setCategoryId(
            String(
              memberData.category_id
            )
          );

          setDisplayOrder(
            memberData.display_order
          );

          setIsActive(
            memberData.is_active
          );
        } catch (error) {
          setMessage({
            type:
              "error",

            text:
              error instanceof
              Error
                ? error.message
                : "Unable to load Faculty member.",
          });
        } finally {
          setLoading(
            false
          );
        }
      };


    loadData();
  }, [
    memberId,
  ]);


  // =======================================================
  // OBJECT URL CLEANUP
  // =======================================================

  useEffect(() => {
    return () => {
      if (
        selectedPreviewUrl
      ) {
        URL.revokeObjectURL(
          selectedPreviewUrl
        );
      }
    };
  }, [
    selectedPreviewUrl,
  ]);


  // =======================================================
  // EXISTING IMAGE URL
  // =======================================================

  const existingImageUrl =
    member?.image_url
      ? getFacultyImageUrl(
          member.image_url
        )
      : null;


  // =======================================================
  // CURRENT PREVIEW
  // =======================================================

  const currentPreview =
    selectedPreviewUrl
      ? selectedPreviewUrl
      : removeExistingImage
        ? null
        : existingImageUrl;


  // =======================================================
  // SELECT NEW IMAGE
  // =======================================================

  const handleImageChange =
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target
          .files?.[0];


      if (!file) {
        return;
      }


      try {
        validateFacultyImage(
          file
        );


        if (
          selectedPreviewUrl
        ) {
          URL.revokeObjectURL(
            selectedPreviewUrl
          );
        }


        const preview =
          URL.createObjectURL(
            file
          );


        setSelectedImage(
          file
        );

        setSelectedPreviewUrl(
          preview
        );

        setRemoveExistingImage(
          false
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

  const handleRemoveImage =
    () => {
      if (
        selectedPreviewUrl
      ) {
        URL.revokeObjectURL(
          selectedPreviewUrl
        );
      }


      setSelectedPreviewUrl(
        null
      );

      setSelectedImage(
        null
      );

      setRemoveExistingImage(
        true
      );
    };


  // =======================================================
  // VALIDATION
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
  // SAVE
  // =======================================================

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();


      if (
        !member
      ) {
        return;
      }


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


        const payload:
          FacultyMemberUpdatePayload =
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

            display_order:
              displayOrder,

            is_active:
              isActive,
          };


        // -----------------------------------------------
        // NEW IMAGE
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


          payload.image_url =
            uploaded.image_url;


          setUploading(
            false
          );
        }

        // -----------------------------------------------
        // REMOVE EXISTING IMAGE
        // -----------------------------------------------

        else if (
          removeExistingImage
        ) {
          payload.image_url =
            null;
        }


        // -----------------------------------------------
        // UPDATE
        // -----------------------------------------------

        const updated =
          await updateAdminFacultyMember(
            memberId,
            payload
          );


        setMember(
          updated
        );


        setSelectedImage(
          null
        );

        if (
          selectedPreviewUrl
        ) {
          URL.revokeObjectURL(
            selectedPreviewUrl
          );
        }


        setSelectedPreviewUrl(
          null
        );

        setRemoveExistingImage(
          false
        );


        setMessage({
          type:
            "success",

          text:
            "Faculty member updated successfully.",
        });


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
              : "Unable to update Faculty member.",
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
  // PAGE
  // =======================================================

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
                Edit Faculty
              </h1>


              <p className="mt-2 max-w-[650px] font-secondary text-[12px] leading-[1.6] text-[#7B8797] sm:text-[13px]">
                Update Faculty
                information, profile
                image, category,
                display order and
                visibility.
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
                INITIAL LOADING
            =========================================== */}

            {loading ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-[12px] border border-[#E4EAF2] bg-white">
                <div className="text-center">
                  <Loader2
                    size={28}
                    className="mx-auto animate-spin text-[#0075FF]"
                  />

                  <p className="mt-3 font-secondary text-[11px] text-[#7B8797]">
                    Loading Faculty...
                  </p>
                </div>
              </div>
            ) : member ? (
              <form
                onSubmit={
                  handleSubmit
                }
              >
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">

                  {/* =====================================
                      LEFT
                  ===================================== */}

                  <div className="space-y-5">

                    {/* BASIC DETAILS */}

                    <section className="rounded-[12px] border border-[#E4EAF2] bg-white p-5 shadow-sm sm:p-6">
                      <div className="mb-5">
                        <h2 className="font-primary text-[15px] font-semibold text-[#111827]">
                          Faculty Details
                        </h2>

                        <p className="mt-1 font-secondary text-[11px] text-[#7B8797]">
                          Update the Faculty
                          member&apos;s
                          information.
                        </p>
                      </div>


                      <div className="grid gap-5 sm:grid-cols-2">

                        <FormField
                          label="Faculty Name"
                          required
                        >
                          <input
                            type="text"
                            value={
                              name
                            }
                            maxLength={
                              150
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
                            className={
                              inputClassName
                            }
                          />
                        </FormField>


                        <FormField
                          label="Designation"
                          required
                        >
                          <input
                            type="text"
                            value={
                              designation
                            }
                            maxLength={
                              180
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
                            className={
                              inputClassName
                            }
                          />
                        </FormField>


                        <FormField
                          label="Subject"
                          required
                        >
                          <input
                            type="text"
                            value={
                              subject
                            }
                            maxLength={
                              120
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
                            className={
                              inputClassName
                            }
                          />
                        </FormField>


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


                        <FormField
                          label="Category"
                          required
                        >
                          <select
                            value={
                              categoryId
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
                            {categories.map(
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
                            )}
                          </select>
                        </FormField>


                        <FormField
                          label="Display Order"
                          required
                          hint="Lower number first"
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
                        Control whether
                        this profile is
                        visible publicly.
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
                            The Faculty
                            member appears
                            publicly only
                            when both this
                            profile and its
                            category are
                            active.
                          </p>
                        </div>
                      </label>
                    </section>
                  </div>


                  {/* =====================================
                      IMAGE
                  ===================================== */}

                  <aside>
                    <section className="rounded-[12px] border border-[#E4EAF2] bg-white p-5 shadow-sm">
                      <h2 className="font-primary text-[15px] font-semibold text-[#111827]">
                        Faculty Photo
                      </h2>

                      <p className="mt-1 font-secondary text-[11px] leading-5 text-[#7B8797]">
                        JPG, PNG or WEBP.
                        Maximum 5 MB.
                      </p>


                      <div className="mt-5 overflow-hidden rounded-[12px] border border-[#E4EAF2] bg-[#F8FAFC]">
                        {currentPreview ? (
                          <div className="relative aspect-[4/5] w-full">
                            <img
                              src={
                                currentPreview
                              }
                              alt={
                                name ||
                                "Faculty"
                              }
                              className="h-full w-full object-cover"
                            />


                            <button
                              type="button"
                              onClick={
                                handleRemoveImage
                              }
                              title="Remove photo"
                              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50"
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
                              No Faculty
                              photo
                            </p>
                          </div>
                        )}
                      </div>


                      {/* IMAGE PICKER */}

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

                        {currentPreview
                          ? "Replace Photo"
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
                            New photo selected
                          </p>
                        </div>
                      )}


                      {removeExistingImage &&
                        !selectedImage && (
                          <div className="mt-3 rounded-[9px] border border-amber-200 bg-amber-50 p-3">
                            <p className="font-secondary text-[10px] leading-5 text-amber-700">
                              Current photo
                              will be removed
                              when you save.
                            </p>
                          </div>
                        )}
                    </section>
                  </aside>
                </div>


                {/* =======================================
                    ACTIONS
                ======================================= */}

                <div className="mt-5 flex flex-col-reverse gap-3 rounded-[12px] border border-[#E4EAF2] bg-white p-4 shadow-sm sm:flex-row sm:justify-end">

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
                    className="h-[42px] rounded-[9px] border border-[#DDE6F0] bg-white px-5 font-secondary text-[11px] font-semibold text-[#475467] transition hover:bg-[#F8FAFC] disabled:opacity-50"
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    disabled={
                      saving ||
                      categories.length ===
                        0
                    }
                    className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] bg-[#0075FF] px-5 font-secondary text-[11px] font-semibold text-white transition hover:bg-[#0068E4] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        {uploading
                          ? "Uploading Photo..."
                          : "Updating Faculty..."}
                      </>
                    ) : (
                      <>
                        <Save
                          size={16}
                        />

                        Update Faculty
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-[12px] border border-[#E4EAF2] bg-white py-16 text-center">
                <XCircle
                  size={28}
                  className="mx-auto text-red-500"
                />

                <p className="mt-3 font-primary text-[14px] font-semibold text-[#111827]">
                  Faculty member
                  unavailable
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/admin/faculty"
                    )
                  }
                  className="mt-5 rounded-[9px] bg-[#0075FF] px-4 py-2.5 font-secondary text-[11px] font-semibold text-white"
                >
                  Return to Faculty
                </button>
              </div>
            )}
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
    ReactNode;
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
`;