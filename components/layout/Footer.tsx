"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent } from "react";

/* =========================================================
   FOOTER DATA
========================================================= */

const informationLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Achievements",
    href: "/achievements",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  },
];

const academicLinks = [
  {
    label: "Curriculum",
    href: "/academics/curriculum",
  },
  {
    label: "Departments",
    href: "/academics/departments",
  },
  {
    label: "Faculty",
    href: "/academics/faculty",
  },
  {
    label: "Admissions",
    href: "/admissions",
  },
];

const communityLinks = [
  {
    label: "Student Corner",
    href: "/community/student-corner",
  },
  {
    label: "Parent Corner",
    href: "/community/parent-corner",
  },
  {
    label: "Alumni Section",
    href: "/community/alumni",
  },
];

/* =========================================================
   SOCIAL MEDIA
========================================================= */

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: "/icons/social/facebook.svg",
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: "/icons/social/whatsapp.svg",
  },
  {
    label: "X",
    href: "#",
    icon: "/icons/social/x.svg",
  },
  {
    label: "Instagram",
    href: "#",
    icon: "/icons/social/instagram.svg",
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: "/icons/social/linkedin.svg",
  },
  {
    label: "YouTube",
    href: "#",
    icon: "/icons/social/youtube.svg",
  },
  {
    label: "Threads",
    href: "#",
    icon: "/icons/social/threads.svg",
  },
];

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const handleSubscribe = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Backend/newsletter integration can be added later.
  };

  return (
    <footer className="w-full bg-white">
      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div
        className="
          relative
          overflow-hidden
          border-t
          border-[#F1F1F1]
          bg-white
        "
      >
        {/* =================================================
            BACKGROUND IMAGE
        ================================================= */}

        <div className="absolute inset-0">
          <Image
            src="/images/notice-bg.png"
            alt=""
            fill
            sizes="100vw"
            className="
              object-cover
              object-center
              opacity-[0.80]
            "
          />

          {/* <div className="absolute inset-0 bg-white/35" /> */}
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[1440px]
            px-[24px]
            py-[42px]

            sm:px-[32px]

            md:py-[48px]

            lg:px-[48px]
            lg:py-[36px]

            xl:px-[60px]
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-[36px]

              sm:grid-cols-2

              lg:grid-cols-[2.4fr_1fr_1fr_1.25fr_1.45fr]
              lg:gap-[28px]

              xl:grid-cols-[2.6fr_1fr_1fr_1.3fr_1.55fr]
              xl:gap-[34px]
            "
          >
            {/* =================================================
                SCHOOL INFORMATION
            ================================================= */}

            <div
              className="
                pr-0

                sm:col-span-2

                lg:col-span-1
                lg:pr-[35px]

                xl:pr-[48px]
              "
            >
              {/* LOGO */}

              <Link
                href="/"
                aria-label="Rosary Matriculation Hr Sec School"
                className="
                  relative
                  block
                  h-[58px]
                  w-[250px]

                  sm:w-[270px]

                  lg:h-[60px]
                  lg:w-[270px]
                "
              >
                <Image
                  src="/icons/rosary-logo.svg"
                  alt="Rosary Matriculation Hr Sec School"
                  fill
                  sizes="270px"
                  className="
                    object-contain
                    object-left
                  "
                />
              </Link>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-[22px]
                  max-w-[365px]
                  font-secondary
                  text-[13px]
                  font-normal
                  leading-[1.35]
                  text-[#777777]

                  sm:text-[13.5px]

                  lg:max-w-[350px]
                  lg:text-[13px]

                  xl:text-[13.5px]
                "
              >
                Nurturing young minds through knowledge,
                values and holistic education, while
                inspiring students to grow with confidence
                and purpose.
              </p>

              {/* SOCIAL MEDIA */}

              <div
                className="
                  mt-[27px]
                  flex
                  flex-wrap
                  items-center
                  gap-[12px]
                "
              >
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="
                      relative
                      flex
                      h-[18px]
                      w-[18px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      transition-all
                      duration-200

                      hover:-translate-y-[2px]
                      hover:shadow-[0_4px_10px_rgba(0,0,0,0.15)]

                      sm:h-[20px]
                      sm:w-[20px]
                    "
                  >
                    <Image
                      src={social.icon}
                      alt={social.label}
                      fill
                      sizes="30px"
                      className="object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* =================================================
                INFORMATION
            ================================================= */}

            <FooterColumn
              title="Information"
              links={informationLinks}
            />

            {/* =================================================
                ACADEMICS
            ================================================= */}

            <FooterColumn
              title="Academics"
              links={academicLinks}
            />

            {/* =================================================
                COMMUNITY
            ================================================= */}

            <FooterColumn
              title="Community"
              links={communityLinks}
            />

            {/* =================================================
                SUBSCRIBE
            ================================================= */}

            <div
              className="
                sm:col-span-2

                lg:col-span-1
                lg:pl-[10px]
              "
            >
              <h3
                className="
                  font-primary
                  text-[20px]
                  font-semibold
                  leading-none
                  text-[#101010]

                  lg:text-[18px]

                  xl:text-[20px]
                "
              >
                Subscribe
              </h3>

              <form
                onSubmit={handleSubscribe}
                className="
                  mt-[23px]
                  w-full
                  max-w-[280px]

                  sm:max-w-[320px]

                  lg:max-w-none
                "
              >
                <label
                  htmlFor="footer-email"
                  className="sr-only"
                >
                  Enter your email
                </label>

                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="Enter Your Email"
                  className="
                    h-[42px]
                    w-full
                    border
                    border-[#7CB8FF]
                    bg-white/75
                    px-[15px]
                    font-secondary
                    text-[12px]
                    font-medium
                    text-[#202020]
                    outline-none
                    transition

                    placeholder:text-[#A0A0A0]

                    focus:border-[#0075FF]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#0075FF]/10

                    lg:h-[40px]

                    xl:h-[42px]
                  "
                />

                <button
                  type="submit"
                  className="
                    mt-[16px]
                    flex
                    h-[42px]
                    w-full
                    items-center
                    justify-center
                    bg-[#0075FF]
                    font-primary
                    text-[13px]
                    font-medium
                    uppercase
                    tracking-[0.2px]
                    text-white
                    transition-all
                    duration-200

                    hover:bg-[#0068E5]
                    hover:shadow-[0_6px_16px_rgba(0,117,255,0.22)]

                    active:scale-[0.99]

                    lg:h-[40px]

                    xl:h-[42px]
                  "
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM COPYRIGHT
      ====================================================== */}

      <div
        className="
          flex
          min-h-[42px]
          w-full
          items-center
          justify-center
          border-t
          border-[#EDEDED]
          bg-white
          px-[18px]
          py-[10px]
        "
      >
        <p
          className="
            text-center
            font-secondary
            text-[10px]
            font-medium
            uppercase
            leading-[1.6]
            text-[#0075FF]

            sm:text-[11px]

            lg:text-[11.5px]
          "
        >
          Rosary Matriculation All Rights Reserved.
          Copyright © 2026
          <span className="mx-[5px]">|</span>
          Design &amp; Developed By{" "}
          <a
            href="https://ayatiworks.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              font-semibold
              text-[#0075FF]
              underline-offset-2
              transition-colors
              hover:text-[#005DCB]
              hover:underline
            "
          >
            Ayatiworks
          </a>
        </p>
      </div>
    </footer>
  );
}

/* =========================================================
   FOOTER COLUMN
========================================================= */

type FooterColumnProps = {
  title: string;

  links: {
    label: string;
    href: string;
  }[];
};

function FooterColumn({
  title,
  links,
}: FooterColumnProps) {
  return (
    <div
      className="
        relative
        border-l-0
        pl-0

        lg:border-l-2
        lg:border-[#72B7FF]
        lg:pl-[20px]

        xl:pl-[22px]
      "
    >
      {/* MOBILE BLUE LINE */}

      <div
        className="
          mb-[14px]
          h-[2px]
          w-[35px]
          bg-[#72B7FF]

          lg:hidden
        "
      />

      <h3
        className="
          font-primary
          text-[20px]
          font-semibold
          leading-none
          text-[#101010]

          lg:text-[18px]

          xl:text-[20px]
        "
      >
        {title}
      </h3>

      <ul
        className="
          mt-[18px]
          space-y-[8px]

          lg:mt-[17px]
          lg:space-y-[7px]
        "
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="
                relative
                inline-block
                font-secondary
                text-[13px]
                font-medium
                leading-[1.25]
                text-[#333333]
                transition-colors
                duration-150

                after:absolute
                after:-bottom-[2px]
                after:left-0
                after:h-[1px]
                after:w-0
                after:bg-[#0075FF]
                after:transition-all
                after:duration-200

                hover:text-[#0075FF]
                hover:after:w-full

                lg:text-[12.5px]

                xl:text-[13.5px]
              "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}