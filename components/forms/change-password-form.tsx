"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getInstitutionNavItems, getTeacherNavItems } from "@/components/dashboard/teacher-nav";
import { FormField, ModernForm, ModernInput } from "@/components/forms/modern-form";
import { useToast } from "@/components/ui/toast-provider";
import { changePassword } from "@/lib/api";
import type { UserRole } from "@/lib/auth";

type ChangePasswordFormProps = {
  role: UserRole;
};

export function ChangePasswordForm({ role }: ChangePasswordFormProps) {
  const dashboardPath = role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard";

  return (
    <RoleProtectedPage role={role} loadingLabel="Loading change password form...">
      {({ user, accessToken, logoutAction, isLoggingOut }) => (
        <DashboardLayout
          navItems={role === "TEACHER" ? getTeacherNavItems("password") : getInstitutionNavItems("password")}
          userName={user.name}
          userEmail={user.email}
          userRole={user.role}
          settingsHref={role === "TEACHER" ? "/teacher/profile" : "/institution/profile"}
          onLogout={logoutAction}
          isLoggingOut={isLoggingOut}
        >
          <ChangePasswordFormContent accessToken={accessToken} dashboardPath={dashboardPath} />
        </DashboardLayout>
      )}
    </RoleProtectedPage>
  );
}

type ChangePasswordFormContentProps = {
  accessToken: string;
  dashboardPath: string;
};

function ChangePasswordFormContent({ accessToken, dashboardPath }: ChangePasswordFormContentProps) {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = calculatePasswordStrength(newPassword);
  const passwordsMatch = !!newPassword && newPassword === confirmNewPassword;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!currentPassword) nextErrors.currentPassword = "Current password is required";
    if (!newPassword) nextErrors.newPassword = "New password is required";
    if (newPassword.length < 8) nextErrors.newPassword = "Password must be at least 8 characters";
    if (newPassword === currentPassword) nextErrors.newPassword = "New password must be different from current password";
    if (!confirmNewPassword) nextErrors.confirmPassword = "Please confirm your new password";
    if (newPassword !== confirmNewPassword) nextErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await changePassword(accessToken, { currentPassword, newPassword });
      showToast(response.message, "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to change password";
      setErrors({ submit: message });
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-[28px] border border-brand-navy/50 bg-[radial-gradient(circle_at_top_left,_rgba(185,231,251,0.24),_transparent_28%),linear-gradient(135deg,#07111f_0%,#0b3d47_52%,#0b8f88_100%)] px-5 py-5 text-white shadow-[0_28px_64px_rgba(16,32,51,0.26)] sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/72">Account security</p>
            <h1 className="mt-3 font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-white sm:text-[2.5rem]">
              Change Password
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Update your password inside the same workspace shell so account security stays consistent with the rest of the product.
            </p>
          </div>

          <Link
            href={dashboardPath}
            className="inline-flex min-h-11 items-center gap-2 rounded-[16px] border border-white/12 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/14"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </section>

      <motion.section
        className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_16px_38px_rgba(17,34,68,0.06)] sm:p-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div className="rounded-[20px] border border-[#b6e7f5] bg-[#f4fbff] p-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-brand-teal shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy">Keep your account secure</p>
                <p className="mt-1 text-xs leading-6 text-brand-navy/65">
                  Use a stronger password with at least 8 characters, including uppercase letters, numbers, and ideally a symbol.
                </p>
              </div>
            </div>
          </div>

          {errors.submit ? (
            <motion.div
              className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.submit}
            </motion.div>
          ) : null}

          <ModernForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Change Password">
            <FormField label="Current Password" error={errors.currentPassword} required>
              <PasswordInput
                value={currentPassword}
                onChange={(value) => {
                  setCurrentPassword(value);
                  clearError("currentPassword", setErrors);
                }}
                visible={showCurrentPassword}
                onToggleVisibility={() => setShowCurrentPassword((value) => !value)}
              />
            </FormField>

            <FormField label="New Password" error={errors.newPassword} required>
              <PasswordInput
                value={newPassword}
                onChange={(value) => {
                  setNewPassword(value);
                  clearError("newPassword", setErrors);
                }}
                visible={showNewPassword}
                onToggleVisibility={() => setShowNewPassword((value) => !value)}
              />

              {newPassword ? (
                <motion.div className="mt-3 space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div
                        key={item}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          item <= passwordStrength
                            ? passwordStrength >= 4
                              ? "bg-emerald-500"
                              : passwordStrength >= 3
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-brand-navy/60">
                    Strength: {["Very Weak", "Weak", "Fair", "Good", "Strong"][Math.max(passwordStrength - 1, 0)]}
                  </p>
                </motion.div>
              ) : null}
            </FormField>

            <FormField label="Confirm New Password" error={errors.confirmPassword} required>
              <PasswordInput
                value={confirmNewPassword}
                onChange={(value) => {
                  setConfirmNewPassword(value);
                  clearError("confirmPassword", setErrors);
                }}
                visible={showConfirmPassword}
                onToggleVisibility={() => setShowConfirmPassword((value) => !value)}
              />

              {confirmNewPassword ? (
                <motion.p
                  className={`mt-3 text-xs font-medium ${passwordsMatch ? "text-emerald-600" : "text-rose-600"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                </motion.p>
              ) : null}
            </FormField>
          </ModernForm>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <p className="text-xs font-medium text-brand-navy/60">Password requirements</p>
            <ul className="space-y-1.5 text-xs text-brand-navy/60">
              <li className="flex items-center gap-2">
                <span className={newPassword.length >= 8 ? "text-emerald-600" : "text-slate-400"}>+</span>
                At least 8 characters
              </li>
              <li className="flex items-center gap-2">
                <span className={/[A-Z]/.test(newPassword) ? "text-emerald-600" : "text-slate-400"}>+</span>
                One uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <span className={/[0-9]/.test(newPassword) ? "text-emerald-600" : "text-slate-400"}>+</span>
                One number
              </li>
              <li className="flex items-center gap-2">
                <span className={/[^A-Za-z0-9]/.test(newPassword) ? "text-emerald-600" : "text-slate-400"}>+</span>
                One symbol
              </li>
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisibility: () => void;
};

function PasswordInput({ value, onChange, visible, onToggleVisibility }: PasswordInputProps) {
  return (
    <div className="relative">
      <ModernInput
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="........"
        icon={<Lock className="h-4 w-4" />}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/60 transition-colors hover:text-brand-navy"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function clearError(field: string, setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>) {
  setErrors((previous) => {
    if (!(field in previous)) return previous;
    const next = { ...previous };
    delete next[field];
    return next;
  });
}

function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return Math.min(strength, 5);
}
