"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@/lib/auth-context";
import Link from "next/link";
import Image from "next/image";
import {
  Input,
  PasswordInput,
  AuthCard,
  SocialButton,
} from "@/components/ui/auth-components";
import { Github, Fingerprint, Lock, ShieldCheck, Loader2 } from "lucide-react";

// Google Icon SVG (Lucide doesn't have brand icons)
const GoogleIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useSignIn();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      const redirect = searchParams.get("redirect_url") || "/dashboard";
      router.push(redirect);
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl h-[85vh] max-h-[800px] bg-white rounded-3xl overflow-hidden shadow-2xl mt-10">
        {/* LEFT SIDE: Premium Image */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden">
          {/* Image */}
          <Image
            src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2670&auto=format&fit=crop"
            alt="Premium Indian Cuisine"
            fill
            className="object-cover opacity-90"
            priority
          />

          {/* Overlays for Vibe */}
          <div className="absolute inset-0" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent" />

          {/* Text Overlay */}
          <div className="absolute bottom-12 left-12 z-20 text-white max-w-lg pr-4">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-white drop-shadow-md">
              Taste the Tradition.
            </h2>
            <p className="text-stone-200 text-base leading-relaxed drop-shadow-sm">
              Join thousands of food lovers discovering authentic recipes and
              smart meal planning.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Auth Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 relative h-full ">
          {/* Floating Background Decorations (Subtle) */}
          <div className="absolute top-10 right-10 w-48 h-48 bg-orange-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="mb-4 text-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 mb-4 group"
            >
              <Image
                src="/orange-logo.png"
                alt="Servd Logo"
                width={80}
                height={80}
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>
          </div>

          <AuthCard>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-stone-900 mb-1">
                Welcome back 👋
              </h1>
              <p className="text-sm text-stone-500">
                Pick up where you left off cooking smarter.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <ShieldCheck size={16} />
                  {error}
                </div>
              )}

              <Input
                id="email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    className="text-xs font-medium text-stone-400 hover:text-orange-600 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-orange-500/20 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-stone-400">
                  or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialButton
                label="Google"
                icon={GoogleIcon}
                onClick={() => {}}
              />
              <SocialButton label="GitHub" icon={Github} onClick={() => {}} />
            </div>

            <p className="mt-6 text-center text-sm text-stone-600">
              New here?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </AuthCard>

          <div className="mt-6 flex items-center gap-6 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <Lock size={12} />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} />
              <span>No Spam Promise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
