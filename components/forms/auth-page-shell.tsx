"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMe } from "@/lib/api";
import { clearSession, getAccessToken, resolveDashboardPath, saveUser } from "@/lib/auth";

type AuthPageShellProps = {
  children: React.ReactNode;
};

function SessionLoader() {
  return (
    <main
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #03293d 0%, #04485f 48%, #076b82 100%)" }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-[-10%] left-[-5%] w-[520px] h-[520px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(169,211,239,0.45) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[480px] h-[480px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(7,95,117,0.6) 0%, transparent 70%)" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-pattern opacity-40" />

      <div className="relative flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "#a9d3ef",
              borderRightColor: "rgba(169,211,239,0.3)",
              animation: "spin 0.9s cubic-bezier(0.5,0,0.5,1) infinite",
            }}
          />
          {/* Inner dot */}
          <div className="absolute inset-[18px] rounded-full bg-brand-sky/60" />
        </div>

        <div className="text-center">
          <p className="text-brand-sky font-semibold tracking-wide text-sm uppercase letter-spacing-widest">
            Checking session
          </p>
          <p className="text-white/40 text-xs mt-1">Please wait a moment…</p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

/* ─────────────────────────────────────────────
   Decorative background elements
───────────────────────────────────────────── */
function BackgroundCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Top-right radial glow */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-60"
        style={{ background: "radial-gradient(circle, rgba(169,211,239,0.28) 0%, transparent 65%)" }}
      />
      {/* Bottom-left accent */}
      <div
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(7,95,117,0.18) 0%, transparent 70%)" }}
      />

      {/* Subtle dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#052f44" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* Decorative arc — top right */}
      <svg
        className="absolute -top-10 right-0 w-[420px] h-[420px] opacity-[0.07]"
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="420" cy="0" r="300" stroke="#075f75" strokeWidth="1.5" />
        <circle cx="420" cy="0" r="220" stroke="#075f75" strokeWidth="1" />
        <circle cx="420" cy="0" r="140" stroke="#a9d3ef" strokeWidth="0.8" />
      </svg>

      {/* Decorative arc — bottom left */}
      <svg
        className="absolute -bottom-10 left-0 w-[320px] h-[320px] opacity-[0.05]"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="0" cy="320" r="240" stroke="#052f44" strokeWidth="1.2" />
        <circle cx="0" cy="320" r="160" stroke="#075f75" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Floating navbar
───────────────────────────────────────────── */
function FloatingNav() {
  return (
    <header className="relative mx-auto mb-10 w-full max-w-5xl">
      <div
        className="flex items-center justify-between px-5 py-3.5 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(212,230,239,0.9)",
          boxShadow: "0 8px 32px rgba(5,47,68,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
        }}
      >
        {/* Brand wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Logo mark */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #052f44 0%, #075f75 100%)",
              boxShadow: "0 4px 12px rgba(5,47,68,0.25)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2L13.196 5V11L8 14L2.804 11V5L8 2Z"
                stroke="rgba(169,211,239,0.9)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="8" r="2" fill="#a9d3ef" />
            </svg>
          </div>

          <div className="flex flex-col leading-none">
            <span
              className="text-sm font-bold tracking-[-0.03em] text-brand-navy transition-colors group-hover:text-brand-teal"
              style={{ letterSpacing: "-0.025em" }}
            >
              Teacher Hiring
            </span>
            <span className="text-[10px] font-medium text-brand-teal/70 tracking-widest uppercase">Platform</span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Small pill indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{
              background: "rgba(169,211,239,0.18)",
              color: "#075f75",
              border: "1px solid rgba(169,211,239,0.3)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#075f75", boxShadow: "0 0 0 2px rgba(7,95,117,0.2)" }}
            />
            Secure Portal
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-navy/80 hover:text-brand-navy transition-all duration-150 px-3.5 py-1.5 rounded-xl hover:bg-brand-navy/5 active:scale-[0.97]"
            style={{ border: "1px solid rgba(5,47,68,0.1)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-60">
              <path
                d="M1 7L7 1L13 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 8.5V12.5H5.5V9.5H8.5V12.5H11.5V8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Home
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Main shell
───────────────────────────────────────────── */
export function AuthPageShell({ children }: AuthPageShellProps) {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      window.setTimeout(() => setIsCheckingSession(false), 0);
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

  if (isCheckingSession) return <SessionLoader />;

  return (
    <main
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(160deg, #f4f9fc 0%, #eaf4f9 40%, #dff0f7 100%)",
      }}
    >
      <BackgroundCanvas />

      {/* Page content */}
      <div className="relative flex flex-col flex-1 px-4 pt-6 pb-10 md:px-6 md:pt-8">
        <FloatingNav />

        {/* Main auth content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-5xl">{children}</div>
        </div>
      </div>
    </main>
  );
}
