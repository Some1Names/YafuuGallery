"use client";

import { Suspense, useState } from "react";
import { AuthMobileLogo, AuthSidePanel } from "@/component/AuthBrand";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { useAuthErrorMessage } from "@/component/useAuthErrorMessage";

// Better Auth's own /reset-password/:token callback validates the emailed
// token, then redirects here with either `?token=...` (valid) or
// `?error=INVALID_TOKEN` (expired/already used) — never the raw token from
// the email link itself. useSearchParams needs a Suspense boundary, hence
// the wrapper below.
function ResetPasswordForm() {
  const t = useTranslations("Auth");
  const authErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tokenError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("reset.mismatch"));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token: token ?? undefined,
      });

      if (resetError) {
        setError(authErrorMessage(resetError));
        return;
      }

      router.push("/login");
    } catch {
      setError(t("network"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token || tokenError) {
    return (
      <div className="rounded-md border border-border bg-surface p-4">
        <p className="text-sm text-fg">
          {t.rich("reset.invalidLink", {
            link: (chunks) => (
              <Link href="/forgot-password" className="font-medium hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm text-fg-secondary mb-1.5">
          {t("reset.newPassword")}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder={t("reset.newPlaceholder")}
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
        <span className="text-xs text-fg-muted mt-1 block">{t("signup.passwordHint")}</span>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm text-fg-secondary mb-1.5">
          {t("reset.confirm")}
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder={t("reset.confirmPlaceholder")}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-danger transition-colors"
        />
      </div>

      {error && <p className="text-sm text-danger-text">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-fg text-bg text-sm font-semibold py-2.5 hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
      >
        {isSubmitting ? t("reset.submitting") : t("reset.submit")}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations("Auth");
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg">
      {/* Left panel (large screens) */}
      <AuthSidePanel />

      {/* Right panel — form */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <AuthMobileLogo />
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl text-fg font-(family-name:--font-display)">{t("reset.title")}</h1>
            <p className="mt-1 text-sm text-fg-secondary">{t("reset.subtitle")}</p>
          </div>

          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
