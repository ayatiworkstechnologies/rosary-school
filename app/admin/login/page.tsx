"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";


export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");


  // =========================================================
  // CHECK IF ADMIN IS ALREADY LOGGED IN
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const checkExistingSession =
      async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/v1/admin/auth/me`,
            {
              method: "GET",

              credentials: "include",

              cache: "no-store",
            }
          );

          if (
            response.ok &&
            mounted
          ) {
            router.replace(
              "/admin/dashboard"
            );
          }
        } catch {
          /*
           * No action required here.
           *
           * If backend is unavailable or there is
           * no session, allow the login page to show.
           */
        }
      };

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, [router]);


  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");


    // =======================================================
    // FRONTEND VALIDATION
    // =======================================================

    const normalizedEmail =
      email.trim().toLowerCase();


    if (!normalizedEmail) {
      setMessage(
        "Please enter your email."
      );

      return;
    }


    if (!password.trim()) {
      setMessage(
        "Please enter your password."
      );

      return;
    }


    setLoading(true);


    try {
      // =====================================================
      // CALL FASTAPI LOGIN ENDPOINT
      // =====================================================

      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          /*
           * VERY IMPORTANT:
           *
           * FastAPI stores the JWT in an
           * HttpOnly cookie.
           *
           * credentials: "include"
           *
           * allows the browser to receive
           * and later send that cookie.
           */
          credentials: "include",

          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        }
      );


      // =====================================================
      // READ RESPONSE
      // =====================================================

      const data = await response
        .json()
        .catch(() => null);


      // =====================================================
      // LOGIN FAILED
      // =====================================================

      if (!response.ok) {
        if (
          response.status === 401
        ) {
          setMessage(
            "Invalid email or password."
          );

          return;
        }


        if (
          response.status === 403
        ) {
          setMessage(
            data?.detail ||
              "Your administrator account is disabled."
          );

          return;
        }


        if (
          response.status === 422
        ) {
          setMessage(
            "Please enter a valid email and password."
          );

          return;
        }


        setMessage(
          data?.detail ||
            "Unable to sign in. Please try again."
        );

        return;
      }


      // =====================================================
      // LOGIN SUCCESS
      // =====================================================

      setMessage("");

      /*
       * The JWT is NOT stored in localStorage.
       *
       * FastAPI already stored it inside
       * the HttpOnly cookie.
       */

      router.replace(
        "/admin/dashboard"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Admin login request failed:",
        error
      );


      setMessage(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#F5F8FC]
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[180px]
          -top-[180px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#0075FF]/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[220px]
          -right-[180px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#0075FF]/10
          blur-[130px]
        "
      />

      {/* subtle grid */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
        "
        style={{
          backgroundImage:
            "linear-gradient(#0075FF 1px, transparent 1px), linear-gradient(90deg, #0075FF 1px, transparent 1px)",
          backgroundSize:
            "44px 44px",
        }}
      />


      {/* =====================================================
          PAGE
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-4
          py-8

          sm:px-6

          lg:px-8
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 28,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.75,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            grid
            w-full
            max-w-[1040px]
            overflow-hidden
            rounded-[24px]
            border
            border-[#E2E8F0]
            bg-white
            shadow-[0_28px_80px_rgba(15,23,42,0.12)]

            lg:grid-cols-[1.05fr_0.95fr]
          "
        >
          {/* =================================================
              LEFT PANEL
          ================================================= */}

          <section
            className="
              relative
              hidden
              min-h-[620px]
              overflow-hidden
              bg-[#0075FF]
              p-10

              lg:flex
              lg:flex-col
              lg:justify-between
            "
          >
            {/* decorative circles */}

            <div
              className="
                pointer-events-none
                absolute
                -right-[120px]
                -top-[130px]
                h-[380px]
                w-[380px]
                rounded-full
                border
                border-white/10
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -right-[55px]
                -top-[70px]
                h-[250px]
                w-[250px]
                rounded-full
                border
                border-white/10
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-[190px]
                -left-[120px]
                h-[430px]
                w-[430px]
                rounded-full
                bg-white/[0.06]
              "
            />


            {/* BRAND */}

            <div
              className="
                relative
                z-10
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    h-[54px]
                    w-[54px]
                    items-center
                    justify-center
                    rounded-[16px]
                    bg-white
                    text-[#0075FF]
                    shadow-[0_12px_28px_rgba(0,0,0,0.14)]
                  "
                >
                  <ShieldCheck
                    size={28}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2
                    className="
                      font-primary
                      text-[21px]
                      font-semibold
                      tracking-[-0.3px]
                      !text-white
                    "
                  >
                    Rosary Admin
                  </h2>

                  <p
                    className="
                      mt-[2px]
                      font-secondary
                      text-[12px]
                      !text-white/70
                    "
                  >
                    School Management
                    Portal
                  </p>
                </div>
              </div>
            </div>


            {/* MIDDLE CONTENT */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.18,
                duration: 0.75,
              }}
              className="
                relative
                z-10
                max-w-[410px]
              "
            >
              <span
                className="
                  inline-flex
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-[6px]
                  font-secondary
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.1em]
                  !text-white
                "
              >
                Secure Administration
              </span>

              <h1
                className="
                  mt-5
                  font-primary
                  text-[38px]
                  font-semibold
                  leading-[1.12]
                  tracking-[-1px]
                  !text-white
                "
              >
                Manage your school
                website from one place.
              </h1>

              <p
                className="
                  mt-5
                  max-w-[380px]
                  font-secondary
                  text-[13px]
                  leading-[1.75]
                  !text-white/75
                "
              >
                Manage news, events,
                circulars, gallery
                collections, faculty
                information and
                downloadable resources
                securely.
              </p>


              {/* MODULES */}

              <div
                className="
                  mt-8
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                {[
                  "News",
                  "Events",
                  "Notices",
                  "Gallery",
                  "Faculty",
                  "Downloads",
                ].map(
                  (item) => (
                    <div
                      key={item}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-[10px]
                        border
                        border-white/15
                        bg-white/[0.08]
                        px-3
                        py-[10px]
                        backdrop-blur
                      "
                    >
                      <span
                        className="
                          h-[6px]
                          w-[6px]
                          rounded-full
                          bg-white
                        "
                      />

                      <span
                        className="
                          font-secondary
                          text-[11px]
                          font-medium
                          !text-white
                        "
                      >
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>
            </motion.div>


            {/* FOOTER */}

            <p
              className="
                relative
                z-10
                font-secondary
                text-[10px]
                !text-white/50
              "
            >
              Rosary Matriculation Higher
              Secondary School
            </p>
          </section>


          {/* =================================================
              RIGHT LOGIN
          ================================================= */}

          <section
            className="
              flex
              min-h-[560px]
              items-center
              justify-center
              px-5
              py-10

              sm:px-10

              lg:min-h-[620px]
              lg:px-12
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                x: 24,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.1,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                w-full
                max-w-[390px]
              "
            >
              {/* MOBILE BRAND */}

              <div
                className="
                  mb-8
                  flex
                  items-center
                  gap-3

                  lg:hidden
                "
              >
                <div
                  className="
                    flex
                    h-[44px]
                    w-[44px]
                    items-center
                    justify-center
                    rounded-[12px]
                    bg-[#0075FF]
                    text-white
                  "
                >
                  <ShieldCheck
                    size={22}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2
                    className="
                      font-primary
                      text-[17px]
                      font-semibold
                      text-[#111827]
                    "
                  >
                    Rosary Admin
                  </h2>

                  <p
                    className="
                      text-[10px]
                      text-[#8B95A5]
                    "
                  >
                    School Management
                  </p>
                </div>
              </div>


              {/* HEADING */}

              <div>
                <span
                  className="
                    font-secondary
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-[#0075FF]
                  "
                >
                  Admin Access
                </span>

                <h2
                  className="
                    mt-3
                    font-primary
                    text-[30px]
                    font-semibold
                    leading-[1.15]
                    tracking-[-0.6px]
                    text-[#111827]

                    sm:text-[34px]
                  "
                >
                  Welcome back
                </h2>

                <p
                  className="
                    mt-3
                    font-secondary
                    text-[12px]
                    leading-[1.6]
                    text-[#7D8795]

                    sm:text-[13px]
                  "
                >
                  Enter your administrator
                  credentials to access the
                  dashboard.
                </p>
              </div>


              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-8"
              >
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="
                      mb-[7px]
                      block
                      font-secondary
                      text-[12px]
                      font-medium
                      text-[#344054]
                    "
                  >
                    Email Address
                  </label>

                  <div
                    className="
                      group
                      flex
                      h-[50px]
                      items-center
                      rounded-[11px]
                      border
                      border-[#DDE4EC]
                      bg-white
                      px-4
                      transition-all
                      duration-300

                      focus-within:border-[#0075FF]
                      focus-within:shadow-[0_0_0_3px_rgba(0,117,255,0.10)]
                    "
                  >
                    <Mail
                      size={18}
                      strokeWidth={1.7}
                      className="
                        mr-3
                        shrink-0
                        text-[#8E99A8]
                        transition-colors

                        group-focus-within:text-[#0075FF]
                      "
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      disabled={
                        loading
                      }
                      autoComplete="email"
                      placeholder="admin@rosaryschool.com"
                      onChange={(
                        event
                      ) =>
                        setEmail(
                          event.target
                            .value
                        )
                      }
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        font-secondary
                        text-[13px]
                        text-[#111827]
                        outline-none
                        placeholder:text-[#A7AFBB]

                        disabled:cursor-not-allowed
                      "
                    />
                  </div>
                </div>


                {/* PASSWORD */}

                <div
                  className="
                    mt-5
                  "
                >
                  <div
                    className="
                      mb-[7px]
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <label
                      htmlFor="password"
                      className="
                        font-secondary
                        text-[12px]
                        font-medium
                        text-[#344054]
                      "
                    >
                      Password
                    </label>
                  </div>

                  <div
                    className="
                      group
                      flex
                      h-[50px]
                      items-center
                      rounded-[11px]
                      border
                      border-[#DDE4EC]
                      bg-white
                      px-4
                      transition-all
                      duration-300

                      focus-within:border-[#0075FF]
                      focus-within:shadow-[0_0_0_3px_rgba(0,117,255,0.10)]
                    "
                  >
                    <LockKeyhole
                      size={18}
                      strokeWidth={1.7}
                      className="
                        mr-3
                        shrink-0
                        text-[#8E99A8]
                        transition-colors

                        group-focus-within:text-[#0075FF]
                      "
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      disabled={
                        loading
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event.target
                            .value
                        )
                      }
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        font-secondary
                        text-[13px]
                        text-[#111827]
                        outline-none
                        placeholder:text-[#A7AFBB]

                        disabled:cursor-not-allowed
                      "
                    />

                    <button
                      type="button"
                      disabled={
                        loading
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(
                          (
                            current
                          ) =>
                            !current
                        )
                      }
                      className="
                        ml-2
                        flex
                        h-[34px]
                        w-[34px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-[8px]
                        text-[#8490A1]
                        transition-colors

                        hover:bg-[#F1F6FC]
                        hover:text-[#0075FF]

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {showPassword ? (
                        <EyeOff
                          size={17}
                        />
                      ) : (
                        <Eye
                          size={17}
                        />
                      )}
                    </button>
                  </div>
                </div>


                {/* MESSAGE */}

                {message && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      mt-4
                      rounded-[9px]
                      border
                      border-[#F2C6C6]
                      bg-[#FFF5F5]
                      px-3
                      py-[10px]
                      font-secondary
                      text-[11px]
                      leading-[1.5]
                      text-[#C13B3B]
                    "
                  >
                    {message}
                  </motion.div>
                )}


                {/* SUBMIT */}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={
                    loading
                      ? undefined
                      : {
                          y: -2,
                        }
                  }
                  whileTap={
                    loading
                      ? undefined
                      : {
                          scale: 0.98,
                        }
                  }
                  className="
                    group
                    mt-6
                    flex
                    h-[50px]
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-[11px]
                    bg-[#0075FF]
                    px-5
                    font-secondary
                    text-[13px]
                    font-semibold
                    !text-white
                    shadow-[0_12px_26px_rgba(0,117,255,0.22)]
                    transition-all
                    duration-300

                    hover:bg-[#006BE8]
                    hover:shadow-[0_16px_30px_rgba(0,117,255,0.30)]

                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                >
                  {loading ? (
                    <>
                      <span
                        className="
                          h-[17px]
                          w-[17px]
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />

                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In

                      <ArrowRight
                        size={17}
                        className="
                          transition-transform
                          duration-300

                          group-hover:translate-x-[4px]
                        "
                      />
                    </>
                  )}
                </motion.button>
              </form>


              {/* SECURITY */}

              <div
                className="
                  mt-6
                  flex
                  items-start
                  gap-3
                  rounded-[11px]
                  bg-[#F7F9FC]
                  p-3
                "
              >
                <ShieldCheck
                  size={17}
                  className="
                    mt-[1px]
                    shrink-0
                    text-[#0075FF]
                  "
                />

                <p
                  className="
                    font-secondary
                    text-[10px]
                    leading-[1.6]
                    text-[#8993A1]
                  "
                >
                  This portal is
                  restricted to
                  authorized Rosary
                  School administrators.
                </p>
              </div>


              <p
                className="
                  mt-7
                  text-center
                  font-secondary
                  text-[10px]
                  text-[#A0A8B3]
                "
              >
                © 2026 Rosary
                Matriculation Higher
                Secondary School
              </p>
            </motion.div>
          </section>
        </motion.div>
      </div>
    </main>
  );
}