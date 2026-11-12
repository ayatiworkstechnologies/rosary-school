"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Send,
  X,
} from "lucide-react";

/* =========================================================
   SETTINGS
========================================================= */

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

const DOCUMENT_FIELDS = [
  ["previous_school_progress_report_front", "Previous School Progress Report Card — Front Page"],
  ["previous_school_progress_report_back", "Previous School Progress Report Card — Back Page"],
  ["birth_certificate", "Student's Birth Certificate"],
  ["aadhaar_card", "Student's Aadhaar Card"],
] as const;

type DocumentField = (typeof DOCUMENT_FIELDS)[number][0];

const ADMISSION_CLASSES = [
  "UKG",
  "Std I",
  "Std II",
  "Std III",
  "Std IV",
  "Std V",
  "Std VI",
  "Std VII",
  "Std VIII",
];

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "/backend"
).replace(/\/$/, "");

const ADMISSION_API_URL =
  `${API_BASE_URL}/api/v1/admission-ukg-to-eighth`;

/* =========================================================
   TYPES
========================================================= */

type AdmissionFormData = {
  name_of_the_pupil: string;

  date_of_birth: string;

  religion: string;

  name_of_parish: string;

  father_s_name: string;

  father_s_qualification: string;

  father_s_occupation: string;

  father_s_income_per_month: string;

  father_s_mobile_no: string;

  mother_s_name: string;

  mother_s_qualification: string;

  mother_s_occupation: string;

  mother_s_income_per_month: string;

  mother_s_mobile_no: string;

  email_id: string;

  residential_address: string;

  name_of_school_currently_attended: string;

  present_class_of_the_pupil: string;

  class_for_which_admission_is_sought: string;

  does_the_applicant_have_any_siblings_studying_in_this_school: string;

  name_of_the_sibling: string;

  class_and_section: string;

  signature_of_parent: string;
};

type ApiResult = {
  success?: boolean;

  message?: string;

  registration_no?: string;
};

/* =========================================================
   INITIAL VALUES
========================================================= */

const INITIAL_FORM_DATA: AdmissionFormData = {
  name_of_the_pupil: "",

  date_of_birth: "",

  religion: "",

  name_of_parish: "",

  father_s_name: "",

  father_s_qualification: "",

  father_s_occupation: "",

  father_s_income_per_month: "",

  father_s_mobile_no: "",

  mother_s_name: "",

  mother_s_qualification: "",

  mother_s_occupation: "",

  mother_s_income_per_month: "",

  mother_s_mobile_no: "",

  email_id: "",

  residential_address: "",

  name_of_school_currently_attended: "",

  present_class_of_the_pupil: "",

  class_for_which_admission_is_sought: "",

  does_the_applicant_have_any_siblings_studying_in_this_school: "",

  name_of_the_sibling: "",

  class_and_section: "",

  signature_of_parent: "",
};

/* =========================================================
   COMMON STYLES
========================================================= */

const inputClass = `
  h-[46px]
  w-full
  min-w-0

  border-0
  border-b
  border-[#9AA7B4]

  bg-transparent

  px-1

  text-[14px]
  font-medium

  text-[#17324B]

  outline-none

  transition-all
  duration-200

  placeholder:text-[#A4AFB8]

  focus:border-[#0075FF]
`;

const textareaClass = `
  w-full
  min-w-0

  resize-none

  border-0
  border-b
  border-[#9AA7B4]

  bg-transparent

  px-1
  py-2

  text-[14px]
  font-medium

  leading-7

  text-[#17324B]

  outline-none

  transition-all
  duration-200

  placeholder:text-[#A4AFB8]

  focus:border-[#0075FF]
`;

/* =========================================================
   LOCAL DATE
========================================================= */

function getLocalDateISO() {
  const today = new Date();

  const year =
    today.getFullYear();

  const month = String(
    today.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    today.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdmissionUkgToEighth() {
  const formRef =
    useRef<HTMLFormElement | null>(
      null,
    );

  const photoInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    formData,
    setFormData,
  ] =
    useState<AdmissionFormData>({
      ...INITIAL_FORM_DATA,
    });

  const [
    photo,
    setPhoto,
  ] =
    useState<File | null>(
      null,
    );

  const [
    photoPreview,
    setPhotoPreview,
  ] =
    useState<string | null>(
      null,
    );

  const [supportingDocuments, setSupportingDocuments] = useState<Record<DocumentField, File | null>>({
    previous_school_progress_report_front: null,
    previous_school_progress_report_back: null,
    birth_certificate: null,
    aadhaar_card: null,
  });

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    registrationNo,
    setRegistrationNo,
  ] =
    useState<string | null>(
      null,
    );

  /* =======================================================
     CLEAN PHOTO PREVIEW
  ======================================================= */

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(
          photoPreview,
        );
      }
    };
  }, [photoPreview]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  function handleChange(
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) {
    const {
      name,
      value,
    } = event.target;

    let nextValue =
      value;

    /* ================================================
       MOBILE NUMBER - ONLY 10 DIGITS
    ================================================= */

    if (
      name ===
        "father_s_mobile_no" ||
      name ===
        "mother_s_mobile_no"
    ) {
      nextValue =
        value
          .replace(
            /\D/g,
            "",
          )
          .slice(
            0,
            10,
          );
    }

    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          nextValue,

        /*
         * Parish is applicable only
         * for Roman Catholic applicants.
         */
        ...(name ===
          "religion" &&
        nextValue !==
          "Christian - Roman Catholic"
          ? {
              name_of_parish:
                "",
            }
          : {}),
        ...(name === "does_the_applicant_have_any_siblings_studying_in_this_school" && nextValue === "No"
          ? { name_of_the_sibling: "", class_and_section: "" }
          : {}),
      }),
    );

    setError("");
  }

  /* =======================================================
     PHOTO CHANGE
  ======================================================= */

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selected =
      event.target
        .files?.[0] ??
      null;

    if (!selected) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        selected.type,
      )
    ) {
      event.target.value =
        "";

      setError(
        "Student photograph must be JPG, PNG or WebP.",
      );

      return;
    }

    if (
      selected.size >
      MAX_IMAGE_SIZE
    ) {
      event.target.value =
        "";

      setError(
        "Student photograph must be less than 5 MB.",
      );

      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview,
      );
    }

    setPhoto(
      selected,
    );

    setPhotoPreview(
      URL.createObjectURL(
        selected,
      ),
    );

    setError("");
  }

  function handleDocumentChange(field: DocumentField, file: File | null) {
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Documents must be PDF, JPG, PNG or WebP files.");
      return;
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      setError("Each document must be less than 5 MB.");
      return;
    }

    setSupportingDocuments(current => ({ ...current, [field]: file }));
    setError("");
  }

  /* =======================================================
     VALIDATION
     ALL FORM FIELDS ARE MANDATORY
  ======================================================= */

  function validateForm() {
    /* 1 */

    if (
      !formData
        .name_of_the_pupil
        .trim()
    ) {
      return "Name of the Pupil is required.";
    }

    /* 2 */

    if (
      !formData.date_of_birth
    ) {
      return "Date of Birth is required.";
    }

    /* 3 */

    if (
      !formData.religion
    ) {
      return "Religion is required.";
    }

    /* 4 */

    if (
      formData.religion ===
        "Christian - Roman Catholic" &&
      !formData
        .name_of_parish
        .trim()
    ) {
      return "Name of Parish is required for Roman Catholic applicants.";
    }

    /* 5 - FATHER */

    if (
      !formData
        .father_s_name
        .trim()
    ) {
      return "Father's Name is required.";
    }

    if (
      !formData
        .father_s_qualification
        .trim()
    ) {
      return "Father's Qualification is required.";
    }

    if (
      !formData
        .father_s_occupation
        .trim()
    ) {
      return "Father's Occupation is required.";
    }

    if (
      !formData
        .father_s_income_per_month
        .trim()
    ) {
      return "Father's Income per month is required.";
    }

    if (
      !/^[0-9]{10}$/.test(
        formData
          .father_s_mobile_no,
      )
    ) {
      return "Father's Mobile No must contain exactly 10 digits.";
    }

    /* 6 - MOTHER */

    if (
      !formData
        .mother_s_name
        .trim()
    ) {
      return "Mother's Name is required.";
    }

    if (
      !formData
        .mother_s_qualification
        .trim()
    ) {
      return "Mother's Qualification is required.";
    }

    if (
      !formData
        .mother_s_occupation
        .trim()
    ) {
      return "Mother's Occupation is required.";
    }

    if (
      !formData
        .mother_s_income_per_month
        .trim()
    ) {
      return "Mother's Income per month is required.";
    }

    if (
      !/^[0-9]{10}$/.test(
        formData
          .mother_s_mobile_no,
      )
    ) {
      return "Mother's Mobile No must contain exactly 10 digits.";
    }

    if (
      !formData.email_id.trim()
    ) {
      return "E-mail ID is required.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email_id,
      )
    ) {
      return "Please enter a valid E-mail ID.";
    }

    /* 7 */

    if (
      !formData
        .residential_address
        .trim()
    ) {
      return "Residential Address is required.";
    }

    if (
      formData
        .residential_address
        .trim()
        .length < 10
    ) {
      return "Please enter the complete Residential Address.";
    }

    /* 8 */

    if (
      !formData
        .name_of_school_currently_attended
        .trim()
    ) {
      return "Name of the School currently attended by the Pupil is required.";
    }

    if (
      !formData
        .present_class_of_the_pupil
        .trim()
    ) {
      return "Present class of the Pupil is required.";
    }

    /* 9 */

    if (
      !formData
        .class_for_which_admission_is_sought
    ) {
      return "Class for which admission is sought is required.";
    }

    if (!formData.does_the_applicant_have_any_siblings_studying_in_this_school) {
      return "Please select whether the applicant has siblings studying in this school.";
    }

    if (formData.does_the_applicant_have_any_siblings_studying_in_this_school === "Yes" && !formData.name_of_the_sibling.trim()) {
      return "Name of the sibling is required.";
    }

    if (formData.does_the_applicant_have_any_siblings_studying_in_this_school === "Yes" && !formData.class_and_section.trim()) {
      return "Class and section of the sibling is required.";
    }

    if (DOCUMENT_FIELDS.some(([field]) => !supportingDocuments[field])) {
      return "Please upload all required admission documents.";
    }

    /* PHOTO */

    if (!photo) {
      return "Student Photograph is required.";
    }

    /* SIGNATURE */

    if (
      !formData
        .signature_of_parent
        .trim()
    ) {
      return "Signature of Parent is required.";
    }

    return null;
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");

    const validationError =
      validateForm();

    if (
      validationError
    ) {
      setError(
        validationError,
      );

      return;
    }

    try {
      setIsSubmitting(
        true,
      );

      const payload =
        new FormData();

      /* ===============================================
         TEXT DATA
      ================================================ */

      Object.entries(
        formData,
      ).forEach(
        ([key, value]) => {
          payload.append(
            key,
            value.trim(),
          );
        },
      );

      /* ===============================================
         PHOTO
      ================================================ */

      if (photo) {
        payload.append(
          "student_s_passport_size_photograph",
          photo,
          photo.name,
        );
      }

      DOCUMENT_FIELDS.forEach(([field]) => {
        const document = supportingDocuments[field];
        if (document) payload.append(field, document, document.name);
      });

      /* ===============================================
         APPLICATION DATE
      ================================================ */

      payload.append(
        "application_date",
        getLocalDateISO(),
      );

      /* ===============================================
         API
      ================================================ */

      const response =
        await fetch(
          ADMISSION_API_URL,
          {
            method:
              "POST",

            body:
              payload,

            cache:
              "no-store",
          },
        );

      const responseText =
        await response.text();

      let result: ApiResult =
        {};

      try {
        result =
          responseText
            ? JSON.parse(
                responseText,
              )
            : {};
      } catch {
        throw new Error(
          `Invalid server response (HTTP ${response.status}).`,
        );
      }

      if (
        !response.ok ||
        result.success ===
          false
      ) {
        throw new Error(
          result.message ||
            "Unable to submit the admission application.",
        );
      }

      setRegistrationNo(
        result.registration_no ||
          "Submitted",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to submit the admission application.",
      );
    } finally {
      setIsSubmitting(
        false,
      );
    }
  }

  /* =======================================================
     RESET
  ======================================================= */

  function closeSuccess() {
    setRegistrationNo(
      null,
    );

    setFormData({
      ...INITIAL_FORM_DATA,
    });

    setPhoto(null);

    setSupportingDocuments({ previous_school_progress_report_front: null, previous_school_progress_report_back: null, birth_certificate: null, aadhaar_card: null });

    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview,
      );
    }

    setPhotoPreview(
      null,
    );

    setError("");

    if (
      photoInputRef.current
    ) {
      photoInputRef.current.value =
        "";
    }

    formRef.current?.reset();
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      className="
        min-h-screen

        bg-[#F3F6F8]

        px-3
        py-8

        sm:px-6
        sm:py-12

        lg:px-8
      "
    >
      <form
        ref={formRef}

        onSubmit={
          handleSubmit
        }

        noValidate

        className="
          mx-auto

          w-full
          max-w-[1100px]

          overflow-hidden

          rounded-[14px]

          border
          border-[#DCE4EA]

          bg-[#FFFEFB]

          shadow-[0_18px_55px_rgba(27,54,74,0.08)]
        "
      >
        {/* =================================================
            TOP LINE
        ================================================= */}

        <div
          className="
            h-[4px]
            w-full

            bg-[#24435A]
          "
        />

        <div
          className="
            px-5
            py-8

            sm:px-8
            sm:py-10

            md:px-10

            lg:px-12
          "
        >
          <section className="mb-8 overflow-hidden rounded-2xl border border-[#BFD9F5] bg-gradient-to-br from-[#F2F8FF] via-[#F8FBFF] to-white shadow-[0_8px_24px_rgba(0,117,255,0.08)] sm:mb-10">
            <div className="border-b border-[#D6E7F8] bg-white/70 px-5 py-3.5 sm:px-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0075FF] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1px] text-white"><CheckCircle2 size={14} /> Before you begin</span>
                <span className="text-[12px] font-medium text-[#526A7A] sm:text-[13px]">Please keep these documents ready before filling the application.</span>
              </div>
            </div>
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <h2 className="text-[17px] font-bold leading-tight text-[#17324B] sm:text-[20px]">Documents Required for Online Admission Registration (UKG to Std. VIII)</h2>
              <p className="mt-2 text-[13px] leading-[1.65] text-[#435D70] sm:text-[14px]">Parents are requested to keep the following documents ready for online admission registration:</p>
              <ol className="mt-4 grid gap-3 text-[13px] text-[#334E63] sm:grid-cols-3 sm:text-[14px]">
                <li className="rounded-xl border border-[#D8E7F5] bg-white px-4 py-3 leading-[1.55]"><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E6F2FF] text-[11px] font-bold text-[#0075FF]">1</span><span className="font-semibold text-[#17324B]">Previous School Progress Report Card</span><span className="mt-1 block text-[12px] text-[#526A7A]">— Photocopies of both the front and back pages.</span></li>
                <li className="rounded-xl border border-[#D8E7F5] bg-white px-4 py-3 leading-[1.55]"><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E6F2FF] text-[11px] font-bold text-[#0075FF]">2</span><span className="font-semibold text-[#17324B]">Student&apos;s Birth Certificate</span><span className="mt-1 block text-[12px] text-[#526A7A]">— Photocopy.</span></li>
                <li className="rounded-xl border border-[#D8E7F5] bg-white px-4 py-3 leading-[1.55]"><span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E6F2FF] text-[11px] font-bold text-[#0075FF]">3</span><span className="font-semibold text-[#17324B]">Student&apos;s Aadhaar Card</span><span className="mt-1 block text-[12px] text-[#526A7A]">— Photocopy.</span></li>
              </ol>
            </div>
          </section>

          {/* =================================================
              HEADER + PHOTO
          ================================================= */}

          <div
            className="
              relative

              pb-8

              sm:min-h-[270px]
              sm:pr-[190px]

              lg:min-h-[280px]
              lg:pr-[210px]
            "
          >
            {/* =============================================
                HEADING
            ============================================== */}

            <div
              className="
                max-w-[800px]
              "
            >
              <span
                className="
                  inline-flex

                  rounded-full

                  border
                  border-[#CCE2FF]

                  bg-[#F1F7FF]

                  px-4
                  py-[7px]

                  text-[10px]
                  font-bold

                  uppercase
                  tracking-[1px]

                  text-[#0075FF]

                  sm:text-[11px]
                "
              >
                UKG to Std VIII Admission
              </span>

              <h1
                className="
                  mt-4

                  font-primary

                  text-[20px]
                  font-bold

                  leading-[1.45]

                  text-[#142B3D]

                  sm:text-[25px]

                  lg:text-[28px]
                "
              >
                Preliminary Application for Classes (UKG – STD VIII)
                Admission
              </h1>

              <p
                className="
                  mt-3

                  text-[11px]
                  font-semibold

                  uppercase
                  tracking-[1.4px]

                  text-[#0075FF]

                  sm:text-[12px]
                "
              >
                Academic Year 2027 – 2028
              </p>

            
            </div>

            {/* =============================================
                PHOTO - MANDATORY
            ============================================== */}

            <div
              className="
                mt-7

                w-[140px]

                sm:absolute
                sm:right-0
                sm:top-0
                sm:mt-0
                sm:w-[150px]
              "
            >
              <p
                className="
                  mb-2

                  text-center

                  text-[10px]
                  font-bold

                  uppercase
                  tracking-[0.7px]

                  text-[#425D70]
                "
              >
                Photo

                <RequiredStar />
              </p>

              <label
                className="
                  group

                  flex

                  h-[175px]
                  w-[140px]

                  cursor-pointer

                  flex-col

                  items-center
                  justify-center

                  overflow-hidden

                  rounded-[8px]

                  border-2
                  border-dashed
                  border-[#A6BBCB]

                  bg-[#F8FAFC]

                  text-center

                  transition-all
                  duration-300

                  hover:border-[#0075FF]
                  hover:bg-[#F2F8FF]

                  sm:h-[185px]
                  sm:w-[150px]
                "
              >
                <input
                  ref={
                    photoInputRef
                  }

                  type="file"

                  accept="image/jpeg,image/png,image/webp"

                  required={
                    !photo
                  }

                  className="sr-only"

                  onChange={
                    handlePhotoChange
                  }
                />

                {photoPreview ? (
                  <img
                    src={
                      photoPreview
                    }

                    alt="Pupil photograph"

                    className="
                      h-full
                      w-full

                      object-cover
                    "
                  />
                ) : (
                  <>
                    <div
                      className="
                        flex

                        h-[46px]
                        w-[46px]

                        items-center
                        justify-center

                        rounded-full

                        bg-[#E7F2FF]

                        text-[#0075FF]
                      "
                    >
                      <ImagePlus
                        size={23}
                      />
                    </div>

                    <span
                      className="
                        mt-3

                        text-[10px]
                        font-bold

                        uppercase
                        tracking-[0.6px]

                        text-[#3E596E]
                      "
                    >
                      Upload Photo
                    </span>

                    <span
                      className="
                        mt-1

                        text-[9px]

                        text-[#8999A5]
                      "
                    >
                      Click to upload
                    </span>
                  </>
                )}
              </label>

              <div
                className="
                  mt-2

                  text-center

                  text-[9px]

                  leading-[1.55]

                  text-[#738795]
                "
              >
                <p>
                  JPG, PNG or WebP
                </p>

                <p
                  className="
                    font-semibold
                    text-[#526A7A]
                  "
                >
                  Maximum 5 MB
                </p>

                {photo && (
                  <p
                    title={
                      photo.name
                    }

                    className="
                      mt-1

                      truncate

                      text-[#0075FF]
                    "
                  >
                    {
                      photo.name
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              DIVIDER BELOW COMPLETE PHOTO AREA
          ================================================= */}

          <div
            className="
              h-px
              w-full

              bg-[#D7DEE4]
            "
          />

          {/* =================================================
              FORM
          ================================================= */}

          <div
            className="
              mt-9

              space-y-5

              sm:mt-10
              sm:space-y-6
            "
          >
            {/* =================================================
                1
            ================================================= */}

            <FormRow
              number="1."
              label="Name of the Pupil"
            >
              <input
                type="text"

                name="name_of_the_pupil"

                value={
                  formData.name_of_the_pupil
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Name of the Pupil"

                className={
                  inputClass
                }
              />
            </FormRow>

            {/* =================================================
                2
            ================================================= */}

            <FormRow
              number="2."
              label="Date of Birth"
            >
              <input
                type="date"

                name="date_of_birth"

                value={
                  formData.date_of_birth
                }

                onChange={
                  handleChange
                }

                required

                max={
                  getLocalDateISO()
                }

                className={
                  inputClass
                }
              />
            </FormRow>

            {/* =================================================
                3
            ================================================= */}

            <FormRow
              number="3."
              label="Religion"
            >
              <select
                name="religion"

                value={
                  formData.religion
                }

                onChange={
                  handleChange
                }

                required

                className={`
                  ${inputClass}

                  cursor-pointer
                `}
              >
                <option value="">
                  Select Religion
                </option>

                <option value="Hindu">
                  Hindu
                </option>

                <option value="Christian - Roman Catholic">
                  Christian - Roman Catholic
                </option>

                <option value="Christian">
                  Christian
                </option>

                <option value="Muslim">
                  Muslim
                </option>

                <option value="Others">
                  Others
                </option>
              </select>
            </FormRow>

            {/* =================================================
                4

                Mandatory only when Roman Catholic.
            ================================================= */}

            <FormRow
              number="4."

              label="If Roman Catholic specify the name of the Parish"

              required={
                formData.religion ===
                "Christian - Roman Catholic"
              }

              alignTop
            >
              <input
                type="text"

                name="name_of_parish"

                value={
                  formData.name_of_parish
                }

                onChange={
                  handleChange
                }

                required={
                  formData.religion ===
                  "Christian - Roman Catholic"
                }

                disabled={
                  formData.religion !==
                  "Christian - Roman Catholic"
                }

                placeholder={
                  formData.religion ===
                  "Christian - Roman Catholic"
                    ? "Enter name of Parish"
                    : "Applicable only for Roman Catholic"
                }

                className={`
                  ${inputClass}

                  disabled:cursor-not-allowed

                  disabled:bg-[#F5F6F7]

                  disabled:text-[#9CA7AF]
                `}
              />
            </FormRow>

            {/* =================================================
                5 - FATHER
            ================================================= */}

            <FormRow
              number="5."
              label="Father's Name"
            >
              <input
                type="text"

                name="father_s_name"

                value={
                  formData.father_s_name
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Father's Name"

                className={
                  inputClass
                }
              />
            </FormRow>

            <SubFormRow label="Qualification">
              <input
                type="text"

                name="father_s_qualification"

                value={
                  formData.father_s_qualification
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Qualification"

                className={
                  inputClass
                }
              />
            </SubFormRow>

            <SubFormRow label="Occupation">
              <input
                type="text"

                name="father_s_occupation"

                value={
                  formData.father_s_occupation
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Occupation"

                className={
                  inputClass
                }
              />
            </SubFormRow>

            <SubFormRow label="Income per month">
              <input
                type="number"

                min="0"

                step="0.01"

                name="father_s_income_per_month"

                value={
                  formData.father_s_income_per_month
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Income per month"

                className={
                  inputClass
                }
              />
            </SubFormRow>

            <SubFormRow label="Mobile No">
              <input
                type="tel"

                name="father_s_mobile_no"

                value={
                  formData.father_s_mobile_no
                }

                onChange={
                  handleChange
                }

                required

                inputMode="numeric"

                maxLength={10}

                pattern="[0-9]{10}"

                placeholder="Enter Mobile No"

                className={
                  inputClass
                }
              />
            </SubFormRow>

            {/* =================================================
                6 - MOTHER
            ================================================= */}

            <FormRow
              number="6."
              label="Mother's Name"
            >
              <input
                type="text"

                name="mother_s_name"

                value={
                  formData.mother_s_name
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Mother's Name"

                className={
                  inputClass
                }
              />
            </FormRow>

            <SubFormRow label="Qualification">
              <input
                type="text"

                name="mother_s_qualification"

                value={
                  formData.mother_s_qualification
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Qualification"

                className={
                  inputClass
                }
              />
            </SubFormRow>

            <SubFormRow label="Occupation">
              <input
                type="text"

                name="mother_s_occupation"

                value={
                  formData.mother_s_occupation
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Occupation"

                className={
                  inputClass
                }
              />
            </SubFormRow>

            <SubFormRow label="Income per month">
              <input
                type="number"

                min="0"

                step="0.01"

                name="mother_s_income_per_month"

                value={
                  formData.mother_s_income_per_month
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Income per month"

                className={
                  inputClass
                }
              />
            </SubFormRow>

            <SubFormRow label="Mobile No">
              <input
                type="tel"

                name="mother_s_mobile_no"

                value={
                  formData.mother_s_mobile_no
                }

                onChange={
                  handleChange
                }

                required

                inputMode="numeric"

                maxLength={10}

                pattern="[0-9]{10}"

                placeholder="Enter Mobile No"

                className={
                  inputClass
                }
              />
            </SubFormRow>

            <SubFormRow label="E-mail ID">
              <input
                type="email"

                name="email_id"

                value={
                  formData.email_id
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter E-mail ID"

                className={
                  inputClass
                }
              />
            </SubFormRow>

            {/* =================================================
                7
            ================================================= */}

            <FormRow
              number="7."

              label="Residential Address"

              alignTop
            >
              <textarea
                name="residential_address"

                value={
                  formData.residential_address
                }

                onChange={
                  handleChange
                }

                required

                rows={4}

                placeholder="Enter Residential Address"

                className={
                  textareaClass
                }
              />
            </FormRow>

            {/* =================================================
                8
            ================================================= */}

            <FormRow
              number="8."

              label="Name of the School currently attended by the Pupil"

              alignTop
            >
              <input
                type="text"

                name="name_of_school_currently_attended"

                value={
                  formData.name_of_school_currently_attended
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Name of the School"

                className={
                  inputClass
                }
              />
            </FormRow>

            {/* ===============================================
                PRESENT CLASS - MANDATORY
            ================================================ */}

            <div
              className="
                grid
                grid-cols-1

                gap-2

                sm:grid-cols-[310px_minmax(0,1fr)]

                sm:items-center

                sm:gap-8

                lg:grid-cols-[400px_minmax(0,1fr)]
              "
            >
              <div
                className="
                  flex

                  items-center

                  pl-[38px]

                  sm:pl-[48px]
                "
              >
                <span
                  className="
                    mr-3

                    text-[15px]

                    text-[#1C3447]
                  "
                >
                  ➤
                </span>

                <label
                  htmlFor="present_class_of_the_pupil"

                  className="
                    text-[14px]
                    font-medium

                    leading-[1.45]

                    text-[#233B4F]

                    sm:text-[15px]
                  "
                >
                  Present class of the Pupil

                  <RequiredStar />
                </label>
              </div>

              <input
                id="present_class_of_the_pupil"

                type="text"

                name="present_class_of_the_pupil"

                value={
                  formData.present_class_of_the_pupil
                }

                onChange={
                  handleChange
                }

                required

                placeholder="Enter Present class of the Pupil"

                className={
                  inputClass
                }
              />
            </div>

            {/* =================================================
                9
            ================================================= */}

            <FormRow
              number="9."

              label="Class for which admission is sought"
            >
              <select
                name="class_for_which_admission_is_sought"

                value={
                  formData.class_for_which_admission_is_sought
                }

                onChange={
                  handleChange
                }

                required

                className={`
                  ${inputClass}

                  cursor-pointer
                `}
              >
                <option value="">
                  Select Class
                </option>

                {ADMISSION_CLASSES.map(
                  (
                    className,
                  ) => (
                    <option
                      key={
                        className
                      }

                      value={
                        className
                      }
                    >
                      {
                        className
                      }
                    </option>
                  ),
                )}
              </select>
            </FormRow>

            <FormRow
              number="10."
              label="Does the applicant have any siblings studying in this School?"
            >
              <fieldset className="flex min-h-[46px] items-center gap-3" aria-label="Sibling studying in this school">
                {[["Yes", "yes"], ["No", "no"]].map(([label, id]) => (
                  <label key={id} htmlFor={`siblings-studying-${id}`} className={`inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-lg border px-4 text-[14px] font-semibold transition-colors ${formData.does_the_applicant_have_any_siblings_studying_in_this_school === label ? "border-[#0075FF] bg-[#F1F7FF] text-[#0755AD]" : "border-[#CBD5DE] bg-white text-[#344B5C] hover:border-[#7BADE7]"}`}>
                    <input id={`siblings-studying-${id}`} type="radio" name="does_the_applicant_have_any_siblings_studying_in_this_school" value={label} checked={formData.does_the_applicant_have_any_siblings_studying_in_this_school === label} onChange={handleChange} required={!formData.does_the_applicant_have_any_siblings_studying_in_this_school} className="h-4 w-4 accent-[#0075FF]" />
                    {label}
                  </label>
                ))}
              </fieldset>
            </FormRow>

            {formData.does_the_applicant_have_any_siblings_studying_in_this_school === "Yes" && (
              <div className="grid gap-5 rounded-xl border border-[#D7E5F5] bg-[#F8FBFF] p-5 sm:grid-cols-2 sm:gap-6">
                <label className="block text-[15px] font-semibold text-[#12345A]">Name of the Sibling <RequiredStar />
                  <input type="text" name="name_of_the_sibling" value={formData.name_of_the_sibling} onChange={handleChange} required placeholder="Enter sibling's name" className="mt-2 h-[60px] w-full rounded-xl border border-[#BCD4F3] bg-white px-5 text-[16px] font-medium text-[#17324B] outline-none transition placeholder:text-[#8EA5C8] focus:border-[#0075FF] focus:ring-2 focus:ring-[#DCEEFF]" />
                </label>
                <label className="block text-[15px] font-semibold text-[#12345A]">Class and Section <RequiredStar />
                  <input type="text" name="class_and_section" value={formData.class_and_section} onChange={handleChange} required placeholder="Enter class and section" className="mt-2 h-[60px] w-full rounded-xl border border-[#BCD4F3] bg-white px-5 text-[16px] font-medium text-[#17324B] outline-none transition placeholder:text-[#8EA5C8] focus:border-[#0075FF] focus:ring-2 focus:ring-[#DCEEFF]" />
                </label>
              </div>
            )}
          </div>

          {/* =================================================
              DOCUMENTS REQUIRED + SCHOOL NOTE
          ================================================= */}

          <div
            className="
              mt-10

              border-t
              border-[#D7DEE4]

              pt-7
            "
          >
            <div className="rounded-[9px] border border-[#CFE1F3] bg-[#F7FBFF] px-4 py-5 sm:px-5">
              <div>
                <h3 className="text-[13px] font-bold text-[#17324B] sm:text-[14px]">Upload Documents <span className="font-medium text-[#526A7A]">(PDF, JPG, PNG or WebP; maximum 5 MB each)</span></h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-dashed border-[#A6BBCB] bg-white p-3 sm:col-span-2">
                  <span className="block text-[12px] font-semibold leading-5 text-[#17324B]">Previous School Progress Report Card <RequiredStar /></span>
                  <span className="mt-1 block text-[11px] text-[#526A7A]">Upload clear photocopies of both the front and back pages.</span>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {DOCUMENT_FIELDS.slice(0, 2).map(([field, label]) => {
                      const document = supportingDocuments[field];
                      return <label key={field} className="cursor-pointer rounded-lg border border-[#D6E3EE] bg-[#F7FBFF] px-3 py-2.5 transition-colors hover:border-[#0075FF] hover:bg-[#EEF7FF]">
                        <span className="block text-[11px] font-semibold text-[#17324B]">{label.endsWith("Front Page") ? "Front page" : "Back page"} <RequiredStar /></span>
                        <span className="mt-1 block truncate text-[11px] text-[#526A7A]">{document ? document.name : "Click to upload"}</span>
                        <input type="file" name={field} accept="application/pdf,image/jpeg,image/png,image/webp" required={!document} onChange={event => handleDocumentChange(field, event.target.files?.[0] ?? null)} className="sr-only" />
                      </label>;
                    })}
                  </div>
                </div>
                {DOCUMENT_FIELDS.slice(2).map(([field, label]) => {
                  const document = supportingDocuments[field];
                  return <label key={field} className="cursor-pointer rounded-lg border border-dashed border-[#A6BBCB] bg-white p-3 transition-colors hover:border-[#0075FF] hover:bg-[#F4F9FF]">
                    <span className="block text-[12px] font-semibold leading-5 text-[#17324B]">{label} <RequiredStar /></span>
                    <span className="mt-2 block truncate text-[11px] text-[#526A7A]">{document ? document.name : "Click to upload"}</span>
                    <input type="file" name={field} accept="application/pdf,image/jpeg,image/png,image/webp" required={!document} onChange={event => handleDocumentChange(field, event.target.files?.[0] ?? null)} className="sr-only" />
                  </label>;
                })}
              </div>
              </div>
              <div className="mt-4 border-t border-[#DCE8F3] pt-3 text-[12px] leading-[1.55] text-[#435D70] sm:text-[13px]">
                <p><strong className="text-[#17324B]">Entrance Examination Notification</strong></p>
                <p className="mt-1">If your child is shortlisted for the entrance examination, you will receive a notification through email and WhatsApp.</p>
                <p className="mt-3"><strong className="text-[#17324B]">Important Note</strong></p>
                <p className="mt-1">Online registration does not guarantee admission. Admission is subject to the selection process and availability of seats.</p>
              </div>
            </div>

            <div
              className="
                mt-5

                rounded-[9px]

                border
                border-[#E8DA9D]

                bg-[#FFFBEA]

                px-4
                py-4

                sm:px-5
              "
            >
              <p
                className="
                  text-[12px]

                  leading-[1.75]

                  text-[#514B38]

                  sm:text-[13px]
                "
              >
                <strong>
                  Please Note:
                </strong>{" "}

                The School does not collect Donation for
                Admission. If the Admission is secured through
                unfair means the admission will be cancelled
                immediately.
              </p>
            </div>

            <p
              className="
                mt-6

                text-[12px]
                font-bold

                leading-[1.75]

                text-[#273F52]

                sm:text-[13px]
              "
            >
              Confirmation of your daughter&apos;s admission in
              this School will depend only on the vacancy.
            </p>
          </div>

          {/* =================================================
              DATE + SIGNATURE
          ================================================= */}

          <div
            className="
              mt-9

              grid
              grid-cols-1

              gap-7

              border-t
              border-[#D9E1E7]

              pt-7

              sm:grid-cols-2
              sm:gap-10

              lg:gap-14
            "
          >
            {/* =============================================
                DATE
            ============================================== */}

            <div>
              <label
                htmlFor="application_date"

                className="
                  mb-2

                  block

                  text-[11px]
                  font-bold

                  uppercase
                  tracking-[0.6px]

                  text-[#263F53]

                  sm:text-[12px]
                "
              >
                DATE:
              </label>

              <input
                id="application_date"

                type="text"

                value={new Date().toLocaleDateString(
                  "en-IN",
                  {
                    day:
                      "2-digit",

                    month:
                      "2-digit",

                    year:
                      "numeric",
                  },
                )}

                readOnly

                className="
                  h-[46px]
                  w-full

                  border-0
                  border-b
                  border-[#9AA7B4]

                  bg-[#F8FAFC]

                  px-1

                  text-[14px]
                  font-medium

                  text-[#243E52]

                  outline-none
                "
              />
            </div>

            {/* =============================================
                SIGNATURE - MANDATORY
            ============================================== */}

            <div>
              <label
                htmlFor="signature_of_parent"

                className="
                  mb-2

                  block

                  text-[11px]
                  font-bold

                  uppercase
                  tracking-[0.6px]

                  text-[#263F53]

                  sm:text-[12px]
                "
              >
                SIGNATURE OF PARENT

                <RequiredStar />
              </label>

              <input
                id="signature_of_parent"

                type="text"

                name="signature_of_parent"

                value={
                  formData.signature_of_parent
                }

                onChange={
                  handleChange
                }

                required

                autoComplete="name"

                placeholder="Type Parent's Full Name"

                className="
                  h-[46px]
                  w-full

                  border-0
                  border-b
                  border-[#9AA7B4]

                  bg-transparent

                  px-1

                  text-[14px]
                  font-semibold

                  text-[#243E52]

                  outline-none

                  transition-all
                  duration-200

                  placeholder:font-normal
                  placeholder:text-[#A4AFB8]

                  focus:border-[#0075FF]
                "
              />

              <p
                className="
                  mt-2

                  text-[10px]

                  leading-[1.6]

                  text-[#80909C]

                  sm:text-[11px]
                "
              >
                Type the parent&apos;s full name as the electronic
                signature.
              </p>
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              role="alert"

              className="
                mt-7

                rounded-[9px]

                border
                border-red-200

                bg-red-50

                px-4
                py-3

                text-[13px]
                font-medium

                leading-6

                text-red-700
              "
            >
              {error}
            </div>
          )}

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div
            className="
              mt-9

              flex

              justify-center

              sm:justify-end
            "
          >
            <button
              type="submit"

              disabled={
                isSubmitting
              }

              className="
                inline-flex

                min-h-[50px]

                w-full

                items-center
                justify-center

                gap-3

                rounded-[9px]

                bg-[#0075FF]

                px-8

                text-[14px]
                font-semibold

                text-white

                shadow-[0_8px_22px_rgba(0,117,255,0.20)]

                transition-all
                duration-300

                hover:bg-[#005FD1]

                hover:shadow-[0_10px_28px_rgba(0,117,255,0.25)]

                disabled:cursor-not-allowed
                disabled:opacity-60

                sm:w-auto
                sm:min-w-[220px]
              "
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

                  <Send
                    size={17}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* =====================================================
          SUCCESS POPUP
      ====================================================== */}

      {registrationNo && (
        <div
          className="
            fixed
            inset-0
            z-[9999]

            flex

            items-center
            justify-center

            bg-[#10273A]/65

            px-4

            backdrop-blur-sm
          "
        >
          <div
            role="dialog"

            aria-modal="true"

            aria-labelledby="admission-success-title"

            className="
              relative

              w-full
              max-w-[440px]

              rounded-[18px]

              bg-white

              px-6
              py-9

              text-center

              shadow-2xl

              sm:px-9
            "
          >
            <button
              type="button"

              aria-label="Close success message"

              onClick={
                closeSuccess
              }

              className="
                absolute

                right-3
                top-3

                flex

                h-9
                w-9

                items-center
                justify-center

                rounded-full

                text-[#657683]

                transition

                hover:bg-[#F2F5F7]
              "
            >
              <X
                size={19}
              />
            </button>

            <div
              className="
                mx-auto

                flex

                h-[72px]
                w-[72px]

                items-center
                justify-center

                rounded-full

                bg-green-50
              "
            >
              <CheckCircle2
                size={48}

                className="text-green-600"
              />
            </div>

            <h2
              id="admission-success-title"

              className="
                mt-5

                text-[22px]
                font-bold

                text-[#18354B]
              "
            >
              Application Submitted Successfully!
            </h2>

            <p
              className="
                mt-3

                text-[13px]

                leading-6

                text-[#677B8A]
              "
            >
              Your UKG to Std VIII admission requisition has been
              received successfully.
            </p>

            {registrationNo !==
              "Submitted" && (
              <div
                className="
                  mt-6

                  rounded-xl

                  border
                  border-blue-200

                  bg-blue-50

                  p-5
                "
              >
                <p
                  className="
                    text-[10px]
                    font-bold

                    uppercase
                    tracking-[1px]

                    text-[#0075FF]
                  "
                >
                  Registration No.
                </p>

                <p
                  className="
                    mt-2

                    text-[25px]
                    font-bold

                    tracking-wide

                    text-[#0755AD]
                  "
                >
                  {
                    registrationNo
                  }
                </p>
              </div>
            )}

            <p
              className="
                mt-5

                text-[11px]

                leading-5

                text-slate-500
              "
            >
              Please save your registration details for future
              reference.
            </p>

            <button
              type="button"

              onClick={
                closeSuccess
              }

              className="
                mt-7

                w-full

                rounded-[9px]

                bg-[#0075FF]

                px-6
                py-3

                text-[13px]
                font-semibold

                text-white

                transition

                hover:bg-[#005FD1]
              "
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   REQUIRED STAR
========================================================= */

function RequiredStar() {
  return (
    <span
      aria-hidden="true"

      className="
        ml-1

        font-bold

        text-red-500
      "
    >
      *
    </span>
  );
}

/* =========================================================
   NUMBERED FORM ROW
========================================================= */

function FormRow({
  number,
  label,
  children,
  alignTop = false,
  required = true,
}: {
  number: string;

  label: string;

  children: ReactNode;

  alignTop?: boolean;

  required?: boolean;
}) {
  return (
    <div
      className={`
        grid
        grid-cols-1

        gap-2

        sm:grid-cols-[310px_minmax(0,1fr)]

        sm:gap-8

        lg:grid-cols-[400px_minmax(0,1fr)]

        ${
          alignTop
            ? "sm:items-start"
            : "sm:items-center"
        }
      `}
    >
      <div
        className={`
          flex

          gap-3

          ${
            alignTop
              ? "pt-2"
              : "items-center"
          }
        `}
      >
        <span
          className="
            w-[25px]

            shrink-0

            text-right

            text-[14px]
            font-semibold

            text-[#1F394D]

            sm:text-[15px]
          "
        >
          {number}
        </span>

        <label
          className="
            text-[14px]
            font-medium

            leading-[1.5]

            text-[#233B4F]

            sm:text-[15px]
          "
        >
          {label}

          {required && (
            <RequiredStar />
          )}
        </label>
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   SUB ROW

   ALL SUB FIELDS ARE MANDATORY
========================================================= */

function SubFormRow({
  label,
  children,
}: {
  label: string;

  children: ReactNode;
}) {
  return (
    <div
      className="
        grid
        grid-cols-1

        gap-2

        sm:grid-cols-[310px_minmax(0,1fr)]

        sm:items-center

        sm:gap-8

        lg:grid-cols-[400px_minmax(0,1fr)]
      "
    >
      <div
        className="
          pl-[38px]

          sm:pl-[38px]
        "
      >
        <label
          className="
            text-[14px]
            font-medium

            text-[#344B5C]

            sm:text-[15px]
          "
        >
          {label}

          <RequiredStar />
        </label>
      </div>

      {children}
    </div>
  );
}
