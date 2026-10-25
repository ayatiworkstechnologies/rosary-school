
"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileImage,
  Loader2,
  X,
} from "lucide-react";

// =====================================================
// SETTINGS
// =====================================================

const MAX_DOB = "2024-12-31";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_IMAGE_SIZE = 3 * 1024 * 1024; // Compressed images sent to Next.js

const inputClass =
  "block h-12 w-full min-w-0 rounded-lg border " +
  "border-[#C5D8F1] bg-white px-4 text-sm " +
  "text-[#10284D] outline-none transition " +
  "placeholder:text-slate-400 " +
  "hover:border-[#90BDF5] " +
  "focus:border-[#0075FF] focus:ring-[3px] " +
  "focus:ring-[#0075FF]/10";

// =====================================================
// TYPES
// =====================================================

type FormValues = {
  name_of_the_pupil: string;
  date_of_birth: string;
  religion: string;
  place_of_birth: string;
  name_of_parish: string;
  religion_others: string;

  father_s_name: string;
  father_s_qualification: string;
  father_s_occupation: string;
  father_s_income_per_month: string;

  mother_s_name: string;
  is_she_a_past_pupil_of_rosary: string;
  mother_s_qualification: string;
  mother_s_occupation: string;
  mother_s_income_per_month: string;

  mother_tongue: string;
  mother_tongue_others: string;

  does_the_applicant_have_any_sibling_s_studying_in_this_school: string;
  name_of_the_sibling: string;
  class_and_section: string;

  address: string;
  email: string;
  phone_number: string;
  alternative_phone_number: string;
};

type ImageKey =
  | "student_s_passport_size_photograph"
  | "father_s_signature"
  | "mother_s_signature";

type ApiResult = {
  success?: boolean;
  message?: string;
  registration_no?: string;
};

type ImageRecord = Record<ImageKey, File | null>;

const INITIAL: FormValues = {
  name_of_the_pupil: "",
  date_of_birth: "",
  religion: "",
  place_of_birth: "",
  name_of_parish: "",
  religion_others: "",

  father_s_name: "",
  father_s_qualification: "",
  father_s_occupation: "",
  father_s_income_per_month: "",

  mother_s_name: "",
  is_she_a_past_pupil_of_rosary: "",
  mother_s_qualification: "",
  mother_s_occupation: "",
  mother_s_income_per_month: "",

  mother_tongue: "",
  mother_tongue_others: "",

  does_the_applicant_have_any_sibling_s_studying_in_this_school:
    "",
  name_of_the_sibling: "",
  class_and_section: "",

  address: "",
  email: "",
  phone_number: "",
  alternative_phone_number: "",
};

const EMPTY_IMAGES: ImageRecord = {
  student_s_passport_size_photograph: null,
  father_s_signature: null,
  mother_s_signature: null,
};

const OPTIONAL_TEXT_FIELDS = new Set<keyof FormValues>([
  "alternative_phone_number", "name_of_parish", "religion_others",
  "mother_tongue_others", "name_of_the_sibling", "class_and_section",
]);

function validateField(name: keyof FormValues, value: string, all: FormValues): true | string {
  const cleaned = value.trim();
  const conditionallyRequired =
    (name === "name_of_parish" && all.religion === "Christian - Roman Catholic") ||
    (name === "religion_others" && all.religion === "Others") ||
    (name === "mother_tongue_others" && all.mother_tongue === "Others") ||
    (["name_of_the_sibling", "class_and_section"] as (keyof FormValues)[]).includes(name) &&
      all.does_the_applicant_have_any_sibling_s_studying_in_this_school === "Yes";
  if (!cleaned && (!OPTIONAL_TEXT_FIELDS.has(name) || conditionallyRequired)) return "This field is required.";
  if (!cleaned) return true;
  if (name === "date_of_birth" && (cleaned > MAX_DOB || !/^\d{4}-\d{2}-\d{2}$/.test(cleaned))) return "Date of birth must be on or before 31 December 2024.";
  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) return "Enter a valid email address.";
  if (name === "phone_number" && !/^\d{10}$/.test(cleaned)) return "Enter a valid 10-digit phone number.";
  if (name === "alternative_phone_number" && !/^\d{10}$/.test(cleaned)) return "Enter a valid 10-digit alternative number.";
  if ((name === "father_s_income_per_month" || name === "mother_s_income_per_month") && (!/^\d+(\.\d{1,2})?$/.test(cleaned) || Number(cleaned) < 0)) return "Enter a valid monthly income.";
  if (name === "address" && cleaned.length < 10) return "Address must contain at least 10 characters.";
  if (cleaned.length > (name === "address" ? 500 : 150)) return `Maximum ${name === "address" ? 500 : 150} characters allowed.`;
  return true;
}

function FieldError({ name }: { name: keyof FormValues }) {
  const { formState: { errors } } = useFormContext<FormValues>();
  const message = errors[name]?.message;
  return message ? <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">{String(message)}</p> : null;
}

const IMAGE_FIELDS: {
  key: ImageKey;
  label: string;
}[] = [
  {
    key: "student_s_passport_size_photograph",
    label: "Student’s Passport-Size Photograph",
  },
  {
    key: "father_s_signature",
    label: "Father's Signature",
  },
  {
    key: "mother_s_signature",
    label: "Mother's Signature",
  },
];

// =====================================================
// REUSABLE SECTION
// =====================================================

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="border-b border-[#D8E7FA] pb-4">
        <h2 className="flex items-center gap-3 text-base font-bold uppercase text-[#10284D] sm:text-lg">
          <span className="h-7 w-1 shrink-0 rounded-full bg-[#0075FF]" />
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

// =====================================================
// FIELD LABEL
// =====================================================

function Field({
  label,
  children,
  required = true,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-semibold text-[#10284D]">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>
      {children}
    </div>
  );
}

// =====================================================
// TEXT FIELD
// Defined outside the main component to retain focus
// =====================================================

function TextInput({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  optional = false,
}: {
  name: keyof FormValues;
  value: string;
  onChange: (
    name: keyof FormValues,
    value: string
  ) => void;
  placeholder: string;
  type?: "text" | "email" | "tel" | "number";
  optional?: boolean;
}) {
  const { register } = useFormContext<FormValues>();
  const registration = register(name, { validate: (value, all) => validateField(name, value, all) });
  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    let next = event.target.value;

    if (type === "tel") {
      next = next.replace(/\D/g, "").slice(0, 10);
    }

    onChange(name, next);
  }

  return (
    <>
    <input
      id={name}
      type={type}
      value={value}
      className={inputClass}
      required={!optional}
      placeholder={placeholder}
      min={type === "number" ? 0 : undefined}
      step={type === "number" ? "0.01" : undefined}
      maxLength={type === "tel" ? 10 : undefined}
      pattern={type === "tel" ? "[0-9]{10}" : undefined}
      inputMode={type === "tel" ? "numeric" : undefined}
      {...registration}
      onChange={(event) => { void registration.onChange(event); handleChange(event); }}
    />
    <FieldError name={name}/>
    </>
  );
}

// =====================================================
// DROPDOWN FIELD
// =====================================================

function SelectField({
  name,
  value,
  options,
  placeholder,
  onChange,
}: {
  name: keyof FormValues;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const { register } = useFormContext<FormValues>();
  const registration = register(name, { validate: (fieldValue, all) => validateField(name, fieldValue, all) });
  return (
    <div>
    <div className="relative">
      <select
        value={value}
        required
        {...registration}
        onChange={(event) => { void registration.onChange(event); onChange(event.target.value); }}
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
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0075FF]"
      />
    </div>
    <FieldError name={name}/>
    </div>
  );
}

// =====================================================
// YES / NO FIELD
// =====================================================

function YesNoField({
  name,
  value,
  onChange,
}: {
  name: keyof FormValues;
  value: string;
  onChange: (value: string) => void;
}) {
  const { register } = useFormContext<FormValues>();
  const registration = register(name, { validate: (fieldValue, all) => validateField(name, fieldValue, all) });
  return (
    <div>
    <div className="flex flex-wrap gap-3">
      {(["Yes", "No"] as const).map((option) => (
        <label
          key={option}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-3 text-sm transition ${
            value === option
              ? "border-[#0075FF] bg-[#EFF7FF] text-[#0056C9]"
              : "border-[#D8E5F5] bg-white text-[#344563]"
          }`}
        >
          <input
            type="radio"
            required
            checked={value === option}
            value={option}
            {...registration}
            onChange={(event) => { void registration.onChange(event); onChange(option); }}
            className="h-4 w-4 accent-[#0075FF]"
          />
          {option}
        </label>
      ))}
    </div>
    <FieldError name={name}/>
    </div>
  );
}

// =====================================================
// COMPRESS IMAGE BEFORE SUBMITTING
// Keep original subject without cropping
// =====================================================

async function compressImage(
  file: File,
  field: ImageKey
): Promise<File> {
  if (file.size === 0 || file.size >= MAX_IMAGE_SIZE) {
    throw new Error(
      "Each image must be smaller than 5 MB."
    );
  }

  if (
    !["image/jpeg", "image/png", "image/webp"].includes(
      file.type
    )
  ) {
    throw new Error(
      "Only JPG, PNG and WebP images are supported."
    );
  }

  const bitmap = await createImageBitmap(file);

  try {
    const isStudentPhoto =
      field === "student_s_passport_size_photograph";

    const maxWidth = isStudentPhoto ? 800 : 900;
    const maxHeight = isStudentPhoto ? 1100 : 450;

    const scale = Math.min(
      1,
      maxWidth / bitmap.width,
      maxHeight / bitmap.height
    );

    const canvas = document.createElement("canvas");

    canvas.width = Math.max(
      1,
      Math.round(bitmap.width * scale)
    );

    canvas.height = Math.max(
      1,
      Math.round(bitmap.height * scale)
    );

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Image compression failed.");
    }

    context.fillStyle = "#FFFFFF";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.drawImage(
      bitmap,
      0,
      0,
      canvas.width,
      canvas.height
    );

    let compressed: Blob | null = null;

    for (const quality of [0.8, 0.65, 0.5, 0.35]) {
      compressed = await new Promise<Blob | null>(
        (resolve) =>
          canvas.toBlob(
            resolve,
            "image/jpeg",
            quality
          )
      );

      if (
        compressed &&
        compressed.size <= 250 * 1024
      ) {
        break;
      }
    }

    if (!compressed || compressed.size > 500 * 1024) {
      throw new Error(
        "Unable to reduce the selected image size."
      );
    }

    return new File(
      [compressed],
      file.name.replace(/\.[^.]+$/, "") + ".jpg",
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );
  } finally {
    bitmap.close();
  }
}

// =====================================================
// IMAGE UPLOAD FIELD WITH MATCHING PREVIEW SIZES
// =====================================================

function UploadField({
  label,
  file,
  onChange,
  onError,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  onError: (message: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(
    null
  );

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected = event.target.files?.[0] ?? null;

    if (selected && selected.size >= MAX_IMAGE_SIZE) {
      event.target.value = "";
      onError(`${label} must be smaller than 5 MB.`);
      return;
    }

    if (
      selected &&
      !["image/jpeg", "image/png", "image/webp"].includes(
        selected.type
      )
    ) {
      event.target.value = "";
      onError(`${label} must be JPG, PNG or WebP.`);
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(
      selected ? URL.createObjectURL(selected) : null
    );
    onChange(selected);
  }

  // Allow state reset after successful submission.
  const hasFile = Boolean(file);

  return (
    <Field label={label}>
      <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#B8D7FF] bg-[#F7FBFF] p-4 text-center transition hover:border-[#0075FF]">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!hasFile}
          className="sr-only"
          onChange={handleFileChange}
        />

        {hasFile && preview ? (
          <img
            src={preview}
            alt={`${label} preview`}
            width={140}
            height={110}
            className="h-[110px] w-[140px] max-w-full rounded-md border border-[#DCE7F5] bg-white object-contain"
          />
        ) : (
          <FileImage
            size={30}
            className="text-[#0075FF]"
          />
        )}

        {hasFile && file ? (
          <>
            <span className="mt-3 max-w-full break-all text-xs font-semibold text-[#10284D]">
              {file.name}
            </span>
            <span className="mt-1 text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </span>
            <span className="mt-2 text-xs font-medium text-[#0075FF]">
              Click to replace
            </span>
          </>
        ) : (
          <>
            <span className="mt-3 text-sm font-semibold text-[#10284D]">
              Click to upload image
            </span>
            <span className="mt-2 text-xs text-slate-500">
              JPG, PNG or WebP · Less than 5 MB
            </span>
          </>
        )}
      </label>
    </Field>
  );
}

// =====================================================
// MAIN FORM COMPONENT
// =====================================================

export default function PreliminaryAdmissionForm() {
  const form = useForm<FormValues>({ defaultValues: INITIAL, mode: "onTouched", reValidateMode: "onChange" });
  const { register, handleSubmit: validateSubmit, setValue: setFormValue, reset, formState: { errors } } = form;
  const [values, setValues] = useState<FormValues>({
    ...INITIAL,
  });

  const [images, setImages] = useState<ImageRecord>({
    ...EMPTY_IMAGES,
  });

  const [uploadResetKey, setUploadResetKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registrationNo, setRegistrationNo] =
    useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const dateRegistration = register("date_of_birth", { validate: (value, all) => validateField("date_of_birth", value, all) });
  const addressRegistration = register("address", { validate: (value, all) => validateField("address", value, all) });

  function update(
    field: keyof FormValues,
    value: string
  ) {
    setError("");
    setFormValue(field, value, { shouldDirty: true, shouldValidate: true });

    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleReligion(value: string) {
    setError("");

    setValues((previous) => ({
      ...previous,
      religion: value,
      name_of_parish:
        value === "Christian - Roman Catholic"
          ? previous.name_of_parish
          : "",
      religion_others:
        value === "Others"
          ? previous.religion_others
          : "",
    }));
    setFormValue("religion", value, { shouldDirty: true, shouldValidate: true });
    if (value !== "Christian - Roman Catholic") setFormValue("name_of_parish", "", { shouldValidate: true });
    if (value !== "Others") setFormValue("religion_others", "", { shouldValidate: true });
  }

  function handleMotherTongue(value: string) {
    setError("");

    setValues((previous) => ({
      ...previous,
      mother_tongue: value,
      mother_tongue_others:
        value === "Others"
          ? previous.mother_tongue_others
          : "",
    }));
    setFormValue("mother_tongue", value, { shouldDirty: true, shouldValidate: true });
    if (value !== "Others") setFormValue("mother_tongue_others", "", { shouldValidate: true });
  }

  function handleSiblingChoice(value: string) {
    setError("");

    setValues((previous) => ({
      ...previous,
      does_the_applicant_have_any_sibling_s_studying_in_this_school:
        value,
      name_of_the_sibling:
        value === "Yes"
          ? previous.name_of_the_sibling
          : "",
      class_and_section:
        value === "Yes"
          ? previous.class_and_section
          : "",
    }));
    setFormValue("does_the_applicant_have_any_sibling_s_studying_in_this_school", value, { shouldDirty: true, shouldValidate: true });
    if (value !== "Yes") {
      setFormValue("name_of_the_sibling", "", { shouldValidate: true });
      setFormValue("class_and_section", "", { shouldValidate: true });
    }
  }

  async function submitApplication(values: FormValues) {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      if (
        !values.date_of_birth ||
        values.date_of_birth > MAX_DOB
      ) {
        throw new Error(
          "Date of Birth must be on or before 31 December 2024."
        );
      }

      const payload = new FormData();

      for (const [key, value] of Object.entries(values)) {
        payload.append(key, value);
      }

      if (
        values.religion !==
        "Christian - Roman Catholic"
      ) {
        payload.set("name_of_parish", "");
      }

      if (values.religion !== "Others") {
        payload.set("religion_others", "");
      }

      if (values.mother_tongue !== "Others") {
        payload.set("mother_tongue_others", "");
      }

      if (
        values.does_the_applicant_have_any_sibling_s_studying_in_this_school !==
        "Yes"
      ) {
        payload.set("name_of_the_sibling", "");
        payload.set("class_and_section", "");
      }

      let totalImageSize = 0;

      for (const field of IMAGE_FIELDS) {
        const file = images[field.key];

        if (!file) {
          throw new Error(
            `Please upload ${field.label}.`
          );
        }

        const compressed = await compressImage(
          file,
          field.key
        );

        totalImageSize += compressed.size;

        payload.append(
          field.key,
          compressed,
          compressed.name
        );
      }

      if (totalImageSize > MAX_TOTAL_IMAGE_SIZE) {
        throw new Error(
          "Combined image size is too large."
        );
      }

      const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "/backend").replace(/\/$/, "");
      const response = await fetch(
        `${apiBaseUrl}/api/v1/admission-applications`,
        {
          method: "POST",
          body: payload,
          cache: "no-store",
        }
      );

      const responseText = await response.text();

      let result: ApiResult;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          response.status === 413
            ? "Total image upload size exceeds the server limit."
            : `Invalid server response (HTTP ${response.status}).`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Application submission failed."
        );
      }

      if (!result.registration_no) {
        throw new Error(
          "Application was received without a registration number. Please contact the school."
        );
      }

      setRegistrationNo(result.registration_no);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to confirm application submission."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function closeSuccess() {
    setRegistrationNo(null);
    setValues({ ...INITIAL });
    setImages({ ...EMPTY_IMAGES });
    reset(INITIAL);
    setUploadResetKey((previous) => previous + 1);
    setError("");
    formRef.current?.reset();
  }

  return (
    <FormProvider {...form}>
    <div className="mx-auto w-full max-w-[1500px] px-3 py-6 sm:px-6 lg:px-10">
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

        {/* HEADER */}
        <header className="flex w-full flex-col items-center justify-center bg-gradient-to-br from-[#F4FAFF] to-[#DFEEFF] px-5 py-10 text-center sm:px-10 sm:py-14">
          <span className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-2 text-center text-xs font-bold uppercase tracking-wide text-[#0075FF]">
            Admissions Open
          </span>

          <h1 className="mx-auto mt-4 w-full max-w-6xl text-center text-2xl font-extrabold leading-tight text-[#10284D] sm:text-3xl lg:text-4xl">
            Rosary Matriculation Higher Secondary School
          </h1>

          <p className="mt-3 w-full text-center text-sm text-[#54749C] sm:text-base">
            LKG Application Form 2027–2028
          </p>

          <p className="mt-1 w-full text-center text-xs text-[#6B85A7] sm:text-sm">
            Please complete all required details carefully.
          </p>
        </header>

        <form ref={formRef} noValidate onSubmit={validateSubmit(submitApplication, () => setError("Please correct the highlighted fields before submitting."))}>
          <div className="space-y-10 px-4 py-8 sm:px-8 lg:px-12">

            {/* PERSONAL DETAILS */}
            <Section title="Personal Details">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                <Field label="Name of the Pupil">
                  <TextInput
                    name="name_of_the_pupil"
                    value={values.name_of_the_pupil}
                    onChange={update}
                    placeholder="Enter pupil's name"
                  />
                </Field>

                <Field label="Date of Birth">
                  <input
                    type="date"
                    required
                    className={inputClass}
                    value={values.date_of_birth}
                    max={MAX_DOB}
                    {...dateRegistration}
                    onChange={(event) => {
                      void dateRegistration.onChange(event);
                      if (
                        !event.target.value ||
                        event.target.value <= MAX_DOB
                      ) {
                        update(
                          "date_of_birth",
                          event.target.value
                        );
                      } else {
                        setError(
                          "Date of Birth must be on or before 31 December 2024."
                        );
                      }
                    }}
                  />
                  <FieldError name="date_of_birth"/>
                </Field>

                <Field label="Religion">
                  <SelectField
                    name="religion"
                    value={values.religion}
                    placeholder="Select religion"
                    onChange={handleReligion}
                    options={[
                      "Hindu",
                      "Christian - Roman Catholic",
                      "Christian",
                      "Muslim",
                      "Others",
                    ]}
                  />
                </Field>

                {values.religion ===
                  "Christian - Roman Catholic" && (
                  <Field label="Name of Parish">
                    <TextInput
                      name="name_of_parish"
                      value={values.name_of_parish}
                      onChange={update}
                      placeholder="Enter name of parish"
                    />
                  </Field>
                )}

                {values.religion === "Others" && (
                  <Field label="Please Specify Religion">
                    <TextInput
                      name="religion_others"
                      value={values.religion_others}
                      onChange={update}
                      placeholder="Enter religion"
                    />
                  </Field>
                )}

                <Field label="Place of Birth">
                  <TextInput
                    name="place_of_birth"
                    value={values.place_of_birth}
                    onChange={update}
                    placeholder="Enter place of birth"
                  />
                </Field>
              </div>
            </Section>

            {/* FATHER'S DETAILS */}
            <Section title="Father's Details">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <Field label="Father's Name">
                  <TextInput
                    name="father_s_name"
                    value={values.father_s_name}
                    onChange={update}
                    placeholder="Enter father's name"
                  />
                </Field>

                <Field label="Qualification">
                  <TextInput
                    name="father_s_qualification"
                    value={values.father_s_qualification}
                    onChange={update}
                    placeholder="Enter qualification"
                  />
                </Field>

                <Field label="Occupation">
                  <TextInput
                    name="father_s_occupation"
                    value={values.father_s_occupation}
                    onChange={update}
                    placeholder="Enter occupation"
                  />
                </Field>

                <Field label="Monthly Income">
                  <TextInput
                    name="father_s_income_per_month"
                    value={values.father_s_income_per_month}
                    onChange={update}
                    type="number"
                    placeholder="Enter monthly income"
                  />
                </Field>
              </div>
            </Section>

            {/* MOTHER'S DETAILS */}
            <Section title="Mother's Details">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <Field label="Mother's Name">
                  <TextInput
                    name="mother_s_name"
                    value={values.mother_s_name}
                    onChange={update}
                    placeholder="Enter mother's name"
                  />
                </Field>

                <Field label="Is she a past pupil of Rosary?">
                  <YesNoField
                    name="is_she_a_past_pupil_of_rosary"
                    value={
                      values.is_she_a_past_pupil_of_rosary
                    }
                    onChange={(value) =>
                      update(
                        "is_she_a_past_pupil_of_rosary",
                        value
                      )
                    }
                  />
                </Field>

                <Field label="Qualification">
                  <TextInput
                    name="mother_s_qualification"
                    value={values.mother_s_qualification}
                    onChange={update}
                    placeholder="Enter qualification"
                  />
                </Field>

                <Field label="Occupation">
                  <TextInput
                    name="mother_s_occupation"
                    value={values.mother_s_occupation}
                    onChange={update}
                    placeholder="Enter occupation"
                  />
                </Field>

                <Field label="Monthly Income">
                  <TextInput
                    name="mother_s_income_per_month"
                    value={values.mother_s_income_per_month}
                    onChange={update}
                    type="number"
                    placeholder="Enter monthly income"
                  />
                </Field>

                <Field label="Mother Tongue">
                  <SelectField
                    name="mother_tongue"
                    value={values.mother_tongue}
                    placeholder="Select mother tongue"
                    onChange={handleMotherTongue}
                    options={[
                      "Tamil",
                      "English",
                      "Telugu",
                      "Malayalam",
                      "Kannada",
                      "Hindi",
                      "Others",
                    ]}
                  />
                </Field>

                {values.mother_tongue === "Others" && (
                  <Field label="Please Specify Mother Tongue">
                    <TextInput
                      name="mother_tongue_others"
                      value={values.mother_tongue_others}
                      onChange={update}
                      placeholder="Enter mother tongue"
                    />
                  </Field>
                )}
              </div>
            </Section>

            {/* SIBLING DETAILS */}
            <Section title="Sibling Details">
              <Field label="Does the applicant have any sibling(s) studying in this school?">
                <YesNoField
                  name="does_the_applicant_have_any_sibling_s_studying_in_this_school"
                  value={
                    values.does_the_applicant_have_any_sibling_s_studying_in_this_school
                  }
                  onChange={handleSiblingChoice}
                />
              </Field>

              {values.does_the_applicant_have_any_sibling_s_studying_in_this_school ===
                "Yes" && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <Field label="Name of the Sibling">
                    <TextInput
                      name="name_of_the_sibling"
                      value={values.name_of_the_sibling}
                      onChange={update}
                      placeholder="Enter sibling's name"
                    />
                  </Field>

                  <Field label="Class and Section">
                    <TextInput
                      name="class_and_section"
                      value={values.class_and_section}
                      onChange={update}
                      placeholder="Enter class and section"
                    />
                  </Field>
                </div>
              )}
            </Section>

            {/* CONTACT DETAILS */}
            <Section title="Contact Details">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                <Field label="Address">
                  <textarea
                    required
                    rows={5}
                    className={`${inputClass} h-auto min-h-[165px] resize-y py-3`}
                    value={values.address}
                    placeholder="Enter address"
                    {...addressRegistration}
                    onChange={(event) => { void addressRegistration.onChange(event); update("address", event.target.value); }}
                  />
                  <FieldError name="address"/>
                </Field>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <Field label="Email ID">
                    <TextInput
                      name="email"
                      value={values.email}
                      onChange={update}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </Field>

                  <Field label="Phone Number">
                    <TextInput
                      name="phone_number"
                      value={values.phone_number}
                      onChange={update}
                      type="tel"
                      placeholder="10-digit phone number"
                    />
                  </Field>

                  <Field
                    label="Alternative Phone Number"
                    required={false}
                  >
                    <TextInput
                      name="alternative_phone_number"
                      value={
                        values.alternative_phone_number
                      }
                      onChange={update}
                      type="tel"
                      optional
                      placeholder="Optional"
                    />
                  </Field>
                </div>
              </div>
            </Section>

            {/* PHOTOGRAPH AND SIGNATURE UPLOADS */}
            <Section title="Photograph and Signature Uploads">
              <p className="text-sm leading-6 text-[#647D9D]">
                Upload the student’s passport-size photograph
                and both parents’ signatures. Each image
                must be smaller than 5 MB. Files are stored securely by the school website and only image URLs are sent to the admission service.
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {IMAGE_FIELDS.map(({ key, label }) => (
                  <UploadField
                    key={`${key}-${uploadResetKey}`}
                    label={label}
                    file={images[key]}
                    onError={setError}
                    onChange={(file) => {
                      setError("");
                      setImages((previous) => ({
                        ...previous,
                        [key]: file,
                      }));
                    }}
                  />
                ))}
              </div>
            </Section>

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}
            {Object.keys(errors).length > 0 && !error && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Please correct the highlighted fields before submitting.</div>}
          </div>

          {/* SUBMIT */}
          <div className="flex flex-col gap-4 border-t border-blue-100 bg-[#F6FAFF] px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <p className="text-sm text-[#6882A4]">
              Please review all information before submitting.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#0075FF] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#005DCC] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SUCCESS POPUP */}
      {registrationNo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#071D3B]/65 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admission-success-title"
            className="relative w-full max-w-md rounded-2xl bg-white px-6 py-9 text-center shadow-2xl sm:px-10"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={closeSuccess}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <CheckCircle2
              size={64}
              className="mx-auto text-green-600"
            />

            <h2
              id="admission-success-title"
              className="mt-5 text-2xl font-bold text-[#10284D]"
            >
              Application Submitted Successfully!
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your LKG admission application has been
              received successfully.
            </p>

            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Registration No.
              </p>

              <p className="mt-2 text-3xl font-bold tracking-wide text-[#0755AD]">
                {registrationNo}
              </p>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              Please save this number for future reference.
            </p>

            <button
              type="button"
              onClick={closeSuccess}
              className="mt-7 w-full rounded-xl bg-[#0075FF] px-6 py-3 font-semibold text-white hover:bg-[#005DCC]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
    </FormProvider>
  );
}
