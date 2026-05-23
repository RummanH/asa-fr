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
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-navy via-brand-teal to-brand-sky">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-sky/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-gold/10 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-brand-sky/15 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated spinner */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-brand-sky"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 rounded-full bg-gradient-to-br from-brand-sky to-brand-gold/50"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <div>
          <motion.p
            className="text-brand-sky font-semibold tracking-widest text-sm uppercase"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Authenticating your session
          </motion.p>
          <p className="text-white/60 text-xs mt-2">Please wait a moment...</p>
        </div>
      </motion.div>
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
      <main className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-brand-navy via-brand-teal to-brand-sky">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-md text-center">
          <p className="text-red-300 font-semibold">{error}</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
