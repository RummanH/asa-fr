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
    <main className="w-full h-screen flex flex-col bg-background overflow-hidden">
      {/* Title header */}
      {title && (
        <motion.div
          className="border-b border-border bg-card flex-shrink-0 shadow-sm"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 sm:px-6 md:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto min-h-0">
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
