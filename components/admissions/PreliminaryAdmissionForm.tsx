"use client";

import {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  CheckCircle2,
  FileText,
  ImagePlus,
  Upload,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type FormState = {
  pupilName: string;
  dob: string;
  placeOfBirth: string;
  religion: string;
  parishName: string;
  parishPriestName: string;

  fatherName: string;
  fatherQualification: string;
  fatherOccupation: string;
  fatherIncome: string;

  motherName: string;
  motherQualification: string;
  motherOccupation: string;
  motherIncome: string;

  isExStudent: string;
  motherTongue: string;
  sisterInSchool: string;

  address: string;
  email: string;
  phone: string;
  alternativePhone: string;
};

/* =========================================================
   INITIAL DATA
========================================================= */

const initialForm: FormState = {
  pupilName: "",
  dob: "",
  placeOfBirth: "",
  religion: "",
  parishName: "",
  parishPriestName: "",

  fatherName: "",
  fatherQualification: "",
  fatherOccupation: "",
  fatherIncome: "",

  motherName: "",
  motherQualification: "",
  motherOccupation: "",
  motherIncome: "",

  isExStudent: "",
  motherTongue: "",
  sisterInSchool: "",

  address: "",
  email: "",
  phone: "",
  alternativePhone: "",
};

/* =========================================================
   ANIMATION
========================================================= */

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 22,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      ease,
    },
  },
};

/* =========================================================
   COMMON STYLES
========================================================= */

const inputClass = `
  h-[48px]
  w-full

  rounded-[6px]

  border
  border-[#8CC1FF]

  bg-white

  px-[14px]

  font-secondary

  text-[13px]
  text-[#1C1F24]

  outline-none

  transition-all
  duration-300

  placeholder:text-[#9BA2AC]

  hover:border-[#4D9FFF]

  focus:border-[#0075FF]
  focus:ring-4
  focus:ring-[#0075FF]/10

  sm:h-[50px]
  sm:text-[14px]
`;

const labelClass = `
  mb-[7px]

  block

  font-secondary

  text-[12px]
  font-medium

  text-[#171717]

  sm:text-[13px]
`;

const sectionTitleClass = `
  font-primary

  text-[15px]
  font-semibold

  uppercase

  text-[#1A1A1A]

  sm:text-[16px]
`;

function Required() {
  return (
    <span className="ml-[3px] text-[#FF4D4F]">
      *
    </span>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function FormSectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="
        mb-[24px]

        sm:mb-[28px]
      "
    >
      <h2 className={sectionTitleClass}>
        {children}
      </h2>

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
          duration: 0.8,
          ease,
        }}
        className="
          mt-[10px]

          h-px
          w-full

          origin-left

          bg-[#6FB2FF]
        "
      />
    </motion.div>
  );
}

/* =========================================================
   FILE UPLOAD
========================================================= */

function FileUpload({
  label,
  required = false,
  file,
  accept,
  helper,
  onChange,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  accept?: string;
  helper: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  return (
    <motion.div variants={fadeUp}>
      <label className={labelClass}>
        {label}

        {required && <Required />}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />

      <motion.button
        type="button"
        whileHover={{
          y: -1,
        }}
        whileTap={{
          scale: 0.995,
        }}
        onClick={() =>
          inputRef.current?.click()
        }
        className="
          group

          flex

          min-h-[74px]
          w-full

          items-center

          gap-[14px]

          rounded-[7px]

          border
          border-dashed
          border-[#72B5FF]

          bg-[#F7FBFF]

          px-[14px]
          py-[12px]

          text-left

          transition-all
          duration-300

          hover:border-[#0075FF]
          hover:bg-[#F2F8FF]

          sm:px-[18px]
        "
      >
        <span
          className="
            flex

            h-[40px]
            w-[44px]

            shrink-0

            items-center
            justify-center

            rounded-[6px]

            border
            border-[#9DCBFF]

            bg-white

            text-[#0075FF]

            shadow-[0_5px_14px_rgba(0,117,255,0.08)]
          "
        >
          {file ? (
            <CheckCircle2 size={18} />
          ) : (
            <Upload size={18} />
          )}
        </span>

        <span className="min-w-0">
          <span
            className="
              block

              truncate

              font-secondary

              text-[12px]
              font-medium

              text-[#292D32]

              sm:text-[13px]
            "
          >
            {file
              ? file.name
              : "Choose file"}
          </span>

          <span
            className="
              mt-[3px]

              block

              font-secondary

              text-[10px]

              leading-[1.45]

              text-[#8C96A3]

              sm:text-[11px]
            "
          >
            {helper}
          </span>
        </span>
      </motion.button>
    </motion.div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PreliminaryAdmissionForm() {
  const [form, setForm] =
    useState<FormState>(initialForm);

  const [pupilPhoto, setPupilPhoto] =
    useState<File | null>(null);

  const [signature, setSignature] =
    useState<File | null>(null);

  const [submitted, setSubmitted] =
    useState(false);

  /* =========================================================
     CHANGE
  ========================================================= */

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitted(true);

    console.log({
      ...form,
      pupilPhoto,
      signature,
    });

    window.setTimeout(() => {
      setSubmitted(false);
    }, 3500);
  };

  return (
    <section
      className="
        relative
        isolate

        w-full

        overflow-hidden

        bg-white

        py-[40px]

        sm:py-[54px]

        lg:py-[70px]
      "
    >
      {/* =====================================================
          SUBTLE BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          -z-20
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0,117,255,0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(0,117,255,0.025) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "44px 44px",
        }}
      />

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          -z-10

          bg-white/70
        "
      />

      {/* =====================================================
          CONTAINER
      ====================================================== */}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.05,
        }}
        className="
          mx-auto

          w-full
          max-w-[1180px]

          px-[16px]

          sm:px-[28px]

          lg:px-[36px]
        "
      >
        {/* ===================================================
            HEADING
        ==================================================== */}

        <motion.div
          variants={fadeUp}
          className="
            mb-[38px]

            sm:mb-[46px]
          "
        >
          <span
            className="
              inline-flex

              rounded-[4px]

              bg-[#EEF6FF]

              px-[9px]
              py-[5px]

              font-secondary

              text-[10px]
              font-medium

              uppercase

              tracking-[0.5px]

              text-[#0075FF] 
            "
          >
            Admissions
          </span>

          <h1
            className="
              mt-[12px]

              font-primary

              text-[27px] pt-3
              font-bold

              uppercase

              leading-[1.1]

              tracking-[-0.5px]

              text-[#171717]

              sm:text-[34px]

              lg:text-[38px]
            "
          >
            Preliminary Admission Form
          </h1>

          <p
            className="
              mt-[10px]

              max-w-[740px]

              font-secondary

              text-[12px]

              leading-[1.6]

              text-[#7E8793] pt-3

              sm:text-[13px]
            "
          >
            Please fill out all the fields below carefully.
            Fields marked with a red asterisk{" "}
            <span className="text-[#FF4D4F]">
              (*)
            </span>{" "}
            are mandatory for submission.
          </p>
        </motion.div>

        {/* ===================================================
            FORM
        ==================================================== */}

        <form onSubmit={handleSubmit}>
          {/* =================================================
              I. PUPIL INFORMATION
          ================================================= */}

          <section>
            <FormSectionTitle>
              I. Pupil&apos;s Information
            </FormSectionTitle>

            <motion.div
              variants={container}
              className="
                grid

                grid-cols-1

                gap-x-[24px]
                gap-y-[22px]

                md:grid-cols-2
              "
            >
              {/* PUPIL NAME */}

              <motion.div
                variants={fadeUp}
                className="md:col-span-2"
              >
                <label
                  htmlFor="pupilName"
                  className={labelClass}
                >
                  Name of the Pupil
                  <Required />
                </label>

                <input
                  id="pupilName"
                  name="pupilName"
                  required
                  value={form.pupilName}
                  onChange={handleChange}
                  placeholder="Enter full name of the candidate"
                  className={inputClass}
                />
              </motion.div>

              {/* PHOTO */}

              <div className="md:col-span-2">
                <FileUpload
                  label="Photo of the Pupil"
                  required
                  file={pupilPhoto}
                  accept="image/jpeg,image/png,image/webp"
                  helper="Upload photo of the candidate. Max file upload size: 2MB"
                  onChange={(event) =>
                    setPupilPhoto(
                      event.target.files?.[0] ??
                        null
                    )
                  }
                />
              </div>

              {/* DOB */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="dob"
                  className={labelClass}
                >
                  Date of Birth
                  <Required />
                </label>

                <input
                  id="dob"
                  name="dob"
                  required
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className={inputClass}
                />
              </motion.div>

              {/* BIRTH PLACE */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="placeOfBirth"
                  className={labelClass}
                >
                  Place of Birth
                  <Required />
                </label>

                <input
                  id="placeOfBirth"
                  name="placeOfBirth"
                  required
                  value={form.placeOfBirth}
                  onChange={handleChange}
                  placeholder="City / State"
                  className={inputClass}
                />
              </motion.div>

              {/* RELIGION */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="religion"
                  className={labelClass}
                >
                  Religion
                  <Required />
                </label>

                <input
                  id="religion"
                  name="religion"
                  required
                  value={form.religion}
                  onChange={handleChange}
                  placeholder="e.g. Roman Catholic"
                  className={inputClass}
                />
              </motion.div>

              {/* EMPTY DESKTOP CELL */}

              <div className="hidden md:block" />

              {/* PARISH */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="parishName"
                  className={labelClass}
                >
                  Name of Parish
                  <Required />
                </label>

                <input
                  id="parishName"
                  name="parishName"
                  required
                  value={form.parishName}
                  onChange={handleChange}
                  placeholder="Enter Parish name"
                  className={inputClass}
                />
              </motion.div>

              {/* PRIEST */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="parishPriestName"
                  className={labelClass}
                >
                  Parish Priest Name
                  <Required />
                </label>

                <input
                  id="parishPriestName"
                  name="parishPriestName"
                  required
                  value={form.parishPriestName}
                  onChange={handleChange}
                  placeholder="Enter priest's full name"
                  className={inputClass}
                />
              </motion.div>
            </motion.div>
          </section>

          {/* =================================================
              II. PARENT INFORMATION
          ================================================= */}

          <section
            className="
              mt-[54px]

              sm:mt-[68px]
            "
          >
            <FormSectionTitle>
              II. Parent &amp; Family Information
            </FormSectionTitle>

            <motion.div
              variants={container}
              className="
                grid

                grid-cols-1

                gap-x-[24px]
                gap-y-[22px]

                md:grid-cols-2
              "
            >
              {/* FATHER NAME */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="fatherName"
                  className={labelClass}
                >
                  Father&apos;s Name
                  <Required />
                </label>

                <input
                  id="fatherName"
                  name="fatherName"
                  required
                  value={form.fatherName}
                  onChange={handleChange}
                  placeholder="Father's full name"
                  className={inputClass}
                />
              </motion.div>

              {/* FATHER QUALIFICATION */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="fatherQualification"
                  className={labelClass}
                >
                  Qualification
                  <Required />
                </label>

                <input
                  id="fatherQualification"
                  name="fatherQualification"
                  required
                  value={
                    form.fatherQualification
                  }
                  onChange={handleChange}
                  placeholder="Highest degree earned"
                  className={inputClass}
                />
              </motion.div>

              {/* FATHER OCCUPATION */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="fatherOccupation"
                  className={labelClass}
                >
                  Occupation
                  <Required />
                </label>

                <input
                  id="fatherOccupation"
                  name="fatherOccupation"
                  required
                  value={form.fatherOccupation}
                  onChange={handleChange}
                  placeholder="Profession / Business"
                  className={inputClass}
                />
              </motion.div>

              {/* FATHER INCOME */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="fatherIncome"
                  className={labelClass}
                >
                  Income (per Month)
                  <Required />
                </label>

                <input
                  id="fatherIncome"
                  name="fatherIncome"
                  required
                  value={form.fatherIncome}
                  onChange={handleChange}
                  placeholder="e.g. ₹50,000 / $5,000"
                  className={inputClass}
                />
              </motion.div>

              {/* MOTHER NAME */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="motherName"
                  className={labelClass}
                >
                  Mother&apos;s Name
                  <Required />
                </label>

                <input
                  id="motherName"
                  name="motherName"
                  required
                  value={form.motherName}
                  onChange={handleChange}
                  placeholder="Mother's full name"
                  className={inputClass}
                />
              </motion.div>

              {/* EX STUDENT */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="isExStudent"
                  className={labelClass}
                >
                  Is Ex-Student?
                  <Required />
                </label>

                <select
                  id="isExStudent"
                  name="isExStudent"
                  required
                  value={form.isExStudent}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    Select
                  </option>
                  <option value="Yes">
                    Yes
                  </option>
                  <option value="No">
                    No
                  </option>
                </select>
              </motion.div>

              {/* MOTHER QUALIFICATION */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="motherQualification"
                  className={labelClass}
                >
                  Qualification
                  <Required />
                </label>

                <input
                  id="motherQualification"
                  name="motherQualification"
                  required
                  value={
                    form.motherQualification
                  }
                  onChange={handleChange}
                  placeholder="Highest degree earned"
                  className={inputClass}
                />
              </motion.div>

              {/* MOTHER OCCUPATION */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="motherOccupation"
                  className={labelClass}
                >
                  Occupation
                  <Required />
                </label>

                <input
                  id="motherOccupation"
                  name="motherOccupation"
                  required
                  value={form.motherOccupation}
                  onChange={handleChange}
                  placeholder="Profession / Business"
                  className={inputClass}
                />
              </motion.div>

              {/* MOTHER INCOME */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="motherIncome"
                  className={labelClass}
                >
                  Income (per Month)
                  <Required />
                </label>

                <input
                  id="motherIncome"
                  name="motherIncome"
                  required
                  value={form.motherIncome}
                  onChange={handleChange}
                  placeholder="e.g. ₹40,000 / $4,000"
                  className={inputClass}
                />
              </motion.div>

              {/* MOTHER TONGUE */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="motherTongue"
                  className={labelClass}
                >
                  Mother Tongue
                  <Required />
                </label>

                <input
                  id="motherTongue"
                  name="motherTongue"
                  required
                  value={form.motherTongue}
                  onChange={handleChange}
                  placeholder="e.g. English, Tamil"
                  className={inputClass}
                />
              </motion.div>

              {/* SISTER */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="sisterInSchool"
                  className={labelClass}
                >
                  Does the applicant have any of her own
                  sister (not cousins) in this school?
                  <Required />
                </label>

                <select
                  id="sisterInSchool"
                  name="sisterInSchool"
                  required
                  value={form.sisterInSchool}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>
                </select>
              </motion.div>
            </motion.div>
          </section>

          {/* =================================================
              III. CONTACT
          ================================================= */}

          <section
            className="
              mt-[54px]

              sm:mt-[68px]
            "
          >
            <FormSectionTitle>
              III. Contact &amp; Correspondence
            </FormSectionTitle>

            <motion.div
              variants={container}
              className="
                grid

                grid-cols-1

                gap-x-[18px]
                gap-y-[22px]

                md:grid-cols-3
              "
            >
              {/* ADDRESS */}

              <motion.div
                variants={fadeUp}
                className="md:col-span-3"
              >
                <label
                  htmlFor="address"
                  className={labelClass}
                >
                  Residential Address
                  <Required />
                </label>

                <textarea
                  id="address"
                  name="address"
                  required
                  rows={4}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter complete residential address with PIN/ZIP code"
                  className="
                    min-h-[115px]

                    w-full

                    resize-none

                    rounded-[6px]

                    border
                    border-[#8CC1FF]

                    bg-white

                    px-[14px]
                    py-[14px]

                    font-secondary

                    text-[13px]

                    leading-[1.6]

                    text-[#1C1F24]

                    outline-none

                    transition-all
                    duration-300

                    placeholder:text-[#9BA2AC]

                    hover:border-[#4D9FFF]

                    focus:border-[#0075FF]
                    focus:ring-4
                    focus:ring-[#0075FF]/10

                    sm:text-[14px]
                  "
                />
              </motion.div>

              {/* EMAIL */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="email"
                  className={labelClass}
                >
                  Email
                  <Required />
                </label>

                <input
                  id="email"
                  name="email"
                  required
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="parent@example.com"
                  className={inputClass}
                />
              </motion.div>

              {/* PHONE */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="phone"
                  className={labelClass}
                >
                  Phone
                  <Required />
                </label>

                <input
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Primary contact number"
                  className={inputClass}
                />
              </motion.div>

              {/* ALT PHONE */}

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="alternativePhone"
                  className={labelClass}
                >
                  Alternative Phone
                  <Required />
                </label>

                <input
                  id="alternativePhone"
                  name="alternativePhone"
                  required
                  type="tel"
                  value={
                    form.alternativePhone
                  }
                  onChange={handleChange}
                  placeholder="Secondary contact number"
                  className={inputClass}
                />
              </motion.div>
            </motion.div>
          </section>

          {/* =================================================
              IV. ATTACHMENTS
          ================================================= */}

          <section
            className="
              mt-[54px]

              sm:mt-[68px]
            "
          >
            <FormSectionTitle>
              IV. Attachment Guidelines &amp; Submission
            </FormSectionTitle>

            <motion.div
              variants={container}
              className="
                space-y-[20px]
              "
            >
              {/* GUIDELINES */}

              <motion.div
                variants={fadeUp}
                className="
                  rounded-[8px]

                  bg-[#F1F6FB]

                  px-[18px]
                  py-[17px]

                  sm:px-[22px]
                  sm:py-[20px]
                "
              >
                <div
                  className="
                    flex

                    items-start

                    gap-[10px]
                  "
                >
                  <FileText
                    size={18}
                    className="
                      mt-[1px]

                      shrink-0

                      text-[#0075FF]
                    "
                  />

                  <div>
                    <h3
                      className="
                        font-primary

                        text-[13px]
                        font-semibold

                        text-[#1D232A]

                        sm:text-[14px]
                      "
                    >
                      The Following must be attached to this form
                      at the time of Submission:
                    </h3>

                    <ol
                      className="
                        mt-[10px]

                        space-y-[6px]

                        font-secondary

                        text-[11px]

                        leading-[1.5]

                        text-[#565F69]

                        sm:text-[12px]
                      "
                    >
                      <li>
                        1. Scanned Passport size photograph of
                        the child in JPEG format.
                      </li>

                      <li>
                        2. Scanned Signature of both Parents.
                      </li>
                    </ol>
                  </div>
                </div>
              </motion.div>

              {/* NOTE */}

              <motion.div
                variants={fadeUp}
                className="
                  rounded-[8px]

                  border
                  border-[#FFE0E0]

                  bg-[#FFF3F3]

                  px-[18px]
                  py-[17px]

                  sm:px-[22px]
                  sm:py-[20px]
                "
              >
                <h3
                  className="
                    font-primary

                    text-[12px]
                    font-semibold

                    text-[#FF4D4F]

                    sm:text-[13px]
                  "
                >
                  Please Note:
                </h3>

                <ul
                  className="
                    mt-[10px]

                    space-y-[7px]

                    font-secondary

                    text-[11px]

                    leading-[1.5]

                    text-[#62676E]

                    sm:text-[12px]
                  "
                >
                  <li
                    className="
                      flex
                      gap-[8px]
                    "
                  >
                    <span className="text-[#FF4D4F]">
                      •
                    </span>

                    The preliminary application is not a
                    guarantee for admission.
                  </li>

                  <li
                    className="
                      flex
                      gap-[8px]
                    "
                  >
                    <span className="text-[#FF4D4F]">
                      •
                    </span>

                    If your daughter is selected, you will
                    receive a mail from the Principal desk.
                  </li>
                </ul>
              </motion.div>

              {/* SIGNATURE */}

              <FileUpload
                label="Upload Signature"
                required
                file={signature}
                accept="image/jpeg,image/png,application/pdf"
                helper="Upload scanned signature of parents / guardian"
                onChange={(event) =>
                  setSignature(
                    event.target.files?.[0] ??
                      null
                  )
                }
              />

              {/* SUBMIT */}

              <motion.div
                variants={fadeUp}
                className="
                  pt-[10px]

                  sm:pt-[16px]
                "
              >
                <motion.button
                  type="submit"
                  whileHover={{
                    y: -3,
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="
                    inline-flex

                    h-[50px]

                    w-full

                    items-center
                    justify-center

                    gap-[8px]

                    rounded-[6px]

                    bg-[#0075FF]

                    px-[26px]

                    font-secondary

                    text-[12px]
                    font-medium

                    uppercase

                    tracking-[0.3px]

                    text-white

                    shadow-[0_12px_28px_rgba(0,117,255,0.20)]

                    transition-all
                    duration-300

                    hover:bg-[#0068DD]

                    hover:shadow-[0_16px_34px_rgba(0,117,255,0.28)]

                    sm:w-auto
                    sm:min-w-[235px]
                    sm:text-[13px]
                  "
                >
                  Submit Application Form
                </motion.button>
              </motion.div>
            </motion.div>
          </section>
        </form>
      </motion.div>

      {/* =====================================================
          SUCCESS MESSAGE
      ====================================================== */}

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 15,
              scale: 0.97,
            }}
            className="
              fixed

              bottom-[22px]
              left-1/2

              z-[9999]

              flex

              w-[calc(100%-28px)]
              max-w-[430px]

              -translate-x-1/2

              items-center

              gap-[12px]

              rounded-[10px]

              border
              border-[#CFE5FF]

              bg-white

              px-[17px]
              py-[14px]

              shadow-[0_18px_55px_rgba(18,55,90,0.20)]

              sm:bottom-[30px]
            "
          >
            <div
              className="
                flex

                h-[36px]
                w-[36px]

                shrink-0

                items-center
                justify-center

                rounded-full

                bg-[#EAF5FF]

                text-[#0075FF]
              "
            >
              <CheckCircle2 size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  font-primary

                  text-[13px]
                  font-semibold

                  text-[#1B2027]
                "
              >
                Application submitted
              </p>

              <p
                className="
                  mt-[2px]

                  font-secondary

                  text-[10px]

                  text-[#818A95]
                "
              >
                The preliminary admission form has been
                submitted successfully.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSubmitted(false)
              }
              className="
                flex

                h-[30px]
                w-[30px]

                items-center
                justify-center

                rounded-full

                text-[#8D96A1]

                transition-colors

                hover:bg-[#F4F7FA]
                hover:text-[#111827]
              "
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}