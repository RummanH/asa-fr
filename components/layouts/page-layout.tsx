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
    <main className="flex min-h-[100dvh] w-full flex-col overflow-x-clip bg-transparent lg:h-[100dvh] lg:overflow-hidden">
      {/* Title header */}
      {title && (
        <motion.div
          className="flex-shrink-0 border-b border-transparent bg-transparent shadow-none md:border-border/70 md:bg-card/70 md:shadow-sm"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-3 sm:px-6 md:px-8 md:py-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Content area */}
      <div className="min-h-0 flex-1 overflow-visible lg:overflow-y-auto">
        <div className={`px-3 py-4 sm:px-6 md:px-8 md:py-6 ${className}`}>
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
