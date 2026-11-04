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
                Requisition from Parent for Class Admission for
                the academic year 2027 – 28.
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
                Rosary Matriculation Higher Secondary School
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

              label="If Roman Catholic specify the name of Parish"

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
          </div>

          {/* =================================================
              SCHOOL NOTE
          ================================================= */}

          <div
            className="
              mt-10

              border-t
              border-[#D7DEE4]

              pt-7
            "
          >
            <div
              className="
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