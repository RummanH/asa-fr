"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login, registerInstitution, registerTeacher } from "@/lib/api";
import { saveSession, type UserRole, resolveDashboardPath } from "@/lib/auth";
import { useToast } from "@/components/ui/toast-provider";

type AuthFormMode = "login" | "register";
type AuthFormProps = {
  mode: AuthFormMode;
  role?: UserRole;
};

/* ── tiny icon components ── */
function IconUser() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 4.5l6.5 4.5L14 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <rect x="2.5" y="6.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 6.5V4.5a3 3 0 116 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7.5" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path
        d="M3 7.5h9M8 3.5l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ animation: "auth-spin 0.8s linear infinite" }}
    >
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── decorative divider ── */
function OrDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #d4e6ef)" }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: "#8eaab8", letterSpacing: "0.08em" }}>OR</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #d4e6ef, transparent)" }} />
    </div>
  );
}

/* ── field wrapper ── */
function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  minLength,
  required,
  icon,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  minLength?: number;
  required?: boolean;
  icon: React.ReactNode;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{ fontSize: 12, fontWeight: 700, color: "#052f44", letterSpacing: "0.02em", textTransform: "uppercase" }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {/* Icon */}
        <span
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: focused ? "#075f75" : "#8eaab8",
            transition: "color 160ms",
            pointerEvents: "none",
            display: "flex",
          }}
        >
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          minLength={minLength}
          required={required}
          placeholder={placeholder}
          style={{
            width: "100%",
            height: "2.75rem",
            paddingLeft: 40,
            paddingRight: 14,
            borderRadius: 10,
            border: focused ? "1.5px solid #075f75" : "1.5px solid #ccdde8",
            background: focused ? "#f4fbff" : "#fafcfe",
            color: "#052f44",
            fontSize: 14,
            fontWeight: 500,
            outline: "none",
            transition: "border-color 160ms, background 160ms, box-shadow 160ms",
            boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
          }}
        />
      </div>
    </div>
  );
}

/* ── main component ── */
export function AuthForm({ mode, role }: AuthFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegisterMode = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === "register" && !role) throw new Error("Registration role is required");

      const response = (() => {
        if (mode === "login") return login({ email: email.trim(), password });
        const registerPayload = { name: name.trim(), email: email.trim(), password };
        return role === "TEACHER" ? registerTeacher(registerPayload) : registerInstitution(registerPayload);
      })();

      const result = await response;
      saveSession(result.accessToken, result.user);
      showToast(mode === "login" ? "Login successful." : "Account created successfully.", "success");
      router.replace(resolveDashboardPath(result.user.role));
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLogin = mode === "login";
  const title = isLogin ? "Welcome back" : role === "TEACHER" ? "Join as a Teacher" : "Register Institution";
  const subtitle = isLogin
    ? "Sign in to continue to your hiring dashboard."
    : "Create your account to access hiring, chat, and request management.";

  return (
    <>
      <style>{`
        @keyframes auth-spin { to { transform: rotate(360deg); } }
        @keyframes auth-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-form-root { animation: auth-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .auth-submit-btn { transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease; }
        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 44px rgba(5,47,68,0.28);
        }
        .auth-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-link { transition: color 140ms; }
        .auth-link:hover { color: #075f75; }
      `}</style>

      <div className="auth-form-root w-full" style={{ maxWidth: 440 }}>
        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            border: "1px solid rgba(212,230,239,0.8)",
            boxShadow: "0 24px 64px rgba(5,47,68,0.12), 0 1px 0 rgba(255,255,255,0.9) inset",
            overflow: "hidden",
          }}
        >
          {/* Header band */}
          <div
            style={{
              background: "linear-gradient(135deg, #052f44 0%, #065770 55%, #076b82 100%)",
              padding: "28px 32px 24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle arc decoration */}
            <svg
              style={{ position: "absolute", bottom: -30, right: -20, opacity: 0.12 }}
              width="180"
              height="120"
              viewBox="0 0 180 120"
              fill="none"
            >
              <circle cx="160" cy="120" r="100" stroke="white" strokeWidth="1" />
              <circle cx="160" cy="120" r="65" stroke="white" strokeWidth="0.8" />
            </svg>

            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(169,211,239,0.18)",
                border: "1px solid rgba(169,211,239,0.28)",
                borderRadius: 999,
                padding: "4px 12px",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#a9d3ef",
                  boxShadow: "0 0 0 2px rgba(169,211,239,0.35)",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#a9d3ef",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Teacher Hiring Platform
              </span>
            </div>

            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.04em",
                margin: "0 0 6px",
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: 13, color: "rgba(169,211,239,0.8)", lineHeight: 1.6, margin: 0 }}>{subtitle}</p>
          </div>

          {/* Form body */}
          <div style={{ padding: "28px 32px 32px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {isRegisterMode && (
                <Field
                  id="name"
                  label="Full name"
                  value={name}
                  onChange={setName}
                  minLength={2}
                  required
                  icon={<IconUser />}
                  placeholder="Jane Smith"
                />
              )}

              <Field
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                required
                icon={<IconMail />}
                placeholder="you@example.com"
              />

              <Field
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                minLength={8}
                required
                icon={<IconLock />}
                placeholder="Min. 8 characters"
              />

              {isLogin && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
                  <Link
                    href="/forgot-password"
                    className="auth-link"
                    style={{ fontSize: 12, fontWeight: 600, color: "#5d7280", textDecoration: "none" }}
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                className="auth-submit-btn"
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
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  boxShadow: "0 12px 32px rgba(5,47,68,0.22)",
                  opacity: isSubmitting ? 0.8 : 1,
                  marginTop: 4,
                }}
              >
                {isSubmitting ? (
                  <>
                    <IconSpinner /> Please wait…
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign in to account" : "Create account"} <IconArrow />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div style={{ marginTop: 24 }}>
              <OrDivider />
              <p style={{ textAlign: "center", fontSize: 13, color: "#5d7280", marginTop: 16 }}>
                {isLogin ? (
                  <>
                    No account yet?{" "}
                    <Link
                      href="/register"
                      className="auth-link"
                      style={{ fontWeight: 700, color: "#052f44", textDecoration: "none" }}
                    >
                      Register free →
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="auth-link"
                      style={{ fontWeight: 700, color: "#052f44", textDecoration: "none" }}
                    >
                      Sign in →
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Trust strip below card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            marginTop: 20,
            padding: "0 8px",
          }}
        >
          {[
            { icon: "🔒", text: "SSL encrypted" },
            { icon: "🛡️", text: "Data protected" },
            { icon: "✓", text: "Trusted platform" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 11 }}>{icon}</span>
              <span style={{ fontSize: 11, color: "#8eaab8", fontWeight: 600 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
