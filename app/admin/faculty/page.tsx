"use client";

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Edit3,
  GraduationCap,
  Layers3,
  Loader2,
  Plus,
  Search,
  Settings2,
  Trash2,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

import AdminAuthGuard from "../../../components/admin/AdminAuthGuard";
import AdminHeader from "../../../components/admin/AdminHeader";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import {
  createAdminFacultyCategory,
  deleteAdminFacultyCategory,
  deleteAdminFacultyMember,
  FacultyCategory,
  FacultyMember,
  getAdminFacultyCategories,
  getAdminFacultyMembers,
  getFacultyImageUrl,
  updateAdminFacultyCategory,
} from "../../../services/adminFacultyService";


// =========================================================
// TYPES
// =========================================================

type StatusFilter =
  | "all"
  | "active"
  | "inactive";


type MessageState =
  | {
      type:
        | "success"
        | "error";
      text: string;
    }
  | null;


// =========================================================
// CONFIG
// =========================================================

const PAGE_LIMIT = 10;


// =========================================================
// PAGE
// =========================================================

export default function AdminFacultyPage() {
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
  // FACULTY
  // =======================================================

  const [
    facultyMembers,
    setFacultyMembers,
  ] = useState<
    FacultyMember[]
  >([]);


  const [
    total,
    setTotal,
  ] = useState(0);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    deletingMemberId,
    setDeletingMemberId,
  ] = useState<
    number | null
  >(null);


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
  // FILTERS
  // =======================================================

  const [
    search,
    setSearch,
  ] = useState("");


  const [
    categoryId,
    setCategoryId,
  ] = useState("all");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>(
    "all"
  );


  const [
    page,
    setPage,
  ] = useState(1);


  // =======================================================
  // MESSAGE
  // =======================================================

  const [
    message,
    setMessage,
  ] = useState<MessageState>(
    null
  );


  // =======================================================
  // CATEGORY MODAL
  // =======================================================

  const [
    categoryModalOpen,
    setCategoryModalOpen,
  ] = useState(false);


  const [
    categoryName,
    setCategoryName,
  ] = useState("");


  const [
    categoryOrder,
    setCategoryOrder,
  ] = useState(1);


  const [
    categoryActive,
    setCategoryActive,
  ] = useState(true);


  const [
    editingCategory,
    setEditingCategory,
  ] = useState<
    FacultyCategory | null
  >(null);


  const [
    categorySaving,
    setCategorySaving,
  ] = useState(false);


  const [
    deletingCategoryId,
    setDeletingCategoryId,
  ] = useState<
    number | null
  >(null);


  // =======================================================
  // LOAD CATEGORIES
  // =======================================================

  const loadCategories =
    useCallback(
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
      },
      []
    );


  // =======================================================
  // LOAD FACULTY
  // =======================================================

  const loadFaculty =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );


          const activeFilter =
            statusFilter ===
            "active"
              ? true
              : statusFilter ===
                  "inactive"
                ? false
                : undefined;


          const data =
            await getAdminFacultyMembers(
              {
                page,

                limit:
                  PAGE_LIMIT,

                search:
                  search.trim() ||
                  undefined,

                category_id:
                  categoryId ===
                  "all"
                    ? undefined
                    : Number(
                        categoryId
                      ),

                is_active:
                  activeFilter,
              }
            );


          setFacultyMembers(
            data.items
          );


          setTotal(
            data.total
          );
        } catch (error) {
          setMessage({
            type:
              "error",

            text:
              error instanceof
              Error
                ? error.message
                : "Unable to load Faculty members.",
          });
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        page,
        search,
        categoryId,
        statusFilter,
      ]
    );


  // =======================================================
  // LOAD CATEGORIES
  // =======================================================

  useEffect(() => {
    loadCategories();
  }, [
    loadCategories,
  ]);


  // =======================================================
  // LOAD FACULTY
  // =======================================================

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          loadFaculty();
        },
        300
      );


    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    loadFaculty,
  ]);


  // =======================================================
  // RESET PAGE ON FILTER CHANGE
  // =======================================================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    categoryId,
    statusFilter,
  ]);


  // =======================================================
  // TOTAL PAGES
  // =======================================================

  const totalPages =
    useMemo(
      () =>
        Math.max(
          1,
          Math.ceil(
            total /
              PAGE_LIMIT
          )
        ),
      [
        total,
      ]
    );


  // =======================================================
  // DELETE FACULTY
  // =======================================================

  const handleDeleteMember =
    async (
      member:
        FacultyMember
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${member.name}"?\n\nThis will permanently delete this Faculty member.`
        );


      if (!confirmed) {
        return;
      }


      try {
        setDeletingMemberId(
          member.id
        );

        setMessage(
          null
        );


        await deleteAdminFacultyMember(
          member.id
        );


        setMessage({
          type:
            "success",

          text:
            `${member.name} deleted successfully.`,
        });


        if (
          facultyMembers.length ===
            1 &&
          page > 1
        ) {
          setPage(
            (
              current
            ) =>
              current - 1
          );
        } else {
          await loadFaculty();
        }
      } catch (error) {
        setMessage({
          type:
            "error",

          text:
            error instanceof
            Error
              ? error.message
              : "Unable to delete Faculty member.",
        });
      } finally {
        setDeletingMemberId(
          null
        );
      }
    };


  // =======================================================
  // RESET CATEGORY
  // =======================================================

  const resetCategoryForm =
    () => {
      setEditingCategory(
        null
      );

      setCategoryName(
        ""
      );

      setCategoryOrder(
        categories.length +
          1
      );

      setCategoryActive(
        true
      );
    };


  // =======================================================
  // OPEN CATEGORY MODAL
  // =======================================================

  const openCategoryModal =
    () => {
      resetCategoryForm();

      setCategoryModalOpen(
        true
      );
    };


  // =======================================================
  // EDIT CATEGORY
  // =======================================================

  const handleEditCategory =
    (
      category:
        FacultyCategory
    ) => {
      setEditingCategory(
        category
      );

      setCategoryName(
        category.name
      );

      setCategoryOrder(
        category.display_order
      );

      setCategoryActive(
        category.is_active
      );
    };


  // =======================================================
  // SAVE CATEGORY
  // =======================================================

  const handleCategorySubmit =
    async (
      event:
        FormEvent
    ) => {
      event.preventDefault();


      const cleanName =
        categoryName.trim();


      if (!cleanName) {
        setMessage({
          type:
            "error",

          text:
            "Category name is required.",
        });

        return;
      }


      try {
        setCategorySaving(
          true
        );

        setMessage(
          null
        );


        if (
          editingCategory
        ) {
          await updateAdminFacultyCategory(
            editingCategory.id,
            {
              name:
                cleanName,

              display_order:
                categoryOrder,

              is_active:
                categoryActive,
            }
          );


          setMessage({
            type:
              "success",

            text:
              "Faculty category updated successfully.",
          });
        } else {
          await createAdminFacultyCategory(
            {
              name:
                cleanName,

              display_order:
                categoryOrder,

              is_active:
                categoryActive,
            }
          );


          setMessage({
            type:
              "success",

            text:
              "Faculty category created successfully.",
          });
        }


        await loadCategories();

        await loadFaculty();

        resetCategoryForm();
      } catch (error) {
        setMessage({
          type:
            "error",

          text:
            error instanceof
            Error
              ? error.message
              : "Unable to save Faculty category.",
        });
      } finally {
        setCategorySaving(
          false
        );
      }
    };


  // =======================================================
  // DELETE CATEGORY
  // =======================================================

  const handleDeleteCategory =
    async (
      category:
        FacultyCategory
    ) => {
      const confirmed =
        window.confirm(
          `Delete category "${category.name}"?\n\nA category cannot be deleted while Faculty members are using it.`
        );


      if (!confirmed) {
        return;
      }


      try {
        setDeletingCategoryId(
          category.id
        );

        setMessage(
          null
        );


        await deleteAdminFacultyCategory(
          category.id
        );


        setMessage({
          type:
            "success",

          text:
            `${category.name} deleted successfully.`,
        });


        if (
          categoryId ===
          String(
            category.id
          )
        ) {
          setCategoryId(
            "all"
          );
        }


        await loadCategories();

        await loadFaculty();
      } catch (error) {
        setMessage({
          type:
            "error",

          text:
            error instanceof
            Error
              ? error.message
              : "Unable to delete Faculty category.",
        });
      } finally {
        setDeletingCategoryId(
          null
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
            MAIN AREA
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
              max-w-[1600px]
              px-4
              py-6
              sm:px-6
              sm:py-7
              lg:px-8
              lg:py-8
            "
          >

            {/* ===========================================
                PAGE HEADER
            =========================================== */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-secondary text-[11px] font-medium uppercase tracking-[0.08em] text-[#0075FF]">
                  Faculty Management
                </p>

                <h1 className="mt-2 font-primary text-[26px] font-semibold leading-[1.15] tracking-[-0.5px] text-[#111827] sm:text-[30px]">
                  Faculty
                </h1>

                <p className="mt-2 max-w-[650px] font-secondary text-[12px] leading-[1.6] text-[#7B8797] sm:text-[13px]">
                  Manage faculty
                  profiles,
                  departments,
                  categories,
                  display order and
                  public visibility.
                </p>
              </div>


              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={
                    openCategoryModal
                  }
                  className="
                    inline-flex
                    h-[42px]
                    items-center
                    justify-center
                    gap-2
                    rounded-[10px]
                    border
                    border-[#DDE6F0]
                    bg-white
                    px-4
                    font-secondary
                    text-[12px]
                    font-medium
                    text-[#344054]
                    shadow-sm
                    transition-all
                    hover:border-[#A7CFFF]
                    hover:text-[#0075FF]
                  "
                >
                  <Settings2
                    size={15}
                  />

                  Manage Categories
                </button>


                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/admin/faculty/new"
                    )
                  }
                  className="
                    inline-flex
                    h-[42px]
                    items-center
                    justify-center
                    gap-2
                    rounded-[10px]
                    bg-[#0075FF]
                    px-4
                    font-secondary
                    text-[12px]
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    hover:bg-[#0068E4]
                  "
                >
                  <Plus
                    size={16}
                  />

                  Add Faculty
                </button>
              </div>
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
                  justify-between
                  gap-4
                  rounded-[10px]
                  border
                  px-4
                  py-3
                  ${
                    message.type ===
                    "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                `}
              >
                <div className="flex items-start gap-2 font-secondary text-[12px] font-medium">
                  {message.type ===
                  "success" ? (
                    <CheckCircle2
                      className="mt-0.5 shrink-0"
                      size={16}
                    />
                  ) : (
                    <XCircle
                      className="mt-0.5 shrink-0"
                      size={16}
                    />
                  )}

                  {
                    message.text
                  }
                </div>


                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      null
                    )
                  }
                >
                  <X
                    size={16}
                  />
                </button>
              </div>
            )}


            {/* ===========================================
                STATS
            =========================================== */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

              <StatCard
                icon={
                  <Users
                    size={19}
                  />
                }
                title="Faculty Members"
                value={
                  total
                }
              />


              <StatCard
                icon={
                  <Layers3
                    size={19}
                  />
                }
                title="Categories"
                value={
                  categories.length
                }
              />


              <StatCard
                icon={
                  <CheckCircle2
                    size={19}
                  />
                }
                title="Active Categories"
                value={
                  categories.filter(
                    (
                      category
                    ) =>
                      category.is_active
                  ).length
                }
              />
            </section>


            {/* ===========================================
                FILTERS
            =========================================== */}

            <section className="mt-5 rounded-[12px] border border-[#E4EAF2] bg-white p-4 shadow-sm">
              <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_220px_180px]">

                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                  />

                  <input
                    type="search"
                    value={
                      search
                    }
                    onChange={(
                      event
                    ) =>
                      setSearch(
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="Search faculty..."
                    className="
                      h-[42px]
                      w-full
                      rounded-[9px]
                      border
                      border-[#DDE6F0]
                      bg-white
                      pl-10
                      pr-4
                      font-secondary
                      text-[12px]
                      text-[#344054]
                      outline-none
                      transition
                      placeholder:text-[#98A2B3]
                      focus:border-[#0075FF]
                      focus:ring-2
                      focus:ring-[#0075FF]/10
                    "
                  />
                </div>


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
                  className="
                    h-[42px]
                    rounded-[9px]
                    border
                    border-[#DDE6F0]
                    bg-white
                    px-3
                    font-secondary
                    text-[12px]
                    text-[#344054]
                    outline-none
                    focus:border-[#0075FF]
                  "
                >
                  <option value="all">
                    All Categories
                  </option>

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
                      </option>
                    )
                  )}
                </select>


                <select
                  value={
                    statusFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setStatusFilter(
                      event
                        .target
                        .value as StatusFilter
                    )
                  }
                  className="
                    h-[42px]
                    rounded-[9px]
                    border
                    border-[#DDE6F0]
                    bg-white
                    px-3
                    font-secondary
                    text-[12px]
                    text-[#344054]
                    outline-none
                    focus:border-[#0075FF]
                  "
                >
                  <option value="all">
                    All Status
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </section>


            {/* ===========================================
                DESKTOP TABLE
            =========================================== */}

            <section className="mt-5 hidden overflow-hidden rounded-[12px] border border-[#E4EAF2] bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr className="border-b border-[#E8EDF3] bg-[#F8FAFC]">
                      <TableHeading>
                        Faculty
                      </TableHeading>

                      <TableHeading>
                        Subject
                      </TableHeading>

                      <TableHeading>
                        Category
                      </TableHeading>

                      <TableHeading>
                        Experience
                      </TableHeading>

                      <TableHeading>
                        Status
                      </TableHeading>

                      <TableHeading>
                        Order
                      </TableHeading>

                      <TableHeading
                        align="right"
                      >
                        Actions
                      </TableHeading>
                    </tr>
                  </thead>


                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="h-64"
                        >
                          <LoadingState />
                        </td>
                      </tr>
                    ) : facultyMembers.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="h-64"
                        >
                          <EmptyState />
                        </td>
                      </tr>
                    ) : (
                      facultyMembers.map(
                        (
                          member
                        ) => (
                          <tr
                            key={
                              member.id
                            }
                            className="border-b border-[#EDF1F5] transition last:border-0 hover:bg-[#FBFCFD]"
                          >
                            <td className="px-5 py-4">
                              <FacultyIdentity
                                member={
                                  member
                                }
                              />
                            </td>


                            <td className="px-5 py-4 font-secondary text-[12px] text-[#475467]">
                              {
                                member.subject
                              }
                            </td>


                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-full bg-[#EEF6FF] px-2.5 py-1 font-secondary text-[11px] font-medium text-[#0075FF]">
                                {
                                  member
                                    .category
                                    .name
                                }
                              </span>
                            </td>


                            <td className="px-5 py-4 font-secondary text-[12px] text-[#475467]">
                              {
                                member.experience_years
                              }{" "}
                              {member.experience_years ===
                              1
                                ? "Year"
                                : "Years"}
                            </td>


                            <td className="px-5 py-4">
                              <StatusBadge
                                active={
                                  member.is_active
                                }
                              />
                            </td>


                            <td className="px-5 py-4 font-secondary text-[12px] font-medium text-[#475467]">
                              {
                                member.display_order
                              }
                            </td>


                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <ActionButton
                                  title="Edit"
                                  onClick={() =>
                                    router.push(
                                      `/admin/faculty/${member.id}/edit`
                                    )
                                  }
                                >
                                  <Edit3
                                    size={15}
                                  />
                                </ActionButton>


                                <ActionButton
                                  title="Delete"
                                  danger
                                  disabled={
                                    deletingMemberId ===
                                    member.id
                                  }
                                  onClick={() =>
                                    handleDeleteMember(
                                      member
                                    )
                                  }
                                >
                                  {deletingMemberId ===
                                  member.id ? (
                                    <Loader2
                                      size={15}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2
                                      size={15}
                                    />
                                  )}
                                </ActionButton>
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>


            {/* ===========================================
                MOBILE CARDS
            =========================================== */}

            <section className="mt-5 grid gap-4 lg:hidden">
              {loading ? (
                <div className="rounded-[12px] border border-[#E4EAF2] bg-white py-20">
                  <LoadingState />
                </div>
              ) : facultyMembers.length ===
                0 ? (
                <div className="rounded-[12px] border border-[#E4EAF2] bg-white py-20">
                  <EmptyState />
                </div>
              ) : (
                facultyMembers.map(
                  (
                    member
                  ) => (
                    <div
                      key={
                        member.id
                      }
                      className="rounded-[12px] border border-[#E4EAF2] bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <FacultyAvatar
                          member={
                            member
                          }
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-primary text-[14px] font-semibold text-[#111827]">
                            {
                              member.name
                            }
                          </h3>

                          <p className="mt-1 font-secondary text-[11px] text-[#7B8797]">
                            {
                              member.designation
                            }
                          </p>
                        </div>

                        <StatusBadge
                          active={
                            member.is_active
                          }
                        />
                      </div>


                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <MobileDetail
                          label="Subject"
                          value={
                            member.subject
                          }
                        />

                        <MobileDetail
                          label="Category"
                          value={
                            member
                              .category
                              .name
                          }
                        />

                        <MobileDetail
                          label="Experience"
                          value={`${member.experience_years} ${
                            member.experience_years ===
                            1
                              ? "Year"
                              : "Years"
                          }`}
                        />

                        <MobileDetail
                          label="Order"
                          value={String(
                            member.display_order
                          )}
                        />
                      </div>


                      <div className="mt-4 flex gap-2 border-t border-[#EDF1F5] pt-4">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/admin/faculty/${member.id}/edit`
                            )
                          }
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[9px] border border-[#DDE6F0] font-secondary text-[12px] font-medium text-[#344054]"
                        >
                          <Edit3
                            size={15}
                          />

                          Edit
                        </button>


                        <button
                          type="button"
                          disabled={
                            deletingMemberId ===
                            member.id
                          }
                          onClick={() =>
                            handleDeleteMember(
                              member
                            )
                          }
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[9px] border border-red-200 font-secondary text-[12px] font-medium text-red-600 disabled:opacity-50"
                        >
                          {deletingMemberId ===
                          member.id ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={15}
                            />
                          )}

                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )
              )}
            </section>


            {/* ===========================================
                PAGINATION
            =========================================== */}

            {!loading &&
              total >
                0 && (
                <div className="mt-5 flex flex-col gap-3 rounded-[12px] border border-[#E4EAF2] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-secondary text-[11px] text-[#7B8797] sm:text-[12px]">
                    Showing{" "}
                    <span className="font-semibold text-[#344054]">
                      {(page -
                        1) *
                        PAGE_LIMIT +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-[#344054]">
                      {Math.min(
                        page *
                          PAGE_LIMIT,
                        total
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#344054]">
                      {
                        total
                      }
                    </span>
                  </p>


                  <div className="flex items-center gap-2">
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
                            current -
                            1
                        )
                      }
                      className="inline-flex h-9 items-center gap-1 rounded-[9px] border border-[#DDE6F0] bg-white px-3 font-secondary text-[11px] font-medium text-[#344054] disabled:opacity-40"
                    >
                      <ChevronLeft
                        size={15}
                      />

                      Previous
                    </button>


                    <span className="flex h-9 min-w-9 items-center justify-center rounded-[9px] bg-[#0075FF] px-3 font-secondary text-[11px] font-semibold text-white">
                      {
                        page
                      }
                    </span>


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
                            current +
                            1
                        )
                      }
                      className="inline-flex h-9 items-center gap-1 rounded-[9px] border border-[#DDE6F0] bg-white px-3 font-secondary text-[11px] font-medium text-[#344054] disabled:opacity-40"
                    >
                      Next

                      <ChevronRight
                        size={15}
                      />
                    </button>
                  </div>
                </div>
              )}
          </main>
        </div>


        {/* ===============================================
            CATEGORY MODAL
        =============================================== */}

        {categoryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-[720px] overflow-hidden rounded-[14px] bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b border-[#E4EAF2] px-5 py-4">
                <div>
                  <h2 className="font-primary text-[17px] font-semibold text-[#111827]">
                    Manage Faculty
                    Categories
                  </h2>

                  <p className="mt-1 font-secondary text-[11px] text-[#7B8797]">
                    Add, edit and
                    control Faculty
                    category visibility.
                  </p>
                </div>


                <button
                  type="button"
                  onClick={() => {
                    setCategoryModalOpen(
                      false
                    );

                    resetCategoryForm();
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#667085] hover:bg-[#F2F4F7]"
                >
                  <X
                    size={19}
                  />
                </button>
              </div>


              <div className="max-h-[calc(90vh-78px)] overflow-y-auto">

                {/* CATEGORY FORM */}

                <form
                  onSubmit={
                    handleCategorySubmit
                  }
                  className="border-b border-[#E4EAF2] bg-[#F8FAFC] p-5"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <CirclePlus
                      size={17}
                      className="text-[#0075FF]"
                    />

                    <h3 className="font-primary text-[13px] font-semibold text-[#111827]">
                      {editingCategory
                        ? "Edit Category"
                        : "Add Category"}
                    </h3>
                  </div>


                  <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                    <div>
                      <label className="mb-1.5 block font-secondary text-[11px] font-medium text-[#344054]">
                        Category Name
                      </label>

                      <input
                        value={
                          categoryName
                        }
                        onChange={(
                          event
                        ) =>
                          setCategoryName(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Higher Secondary"
                        className="h-[42px] w-full rounded-[9px] border border-[#DDE6F0] bg-white px-3 font-secondary text-[12px] outline-none focus:border-[#0075FF]"
                      />
                    </div>


                    <div>
                      <label className="mb-1.5 block font-secondary text-[11px] font-medium text-[#344054]">
                        Display Order
                      </label>

                      <input
                        type="number"
                        min={1}
                        value={
                          categoryOrder
                        }
                        onChange={(
                          event
                        ) =>
                          setCategoryOrder(
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
                        className="h-[42px] w-full rounded-[9px] border border-[#DDE6F0] bg-white px-3 font-secondary text-[12px] outline-none focus:border-[#0075FF]"
                      />
                    </div>
                  </div>


                  <label className="mt-4 flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={
                        categoryActive
                      }
                      onChange={(
                        event
                      ) =>
                        setCategoryActive(
                          event
                            .target
                            .checked
                        )
                      }
                      className="h-4 w-4 accent-[#0075FF]"
                    />

                    <span className="font-secondary text-[11px] text-[#475467]">
                      Active and visible
                      publicly
                    </span>
                  </label>


                  <div className="mt-5 flex gap-2">
                    <button
                      type="submit"
                      disabled={
                        categorySaving
                      }
                      className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#0075FF] px-4 font-secondary text-[11px] font-semibold text-white disabled:opacity-60"
                    >
                      {categorySaving ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Plus
                          size={15}
                        />
                      )}

                      {editingCategory
                        ? "Update Category"
                        : "Add Category"}
                    </button>


                    {editingCategory && (
                      <button
                        type="button"
                        onClick={
                          resetCategoryForm
                        }
                        className="h-10 rounded-[9px] border border-[#DDE6F0] bg-white px-4 font-secondary text-[11px] font-medium text-[#344054]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>


                {/* CATEGORY LIST */}

                <div className="p-5">
                  {categoriesLoading ? (
                    <div className="py-12">
                      <LoadingState />
                    </div>
                  ) : categories.length ===
                    0 ? (
                    <div className="rounded-[10px] border border-dashed border-[#DDE6F0] py-10 text-center font-secondary text-[12px] text-[#7B8797]">
                      No categories
                      available.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {categories.map(
                        (
                          category
                        ) => (
                          <div
                            key={
                              category.id
                            }
                            className="flex flex-col gap-3 rounded-[10px] border border-[#E4EAF2] p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#EEF6FF] font-secondary text-[12px] font-semibold text-[#0075FF]">
                                {
                                  category.display_order
                                }
                              </div>


                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-primary text-[13px] font-semibold text-[#111827]">
                                    {
                                      category.name
                                    }
                                  </p>

                                  <StatusBadge
                                    active={
                                      category.is_active
                                    }
                                  />
                                </div>

                                <p className="mt-1 font-secondary text-[10px] text-[#98A2B3]">
                                  {
                                    category.slug
                                  }
                                </p>
                              </div>
                            </div>


                            <div className="flex gap-2">
                              <ActionButton
                                title="Edit"
                                onClick={() =>
                                  handleEditCategory(
                                    category
                                  )
                                }
                              >
                                <Edit3
                                  size={15}
                                />
                              </ActionButton>


                              <ActionButton
                                title="Delete"
                                danger
                                disabled={
                                  deletingCategoryId ===
                                  category.id
                                }
                                onClick={() =>
                                  handleDeleteCategory(
                                    category
                                  )
                                }
                              >
                                {deletingCategoryId ===
                                category.id ? (
                                  <Loader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2
                                    size={15}
                                  />
                                )}
                              </ActionButton>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  icon,
  title,
  value,
}: {
  icon:
    ReactNode;

  title:
    string;

  value:
    number;
}) {
  return (
    <div className="rounded-[12px] border border-[#E4EAF2] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EEF6FF] text-[#0075FF]">
          {icon}
        </div>

        <div>
          <p className="font-secondary text-[11px] text-[#7B8797]">
            {title}
          </p>

          <p className="mt-1 font-primary text-[22px] font-semibold text-[#111827]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}


// =========================================================
// TABLE HEADING
// =========================================================

function TableHeading({
  children,
  align = "left",
}: {
  children:
    ReactNode;

  align?:
    | "left"
    | "right";
}) {
  return (
    <th
      className={`
        px-5
        py-3
        font-secondary
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.06em]
        text-[#7B8797]
        ${
          align ===
          "right"
            ? "text-right"
            : "text-left"
        }
      `}
    >
      {children}
    </th>
  );
}


// =========================================================
// FACULTY IDENTITY
// =========================================================

function FacultyIdentity({
  member,
}: {
  member:
    FacultyMember;
}) {
  return (
    <div className="flex min-w-[230px] items-center gap-3">
      <FacultyAvatar
        member={
          member
        }
      />

      <div className="min-w-0">
        <p className="truncate font-primary text-[13px] font-semibold text-[#111827]">
          {member.name}
        </p>

        <p className="mt-1 truncate font-secondary text-[10px] text-[#7B8797]">
          {
            member.designation
          }
        </p>
      </div>
    </div>
  );
}


// =========================================================
// AVATAR
// =========================================================

function FacultyAvatar({
  member,
}: {
  member:
    FacultyMember;
}) {
  const imageUrl =
    getFacultyImageUrl(
      member.image_url
    );


  if (imageUrl) {
    return (
      <img
        src={
          imageUrl
        }
        alt={
          member.name
        }
        className="h-11 w-11 shrink-0 rounded-[9px] border border-[#E4EAF2] object-cover"
      />
    );
  }


  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] bg-[#EEF6FF] text-[#0075FF]">
      <UserRound
        size={19}
      />
    </div>
  );
}


// =========================================================
// STATUS
// =========================================================

function StatusBadge({
  active,
}: {
  active:
    boolean;
}) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        font-secondary
        text-[10px]
        font-medium
        ${
          active
            ? "bg-emerald-50 text-emerald-700"
            : "bg-[#F2F4F7] text-[#667085]"
        }
      `}
    >
      {active
        ? "Active"
        : "Inactive"}
    </span>
  );
}


// =========================================================
// ACTION BUTTON
// =========================================================

function ActionButton({
  children,
  title,
  danger = false,
  disabled = false,
  onClick,
}: {
  children:
    ReactNode;

  title:
    string;

  danger?:
    boolean;

  disabled?:
    boolean;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      title={
        title
      }
      disabled={
        disabled
      }
      onClick={
        onClick
      }
      className={`
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-[9px]
        border
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          danger
            ? "border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-[#E4EAF2] bg-white text-[#475467] hover:border-[#0075FF] hover:text-[#0075FF]"
        }
      `}
    >
      {children}
    </button>
  );
}


// =========================================================
// MOBILE DETAIL
// =========================================================

function MobileDetail({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="rounded-[9px] bg-[#F8FAFC] p-3">
      <p className="font-secondary text-[9px] font-semibold uppercase tracking-[0.05em] text-[#98A2B3]">
        {label}
      </p>

      <p className="mt-1 font-secondary text-[11px] font-medium text-[#344054]">
        {value}
      </p>
    </div>
  );
}


// =========================================================
// LOADING
// =========================================================

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-[#7B8797]">
      <Loader2
        size={24}
        className="animate-spin text-[#0075FF]"
      />

      <p className="font-secondary text-[11px]">
        Loading Faculty...
      </p>
    </div>
  );
}


// =========================================================
// EMPTY
// =========================================================

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-5 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF6FF] text-[#0075FF]">
        <GraduationCap
          size={20}
        />
      </div>

      <h3 className="font-primary text-[14px] font-semibold text-[#111827]">
        No Faculty found
      </h3>

      <p className="mt-1 max-w-sm font-secondary text-[11px] leading-5 text-[#7B8797]">
        Add a Faculty member
        or change the current
        filters.
      </p>
    </div>
  );
}