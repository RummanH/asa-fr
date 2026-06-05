"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield, User } from "lucide-react";
import { useAppLanguage } from "@/components/app/app-language";
import { login, registerInstitution, registerTeacher } from "@/lib/api";
import { resolveDashboardPath, saveSession, type UserRole } from "@/lib/auth";
import { TermsAndConditionsContent } from "@/components/legal/terms-and-conditions-content";
import { useToast } from "@/components/ui/toast-provider";

type AuthFormMode = "login" | "register";
type AuthFormProps = {
  mode: AuthFormMode;
  role?: UserRole;
};

function IconSpinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

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
  trailing,
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
  trailing?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-navy/55">
        {label}
      </label>

      <div className="relative">
        <span
          className={`pointer-events-none absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center transition-colors ${
            focused ? "text-brand-teal" : "text-brand-navy/40"
          }`}
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
          className={`h-12 w-full rounded-[18px] border px-12 ${trailing ? "pr-12" : "pr-4"} text-sm font-medium text-brand-navy transition-all duration-150 placeholder:text-brand-navy/32 focus:outline-none ${
            focused
              ? "border-brand-teal bg-white shadow-[0_0_0_4px_rgba(11,143,136,0.12)]"
              : "border-slate-200 bg-slate-50/80 hover:border-brand-sky/65 hover:bg-white"
          }`}
        />
        {trailing}
      </div>
    </div>
  );
}

export function AuthForm({ mode, role }: AuthFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { copy } = useAppLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegisterMode = mode === "register";
  const isLogin = mode === "login";
  const accentTone = role === "INSTITUTION" ? "gold" : "teal";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isRegisterMode && !acceptedTerms) {
      showToast(copy.auth.mustAcceptTerms, "error");
      return;
    }

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

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .auth-form-root {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="auth-form-root w-full">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[16px] ${
                accentTone === "gold" ? "bg-brand-gold/16 text-brand-gold" : "bg-brand-teal/12 text-brand-teal"
              }`}
            >
              <Shield size={19} />
            </div>
            <div className="inline-flex rounded-full border border-brand-sky/35 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-navy/55">
              {isLogin ? copy.auth.secureSignIn : role === "INSTITUTION" ? copy.auth.institutionAccess : copy.auth.teacherAccess}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegisterMode ? (
              <Field
                id="name"
                label={copy.auth.fullName}
                value={name}
                onChange={setName}
                minLength={2}
                required
                icon={<User size={18} />}
                placeholder="Jane Smith"
              />
            ) : null}

            <Field
              id="email"
              label={copy.auth.email}
              type="email"
              value={email}
              onChange={setEmail}
              required
              icon={<Mail size={18} />}
              placeholder="you@example.com"
            />

            <Field
              id="password"
              label={copy.auth.password}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              minLength={8}
              required
              icon={<Lock size={18} />}
              placeholder="Min. 8 characters"
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-brand-navy/40 transition-colors hover:text-brand-navy"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            {isLogin ? (
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs font-semibold text-brand-teal transition-colors hover:text-brand-navy">
                  {copy.auth.forgotPassword}
                </Link>
              </div>
            ) : null}

            {isRegisterMode ? (
              <label className="flex items-start gap-3 rounded-[18px] border border-slate-200 bg-slate-50/75 px-4 py-3 text-sm text-brand-navy/75">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-teal focus:ring-brand-teal"
                  required
                />
                <span className="leading-6">
                  {copy.auth.acceptTerms.replace("Terms and Conditions.", "").trim()}{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-semibold text-brand-teal transition-colors hover:text-brand-navy"
                  >
                    {copy.auth.termsTitle}
                  </button>
                </span>
              </label>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[18px] text-sm font-semibold text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                accentTone === "gold"
                  ? "bg-brand-gold hover:brightness-95"
                  : "bg-[linear-gradient(135deg,#102033_0%,#0b8f88_100%)] hover:brightness-95"
              }`}
            >
              {isSubmitting ? (
                <>
                  <IconSpinner /> {copy.auth.pleaseWait}
                </>
              ) : (
                <>
                  {isLogin ? copy.auth.signIn : copy.auth.createAccount} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-brand-navy/55">
              {isLogin ? (
                <>
                  {copy.auth.noAccount}{" "}
                  <Link href="/register" className="font-semibold text-brand-teal transition-colors hover:text-brand-navy">
                    {copy.auth.registerFree}
                  </Link>
                </>
              ) : (
                <>
                  {copy.auth.alreadyAccount}{" "}
                  <Link href="/login" className="font-semibold text-brand-teal transition-colors hover:text-brand-navy">
                    {copy.auth.signIn}
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {showTermsModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-brand-navy">{copy.auth.termsTitle}</h2>
                <p className="text-sm text-slate-500">{copy.auth.termsHint}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-brand-navy"
                aria-label="Close terms and conditions"
              >
                <EyeOff size={16} className="hidden" />
                <span className="text-lg leading-none">x</span>
              </button>
            </div>
            <div className="max-h-[calc(90vh-5.5rem)] overflow-y-auto px-5 py-5 sm:px-6">
              <TermsAndConditionsContent compact />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                <Link href="/terms-and-conditions" className="text-sm font-semibold text-brand-teal transition hover:text-brand-navy">
                  {copy.auth.openFullPage}
                </Link>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="inline-flex min-h-11 items-center justify-center rounded-[16px] bg-brand-navy px-4 text-sm font-semibold text-white transition hover:bg-brand-teal"
                >
                  {copy.common.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
