
"use client";

import {
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileImage,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";

type FormState = {
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

type FileKey =
  | "student_passport_size_photo"
  | "father_s_signature"
  | "mother_s_signature";

type ApiResponse = {
  success?: boolean;
  message?: string;
  registration_no?: string;
};

const initialForm: FormState = {
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

const initialFiles: Record<FileKey, File | null> = {
  student_passport_size_photo: null,
  father_s_signature: null,
  mother_s_signature: null,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const inputClass =
  "block h-12 w-full min-w-0 rounded-lg border border-[#C5D7ED] bg-white px-4 text-sm text-[#10284D] outline-none transition placeholder:text-[#94A3B8] hover:border-[#83B6F5] focus:border-[#0075FF] focus:ring-[3px] focus:ring-[#0075FF]/10";

const labelClass =
  "mb-2 block text-[13px] font-semibold leading-5 text-[#10284D]";

function Required() {
  return <span className="ml-1 text-red-500">*</span>;
}

function SectionTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-6 border-b border-[#C5DFFF] pb-3">
      <h2 className="flex items-center gap-3 text-[15px] font-bold uppercase text-[#0056C9] sm:text-base">
        <span className="h-6 w-1 shrink-0 rounded-full bg-[#0075FF]" />
        {children}
      </h2>
    </div>
  );
}

type InputProps = {
  name: keyof FormState;
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  max?: string;
  pattern?: string;
  maxLength?: number;
};

function InputField({
  name,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
  min,
  max,
  pattern,
  maxLength,
}: InputProps) {
  return (
    <div className="min-w-0">
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
        className={inputClass}
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  name: "religion" | "motherTongue";
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (
    event: ChangeEvent<HTMLSelectElement>
  ) => void;
}) {
  return (
    <div className="min-w-0">
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
          className={`${inputClass} cursor-pointer appearance-none pr-12`}
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
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#344563]"
        />
      </div>
    </div>
  );
}

function YesNoField({
  name,
  label,
  value,
  onChange,
}: {
  name: "isExStudent" | "siblingInSchool";
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className={labelClass}>
        {label}
        <Required />
      </legend>

      <div className="flex flex-wrap gap-3">
        {(["Yes", "No"] as const).map((option) => (
          <label
            key={option}
            className={`inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-lg border px-5 py-2 text-sm transition ${
              value === option
                ? "border-[#0075FF] bg-[#EFF7FF] text-[#0056C9]"
                : "border-[#D8E5F5] bg-white text-[#344563]"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              required
              className="accent-[#0075FF]"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function UploadField({
  id,
  label,
  file,
  onChange,
  onError,
}: {
  id: FileKey;
  label: string;
  file: File | null;
  onChange: (key: FileKey, file: File) => void;
  onError: (message: string) => void;
}) {
  const handleFile = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (selected.size >= MAX_FILE_SIZE) {
      event.target.value = "";
      onError(`${label} must be smaller than 5 MB.`);
      return;
    }

    if (!ALLOWED_TYPES.includes(selected.type)) {
      event.target.value = "";
      onError(
        `${label} must be a JPG, PNG or WebP image.`
      );
      return;
    }

    onChange(id, selected);
  };

  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>
        {label}
        <Required />
      </label>

      <label
        htmlFor={id}
        className="flex min-h-[165px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#B9D6F8] bg-[#F8FBFF] p-4 text-center transition hover:border-[#0075FF] hover:bg-[#F0F7FF] sm:p-5"
      >
        {file ? (
          <>
            <FileImage
              size={29}
              className="mb-3 text-[#0075FF]"
            />

            <span className="max-w-full break-all text-[13px] font-semibold text-[#173B68]">
              {file.name}
            </span>

            <span className="mt-2 text-xs text-[#71829A]">
              {(file.size / 1024).toFixed(1)} KB
            </span>

            <span className="mt-3 text-xs font-medium text-[#0075FF]">
              Click to replace
            </span>
          </>
        ) : (
          <>
            <UploadCloud
              size={31}
              className="mb-3 text-[#0075FF]"
            />

            <span className="text-[13px] font-semibold text-[#173B68]">
              Click to upload image
            </span>

            <span className="mt-2 text-xs text-[#71829A]">
              JPG, PNG or WebP
            </span>

            <span className="mt-1 text-xs text-[#0075FF]">
              Less than 5 MB
            </span>
          </>
        )}
      </label>

      <input
        id={id}
        name={id}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFile}
        required={!file}
        className="sr-only"
      />
    </div>
  );
}

export default function PreliminaryAdmissionForm() {
  const [form, setForm] = useState<FormState>({
    ...initialForm,
  });

  const [files, setFiles] = useState<
    Record<FileKey, File | null>
  >({
    ...initialFiles,
  });

  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [registrationNo, setRegistrationNo] =
    useState("");

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setErrorMessage("");

    setForm((previous) => {
      if (name === "siblingInSchool") {
        return {
          ...previous,
          siblingInSchool: value,
          siblingName:
            value === "Yes"
              ? previous.siblingName
              : "",
          siblingClassSection:
            value === "Yes"
              ? previous.siblingClassSection
              : "",
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  const handleFileChange = (
    key: FileKey,
    file: File
  ) => {
    setErrorMessage("");

    setFiles((previous) => ({
      ...previous,
      [key]: file,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage("");

    if (
      form.siblingInSchool === "Yes" &&
      (!form.siblingName.trim() ||
        !form.siblingClassSection.trim())
    ) {
      setErrorMessage(
        "Please enter the sibling's name, class and section."
      );
      return;
    }

    const requiredUploads: FileKey[] = [
      "student_passport_size_photo",
      "father_s_signature",
      "mother_s_signature",
    ];

    for (const key of requiredUploads) {
      const file = files[key];

      if (!file) {
        setErrorMessage(
          "Please upload the student's photo and both parents' signatures."
        );
        return;
      }

      if (file.size >= MAX_FILE_SIZE) {
        setErrorMessage(
          "Each uploaded image must be smaller than 5 MB."
        );
        return;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMessage(
          "Only JPG, PNG and WebP images are supported."
        );
        return;
      }
    }

    const payload = new FormData();

    // Existing backend field names are unchanged.
    const fields: Record<string, string> = {
      name_of_the_pupil: form.pupilName.trim(),
      date_of_birth: form.dob,
      religion: form.religion,
      place_of_birth: form.placeOfBirth.trim(),

      father_s_name: form.fatherName.trim(),
      father_s_qualification:
        form.fatherQualification.trim(),
      father_s_occupation:
        form.fatherOccupation.trim(),
      father_s_income_per_month:
        form.fatherIncome.trim(),

      mother_s_name: form.motherName.trim(),
      is_she_a_past_pupil_of_rosary:
        form.isExStudent,
      mother_s_qualification:
        form.motherQualification.trim(),
      mother_s_occupation:
        form.motherOccupation.trim(),
      mother_s_income_per_month:
        form.motherIncome.trim(),
      mother_tongue: form.motherTongue,

      does_the_applicant_have_any_sibling_s_studying_in_this_school:
        form.siblingInSchool,

      name_of_the_sibling:
        form.siblingInSchool === "Yes"
          ? form.siblingName.trim()
          : "",

      class_and_section:
        form.siblingInSchool === "Yes"
          ? form.siblingClassSection.trim()
          : "",

      address: form.address.trim(),
      email: form.email.trim(),
      phone_number: form.phone.trim(),
      alternative_phone_number:
        form.alternativePhone.trim(),
    };

    for (const [key, value] of Object.entries(fields)) {
      payload.append(key, value);
    }

    for (const key of requiredUploads) {
      payload.append(key, files[key]!);
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/rosary-lkg-admission",
        {
          method: "POST",
          body: payload,
          cache: "no-store",
        }
      );

      const result: ApiResponse =
        await response.json();

      if (
        !response.ok ||
        result.success !== true
      ) {
        throw new Error(
          result.message ||
            "Unable to submit application."
        );
      }

      if (!result.registration_no) {
        throw new Error(
          "Submission response did not include a registration number. Please contact the school."
        );
      }

      setRegistrationNo(result.registration_no);
      setSuccessOpen(true);

      // Reset both React state and native file inputs.
      formRef.current?.reset();

      setForm({ ...initialForm });
      setFiles({ ...initialFiles });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to confirm application submission."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-[#F7FAFF] px-3 py-5 sm:px-5 sm:py-8 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-[1440px] overflow-hidden rounded-2xl border border-[#DCE9F8] bg-white shadow-[0_16px_50px_rgba(20,66,120,0.06)]">
          {/* HEADER */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#E7F4FF] via-[#F4FAFF] to-[#DCEEFF] px-4 py-8 text-center sm:px-8 sm:py-10 lg:py-12">
            <span className="inline-flex items-center justify-center rounded-full border border-[#BBD9FF] bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#0065D8] sm:text-xs">
              Admissions Open
            </span>

            <h1 className="mx-auto mt-4 max-w-[1000px] text-[22px] font-bold leading-[1.35] text-[#07347A] sm:text-[28px] lg:text-[36px]">
              Rosary Matriculation Higher Secondary School
            </h1>

            <p className="mt-3 text-sm font-medium text-[#62758F] sm:text-base">
              LKG Application Form 2027 - 2028
            </p>

            <p className="mt-1 text-xs leading-5 text-[#74869D] sm:text-sm">
              Please complete all required details carefully.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="space-y-10 px-4 py-7 sm:px-7 sm:py-9 lg:px-11 lg:py-11">
              {/* PERSONAL DETAILS */}
              <section>
                <SectionTitle>
                  Personal Details
                </SectionTitle>

                {/* Registration number generated after submission. */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  <InputField
                    name="pupilName"
                    label="Name of the Pupil"
                    value={form.pupilName}
                    onChange={handleChange}
                    placeholder="Enter pupil name"
                  />

                  <InputField
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    max={new Date()
                      .toISOString()
                      .slice(0, 10)}
                  />

                  <SelectField
                    name="religion"
                    label="Religion"
                    value={form.religion}
                    onChange={handleChange}
                    placeholder="Select religion"
                    options={[
                      "Hindu",
                      "Christian",
                      "Muslim",
                      "Other",
                    ]}
                  />

                  <InputField
                    name="placeOfBirth"
                    label="Place of Birth"
                    value={form.placeOfBirth}
                    onChange={handleChange}
                    placeholder="Enter place of birth"
                  />
                </div>
              </section>

              {/* FATHER */}
              <section>
                <SectionTitle>
                  Father&apos;s Details
                </SectionTitle>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
                    placeholder="Enter qualification"
                  />

                  <InputField
                    name="fatherOccupation"
                    label="Occupation"
                    value={form.fatherOccupation}
                    onChange={handleChange}
                    placeholder="Enter occupation"
                  />

                  <InputField
                    name="fatherIncome"
                    label="Income (per month)"
                    type="number"
                    min="0"
                    value={form.fatherIncome}
                    onChange={handleChange}
                    placeholder="Enter monthly income"
                  />
                </div>
              </section>

              {/* MOTHER */}
              <section>
                <SectionTitle>
                  Mother&apos;s Details
                </SectionTitle>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  <InputField
                    name="motherName"
                    label="Mother's Name"
                    value={form.motherName}
                    onChange={handleChange}
                    placeholder="Enter mother's name"
                  />

                  <YesNoField
                    name="isExStudent"
                    label="Is she a past pupil of Rosary?"
                    value={form.isExStudent}
                    onChange={handleChange}
                  />

                  <InputField
                    name="motherQualification"
                    label="Qualification"
                    value={form.motherQualification}
                    onChange={handleChange}
                    placeholder="Enter qualification"
                  />

                  <InputField
                    name="motherOccupation"
                    label="Occupation"
                    value={form.motherOccupation}
                    onChange={handleChange}
                    placeholder="Enter occupation"
                  />

                  <InputField
                    name="motherIncome"
                    label="Income (per month)"
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
                </div>
              </section>

              {/* SIBLING */}
              <section>
                <SectionTitle>
                  Sibling Details
                </SectionTitle>

                <YesNoField
                  name="siblingInSchool"
                  label="Does the applicant have any sibling(s) studying in this school?"
                  value={form.siblingInSchool}
                  onChange={handleChange}
                />

                <AnimatePresence>
                  {form.siblingInSchool === "Yes" && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 grid grid-cols-1 gap-5 rounded-xl border border-[#D9E8FB] bg-[#F7FBFF] p-4 sm:grid-cols-2 sm:p-5">
                        <InputField
                          name="siblingName"
                          label="Name of the Sibling"
                          value={form.siblingName}
                          onChange={handleChange}
                          placeholder="Enter sibling name"
                        />

                        <InputField
                          name="siblingClassSection"
                          label="Class and Section"
                          value={
                            form.siblingClassSection
                          }
                          onChange={handleChange}
                          placeholder="Example: III - A"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* CONTACT */}
              <section>
                <SectionTitle>
                  Contact Details
                </SectionTitle>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="min-w-0">
                    <label
                      htmlFor="address"
                      className={labelClass}
                    >
                      Permanent Address
                      <Required />
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      rows={6}
                      required
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter permanent address"
                      className={`${inputClass} !h-auto min-h-[155px] resize-y py-3`}
                    />
                  </div>

                  <div className="min-w-0 space-y-5">
                    <InputField
                      name="email"
                      label="Email ID"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <InputField
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                      />

                      <InputField
                        name="alternativePhone"
                        label="Alternative Phone Number"
                        type="tel"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required={false}
                        value={form.alternativePhone}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* UPLOADS */}
              <section>
                <SectionTitle>
                  Photo &amp; Signature Uploads
                </SectionTitle>

                <p className="mb-5 text-[13px] leading-6 text-[#71829A] sm:text-sm">
                  Upload the student&apos;s passport-size
                  photo and both parents&apos; signatures.
                  Each image must be smaller than 5 MB.
                </p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  <UploadField
                    id="student_passport_size_photo"
                    label="Student Passport Size Photo"
                    file={
                      files.student_passport_size_photo
                    }
                    onChange={handleFileChange}
                    onError={setErrorMessage}
                  />

                  <UploadField
                    id="father_s_signature"
                    label="Father's Signature"
                    file={files.father_s_signature}
                    onChange={handleFileChange}
                    onError={setErrorMessage}
                  />

                  <UploadField
                    id="mother_s_signature"
                    label="Mother's Signature"
                    file={files.mother_s_signature}
                    onChange={handleFileChange}
                    onError={setErrorMessage}
                  />
                </div>
              </section>

              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-[13px] leading-6 text-red-700 sm:px-5 sm:text-sm"
                >
                  {errorMessage}
                </div>
              )}
            </div>

            {/* SUBMIT */}
            <div className="flex flex-col gap-4 border-t border-[#E0ECFA] bg-[#F4F9FF] px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-11">
              <p className="text-center text-xs leading-5 text-[#71829A] sm:text-left">
                Please review all information before submitting.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0075FF] px-8 text-sm font-semibold text-white transition hover:bg-[#0065DF] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {successOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#071C3A]/65 px-4 py-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admission-success-title"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.95,
              }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[470px] rounded-2xl bg-white px-5 py-8 text-center shadow-2xl sm:px-10 sm:py-10"
            >
              <button
                type="button"
                onClick={() => setSuccessOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-lg p-2 text-[#71829A] transition hover:bg-[#F1F5F9]"
              >
                <X size={20} />
              </button>

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E9F8EF]">
                <CheckCircle2
                  size={44}
                  className="text-[#178449]"
                />
              </div>

              <h2
                id="admission-success-title"
                className="mt-6 text-[22px] font-bold leading-snug text-[#0755AD] sm:text-2xl"
              >
                Application Submitted Successfully!
              </h2>

              <p className="mt-3 text-[13px] leading-7 text-[#62758F] sm:text-sm">
                Thank you for applying to Rosary
                Matriculation Higher Secondary School.
                Your LKG admission application has
                been received.
              </p>

              <div className="mt-7 rounded-xl border border-[#CDE2FF] bg-[#F4F9FF] px-4 py-6 sm:px-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#71829A]">
                  Registration No.
                </p>

                <p className="mt-3 break-all text-[26px] font-extrabold tracking-wide text-[#0075FF] sm:text-3xl">
                  {registrationNo}
                </p>
              </div>

              <p className="mt-5 text-xs leading-6 text-[#71829A]">
                Please save this registration number
                for future reference.
              </p>

              <button
                type="button"
                onClick={() => setSuccessOpen(false)}
                className="mt-7 h-12 w-full rounded-lg bg-[#0075FF] text-sm font-semibold text-white transition hover:bg-[#0065DF]"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
