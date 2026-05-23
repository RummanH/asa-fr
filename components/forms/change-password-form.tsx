"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { ModernForm, FormField, ModernInput } from "@/components/forms/modern-form";
import { changePassword } from "@/lib/api";
import type { UserRole } from "@/lib/auth";
import { useToast } from "@/components/ui/toast-provider";
import { PageLayout } from "@/components/layouts/page-layout";

type ChangePasswordFormProps = { role: UserRole };

export function ChangePasswordForm({ role }: ChangePasswordFormProps) {
  const dashboardPath = role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard";
  return (
    <RoleProtectedPage role={role} loadingLabel="Loading change password form...">
      {({ accessToken }) => <ChangePasswordFormContent accessToken={accessToken} dashboardPath={dashboardPath} />}
    </RoleProtectedPage>
  );
}

/* ── icons ── */
function IconLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.35" />
      <path d="M4 6V4.5a3 3 0 116 0V6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <circle cx="7" cy="9.5" r="1" fill="currentColor" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M9 2L3 4.5v5C3 13.1 5.7 16.1 9 17c3.3-.9 6-3.9 6-7.5v-5L9 2z"
        stroke="#a9d3ef"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6.5 9l1.8 1.8L11.5 7" stroke="#a9d3ef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <path
        d="M11 6.5H2M5.5 3L2 6.5 5.5 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 7h10M7.5 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      style={{ animation: "cpf-spin 0.8s linear infinite" }}
    >
      <circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <path d="M7.5 2a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconEye({ show }: { show: boolean }) {
  return show ? (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path d="M1 7.5S3.5 3 7.5 3 14 7.5 14 7.5 11.5 12 7.5 12 1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M1 1l13 13M6.1 6.2A2 2 0 009.8 9.9M4.2 4.3C2.5 5.3 1 7.5 1 7.5S3.5 12 7.5 12c1.2 0 2.3-.4 3.2-.9M6.5 3.1C6.8 3 7.2 3 7.5 3c4 0 6.5 4.5 6.5 4.5s-.6 1.1-1.7 2.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── password strength meter ── */
function strengthScore(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
function StrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const score = strengthScore(password);
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const colors = ["#e5484d", "#e5484d", "#f5a524", "#f5a524", "#30a46c", "#30a46c"];
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i <= score ? colors[score] : "#e4eef5",
              transition: "background 250ms",
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 10, fontWeight: 700, color: colors[score], letterSpacing: "0.04em" }}>{labels[score]}</p>
    </div>
  );
}

/* ── match indicator ── */
function MatchIndicator({ newPw, confirm }: { newPw: string; confirm: string }) {
  if (!confirm || !newPw) return null;
  const match = newPw === confirm;
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 700,
        marginTop: 5,
        color: match ? "#30a46c" : "#e5484d",
        letterSpacing: "0.04em",
      }}
    >
      {match ? "✓ Passwords match" : "✗ Passwords do not match"}
    </p>
  );
}

/* ── password field ── */
function PasswordField({
  id,
  label,
  value,
  onChange,
  minLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  minLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#052f44",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span style={{ color: "#075f75", display: "flex" }}>
          <IconLock />
        </span>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          minLength={minLength}
          required
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="••••••••"
          style={{
            width: "100%",
            height: "2.65rem",
            paddingLeft: 14,
            paddingRight: 42,
            borderRadius: 10,
            border: `1.5px solid ${focused ? "#075f75" : "#ccdde8"}`,
            background: focused ? "#f4fbff" : "#fafcfe",
            color: "#052f44",
            fontSize: 13,
            fontWeight: 500,
            outline: "none",
            fontFamily: "inherit",
            boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
            transition: "border-color 160ms, background 160ms, box-shadow 160ms",
          }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          style={{
            position: "absolute",
            right: 11,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            color: "#8eaab8",
            display: "flex",
            transition: "color 150ms",
          }}
        >
          <IconEye show={visible} />
        </button>
      </div>
    </div>
  );
}

/* ── main content ── */
type ChangePasswordFormContentProps = { accessToken: string; dashboardPath: string };

function ChangePasswordFormContent({
  accessToken,
  dashboardPath,
}: ChangePasswordFormContentProps) {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordMatch = newPassword === confirmNewPassword && !!newPassword;
  const passwordStrength = calculatePasswordStrength(newPassword);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.currentPassword = "Current password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    if (newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    if (newPassword === currentPassword) newErrors.newPassword = "New password must be different from current password";
    if (!confirmNewPassword) newErrors.confirmPassword = "Please confirm your new password";
    if (newPassword !== confirmNewPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await changePassword(accessToken, {
        currentPassword,
        newPassword,
      });
      showToast(response.message, "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to change password";
      showToast(message, "error");
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageLayout
      title="Change Password"
      subtitle="Update your password to keep your account secure"
      maxWidth="md"
    >
      <div className="grid gap-8">
        {/* Back button */}
        <Link
          href={dashboardPath}
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy/70 hover:text-brand-navy transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Main form card */}
        <motion.div
          className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 space-y-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Security info box */}
          <div className="bg-brand-light/60 rounded-xl p-4 border border-brand-sky/30">
            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-brand-navy">
                  Keep Your Account Secure
                </p>
                <p className="text-xs text-brand-navy/60 mt-1">
                  Use a strong password with at least 8 characters, including letters, numbers, and symbols.
                </p>
              </div>
            </div>
          </div>

          {/* Error summary */}
          {errors.submit && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.submit}
            </motion.div>
          )}

          <ModernForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Change Password">
            {/* Current Password */}
            <FormField
              label="Current Password"
              error={errors.currentPassword}
              required
            >
              <div className="relative">
                <ModernInput
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (errors.currentPassword) {
                      const newErrors = { ...errors };
                      delete newErrors.currentPassword;
                      setErrors(newErrors);
                    }
                  }}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/60 hover:text-brand-navy transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>

            {/* New Password */}
            <FormField
              label="New Password"
              error={errors.newPassword}
              required
            >
              <div className="relative">
                <ModernInput
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) {
                      const newErrors = { ...errors };
                      delete newErrors.newPassword;
                      setErrors(newErrors);
                    }
                  }}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/60 hover:text-brand-navy transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {newPassword && (
                <motion.div
                  className="mt-2 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-colors ${
                          i <= passwordStrength
                            ? passwordStrength >= 4
                              ? "bg-green-500"
                              : passwordStrength >= 3
                                ? "bg-amber-500"
                                : "bg-red-500"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-brand-navy/60">
                    Strength: {["Very Weak", "Weak", "Fair", "Good", "Strong"][Math.min(passwordStrength - 1, 4)]}
                  </p>
                </motion.div>
              )}
            </FormField>

            {/* Confirm New Password */}
            <FormField
              label="Confirm New Password"
              error={errors.confirmPassword}
              required
            >
              <div className="relative">
                <ModernInput
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    if (errors.confirmPassword) {
                      const newErrors = { ...errors };
                      delete newErrors.confirmPassword;
                      setErrors(newErrors);
                    }
                  }}
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  variant={passwordMatch ? "default" : confirmNewPassword ? "default" : "default"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/60 hover:text-brand-navy transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {confirmNewPassword && (
                <motion.p
                  className={`text-xs font-medium mt-2 ${
                    passwordMatch ? "text-green-600" : "text-red-600"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {passwordMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </motion.p>
              )}
            </FormField>
          </ModernForm>

          {/* Additional info */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <p className="text-xs text-brand-navy/60 font-medium">Password requirements:</p>
            <ul className="text-xs text-brand-navy/60 space-y-1">
              <li className="flex items-center gap-2">
                <span className={newPassword.length >= 8 ? "text-green-600" : "text-slate-400"}>✓</span>
                At least 8 characters
              </li>
              <li className="flex items-center gap-2">
                <span className={/[A-Z]/.test(newPassword) ? "text-green-600" : "text-slate-400"}>✓</span>
                One uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <span className={/[0-9]/.test(newPassword) ? "text-green-600" : "text-slate-400"}>✓</span>
                One number
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
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
