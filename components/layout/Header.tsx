
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

/* =====================================================
   TYPES
===================================================== */

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

/* =====================================================
   LINKS
===================================================== */

const PORTAL_URL =
  "https://rosary-frontend.vercel.app/login";

const FEES_URL =
  "https://feebook.southindianbank.bank.in/FeeBookUser/userhome";

/* =====================================================
   NAVIGATION
===================================================== */

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
    children: [
      {
        label: "History",
        href: "/about/history",
        keywords: ["history", "school history"],
      },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    keywords: [
      "academics",
      "education",
      "curriculum",
      "departments",
      "faculty",
      "clubs",
    ],
    children: [
      {
        label: "Curriculum",
        href: "/academics/curriculum",
        keywords: ["curriculum", "syllabus"],
      },
      {
        label: "Departments",
        href: "/academics/departments",
        keywords: ["departments"],
      },
      {
        label: "Faculty",
        href: "/academics/faculty",
        keywords: ["faculty", "teachers", "staff"],
      },
      {
        label: "School Council",
        href: "/academics/school-council",
        keywords: ["school council", "student council"],
      },
      {
        label: "Clubs",
        href: "/academics/clubs",
        keywords: ["clubs", "activities"],
      },
    ],
  },
  {
    label: "Community",
    href: "/community",
    keywords: ["community", "student", "parent", "alumni"],
    children: [
      {
        label: "Student Corner",
        href: "/community/student-corner",
        keywords: ["student", "student corner"],
      },
      {
        label: "Parent Corner",
        href: "/community/parent-corner",
        keywords: ["parent", "parent corner"],
      },
      {
        label: "Alumni",
        href: "/community/alumni",
        keywords: ["alumni", "former students"],
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
        keywords: ["gallery", "photos"],
      },
      {
        label: "News",
        href: "/news",
        keywords: ["news", "announcements"],
      },
      {
        label: "Events",
        href: "/events",
        keywords: ["events", "programmes"],
      },
      {
        label: "Achievements",
        href: "/achievements",
        keywords: ["achievements", "awards"],
      },
      {
        label: "Downloads",
        href: "/downloads",
        keywords: ["downloads", "documents", "pdf"],
      },
    ],
  },
  {
    label: "Contact Us",
    href: "/contact-us",
    keywords: ["contact", "phone", "email", "address"],
  },
];

const utilityLinks = [
  {
    label: "Portal",
    href: PORTAL_URL,
    keywords: ["portal", "login", "student portal", "parent portal"],
  },
  {
    label: "Fees Payment",
    href: FEES_URL,
    keywords: ["fees", "fee", "payment", "pay fees"],
  },
  {
    label: "Admission",
    href: "/admissions",
    keywords: ["admission", "admissions", "application"],
  },
];

/* =====================================================
   SEARCH INDEX
===================================================== */

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

function normalizeText(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function getSearchScore(page: SearchablePage, query: string) {
  const label = normalizeText(page.label);
  const parent = normalizeText(page.parent);
  const keywords = page.keywords.map(normalizeText);

  if (label === query) return 100;
  if (label.startsWith(query)) return 90;
  if (label.includes(query)) return 80;
  if (keywords.some((word) => word === query)) return 70;
  if (keywords.some((word) => word.startsWith(query))) return 60;
  if (keywords.some((word) => word.includes(query))) return 50;
  if (parent.includes(query)) return 40;

  return 0;
}

/* =====================================================
   ICONS
===================================================== */

type IconName =
  | "search"
  | "menu"
  | "close"
  | "chevron"
  | "arrow"
  | "portal"
  | "fees";

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 5 5" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    portal: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12h9m-4-4 4 4-4 4" />
      </>
    ),
    fees: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="M2 10h20M6 15h5" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/* =====================================================
   SEARCH RESULTS COMPONENT
===================================================== */

function SearchResults({
  results,
  onSelect,
  mobile = false,
}: {
  results: (SearchablePage & { score: number })[];
  onSelect: (href: string) => void;
  mobile?: boolean;
}) {
  return (
    <div
      className={
        mobile
          ? "mt-3 overflow-hidden rounded-lg border border-[#E6E4DD] bg-white"
          : "absolute left-0 right-0 top-[calc(100%+10px)] z-[300] overflow-hidden rounded-lg border border-[#E6E4DD] bg-white shadow-[0_14px_35px_rgba(35,48,59,0.13)]"
      }
    >
      <div className="max-h-[300px] overflow-y-auto">
        {results.length > 0 ? (
          results.map((result) => (
            <button
              key={`${result.href}-${result.label}`}
              type="button"
              onClick={() => onSelect(result.href)}
              className="flex w-full items-center justify-between gap-3 border-b border-[#F0EEE9] px-4 py-3 text-left transition-colors last:border-0 hover:bg-[#F7F6F2]"
            >
              <div className="min-w-0">
                <p className="truncate font-secondary text-[14px] font-semibold !text-[#233B50]">
                  {result.label}
                </p>

                <p className="mt-1 truncate font-secondary text-[11px] !text-[#8A9196]">
                  {result.parent || "Rosary School"}
                </p>
              </div>

              <Icon
                name="arrow"
                size={16}
                className="shrink-0 text-[#0075FF]"
              />
            </button>
          ))
        ) : (
          <div className="px-5 py-6 text-center">
            <p className="text-[13px] font-semibold !text-[#233B50]">
              No matching page found
            </p>
            <p className="mt-1 text-[12px] !text-[#8A9196]">
              Try another keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   HEADER
===================================================== */

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] =
    useState<string | null>(null);

  const searchResults = useMemo(() => {
    const query = normalizeText(search);
    if (!query) return [];

    return searchablePages
      .map((page) => ({
        ...page,
        score: getSearchScore(page, query),
      }))
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [search]);

  const selectSearchResult = (href: string) => {
    if (/^https?:\/\//.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }

    setSearch("");
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchResults.length) {
      selectSearchResult(searchResults[0].href);
    }
  };

  const isItemActive = (item: NavigationItem) => {
    if (item.href === "/") return pathname === "/";

    if (
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`)
    ) {
      return true;
    }

    return (
      item.children?.some(
        (child) =>
          pathname === child.href ||
          pathname.startsWith(`${child.href}/`)
      ) ?? false
    );
  };

  const isChildActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed left-0 top-0 z-[1000] w-full">

      {/* ==================================================
          MAIN HEADER - WARM IVORY + NAVY
      ================================================== */}

      <div className="relative z-[70] h-[76px] border-t-[3px] border-[#263F53] bg-[#FAF9F6] shadow-[0_2px_10px_rgba(35,48,59,0.06)] xl:h-[86px]">

        <div className="mx-auto h-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12">

          <div className="flex h-full items-center justify-between gap-5">

            {/* BRANDING */}

            <Link
              href="/"
              aria-label="Rosary Matriculation Hr Sec School"
              className="group flex min-w-0 shrink-0 items-center gap-[12px] sm:gap-[15px]"
            >

              {/* ORIGINAL LOGO WITHOUT WHITE CIRCLE */}

              <div className="relative h-[58px] w-[58px] shrink-0 sm:h-[65px] sm:w-[65px] xl:h-[72px] xl:w-[72px]">
                <Image
                  src="/icons/r-logo.svg"
                  alt="Rosary School Logo"
                  fill
                  priority
                  sizes="(max-width:640px) 58px, 72px"
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              {/* SCHOOL IDENTITY */}

              <div className="min-w-0">
                <span className="block font-primary text-[23px] font-bold leading-[1.05] tracking-[-0.6px] !text-[#223B50] sm:text-[26px] xl:text-[29px]">
                  Rosary
                </span>

                <span className="mt-[5px] block font-secondary text-[10px] font-medium leading-[1.3] tracking-[0.1px] !text-[#647787] sm:text-[12px]">
                  <span className="block sm:hidden">
                    Matriculation
                  </span>
                  <span className="block sm:hidden">
                    Hr. Sec. School
                  </span>
                  <span className="hidden whitespace-nowrap sm:block">
                    Matriculation Hr. Sec. School
                  </span>
                </span>
              </div>

            </Link>

            {/* DESKTOP SEARCH */}

            <div
              ref={searchRef}
              className="relative hidden w-full max-w-[330px] min-w-0 flex-1 xl:block"
            >
              <form
                role="search"
                onSubmit={handleSearch}
                className="flex h-[43px] w-full items-center gap-3 rounded-md border border-[#E4E5E2] bg-white px-[15px] transition-all duration-200 focus-within:border-[#8BAAC4] focus-within:shadow-[0_0_0_3px_rgba(0,117,255,0.07)]"
              >
                <button
                  type="submit"
                  aria-label="Search Rosary School"
                  className="shrink-0 !text-[#0075FF]"
                >
                  <Icon name="search" size={19} />
                </button>

                <input
                  type="search"
                  value={search}
                  autoComplete="off"
                  placeholder="Search Rosary school..."
                  aria-label="Search Rosary School"
                  onFocus={() => setSearchOpen(true)}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setSearchOpen(true);
                  }}
                  className="min-w-0 flex-1 bg-transparent font-secondary text-[13px] !text-[#223B50] outline-none placeholder:!text-[#9AA2A8]"
                />
              </form>

              {searchOpen && search.trim() && (
                <SearchResults
                  results={searchResults}
                  onSelect={selectSearchResult}
                />
              )}
            </div>

            {/* DESKTOP ACTIONS */}

            <div className="hidden shrink-0 items-center gap-[26px] xl:flex">

              <Link
                href={PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap font-secondary text-[13px] font-medium !text-[#334C60] transition-colors duration-200 hover:!text-[#0075FF]"
              >
                <Icon name="portal" size={16} />
                Portal
              </Link>

              <Link
                href={FEES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap font-secondary text-[13px] font-medium !text-[#334C60] transition-colors duration-200 hover:!text-[#0075FF]"
              >
                <Icon name="fees" size={16} />
                Fees Payment
              </Link>

              <Link
                href="/admissions"
                className="inline-flex h-[43px] items-center justify-center gap-[10px] rounded-md bg-[#263F53] px-[23px] font-secondary text-[13px] font-semibold !text-white transition-colors duration-200 hover:bg-[#0075FF]"
              >
                Admission
                <Icon name="arrow" size={16} />
              </Link>

            </div>

            {/* TABLET / MOBILE MENU BUTTON */}

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="rosary-mobile-menu"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-md border border-[#E0E4E6] bg-white !text-[#263F53] transition-colors hover:bg-[#F1F4F6] xl:hidden"
            >
              <Icon
                name={mobileMenuOpen ? "close" : "menu"}
                size={23}
              />
            </button>

          </div>
        </div>
      </div>

      {/* ==================================================
          DESKTOP NAVIGATION
      ================================================== */}

      <nav
        aria-label="Main navigation"
        className="relative z-[40] hidden h-[52px] border-b border-[#E1E4E4] bg-[#F0F2F0] xl:block"
      >
        <div className="mx-auto h-full max-w-[1050px] px-6">

          <ul className="flex h-full items-center justify-between gap-5">

            {navigation.map((item) => {
              const active = isItemActive(item);
              const hasChildren = !!item.children?.length;

              return (
                <li
                  key={item.label}
                  className="group relative flex h-full items-center"
                >

                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex h-full items-center gap-[7px] whitespace-nowrap font-primary text-[15px] font-medium transition-colors duration-200 ${
                      active
                        ? "!text-[#0075FF]"
                        : "!text-[#273D4E] hover:!text-[#0075FF]"
                    }`}
                  >
                    {item.label}

                    {hasChildren && (
                      <span className="transition-transform duration-200 group-hover:rotate-180">
                        <Icon name="chevron" size={15} />
                      </span>
                    )}

                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#0075FF] transition-all duration-200 ${
                        active
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>

                  {/* DESKTOP SUBMENU */}

                  {hasChildren && (
                    <div className="invisible absolute left-0 top-full z-[200] min-w-[200px] translate-y-1 overflow-hidden rounded-b-lg border border-[#E7E8E5] bg-white py-2 opacity-0 shadow-[0_14px_30px_rgba(35,48,59,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">

                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block whitespace-nowrap px-5 py-[11px] font-secondary text-[14px] font-medium transition-colors ${
                            isChildActive(child.href)
                              ? "bg-[#EFF5FA] !text-[#0075FF]"
                              : "!text-[#354C5D] hover:bg-[#F6F7F5] hover:!text-[#0075FF]"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}

                    </div>
                  )}

                </li>
              );
            })}

          </ul>
        </div>
      </nav>

      {/* ==================================================
          MOBILE / TABLET MENU
      ================================================== */}

      <div
        id="rosary-mobile-menu"
        className={`absolute left-0 top-[76px] z-[500] w-full overflow-hidden border-t border-[#E5E7E7] bg-[#FAF9F6] shadow-[0_15px_35px_rgba(35,48,59,0.14)] transition-all duration-300 xl:hidden ${
          mobileMenuOpen
            ? "visible max-h-[calc(100dvh-76px)] opacity-100"
            : "pointer-events-none invisible max-h-0 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100dvh-76px)] overflow-y-auto">

          {/* MOBILE SEARCH */}

          <div className="border-b border-[#E8E8E3] p-4">

            <form
              role="search"
              onSubmit={handleSearch}
              className="flex h-[46px] items-center gap-3 rounded-md border border-[#E3E5E3] bg-white px-4"
            >
              <button
                type="submit"
                aria-label="Search school"
                className="!text-[#0075FF]"
              >
                <Icon name="search" />
              </button>

              <input
                type="search"
                value={search}
                placeholder="Search Rosary school..."
                autoComplete="off"
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent font-secondary text-[14px] !text-[#223B50] outline-none placeholder:!text-[#9AA2A8]"
              />
            </form>

            {search.trim() && (
              <SearchResults
                mobile
                results={searchResults}
                onSelect={selectSearchResult}
              />
            )}

          </div>

          {/* MOBILE NAV LINKS */}

          <div className="px-4 py-2">

            {navigation.map((item) => {
              const active = isItemActive(item);
              const hasChildren = !!item.children?.length;
              const open = openMobileDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="border-b border-[#E8E8E4] last:border-0"
                >

                  <div className="flex min-h-[52px] items-center justify-between">

                    <Link
                      href={item.href}
                      className={`flex min-h-[52px] flex-1 items-center font-primary text-[15px] font-medium ${
                        active
                          ? "!text-[#0075FF]"
                          : "!text-[#263F53]"
                      }`}
                    >
                      {item.label}
                    </Link>

                    {hasChildren && (
                      <button
                        type="button"
                        aria-label={`Toggle ${item.label}`}
                        aria-expanded={open}
                        onClick={() =>
                          setOpenMobileDropdown((current) =>
                            current === item.label ? null : item.label
                          )
                        }
                        className="flex h-[44px] w-[44px] items-center justify-center !text-[#263F53]"
                      >
                        <span
                          className={`transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                        >
                          <Icon name="chevron" size={17} />
                        </span>
                      </button>
                    )}

                  </div>

                  {/* MOBILE SUBMENU */}

                  {hasChildren && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        open ? "max-h-[350px] pb-3" : "max-h-0"
                      }`}
                    >
                      <div className="overflow-hidden rounded-md border-l-[2px] border-[#0075FF] bg-[#F0F3F5]">

                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-3 font-secondary text-[14px] font-medium ${
                              isChildActive(child.href)
                                ? "bg-[#E4EDF5] !text-[#0075FF]"
                                : "!text-[#354C5D]"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}

                      </div>
                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {/* MOBILE ACTIONS */}

          <div className="border-t border-[#E8E8E4] bg-[#F1F2EF] p-4">

            <div className="grid grid-cols-2 gap-3">

              <Link
                href={PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[46px] items-center justify-center gap-2 rounded-md border border-[#DFE3E4] bg-white font-secondary text-[13px] font-semibold !text-[#263F53]"
              >
                <Icon name="portal" size={17} />
                Portal
              </Link>

              <Link
                href={FEES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[46px] items-center justify-center gap-2 rounded-md border border-[#DFE3E4] bg-white font-secondary text-[13px] font-semibold !text-[#263F53]"
              >
                <Icon name="fees" size={17} />
                Fees Payment
              </Link>

            </div>

            <Link
              href="/admissions"
              className="mt-3 flex h-[46px] w-full items-center justify-center gap-2 rounded-md bg-[#263F53] font-secondary text-[14px] font-semibold !text-white transition-colors hover:bg-[#0075FF]"
            >
              Admission
              <Icon name="arrow" size={17} />
            </Link>

          </div>
        </div>
      </div>

    </header>
  );
}
