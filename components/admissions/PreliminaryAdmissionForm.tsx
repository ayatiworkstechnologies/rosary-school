
"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileImage,
  Loader2,
  X,
} from "lucide-react";

type FormValues = {
  name_of_the_pupil: string;
  date_of_birth: string;
  religion: string;
  place_of_birth: string;
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
  does_the_applicant_have_any_sibling_s_studying_in_this_school: string;
  name_of_the_sibling: string;
  class_and_section: string;
  address: string;
  email: string;
  phone_number: string;
  alternative_phone_number: string;
};

type ImageField =
  | "student_passport_size_photo"
  | "father_s_signature"
  | "mother_s_signature";

type SubmissionResult = {
  success?: boolean;
  message?: string;
  registration_no?: string;
};

const INITIAL_VALUES: FormValues = {
  name_of_the_pupil: "",
  date_of_birth: "",
  religion: "",
  place_of_birth: "",
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
  does_the_applicant_have_any_sibling_s_studying_in_this_school: "",
  name_of_the_sibling: "",
  class_and_section: "",
  address: "",
  email: "",
  phone_number: "",
  alternative_phone_number: "",
};

const IMAGE_FIELDS: ImageField[] = [
  "student_passport_size_photo",
  "father_s_signature",
  "mother_s_signature",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Keep the combined multipart request comfortably
// below Vercel's request-body limit.
const MAX_COMPRESSED_TOTAL = 3 * 1024 * 1024;

const inputClass =
  "h-12 w-full min-w-0 rounded-lg border border-[#C9D9EF] bg-white px-4 text-sm text-[#10284D] outline-none transition focus:border-[#0075FF] focus:ring-2 focus:ring-[#0075FF]/10 placeholder:text-slate-400";

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
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

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 border-b border-[#D9E8FF] pb-4">
      <h2 className="flex items-center gap-3 text-base font-bold uppercase text-[#10284D] sm:text-lg">
        <span className="h-7 w-1 rounded-full bg-[#0075FF]" />
        {children}
      </h2>
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  required = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`${inputClass} appearance-none pr-12`}
      >
        <option value="">Select an option</option>
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
  );
}

function YesNo({
  value,
  onChange,
  name,
}: {
  value: string;
  onChange: (value: string) => void;
  name: string;
}) {
  return (
    <div className="flex h-12 items-center gap-6">
      {["Yes", "No"].map((choice) => (
        <label
          key={choice}
          className="flex cursor-pointer items-center gap-2 text-sm text-[#10284D]"
        >
          <input
            type="radio"
            name={name}
            value={choice}
            checked={value === choice}
            required
            onChange={() => onChange(choice)}
            className="h-4 w-4 accent-[#0075FF]"
          />
          {choice}
        </label>
      ))}
    </div>
  );
}

async function compressImage(
  file: File,
  field: ImageField
): Promise<File> {
  if (file.size >= MAX_FILE_SIZE) {
    throw new Error(
      "Each uploaded image must be smaller than 5 MB."
    );
  }

  if (
    ![
      "image/jpeg",
      "image/png",
      "image/webp",
    ].includes(file.type)
  ) {
    throw new Error(
      "Only JPG, PNG and WebP images are allowed."
    );
  }

  const bitmap = await createImageBitmap(file);

  try {
    const isPhoto =
      field === "student_passport_size_photo";

    const maxWidth = isPhoto ? 800 : 900;
    const maxHeight = isPhoto ? 1100 : 450;

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
      throw new Error(
        "Image compression is not supported."
      );
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

    let output: Blob | null = null;

    for (const quality of [0.75, 0.6, 0.45]) {
      output = await new Promise<Blob | null>(
        (resolve) => {
          canvas.toBlob(
            resolve,
            "image/jpeg",
            quality
          );
        }
      );

      if (!output) {
        throw new Error(
          "Unable to compress uploaded image."
        );
      }

      if (output.size <= 300 * 1024) {
        break;
      }
    }

    if (!output) {
      throw new Error(
        "Unable to compress uploaded image."
      );
    }

    return new File(
      [output],
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

function UploadField({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <Field label={label} required>
      <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#B6D5FF] bg-[#F7FBFF] p-5 text-center transition hover:border-[#0075FF] hover:bg-[#EFF7FF]">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!file}
          className="sr-only"
          onChange={(event) =>
            onChange(event.target.files?.[0] ?? null)
          }
        />

        <FileImage
          size={30}
          className="mb-3 text-[#0075FF]"
        />

        {file ? (
          <>
            <span className="max-w-full truncate text-sm font-semibold text-[#10284D]">
              {file.name}
            </span>
            <span className="mt-2 text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </span>
            <span className="mt-3 text-sm font-medium text-[#0075FF]">
              Click to replace
            </span>
          </>
        ) : (
          <>
            <span className="text-sm font-semibold text-[#10284D]">
              Click to upload
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

export default function PreliminaryAdmissionForm() {
  const [values, setValues] =
    useState<FormValues>(INITIAL_VALUES);

  const [files, setFiles] = useState<
    Record<ImageField, File | null>
  >({
    student_passport_size_photo: null,
    father_s_signature: null,
    mother_s_signature: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registrationNo, setRegistrationNo] =
    useState<string | null>(null);

  const update = (
    field: keyof FormValues,
    value: string
  ) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(
        values
      )) {
        formData.append(key, value);
      }

      if (
        values.does_the_applicant_have_any_sibling_s_studying_in_this_school ===
        "No"
      ) {
        formData.set("name_of_the_sibling", "");
        formData.set("class_and_section", "");
      }

      let totalCompressedSize = 0;

      for (const field of IMAGE_FIELDS) {
        const original = files[field];

        if (!original) {
          throw new Error(
            "Please upload the student photo and both parents' signatures."
          );
        }

        const compressed = await compressImage(
          original,
          field
        );

        totalCompressedSize += compressed.size;
        formData.set(field, compressed);
      }

      if (
        totalCompressedSize > MAX_COMPRESSED_TOTAL
      ) {
        throw new Error(
          "The combined image size is too large. Please choose smaller images."
        );
      }

      const response = await fetch(
        "/api/rosary-lkg-admission",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();

      let result: SubmissionResult;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          response.status === 413
            ? "Uploaded files exceed the server limit. Please select smaller images."
            : "The server returned an unexpected response. Please try again."
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to submit your application."
        );
      }

      if (!result.registration_no) {
        throw new Error(
          "Application response did not include a registration number. Please contact the school."
        );
      }

      setRegistrationNo(result.registration_no);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Application submission failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-3 py-6 sm:px-6 lg:px-10">
      <div className="overflow-hidden rounded-2xl border border-[#D9E8FF] bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#EFF7FF] to-[#DCEEFF] px-5 py-10 text-center sm:px-8 sm:py-14">
          <span className="inline-flex rounded-full border border-[#B8D6FF] bg-white px-5 py-2 text-xs font-bold text-[#0075FF]">
            ADMISSIONS OPEN
          </span>

          <h1 className="mt-4 text-2xl font-bold leading-tight text-[#10284D] sm:text-3xl lg:text-4xl">
            Rosary Matriculation Higher Secondary School
          </h1>

          <p className="mt-3 text-sm text-[#57759A] sm:text-base">
            LKG Application Form 2027 - 2028
          </p>

          <p className="mt-1 text-xs text-[#7890AA] sm:text-sm">
            Please complete all required details carefully.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-10 px-5 py-8 sm:px-8 lg:px-12">
            <section>
              <SectionTitle>
                Personal Details
              </SectionTitle>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Name of the Pupil" required>
                  <input
                    className={inputClass}
                    required
                    value={values.name_of_the_pupil}
                    onChange={(e) =>
                      update(
                        "name_of_the_pupil",
                        e.target.value
                      )
                    }
                    placeholder="Enter pupil name"
                  />
                </Field>

                <Field label="Date of Birth" required>
                  <input
                    type="date"
                    className={inputClass}
                    required
                    max={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    value={values.date_of_birth}
                    onChange={(e) =>
                      update(
                        "date_of_birth",
                        e.target.value
                      )
                    }
                  />
                </Field>

                <Field label="Religion" required>
                  <SelectInput
                    required
                    value={values.religion}
                    onChange={(value) =>
                      update("religion", value)
                    }
                    options={[
                      "Roman catholic",
                      "Christian",
                      "Hindu",
                      "Muslim",
                      "Other",
                    ]}
                  />
                </Field>

                <Field label="Place of Birth" required>
                  <input
                    className={inputClass}
                    required
                    value={values.place_of_birth}
                    onChange={(e) =>
                      update(
                        "place_of_birth",
                        e.target.value
                      )
                    }
                    placeholder="Enter place of birth"
                  />
                </Field>
              </div>
            </section>

            <section>
              <SectionTitle>
                Father's Details
              </SectionTitle>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    [
                      "father_s_name",
                      "Father's Name",
                    ],
                    [
                      "father_s_qualification",
                      "Qualification",
                    ],
                    [
                      "father_s_occupation",
                      "Occupation",
                    ],
                    [
                      "father_s_income_per_month",
                      "Income (per Month)",
                    ],
                  ] as const
                ).map(([field, label]) => (
                  <Field key={field} label={label} required>
                    <input
                      className={inputClass}
                      required
                      type={
                        field ===
                        "father_s_income_per_month"
                          ? "number"
                          : "text"
                      }
                      min={
                        field ===
                        "father_s_income_per_month"
                          ? 0
                          : undefined
                      }
                      value={values[field]}
                      onChange={(e) =>
                        update(field, e.target.value)
                      }
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </Field>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>
                Mother's Details
              </SectionTitle>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Mother's Name" required>
                  <input
                    className={inputClass}
                    required
                    value={values.mother_s_name}
                    onChange={(e) =>
                      update(
                        "mother_s_name",
                        e.target.value
                      )
                    }
                    placeholder="Enter mother's name"
                  />
                </Field>

                <Field
                  label="Is she a past pupil of Rosary?"
                  required
                >
                  <YesNo
                    name="past-pupil"
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

                {(
                  [
                    [
                      "mother_s_qualification",
                      "Qualification",
                    ],
                    [
                      "mother_s_occupation",
                      "Occupation",
                    ],
                    [
                      "mother_s_income_per_month",
                      "Income (per Month)",
                    ],
                  ] as const
                ).map(([field, label]) => (
                  <Field key={field} label={label} required>
                    <input
                      className={inputClass}
                      required
                      type={
                        field ===
                        "mother_s_income_per_month"
                          ? "number"
                          : "text"
                      }
                      min={
                        field ===
                        "mother_s_income_per_month"
                          ? 0
                          : undefined
                      }
                      value={values[field]}
                      onChange={(e) =>
                        update(field, e.target.value)
                      }
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </Field>
                ))}

                <Field label="Mother Tongue" required>
                  <SelectInput
                    required
                    value={values.mother_tongue}
                    onChange={(value) =>
                      update("mother_tongue", value)
                    }
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
                </Field>
              </div>
            </section>

            <section>
              <SectionTitle>
                Sibling Details
              </SectionTitle>

              <Field
                label="Does the applicant have any siblings studying in this school?"
                required
              >
                <YesNo
                  name="siblings"
                  value={
                    values.does_the_applicant_have_any_sibling_s_studying_in_this_school
                  }
                  onChange={(value) => {
                    update(
                      "does_the_applicant_have_any_sibling_s_studying_in_this_school",
                      value
                    );

                    if (value === "No") {
                      setValues((previous) => ({
                        ...previous,
                        does_the_applicant_have_any_sibling_s_studying_in_this_school:
                          "No",
                        name_of_the_sibling: "",
                        class_and_section: "",
                      }));
                    }
                  }}
                />
              </Field>

              {values.does_the_applicant_have_any_sibling_s_studying_in_this_school ===
                "Yes" && (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Name of the Sibling"
                    required
                  >
                    <input
                      className={inputClass}
                      required
                      value={values.name_of_the_sibling}
                      onChange={(e) =>
                        update(
                          "name_of_the_sibling",
                          e.target.value
                        )
                      }
                    />
                  </Field>

                  <Field
                    label="Class and Section"
                    required
                  >
                    <input
                      className={inputClass}
                      required
                      value={values.class_and_section}
                      onChange={(e) =>
                        update(
                          "class_and_section",
                          e.target.value
                        )
                      }
                    />
                  </Field>
                </div>
              )}
            </section>

            <section>
              <SectionTitle>
                Contact Details
              </SectionTitle>

              <div className="grid gap-5 lg:grid-cols-2">
                <Field label="Address" required>
                  <textarea
                    className={`${inputClass} min-h-[165px] resize-y py-3`}
                    required
                    value={values.address}
                    onChange={(e) =>
                      update("address", e.target.value)
                    }
                    placeholder="Enter permanent address"
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email ID" required>
                    <input
                      type="email"
                      className={inputClass}
                      required
                      value={values.email}
                      onChange={(e) =>
                        update("email", e.target.value)
                      }
                      placeholder="Enter email"
                    />
                  </Field>

                  <Field label="Phone Number" required>
                    <input
                      type="tel"
                      className={inputClass}
                      required
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={values.phone_number}
                      onChange={(e) =>
                        update(
                          "phone_number",
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="10-digit number"
                    />
                  </Field>

                  <Field label="Alternative Phone Number">
                    <input
                      type="tel"
                      className={inputClass}
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={
                        values.alternative_phone_number
                      }
                      onChange={(e) =>
                        update(
                          "alternative_phone_number",
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="Optional"
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section>
              <SectionTitle>
                Photo & Signature Uploads
              </SectionTitle>

              <p className="mb-5 text-sm leading-6 text-[#6680A2]">
                Upload the student's passport-size photo
                and both parents' signatures. Each image
                must be smaller than 5 MB.
              </p>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <UploadField
                  label="Student Passport Size Photo"
                  file={
                    files.student_passport_size_photo
                  }
                  onChange={(file) =>
                    setFiles((previous) => ({
                      ...previous,
                      student_passport_size_photo: file,
                    }))
                  }
                />

                <UploadField
                  label="Father's Signature"
                  file={files.father_s_signature}
                  onChange={(file) =>
                    setFiles((previous) => ({
                      ...previous,
                      father_s_signature: file,
                    }))
                  }
                />

                <UploadField
                  label="Mother's Signature"
                  file={files.mother_s_signature}
                  onChange={(file) =>
                    setFiles((previous) => ({
                      ...previous,
                      mother_s_signature: file,
                    }))
                  }
                />
              </div>
            </section>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 border-t border-[#DCE9F8] bg-[#F4F9FF] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <p className="text-sm text-[#6680A2]">
              Please review all information before submitting.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-[#0075FF] px-8 text-sm font-semibold text-white transition hover:bg-[#005FCC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
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

      {registrationNo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071D3B]/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admission-success-title"
            className="relative w-full max-w-md rounded-2xl bg-white px-6 py-9 text-center shadow-2xl sm:px-9"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setRegistrationNo(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>

            <CheckCircle2
              size={62}
              className="mx-auto text-green-600"
            />

            <h2
              id="admission-success-title"
              className="mt-5 text-2xl font-bold text-[#10284D]"
            >
              Application Submitted!
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your LKG admission application has
              been received successfully.
            </p>

            <div className="mt-6 rounded-xl border border-[#C8E0FF] bg-[#F1F8FF] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6680A2]">
                Registration No.
              </p>

              <p className="mt-2 text-3xl font-bold tracking-wide text-[#0075FF]">
                {registrationNo}
              </p>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              Please save this registration number
              for future reference.
            </p>

            <button
              type="button"
              onClick={() => {
                setRegistrationNo(null);
                setValues(INITIAL_VALUES);
                setFiles({
                  student_passport_size_photo: null,
                  father_s_signature: null,
                  mother_s_signature: null,
                });
              }}
              className="mt-7 w-full rounded-lg bg-[#0075FF] px-6 py-3 font-semibold text-white hover:bg-[#005FCC]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
