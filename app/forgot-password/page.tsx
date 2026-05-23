"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import AuthPageShell from "@/components/forms/auth-page-shell";
import { AuthLayout } from "@/components/forms/auth-layout";
import { forgotPassword } from "@/lib/api";
import { useToast } from "@/components/ui/toast-provider";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <AuthLayout
        title="Forgot Password"
        subtitle="Enter your account email to receive password reset instructions"
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </AuthPageShell>
  );
}

function ForgotPasswordForm() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetToken(null);
    setIsSubmitting(true);

    try {
      const response = await forgotPassword({ email: email.trim() });
      showToast(response.message, "success");
      setResetToken(response.resetToken ?? null);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to request password reset",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md app-panel p-6 sm:p-8 shadow-[0_20px_55px_rgba(5,47,68,0.12)]">
      <h1 className="text-2xl font-semibold text-brand-navy">Forgot Password</h1>
      <p className="mt-2 text-sm text-brand-navy/65">
        Enter your account email to receive password reset instructions.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
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

        {resetToken ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <p className="font-semibold">Development reset token</p>
            <p className="mt-1 break-all">{resetToken}</p>
            <Link
              className="mt-2 inline-block font-medium underline"
              href={`/reset-password?token=${encodeURIComponent(resetToken)}`}
            >
              Continue to reset page
            </Link>
          </div>
        ) : null}

        <button
          className="app-btn-primary h-11 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Please wait..." : "Send reset instructions"}
        </button>
      </form>

      <p className="mt-5 text-sm text-brand-navy/65">
        Back to{" "}
        <Link className="font-medium text-brand-navy underline" href="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
