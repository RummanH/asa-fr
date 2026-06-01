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
        title="Forgot password?"
        subtitle="Enter your email address and we’ll send a secure reset link right away."
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
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/95 p-6 shadow-[0_20px_55px_rgba(5,47,68,0.12)] sm:p-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-brand-navy">Reset your password</h2>
        <p className="text-sm leading-6 text-slate-600">
          We’ll email you a link to reset your password securely. If you don’t see it, check your spam folder.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="email">
            Email address
          </label>
          <input
            className="app-input"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        {resetToken ? (
          <div className="rounded-3xl border border-brand-gold/20 bg-brand-gold/10 p-4 text-sm text-brand-navy">
            <p className="font-semibold">Reset token ready</p>
            <p className="mt-2 text-sm leading-6 text-slate-700 break-all">{resetToken}</p>
            <Link
              href={`/reset-password?token=${encodeURIComponent(resetToken)}`}
              className="mt-3 inline-flex text-sm font-semibold text-brand-teal hover:text-brand-navy"
            >
              Continue to reset page →
            </Link>
          </div>
        ) : null}

        <button
          className="app-btn-primary h-11 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Remembered your password?{' '}
        <Link className="font-semibold text-brand-teal hover:text-brand-navy" href="/login">
          Sign in instead
        </Link>
      </p>
    </div>
  );
}
