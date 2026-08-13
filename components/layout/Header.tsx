"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

type SubMenuItem = {
  label: string;
  href: string;
  keywords?: string[];
};

type NavigationItem = {
  label: string;
  href: string;
  keywords?: string[];
  children?: SubMenuItem[];
};

type SearchablePage = {
  label: string;
  href: string;
  parent: string;
  keywords: string[];
};

/* =========================================================
   NAVIGATION
========================================================= */

const navigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    keywords: ["home", "rosary", "school"],
  },
  {
    label: "About",
    href: "/about",
    keywords: [
      "about",
      "school",
      "history",
      "vision",
      "mission",
      "principal",
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    keywords: [
      "academics",
      "education",
      "learning",
      "curriculum",
      "departments",
      "faculty",
      "clubs",
    ],
    children: [
      {
        label: "Curriculum",
        href: "/academics/curriculum",
        keywords: [
          "curriculum",
          "syllabus",
          "subjects",
        ],
      },
      {
        label: "Departments",
        href: "/academics/departments",
        keywords: [
          "departments",
          "department",
        ],
      },
      {
        label: "Faculty",
        href: "/academics/faculty",
        keywords: [
          "faculty",
          "teacher",
          "teachers",
          "staff",
        ],
      },
      {
        label: "Clubs",
        href: "/academics/clubs",
        keywords: [
          "clubs",
          "activities",
          "student clubs",
        ],
      },
    ],
  },
  {
    label: "Community",
    href: "/community",
    keywords: [
      "community",
      "student",
      "parent",
      "alumni",
    ],
    children: [
      {
        label: "Student Corner",
        href: "/community/student-corner",
        keywords: [
          "student",
          "students",
          "student corner",
        ],
      },
      {
        label: "Parent Corner",
        href: "/community/parent-corner",
        keywords: [
          "parent",
          "parents",
          "parent corner",
        ],
      },
      {
        label: "Alumni",
        href: "/community/alumni",
        keywords: [
          "alumni",
          "former students",
          "old students",
        ],
      },
    ],
  },
  {
    label: "Information",
    href: "/information",
    keywords: [
      "information",
      "gallery",
      "news",
      "events",
      "achievements",
      "downloads",
    ],
    children: [
      {
        label: "Gallery",
        href: "/gallery",
        keywords: [
          "gallery",
          "photos",
          "images",
        ],
      },
      {
        label: "News",
        href: "/news",
        keywords: [
          "news",
          "announcement",
          "announcements",
        ],
      },
      {
        label: "Events",
        href: "/events",
        keywords: [
          "events",
          "programmes",
          "programs",
          "upcoming",
        ],
      },
      {
        label: "Achievements",
        href: "/achievements",
        keywords: [
          "achievements",
          "awards",
          "results",
        ],
      },
      {
        label: "Downloads",
        href: "/downloads",
        keywords: [
          "downloads",
          "pdf",
          "documents",
          "circular",
        ],
      },
    ],
  },
  {
    label: "Contact Us",
    href: "/contact-us",
    keywords: [
      "contact",
      "contact us",
      "phone",
      "email",
      "address",
    ],
  },
];

/* =========================================================
   UTILITY LINKS
========================================================= */

const utilityLinks = [
  {
    label: "Fees Payment",
    href: "/fees-payment",
    keywords: [
      "fees",
      "fee",
      "payment",
      "fees payment",
      "pay fees",
    ],
  },
  {
    label: "Admission",
    href: "/admissions",
    keywords: [
      "admission",
      "admissions",
      "application",
      "apply",
    ],
  },
];

/* =========================================================
   SEARCH PAGES
========================================================= */

const searchablePages: SearchablePage[] = [
  ...navigation.flatMap((item) => [
    {
      label: item.label,
      href: item.href,
      parent: "",
      keywords: item.keywords ?? [],
    },

    ...(item.children?.map((child) => ({
      label: child.label,
      href: child.href,
      parent: item.label,
      keywords: child.keywords ?? [],
    })) ?? []),
  ]),

  ...utilityLinks.map((item) => ({
    label: item.label,
    href: item.href,
    parent: "",
    keywords: item.keywords,
  })),
];

/* =========================================================
   SEARCH HELPERS
========================================================= */

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function getSearchScore(
  page: SearchablePage,
  query: string
) {
  const label = normalizeText(page.label);

  const parent = normalizeText(page.parent);

  const keywords = page.keywords.map(normalizeText);

  if (label === query) return 100;

  if (label.startsWith(query)) return 90;

  if (label.includes(query)) return 80;

  if (
    keywords.some(
      (keyword) => keyword === query
    )
  ) {
    return 70;
  }

  if (
    keywords.some((keyword) =>
      keyword.startsWith(query)
    )
  ) {
    return 60;
  }

  if (
    keywords.some((keyword) =>
      keyword.includes(query)
    )
  ) {
    return 50;
  }

  if (parent.includes(query)) {
    return 40;
  }

  return 0;
}

/* =========================================================
   HEADER COMPONENT
========================================================= */

export default function Header() {
  const pathname = usePathname();

  const router = useRouter();

  const searchRef =
    useRef<HTMLDivElement>(null);

  const [search, setSearch] =
    useState("");

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    openMobileDropdown,
    setOpenMobileDropdown,
  ] = useState<string | null>(null);

  /* =======================================================
     SEARCH RESULTS
  ======================================================= */

  const searchResults = useMemo(() => {
    const query =
      normalizeText(search);

    if (!query) {
      return [];
    }

    return searchablePages
      .map((page) => ({
        ...page,
        score: getSearchScore(
          page,
          query
        ),
      }))
      .filter(
        (page) => page.score > 0
      )
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 8);
  }, [search]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!searchResults.length) {
      return;
    }

    router.push(
      searchResults[0].href
    );

    setSearch("");

    setSearchOpen(false);

    setMobileMenuOpen(false);
  };

  const selectSearchResult = (
    href: string
  ) => {
    router.push(href);

    setSearch("");

    setSearchOpen(false);

    setMobileMenuOpen(false);
  };

  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  const isItemActive = (
    item: NavigationItem
  ) => {
    if (item.href === "/") {
      return pathname === "/";
    }

    if (
      pathname === item.href ||
      pathname.startsWith(
        `${item.href}/`
      )
    ) {
      return true;
    }

    return (
      item.children?.some(
        (child) =>
          pathname === child.href ||
          pathname.startsWith(
            `${child.href}/`
          )
      ) ?? false
    );
  };

  const isChildActive = (
    href: string
  ) => {
    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  };

  /* =======================================================
     MOBILE DROPDOWN
  ======================================================= */

  const toggleMobileDropdown = (
    label: string
  ) => {
    setOpenMobileDropdown(
      (current) =>
        current === label
          ? null
          : label
    );
  };

  /* =======================================================
     OUTSIDE CLICK + ESC
  ======================================================= */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {
        setSearchOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setSearchOpen(false);

        setMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =======================================================
     ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    setMobileMenuOpen(false);

    setOpenMobileDropdown(null);

    setSearchOpen(false);
  }, [pathname]);

  /* =======================================================
     MOBILE BODY LOCK
  ======================================================= */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className="
        fixed
        left-0
        top-0
        z-[1000]
        w-full
      "
    >
      {/* =====================================================
          TOP ROW
      ====================================================== */}

      <div
        className="
          relative
          h-[68px]
          w-full
          overflow-visible
          bg-black/25
          backdrop-blur-[10px]

          lg:h-[72px]
        "
      >
        <div
          className="
            mx-auto
            h-full
            w-full
            max-w-[1360px]
            px-[18px]

            sm:px-[28px]

            lg:px-[40px]

            xl:px-[48px]
          "
        >
          <div
            className="
              grid
              h-full
              grid-cols-[1fr_auto]
              items-center

              lg:grid-cols-[1fr_280px_1fr]
              lg:gap-[36px]

              xl:grid-cols-[1fr_300px_1fr]
            "
          >
            {/* =================================================
                LOGO
            ================================================= */}

            <div
              className="
                flex
                min-w-0
                items-center
                justify-start
              "
            >
              <Link
                href="/"
                aria-label="Rosary Matriculation Hr Sec School"
                className="
                  relative
                  block
                  h-[51px]
                  w-[250px]
                  max-w-[calc(100vw-90px)]
                  shrink-0

                  sm:h-[54px]
                  sm:w-[280px]

                  lg:h-[55px]
                  lg:w-[285px]

                  xl:w-[300px]
                "
              >
                <Image
                  src="/icons/rosary-logo.svg"
                  alt="Rosary Matriculation Hr Sec School"
                  fill
                  priority
                  sizes="
                    (max-width: 639px) 250px,
                    (max-width: 1023px) 280px,
                    300px
                  "
                  className="
                    object-contain
                    object-left
                  "
                />
              </Link>
            </div>

            {/* =================================================
                DESKTOP SEARCH
            ================================================= */}

            <div
              ref={searchRef}
              className="
                relative
                hidden
                h-full
                items-center
                justify-center

                lg:flex
              "
            >
              <form
                onSubmit={handleSearch}
                role="search"
                className="
                  flex
                  h-[42px]
                  w-[260px]
                  items-center
                  rounded-full
                  border-[1.5px]
                  border-[#0075FF]
                  bg-white/52
                  px-[15px]
                  shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                  backdrop-blur-[6px]
                  transition-all
                  duration-200

                  hover:bg-white

                  focus-within:bg-white
                  focus-within:shadow-[0_0_0_3px_rgba(0,117,255,0.12)]

                  xl:w-[280px]
                "
              >
                <button
                  type="submit"
                  aria-label="Search Rosary School"
                  className="
                    mr-[10px]
                    flex
                    shrink-0
                    items-center
                    justify-center
                    text-[#0075FF]
                  "
                >
                  <SearchIcon />
                </button>

                <input
                  type="search"
                  value={search}
                  autoComplete="off"
                  aria-label="Search Rosary School"
                  placeholder="Search Rosary school..."
                  onFocus={() =>
                    setSearchOpen(true)
                  }
                  onChange={(event) => {
                    setSearch(
                      event.target.value
                    );

                    setSearchOpen(true);
                  }}
                  className="
                    w-full
                    min-w-0
                    bg-transparent
                    font-secondary
                    text-[14px]
                    font-medium
                    text-[#171717]
                    outline-none
                    placeholder:text-[#444444]
                    placeholder:opacity-100
                  "
                />
              </form>

              {/* SEARCH RESULTS */}

              {searchOpen &&
                search.trim() && (
                  <div
                    className="
                      absolute
                      left-1/2
                      top-[61px]
                      z-[5000]
                      w-[320px]
                      -translate-x-1/2
                      overflow-hidden
                      rounded-[4px]
                      border
                      border-black/10
                      bg-white
                      shadow-[0_14px_35px_rgba(0,0,0,0.18)]
                    "
                  >
                    {searchResults.length >
                    0 ? (
                      searchResults.map(
                        (result) => (
                          <button
                            key={`${result.href}-${result.label}`}
                            type="button"
                            onClick={() =>
                              selectSearchResult(
                                result.href
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              justify-between
                              border-b
                              border-black/[0.06]
                              px-[16px]
                              py-[11px]
                              text-left
                              transition
                              last:border-b-0
                              hover:bg-[#F1F7FF]
                            "
                          >
                            <div
                              className="
                                min-w-0
                              "
                            >
                              <p
                                className="
                                  truncate
                                  font-primary
                                  text-[14px]
                                  font-medium
                                  text-[#171717]
                                "
                              >
                                {
                                  result.label
                                }
                              </p>

                              {result.parent && (
                                <p
                                  className="
                                    mt-[2px]
                                    font-secondary
                                    text-[11px]
                                    text-[#888888]
                                  "
                                >
                                  {
                                    result.parent
                                  }
                                </p>
                              )}
                            </div>

                            <ArrowIcon />
                          </button>
                        )
                      )
                    ) : (
                      <p
                        className="
                          px-[16px]
                          py-[17px]
                          text-center
                          font-secondary
                          text-[13px]
                          text-[#777777]
                        "
                      >
                        No matching
                        page found
                      </p>
                    )}
                  </div>
                )}
            </div>

            {/* =================================================
                DESKTOP RIGHT LINKS
            ================================================= */}

            <div
              className="
                hidden
                h-full
                items-center
                justify-end

                lg:flex
              "
            >
              <Link
                href="/fees-payment"
                className="
                  flex
                  h-[30px]
                  items-center
                  border-r
                  border-white/60
                  pr-[21px]
                  font-secondary
                  text-[14px]
                  font-medium
                  !text-white
                  transition-colors
                  duration-200
                  hover:!text-[#72B7FF]

                  xl:text-[15px]
                "
              >
                Fees Payment
              </Link>

              <Link
                href="/admissions"
                className="
                  pl-[21px]
                  font-secondary
                  text-[14px]
                  font-medium
                  !text-white
                  transition-colors
                  duration-200
                  hover:!text-[#72B7FF]

                  xl:text-[15px]
                "
              >
                Admission
              </Link>
            </div>

            {/* =================================================
                MOBILE HAMBURGER ONLY
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-end

                lg:hidden
              "
            >
              <button
                type="button"
                aria-expanded={
                  mobileMenuOpen
                }
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation"
                    : "Open navigation"
                }
                onClick={() =>
                  setMobileMenuOpen(
                    (current) =>
                      !current
                  )
                }
                className="
                  flex
                  h-[42px]
                  w-[42px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/60
                  bg-white/95
                  text-[#151515]
                  shadow-sm
                  backdrop-blur
                "
              >
                {mobileMenuOpen ? (
                  <CloseIcon />
                ) : (
                  <MenuIcon />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          DESKTOP NAVIGATION
          
          NO white border/line above this
      ====================================================== */}

      <nav
        aria-label="Main navigation"
        className="
          hidden
          h-[46px]
          w-full
          bg-white/[0.52]
          backdrop-blur-[7px]

          lg:block
        "
      >
        <div
          className="
            mx-auto
            h-full
            w-full
            max-w-[900px]
            px-[20px]
          "
        >
          <ul
            className="
              flex
              h-full
              w-full
              items-center
              justify-between
            "
          >
            {navigation.map(
              (item) => {
                const active =
                  isItemActive(item);

                const hasChildren =
                  !!item.children
                    ?.length;

                return (
                  <li
                    key={item.label}
                    className="
                      group
                      relative
                      flex
                      h-full
                      items-center
                    "
                  >
                    <Link
                      href={item.href}
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      className={`
                        relative
                        flex
                        h-full
                        items-center
                        gap-[8px]
                        whitespace-nowrap
                        font-primary
                        text-[15px]
                        font-medium
                        tracking-[-0.2px]
                        transition-colors
                        duration-150

                        xl:text-[16px]

                        ${
                          active
                            ? "text-[#101010]"
                            : "text-[#151515] hover:text-[#0075FF]"
                        }
                      `}
                    >
                      {item.label}

                      {hasChildren && (
                        <ChevronDownIcon />
                      )}

                      {/* ACTIVE UNDERLINE */}

                      <span
                        className={`
                          absolute
                          bottom-[7px]
                          left-0
                          h-[1.5px]
                          bg-[#111111]
                          transition-all
                          duration-200

                          ${
                            active
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }
                        `}
                      />
                    </Link>

                    {/* =========================================
                        DROPDOWN
                    ========================================== */}

                    {hasChildren && (
                      <div
                        className=" mt-1
                          invisible
                          absolute
                          left-0
                          top-full
                          z-[4000]
                          w-max
                          min-w-[150px]
                          translate-y-[3px]
                          bg-white/[0.72]
                          opacity-0
                          shadow-[0_8px_24px_rgba(0,0,0,0.10)]
                          backdrop-blur-[9px]
                          transition-all
                          duration-150

                          group-hover:visible
                          group-hover:translate-y-0
                          group-hover:opacity-100
                        "
                      >
                        <div
                          className="
                            py-[10px]
                          "
                        >
                          {item.children?.map(
                            (child) => {
                              const childActive =
                                isChildActive(
                                  child.href
                                );

                              return (
                                <Link
                                  key={
                                    child.label
                                  }
                                  href={
                                    child.href
                                  }
                                  className={`
                                    group/child
                                    block
                                    whitespace-nowrap
                                    px-[18px]
                                    py-[9px]
                                    font-secondary
                                    text-[14px]
                                    font-medium
                                    transition-colors

                                    xl:text-[15px]

                                    ${
                                      childActive
                                        ? "text-[#0075FF]"
                                        : "text-[#202020] hover:text-[#0075FF]"
                                    }
                                  `}
                                >
                                  <span
                                    className="
                                      relative
                                      inline-block
                                    "
                                  >
                                    {
                                      child.label
                                    }

                                    <span
                                      className={`
                                        absolute
                                        -bottom-[2px]
                                        left-0
                                        h-[1px]
                                        bg-[#0075FF]
                                        transition-all
                                        duration-150

                                        ${
                                          childActive
                                            ? "w-full"
                                            : "w-0 group-hover/child:w-full"
                                        }
                                      `}
                                    />
                                  </span>
                                </Link>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </nav>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <div
        className={`
          absolute
          left-0
          top-[68px]
          z-[5000]
          w-full
          overflow-hidden
          bg-white
          shadow-[0_18px_40px_rgba(0,0,0,0.18)]
          transition-all
          duration-300

          lg:hidden

          ${
            mobileMenuOpen
              ? "max-h-[calc(100vh-68px)] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }
        `}
      >
        <div
          className="
            max-h-[calc(100vh-68px)]
            overflow-y-auto
          "
        >
          {/* ===============================================
              SEARCH INSIDE HAMBURGER
          ================================================ */}

          <div
            className="
              border-b
              border-[#E7E7E7]
              px-[18px]
              py-[16px]
            "
          >
            <form
              onSubmit={handleSearch}
              role="search"
              className="
                flex
                h-[48px]
                w-full
                items-center
                rounded-full
                border-[1.5px]
                border-[#0075FF]
                bg-white
                px-[15px]
                shadow-[0_2px_7px_rgba(0,0,0,0.05)]
              "
            >
              <button
                type="submit"
                aria-label="Search Rosary School"
                className="
                  mr-[10px]
                  flex
                  shrink-0
                  items-center
                  justify-center
                  text-[#0075FF]
                "
              >
                <SearchIcon />
              </button>

              <input
                type="search"
                value={search}
                autoComplete="off"
                placeholder="Search Rosary school..."
                onChange={(event) => {
                  setSearch(
                    event.target.value
                  );
                }}
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  font-secondary
                  text-[14px]
                  font-medium
                  text-[#171717]
                  outline-none
                  placeholder:text-[#555555]
                "
              />
            </form>

            {/* MOBILE SEARCH RESULTS */}

            {search.trim() && (
              <div
                className="
                  mt-[10px]
                  overflow-hidden
                  rounded-[6px]
                  border
                  border-[#E4E4E4]
                "
              >
                {searchResults.length >
                0 ? (
                  searchResults.map(
                    (result) => (
                      <button
                        key={`mobile-${result.href}-${result.label}`}
                        type="button"
                        onClick={() =>
                          selectSearchResult(
                            result.href
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          border-b
                          border-[#EEEEEE]
                          px-[15px]
                          py-[12px]
                          text-left
                          last:border-b-0
                          hover:bg-[#F0F7FF]
                        "
                      >
                        <div>
                          <p
                            className="
                              font-primary
                              text-[14px]
                              font-medium
                              text-[#171717]
                            "
                          >
                            {
                              result.label
                            }
                          </p>

                          {result.parent && (
                            <p
                              className="
                                mt-[2px]
                                font-secondary
                                text-[11px]
                                text-[#888888]
                              "
                            >
                              {
                                result.parent
                              }
                            </p>
                          )}
                        </div>

                        <ArrowIcon />
                      </button>
                    )
                  )
                ) : (
                  <p
                    className="
                      px-[14px]
                      py-[15px]
                      text-center
                      font-secondary
                      text-[13px]
                      text-[#777777]
                    "
                  >
                    No matching page
                    found
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ===============================================
              MOBILE NAVIGATION
          ================================================ */}

          <div
            className="
              px-[18px]
              py-[6px]
            "
          >
            {navigation.map(
              (item) => {
                const active =
                  isItemActive(item);

                const hasChildren =
                  !!item.children
                    ?.length;

                const open =
                  openMobileDropdown ===
                  item.label;

                return (
                  <div
                    key={item.label}
                    className="
                      border-b
                      border-[#EEEEEE]
                      last:border-b-0
                    "
                  >
                    <div
                      className="
                        flex
                        min-h-[54px]
                        items-center
                        justify-between
                      "
                    >
                      <Link
                        href={item.href}
                        className={`
                          flex
                          min-h-[54px]
                          flex-1
                          items-center
                          font-primary
                          text-[16px]
                          font-medium

                          ${
                            active
                              ? "text-[#0075FF]"
                              : "text-[#171717]"
                          }
                        `}
                      >
                        {item.label}
                      </Link>

                      {hasChildren && (
                        <button
                          type="button"
                          aria-label={`Toggle ${item.label}`}
                          aria-expanded={
                            open
                          }
                          onClick={() =>
                            toggleMobileDropdown(
                              item.label
                            )
                          }
                          className="
                            flex
                            h-[48px]
                            w-[48px]
                            shrink-0
                            items-center
                            justify-center
                            text-[#171717]
                          "
                        >
                          <span
                            className={`
                              transition-transform
                              duration-200

                              ${
                                open
                                  ? "rotate-180"
                                  : ""
                              }
                            `}
                          >
                            <ChevronDownIcon />
                          </span>
                        </button>
                      )}
                    </div>

                    {/* MOBILE SUBMENU */}

                    {hasChildren && (
                      <div
                        className={`
                          overflow-hidden
                          transition-all
                          duration-300

                          ${
                            open
                              ? "max-h-[350px] pb-[12px]"
                              : "max-h-0"
                          }
                        `}
                      >
                        <div
                          className="
                            overflow-hidden
                            border-l-[3px]
                            border-[#0075FF]
                            bg-[#F5F9FF]
                          "
                        >
                          {item.children?.map(
                            (child) => {
                              const childActive =
                                isChildActive(
                                  child.href
                                );

                              return (
                                <Link
                                  key={
                                    child.label
                                  }
                                  href={
                                    child.href
                                  }
                                  className={`
                                    block
                                    px-[17px]
                                    py-[11px]
                                    font-secondary
                                    text-[14px]
                                    font-medium

                                    ${
                                      childActive
                                        ? "bg-[#EAF4FF] text-[#0075FF]"
                                        : "text-[#333333]"
                                    }
                                  `}
                                >
                                  {
                                    child.label
                                  }
                                </Link>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          {/* ===============================================
              MOBILE FEES / ADMISSION
          ================================================ */}

          <div
            className="
              grid
              grid-cols-2
              gap-[10px]
              border-t
              border-[#E7E7E7]
              p-[18px]
            "
          >
            <Link
              href="/fees-payment"
              className="
                flex
                h-[46px]
                items-center
                justify-center
                rounded-[5px]
                border
                border-[#0075FF]
                font-primary
                text-[14px]
                font-medium
                text-[#0075FF]
              "
            >
              Fees Payment
            </Link>

            <Link
              href="/admissions"
              className="
                flex
                h-[46px]
                items-center
                justify-center
                rounded-[5px]
                bg-[#0075FF]
                font-primary
                text-[14px]
                font-medium
                text-white
              "
            >
              Admission
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   ICONS
========================================================= */

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M16.5 16.5L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-[#0075FF]"
    >
      <path
        d="M5 12H19M14 7L19 12L14 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}