"use client";

import { ReactNode } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProfilePageShellProps {
  title: string;
  subtitle: string;
  backHref: string;
  children: ReactNode;
  isLoading?: boolean;
}

export function ProfilePageShell({
  title,
  subtitle,
  backHref,
  children,
  isLoading,
}: ProfilePageShellProps) {
  if (isLoading) {
    return (
      <PageLayout title={title} subtitle={subtitle} maxWidth="lg">
        <div className="flex items-center justify-center h-96">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-12 h-12 border-4 border-brand-sky border-t-brand-teal rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-brand-navy/60">Loading profile...</p>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={title} subtitle={subtitle} maxWidth="lg">
      <div className="space-y-6">
        {/* Back button */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy/70 hover:text-brand-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </PageLayout>
  );
}

interface ProfileSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

export function ProfileSection({
  title,
  icon,
  children,
  action,
}: ProfileSectionProps) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon && <div className="text-brand-teal">{icon}</div>}
          <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

interface ProfileFieldProps {
  label: string;
  value?: string | ReactNode;
  isEditing?: boolean;
  editValue?: string;
  onEditChange?: (value: string) => void;
  icon?: ReactNode;
}

export function ProfileField({
  label,
  value,
  isEditing,
  editValue,
  onEditChange,
  icon,
}: ProfileFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-brand-teal text-sm">{icon}</span>}
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-navy/60">
          {label}
        </p>
      </div>
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => onEditChange?.(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
        />
      ) : (
        <p className="text-sm text-brand-navy font-medium">{value || "—"}</p>
      )}
    </div>
  );
}
