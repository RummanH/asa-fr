"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Lock, Mail, Shield, User } from "lucide-react";
import { login, registerInstitution, registerTeacher } from "@/lib/api";
import { resolveDashboardPath, saveSession, type UserRole } from "@/lib/auth";
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
          className={`h-12 w-full rounded-[18px] border px-12 pr-4 text-sm font-medium text-brand-navy transition-all duration-150 placeholder:text-brand-navy/32 focus:outline-none ${
            focused
              ? "border-brand-teal bg-white shadow-[0_0_0_4px_rgba(11,143,136,0.12)]"
              : "border-slate-200 bg-slate-50/80 hover:border-brand-sky/65 hover:bg-white"
          }`}
        />
      </div>
    </div>
  );
}

export function AuthForm({ mode, role }: AuthFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegisterMode = mode === "register";
  const isLogin = mode === "login";
  const title = isLogin ? "Welcome back" : role === "TEACHER" ? "Create teacher account" : "Create institution account";
  const subtitle = isLogin ? "Sign in to continue." : "Create your account and continue to your workspace.";
  const accentTone = role === "INSTITUTION" ? "gold" : "teal";

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
        <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_28px_70px_rgba(16,32,51,0.12)]">
          <div className="border-b border-brand-sky/25 bg-[linear-gradient(180deg,rgba(234,244,248,0.9)_0%,rgba(255,255,255,0.98)_100%)] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] ${
                  accentTone === "gold" ? "bg-brand-gold/16 text-brand-gold" : "bg-brand-teal/12 text-brand-teal"
                }`}
              >
                <Shield size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-3 inline-flex rounded-full border border-brand-sky/35 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-navy/55">
                  {isLogin ? "Secure sign in" : role === "INSTITUTION" ? "Institution access" : "Teacher access"}
                </div>
                <h1 className="text-2xl font-semibold text-brand-navy sm:text-[2rem]">{title}</h1>
                <p className="mt-2 text-sm leading-6 text-brand-navy/62">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegisterMode ? (
                <Field
                  id="name"
                  label="Full name"
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
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                required
                icon={<Mail size={18} />}
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
                icon={<Lock size={18} />}
                placeholder="Min. 8 characters"
              />

              {isLogin ? (
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-xs font-semibold text-brand-teal transition-colors hover:text-brand-navy">
                    Forgot password?
                  </Link>
                </div>
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
                    <IconSpinner /> Please wait...
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign in" : "Create account"} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-5 text-center">
              <p className="text-sm text-brand-navy/55">
                {isLogin ? (
                  <>
                    No account yet?{" "}
                    <Link href="/register" className="font-semibold text-brand-teal transition-colors hover:text-brand-navy">
                      Register free
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-brand-teal transition-colors hover:text-brand-navy">
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
