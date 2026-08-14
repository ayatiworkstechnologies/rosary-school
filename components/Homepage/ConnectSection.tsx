"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";
import { FormEvent } from "react";

const contactDetails = [
  {
    id: 1,
    icon: MapPin,
    text: "Rosary Matriculation Hr Sec School, Santhome, Chennai - 600004",
  },
  {
    id: 2,
    icon: Mail,
    text: "rosarymatriculation.chennai@gmail.com",
  },
  {
    id: 3,
    icon: Phone,
    text: "044 2498 3617",
  },
];

const formFields = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter Your Name",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter Your Email",
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter Your Phone Number",
  },
];

export default function ConnectSection() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#F7F9FC]
        px-4
        py-7

        sm:px-6
        sm:py-8

        lg:px-8
        lg:py-10
      "
    >
      {/* ===================================================== */}
      {/* BACKGROUND GRID */}
      {/* ===================================================== */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* top glow */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-100px]
          top-[-120px]

          h-[240px]
          w-[240px]

          rounded-full

          bg-[#0075FF]/10
          blur-[85px]

          sm:h-[280px]
          sm:w-[280px]

          lg:h-[330px]
          lg:w-[330px]
        "
      />

      {/* bottom glow */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-130px]
          left-[-100px]

          h-[230px]
          w-[230px]

          rounded-full

          bg-[#0075FF]/8
          blur-[90px]
        "
      />

      {/* ===================================================== */}
      {/* MAIN CONTAINER */}
      {/* ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-10

          mx-auto
          w-full
          max-w-[1240px]

          overflow-hidden

          rounded-[10px]

          border
          border-white/80

          bg-white/85

          p-4

          shadow-[0_15px_45px_rgba(15,23,42,0.05)]

          backdrop-blur-md

          sm:p-5

          lg:p-6

          xl:p-7
        "
      >
        {/* decorative circle */}

        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[-100px]

            h-[220px]
            w-[220px]

            rounded-full

            border-[38px]
            border-[#0075FF]/[0.025]
          "
        />

        {/* ===================================================== */}
        {/* GRID */}
        {/* ===================================================== */}

        <div
          className="
            relative

            grid
            grid-cols-1

            items-start

            gap-7

            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-10

            xl:grid-cols-[0.92fr_1.08fr]
            xl:gap-12
          "
        >
          {/* =================================================== */}
          {/* LEFT CONTENT */}
          {/* =================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -22,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.08,
            }}
            className="
              flex
              flex-col

              lg:py-1
            "
          >
            {/* tag */}

            <span
              className="
                w-fit

                rounded-[8px]

                bg-[#EDF5FF]

                px-2.5
                py-1

                font-secondary
                text-[9px]
                font-semibold

                uppercase
                tracking-[0.12em]

                text-primary mb-5

                sm:text-[10px]
              "
            >
              Contact Us
            </span>

            {/* heading */}

            <h2
              className="
                mt-3

                max-w-[380px]

                font-primary

                text-[34px]
                font-bold

                uppercase

                leading-[0.9]

                tracking-[-0.05em]

                text-[#0F172A]

                sm:text-[40px]

                lg:text-[46px]

                xl:text-[50px]  pb-5
              "
            >
              Connect
              <br />
              With Rosary
            </h2>

            {/* description */}

            <p
              className="
                mt-3

                max-w-[500px]

                font-secondary

                text-[13px]

                leading-[1.6]

                text-[#667085] 

                sm:text-[14px]
              "
            >
              Have a question or need more information about Rosary School?
              Send us your enquiry and our team will be happy to assist you.
            </p>

            {/* divider */}

            <div
              className="
                my-5

                h-px

                w-full
                max-w-[470px]

                bg-gradient-to-r
                from-[#E4EAF2]
                via-[#E4EAF2]
                to-transparent
              "
            />

            {/* contact information */}

            <div className="flex flex-col gap-2.5">
              {contactDetails.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{
                      opacity: 0,
                      x: -12,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.15 + index * 0.06,
                    }}
                    className="
                      group

                      flex
                      max-w-[520px]

                      items-center

                      gap-2.5
                    "
                  >
                    {/* icon */}

                    <div
                      className="
                        flex
                        h-8
                        w-8

                        shrink-0

                        items-center
                        justify-center

                        rounded-[8px]

                        border
                        border-[#E2ECF9]

                        bg-[#F4F8FE]

                        text-primary

                        transition-all
                        duration-300

                        group-hover:border-[#BDD8FC]
                        group-hover:bg-[#EAF4FF]
                      "
                    >
                      <Icon size={15} strokeWidth={1.8} />
                    </div>

                    {/* text */}

                    <p
                      className="
                        break-words

                        font-secondary

                        text-[12px]

                        leading-[1.45]

                        text-[#344054]

                        sm:text-[13px]
                      "
                    >
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* =================================================== */}
          {/* RIGHT FORM */}
          {/* =================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 22,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.12,
            }}
            className="
              relative

              overflow-hidden

              rounded-[10px]

              border
              border-[#E7EDF5]

              bg-[#FBFCFE]

              p-4

              shadow-[0_10px_30px_rgba(15,23,42,0.035)]

              sm:p-5

              lg:p-5
            "
          >
            {/* glow */}

            <div
              className="
                pointer-events-none
                absolute

                right-[-60px]
                top-[-70px]

                h-[150px]
                w-[150px]

                rounded-full

                bg-[#0075FF]/7

                blur-[50px]
              "
            />

            {/* form */}

            <form
              onSubmit={handleSubmit}
              className="
                relative
                z-10

                grid
                grid-cols-1

                gap-3
              "
            >
              {/* ================================================= */}
              {/* THREE INPUTS */}
              {/* ================================================= */}

              {formFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.38,
                    delay: 0.18 + index * 0.06,
                  }}
                >
                  <label
                    htmlFor={field.id}
                    className="
                      mb-1

                      block

                      font-primary

                      text-[11px]
                      font-medium

                      text-[#101828]

                      sm:text-[12px]
                    "
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="
                      h-[42px]

                      w-full

                      rounded-[10px]

                      border
                      border-[#C5DCF9]

                      bg-white

                      px-3.5

                      font-secondary

                      text-[13px]

                      text-[#101828]

                      outline-none

                      transition-all
                      duration-300

                      placeholder:text-[#A5ACB8]

                      hover:border-[#9AC4FB]

                      focus:border-primary

                      focus:shadow-[0_0_0_3px_rgba(0,117,255,0.07)]

                      sm:h-[44px]
                      sm:px-4
                    "
                  />
                </motion.div>
              ))}

              {/* ================================================= */}
              {/* MESSAGE */}
              {/* ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.38,
                  delay: 0.4,
                }}
              >
                <label
                  htmlFor="message"
                  className="
                    mb-1

                    block

                    font-primary

                    text-[11px]
                    font-medium

                    text-[#101828]

                    sm:text-[12px]
                  "
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Write your message..."
                  className="
                    min-h-[88px]

                    w-full

                    resize-none

                    rounded-[10px]

                    border
                    border-[#C5DCF9]

                    bg-white

                    px-3.5
                    py-2.5

                    font-secondary

                    text-[13px]

                    leading-[1.5]

                    text-[#101828]

                    outline-none

                    transition-all
                    duration-300

                    placeholder:text-[#A5ACB8]

                    hover:border-[#9AC4FB]

                    focus:border-primary

                    focus:shadow-[0_0_0_3px_rgba(0,117,255,0.07)]

                    sm:min-h-[92px]
                    sm:px-4
                  "
                />
              </motion.div>

              {/* ================================================= */}
              {/* BUTTON */}
              {/* ================================================= */}

              <motion.button
                type="submit"
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.38,
                  delay: 0.47,
                }}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="
                  group

                  mt-0.5

                  inline-flex

                  h-[44px]

                  w-full

                  items-center
                  justify-center

                  gap-2

                  rounded-[10px]

                  bg-primary

                  px-5

                  font-primary

                  text-[13px]
                  font-medium

                  uppercase
                  tracking-[0.04em]

                  !text-white

                  shadow-[0_8px_20px_rgba(0,117,255,0.18)]

                  transition-all
                  duration-300

                  hover:bg-[#006AE8]

                  hover:shadow-[0_10px_25px_rgba(0,117,255,0.25)]

                  sm:w-[165px]
                "
              >
                Submit

                <Send
                  size={15}
                  strokeWidth={1.8}
                  className="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                    group-hover:-translate-y-[1px]
                  "
                />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}