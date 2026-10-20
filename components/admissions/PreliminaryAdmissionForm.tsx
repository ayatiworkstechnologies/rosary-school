
"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

type FormState = {
  registrationNo: string;
  pupilName: string;
  dob: string;
  religion: string;
  placeOfBirth: string;
  fatherName: string;
  fatherQualification: string;
  fatherOccupation: string;
  fatherIncome: string;
  motherName: string;
  isExStudent: string;
  motherQualification: string;
  motherOccupation: string;
  motherIncome: string;
  motherTongue: string;
  siblingInSchool: string;
  siblingName: string;
  siblingClassSection: string;
  address: string;
  email: string;
  phone: string;
  alternativePhone: string;
};

type Notice = {
  type: "success" | "error";
  title: string;
  message: string;
};

const initialForm: FormState = {
  registrationNo: "",
  pupilName: "",
  dob: "",
  religion: "",
  placeOfBirth: "",
  fatherName: "",
  fatherQualification: "",
  fatherOccupation: "",
  fatherIncome: "",
  motherName: "",
  isExStudent: "",
  motherQualification: "",
  motherOccupation: "",
  motherIncome: "",
  motherTongue: "",
  siblingInSchool: "",
  siblingName: "",
  siblingClassSection: "",
  address: "",
  email: "",
  phone: "",
  alternativePhone: "",
};

const inputClass =
  "block h-[46px] w-full min-w-0 rounded-[8px] border border-[#C5D7ED] bg-white px-[14px] font-secondary text-[13px] text-[#10284D] outline-none transition-all duration-200 placeholder:text-[#94A3B8] hover:border-[#83B6F5] focus:border-[#0075FF] focus:ring-[3px] focus:ring-[#0075FF]/10 sm:h-[48px] sm:text-[14px]";

const labelClass =
  "mb-[8px] block font-secondary text-[12px] font-semibold leading-[1.5] text-[#10284D] sm:text-[13px]";

const gridClass =
  "grid grid-cols-1 gap-x-[18px] gap-y-[20px] sm:grid-cols-2 lg:gap-x-[24px]";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

function Required() {
  return (
    <span aria-hidden="true" className="ml-1 text-red-500">
      *
    </span>
  );
}

function SectionTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-[22px] border-b border-[#C5DFFF] pb-[12px]">
      <h2 className="flex items-center gap-3 font-primary text-[14px] font-bold uppercase tracking-[0.2px] text-[#0056C9] sm:text-[16px]">
        <span className="h-[22px] w-[4px] shrink-0 rounded-full bg-[#0075FF]" />
        {children}
      </h2>
    </div>
  );
}

type InputProps = {
  name: keyof FormState;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
  pattern?: string;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
};

function InputField({
  name,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = true,
  min,
  max,
  pattern,
  maxLength,
  inputMode,
}: InputProps) {
  return (
    <motion.div variants={fadeUp} className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <Required />}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        pattern={pattern}
        maxLength={maxLength}
        inputMode={inputMode}
        className={inputClass}
      />
    </motion.div>
  );
}

type SelectProps = {
  name: "religion" | "motherTongue";
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

function SelectField({
  name,
  label,
  value,
  options,
  placeholder,
  onChange,
}: SelectProps) {
  return (
    <motion.div variants={fadeUp} className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
        <Required />
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required
          className={`${inputClass} cursor-pointer appearance-none pr-[48px]`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2 text-[#344563]"
        />
      </div>
    </motion.div>
  );
}

type YesNoProps = {
  name: "isExStudent" | "siblingInSchool";
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function YesNoField({
  name,
  label,
  value,
  onChange,
}: YesNoProps) {
  return (
    <motion.fieldset variants={fadeUp} className="min-w-0">
      <legend className={labelClass}>
        {label}
        <Required />
      </legend>
      <div className="flex flex-wrap gap-3">
        {(["Yes", "No"] as const).map((option) => (
          <label
            key={option}
            className={`flex min-h-[42px] cursor-pointer items-center gap-[10px] rounded-[8px] border px-[18px] font-secondary text-[13px] transition-all ${
              value === option
                ? "border-[#0075FF] bg-[#EFF7FF] text-[#0056C9]"
                : "border-[#D8E5F5] bg-white text-[#344563] hover:border-[#83B6F5]"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              required
              className="h-4 w-4 accent-[#0075FF]"
            />
            {option}
          </label>
        ))}
      </div>
    </motion.fieldset>
  );
}

export default function PreliminaryAdmissionForm() {
  const [form, setForm] = useState<FormState>({
    ...initialForm,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setNotice(null);

    setForm((previous) => {
      if (name === "siblingInSchool") {
        return {
          ...previous,
          siblingInSchool: value,
          siblingName: value === "Yes" ? previous.siblingName : "",
          siblingClassSection:
            value === "Yes" ? previous.siblingClassSection : "",
        };
      }

      return { ...previous, [name]: value };
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setNotice(null);

    if (
      form.siblingInSchool === "Yes" &&
      (!form.siblingName.trim() ||
        !form.siblingClassSection.trim())
    ) {
      setNotice({
        type: "error",
        title: "Missing Sibling Details",
        message: "Please enter sibling name and class/section.",
      });
      return;
    }

    // These keys exactly match the Ayatiworks module schema.
    const payload = {
      data: {
        registration_no: form.registrationNo.trim(),
        name_of_the_pupil: form.pupilName.trim(),
        date_of_birth: form.dob,
        religion: form.religion,
        place_of_birth: form.placeOfBirth.trim(),

        father_s_name: form.fatherName.trim(),
        father_s_qualification: form.fatherQualification.trim(),
        father_s_occupation: form.fatherOccupation.trim(),
        father_s_income_per_month: form.fatherIncome.trim(),

        mother_s_name: form.motherName.trim(),
        is_she_a_passed_student_of_rosary: form.isExStudent,
        mother_s_qualification: form.motherQualification.trim(),
        mother_s_occupation: form.motherOccupation.trim(),
        mother_s_income_per_month: form.motherIncome.trim(),
        mother_tongue: form.motherTongue,

        does_the_applicant_have_any_siblings_studying_in_this_school:
          form.siblingInSchool,

        name_of_the_sibling:
          form.siblingInSchool === "Yes"
            ? form.siblingName.trim()
            : "",

        class_and_section:
          form.siblingInSchool === "Yes"
            ? form.siblingClassSection.trim()
            : "",

        permanent_address: form.address.trim(),
        email: form.email.trim(),
        phone_number: form.phone.trim(),
        alternative_phone_number: form.alternativePhone.trim(),
      },
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/rosary-lkg-admission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        }
      );

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || "Unable to submit the application."
        );
      }

      setNotice({
        type: "success",
        title: "Application Submitted Successfully!",
        message:
          result.message ||
          "Your LKG admission application has been received.",
      });

      setForm({ ...initialForm });
    } catch (error) {
      setNotice({
        type: "error",
        title: "Submission Not Confirmed",
        message:
          error instanceof Error
            ? error.message
            : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-[#F7FAFF] py-6 sm:py-10 lg:py-14">
        <div className="pointer-events-none absolute -left-[120px] top-[100px] h-[300px] w-[300px] rounded-full bg-[#0075FF]/5 blur-[90px]" />
        <div className="pointer-events-none absolute -right-[100px] top-[350px] h-[350px] w-[350px] rounded-full bg-[#0075FF]/5 blur-[100px]" />

        <div className="relative mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[14px] border border-[#DCE9F8] bg-white shadow-[0_16px_50px_rgba(20,66,120,0.06)] sm:rounded-[18px]"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-[#E7F4FF] via-[#F4FAFF] to-[#DCEEFF] px-[18px] py-7 text-center sm:px-8 sm:py-[34px] lg:py-[42px]">
              <div className="pointer-events-none absolute -left-[60px] -top-[100px] h-[250px] w-[250px] rotate-45 bg-[#0075FF]/5" />
              <div className="pointer-events-none absolute -right-[90px] -bottom-[120px] h-[280px] w-[280px] rounded-full border-[45px] border-[#0075FF]/5" />

              <div className="relative z-10 mx-auto max-w-[850px]">
                <span className="mb-3 inline-flex rounded-full border border-[#BBD9FF] bg-white/70 px-[13px] py-[6px] font-secondary text-[10px] font-semibold uppercase tracking-[1px] text-[#0065D8] sm:text-[11px]">
                  Admissions Open
                </span>
                <h1 className="font-primary text-[21px] font-bold leading-[1.3] tracking-[-0.4px] text-[#07347A] sm:text-[27px] lg:text-[32px]">
                  Rosary Matriculation Higher Secondary School
                </h1>
                <p className="mt-[10px] font-secondary text-[13px] font-medium text-[#62758F] sm:text-[16px]">
                  LKG Application Form 2026 - 2027
                </p>
                <p className="mt-[9px] font-secondary text-[11px] leading-[1.6] text-[#74869D] sm:text-[12px]">
                  Please complete all required details carefully before submitting.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-[34px] px-[18px] py-[26px] sm:space-y-[42px] sm:px-[30px] sm:py-[34px] lg:px-[42px] lg:py-[42px]">
                {/* PERSONAL DETAILS */}
                <section>
                  <SectionTitle>Personal Details</SectionTitle>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`${gridClass} lg:grid-cols-3`}
                  >
                    <InputField
                      name="registrationNo"
                      label="Registration No."
                      value={form.registrationNo}
                      onChange={handleChange}
                      placeholder="Enter registration number"
                      maxLength={30}
                    />
                    <InputField
                      name="pupilName"
                      label="Name of the Pupil"
                      value={form.pupilName}
                      onChange={handleChange}
                      placeholder="Enter name of the pupil"
                    />
                    <InputField
                      name="dob"
                      label="Date of Birth"
                      type="date"
                      value={form.dob}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    <SelectField
                      name="religion"
                      label="Religion"
                      value={form.religion}
                      onChange={handleChange}
                      placeholder="Select religion"
                      options={["Hindu", "Christian", "Muslim", "Other"]}
                    />
                    <InputField
                      name="placeOfBirth"
                      label="Place of Birth"
                      value={form.placeOfBirth}
                      onChange={handleChange}
                      placeholder="Enter place of birth"
                    />
                  </motion.div>
                </section>

                {/* FATHER'S DETAILS */}
                <section>
                  <SectionTitle>Father&apos;s Details</SectionTitle>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`${gridClass} lg:grid-cols-4`}
                  >
                    <InputField
                      name="fatherName"
                      label="Father's Name"
                      value={form.fatherName}
                      onChange={handleChange}
                      placeholder="Enter father's name"
                    />
                    <InputField
                      name="fatherQualification"
                      label="Qualification"
                      value={form.fatherQualification}
                      onChange={handleChange}
                      placeholder="Enter father's qualification"
                    />
                    <InputField
                      name="fatherOccupation"
                      label="Occupation"
                      value={form.fatherOccupation}
                      onChange={handleChange}
                      placeholder="Enter father's occupation"
                    />
                    <InputField
                      name="fatherIncome"
                      label="Income (per Month)"
                      type="number"
                      min="0"
                      value={form.fatherIncome}
                      onChange={handleChange}
                      placeholder="Enter monthly income"
                    />
                  </motion.div>
                </section>

                {/* MOTHER'S DETAILS */}
                <section>
                  <SectionTitle>Mother&apos;s Details</SectionTitle>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`${gridClass} lg:grid-cols-4`}
                  >
                    <InputField
                      name="motherName"
                      label="Mother's Name"
                      value={form.motherName}
                      onChange={handleChange}
                      placeholder="Enter mother's name"
                    />
                    <YesNoField
                      name="isExStudent"
                      label="Is she a Passed student of Rosary?"
                      value={form.isExStudent}
                      onChange={handleChange}
                    />
                    <InputField
                      name="motherQualification"
                      label="Qualification"
                      value={form.motherQualification}
                      onChange={handleChange}
                      placeholder="Enter mother's qualification"
                    />
                    <InputField
                      name="motherOccupation"
                      label="Occupation"
                      value={form.motherOccupation}
                      onChange={handleChange}
                      placeholder="Enter mother's occupation"
                    />
                    <InputField
                      name="motherIncome"
                      label="Income (per Month)"
                      type="number"
                      min="0"
                      value={form.motherIncome}
                      onChange={handleChange}
                      placeholder="Enter monthly income"
                    />
                    <SelectField
                      name="motherTongue"
                      label="Mother Tongue"
                      value={form.motherTongue}
                      onChange={handleChange}
                      placeholder="Select mother tongue"
                      options={[
                        "Tamil",
                        "English",
                        "Telugu",
                        "Malayalam",
                        "Kannada",
                        "Hindi",
                        "Other",
                      ]}
                    />
                  </motion.div>
                </section>

                {/* SIBLING DETAILS */}
                <section>
                  <SectionTitle>Sibling Details</SectionTitle>
                  <YesNoField
                    name="siblingInSchool"
                    label="Does the applicant have any siblings studying in this school?"
                    value={form.siblingInSchool}
                    onChange={handleChange}
                  />

                  <AnimatePresence initial={false}>
                    {form.siblingInSchool === "Yes" && (
                      <motion.div
                        key="sibling-fields"
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 grid grid-cols-1 gap-5 rounded-[12px] border border-[#D9E8FB] bg-[#F7FBFF] p-[18px] sm:grid-cols-2 sm:p-[22px]">
                          <InputField
                            name="siblingName"
                            label="Name of the Sibling"
                            value={form.siblingName}
                            onChange={handleChange}
                            placeholder="Enter name of the sibling"
                          />
                          <InputField
                            name="siblingClassSection"
                            label="Class and Section"
                            value={form.siblingClassSection}
                            onChange={handleChange}
                            placeholder="Enter class and section"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>

                {/* CONTACT DETAILS */}
                <section>
                  <SectionTitle>Contact Details</SectionTitle>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6"
                  >
                    <motion.div variants={fadeUp} className="min-w-0">
                      <label htmlFor="address" className={labelClass}>
                        Permanent Address
                        <Required />
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        required
                        rows={5}
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Enter permanent address"
                        className={`${inputClass} !h-auto min-h-[150px] resize-y py-[13px]`}
                      />
                    </motion.div>

                    <div className="grid min-w-0 grid-cols-1 gap-5">
                      <InputField
                        name="email"
                        label="Email ID"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email ID"
                      />
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <InputField
                          name="phone"
                          label="Phone Number"
                          type="tel"
                          inputMode="tel"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                        />
                        <InputField
                          name="alternativePhone"
                          label="Alternative Phone Number"
                          type="tel"
                          inputMode="tel"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          required={false}
                          value={form.alternativePhone}
                          onChange={handleChange}
                          placeholder="Enter alternative phone number"
                        />
                      </div>
                    </div>
                  </motion.div>
                </section>
              </div>

              <div className="flex flex-col gap-[14px] border-t border-[#E0ECFA] bg-[#F4F9FF] px-[18px] py-5 sm:flex-row sm:items-center sm:justify-between sm:px-[30px] lg:px-[42px]">
                <p className="font-secondary text-[11px] leading-[1.6] text-[#71829A] sm:max-w-[440px]">
                  Please review all information before submitting your application.
                </p>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={isSubmitting ? undefined : { y: -2 }}
                  whileTap={isSubmitting ? undefined : { scale: 0.98 }}
                  className="inline-flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[8px] bg-[#0075FF] px-7 font-secondary text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(0,117,255,0.18)] transition-colors hover:bg-[#0065DF] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[220px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight size={17} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* GREEN SUCCESS / RED ERROR TOAST */}
      <AnimatePresence>
        {notice && (
          <motion.div
            key={`${notice.type}-${notice.title}`}
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            role={notice.type === "error" ? "alert" : "status"}
            className={`fixed bottom-5 left-1/2 z-[9999] flex w-[calc(100%-28px)] max-w-[450px] -translate-x-1/2 items-start gap-3 rounded-[12px] border p-[16px] shadow-[0_18px_50px_rgba(18,55,90,0.15)] ${
              notice.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div
              className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full ${
                notice.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {notice.type === "success" ? (
                <CheckCircle2 size={21} />
              ) : (
                <AlertCircle size={21} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`font-secondary text-[14px] font-bold ${
                  notice.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {notice.title}
              </p>
              <p
                className={`mt-[4px] font-secondary text-[12px] leading-[1.6] ${
                  notice.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {notice.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Close notification"
              className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full ${
                notice.type === "success"
                  ? "text-green-700 hover:bg-green-100"
                  : "text-red-700 hover:bg-red-100"
              }`}
            >
              <X size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
