"use client";

import { useState } from "react";
import { AuthMobileLogo, AuthSidePanel } from "@/component/AuthBrand";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { useAuthErrorMessage } from "@/component/useAuthErrorMessage";

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");
  const authErrorMessage = useAuthErrorMessage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: requestError } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (requestError) {
        setError(authErrorMessage(requestError));
        return;
      }

      // Deliberately shown regardless of whether the email exists — same
      // generic message Better Auth's own API returns, so this page can't
      // be used to check which emails have an account.
      setSent(true);
    } catch {
      setError(t("network"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg">
      {/* Left panel (large screens) */}
      <AuthSidePanel />

      {/* Right panel — form */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <AuthMobileLogo />
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl text-fg font-(family-name:--font-display)">{t("forgot.title")}</h1>
            <p className="mt-1 text-sm text-fg-secondary">
              {t("forgot.subtitle")}
            </p>
          </div>

          {sent ? (
            <div className="rounded-md border border-border bg-surface p-4">
              <p className="text-sm text-fg">
                {t.rich("forgot.sent", {
                  email,
                  b: (chunks) => <span className="font-medium">{chunks}</span>,
                })}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-fg-secondary mb-1.5">
                  {t("email")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t("emailPlaceholder")}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-danger transition-colors"
                />
              </div>

              {error && <p className="text-sm text-danger-text">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-fg text-bg text-sm font-semibold py-2.5 hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
              >
                {isSubmitting ? t("forgot.submitting") : t("forgot.submit")}
              </button>
            </form>
          )}

          <p className="text-sm text-fg-secondary text-center mt-6">
            {t("forgot.remembered")}{" "}
            <Link href="/login" className="text-fg font-medium hover:underline">
              {t("logIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
