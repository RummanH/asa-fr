"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "w-full",
};

export function PageLayout({
  children,
  title,
  subtitle,
  maxWidth = "lg",
  className = "",
}: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-sky/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-brand-teal/5 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {title && (
          <motion.div
            className="border-b border-slate-200/60 bg-white/60 backdrop-blur-sm sticky top-0"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 sm:px-6 md:px-8">
              <h1 className="text-3xl font-bold text-brand-navy">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-sm text-brand-navy/65">{subtitle}</p>
              )}
            </div>
          </motion.div>
        )}

        <div className={`px-4 py-6 sm:px-6 md:px-8 ${className}`}>
          <motion.div
            className={`mx-auto ${maxWidthClasses[maxWidth]}`}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

// Alias for semantic clarity
export const ContentLayout = PageLayout;
