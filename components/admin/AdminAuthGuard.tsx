"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  LoaderCircle,
  ShieldAlert,
} from "lucide-react";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/backend";


interface AdminAuthGuardProps {
  children: ReactNode;
}


type AuthState =
  | "checking"
  | "authenticated"
  | "error";


export default function AdminAuthGuard({
  children,
}: AdminAuthGuardProps) {
  const router = useRouter();

  const [authState, setAuthState] =
    useState<AuthState>("checking");


  // =========================================================
  // VERIFY CURRENT ADMIN SESSION
  // =========================================================

  useEffect(() => {
    let isMounted = true;


    const verifyAdminSession =
      async () => {
        try {
          const response =
            await fetch(
              `${API_BASE_URL}/api/v1/admin/auth/me`,
              {
                method: "GET",

                /*
                 * IMPORTANT:
                 *
                 * The JWT is stored in an HttpOnly cookie.
                 * credentials: "include" sends that cookie
                 * to FastAPI.
                 */
                credentials:
                  "include",

                cache:
                  "no-store",
              }
            );


          // =============================================
          // ADMIN IS AUTHENTICATED
          // =============================================

          if (response.ok) {
            if (isMounted) {
              setAuthState(
                "authenticated"
              );
            }

            return;
          }


          // =============================================
          // NOT LOGGED IN / SESSION EXPIRED
          // =============================================

          if (
            response.status === 401 ||
            response.status === 403
          ) {
            router.replace(
              "/admin/login"
            );

            return;
          }


          // =============================================
          // SOME OTHER BACKEND ERROR
          // =============================================

          if (isMounted) {
            setAuthState("error");
          }
        } catch (error) {
          console.error(
            "Admin session verification failed:",
            error
          );

          if (isMounted) {
            setAuthState("error");
          }
        }
      };


    verifyAdminSession();


    return () => {
      isMounted = false;
    };
  }, [router]);


  // =========================================================
  // CHECKING AUTHENTICATION
  // =========================================================

  if (authState === "checking") {
    return (
      <div
        className="
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          bg-[#F5F8FC]
          px-5
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <div
            className="
              flex
              h-[58px]
              w-[58px]
              items-center
              justify-center
              rounded-[16px]
              bg-[#EAF4FF]
              text-[#0075FF]
            "
          >
            <LoaderCircle
              size={27}
              strokeWidth={1.8}
              className="
                animate-spin
              "
            />
          </div>

          <p
            className="
              mt-4
              font-primary
              text-[15px]
              font-semibold
              text-[#111827]
            "
          >
            Verifying admin session
          </p>

          <p
            className="
              mt-1
              font-secondary
              text-[11px]
              text-[#8993A1]
            "
          >
            Please wait...
          </p>
        </div>
      </div>
    );
  }


  // =========================================================
  // SERVER CONNECTION ERROR
  // =========================================================

  if (authState === "error") {
    return (
      <div
        className="
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          bg-[#F5F8FC]
          px-5
        "
      >
        <div
          className="
            w-full
            max-w-[410px]
            rounded-[20px]
            border
            border-[#E2E8F0]
            bg-white
            p-7
            text-center
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
          "
        >
          <div
            className="
              mx-auto
              flex
              h-[56px]
              w-[56px]
              items-center
              justify-center
              rounded-[15px]
              bg-[#FFF3F3]
              text-[#E44848]
            "
          >
            <ShieldAlert
              size={25}
              strokeWidth={1.8}
            />
          </div>

          <h2
            className="
              mt-4
              font-primary
              text-[19px]
              font-semibold
              text-[#111827]
            "
          >
            Unable to verify session
          </h2>

          <p
            className="
              mt-2
              font-secondary
              text-[12px]
              leading-[1.7]
              text-[#7D8795]
            "
          >
            The authentication server could
            not be reached. Make sure your
            FastAPI backend is running.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="
              mt-5
              h-[44px]
              rounded-[10px]
              bg-[#0075FF]
              px-6
              font-secondary
              text-[12px]
              font-semibold
              !text-white
              transition-all
              duration-300
              hover:bg-[#006BE8]
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  // =========================================================
  // AUTHENTICATED
  // =========================================================

  return <>{children}</>;
}