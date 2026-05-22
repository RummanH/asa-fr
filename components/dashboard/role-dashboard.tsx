"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ApiError,
  fetchInstitutionProfile,
  fetchTeacherProfile,
  type InstitutionProfile,
  type TeacherProfile,
} from "@/lib/api";
import { type UserRole } from "@/lib/auth";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";

type RoleDashboardProps = {
  role: UserRole;
  title: string;
};

export function RoleDashboard({ role, title }: RoleDashboardProps) {
  return (
    <RoleProtectedPage role={role} loadingLabel="Loading dashboard...">
      {({ user, accessToken, logoutAction, isLoggingOut }) => (
        <DashboardContent
          title={title}
          role={role}
          user={user}
          accessToken={accessToken}
          logoutAction={logoutAction}
          isLoggingOut={isLoggingOut}
        />
      )}
    </RoleProtectedPage>
  );
}

type DashboardContentProps = {
  title: string;
  role: UserRole;
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
  accessToken: string;
  logoutAction: () => Promise<void>;
  isLoggingOut: boolean;
};

function DashboardContent({
  title,
  role,
  user,
  accessToken,
  logoutAction,
  isLoggingOut,
}: DashboardContentProps) {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  const profilePath = role === "TEACHER" ? "/teacher/profile" : "/institution/profile";
  const jobsPath = role === "TEACHER" ? "/teacher/jobs" : "/institution/job-posts";
  const jobsLabel = role === "TEACHER" ? "Browse Jobs" : "Manage Job Posts";
  const messagesPath = role === "TEACHER" ? "/teacher/messages" : "/institution/messages";
  const changePasswordPath =
    role === "TEACHER" ? "/teacher/change-password" : "/institution/change-password";
  const hireRequestsPath =
    role === "TEACHER" ? "/teacher/hire-requests" : "/institution/hire-requests";
  const hireRequestsLabel =
    role === "TEACHER" ? "Received Requests" : "Sent Requests";
  const hiredTeachersPath = "/institution/hired-teachers";
  const teachersPath = "/institution/teachers";

  useEffect(() => {
    const request =
      role === "TEACHER"
        ? fetchTeacherProfile(accessToken)
        : fetchInstitutionProfile(accessToken);

    request
      .then((profile: TeacherProfile | InstitutionProfile) => {
        setIsProfileComplete(Boolean(profile.id));
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) {
          setIsProfileComplete(false);
          return;
        }

        setProfileError(error instanceof Error ? error.message : "Failed to load profile status");
      })
      .finally(() => {
        setIsCheckingProfile(false);
      });
  }, [accessToken, role]);

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-4xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-brand-navy">{title}</h1>
          <p className="mt-2 text-sm text-brand-navy/65">
            Manage your hiring workflow, profile, messages, and requests from one place.
          </p>
          <div className="mt-4">
            <p className="text-sm text-brand-navy/78">
              Profile status:{" "}
              {isCheckingProfile
                ? "Checking..."
                : isProfileComplete
                  ? "Completed"
                  : "Incomplete"}
            </p>
            {profileError ? (
              <p className="mt-1 text-sm text-red-700">Status check failed: {profileError}</p>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="app-btn-secondary"
              href={profilePath}
            >
              {isProfileComplete ? "Edit Profile" : "Create Profile"}
            </Link>
            <Link
              className="app-btn-secondary"
              href={jobsPath}
            >
              {jobsLabel}
            </Link>
            <Link
              className="app-btn-secondary"
              href={messagesPath}
            >
              Messages
            </Link>
            <Link
              className="app-btn-secondary"
              href={changePasswordPath}
            >
              Change Password
            </Link>
            <Link
              className="app-btn-secondary"
              href={hireRequestsPath}
            >
              {hireRequestsLabel}
            </Link>
            {role === "INSTITUTION" ? (
              <Link
                className="app-btn-secondary"
                href={teachersPath}
              >
                Browse Teachers
              </Link>
            ) : null}
            {role === "INSTITUTION" ? (
              <Link
                className="app-btn-secondary"
                href={hiredTeachersPath}
              >
                Hired Teachers
              </Link>
            ) : null}
            <button
              className="app-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => router.refresh()}
            >
              Refresh
            </button>
          </div>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand-navy">Logged in user</h2>
          <div className="mt-4 space-y-1 text-sm text-brand-navy/78">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
          <button
            className="mt-6 app-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={logoutAction}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </section>
      </div>
    </main>
  );
}

