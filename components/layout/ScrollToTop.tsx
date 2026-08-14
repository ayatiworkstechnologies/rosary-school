"use client";

import { ArrowUp } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useState } from "react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();

  /* =========================================================
     SMOOTH SCROLL PROGRESS
  ========================================================= */

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.25,
  });

  /* =========================================================
     SHOW BUTTON AFTER SCROLL
  ========================================================= */

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 350);
  });

  /* =========================================================
     SCROLL TO TOP
  ========================================================= */

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.8,
          }}
          transition={{
            duration: 0.55,
            ease: smoothEase,
          }}
          className="
            fixed
            bottom-5
            right-4
            z-[999]

            sm:bottom-6
            sm:right-6

            lg:bottom-8
            lg:right-8
          "
        >
          {/* =====================================================
              TOOLTIP
          ====================================================== */}

          <motion.div
            initial="rest"
            whileHover="hover"
            className="group relative"
          >
            <motion.div
              variants={{
                rest: {
                  opacity: 0,
                  x: 8,
                  scale: 0.95,
                },

                hover: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                },
              }}
              transition={{
                duration: 0.3,
                ease: smoothEase,
              }}
              className="
                pointer-events-none

                absolute
                right-[64px]
                top-1/2

                hidden
                -translate-y-1/2

                whitespace-nowrap

                rounded-[8px]

                border
                border-white/70

                bg-white/90

                px-3
                py-2

                font-secondary
                text-[11px]
                font-medium

                text-[#344054]

                shadow-[0_10px_30px_rgba(15,23,42,0.10)]

                backdrop-blur-xl

                sm:block
              "
            >
              Back to top

              {/* tooltip triangle */}

              <span
                className="
                  absolute
                  right-[-4px]
                  top-1/2

                  h-2
                  w-2

                  -translate-y-1/2
                  rotate-45

                  border-r
                  border-t
                  border-white/70

                  bg-white
                "
              />
            </motion.div>

            {/* =====================================================
                GLOW
            ====================================================== */}

            <motion.div
              variants={{
                rest: {
                  opacity: 0.25,
                  scale: 0.9,
                },

                hover: {
                  opacity: 0.65,
                  scale: 1.2,
                },
              }}
              transition={{
                duration: 0.4,
                ease: smoothEase,
              }}
              className="
                pointer-events-none

                absolute
                inset-0

                rounded-full

                bg-[#0075FF]/30

                blur-[18px]
              "
            />

            {/* =====================================================
                MAIN BUTTON
            ====================================================== */}

            <motion.button
              type="button"
              onClick={handleScrollTop}
              aria-label="Back to top"
              whileHover={{
                y: -5,
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.9,
              }}
              transition={{
                duration: 0.3,
                ease: smoothEase,
              }}
              className="
                relative

                flex
                h-[52px]
                w-[52px]

                items-center
                justify-center

                overflow-hidden

                rounded-full

                border
                border-[#0075FF]/15

                bg-white/90

                shadow-[0_10px_35px_rgba(15,23,42,0.12)]

                backdrop-blur-xl

                outline-none

                transition-[box-shadow,border-color]
                duration-300

                hover:border-[#0075FF]/30

                hover:shadow-[0_15px_40px_rgba(0,117,255,0.22)]

                sm:h-[56px]
                sm:w-[56px]

                lg:h-[58px]
                lg:w-[58px]
              "
            >
              {/* =================================================
                  BLUE HOVER FILL
              ================================================= */}

              <motion.span
                variants={{
                  rest: {
                    scale: 0,
                  },

                  hover: {
                    scale: 1,
                  },
                }}
                transition={{
                  duration: 0.45,
                  ease: smoothEase,
                }}
                className="
                  pointer-events-none

                  absolute
                  inset-[5px]

                  rounded-full

                  bg-[#0075FF]
                "
              />

              {/* =================================================
                  SCROLL PROGRESS RING
              ================================================= */}

              <svg
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  h-full
                  w-full

                  -rotate-90
                "
                viewBox="0 0 58 58"
              >
                {/* background ring */}

                <circle
                  cx="29"
                  cy="29"
                  r="26"
                  fill="none"
                  stroke="rgba(0,117,255,0.10)"
                  strokeWidth="1.5"
                />

                {/* progress */}

                <motion.circle
                  cx="29"
                  cy="29"
                  r="26"
                  fill="none"
                  stroke="#0075FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    pathLength: smoothProgress,
                  }}
                />
              </svg>

              {/* =================================================
                  ARROW ANIMATION AREA
              ================================================= */}

              <motion.div
                variants={{
                  rest: {},

                  hover: {},
                }}
                className="
                  relative

                  z-10

                  flex
                  h-[24px]
                  w-[24px]

                  items-center
                  justify-center

                  overflow-hidden
                "
              >
                {/* Primary arrow */}

                <motion.span
                  variants={{
                    rest: {
                      y: 0,
                      color: "#0075FF",
                    },

                    hover: {
                      y: -26,
                      color: "#ffffff",
                    },
                  }}
                  transition={{
                    duration: 0.45,
                    ease: smoothEase,
                  }}
                  className="
                    absolute

                    flex
                    items-center
                    justify-center
                  "
                >
                  <ArrowUp
                    size={20}
                    strokeWidth={1.8}
                  />
                </motion.span>

                {/* Second arrow */}

                <motion.span
                  variants={{
                    rest: {
                      y: 26,
                      color: "#ffffff",
                    },

                    hover: {
                      y: 0,
                      color: "#ffffff",
                    },
                  }}
                  transition={{
                    duration: 0.45,
                    ease: smoothEase,
                  }}
                  className="
                    absolute

                    flex
                    items-center
                    justify-center
                  "
                >
                  <ArrowUp
                    size={20}
                    strokeWidth={1.8}
                  />
                </motion.span>
              </motion.div>

              {/* =================================================
                  SMALL LIGHT REFLECTION
              ================================================= */}

              <span
                className="
                  pointer-events-none

                  absolute

                  left-[12px]
                  top-[8px]

                  h-[7px]
                  w-[15px]

                  -rotate-[25deg]

                  rounded-full

                  bg-white/70

                  blur-[4px]
                "
              />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}