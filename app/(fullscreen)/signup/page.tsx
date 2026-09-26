"use client";

import { useState } from "react";
import { AuthMobileLogo, AuthSidePanel } from "@/component/AuthBrand";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signupSchema, type SignupFormValues } from "@/lib/signup-schema";
import { authClient } from "@/lib/auth-client";
import { safeNextPath } from "@/lib/login-redirect";
import GoogleIcon from "@/component/icons/GoogleIcon";
import { useTranslations } from "next-intl";
import { useAuthErrorMessage, useValidationMessage } from "@/component/useAuthErrorMessage";

export default function SignUpPage() {
  const t = useTranslations("Auth");
  const authErrorMessage = useAuthErrorMessage();
  const validationMessage = useValidationMessage();
  // schema errors are Validation keys (lib/signup-schema.ts)
  const fieldError = (m?: string) => (m ? validationMessage(m) : m);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  // Set when the account was created but needs its email verified before
  // it can sign in — shows a "check your email" screen instead of the form.
  const [verifyEmailSentTo, setVerifyEmailSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);

    try {
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        // where the verification link lands them (signed in) — back to the
        // page that sent them to sign up, if any
        callbackURL: safeNextPath(new URLSearchParams(window.location.search).get("next")),
      });

      if (error) {
        setServerError(authErrorMessage(error));
        return;
      }

      // No session token = email verification is required first (see
      // lib/auth.ts) — the verification email is already on its way.
      if (!data?.token) {
        setVerifyEmailSentTo(values.email);
        return;
      }

      router.push("/login");
    } catch {
      setServerError(t("network"));
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
        {verifyEmailSentTo ? (
          <div className="w-full max-w-sm">
            <h1 className="text-2xl text-fg font-(family-name:--font-display)">{t("signup.checkEmailTitle")}</h1>
            <p className="mt-3 text-sm text-fg-secondary">
              {t.rich("signup.checkEmailBody", {
                email: verifyEmailSentTo,
                b: (chunks) => <span className="text-fg">{chunks}</span>,
              })}
            </p>
            <p className="mt-3 text-sm text-fg-secondary">
              {t.rich("signup.checkEmailRetry", {
                login: (chunks) => (
                  <Link href="/login" className="text-fg font-medium hover:underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        ) : (
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl text-fg font-(family-name:--font-display)">{t("signup.title")}</h1>
            <p className="mt-1 text-sm text-fg-secondary">{t("signup.subtitle")}</p>
          </div>

          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm text-fg-secondary mb-1.5">
                {t("signup.username")}
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder={t("signup.usernamePlaceholder")}
                aria-invalid={!!errors.name}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-danger transition-colors"
              />
              {errors.name && <p className="text-xs text-danger-text mt-1">{fieldError(errors.name.message)}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-fg-secondary mb-1.5">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder={t("emailPlaceholder")}
                aria-invalid={!!errors.email}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-danger transition-colors"
              />
              {errors.email && <p className="text-xs text-danger-text mt-1">{fieldError(errors.email.message)}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-fg-secondary mb-1.5">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  autoComplete="new-password"
                  placeholder={t("passwordPlaceholder")}
                  aria-invalid={!!errors.password}
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
              <span
                className={
                  "text-xs mt-1 block " +
                  (errors.password ? "text-danger-text" : "text-fg-muted")
                }
              >
                {fieldError(errors.password?.message) ?? t("signup.passwordHint")}
              </span>
            </div>

            {/* Same Show/Hide as the password above — one toggle for both */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-fg-secondary mb-1.5">
                {t("signup.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                autoComplete="new-password"
                placeholder={t("signup.confirmPlaceholder")}
                aria-invalid={!!errors.confirmPassword}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-danger transition-colors"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-danger-text mt-1">{fieldError(errors.confirmPassword.message)}</p>
              )}
            </div>

            {serverError && <p className="text-sm text-danger-text">{serverError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-fg text-bg text-sm font-semibold py-2.5 hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? t("signup.submitting") : t("signup.submit")}
            </button>

            <p className="text-xs text-fg-muted text-center">
              {t.rich("signup.agree", {
                terms: (chunks) => (
                  <Link href="/terms" className="text-fg-secondary underline underline-offset-2 hover:text-fg whitespace-nowrap">
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link href="/privacy" className="text-fg-secondary underline underline-offset-2 hover:text-fg whitespace-nowrap">
                    {chunks}
                  </Link>
                ),
              })}
            </p>

            <p className="text-sm text-fg-secondary text-center">
              {t("signup.haveAccount")}{" "}
              <Link href="/login" className="text-fg font-medium hover:underline">
                {t("logIn")}
              </Link>
            </p>
          </form>
        </div>
        )}
      </div>
    </div>
  );
}