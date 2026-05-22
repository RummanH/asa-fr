"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { changePassword } from "@/lib/api";
import type { UserRole } from "@/lib/auth";
import { useToast } from "@/components/ui/toast-provider";

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

function ChangePasswordFormContent({ accessToken, dashboardPath }: ChangePasswordFormContentProps) {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast("New password and confirmation do not match", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await changePassword(accessToken, { currentPassword, newPassword });
      showToast(response.message, "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to change password", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes cpf-spin { to { transform: rotate(360deg); } }
        @keyframes cpf-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cpf-root { animation: cpf-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .cpf-back { transition: background 150ms, color 150ms, transform 150ms; }
        .cpf-back:hover { background: rgba(5,47,68,0.06) !important; transform: translateX(-2px); }
        .cpf-submit { transition: transform 160ms, box-shadow 160ms; }
        .cpf-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 20px 44px rgba(5,47,68,0.28) !important; }
        .cpf-submit:active:not(:disabled) { transform: none; }
      `}</style>

      <main
        className="cpf-root app-shell"
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "2.5rem 1rem" }}
      >
        <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Card */}
          <div
            style={{
              background: "white",
              borderRadius: 24,
              border: "1px solid rgba(212,230,239,0.8)",
              boxShadow: "0 20px 60px rgba(5,47,68,0.1), 0 1px 0 rgba(255,255,255,0.9) inset",
              overflow: "hidden",
            }}
          >
            {/* Header band */}
            <div
              style={{
                background: "linear-gradient(135deg, #052f44 0%, #065770 55%, #076b82 100%)",
                padding: "22px 28px 20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <svg
                style={{ position: "absolute", bottom: -24, right: -12, opacity: 0.1, pointerEvents: "none" }}
                width="150"
                height="100"
                viewBox="0 0 150 100"
                fill="none"
              >
                <circle cx="130" cy="100" r="90" stroke="white" strokeWidth="1" />
                <circle cx="130" cy="100" r="55" stroke="white" strokeWidth="0.7" />
              </svg>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      flexShrink: 0,
                      background: "rgba(169,211,239,0.15)",
                      border: "1px solid rgba(169,211,239,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconShield />
                  </div>
                  <div>
                    <h1 style={{ fontSize: 18, fontWeight: 900, color: "white", letterSpacing: "-0.035em", margin: 0 }}>
                      Change Password
                    </h1>
                    <p style={{ fontSize: 12, color: "rgba(169,211,239,0.75)", margin: "2px 0 0" }}>
                      Update your account password securely
                    </p>
                  </div>
                </div>

                {/* Back button */}
                <Link
                  href={dashboardPath}
                  className="cpf-back"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(169,211,239,0.85)",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 9,
                    padding: "6px 12px",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  <IconArrowLeft /> Dashboard
                </Link>
              </div>
            </div>

            {/* Security notice */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(169,211,239,0.1)",
                borderBottom: "1px solid rgba(212,230,239,0.6)",
                padding: "10px 28px",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                <circle cx="6.5" cy="6.5" r="5.5" stroke="#075f75" strokeWidth="1.2" />
                <path d="M6.5 5.5v4M6.5 4h.01" stroke="#075f75" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <p style={{ fontSize: 11, color: "#075f75", fontWeight: 600, margin: 0 }}>
                Your password must be at least 8 characters. Use a mix of letters, numbers, and symbols for best
                security.
              </p>
            </div>

            {/* Form body */}
            <div style={{ padding: "26px 28px 30px" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <PasswordField
                  id="currentPassword"
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  minLength={8}
                />

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: "linear-gradient(90deg, transparent, #d4e6ef 40%, #d4e6ef 60%, transparent)",
                  }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <PasswordField
                    id="newPassword"
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    minLength={8}
                  />
                  <StrengthMeter password={newPassword} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <PasswordField
                    id="confirmNewPassword"
                    label="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={setConfirmNewPassword}
                    minLength={8}
                  />
                  <MatchIndicator newPw={newPassword} confirm={confirmNewPassword} />
                </div>

                <button
                  className="cpf-submit"
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    height: "2.85rem",
                    borderRadius: 12,
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    background: isSubmitting
                      ? "#7a9fb0"
                      : "linear-gradient(135deg, #052f44 0%, #065770 60%, #076b82 100%)",
                    color: "white",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: "-0.01em",
                    boxShadow: "0 12px 32px rgba(5,47,68,0.22)",
                    opacity: isSubmitting ? 0.8 : 1,
                    fontFamily: "inherit",
                    marginTop: 4,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <IconSpinner /> Saving…
                    </>
                  ) : (
                    <>
                      Update Password <IconArrow />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
