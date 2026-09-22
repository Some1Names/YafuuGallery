"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import GoogleIcon from "@/component/icons/GoogleIcon";

export default function LoginPage() {
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
      const { error: signInError } = await authClient.signIn.email({ email, password });

      if (signInError) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg"
    >
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-b from-auth-panel-from via-auth-panel-via to-bg border-r-2 border-border relative overflow-hidden">
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
            <h1 className="text-2xl text-fg font-(family-name:--font-display)">Log In</h1>
            <p className="mt-1 text-sm text-fg-secondary">Welcome back — sign in to keep reading.</p>
          </div>

          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
            className="w-full flex items-center justify-center gap-2 border border-google-border bg-surface rounded-md py-2.5 text-sm text-fg font-medium hover:bg-surface-hover hover:border-fg-secondary transition-colors duration-200"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-fg-secondary">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm text-fg-secondary">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-fg-secondary hover:text-fg">
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
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 pr-10 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-danger transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-fg-secondary hover:text-fg"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-fg text-bg text-sm font-semibold py-2.5 hover:bg-fg/85 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? "Signing in…" : "Log In"}
            </button>

            <p className="text-sm text-fg-secondary text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-fg font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}