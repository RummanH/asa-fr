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
      if (mode === "register" && !role) {
        throw new Error("Registration role is required");
      }

      const response = (() => {
        if (mode === "login") {
          return login({
            email: email.trim(),
            password,
          });
        }

        const registerPayload = {
          name: name.trim(),
          email: email.trim(),
          password,
        };

        return role === "TEACHER"
          ? registerTeacher(registerPayload)
          : registerInstitution(registerPayload);
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

  const title =
    mode === "login"
      ? "Welcome Back"
      : role === "TEACHER"
        ? "Register As Teacher"
        : "Register As Institution";

  const subtitle =
    mode === "login"
      ? "Login to continue with your teacher hiring account."
      : "Create your account to access hiring, chat, and request management.";

  return (
    <div className="w-full max-w-md brand-card p-6 shadow-[0_20px_55px_rgba(5,47,68,0.14)] md:p-8">
      <div className="mb-6">
        <span className="inline-flex rounded-full bg-[#e4f2f9] px-3 py-1 text-xs font-semibold tracking-wide text-brand-teal">
          Teacher Hiring Platform
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-brand-navy">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-brand-navy/65">{subtitle}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isRegisterMode ? (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-navy/90" htmlFor="name">
              Full name
            </label>
            <input
              className="app-input"
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              required
            />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-navy/90" htmlFor="email">
            Email
          </label>
          <input
            className="app-input"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-navy/90" htmlFor="password">
            Password
          </label>
          <input
            className="app-input"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>

        {mode === "login" ? (
          <div className="flex justify-end">
            <Link className="text-xs font-medium text-brand-navy/78 underline" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
        ) : null}

        <button
          className="app-btn-primary h-11 w-full justify-center text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>

      <div className="mt-5 text-sm text-brand-navy/65">
        {mode === "login" ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link className="font-medium text-brand-navy underline" href="/register">
              Register
            </Link>
          </p>
        ) : (
          <p>
            Already registered?{" "}
            <Link className="font-medium text-brand-navy underline" href="/login">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
