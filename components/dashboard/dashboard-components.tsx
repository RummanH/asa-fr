"use client";

import { motion } from "motion/react";

interface DashboardCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  highlight?: boolean;
  interactive?: boolean;
  className?: string;
}

export function DashboardCard({
  title,
  description,
  children,
  highlight = false,
  interactive = false,
  className = "",
}: DashboardCardProps) {
  return (
    <motion.div
      className={`rounded-[1.5rem] border p-6 lg:p-8 transition-all duration-300 ${
        highlight
          ? "border-brand-sky/20 bg-brand-light/80 shadow-[0_18px_45px_rgba(11,143,136,0.08)]"
          : "border-slate-200/70 bg-white shadow-sm"
      } ${interactive ? "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" : ""} ${className}`}
      whileHover={interactive ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
    >
      {(title || description) && (
        <div className="mb-6 pb-4 border-b border-slate-200/40">
          {title && <h3 className="text-xl lg:text-2xl font-semibold text-brand-ink">{title}</h3>}
          {description && <p className="text-sm text-slate-600 mt-2 max-w-2xl">{description}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: "teal" | "gold" | "sky" | "emerald" | "red";
  action?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  badge,
  badgeColor = "teal",
  action,
}: DashboardHeaderProps) {
  const badgeClasses = {
    teal: "bg-brand-teal/15 text-brand-teal border-brand-teal/30",
    gold: "bg-brand-gold/15 text-brand-gold border-brand-gold/30",
    sky: "bg-brand-sky/15 text-brand-sky border-brand-sky/30",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-300",
    red: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <motion.div
      className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-brand-navy">{title}</h1>
          {badge && (
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${badgeClasses[badgeColor]}`}>
              <span className={`h-2 w-2 rounded-full ${badgeColor === 'emerald' ? 'bg-emerald-500' : badgeColor === 'red' ? 'bg-red-500' : `bg-brand-${badgeColor}`}`} />
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-slate-600 text-base lg:text-lg">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}

interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function DashboardGrid({ children, columns = 3 }: DashboardGridProps) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <motion.div
      className={`grid ${colsClass[columns]} gap-6 lg:gap-8`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, staggerChildren: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

interface StatBoxProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "teal" | "gold" | "sky" | "navy";
  trend?: { value: number; direction: "up" | "down" };
}

export function StatBox({ label, value, icon, color = "teal", trend }: StatBoxProps) {
  const colorClasses = {
    teal: "border-brand-teal/20 bg-brand-teal/10 text-brand-ink",
    gold: "border-brand-gold/20 bg-brand-gold/10 text-brand-ink",
    sky: "border-brand-sky/20 bg-brand-sky/10 text-brand-ink",
    navy: "border-brand-navy/20 bg-brand-sky/5 text-brand-navy",
  };

  return (
    <motion.div
      className={`rounded-[1.25rem] border p-5 lg:p-6 shadow-sm ${colorClasses[color]}`}
      whileHover={{ y: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        {icon && <span className="text-2xl opacity-90">{icon}</span>}
        {trend && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trend.direction === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">{label}</p>
      <p className="text-3xl font-bold tracking-tight text-brand-ink">{value}</p>
    </motion.div>
  );
}

interface ActionButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
}

export function ActionButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
}: ActionButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50";

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary:
      "bg-brand-navy text-white hover:bg-brand-teal shadow-md hover:shadow-lg hover:scale-105",
    secondary:
      "bg-brand-sky/20 text-brand-teal border border-brand-sky/40 hover:bg-brand-sky/30",
    outline:
      "border border-slate-300 text-slate-700 hover:bg-slate-50",
  };

  const fullWidthClass = fullWidth ? "w-full" : "";

  const buttonContent = (
    <motion.span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidthClass}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return <a href={href}>{buttonContent}</a>;
  }

  return (
    <button onClick={onClick} disabled={disabled}>
      {buttonContent}
    </button>
  );
}
