
"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ChangeEvent, type FormEvent } from "react";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type Toast = {
  type: "success" | "error";
  title: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

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
    id: "name" as const,
    label: "Name",
    type: "text",
    placeholder: "Enter Your Name",
  },
  {
    id: "email" as const,
    label: "Email",
    type: "email",
    placeholder: "Enter Your Email",
  },
  {
    id: "phone" as const,
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter Your Phone Number",
  },
];

const inputClass = `
  w-full rounded-[10px] border border-[#C5DCF9]
  bg-white px-3.5 font-secondary text-[13px]
  text-[#101828] outline-none
  transition-all duration-300
  placeholder:text-[#A5ACB8]
  hover:border-[#9AC4FB]
  focus:border-primary
  focus:shadow-[0_0_0_3px_rgba(0,117,255,0.07)]
  disabled:cursor-not-allowed disabled:opacity-70
`;

export default function ConnectSection() {
  const [formData, setFormData] = useState<ContactForm>({
    ...initialForm,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // HANDLE INPUT CHANGE
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    const nextValue =
      name === "phone"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;

    setFormData((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    setToast(null);
  };

  // API FORM SUBMISSION
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    // REQUIRED FIELD VALIDATION
    if (!name || !email || !phone || !message) {
      setToast({
        type: "error",
        title: "Incomplete Form",
        message: "Please fill in all required fields.",
      });
      return;
    }

    // EMAIL VALIDATION
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({
        type: "error",
        title: "Invalid Email",
        message: "Please enter a valid email address.",
      });
      return;
    }

    // PHONE VALIDATION
    if (!/^[0-9]{10}$/.test(phone)) {
      setToast({
        type: "error",
        title: "Invalid Phone Number",
        message: "Please enter a valid 10-digit phone number.",
      });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      // SAME API AS GET IN TOUCH SECTION
      const apiBaseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "/backend"
      ).replace(/\/$/, "");

      const response = await fetch(
        `${apiBaseUrl}/api/v1/contact-enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            message,
          }),
          cache: "no-store",
        }
      );

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || "Unable to submit your enquiry."
        );
      }

      // SUCCESS NOTIFICATION
      setToast({
        type: "success",
        title: "Message Sent Successfully!",
        message:
          result.message ||
          "Thank you for contacting Rosary School. Our team will get back to you.",
      });

      // RESET FORM
      setFormData({ ...initialForm });
    } catch (error) {
      setToast({
        type: "error",
        title: "Submission Failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[#F7F9FC] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* BACKGROUND GRID */}
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

        {/* BACKGROUND GLOWS */}
        <div className="pointer-events-none absolute right-[-100px] top-[-120px] h-[240px] w-[240px] rounded-full bg-[#0075FF]/10 blur-[85px] sm:h-[280px] sm:w-[280px] lg:h-[330px] lg:w-[330px]" />

        <div className="pointer-events-none absolute bottom-[-130px] left-[-100px] h-[230px] w-[230px] rounded-full bg-[#0075FF]/8 blur-[90px]" />

        {/* MAIN CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 mx-auto w-full max-w-[1240px] overflow-hidden rounded-[10px] border border-white/80 bg-white/85 p-4 shadow-[0_15px_45px_rgba(15,23,42,0.05)] backdrop-blur-md sm:p-5 lg:p-6 xl:p-7"
        >
          {/* DECORATIVE CIRCLE */}
          <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[220px] w-[220px] rounded-full border-[38px] border-[#0075FF]/[0.025]" />

          <div className="relative grid grid-cols-1 items-start gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:gap-12">

            {/* LEFT CONTACT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.08,
              }}
              className="flex flex-col lg:py-1"
            >
              <span className="mb-5 w-fit rounded-[8px] bg-[#EDF5FF] px-2.5 py-1 font-secondary text-[9px] font-semibold uppercase tracking-[0.12em] text-primary sm:text-[10px]">
                Contact Us
              </span>

              <h2 className="mt-3 max-w-[380px] pb-5 font-primary text-[34px] font-bold uppercase leading-[0.9] tracking-[-0.05em] text-[#0F172A] sm:text-[40px] lg:text-[46px] xl:text-[50px]">
                Connect
                <br />
                With Rosary
              </h2>

              <p className="mt-3 max-w-[500px] font-secondary text-[13px] leading-[1.6] text-[#667085] sm:text-[14px]">
                Have a question or need more information about Rosary School?
                Send us your enquiry and our team will be happy to assist you.
              </p>

              <div className="my-5 h-px w-full max-w-[470px] bg-gradient-to-r from-[#E4EAF2] via-[#E4EAF2] to-transparent" />

              {/* CONTACT DETAILS */}
              <div className="flex flex-col gap-2.5">
                {contactDetails.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.15 + index * 0.06,
                      }}
                      className="group flex max-w-[520px] items-center gap-2.5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E2ECF9] bg-[#F4F8FE] text-primary transition-all duration-300 group-hover:border-[#BDD8FC] group-hover:bg-[#EAF4FF]">
                        <Icon size={15} strokeWidth={1.8} />
                      </div>

                      <p className="break-words font-secondary text-[12px] leading-[1.45] text-[#344054] sm:text-[13px]">
                        {item.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* RIGHT FORM SECTION */}
            <motion.div
              initial={{ opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.12,
              }}
              className="relative overflow-hidden rounded-[10px] border border-[#E7EDF5] bg-[#FBFCFE] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.035)] sm:p-5 lg:p-5"
            >
              <div className="pointer-events-none absolute right-[-60px] top-[-70px] h-[150px] w-[150px] rounded-full bg-[#0075FF]/7 blur-[50px]" />

              <form
                onSubmit={handleSubmit}
                className="relative z-10 grid grid-cols-1 gap-3"
              >
                {/* NAME, EMAIL, PHONE */}
                {formFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.38,
                      delay: 0.18 + index * 0.06,
                    }}
                  >
                    <label
                      htmlFor={`connect-${field.id}`}
                      className="mb-1 block font-primary text-[11px] font-medium text-[#101828] sm:text-[12px]"
                    >
                      {field.label}
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id={`connect-${field.id}`}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.id]}
                      onChange={handleChange}
                      required
                      maxLength={
                        field.id === "phone"
                          ? 10
                          : field.id === "email"
                          ? 254
                          : 150
                      }
                      pattern={
                        field.id === "phone"
                          ? "[0-9]{10}"
                          : undefined
                      }
                      inputMode={
                        field.id === "phone"
                          ? "numeric"
                          : undefined
                      }
                      autoComplete={
                        field.id === "name"
                          ? "name"
                          : field.id === "email"
                          ? "email"
                          : "tel-national"
                      }
                      disabled={isSubmitting}
                      className={`${inputClass} h-[42px] sm:h-[44px] sm:px-4`}
                    />
                  </motion.div>
                ))}

                {/* MESSAGE */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.38,
                    delay: 0.4,
                  }}
                >
                  <label
                    htmlFor="connect-message"
                    className="mb-1 block font-primary text-[11px] font-medium text-[#101828] sm:text-[12px]"
                  >
                    Message
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <textarea
                    id="connect-message"
                    name="message"
                    rows={3}
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={3000}
                    disabled={isSubmitting}
                    className={`${inputClass} min-h-[88px] resize-none py-2.5 leading-[1.5] sm:min-h-[92px] sm:px-4`}
                  />
                </motion.div>

                {/* SUBMIT BUTTON */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.38,
                    delay: 0.47,
                  }}
                  whileHover={
                    isSubmitting ? undefined : { y: -2 }
                  }
                  whileTap={
                    isSubmitting ? undefined : { scale: 0.98 }
                  }
                  className="group cursor-pointer mt-0.5 inline-flex h-[44px] w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-5 font-primary text-[13px] font-medium uppercase tracking-[0.04em] !text-white shadow-[0_8px_20px_rgba(0,117,255,0.18)] transition-all duration-300 hover:bg-[#006AE8] hover:shadow-[0_10px_25px_rgba(0,117,255,0.25)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-[165px]"
                >
                  {isSubmitting ? (
                    <>
                      Sending...
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    </>
                  ) : (
                    <>
                      Submit
                      <Send
                        size={15}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px]"
                      />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SUCCESS / ERROR TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={`${toast.type}-${toast.title}`}
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
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
            transition={{ duration: 0.25 }}
            role={
              toast.type === "error" ? "alert" : "status"
            }
            className={`fixed bottom-5 left-1/2 z-[9999] flex w-[calc(100%-28px)] max-w-[440px] -translate-x-1/2 items-start gap-3 rounded-[12px] border p-4 shadow-[0_20px_50px_rgba(15,23,42,0.15)] ${
              toast.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                toast.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 size={22} />
              ) : (
                <AlertCircle size={22} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`font-secondary text-[14px] font-bold ${
                  toast.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {toast.title}
              </p>

              <p
                className={`mt-1 font-secondary text-[12px] leading-[1.6] ${
                  toast.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Close notification"
              className="rounded-full p-1 text-slate-600 hover:bg-black/5"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
