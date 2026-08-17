"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Anton, Work_Sans, Space_Mono } from "next/font/google";
import { signupSchema, type SignupFormValues } from "@/lib/signup-schema";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const workSans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const password = watch("password", "");

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setServerError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.href = "/login";
    } catch {
      setServerError("Network error — please try again.");
    }
  }

  return (
    <div
      className={`${anton.variable} ${workSans.variable} ${spaceMono.variable} min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0a] font-(family-name:--font-body)`}
    >
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
            <h1 className="text-2xl text-[#ece6d8] font-(family-name:--font-display)">Sign Up</h1>
            <p className="mt-1 text-sm text-[#b6b0a2]">Create an account to start reading.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              // signIn("google") from next-auth/react, once Google OAuth is reconnected
            }}
            className="w-full flex items-center justify-center gap-2 border border-[#050505] rounded-md py-2.5 text-sm text-[#ece6d8] hover:bg-[#1b1a1c] transition-colors duration-200"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-[#b6b0a2] font-mono">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm text-[#b6b0a2] mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="e.g. Uefa"
                aria-invalid={!!errors.name}
                className="w-full rounded-md border border-[#050505] bg-[#1b1a1c] px-3 py-2 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#9c1d25] transition-colors"
              />
              {errors.name && <p className="text-xs text-[#9c1d25] mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-[#b6b0a2] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="e.g. you@example.com"
                aria-invalid={!!errors.email}
                className="w-full rounded-md border border-[#050505] bg-[#1b1a1c] px-3 py-2 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#9c1d25] transition-colors"
              />
              {errors.email && <p className="text-xs text-[#9c1d25] mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-[#b6b0a2] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  className="w-full rounded-md border border-[#050505] bg-[#1b1a1c] px-3 py-2 pr-10 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#9c1d25] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#b6b0a2] hover:text-[#ece6d8] font-mono"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <span
                className={
                  "text-xs mt-1 block " +
                  (errors.password ? "text-[#9c1d25]" : "text-[#6b655e]")
                }
              >
                {errors.password?.message ?? "Must be at least 8 characters."}
              </span>
            </div>

            {serverError && <p className="text-sm text-[#9c1d25]">{serverError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#ece6d8] text-[#0a0a0a] text-sm font-semibold py-2.5 hover:bg-[#ece6d8]/85 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? "Creating account…" : "Sign Up"}
            </button>

            <p className="text-sm text-[#b6b0a2] text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[#ece6d8] font-medium hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}