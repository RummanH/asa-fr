"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fetchMe } from "@/lib/api";
import { clearSession, getAccessToken, resolveDashboardPath, saveUser } from "@/lib/auth";

type AuthPageShellProps = {
  children: React.ReactNode;
};

function SessionLoader() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(11,143,136,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(243,179,61,0.16),transparent_30%)]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(249,250,251,0.92))]" />
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -left-10 top-1/4 h-72 w-72 rounded-full bg-brand-sky/20 blur-3xl"
          animate={{ x: [0, 36, 0], y: [0, -24, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-gold/15 blur-3xl"
          animate={{ x: [0, -28, 0], y: [0, 24, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/95 p-8 shadow-2xl shadow-slate-900/10">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-sky/15 text-brand-navy text-2xl font-extrabold">
              TH
            </div>
            <p className="text-lg font-semibold text-brand-navy">Authenticating your session</p>
            <p className="text-sm leading-6 text-slate-600">Please wait while we restore your secure access.</p>
            <div className="relative h-20 w-20">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-brand-sky/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-navy border-r-brand-sky"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-slate-100"
            >
              Back to landing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AuthPageShell({ children }: AuthPageShellProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const accessToken = getAccessToken();

        if (accessToken) {
          const user = await fetchMe(accessToken);
          saveUser(user);
          const dashboardPath = resolveDashboardPath(user.role);
          router.push(dashboardPath);
          return;
        }

        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to check session";
        console.error("Session check failed:", errorMessage);
        clearSession();
        setIsLoading(false);
      }
    }

    checkSession();
  }, [router]);

  if (isLoading) {
    return <SessionLoader />;
  }

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(11,143,136,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(243,179,61,0.16),transparent_30%)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(249,250,251,0.92))]" />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-red-200 bg-white/95 p-8 shadow-2xl shadow-red-200/20 text-center">
            <p className="text-lg font-semibold text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
