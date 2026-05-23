"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

interface ModernFormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  title?: string;
  description?: string;
  submitButtonText?: string;
  isSubmitting?: boolean;
  className?: string;
}

export function ModernForm({
  children,
  onSubmit,
  title,
  description,
  submitButtonText = "Submit",
  isSubmitting = false,
  className = "",
}: ModernFormProps) {
  return (
    <motion.form
      onSubmit={onSubmit}
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {title && (
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-brand-navy/65">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-4">{children}</div>

      {submitButtonText && (
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-gradient-to-r from-brand-navy to-brand-teal text-white font-semibold rounded-xl hover:shadow-lg active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting && (
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
          {submitButtonText}
        </motion.button>
      )}
    </motion.form>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  label,
  error,
  required,
  hint,
  children,
}: FormFieldProps) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <label className="flex items-center gap-1 text-sm font-medium text-brand-navy">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">{children}</div>

      {error ? (
        <motion.p
          className="text-xs text-red-500 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      ) : hint ? (
        <p className="text-xs text-brand-navy/50">{hint}</p>
      ) : null}
    </motion.div>
  );
}

interface ModernInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  variant?: "default" | "bordered" | "filled";
}

export function ModernInput({
  icon,
  variant = "default",
  className = "",
  ...props
}: ModernInputProps) {
  const variants = {
    default: "border border-slate-200 bg-white hover:border-brand-teal/40 focus:border-brand-teal focus:bg-brand-light/50",
    bordered: "border-2 border-brand-navy/20 bg-white hover:border-brand-navy/40 focus:border-brand-navy focus:bg-brand-light/50",
    filled: "border-0 bg-brand-light/60 hover:bg-brand-light focus:bg-white focus:ring-2 focus:ring-brand-teal/50",
  };

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/60 pointer-events-none flex items-center">
          {icon}
        </div>
      )}
      <input
        className={`w-full h-11 px-3 ${icon ? "pl-10" : ""} py-2 rounded-lg text-sm font-medium text-brand-navy placeholder:text-brand-navy/40 outline-none transition-all duration-150 ${variants[variant]} ${className}`}
        {...props}
      />
    </div>
  );
}

interface ModernTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "bordered" | "filled";
}

export function ModernTextarea({
  variant = "default",
  className = "",
  ...props
}: ModernTextareaProps) {
  const variants = {
    default: "border border-slate-200 bg-white hover:border-brand-teal/40 focus:border-brand-teal focus:bg-brand-light/50",
    bordered: "border-2 border-brand-navy/20 bg-white hover:border-brand-navy/40 focus:border-brand-navy focus:bg-brand-light/50",
    filled: "border-0 bg-brand-light/60 hover:bg-brand-light focus:bg-white focus:ring-2 focus:ring-brand-teal/50",
  };

  return (
    <textarea
      className={`w-full min-h-24 px-3 py-2 rounded-lg text-sm font-medium text-brand-navy placeholder:text-brand-navy/40 outline-none transition-all duration-150 resize-none ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

interface ModernSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "default" | "bordered" | "filled";
  options: Array<{ value: string; label: string }>;
}

export function ModernSelect({
  variant = "default",
  options,
  className = "",
  ...props
}: ModernSelectProps) {
  const variants = {
    default: "border border-slate-200 bg-white hover:border-brand-teal/40 focus:border-brand-teal focus:bg-brand-light/50",
    bordered: "border-2 border-brand-navy/20 bg-white hover:border-brand-navy/40 focus:border-brand-navy focus:bg-brand-light/50",
    filled: "border-0 bg-brand-light/60 hover:bg-brand-light focus:bg-white focus:ring-2 focus:ring-brand-teal/50",
  };

  return (
    <select
      className={`w-full h-11 px-3 py-2 rounded-lg text-sm font-medium text-brand-navy outline-none transition-all duration-150 appearance-none bg-no-repeat bg-right pr-10 ${variants[variant]} ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23075f75' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundPosition: "right 12px center",
      }}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
