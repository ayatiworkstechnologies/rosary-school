"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.13,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 32,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease,
    },
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -55,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease,
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 55,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease,
    },
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function AboutContent() {
  return (
    <main className="w-full overflow-hidden bg-white">
      {/* =====================================================
          SECTION 01 — ABOUT
      ====================================================== */}

      <section
        className="
          relative
          isolate
          w-full
          overflow-hidden
          bg-[#FBFDFF]
          py-[42px]

          sm:py-[48px]

          lg:py-[56px]

          xl:py-[62px]
        "
      >
        {/* ===================================================
            BACKGROUND
        ==================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            -z-20
            bg-[url('/images/notice-bg.png')]
            bg-cover
            bg-center
            bg-no-repeat
            opacity-[0.52]
          "
        />

        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            grid
            w-full
            max-w-[1450px]
            grid-cols-1
            items-center
            gap-[42px]
            px-[20px]

            sm:px-[30px]

            lg:grid-cols-[352px_minmax(0,1fr)]
            lg:gap-[52px]
            lg:px-[45px]

            xl:gap-[58px]
            xl:px-[55px]
          "
        >
          {/* =================================================
              LEFT IMAGE
          ================================================= */}

          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="
              relative
              mx-auto
              w-full
              max-w-[352px]

              lg:mx-0
            "
          >
            {/* LEFT BLUE LINE */}

            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              whileInView={{
                height: 136,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.3,
                delay: 0.3,
                ease,
              }}
              className="
                absolute
                -left-[23px]
                top-[56px]
                hidden
                w-[2px]
                bg-[#0075FF]

                lg:block
              "
            />

            {/* OFFSET FRAME */}

            <motion.div
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
              }}
              whileInView={{
                opacity: 1,
                x: 18,
                y: 18,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.4,
                delay: 0.3,
                ease,
              }}
              className="
                absolute
                inset-0
                hidden
                rounded-[6px]
                border
                border-[#0075FF]/25

                lg:block
              "
            />

            {/* IMAGE */}

            <div
              className="
                relative
                z-10
                h-[420px]
                w-full
                overflow-hidden
                rounded-[6px]
                bg-[#EEEEEE]
                shadow-[0_28px_65px_rgba(19,48,85,0.14)]

                sm:h-[450px]

                lg:h-[476px]
                lg:w-[352px]
              "
            >
              <motion.div
                initial={{
                  scale: 1.1,
                }}
                whileInView={{
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.8,
                  ease,
                }}
                className="
                  absolute
                  inset-0
                "
              >
                <Image
                  src="/images/about-school.png"
                  alt="Rosary Matriculation Higher Secondary School"
                  fill
                  priority
                  sizes="(max-width: 1023px) 90vw, 352px"
                  className="
                    object-cover
                    object-center
                  "
                />
              </motion.div>

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-[130px]
                  bg-gradient-to-t
                  from-black/20
                  to-transparent
                "
              />
            </div>

            {/* SINCE CARD */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1,
                delay: 0.65,
                ease,
              }}
              className="
                absolute
                -bottom-[20px]
                right-[16px]
                z-20
                rounded-[6px]
                border
                border-white
                bg-white/95
                px-[20px]
                py-[14px]
                shadow-[0_16px_40px_rgba(0,0,0,0.12)]
                backdrop-blur-[12px]

                lg:-right-[25px]
              "
            >
              <span
                className="
                  block
                  font-secondary
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[1.8px]
                  text-[#909090]
                "
              >
                Since
              </span>

              <span
                className="
                  mt-[2px]
                  block
                  font-primary
                  text-[24px]
                  font-semibold
                  leading-none
                  text-[#0075FF]
                "
              >
                1950
              </span>
            </motion.div>
          </motion.div>

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.13,
              margin: "0px 0px -70px 0px",
            }}
            className="
              flex
              min-w-0
              flex-col
              justify-center
            "
          >
            {/* ABOUT US CHIP */}

            <motion.span
              variants={fadeUp}
              className="
                inline-flex
                w-fit
                items-center
                rounded-[3px]
                bg-[#EFF7FF]
                px-[8px]
                py-[4px]
                font-secondary
                text-[10px]
                font-medium
                leading-none
                text-[#0075FF]
                shadow-[0_2px_8px_rgba(0,117,255,0.06)]

                sm:text-[11px]
              "
            >
              About Us
            </motion.span>

            {/* HEADING */}

            <motion.h2
              variants={fadeUp}
              className="
                mt-[18px]
                w-full
                max-w-[980px]
                font-primary
                text-[27px]
                font-semibold
                leading-[1.15]
                tracking-[-0.7px]
                !text-[#111111]

                sm:text-[30px]

                lg:text-[32px]

                xl:text-[34px]
              "
            >
              Rosary Matriculation Higher Secondary School
            </motion.h2>

            {/* TAGLINE */}

            <motion.p
              variants={fadeUp}
              className="
                mt-[15px]
                font-secondary
                text-[13px] pt-2
                font-medium
                leading-[1.55]
                text-[#0075FF]

                sm:text-[14px]

                lg:text-[15px]
              "
            >
              Nurturing Minds. Shaping Character. Inspiring Purpose.
            </motion.p>

            {/* PREMIUM EDITORIAL STORY */}

            <motion.div
              variants={container}
              className="
                relative
                mt-[18px]
                max-w-[980px]
                overflow-hidden
                rounded-[8px]
                border
                border-[#E6EDF5]
                bg-white/75
                shadow-[0_18px_55px_rgba(31,72,120,0.055)]
                backdrop-blur-[6px]
              "
            >
              {/* LEFT ACCENT */}

              <motion.span
                initial={{
                  scaleY: 0,
                  opacity: 0,
                }}
                whileInView={{
                  scaleY: 1,
                  opacity: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.4,
                  delay: 0.45,
                  ease,
                }}
                className="
                  absolute
                  bottom-0
                  left-0
                  top-0
                  w-[3px]
                  origin-top
                  
                "
              />

              {/* STORY 01 */}

              <motion.div
                variants={fadeUp}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  duration: 0.35,
                  ease,
                }}
                className="
                  group
                  relative
                  border-b
                  border-[#EDF1F5]
                  px-[18px]
                  py-[14px]
                  transition-colors
                  duration-500

                  hover:bg-[#F8FBFF]

                  sm:px-[22px]
                  sm:py-[16px]
                "
              >
                <span
                  className="
                    pointer-events-none
                    absolute
                    right-[18px]
                    top-[10px]
                    font-primary
                    text-[42px]
                    font-semibold
                    leading-none
                    text-[#0075FF]/[0.035]
                  "
                >
                  01
                </span>

                <div className="flex items-start gap-[13px]">
                  <span
                    className="
                      mt-[8px]
                      h-[7px]
                      w-[7px]
                      shrink-0
                      rounded-full
                      bg-[#0075FF]
                      shadow-[0_0_0_5px_rgba(0,117,255,0.07)]
                    "
                  />

                  <p
                    className="
                      pr-[18px]
                      font-secondary
                      text-[12.5px]
                      font-normal
                      leading-[1.65]
                      text-[#656565]

                      sm:text-[13px]

                      lg:text-[13.5px]
                    "
                  >
                    The seal of our educational institution represents a ship
                    sailing on stormy water led on by a star. The ship is
                    symbolic of a student&apos;s life guided amidst the tempests
                    by the light of the star of the sea. Sailing on the sea of
                    life, the ship&apos;s anchor which stands for charity,
                    brings it into the harbour of truth. To be born at God&apos;s
                    will, a blessing and to grow in His grace a privilege.
                  </p>
                </div>
              </motion.div>

              {/* STORY 02 */}

              <motion.div
                variants={fadeUp}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  duration: 0.35,
                  ease,
                }}
                className="
                  group
                  relative
                  border-b
                  border-[#EDF1F5]
                  px-[18px]
                  py-[14px]
                  transition-colors
                  duration-500

                  hover:bg-[#F8FBFF]

                  sm:px-[22px]
                  sm:py-[16px]
                "
              >
                <span
                  className="
                    pointer-events-none
                    absolute
                    right-[18px]
                    top-[10px]
                    font-primary
                    text-[42px]
                    font-semibold
                    leading-none
                    text-[#0075FF]/[0.035]
                  "
                >
                  02
                </span>

                <div className="flex items-start gap-[13px]">
                  <span
                    className="
                      mt-[8px]
                      h-[7px]
                      w-[7px]
                      shrink-0
                      rounded-full
                      bg-[#0075FF]
                      shadow-[0_0_0_5px_rgba(0,117,255,0.07)]
                    "
                  />

                  <p
                    className="
                      pr-[18px]
                      font-secondary
                      text-[12.5px]
                      font-normal
                      leading-[1.65]
                      text-[#656565]

                      sm:text-[13px]

                      lg:text-[13.5px]
                    "
                  >
                    19th June 1950 is a significant day in the annals of Rosary
                    Matriculation Girls Higher Secondary School as it saw the
                    birth of this highly esteemed institution in response to the
                    wishes of many parents in Chennai to give their children
                    education through English medium. Rosary Matriculation
                    School is run by the Institute of the Franciscan
                    Missionaries of Mary a society registered under Societies
                    Registration Act.
                  </p>
                </div>
              </motion.div>

              {/* STORY 03 */}

              <motion.div
                variants={fadeUp}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  duration: 0.35,
                  ease,
                }}
                className="
                  group
                  relative
                  px-[18px]
                  py-[14px]
                  transition-colors
                  duration-500

                  hover:bg-[#F8FBFF]

                  sm:px-[22px]
                  sm:py-[16px]
                "
              >
                <span
                  className="
                    pointer-events-none
                    absolute
                    right-[18px]
                    top-[10px]
                    font-primary
                    text-[42px]
                    font-semibold
                    leading-none
                    text-[#0075FF]/[0.035]
                  "
                >
                  03
                </span>

                <div className="flex items-start gap-[13px]">
                  <span
                    className="
                      mt-[8px]
                      h-[7px]
                      w-[7px]
                      shrink-0
                      rounded-full
                      bg-[#0075FF]
                      shadow-[0_0_0_5px_rgba(0,117,255,0.07)]
                    "
                  />

                  <p
                    className="
                      pr-[18px]
                      font-secondary
                      text-[12.5px]
                      font-normal
                      leading-[1.65]
                      text-[#656565]

                      sm:text-[13px]

                      lg:text-[13.5px]
                    "
                  >
                    Having its office at Chennai. An atmosphere of joyous
                    Freedom, conducive to personality development and fulfilment
                    through Self control and self direction, leads to
                    spontaneous involvement of all pupils in the organisation
                    and discipline of the school.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* BOTTOM ACCENT */}

            <motion.div
              initial={{
                width: 0,
                opacity: 0,
              }}
              whileInView={{
                width: 72,
                opacity: 1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1.25,
                delay: 1,
                ease,
              }}
              className="
                mt-[18px]
                h-[2px]
                bg-[#0075FF]
              "
            />
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SECTION 02 — PRINCIPAL
      ====================================================== */}

      <section
        className="
          relative
          isolate
          w-full
          overflow-hidden
          bg-[#F8FBFF]
          px-[20px]
          py-[44px]

          sm:px-[30px]
          sm:py-[50px]

          lg:px-[45px]
          lg:py-[58px]
        "
      >
        {/* SOFT BACKGROUND DETAILS */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            -z-20
            bg-[url('/images/notice-bg.png')]
            bg-cover
            bg-center
            bg-no-repeat
            opacity-[0.16]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-[140px]
            bottom-[-120px]
            -z-10
            h-[360px]
            w-[360px]
            rounded-full
            bg-[#0075FF]/[0.055]
            blur-[95px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-[130px]
            top-[30px]
            -z-10
            h-[320px]
            w-[320px]
            rounded-full
            bg-white
            blur-[80px]
          "
        />

        {/* PRINCIPAL LAYOUT */}

        <motion.div
          initial={{
            opacity: 0,
            y: 55,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.12,
            margin: "0px 0px -70px 0px",
          }}
          transition={{
            duration: 1.25,
            ease,
          }}
          className="
            relative
            mx-auto
            grid
            w-full
            max-w-[1320px]
            grid-cols-1
            items-center
            gap-[38px]
            overflow-hidden
            rounded-[10px]
            border
            border-[#E2EAF3]
            bg-white/90
            px-[25px]
            py-[30px]
            shadow-[0_24px_80px_rgba(28,65,108,0.07)]
            backdrop-blur-[8px]

            sm:px-[40px]
            sm:py-[34px]

            lg:grid-cols-[minmax(0,1fr)_350px]
            lg:gap-[58px]
            lg:px-[60px]
            lg:py-[38px]

            xl:px-[70px]
          "
        >
          {/* BLUE CORNER ACCENT */}

          <motion.div
            initial={{
              width: 0,
            }}
            whileInView={{
              width: 110,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 1.35,
              delay: 0.2,
              ease,
            }}
            className="
              absolute
              left-0
              top-0
              h-[3px]
              bg-[#0075FF]
            "
          />

          {/* LARGE QUOTE WATERMARK */}

          

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="
              relative
              z-10
              min-w-0
            "
          >
            {/* MESSAGE CHIP */}

            <motion.span
              variants={fadeUp}
              className="
                inline-flex
                w-fit
                items-center
                rounded-[3px]
                bg-[#EFF7FF]
                px-[8px]
                
                font-secondary
                text-[10px]
                font-medium
                leading-none
                text-[#0075FF]
                shadow-[0_2px_8px_rgba(0,117,255,0.06)]

                sm:text-[11px]
              "
            >
              Message
            </motion.span>

            {/* HEADING */}

            <motion.h2
              variants={fadeUp}
              className="
                mt-[12px]
                font-primary
                text-[29px]
                font-semibold
                leading-[1.15]
                tracking-[-0.7px]
                !text-[#111111]

                sm:text-[33px]

                lg:text-[36px]
              "
            >
              From The Principal
            </motion.h2>

            {/* TAGLINE */}

            <motion.p
              variants={fadeUp}
              className="
                mt-[10px]
                font-secondary
                text-[13px] pt-2
                font-medium
                leading-[1.55]
                text-[#0075FF]

                sm:text-[14px]
              "
            >
              Nurturing Minds. Shaping Character. Inspiring Purpose.
            </motion.p>

            {/* MESSAGE CARD */}

            <motion.div
              variants={fadeUp}
              className="
                relative
                mt-[17px]
                max-w-[720px]
                overflow-hidden
                rounded-[8px]
                border
                border-[#E6EDF5]
                bg-[#FBFDFF]
                px-[20px]
                py-[17px]

                sm:px-[23px]
                sm:py-[19px]
              "
            >
              <motion.div
                initial={{
                  scaleY: 0,
                }}
                whileInView={{
                  scaleY: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.25,
                  delay: 0.55,
                  ease,
                }}
                className="
                  absolute
                  bottom-[18px]
                  left-0
                  top-[18px]
                  w-[3px]
                  origin-top
                  rounded-full
                  bg-[#0075FF]
                "
              />

              <span
                className="
                  absolute
                  right-[18px]
                  top-[8px]
                  select-none
                  font-primary
                  text-[62px]
                  font-semibold
                  leading-none
                  text-[#0075FF]/[0.07]
                "
              >
                “
              </span>

              <p
                className="
                  relative
                  z-10
                  font-secondary
                  text-[13px]
                  font-normal
                  leading-[1.8]
                  text-[#666666]

                  sm:text-[13.5px]

                  lg:text-[14px]
                "
              >
                At Rosary, education goes beyond academic excellence. We strive
                to nurture young minds with knowledge, strengthen them with
                values, and inspire them to grow into confident and
                compassionate individuals. Guided by truth, love and a spirit
                of service, we encourage every student to discover her
                potential and contribute meaningfully to the world around her.
              </p>
            </motion.div>

            {/* SIGN OFF */}

            <motion.div
              variants={fadeUp}
              className="
                mt-[17px]
                flex
                items-center
                gap-[13px]
              "
            >
              <span
                className="
                  h-[1px]
                  w-[44px]
                  bg-[#0075FF]/30
                "
              />

              <div>
                <p
                  className="
                    font-primary
                    text-[13px]
                    font-semibold
                    !text-[#222222]
                  "
                >
                  Principal
                </p>

                <p
                  className="
                    mt-[2px]
                    font-secondary
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[1.4px]
                    text-[#9A9A9A]
                  "
                >
                  Rosary Matriculation Higher Secondary School
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* =================================================
              RIGHT PRINCIPAL IMAGE — 350 × 400
          ================================================= */}

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="
              relative
              mx-auto
              w-full
              max-w-[350px]

              lg:mx-0
            "
          >
            {/* OFFSET FRAME */}

            <motion.div
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
              }}
              whileInView={{
                opacity: 1,
                x: 14,
                y: 14,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1.4,
                delay: 0.35,
                ease,
              }}
              className="
                absolute
                inset-0
                rounded-[7px]
                border
                border-[#0075FF]/20
                bg-[#F3F8FE]
              "
            />

            <div
              className="
                relative
                z-10
                h-[400px]
                w-full
                max-w-[350px]
                overflow-hidden
                rounded-[7px]
                bg-[#F4F4F4]
                shadow-[0_24px_60px_rgba(24,54,91,0.14)]

                lg:h-[400px]
                lg:w-[350px]
              "
            >
              <motion.div
                initial={{
                  scale: 1.1,
                }}
                whileInView={{
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.9,
                  ease,
                }}
                className="
                  absolute
                  inset-0
                "
              >
                <Image
                  src="/images/principal-1.png"
                  alt="Principal of Rosary Matriculation Higher Secondary School"
                  fill
                  sizes="(max-width: 1023px) 90vw, 350px"
                  className="
                    object-cover
                    object-center
                  "
                />
              </motion.div>

              {/* IMAGE BOTTOM OVERLAY */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-[100px]
                  bg-gradient-to-t
                  from-black/40
                  via-black/10
                  to-transparent
                "
              />

              <motion.div
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.75,
                  ease,
                }}
                className="
                  absolute
                  bottom-[16px]
                  left-[16px]
                  z-20
                "
              >
                <span
                  className="
                    inline-flex
                    rounded-[3px]
                    bg-white/90
                    px-[9px]
                    py-[5px]
                    font-secondary
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[1.2px]
                    text-[#0075FF]
                    backdrop-blur-[8px]
                  "
                >
                  Principal
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

    </main>
  );
}