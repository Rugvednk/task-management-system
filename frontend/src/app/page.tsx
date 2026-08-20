"use client";

import { useState } from "react";
import ThemeMenu from "./components/ThemeMenu";
import { LogIn, ArrowRight } from "lucide-react";
import { API_URL } from "./lib/api";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const continueAsGuest = async () => {
    setLoading(true);
    localStorage.setItem("guest", "true");

    try {
      await fetch(`${API_URL}/seed`, { method: "POST" }).catch(() => {});
    } catch {
      // ignore server offline during SSR or fallback
    }

    setTimeout(() => {
      window.location.href = "/tasks";
    }, 300);
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-[380px] text-center flex flex-col items-center">
        {/* Brand Logo Header */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
              P
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
              Pyramid
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Let's get back on track
          </h1>

          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Enter your email below to login to your account.
          </p>
        </div>

        {/* Login Action Card */}
        <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3">
          {/* Guest Login Button */}
          <button
            onClick={continueAsGuest}
            disabled={loading}
            className="w-full h-11 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold flex items-center justify-center gap-2 transition hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-60 cursor-pointer shadow-sm"
          >
            {loading ? (
              <span>Loading workspace...</span>
            ) : (
              <>
                <span>Continue as Guest</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Google Login (Disabled Demo) */}
          <button
            disabled
            className="w-full h-11 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-400 dark:text-zinc-500 text-sm font-medium flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
          >
            <span className="font-bold text-zinc-400">G</span>
            Login with Google
          </button>
        </div>

        {/* Terms Disclaimer */}
        <p className="mt-5 px-4 text-[10px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          By clicking continue, you agree to our{" "}
          <span className="underline cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300">
            Privacy Policy
          </span>
        </p>

        {/* Theme Menu Container */}
        <div className="mt-6 w-full flex justify-center">
          <ThemeMenu />
        </div>
      </div>
    </main>
  );
}
