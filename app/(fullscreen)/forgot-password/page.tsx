"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
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
        setError(requestError.message ?? "Something went wrong. Please try again.");
        return;
      }

      // Deliberately shown regardless of whether the email exists — same
      // generic message Better Auth's own API returns, so this page can't
      // be used to check which emails have an account.
      setSent(true);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-b from-auth-panel-from via-auth-panel-via to-bg border-r-2 border-border relative overflow-hidden">
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
            <h1 className="text-2xl text-fg font-(family-name:--font-display)">Forgot Password</h1>
            <p className="mt-1 text-sm text-fg-secondary">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {sent ? (
            <div className="rounded-md border border-border bg-surface p-4">
              <p className="text-sm text-fg">
                If an account exists for <span className="font-medium">{email}</span>, a reset link has been
                sent.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-fg-secondary mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. you@example.com"
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-danger transition-colors"
                />
              </div>

              {error && <p className="text-sm text-danger-text">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-fg text-bg text-sm font-semibold py-2.5 hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
              >
                {isSubmitting ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="text-sm text-fg-secondary text-center mt-6">
            Remembered your password?{" "}
            <Link href="/login" className="text-fg font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
