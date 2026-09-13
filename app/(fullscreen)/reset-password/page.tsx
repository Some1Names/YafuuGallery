"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

// Better Auth's own /reset-password/:token callback validates the emailed
// token, then redirects here with either `?token=...` (valid) or
// `?error=INVALID_TOKEN` (expired/already used) — never the raw token from
// the email link itself. useSearchParams needs a Suspense boundary, hence
// the wrapper below.
function ResetPasswordForm() {
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
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token: token ?? undefined,
      });

      if (resetError) {
        setError(resetError.message ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/login");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token || tokenError) {
    return (
      <div className="rounded-md border border-[#050505] bg-[#1b1a1c] p-4">
        <p className="text-sm text-[#ece6d8]">
          This reset link is invalid or has expired. Request a new one from the{" "}
          <Link href="/forgot-password" className="font-medium hover:underline">
            forgot password
          </Link>{" "}
          page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm text-[#b6b0a2] mb-1.5">
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Enter a new password"
            className="w-full rounded-md border border-[#050505] bg-[#1b1a1c] px-3 py-2 pr-10 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#9c1d25] transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#b6b0a2] hover:text-[#ece6d8]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <span className="text-xs text-[#6b655e] mt-1 block">Must be at least 8 characters.</span>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm text-[#b6b0a2] mb-1.5">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Re-enter the new password"
          className="w-full rounded-md border border-[#050505] bg-[#1b1a1c] px-3 py-2 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#9c1d25] transition-colors"
        />
      </div>

      {error && <p className="text-sm text-[#9c1d25]">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold py-2.5 hover:bg-[#ece6d8]/85 disabled:opacity-50 transition-colors duration-200"
      >
        {isSubmitting ? "Resetting…" : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0a]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-b from-[#1e1213] via-[#121113] to-[#0a0a0a] border-r-2 border-[#050505] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/wide.png")' }}
        />
        <Link href="/" className="relative text-2xl tracking-wide text-black">
          YafuuGallery
        </Link>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl text-[#ece6d8] font-(family-name:--font-display)">Reset Password</h1>
            <p className="mt-1 text-sm text-[#b6b0a2]">Choose a new password for your account.</p>
          </div>

          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
