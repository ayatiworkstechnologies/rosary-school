
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, ease },
  },
};

const statReveal = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease },
  },
};

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

const inputClass = `
  w-full rounded-[8px] border border-[#8EC2FF]
  bg-white px-[15px] font-secondary text-[14px]
  text-[#181818] outline-none transition-all duration-300
  placeholder:text-[#B4B7BC]
  hover:border-[#4B9DFF]
  focus:border-[#0075FF] focus:ring-4
  focus:ring-[#0075FF]/10
  disabled:cursor-not-allowed disabled:opacity-70
`;

const labelClass = `
  mb-[6px] block font-secondary text-[14px]
  font-semibold text-[#171717] lg:text-[15px]
`;

export default function GetInTouchSection() {
  const [formData, setFormData] =
    useState<ContactForm>({ ...initialForm });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (toast) setToast(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!name || !email || !phone || !message) {
      setToast({
        type: "error",
        title: "Incomplete Form",
        message: "Please fill in all required fields.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({
        type: "error",
        title: "Invalid Email",
        message: "Please enter a valid email address.",
      });
      return;
    }

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
      const response = await fetch("/api/rosary-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name,
            email,
            phone,
            message,
          },
        }),
        cache: "no-store",
      });

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || "Unable to submit your enquiry."
        );
      }

      setToast({
        type: "success",
        title: "Message Sent Successfully!",
        message:
          result.message ||
          "Thank you for contacting Rosary School. Our team will get back to you.",
      });

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
      <section className="relative w-full overflow-hidden bg-white py-[24px] sm:py-[30px] lg:py-[34px]">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="mx-auto w-full max-w-[1380px] px-[14px] sm:px-[24px] md:px-[30px] xl:px-[20px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.85, ease }}
            className="relative overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_rgba(20,35,55,0.09)] sm:rounded-[24px]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_500px] xl:grid-cols-[minmax(0,1.58fr)_515px]">
              {/* LEFT IMAGE SECTION */}
              <motion.div
                variants={fadeLeft}
                className="group relative min-h-[430px] overflow-hidden sm:min-h-[470px] md:min-h-[510px] lg:min-h-[540px] xl:min-h-[550px]"
              >
                <motion.div
                  initial={{ scale: 1.06 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease }}
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[1500ms] group-hover:scale-[1.02]"
                  style={{
                    backgroundImage:
                      "url('/images/get-in-touch-bg.png')",
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,18,0.75)_0%,rgba(5,12,20,0.48)_42%,rgba(5,12,20,0.14)_78%,rgba(5,12,20,0.06)_100%)]" />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(180deg,rgba(3,8,15,0)_0%,rgba(3,8,15,0.44)_45%,rgba(3,8,15,0.90)_100%)]" />

                <div className="absolute inset-0 z-10 flex flex-col justify-end p-[22px] sm:p-[30px] md:p-[36px] lg:p-[38px] xl:p-[42px]">
                  <motion.div
                    variants={fadeUp}
                    className="max-w-[720px]"
                  >
                    <motion.h2
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.75,
                        delay: 0.1,
                        ease,
                      }}
                      className="pb-3 font-primary text-[36px] font-semibold leading-[1.02] tracking-[-1px] !text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.35)] sm:text-[42px] md:text-[46px] xl:text-[48px]"
                    >
                      Get In Touch
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.75,
                        delay: 0.16,
                        ease,
                      }}
                      className="mt-[12px] max-w-[700px] font-secondary text-[14px] leading-[1.65] !text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.28)] sm:text-[15px] md:text-[16px]"
                    >
                      We&apos;d love to hear from you! Whether you
                      have questions about admissions, academics,
                      or school events, our team is here to help.
                    </motion.p>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="mt-[24px] sm:mt-[28px] lg:mt-[30px]"
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.85,
                        delay: 0.25,
                        ease,
                      }}
                      className="h-px w-full origin-left bg-white/35"
                    />

                    <div className="mt-[16px] grid max-w-[600px] grid-cols-2 gap-[16px] sm:gap-[26px]">
                      <motion.div
                        variants={statReveal}
                        className="relative pr-[14px] sm:pr-[26px]"
                      >
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-white/30" />

                        <h3 className="font-primary text-[30px] font-bold leading-none !text-white sm:text-[34px] lg:text-[36px]">
                          60+
                        </h3>

                        <p className="mt-[6px] font-secondary text-[11px] leading-[1.4] text-white/90 sm:text-[12px] lg:text-[13px]">
                          Years of academic excellence
                        </p>
                      </motion.div>

                      <motion.div variants={statReveal}>
                        <h3 className="font-primary text-[30px] font-bold leading-none !text-white sm:text-[34px] lg:text-[36px]">
                          5000+
                        </h3>

                        <p className="mt-[6px] font-secondary text-[11px] leading-[1.4] text-white/90 sm:text-[12px] lg:text-[13px]">
                          Alumni across the globe
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* RIGHT CONTACT FORM */}
              <motion.div
                variants={fadeRight}
                className="relative bg-[#FAFAFA] px-[18px] py-[22px] sm:px-[26px] sm:py-[28px] lg:flex lg:items-center lg:bg-white lg:px-[30px] lg:py-[24px]"
              >
                <motion.div
                  variants={fadeUp}
                  className="w-full rounded-[18px] bg-white p-[20px] shadow-[0_14px_38px_rgba(15,23,42,0.06)] sm:p-[24px] lg:p-[22px] lg:shadow-none xl:p-[26px]"
                >
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-[14px] sm:space-y-[15px]"
                  >
                    <div>
                      <label
                        htmlFor="contact-name"
                        className={labelClass}
                      >
                        Name <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={150}
                        disabled={isSubmitting}
                        className={`${inputClass} h-[46px] sm:h-[48px]`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className={labelClass}
                      >
                        Email <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        maxLength={254}
                        disabled={isSubmitting}
                        className={`${inputClass} h-[46px] sm:h-[48px]`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className={labelClass}
                      >
                        Phone Number{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="Enter Your Phone Number"
                        value={formData.phone}
                        onChange={(event) => {
                          const value = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);

                          setFormData((previous) => ({
                            ...previous,
                            phone: value,
                          }));

                          setToast(null);
                        }}
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        disabled={isSubmitting}
                        className={`${inputClass} h-[46px] sm:h-[48px]`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className={labelClass}
                      >
                        Message{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        id="contact-message"
                        name="message"
                        placeholder="Enter Your Message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        maxLength={3000}
                        disabled={isSubmitting}
                        className={`${inputClass} min-h-[105px] resize-y py-[12px] leading-[1.55] sm:min-h-[115px]`}
                      />
                    </div>

                    <div className="pt-[2px]">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={
                          isSubmitting
                            ? undefined
                            : { y: -2, scale: 1.01 }
                        }
                        whileTap={
                          isSubmitting
                            ? undefined
                            : { scale: 0.98 }
                        }
                        transition={{ duration: 0.25, ease }}
                        className="inline-flex h-[46px] min-w-[165px] items-center justify-center gap-[10px] rounded-[7px] bg-[#0075FF] px-[30px] font-secondary text-[14px] font-medium uppercase tracking-[0.35px] text-white shadow-[0_12px_28px_rgba(0,117,255,0.22)] transition-all duration-300 hover:bg-[#0069E3] hover:shadow-[0_16px_34px_rgba(0,117,255,0.28)] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[180px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                            Sending...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SUCCESS AND ERROR NOTIFICATIONS */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={`${toast.type}-${toast.title}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            role={toast.type === "error" ? "alert" : "status"}
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
              className={`rounded-full p-1 ${
                toast.type === "success"
                  ? "text-green-700 hover:bg-green-100"
                  : "text-red-700 hover:bg-red-100"
              }`}
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
