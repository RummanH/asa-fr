"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMe } from "@/lib/api";
import {
  clearSession,
  getAccessToken,
  resolveDashboardPath,
  saveUser,
} from "@/lib/auth";

type AuthPageShellProps = {
  children: React.ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      window.setTimeout(() => {
        setIsCheckingSession(false);
      }, 0);
      return;
    }

    fetchMe(token)
      .then((user) => {
        saveUser(user);
        router.replace(resolveDashboardPath(user.role));
      })
      .catch(() => {
        clearSession();
        setIsCheckingSession(false);
      })
      .finally(() => {
        setIsCheckingSession(false);
      });
  }, [router]);

  if (isCheckingSession) {
    return (
      <main className="app-shell px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-5xl app-panel p-6 md:p-8">
          <p className="text-sm text-brand-navy/78">Checking session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden section-soft px-4 py-8 md:px-6 md:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_20%_20%,rgba(7,95,117,0.14),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(169,211,239,0.4),transparent_45%)]" />

      <div className="relative mx-auto mb-8 flex w-full max-w-5xl items-center justify-between rounded-2xl border border-[#d4e6ef] bg-white/82 px-4 py-3 backdrop-blur-md md:px-5">
        <Link className="text-base font-bold tracking-[-0.02em] text-brand-navy md:text-lg" href="/">
          Teacher Hiring Platform
        </Link>
        <Link
          className="app-btn-secondary px-3 py-1.5 text-sm"
          href="/"
        >
          Home
        </Link>
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center">{children}</div>
    </main>
  );
}

