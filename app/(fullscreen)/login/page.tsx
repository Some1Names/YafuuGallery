"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginPage() {
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
      const { error: signInError } = await authClient.signIn.email({ email, password });

      if (signInError) {
        setError("Invalid email or password.");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0a]"
    >
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-b from-[#1e1213] via-[#121113] to-[#0a0a0a] border-r-2 border-[#050505] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/wide.png")',
          }}
        />

        <Link href="/" className="relative text-2xl tracking-wide text-black">
          YafuuGallery
        </Link>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl text-[#ece6d8] font-(family-name:--font-display)">Log In</h1>
            <p className="mt-1 text-sm text-[#b6b0a2]">Welcome back — sign in to keep reading.</p>
          </div>

          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
            className="w-full flex items-center justify-center gap-2 border border-[#050505] rounded-md py-2.5 text-sm text-[#ece6d8] hover:bg-[#1b1a1c] transition-colors duration-200"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-[#b6b0a2]">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-[#b6b0a2] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. you@example.com"
                className="w-full rounded-md border border-[#050505] bg-[#1b1a1c] px-3 py-2 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#9c1d25] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm text-[#b6b0a2]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#b6b0a2] hover:text-[#ece6d8]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
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
            </div>

            {error && <p className="text-sm text-[#9c1d25]">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold py-2.5 hover:bg-[#ece6d8]/85 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? "Signing in…" : "Log In"}
            </button>

            <p className="text-sm text-[#b6b0a2] text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#ece6d8] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}