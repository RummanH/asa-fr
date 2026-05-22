"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthPageShell } from "@/components/forms/auth-page-shell";
import { resetPassword } from "@/lib/api";
import { useToast } from "@/components/ui/toast-provider";

export default function ResetPasswordPage() {
  return (
    <AuthPageShell>
      <ResetPasswordForm />
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
    <div className="w-full max-w-md app-panel p-6 sm:p-8 shadow-[0_20px_55px_rgba(5,47,68,0.12)]">
      <h1 className="text-2xl font-semibold text-brand-navy">Reset Password</h1>
      <p className="mt-2 text-sm text-brand-navy/65">
        Enter your reset token and choose a new password.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-brand-navy/90" htmlFor="token">
            Reset Token
          </label>
          <input
            className="app-input"
            id="token"
            name="token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            minLength={32}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-brand-navy/90" htmlFor="newPassword">
            New Password
          </label>
          <input
            className="app-input"
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-brand-navy/90" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            className="app-input"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>

        <button
          className="app-btn-primary h-11 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Please wait..." : "Reset Password"}
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
