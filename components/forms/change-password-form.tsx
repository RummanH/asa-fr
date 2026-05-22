"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { changePassword } from "@/lib/api";
import type { UserRole } from "@/lib/auth";
import { useToast } from "@/components/ui/toast-provider";

type ChangePasswordFormProps = {
  role: UserRole;
};

export function ChangePasswordForm({ role }: ChangePasswordFormProps) {
  const dashboardPath = role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard";

  return (
    <RoleProtectedPage role={role} loadingLabel="Loading change password form...">
      {({ accessToken }) => (
        <ChangePasswordFormContent accessToken={accessToken} dashboardPath={dashboardPath} />
      )}
    </RoleProtectedPage>
  );
}

type ChangePasswordFormContentProps = {
  accessToken: string;
  dashboardPath: string;
};

function ChangePasswordFormContent({
  accessToken,
  dashboardPath,
}: ChangePasswordFormContentProps) {
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
      const response = await changePassword(accessToken, {
        currentPassword,
        newPassword,
      });

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
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-brand-navy">Change Password</h1>
            <Link
              className="app-btn-secondary"
              href={dashboardPath}
            >
              Back to Dashboard
            </Link>
          </div>
          <p className="mt-2 text-sm text-brand-navy/65">
            Update your account password securely.
          </p>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-brand-navy/90" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                className={inputClassName}
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-brand-navy/90" htmlFor="newPassword">
                New Password
              </label>
              <input
                className={inputClassName}
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
              <label className="text-sm font-medium text-brand-navy/90" htmlFor="confirmNewPassword">
                Confirm New Password
              </label>
              <input
                className={inputClassName}
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            <button
              className="app-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

const inputClassName =
  "app-input";

