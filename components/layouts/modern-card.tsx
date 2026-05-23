"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import Link from "next/link";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  hover?: boolean;
  accent?: "navy" | "teal" | "gold" | "none";
}

export function ModernCard({
  children,
  className = "",
  href,
  onClick,
  hover = true,
  accent = "navy",
}: ModernCardProps) {
  const accentClasses = {
    navy: "border-l-4 border-l-brand-navy hover:border-l-brand-teal",
    teal: "border-l-4 border-l-brand-teal hover:border-l-brand-navy",
    gold: "border-l-4 border-l-brand-gold hover:border-l-brand-teal",
    none: "",
  };

  const baseClasses = `bg-white rounded-xl border border-slate-200/60 shadow-sm transition-all duration-150 ${
    hover ? "hover:shadow-lg hover:-translate-y-0.5" : ""
  } ${accentClasses[accent]} ${className}`;

  const content = <div className="p-6">{children}</div>;

  if (href) {
    return (
      <Link href={href} className={`block ${baseClasses}`}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        className={`w-full text-left ${baseClasses}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {content}
      </motion.button>
    );
  }

  return <motion.div className={baseClasses}>{content}</motion.div>;
}

interface ModernCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: {
    label: string;
    color: "blue" | "green" | "amber" | "red";
  };
  action?: ReactNode;
}

export function ModernCardHeader({
  title,
  subtitle,
  icon,
  badge,
  action,
}: ModernCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-start gap-3 flex-1">
        {icon && <div className="text-brand-teal mt-0.5">{icon}</div>}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-brand-navy">{title}</h3>
          {subtitle && (
            <p className="text-xs text-brand-navy/60 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <motion.span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              badge.color === "blue"
                ? "bg-blue-100 text-blue-700"
                : badge.color === "green"
                  ? "bg-green-100 text-green-700"
                  : badge.color === "amber"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {badge.label}
          </motion.span>
        )}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

interface ModernCardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export function ModernCardGrid({
  children,
  columns = 1,
  gap = "md",
}: ModernCardGridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <motion.div
      className={`grid ${columnClasses[columns]} ${gapClasses[gap]}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Variant for list items
interface ModernListItemProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  divider?: boolean;
}

export function ModernListItem({
  children,
  href,
  onClick,
  className = "",
  divider = true,
}: ModernListItemProps) {
  const baseClasses = `w-full text-left py-4 px-6 ${
    divider ? "border-b border-slate-100 last:border-b-0" : ""
  } hover:bg-brand-light/30 transition-colors ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses}>
        {children}
      </button>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}
