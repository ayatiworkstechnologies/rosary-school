"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowRight,
  X,
} from "lucide-react";


export default function ImagePopup() {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);


  /* =========================================================
     SHOW POPUP AFTER PAGE LOAD

     Small delay makes the entrance feel smoother instead of
     appearing instantly during hydration.
  ========================================================= */

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setIsOpen(true);
        },
        250,
      );


    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, []);


  /* =========================================================
     BODY SCROLL LOCK + ESC CLOSE
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }


    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setIsOpen(false);
      }
    }


    window.addEventListener(
      "keydown",
      handleKeyDown,
    );


    return () => {
      document.body.style.overflow =
        previousOverflow;


      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen]);


  /* =========================================================
     CLOSE
  ========================================================= */

  function closePopup() {
    setIsOpen(false);
  }


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          /* ===============================================
             BACKDROP ANIMATION
          ================================================ */

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          exit={{
            opacity: 0,
          }}

          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}

          onClick={
            closePopup
          }

          className="
            fixed
            inset-0
            z-[99999]

            flex
            items-center
            justify-center

            overflow-y-auto

            bg-black/65

            px-4
            py-6

            backdrop-blur-[6px]

            sm:px-6
            sm:py-8

            md:px-8
          "
        >
          {/* =================================================
              POPUP
          ================================================= */}

          <motion.div
            role="dialog"

            aria-modal="true"

            aria-label="Rosary School Admission"

            /* =============================================
               SLIDE UP FROM BOTTOM
            ============================================== */

            initial={{
              opacity: 0,

              y: 100,

              scale: 0.94,
            }}

            animate={{
              opacity: 1,

              y: 0,

              scale: 1,
            }}

            exit={{
              opacity: 0,

              y: 60,

              scale: 0.96,
            }}

            transition={{
              duration: 0.62,

              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}

            onClick={(
              event,
            ) => {
              event.stopPropagation();
            }}

            className="
              relative

              my-auto

              w-full

              max-w-[550px]
            "
          >
            {/* =================================================
                BLUE GLOW BEHIND CARD
            ================================================= */}

            <div
              className="
                pointer-events-none

                absolute

                left-1/2
                top-1/2

                -z-10

                h-[80%]
                w-[80%]

                -translate-x-1/2
                -translate-y-1/2

                rounded-full

                bg-[#0075FF]/20

                blur-[70px]
              "
            />


            {/* =================================================
                CARD
            ================================================= */}

            <div
              className="
                relative

                overflow-visible

                rounded-[18px]

                bg-white

                p-[4px]

                shadow-[0_32px_100px_rgba(0,0,0,0.45)]

                sm:rounded-[22px]
                sm:p-[5px]
              "
            >
              {/* ===============================================
                  CLOSE BUTTON
              ================================================ */}

              <motion.button
                type="button"

                aria-label="Close admission popup"

                onClick={
                  closePopup
                }

                whileHover={{
                  scale: 1.08,
                  rotate: 5,
                }}

                whileTap={{
                  scale: 0.9,
                }}

                className="
                  absolute

                  right-[-8px]
                  top-[-8px]

                  z-30

                  flex

                  h-[36px]
                  w-[36px]

                  items-center
                  justify-center

                  rounded-full

                  border-[2px]
                  border-white

                  bg-[#0075FF]

                  !text-white

                  shadow-[0_8px_22px_rgba(0,117,255,0.35)]

                  transition-colors
                  duration-300

                  hover:bg-[#0068E5]

                  sm:right-[-13px]
                  sm:top-[-13px]

                  sm:h-[42px]
                  sm:w-[42px]
                "
              >
                <X
                  size={19}
                  strokeWidth={2.2}
                />
              </motion.button>


              {/* ===============================================
                  CLICKABLE ADMISSION IMAGE

                  IMAGE:
                  public/images/admission-popup.png

                  ORIGINAL:
                  550 × 550
              ================================================ */}

              <Link
                href="/admissions"

                aria-label="Go to Rosary School Admissions"

                className="
                  group

                  relative

                  block

                  w-full

                  overflow-hidden

                  rounded-[15px]

                  bg-[#F4F7FA]

                  sm:rounded-[18px]
                "
              >
                <Image
                  src="/images/admission-popup.png"

                  alt="Rosary School Admission"

                  width={550}

                  height={550}

                  loading="eager"

                  className="
                    block

                    aspect-square

                    h-auto
                    w-full

                    object-cover

                    transition-transform

                    duration-[900ms]

                    ease-[cubic-bezier(0.16,1,0.3,1)]

                    group-hover:scale-[1.025]
                  "
                />


                {/* =============================================
                    SUBTLE BOTTOM OVERLAY
                ============================================== */}

                <div
                  className="
                    pointer-events-none

                    absolute
                    inset-0

                    bg-gradient-to-t

                    from-black/25
                    via-black/0
                    to-transparent

                    opacity-60
                  "
                />


                {/* =============================================
                    CTA BUTTON
                ============================================== */}

                {/* <motion.div
                  initial={{
                    opacity: 0,

                    y: 18,
                  }}

                  animate={{
                    opacity: 1,

                    y: 0,
                  }}

                  transition={{
                    delay: 0.48,

                    duration: 0.5,

                    ease: [
                      0.16,
                      1,
                      0.3,
                      1,
                    ],
                  }}

                  className="
                    absolute

                    bottom-[12px]
                    left-1/2

                    z-20

                    -translate-x-1/2

                    sm:bottom-[18px]
                  "
                >
                  <span
                    className="
                      inline-flex

                      h-[38px]

                      items-center
                      justify-center

                      gap-[8px]

                      whitespace-nowrap

                      rounded-full

                      border
                      border-white/20

                      bg-[#0075FF]

                      px-[17px]

                      font-secondary

                      text-[11px]

                      font-semibold

                      !text-white

                      shadow-[0_10px_26px_rgba(0,117,255,0.38)]

                      backdrop-blur-sm

                      transition-all

                      duration-300

                      group-hover:bg-[#0068E5]

                      sm:h-[42px]

                      sm:px-[21px]

                      sm:text-[12px]
                    "
                  >
                    View Admission

                    <ArrowRight
                      size={15}

                      strokeWidth={2}

                      className="
                        transition-transform

                        duration-300

                        group-hover:translate-x-[4px]
                      "
                    />
                  </span>
                </motion.div> */}
              </Link>
            </div>


            {/* =================================================
                BOTTOM SHADOW
            ================================================= */}

            <div
              className="
                pointer-events-none

                absolute

                bottom-[-25px]
                left-1/2

                -z-20

                h-[35px]
                w-[75%]

                -translate-x-1/2

                rounded-full

                bg-black/25

                blur-[25px]
              "
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}