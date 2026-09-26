"use client";

import { useState } from "react";
import { AuthMobileLogo, AuthSidePanel } from "@/component/AuthBrand";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import GoogleIcon from "@/component/icons/GoogleIcon";
import { safeNextPath } from "@/lib/login-redirect";
import { useTranslations } from "next-intl";
import { useAuthErrorMessage } from "@/component/useAuthErrorMessage";

// Where to go after signing in: the page that sent the reader here
// (?next=, see lib/login-redirect.ts), else home. Read from the live URL at
// sign-in time rather than via useSearchParams, which would need its own
// Suspense boundary just for this.
function getNextPath(): string {
  return safeNextPath(new URLSearchParams(window.location.search).get("next"));
}

export default function LoginPage() {
  const t = useTranslations("Auth");
  const authErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        // where a (re-sent) verification link should land them
        callbackURL: getNextPath(),
      });

      if (signInError) {
        // Right password, unverified email (once verification is on — see
        // lib/auth.ts): this attempt has already emailed a fresh link.
        setError(
          signInError.code === "EMAIL_NOT_VERIFIED"
            ? t("login.verifyFirst", { email })
            : signInError.code === "INVALID_EMAIL_OR_PASSWORD"
              ? t("login.invalid")
              : authErrorMessage(signInError)
        );
        return;
      }

      router.push(getNextPath());
      router.refresh();
    } catch {
      setError(t("network"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg"
    >
      {/* Left panel (large screens) */}
      <AuthSidePanel />

      {/* Right panel — form */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <AuthMobileLogo />
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl text-fg font-(family-name:--font-display)">{t("login.title")}</h1>
            <p className="mt-1 text-sm text-fg-secondary">{t("login.subtitle")}</p>
          </div>

          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: getNextPath() })}
            className="w-full flex items-center justify-center gap-2 border border-google-border bg-surface rounded-md py-2.5 text-sm text-fg font-medium hover:bg-surface-hover hover:border-fg-secondary transition-colors duration-200"
          >
            <GoogleIcon />
            {t("google")}
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-fg-secondary">{t("or")}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm text-fg-secondary">
                  {t("password")}
                </label>
                <Link href="/forgot-password" className="inline-block py-1 -my-1 text-xs text-fg-secondary hover:text-fg">
                  {t("login.forgot")}
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t("passwordPlaceholder")}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 pr-14 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-danger transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 px-2 text-xs text-fg-secondary hover:text-fg"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? t("hide") : t("show")}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-danger-text">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-fg text-bg text-sm font-semibold py-2.5 hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? t("login.submitting") : t("login.submit")}
            </button>

            <p className="text-sm text-fg-secondary text-center">
              {t("login.noAccount")}{" "}
              <Link href="/signup" className="text-fg font-medium hover:underline">
                {t("signUp")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}