"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthPageShell from "@/components/forms/auth-page-shell";
import { AuthLayout } from "@/components/forms/auth-layout";
import { resetPassword } from "@/lib/api";
import { useToast } from "@/components/ui/toast-provider";

export default function ResetPasswordPage() {
  return (
    <AuthPageShell>
      <AuthLayout
        title="Reset your password"
        subtitle="Paste your reset token and choose a strong new password to regain access."
      >
        <ResetPasswordForm />
      </AuthLayout>
    </AuthPageShell>
  );
}

function ResetPasswordForm() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(() => searchParams.get("token") ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("New password and confirmation do not match", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword({
        token: token.trim(),
        newPassword,
      });
      showToast(response.message, "success");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to reset password", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/95 p-6 shadow-[0_20px_55px_rgba(5,47,68,0.12)] sm:p-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-brand-navy">Reset your password</h2>
        <p className="text-sm leading-6 text-slate-600">
          Use the token sent to your email and set a fresh password that’s secure and easy to remember.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="token">
            Reset token
          </label>
          <input
            className="app-input"
            id="token"
            name="token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            minLength={32}
            placeholder="Enter reset token"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="newPassword">
            New password
          </label>
          <input
            className="app-input"
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            placeholder="At least 8 characters"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="confirmPassword">
            Confirm new password
          </label>
          <input
            className="app-input"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            placeholder="Repeat your password"
            required
          />
        </div>

        <button
          className="app-btn-primary h-11 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Resetting…" : "Reset password"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Need a new token?{' '}
        <Link className="font-semibold text-brand-teal hover:text-brand-navy" href="/forgot-password">
          Request another reset link
        </Link>
      </p>
    </div>
  );
}
