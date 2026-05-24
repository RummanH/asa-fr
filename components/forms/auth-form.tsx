"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login, registerInstitution, registerTeacher } from "@/lib/api";
import { resolveDashboardPath, saveSession, type UserRole } from "@/lib/auth";
import { useToast } from "@/components/ui/toast-provider";

type AuthFormMode = "login" | "register";
type AuthFormProps = {
  mode: AuthFormMode;
  role?: UserRole;
};

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden style={{ animation: "spin 0.8s linear infinite" }}>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a10 10 0 0 1 10 10"></path>
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
      <label
        htmlFor={id}
        className="text-xs font-semibold text-foreground uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <span
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors flex items-center justify-center pointer-events-none h-5 w-5 ${
            focused ? "text-primary" : "text-muted-foreground"
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
          className={`w-full h-11 pl-10 pr-4 rounded-lg border-2 transition-all duration-150 focus:outline-none font-medium text-sm ${
            focused
              ? "border-primary bg-background/80 ring-2 ring-primary/20"
              : "border-border bg-background hover:border-border/80"
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
  const title = isLogin ? "Welcome Back" : role === "TEACHER" ? "Join as Teacher" : "Register Institution";
  const subtitle = isLogin
    ? "Sign in to continue to your hiring dashboard."
    : "Create your account to start hiring, messaging, and managing requests.";

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

      <div className="auth-form-root w-full max-w-md mx-auto px-4 sm:px-6">
        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent p-6 sm:p-8">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-10">
              <svg className="absolute bottom-0 right-0 w-40 h-40 -mb-20 -mr-20" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20 text-primary-foreground">
                <IconShield />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground">{title}</h1>
                <p className="text-sm text-primary-foreground/80 mt-1 leading-snug">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex justify-end pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <IconSpinner /> Please wait...
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign in" : "Create account"} <IconArrow />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? (
                  <>
                    No account yet?{" "}
                    <Link href="/register" className="font-semibold text-primary hover:text-primary/90 transition-colors">
                      Register free
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-primary hover:text-primary/90 transition-colors">
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
