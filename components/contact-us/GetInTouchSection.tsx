"use client";

import { motion } from "framer-motion";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.75,
      ease,
    },
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -36,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.85,
      ease,
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 36,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.85,
      ease,
    },
  },
};

const statReveal = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.96,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.65,
      ease,
    },
  },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GetInTouchSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
  };

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white

        py-[24px]

        sm:py-[30px]

        lg:py-[34px]
      "
    >
      {/* =====================================================
          MAIN WIDTH
      ====================================================== */}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.12,
        }}
        className="
          mx-auto

          w-full
          max-w-[1380px]

          px-[14px]

          sm:px-[24px]

          md:px-[30px]

          xl:px-[20px]
        "
      >
        {/* ===================================================
            MAIN CARD
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.985,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.85,
            ease,
          }}
          className="
            relative

            overflow-hidden

            rounded-[22px]

            bg-white

            shadow-[0_20px_60px_rgba(20,35,55,0.09)]

            sm:rounded-[24px]
          "
        >
          <div
            className="
              grid
              grid-cols-1

              lg:grid-cols-[minmax(0,1.5fr)_500px]

              xl:grid-cols-[minmax(0,1.58fr)_515px]
            "
          >
            {/* =================================================
                LEFT IMAGE SECTION
            ================================================= */}

            <motion.div
              variants={fadeLeft}
              className="
                group

                relative

                min-h-[430px]

                overflow-hidden

                sm:min-h-[470px]

                md:min-h-[510px]

                lg:min-h-[540px]

                xl:min-h-[550px]
              "
            >
              {/* ===============================================
                  BACKGROUND IMAGE
              ================================================ */}

              <motion.div
                initial={{
                  scale: 1.06,
                }}
                whileInView={{
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.6,
                  ease,
                }}
                className="
                  absolute
                  inset-0

                  bg-cover
                  bg-center
                  bg-no-repeat

                  transition-transform
                  duration-[1500ms]

                  group-hover:scale-[1.02]
                "
                style={{
                  backgroundImage:
                    "url('/images/get-in-touch-bg.png')",
                }}
              />

              {/* ===============================================
                  DARK OVERLAY
              ================================================ */}

              <div
                className="
                  pointer-events-none

                  absolute
                  inset-0

                  bg-[linear-gradient(90deg,rgba(4,10,18,0.75)_0%,rgba(5,12,20,0.48)_42%,rgba(5,12,20,0.14)_78%,rgba(5,12,20,0.06)_100%)]
                "
              />

              {/* ===============================================
                  BOTTOM DARKNESS
              ================================================ */}

              <div
                className="
                  pointer-events-none

                  absolute

                  inset-x-0
                  bottom-0

                  h-[58%]

                  bg-[linear-gradient(180deg,rgba(3,8,15,0)_0%,rgba(3,8,15,0.44)_45%,rgba(3,8,15,0.90)_100%)]
                "
              />

              {/* ===============================================
                  CONTENT
              ================================================ */}

              <div
                className="
                  absolute
                  inset-0

                  z-10

                  flex
                  flex-col
                  justify-end

                  p-[22px]

                  sm:p-[30px]

                  md:p-[36px]

                  lg:p-[38px]

                  xl:p-[42px]
                "
              >
                {/* TITLE */}

                <motion.div
                  variants={fadeUp}
                  className="
                    max-w-[720px]
                  "
                >
                  <motion.h2
                    initial={{
                      opacity: 0,
                      y: 22,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.75,
                      delay: 0.1,
                      ease,
                    }}
                    className="
                      font-primary

                      text-[36px]
                      font-semibold

                      leading-[1.02]

                      tracking-[-1px]

                      !text-white

                      drop-shadow-[0_3px_14px_rgba(0,0,0,0.35)]

                      sm:text-[42px]

                      md:text-[46px]

                      lg:text-[46px]

                      xl:text-[48px] pb-3
                    "
                    style={{
                      color: "#ffffff",
                    }}
                  >
                    Get In Touch
                  </motion.h2>

                  {/* DESCRIPTION */}

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.75,
                      delay: 0.16,
                      ease,
                    }}
                    className="
                      mt-[12px]

                      max-w-[700px]

                      font-secondary

                      text-[14px]

                      leading-[1.65]

                      !text-white

                      drop-shadow-[0_2px_10px_rgba(0,0,0,0.28)]

                      sm:text-[15px]

                      md:text-[16px]

                      lg:text-[16px]
                    "
                    style={{
                      color: "#ffffff",
                    }}
                  >
                    We&apos;d love to hear from you! Whether you
                    have questions about admissions, academics,
                    or school events, our team is here to help.
                  </motion.p>
                </motion.div>

                {/* =============================================
                    STATS
                ============================================== */}

                <motion.div
                  variants={fadeUp}
                  className="
                    mt-[24px]

                    sm:mt-[28px]

                    lg:mt-[30px]
                  "
                >
                  {/* DIVIDER */}

                  <motion.div
                    initial={{
                      scaleX: 0,
                    }}
                    whileInView={{
                      scaleX: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.85,
                      delay: 0.25,
                      ease,
                    }}
                    className="
                      h-px
                      w-full

                      origin-left

                      bg-white/35
                    "
                  />

                  {/* STATS */}

                  <div
                    className="
                      mt-[16px]

                      grid

                      max-w-[600px]

                      grid-cols-2

                      gap-[16px]

                      sm:gap-[26px]
                    "
                  >
                    {/* 60+ */}

                    <motion.div
                      variants={statReveal}
                      className="
                        relative

                        pr-[14px]

                        sm:pr-[26px]
                      "
                    >
                      <div
                        className="
                          pointer-events-none

                          absolute

                          right-0
                          top-0

                          h-full

                          w-px

                          bg-white/30
                        "
                      />

                      <h3
                        className="
                          font-primary

                          text-[30px]
                          font-bold

                          leading-none

                          !text-white

                          sm:text-[34px]

                          lg:text-[36px]
                        "
                        style={{
                          color: "#ffffff",
                        }}
                      >
                        60+
                      </h3>

                      <p
                        className="
                          mt-[6px]

                          font-secondary

                          text-[11px]

                          leading-[1.4]

                          sm:text-[12px]

                          lg:text-[13px]
                        "
                        style={{
                          color:
                            "rgba(255,255,255,0.88)",
                        }}
                      >
                        Years of academic excellence
                      </p>
                    </motion.div>

                    {/* 5000+ */}

                    <motion.div
                      variants={statReveal}
                    >
                      <h3
                        className="
                          font-primary

                          text-[30px]
                          font-bold

                          leading-none

                          !text-white

                          sm:text-[34px]

                          lg:text-[36px]
                        "
                        style={{
                          color: "#ffffff",
                        }}
                      >
                        5000+
                      </h3>

                      <p
                        className="
                          mt-[6px]

                          font-secondary

                          text-[11px]

                          leading-[1.4]

                          sm:text-[12px]

                          lg:text-[13px]
                        "
                        style={{
                          color:
                            "rgba(255,255,255,0.88)",
                        }}
                      >
                        Alumni across the globe
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* =================================================
                RIGHT FORM
            ================================================= */}

            <motion.div
              variants={fadeRight}
              className="
                relative

                bg-[#FAFAFA]

                px-[18px]
                py-[22px]

                sm:px-[26px]
                sm:py-[28px]

                lg:flex
                lg:items-center

                lg:bg-white

                lg:px-[30px]
                lg:py-[24px]
              "
            >
              <motion.div
                variants={fadeUp}
                className="
                  w-full

                  rounded-[18px]

                  bg-white

                  p-[20px]

                  shadow-[0_14px_38px_rgba(15,23,42,0.06)]

                  sm:p-[24px]

                  lg:p-[22px]
                  lg:shadow-none

                  xl:p-[26px]
                "
              >
                <form
                  onSubmit={handleSubmit}
                  className="
                    space-y-[14px]

                    sm:space-y-[15px]
                  "
                >
                  {/* ===========================================
                      NAME
                  ============================================ */}

                  <div>
                    <label
                      htmlFor="name"
                      className="
                        mb-[6px]

                        block

                        font-secondary

                        text-[14px]
                        font-semibold

                        text-[#171717]

                        lg:text-[15px]
                      "
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="
                        h-[46px]

                        w-full

                        rounded-[8px]

                        border
                        border-[#8EC2FF]

                        bg-white

                        px-[15px]

                        font-secondary

                        text-[14px]

                        text-[#181818]

                        outline-none

                        transition-all
                        duration-300

                        placeholder:text-[#B4B7BC]

                        hover:border-[#4B9DFF]

                        focus:border-[#0075FF]

                        focus:ring-4
                        focus:ring-[#0075FF]/10

                        sm:h-[48px]
                      "
                    />
                  </div>

                  {/* ===========================================
                      EMAIL
                  ============================================ */}

                  <div>
                    <label
                      htmlFor="email"
                      className="
                        mb-[6px]

                        block

                        font-secondary

                        text-[14px]
                        font-semibold

                        text-[#171717]

                        lg:text-[15px]
                      "
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="
                        h-[46px]

                        w-full

                        rounded-[8px]

                        border
                        border-[#8EC2FF]

                        bg-white

                        px-[15px]

                        font-secondary

                        text-[14px]

                        text-[#181818]

                        outline-none

                        transition-all
                        duration-300

                        placeholder:text-[#B4B7BC]

                        hover:border-[#4B9DFF]

                        focus:border-[#0075FF]

                        focus:ring-4
                        focus:ring-[#0075FF]/10

                        sm:h-[48px]
                      "
                    />
                  </div>

                  {/* ===========================================
                      PHONE
                  ============================================ */}

                  <div>
                    <label
                      htmlFor="phone"
                      className="
                        mb-[6px]

                        block

                        font-secondary

                        text-[14px]
                        font-semibold

                        text-[#171717]

                        lg:text-[15px]
                      "
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter Your Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="
                        h-[46px]

                        w-full

                        rounded-[8px]

                        border
                        border-[#8EC2FF]

                        bg-white

                        px-[15px]

                        font-secondary

                        text-[14px]

                        text-[#181818]

                        outline-none

                        transition-all
                        duration-300

                        placeholder:text-[#B4B7BC]

                        hover:border-[#4B9DFF]

                        focus:border-[#0075FF]

                        focus:ring-4
                        focus:ring-[#0075FF]/10

                        sm:h-[48px]
                      "
                    />
                  </div>

                  {/* ===========================================
                      MESSAGE
                  ============================================ */}

                  <div>
                    <label
                      htmlFor="message"
                      className="
                        mb-[6px]

                        block

                        font-secondary

                        text-[14px]
                        font-semibold

                        text-[#171717]

                        lg:text-[15px]
                      "
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      placeholder="Message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="
                        min-h-[105px]

                        w-full

                        resize-none

                        rounded-[8px]

                        border
                        border-[#8EC2FF]

                        bg-white

                        px-[15px]
                        py-[12px]

                        font-secondary

                        text-[14px]

                        leading-[1.55]

                        text-[#181818]

                        outline-none

                        transition-all
                        duration-300

                        placeholder:text-[#B4B7BC]

                        hover:border-[#4B9DFF]

                        focus:border-[#0075FF]

                        focus:ring-4
                        focus:ring-[#0075FF]/10

                        sm:min-h-[115px]
                      "
                    />
                  </div>

                  {/* ===========================================
                      SUBMIT
                  ============================================ */}

                  <div
                    className="
                      pt-[2px]
                    "
                  >
                    <motion.button
                      type="submit"
                      whileHover={{
                        y: -2,
                        scale: 1.01,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.25,
                        ease,
                      }}
                      className="
                        inline-flex

                        h-[46px]

                        min-w-[165px]

                        items-center
                        justify-center

                        rounded-[7px]

                        bg-[#0075FF]

                        px-[30px]

                        font-secondary

                        text-[14px]
                        font-medium

                        uppercase

                        tracking-[0.35px]

                        text-white

                        shadow-[0_12px_28px_rgba(0,117,255,0.22)]

                        transition-all
                        duration-300

                        hover:bg-[#0069E3]

                        hover:shadow-[0_16px_34px_rgba(0,117,255,0.28)]

                        sm:min-w-[180px]
                      "
                    >
                      Submit
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}