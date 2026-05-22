"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement, useEffect, useState } from "react";
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
  user: { name: string; email: string; role: UserRole };
  accessToken: string;
  logoutAction: () => Promise<void>;
  isLoggingOut: boolean;
};

const NavIcon = ({ path }: { path: string }) => {
  const icons: Record<string, ReactElement> = {
    profile: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    jobs: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    messages: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    password: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    requests: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    teachers: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    hired: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  };
  return icons[path] ?? null;
};

function DashboardContent({ title, role, user, accessToken, logoutAction, isLoggingOut }: DashboardContentProps) {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");

  const profilePath = role === "TEACHER" ? "/teacher/profile" : "/institution/profile";
  const jobsPath = role === "TEACHER" ? "/teacher/jobs" : "/institution/job-posts";
  const jobsLabel = role === "TEACHER" ? "Browse Jobs" : "Manage Job Posts";
  const messagesPath = role === "TEACHER" ? "/teacher/messages" : "/institution/messages";
  const changePasswordPath = role === "TEACHER" ? "/teacher/change-password" : "/institution/change-password";
  const hireRequestsPath = role === "TEACHER" ? "/teacher/hire-requests" : "/institution/hire-requests";
  const hireRequestsLabel = role === "TEACHER" ? "Received Requests" : "Sent Requests";

  useEffect(() => {
    const request = role === "TEACHER" ? fetchTeacherProfile(accessToken) : fetchInstitutionProfile(accessToken);

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
      .finally(() => setIsCheckingProfile(false));
  }, [accessToken, role]);

  const navLinks = [
    {
      href: profilePath,
      label: isProfileComplete ? "Edit Profile" : "Create Profile",
      icon: "profile",
      highlight: !isProfileComplete,
    },
    { href: jobsPath, label: jobsLabel, icon: "jobs" },
    { href: messagesPath, label: "Messages", icon: "messages" },
    { href: changePasswordPath, label: "Change Password", icon: "password" },
    { href: hireRequestsPath, label: hireRequestsLabel, icon: "requests" },
    ...(role === "INSTITUTION"
      ? [
          { href: "/institution/teachers", label: "Browse Teachers", icon: "teachers" },
          { href: "/institution/hired-teachers", label: "Hired Teachers", icon: "hired" },
        ]
      : []),
  ];

  const profileStatusColor = isCheckingProfile
    ? "bg-amber-100 text-amber-700"
    : isProfileComplete
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-600";

  const profileStatusDot = isCheckingProfile
    ? "bg-amber-400 animate-pulse"
    : isProfileComplete
      ? "bg-emerald-500"
      : "bg-red-500";

  const profileStatusText = isCheckingProfile ? "Checking…" : isProfileComplete ? "Complete" : "Incomplete";

  return (
    <main className="app-shell min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="app-container space-y-5">
        {/* Header card */}
        <div className="app-panel overflow-hidden">
          {/* Top accent bar */}
          <div
            className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, #052f44 0%, #075f75 50%, #a9d3ef 100%)" }}
          />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="app-chip bg-brand-light text-brand-teal border border-brand-sky/40 text-[0.7rem] uppercase tracking-widest">
                    {role === "TEACHER" ? "Teacher" : "Institution"}
                  </span>
                </div>
                <h1 className="app-title text-2xl sm:text-3xl">{title}</h1>
                <p className="app-subtitle mt-1 text-sm">
                  Manage your hiring workflow, profile, messages, and requests.
                </p>
              </div>

              {/* Profile status badge */}
              <div
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${profileStatusColor}`}
              >
                <span className={`h-2 w-2 rounded-full ${profileStatusDot}`} />
                Profile {profileStatusText}
              </div>
            </div>

            {profileError && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 border border-red-100">
                {profileError}
              </p>
            )}

            {/* Nav grid */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {navLinks.map(({ href, label, icon, highlight }) => (
                <Link
                  key={href}
                  href={href}
                  className={`group relative flex flex-col items-start gap-2.5 rounded-xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    highlight
                      ? "border-brand-teal/30 bg-brand-teal/5 hover:border-brand-teal/50 hover:bg-brand-teal/10"
                      : "border-border bg-white hover:border-brand-sky hover:bg-brand-light/60"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                      highlight
                        ? "bg-brand-teal/15 text-brand-teal"
                        : "bg-brand-light text-brand-teal group-hover:bg-brand-sky/40"
                    }`}
                  >
                    <NavIcon path={icon} />
                  </span>
                  <span
                    className={`text-xs font-semibold leading-tight ${
                      highlight ? "text-brand-teal" : "text-brand-navy"
                    }`}
                  >
                    {label}
                  </span>
                  {highlight && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-teal" />}
                </Link>
              ))}

              {/* Refresh tile */}
              <button
                type="button"
                onClick={() => router.refresh()}
                className="group flex flex-col items-start gap-2.5 rounded-xl border border-border bg-white p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-sky hover:bg-brand-light/60 hover:shadow-md"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-light text-brand-teal group-hover:bg-brand-sky/40 transition-colors">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </span>
                <span className="text-xs font-semibold leading-tight text-brand-navy">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* User card */}
        <div className="app-panel overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, #052f44, #075f75)" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="app-title text-base">{user.name}</p>
                  <p className="text-xs text-brand-navy/55 mt-0.5">{user.email}</p>
                  <span className="mt-1 inline-flex items-center rounded-md bg-brand-light px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-brand-teal border border-brand-sky/30">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={logoutAction}
                disabled={isLoggingOut}
                className="app-btn-danger shrink-0 gap-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Logging out…
                  </>
                ) : (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
