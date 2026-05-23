"use client";

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
import { DashboardLayout } from "./dashboard-layout";
import { DashboardHeader, DashboardCard, DashboardGrid, StatBox } from "./dashboard-components";
import {
  Briefcase,
  Mail,
  Lock,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
} from "lucide-react";

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
  const icons: Record<string, React.ReactNode> = {
    profile: <Briefcase size={18} strokeWidth={2} />,
    jobs: <Zap size={18} strokeWidth={2} />,
    messages: <Mail size={18} strokeWidth={2} />,
    password: <Lock size={18} strokeWidth={2} />,
    requests: <Users size={18} strokeWidth={2} />,
    teachers: <Users size={18} strokeWidth={2} />,
    hired: <CheckCircle2 size={18} strokeWidth={2} />,
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

  const navItems = [
    {
      href: profilePath,
      label: isProfileComplete ? "Edit Profile" : "Create Profile",
      icon: <NavIcon path="profile" />,
      isHighlight: !isProfileComplete,
      isActive: false,
    },
    { href: jobsPath, label: jobsLabel, icon: <NavIcon path="jobs" />, isActive: false },
    { href: messagesPath, label: "Messages", icon: <NavIcon path="messages" />, isActive: false },
    { href: changePasswordPath, label: "Change Password", icon: <NavIcon path="password" />, isActive: false },
    { href: hireRequestsPath, label: hireRequestsLabel, icon: <NavIcon path="requests" />, isActive: false },
    ...(role === "INSTITUTION"
      ? [
          { href: "/institution/teachers", label: "Browse Teachers", icon: <NavIcon path="teachers" />, isActive: false },
          { href: "/institution/hired-teachers", label: "Hired Teachers", icon: <NavIcon path="hired" />, isActive: false },
        ]
      : []),
  ];

  const profileStatus = isCheckingProfile ? "checking" : isProfileComplete ? "complete" : "incomplete";

  return (
    <DashboardLayout
      navItems={navItems}
      userName={user.name}
      userEmail={user.email}
      userRole={role}
      onLogout={logoutAction}
      isLoggingOut={isLoggingOut}
    >
      {/* Dashboard header */}
      <div className="mb-8">
        <DashboardHeader
          title={title}
          subtitle="Manage your hiring workflow, profile, and messages all in one place"
          badge={profileStatus === "checking" ? "Checking…" : profileStatus === "complete" ? "Profile Ready" : "Incomplete"}
          badgeColor={profileStatus === "complete" ? "emerald" : profileStatus === "checking" ? "gold" : "red"}
        />

        {profileError && (
          <div className="mt-4 flex gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Error loading profile</p>
              <p className="text-xs mt-1">{profileError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats section */}
      <DashboardGrid columns={role === "TEACHER" ? 2 : 3}>
        <StatBox
          label={role === "TEACHER" ? "Applied Jobs" : "Posted Positions"}
          value="0"
          icon="📋"
          color="teal"
        />
        <StatBox
          label="Messages"
          value="0"
          icon="💬"
          color="sky"
        />
        {role === "INSTITUTION" && (
          <StatBox
            label="Active Applicants"
            value="0"
            icon="👥"
            color="gold"
          />
        )}
      </DashboardGrid>

      {/* Quick actions section */}
      <div className="mt-10">
        <DashboardCard
          title="Quick Actions"
          description={
            role === "TEACHER"
              ? "Start your journey by completing your profile and browsing available positions"
              : "Begin hiring by creating job posts and connecting with qualified teachers"
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickActionButton
              href={profilePath}
              label={isProfileComplete ? "Edit Profile" : "Create Profile"}
              icon={<Briefcase size={20} />}
              highlight={!isProfileComplete}
            />
            <QuickActionButton
              href={jobsPath}
              label={jobsLabel}
              icon={<Zap size={20} />}
            />
            <QuickActionButton
              href={messagesPath}
              label="Messages"
              icon={<Mail size={20} />}
            />
            <QuickActionButton
              onClick={() => router.refresh()}
              label="Refresh"
              icon={<RefreshCw size={20} />}
            />
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}

function QuickActionButton({
  href,
  onClick,
  label,
  icon,
  highlight = false,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  const baseClasses = `flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-center transition-all duration-200 font-semibold text-sm ${
    highlight
      ? "bg-brand-teal/15 text-brand-teal border border-brand-teal/30 hover:bg-brand-teal/25 hover:border-brand-teal/50"
      : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:border-slate-300"
  }`;

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        <span className="text-2xl">{icon}</span>
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      <span className="text-2xl">{icon}</span>
      {label}
    </button>
  );
}
