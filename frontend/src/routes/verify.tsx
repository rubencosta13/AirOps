import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";

export const Route = createFileRoute("/verify")({
  component: VerifyAccountPage,
});

function VerifyAccountPage() {
  const navigate = useNavigate();
  const verificationStarted = useRef(false);

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (verificationStarted.current) return;

    verificationStarted.current = true;

    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    async function verify() {
      try {
        await api("/auth/verify-account", {
          method: "POST",
          body: JSON.stringify({ token }),
        });

        setStatus("success");
        setMessage("Your account has been successfully verified.");
      } catch (error) {
        setStatus("error");

        setMessage(
          error instanceof Error
            ? error.message
            : "We couldn't verify your account.",
        );
      }
    }

    verify();
  }, []);

  return (
    <div className="flex justify-center items-center bg-background px-4 min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-sm p-8 border rounded-2xl">
          <div className="flex justify-center mb-8">
            <div className="flex justify-center items-center bg-primary rounded-xl w-12 h-12 text-primary-foreground">
              {status === "verifying" && (
                <svg
                  className="w-6 h-6 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-25"
                  />
                  <path
                    d="M21 12a9 9 0 0 1-9 9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {status === "success" && (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5 9.5 17 19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {status === "error" && (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path d="M12 8v4" strokeLinecap="round" />
                  <path d="M12 16h0.01" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              )}
            </div>
          </div>

          <div className="text-center">
            {status === "verifying" && (
              <>
                <h1 className="font-semibold text-2xl tracking-tight">
                  Verifying your account
                </h1>

                <p className="mt-2 text-muted-foreground text-sm">
                  Please wait while we verify your email address.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <h1 className="font-semibold text-2xl tracking-tight">
                  Account verified
                </h1>

                <p className="mt-2 text-muted-foreground text-sm">{message}</p>

                <button
                  type="button"
                  onClick={() => navigate({ to: "/login" })}
                  className="bg-primary hover:bg-primary/90 mt-8 px-4 py-2.5 rounded-lg w-full font-medium text-primary-foreground text-sm transition-colors"
                >
                  Continue to login
                </button>
              </>
            )}

            {status === "error" && (
              <>
                <h1 className="font-semibold text-2xl tracking-tight">
                  Verification failed
                </h1>

                <p className="mt-2 text-muted-foreground text-sm">{message}</p>

                <button
                  type="button"
                  onClick={() => navigate({ to: "/login" })}
                  className="bg-background hover:bg-muted mt-8 px-4 py-2.5 border rounded-lg w-full font-medium text-sm transition-colors"
                >
                  Back to login
                </button>
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-muted-foreground text-xs text-center">
          You can safely close this page once verification is complete.
        </p>
      </div>
    </div>
  );
}
