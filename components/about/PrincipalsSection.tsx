"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Principal = {
  id: number;
  name: string;
  years: string;
  image?: string;
};

/* =========================================================
   DATA

   If image is:
   1. not provided, OR
   2. path is wrong / image fails to load,

   the card automatically becomes the gold fallback card.
========================================================= */

const principals: Principal[] = [
  {
    id: 1,
    name: "Dr. Sr. Jasintha Quadras (FMM)",
    years: "2026 - Present",
    image: "/images/principals/principal-01.png",
  },
  {
    id: 2,
    name: "Sr. Vensi Sahayarani (FMM)",
    years: "2022 - 2026",
    image: "/images/principals/principal-02.png",
  },
  {
    id: 3,
    name: "Sr. Mary Zacharia (FMM)",
    years: "2002-2009, 2011-2022",
    image: "/images/principals/principal-03.png",
  },
  {
    id: 4,
    name: "Sr. Sriyapushpam (FMM)",
    years: "2009-2011",
    image: "/images/principals/principal-04.png",
  },
  {
    id: 5,
    name: "Sr. Leena D'Souza (FMM)",
    years: "1989-1995, 1997-2002",
    image: "/images/principals/principal-05.png",
  },
  {
    id: 6,
    name: "Sr. Fatima Anthonimuthu (FMM)",
    years: "1995-1997",
    image: "/images/principals/principal-06.png",
  },
  {
    id: 7,
    name: "Sr. Teresita Polycarpus (FMM)",
    years: "1983-1989",
    image: "/images/principals/principal-07.png",
  },

  /* NO IMAGE -> GOLD FALLBACK */
  {
    id: 8,
    name: "Sr. Edwin",
    years: "1981-1983",
  },

  {
    id: 9,
    name: "Ms. Lilly Muthayya",
    years: "1978-1981",
    image: "/images/principals/principal-09.png",
  },
  {
    id: 10,
    name: "Sr. Celine Xavier (FMM)",
    years: "1972-1978",
    image: "/images/principals/principal-10.png",
  },
  {
    id: 11,
    name: "Mother John Houghton (FMM)",
    years: "1971-1972",
    image: "/images/principals/principal-11.png",
  },
  {
    id: 12,
    name: "Mother Teresa Xavier (FMM)",
    years: "1956-1971",
    image: "/images/principals/principal-12.png",
  },

  /* NO IMAGE -> GOLD FALLBACK */
  {
    id: 13,
    name: "Sr. Breeda (FMM)",
    years: "1955-1956",
  },

  {
    id: 14,
    name: "Sr. Anne Marie Dayle (FMM)",
    years: "1950-1955",
    image: "/images/principals/principal-14.png",
  },
];

/* =========================================================
   GOLD FALLBACK
========================================================= */

function GoldFallback({ name }: { name: string }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #FFB411 0%, #F5A900 55%, #DE9900 76%, #795200 100%)",
        }}
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[40%]
          h-[250px]
          w-[250px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#FFE49A]/25
          blur-[60px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[40%]
          h-[180px]
          w-[180px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-white/[0.13]

          sm:h-[200px]
          sm:w-[200px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[40%]
          h-[135px]
          w-[135px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-white/[0.06]
        "
      />

      <div
        data-placeholder-pill
        className="
          absolute
          left-1/2
          top-[40%]
          z-10
          max-w-[82%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-[14px]
          bg-white
          px-[15px]
          py-[11px]
          text-center
          font-primary
          text-[13px]
          font-semibold
          leading-[1.25]
          text-[#E49A00]
          shadow-[0_15px_38px_rgba(90,57,0,0.16)]

          sm:text-[14px]

          lg:px-[18px]
          lg:py-[12px]
          lg:text-[15px]
        "
      >
        {name}
      </div>
    </>
  );
}

/* =========================================================
   PRINCIPAL CARD
========================================================= */

function PrincipalCard({
  principal,
  index,
  desktop = false,
}: {
  principal: Principal;
  index: number;
  desktop?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = Boolean(principal.image) && !imageFailed;

  return (
    <article
      {...(desktop
        ? {
            "data-principal-desktop-card": "",
            "data-card-index": index,
          }
        : {})}
      className="
        principal-card
        group
        relative
        mx-auto
        w-full
        max-w-[420px]
        will-change-transform

        lg:h-[450px]
        lg:w-[420px]
        lg:max-w-none
      "
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      <div
        className="
          relative
          aspect-[420/450]
          h-auto
          w-full
          overflow-hidden
          rounded-[6px]
          bg-[#E9A817]
          shadow-[0_18px_45px_rgba(25,35,48,0.10)]

          transition-shadow
          duration-700

          group-hover:shadow-[0_30px_75px_rgba(25,35,48,0.18)]

          lg:h-[450px]
          lg:w-[420px]
        "
      >
        {/* IMAGE / AUTO FALLBACK */}

        {showImage ? (
          <>
            <div
              data-card-media
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={principal.image!}
                alt={principal.name}
                width={420}
                height={450}
                loading="lazy"
                onError={() => setImageFailed(true)}
                className="
                  h-full
                  w-full
                  object-cover
                  object-center

                  transition-transform
                  duration-[1200ms]
                  ease-out

                  group-hover:scale-[1.045]
                "
              />
            </div>

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/75
                via-black/[0.10]
                via-[55%]
                to-transparent
                to-[75%]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[#E0AA3E]/[0.02]
              "
            />
          </>
        ) : (
          <GoldFallback name={principal.name} />
        )}

        {/* BOTTOM INFO */}

        <div
          data-card-details
          className="
            absolute
            bottom-0
            left-0
            right-0
            z-20
            px-[14px]
            pb-[14px]

            sm:px-[16px]
            sm:pb-[16px]
          "
        >
          <p
            className="
              font-primary
              text-[11px]
              font-semibold
              leading-[1.35]
              !text-white
              drop-shadow-[0_2px_6px_rgba(0,0,0,0.50)]

              sm:text-[12px]

              lg:text-[13px]
            "
          >
            {principal.name}
          </p>

          <p
            className="
              mt-[8px]
              font-secondary
              text-[10px]
              font-normal
              !text-white/90

              sm:text-[11px]
            "
          >
            {principal.years}
          </p>
        </div>

        {/* HOVER SHINE */}

        <div
          className="
            pointer-events-none
            absolute
            -left-[120%]
            top-[-20%]
            z-30
            h-[140%]
            w-[60%]
            rotate-[17deg]

            bg-gradient-to-r
            from-transparent
            via-white/[0.13]
            to-transparent

            transition-all
            duration-[1400ms]

            group-hover:left-[145%]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-30
            rounded-[6px]
            border
            border-transparent

            transition-colors
            duration-500

            group-hover:border-[#0075FF]/25
          "
        />
      </div>
    </article>
  );
}

/* =========================================================
   MOBILE + TABLET CAROUSEL
========================================================= */

function PrincipalsCarousel() {
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [paused, setPaused] = useState(false);

  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);

  /* ---------------------------------------------------------
     RESPONSIVE:
     mobile < 640px = 1 slide
     tablet 640px - 1023px = 2 slides
  --------------------------------------------------------- */

  useEffect(() => {
    const update = () => {
      setSlidesPerView(window.innerWidth >= 640 ? 2 : 1);
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  const maxIndex = Math.max(
    0,
    principals.length - slidesPerView
  );

  useEffect(() => {
    if (current > maxIndex) {
      setCurrent(maxIndex);
    }
  }, [current, maxIndex]);

  /* ---------------------------------------------------------
     AUTO SLIDE
  --------------------------------------------------------- */

  useEffect(() => {
    if (paused || maxIndex <= 0) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) =>
        prev >= maxIndex ? 0 : prev + 1
      );
    }, 3800);

    return () => window.clearInterval(timer);
  }, [paused, maxIndex]);

  const next = () => {
    setCurrent((prev) =>
      prev >= maxIndex ? 0 : prev + 1
    );
  };

  const previous = () => {
    setCurrent((prev) =>
      prev <= 0 ? maxIndex : prev - 1
    );
  };

  /* ---------------------------------------------------------
     TOUCH / SWIPE
  --------------------------------------------------------- */

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    startX.current = event.touches[0].clientX;
    currentX.current = event.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    currentX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      startX.current !== null &&
      currentX.current !== null
    ) {
      const distance =
        startX.current - currentX.current;

      if (Math.abs(distance) > 45) {
        if (distance > 0) {
          next();
        } else {
          previous();
        }
      }
    }

    startX.current = null;
    currentX.current = null;

    window.setTimeout(() => {
      setPaused(false);
    }, 800);
  };

  /* ---------------------------------------------------------
     Number of carousel pages
  --------------------------------------------------------- */

  const pages = useMemo(
    () =>
      Array.from({
        length: maxIndex + 1,
      }),
    [maxIndex]
  );

  return (
    <div
      className="
        relative
        mt-[30px]
        w-full
        overflow-hidden

        lg:hidden
      "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* VIEWPORT */}

      <div
        className="
          overflow-hidden
          px-[2px]
          pb-[12px]

          [perspective:1200px]
        "
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* TRACK */}

        <div
          className="
            flex
            items-stretch
            transition-transform
            duration-[950ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]
          "
          style={{
            transform: `translate3d(-${
              current * (100 / slidesPerView)
            }%, 0, 0)`,
          }}
        >
          {principals.map((principal, index) => {
            const visibleStart = current;
            const visibleEnd =
              current + slidesPerView - 1;

            const active =
              index >= visibleStart &&
              index <= visibleEnd;

            return (
              <div
                key={principal.id}
                className="
                  shrink-0
                  px-[6px]

                  sm:px-[8px]
                "
                style={{
                  width: `${
                    100 / slidesPerView
                  }%`,
                }}
              >
                <div
                  className="
                    transition-all
                    duration-[950ms]
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                  "
                  style={{
                    transform: active
                      ? "perspective(1200px) rotateY(0deg) scale(1)"
                      : "perspective(1200px) rotateY(7deg) scale(0.94)",
                    opacity: active ? 1 : 0.58,
                  }}
                >
                  <PrincipalCard
                    principal={principal}
                    index={index}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTROLS */}

      <div
        className="
          mt-[18px]
          flex
          items-center
          justify-between
          gap-[15px]

          sm:mt-[20px]
        "
      >
        {/* DOTS */}

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-[6px]
            overflow-x-auto
            py-[4px]

            [scrollbar-width:none]

            [&::-webkit-scrollbar]:hidden
          "
        >
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to principal slide ${
                index + 1
              }`}
              onClick={() => setCurrent(index)}
              className={`
                h-[5px]
                shrink-0
                rounded-full
                transition-all
                duration-500

                ${
                  current === index
                    ? "w-[24px] bg-[#0075FF]"
                    : "w-[5px] bg-[#D8DDE5]"
                }
              `}
            />
          ))}
        </div>

        {/* ARROWS */}

        <div className="flex shrink-0 items-center gap-[8px]">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous principals"
            className="
              flex
              h-[38px]
              w-[38px]
              items-center
              justify-center
              rounded-full
              border
              border-[#DDE5EE]
              bg-white
              text-[#171717]
              shadow-[0_8px_22px_rgba(24,48,76,0.08)]
              transition-all
              duration-300

              hover:border-[#0075FF]
              hover:text-[#0075FF]

              sm:h-[42px]
              sm:w-[42px]
            "
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next principals"
            className="
              flex
              h-[38px]
              w-[38px]
              items-center
              justify-center
              rounded-full
              bg-[#0075FF]
              text-white
              shadow-[0_9px_24px_rgba(0,117,255,0.20)]
              transition-all
              duration-300

              hover:scale-[1.04]

              sm:h-[42px]
              sm:w-[42px]
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN SECTION
========================================================= */

export default function PrincipalsSection() {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* =====================================================
         HEADER REVEAL
      ====================================================== */

      gsap.fromTo(
        "[data-principals-header]",
        {
          autoAlpha: 0,
          y: 40,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-principals-header]",
            start: "top 88%",
            once: true,
          },
        }
      );

      /* =====================================================
         DESKTOP ONLY
         3 CARDS PER ROW — GSAP 3D SHUFFLE
      ====================================================== */

      const desktopCards =
        gsap.utils.toArray<HTMLElement>(
          "[data-principal-desktop-card]"
        );

      for (
        let i = 0;
        i < desktopCards.length;
        i += 3
      ) {
        const row = desktopCards.slice(
          i,
          i + 3
        );

        if (!row.length) continue;

        const trigger = row[0];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: "top 94%",
            end: "top 48%",
            scrub: 1.15,
          },
        });

        /* LEFT */

        if (row[0]) {
          tl.fromTo(
            row[0],
            {
              autoAlpha: 0.12,
              x: -125,
              y: 105,
              z: -230,
              rotateY: 46,
              rotateX: 10,
              scale: 0.83,
              transformOrigin:
                "right center",
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              z: 0,
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              duration: 1,
              ease: "power2.out",
            },
            0
          );
        }

        /* CENTER */

        if (row[1]) {
          tl.fromTo(
            row[1],
            {
              autoAlpha: 0.12,
              y: 150,
              z: -330,
              rotateX: -40,
              scale: 0.77,
              transformOrigin:
                "center bottom",
            },
            {
              autoAlpha: 1,
              y: 0,
              z: 0,
              rotateX: 0,
              scale: 1,
              duration: 1,
              ease: "power2.out",
            },
            0.08
          );
        }

        /* RIGHT */

        if (row[2]) {
          tl.fromTo(
            row[2],
            {
              autoAlpha: 0.12,
              x: 125,
              y: 105,
              z: -230,
              rotateY: -46,
              rotateX: 10,
              scale: 0.83,
              transformOrigin:
                "left center",
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              z: 0,
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              duration: 1,
              ease: "power2.out",
            },
            0.16
          );
        }

        row.forEach(
          (card, cardIndex) => {
            const media =
              card.querySelector(
                "[data-card-media]"
              );

            const pill =
              card.querySelector(
                "[data-placeholder-pill]"
              );

            const details =
              card.querySelector(
                "[data-card-details]"
              );

            if (media) {
              tl.fromTo(
                media,
                {
                  scale: 1.15,
                  yPercent: 6,
                },
                {
                  scale: 1,
                  yPercent: 0,
                  duration: 0.85,
                  ease: "power2.out",
                },
                0.16 +
                  cardIndex * 0.05
              );
            }

            if (pill) {
              tl.fromTo(
                pill,
                {
                  autoAlpha: 0.12,
                  scale: 0.56,
                  rotateX: 50,
                  z: -70,
                },
                {
                  autoAlpha: 1,
                  scale: 1,
                  rotateX: 0,
                  z: 0,
                  duration: 0.82,
                  ease: "power3.out",
                },
                0.19 +
                  cardIndex * 0.05
              );
            }

            if (details) {
              tl.fromTo(
                details,
                {
                  autoAlpha: 0,
                  y: 28,
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.72,
                  ease: "power2.out",
                },
                0.25 +
                  cardIndex * 0.05
              );
            }
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-white
      "
    >
      {/* BACKGROUND GLOWS */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[160px]
          top-[100px]
          h-[460px]
          w-[460px]
          rounded-full
          bg-[#0075FF]/[0.025]
          blur-[125px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-[160px]
          top-[45%]
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#E0AA3E]/[0.04]
          blur-[120px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1400px]

          px-[18px]
          py-[46px]

          sm:px-[26px]
          sm:py-[56px]

          lg:px-[46px]
          lg:py-[74px]
        "
      >
        {/* HEADER */}

        <div data-principals-header>
          <span
            className="
              inline-flex
              rounded-[3px]
              bg-[#F1F7FF]
              px-[8px]
              py-[4px]
              font-secondary
              text-[10px]
              font-medium
              leading-none
              text-[#0075FF]

              sm:text-[11px]
            "
          >
            Leadership Through The Years
          </span>

          <div
            className="
              mt-[12px]
              flex
              flex-col
              gap-[12px]

              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            <div>
              <h2
                className="
                  font-primary
                  text-[27px]
                  font-semibold
                  leading-[1.15]
                  tracking-[-0.7px]
                  !text-[#111111]

                  sm:text-[32px]

                  lg:text-[36px]
                "
              >
                Our Principals
              </h2>

              <p
                className="
                  mt-[8px]
                  max-w-[590px]
                  font-secondary
                  text-[12.5px]
                  leading-[1.6]
                  text-[#707070]

                  sm:text-[13px]

                  lg:text-[14px]
                "
              >
                Honouring the dedicated leaders who have guided Rosary
                through generations of learning, service and growth.
              </p>
            </div>

            <div
              className="
                hidden
                items-center
                gap-[11px]

                md:flex
              "
            >
              {/* <span className="h-px w-[42px] bg-[#0075FF]/30" /> */}

              <span
                className="
                  font-secondary
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[1.5px]
                  text-[#929292]
                "
              >
                {principals.length} Leaders
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            MOBILE + TABLET CAROUSEL
        ================================================= */}

        <PrincipalsCarousel />

        {/* =================================================
            DESKTOP GSAP GRID
            exact 420 × 450
        ================================================= */}

        <div
          className="
            mt-[40px]
            hidden
            grid-cols-3
            justify-items-center
            gap-x-[22px]
            gap-y-[26px]

            [perspective:1500px]

            lg:grid
          "
        >
          {principals.map(
            (principal, index) => (
              <PrincipalCard
                key={principal.id}
                principal={principal}
                index={index}
                desktop
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}