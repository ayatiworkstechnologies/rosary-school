"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* =========================================================
   SETTINGS
========================================================= */

const STICKY_TOP = 76;

/* =========================================================
   DATA
========================================================= */

const newsItems = [
  {
    id: 1,
    number: "01",
    category: "News",
    outlineText: "News",

    title: "Rosary School Welcomes New Principal and Student Leaders",

    description:
      "Rosary School begins the 2026–27 academic year with new leadership, welcoming Principal Sr. Jasintha Quadras and celebrating the newly elected School Pupil Leaders through a transparent student election process.",

    image: "/images/news-01.png",

    imageAlt: "Rosary School News",

    href: "/news",
  },

  {
    id: 2,
    number: "02",
    category: "Announcement",
    outlineText: "Announcement",

    title: "Rosary School Welcomes New Principal and Student Leaders",

    description:
      "Rosary School begins the 2026–27 academic year with new leadership, welcoming our Principal and celebrating the newly elected School Pupil Leaders.",

    image: "/images/news-02.png",

    imageAlt: "Rosary School Announcement",

    href: "/news",
  },

  {
    id: 3,
    number: "03",
    category: "Announcement",
    outlineText: "Announcement",

    title: "Rosary School Welcomes New Principal and Student Leaders",

    description:
      "Celebrating a new chapter at Rosary with leadership, learning and opportunities that encourage every student to grow with confidence and purpose.",

    image: "/images/news-02.png",

    imageAlt: "Rosary School latest announcement",

    href: "/news",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function NewsAnnouncement() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(
        (card): card is HTMLElement => card !== null
      );

      if (!cards.length) return;

      const mm = gsap.matchMedia();

      /* =====================================================
         DESKTOP
      ====================================================== */

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          cards.forEach((card, index) => {
            const inner = card.querySelector("[data-card-inner]");

            const number = card.querySelector("[data-number]");
            const category = card.querySelector("[data-category]");
            const outline = card.querySelector("[data-outline]");

            const title = card.querySelector("[data-title]");

            const imageWrapper = card.querySelector(
              "[data-image-wrapper]"
            );

            const image = card.querySelector("[data-image]");

            const description = card.querySelector(
              "[data-description]"
            );

            const explore = card.querySelector("[data-explore]");

            const arrow = card.querySelector("[data-arrow]");

            /* =================================================
               ONE-TIME REVEAL
            ================================================= */

            const revealTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: card,

                start: "top 78%",

                /*
                  IMPORTANT:
                  Animation runs only once.
                */
                once: true,
              },
            });

            /* Number */

            revealTimeline.fromTo(
              number,
              {
                autoAlpha: 0,
                x: -35,
              },
              {
                autoAlpha: 1,
                x: 0,

                duration: 0.65,

                ease: "power3.out",
              },
              0
            );

            /* Category */

            revealTimeline.fromTo(
              category,
              {
                autoAlpha: 0,
                x: -22,
              },
              {
                autoAlpha: 1,
                x: 0,

                duration: 0.6,

                ease: "power3.out",
              },
              0.08
            );

            /* Outline word */

            revealTimeline.fromTo(
              outline,
              {
                autoAlpha: 0,
                x: -25,
              },
              {
                autoAlpha: 1,
                x: 0,

                duration: 0.8,

                ease: "power3.out",
              },
              0.16
            );

            /* Title */

            revealTimeline.fromTo(
              title,
              {
                autoAlpha: 0,
                y: 24,
              },
              {
                autoAlpha: 1,
                y: 0,

                duration: 0.65,

                ease: "power3.out",
              },
              0.08
            );

            /* Image reveal */

            revealTimeline.fromTo(
              imageWrapper,
              {
                autoAlpha: 0,

                y: 30,

                clipPath: "inset(0 100% 0 0)",
              },
              {
                autoAlpha: 1,

                y: 0,

                clipPath: "inset(0 0% 0 0)",

                duration: 0.9,

                ease: "power4.out",
              },
              0.18
            );

            /* Image zoom - ONCE */

            revealTimeline.fromTo(
              image,
              {
                scale: 1.08,
              },
              {
                scale: 1,

                duration: 1.15,

                ease: "power3.out",
              },
              0.18
            );

            /* Description */

            revealTimeline.fromTo(
              description,
              {
                autoAlpha: 0,
                y: 18,
              },
              {
                autoAlpha: 1,
                y: 0,

                duration: 0.6,

                ease: "power3.out",
              },
              0.34
            );

            /* Explore */

            revealTimeline.fromTo(
              explore,
              {
                autoAlpha: 0,
                y: 14,
              },
              {
                autoAlpha: 1,
                y: 0,

                duration: 0.55,

                ease: "power3.out",
              },
              0.42
            );

            /* Right arrow */

            revealTimeline.fromTo(
              arrow,
              {
                autoAlpha: 0,
                x: -12,
              },
              {
                autoAlpha: 1,
                x: 0,

                duration: 0.55,

                ease: "power3.out",
              },
              0.24
            );

            /* =================================================
               STACK EFFECT

               This remains scroll-driven because this is the
               actual stacking interaction, not the reveal
               animation.
            ================================================= */

            if (
              index < cards.length - 1 &&
              inner
            ) {
              const nextCard = cards[index + 1];

              gsap.to(inner, {
                y: -22,

                scale: 0.99,

                opacity: 0,

                ease: "none",

                transformOrigin: "center top",

                scrollTrigger: {
                  trigger: nextCard,

                  start: "top 92%",

                  end: `top ${STICKY_TOP + 130}px`,

                  scrub: 0.8,
                },
              });
            }
          });
        }
      );

      /* =====================================================
         MOBILE + TABLET

         Simple one-time reveal.
         No sticky stacking.
      ====================================================== */

      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          cards.forEach((card) => {
            const elements = card.querySelectorAll(
              "[data-mobile-reveal]"
            );

            gsap.fromTo(
              elements,
              {
                autoAlpha: 0,
                y: 24,
              },
              {
                autoAlpha: 1,

                y: 0,

                duration: 0.65,

                stagger: 0.08,

                ease: "power3.out",

                scrollTrigger: {
                  trigger: card,

                  start: "top 88%",

                  /*
                    ONE TIME ONLY
                  */
                  once: true,
                },
              }
            );
          });
        }
      );

      /* =====================================================
         REDUCED MOTION
      ====================================================== */

      mm.add(
        "(prefers-reduced-motion: reduce)",
        () => {
          cards.forEach((card) => {
            gsap.set(card, {
              clearProps:
                "transform,opacity,visibility",
            });

            gsap.set(
              card.querySelectorAll("*"),
              {
                clearProps:
                  "transform,opacity,visibility,clipPath",
              }
            );
          });
        }
      );

      return () => {
        mm.revert();
      };
    },

    {
      scope: sectionRef,
    }
  );

  return (
    <section
      ref={sectionRef}
      className="
        relative
        isolate
        overflow-visible
        bg-[#fff]
      "
    >
      {newsItems.map((item, index) => {
        const isLongOutline =
          item.outlineText.length > 8;

        return (
          <article
            key={item.id}

            ref={(element) => {
              cardRefs.current[index] =
                element;
            }}

            /*
              Same sticky position for EVERY card.

              Prevents:
              01 + 02 + 03 collision.
            */

            style={{
              top: `${STICKY_TOP}px`,
              zIndex: 20 + index,
            }}

            className="
              relative
              w-full
              border-b
              border-black/[0.05]
              bg-white

              lg:sticky
              lg:min-h-[640px]

              xl:min-h-[680px]
            "
          >
            {/* =================================================
                INNER
            ================================================== */}

            <div
              data-card-inner
              className="
                relative
                mx-auto
                grid
                w-full
                max-w-[1400px]
                grid-cols-1
                gap-8
                px-5
                py-12

                sm:px-7
                sm:py-14

                md:px-10

                lg:min-h-[640px]
                lg:grid-cols-[250px_minmax(0,680px)_70px]
                lg:gap-14
                lg:px-10
                lg:py-14

                xl:min-h-[680px]
                xl:grid-cols-[280px_700px_80px]
                xl:gap-[70px]
              "
            >
              {/* =================================================
                  LEFT COLUMN
              ================================================== */}

              <aside
                data-mobile-reveal
                className="
                  relative
                  flex
                  items-start
                  justify-between

                  lg:block
                  lg:min-h-[510px]
                "
              >
                {/* Number + category */}

                <div>
                  <span
                    data-number
                    className="
                      block
                      font-primary
                      text-[54px]
                      font-semibold
                      leading-[0.9]
                      tracking-[-0.06em]
                      text-[#111111]

                      sm:text-[64px]

                      lg:text-[78px]

                      xl:text-[86px]
                    "
                  >
                    {item.number}
                  </span>

                  <div
                    data-category
                    className="
                      mt-5
                      flex
                      items-center
                      gap-[10px]

                      lg:mt-6
                    "
                  >
                    <span
                      className="
                        block
                        h-[2px]
                        w-[20px]
                        shrink-0
                        bg-primary
                      "
                    />

                    <span
                      className="
                        font-primary
                        text-[14px]
                        font-semibold
                        leading-none
                        text-primary

                        sm:text-[15px]

                        lg:text-[16px]
                      "
                    >
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    BLUE OUTLINE WORD
                ================================================== */}

                <div
                  data-outline
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    bottom-[50px]
                    left-0
                    hidden

                    lg:block
                  "
                >
                  <span
                    className={`
                      block
                      select-none
                      whitespace-nowrap
                      font-primary
                      font-normal
                      leading-none
                      text-transparent

                      ${
                        isLongOutline
                          ? "text-[30px] xl:text-[34px]"
                          : "text-[46px] xl:text-[52px]"
                      }
                    `}
                    style={{
                      WebkitTextStroke:
                        "1px rgba(0,117,255,0.30)",
                    }}
                  >
                    {item.outlineText}
                  </span>

                  <span
                    className="
                      mt-4
                      block
                      h-px
                      w-[36px]
                      bg-primary/40
                    "
                  />
                </div>

                {/* Mobile arrow */}

                <Link
                  href={item.href}
                  aria-label={`Read ${item.title}`}
                  className="
                    group
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center

                    lg:hidden
                  "
                >
                  <span
                    className="
                      transition-transform
                      duration-300

                      group-hover:translate-x-1.5
                    "
                  >
                    <ArrowIcon />
                  </span>
                </Link>
              </aside>

              {/* =================================================
                  CONTENT
              ================================================== */}

              <div
                className="
                  min-w-0
                  w-full
                "
              >
                {/* Title */}

                <h3
                  data-title
                  data-mobile-reveal
                  className="
                    max-w-[650px]
                    font-primary
                    text-[18px]
                    font-semibold
                    leading-[1.2]
                    tracking-[-0.02em]
                    text-[#111111]

                    sm:text-[20px]

                    lg:text-[19px]

                    xl:text-[21px]
                  "
                >
                  {item.title}
                </h3>

                {/* =================================================
                    IMAGE
                ================================================== */}

                <div
                  data-image-wrapper
                  data-mobile-reveal
                  className="
                    relative
                    mt-5
                    aspect-[2/1]
                    w-full
                    overflow-hidden
                    bg-[#fff]

                    sm:mt-6
                  "
                >
                  <div
                    data-image
                    className="
                      relative
                      h-full
                      w-full
                    "
                  >
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1023px) 90vw,
                        700px
                      "
                      className="
                        object-contain
                      "
                      onLoad={() => {
                        ScrollTrigger.refresh();
                      }}
                    />
                  </div>
                </div>

                {/* Description */}

                <p
                  data-description
                  data-mobile-reveal
                  className="
                    mt-5
                    max-w-[670px]
                    font-secondary
                    text-[13px]
                    font-normal
                    leading-[1.55]
                    text-[#898989]

                    sm:text-[14px]
                  "
                >
                  {item.description}
                </p>

                {/* =================================================
                    EXPLORE
                ================================================== */}

                <div
                  data-explore
                  data-mobile-reveal
                  className="
                    mt-7

                    sm:mt-8
                  "
                >
                  <Link
                    href={item.href}
                    className="
                      group
                      inline-flex
                      min-w-[175px]
                      items-center
                      justify-between
                      gap-8
                      border-b
                      border-primary
                      pb-[10px]
                      font-primary
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.02em]
                      text-[#111827]

                      sm:min-w-[185px]
                      sm:text-[12px]
                    "
                  >
                    <span>
                      Explore More
                    </span>

                    <span
                      className="
                        text-primary
                        transition-transform
                        duration-300
                        ease-out

                        group-hover:translate-x-2
                      "
                    >
                      <ArrowIcon blue />
                    </span>
                  </Link>
                </div>
              </div>

              {/* =================================================
                  DESKTOP ARROW
              ================================================== */}

              <div
                data-arrow
                className="
                  hidden
                  justify-end
                  pt-1

                  lg:flex
                "
              >
                <Link
                  href={item.href}
                  aria-label={`Read ${item.title}`}
                  className="
                    group
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                  "
                >
                  <span
                    className="
                      transition-transform
                      duration-300

                      group-hover:translate-x-2
                    "
                  >
                    <ArrowIcon />
                  </span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

/* =========================================================
   ARROW
========================================================= */

function ArrowIcon({
  blue = false,
}: {
  blue?: boolean;
}) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={
        blue
          ? "text-primary"
          : "text-[#111111]"
      }
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M14 7L19 12L14 17"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}