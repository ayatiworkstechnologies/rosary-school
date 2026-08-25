"use client";

import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { ReactNode } from "react";

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
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
      duration: 0.8,
      ease,
    },
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -28,
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
    x: 28,
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

/* =========================================================
   CONTACT ITEM
========================================================= */

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="
        group

        flex

        items-start

        gap-[12px]
      "
    >
      {/* =====================================================
          ICON
      ====================================================== */}

      <div
        className="
          mt-[1px]

          flex

          h-[32px]
          w-[32px]

          shrink-0

          items-center
          justify-center

          rounded-full

          bg-[#EEF6FF]

          text-[#0075FF]

          transition-all
          duration-300

          group-hover:scale-[1.06]
          group-hover:bg-[#0075FF]
          group-hover:text-white
        "
      >
        {icon}
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          min-w-0
          flex-1
        "
      >
        {/* LABEL */}

        <p
          className="
            font-secondary

            text-[12px]
            font-normal

            leading-[1.2]

            text-[#9BA2AA]

            sm:text-[13px]

            lg:text-[13px]
          "
        >
          {label}
        </p>

        {/* VALUE */}

        <div
          className="
            mt-[7px]

            font-secondary

            text-[14px]
            font-medium

            leading-[1.55]

            text-[#252A30]

            sm:text-[15px]

            md:text-[15px]

            lg:text-[16px]
          "
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ConnectWithRosary() {
  return (
    <section
      className="
        relative
        isolate

        w-full

        overflow-hidden

        bg-white

        py-[58px]

        sm:py-[70px]

        md:py-[78px]

        lg:py-[90px]
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          -z-20

          bg-white
        "
      />

      {/* subtle background light */}

      <div
        className="
          pointer-events-none

          absolute

          right-[5%]
          top-[16%]

          -z-10

          h-[300px]
          w-[300px]

          rounded-full

          bg-[#0075FF]/[0.025]

          blur-[100px]

          sm:h-[400px]
          sm:w-[400px]
        "
      />

      {/* =====================================================
          MAIN WRAPPER
      ====================================================== */}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
        className="
          mx-auto

          grid

          w-full
          max-w-[1280px]

          grid-cols-1

          gap-[38px]

          px-[18px]

          sm:px-[28px]

          md:px-[38px]

          lg:grid-cols-[330px_minmax(0,1fr)]
          lg:gap-[76px]
          lg:px-[46px]

          xl:grid-cols-[350px_minmax(0,1fr)]
          xl:gap-[90px]
        "
      >
        {/* ===================================================
            LEFT CONTENT
        ==================================================== */}

        <motion.div
          variants={fadeLeft}
          className="
            flex

            flex-col

            justify-start

            lg:pt-[4px]
          "
        >
          {/* HEADING */}

          <h2
            className="
              max-w-[310px]

              font-primary pb-5

              text-[38px]
              font-semibold

              leading-[1.04]

              tracking-[-1px]

              text-[#12161C]

              sm:text-[44px]

              md:text-[46px]

              lg:text-[48px]

              xl:text-[50px]
            "
          >
            Connect
            <br />
            With Rosary
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mt-[25px]

              max-w-[340px]

              font-secondary

              text-[14px]

              leading-[1.75]

              text-[#8A9199]

              sm:text-[15px]

              md:text-[15.5px]

              lg:mt-[28px]
              lg:text-[16px]
            "
          >
            Have a question or need more information about
            Rosary School? Send us your enquiry and our team
            will be happy to assist you.
          </p>
        </motion.div>

        {/* ===================================================
            RIGHT CONTENT
        ==================================================== */}

        <motion.div
          variants={fadeRight}
          className="
            min-w-0

            w-full
          "
        >
          {/* =================================================
              CONTACT DETAILS
          ================================================= */}

          <motion.div
            variants={container}
            className="
              grid

              grid-cols-1

              gap-x-[40px]
              gap-y-[28px]

              sm:grid-cols-2

              md:gap-x-[50px]

              lg:grid-cols-2
              lg:gap-x-[70px]
              lg:gap-y-[32px]
            "
          >
            {/* =================================================
                LOCATION
            ================================================= */}

            <ContactItem
              icon={
                <MapPin
                  size={16}
                  strokeWidth={1.8}
                />
              }
              label="location"
            >
              <address
                className="
                  max-w-[340px]

                  not-italic
                "
              >
                Rosary Matriculation Hr Sec School, Santhome
                <br />
                Chennai - 600004
              </address>
            </ContactItem>

            {/* =================================================
                MAIL
            ================================================= */}

            <ContactItem
              icon={
                <Mail
                  size={16}
                  strokeWidth={1.8}
                />
              }
              label="mail"
            >
              <a
                href="mailto:rosarymatriculation.chennai@gmail.com"
                className="
                  break-all

                  transition-colors
                  duration-300

                  hover:text-[#0075FF]
                "
              >
                rosarymatriculation.chennai@gmail.com
              </a>
            </ContactItem>

            {/* =================================================
                PHONE
            ================================================= */}

            <ContactItem
              icon={
                <Phone
                  size={16}
                  strokeWidth={1.8}
                />
              }
              label="phone number"
            >
              <a
                href="tel:04424983617"
                className="
                  transition-colors
                  duration-300

                  hover:text-[#0075FF]
                "
              >
                044 2498 3617
              </a>
            </ContactItem>
          </motion.div>

          {/* =================================================
              MAP
          ================================================= */}

          <motion.div
            variants={fadeUp}
            whileHover={{
              y: -3,
            }}
            transition={{
              duration: 0.4,
              ease,
            }}
            className="
              relative

              mt-[42px]

              w-full

              overflow-hidden

              rounded-[10px]

              bg-[#F2F6F9]

              shadow-[0_20px_55px_rgba(28,50,70,0.08)]

              sm:mt-[48px]

              md:rounded-[12px]

              lg:mt-[54px]
            "
          >
            {/* =================================================
                MAP RESPONSIVE HEIGHT
            ================================================= */}

            <div
              className="
                relative

                h-[280px]

                w-full

                sm:h-[330px]

                md:h-[370px]

                lg:h-[360px]
              "
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0033517785314!2d80.2762113!3d13.035458300000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267d55d691f67%3A0xc0a43b90a6a7403e!2sRosary%20Matriculation%20Higher%20Secondary%20School%2C%2011%2C%20Papanasam%20Sivan%20Salai%2C%20Kangayarpuram%2C%20Basha%20Garden%2C%20Mylapore%2C%20Chennai%2C%20Greater%20Chennai%2C%20Tamil%20Nadu%20600004!5e0!3m2!1sen!2sin!4v1787648992963!5m2!1sen!2sin"
                title="Rosary Matriculation Higher Secondary School Location"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="
                  absolute
                  inset-0

                  h-full
                  w-full

                  border-0
                "
              />
            </div>

            {/* =================================================
                MAP BORDER
            ================================================= */}

            <div
              className="
                pointer-events-none

                absolute
                inset-0

                rounded-[inherit]

                ring-1
                ring-inset
                ring-black/[0.04]
              "
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}