"use client";

import { useRouter } from "next/navigation";
import { type ReactElement, useEffect, useState } from "react";
import {
  ApiError,
  fetchInstitutionProfile,
  fetchTeacherProfile,
  fetchActiveJobPosts,
  fetchInstitutionJobPosts,
  fetchConversations,
  fetchReceivedHireRequests,
  fetchSentHireRequests,
  type InstitutionProfile,
  type TeacherProfile,
} from "@/lib/api";
import { type UserRole } from "@/lib/auth";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { DashboardLayout } from "./dashboard-layout";
import { DashboardHeader, DashboardCard, DashboardGrid, StatBox, ActionButton } from "./dashboard-components";
import {
  Home,
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
    home: <Home size={18} strokeWidth={2} />,
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
  const [jobCount, setJobCount] = useState<number | undefined>();
  const [messageCount, setMessageCount] = useState<number | undefined>();
  const [requestCount, setRequestCount] = useState<number | undefined>();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

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

  useEffect(() => {
    setDashboardLoading(true);
    setDashboardError("");

    const jobsRequest = role === "TEACHER" ? fetchActiveJobPosts(accessToken) : fetchInstitutionJobPosts(accessToken);
    const messagesRequest = fetchConversations(accessToken);
    const requestsRequest = role === "TEACHER" ? fetchReceivedHireRequests(accessToken) : fetchSentHireRequests(accessToken);

    Promise.allSettled([jobsRequest, messagesRequest, requestsRequest]).then(([jobsResult, messagesResult, requestsResult]) => {
      if (jobsResult.status === "fulfilled") {
        setJobCount(jobsResult.value.length);
      }
      if (messagesResult.status === "fulfilled") {
        setMessageCount(messagesResult.value.length);
      }
      if (requestsResult.status === "fulfilled") {
        setRequestCount(requestsResult.value.length);
      }

      if (jobsResult.status === "rejected" || messagesResult.status === "rejected" || requestsResult.status === "rejected") {
        setDashboardError("Unable to refresh some dashboard metrics. Try again in a moment.");
      }
    }).finally(() => {
      setDashboardLoading(false);
    });
  }, [accessToken, role]);

  const dashboardNavItem = {
    href: role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard",
    label: "Dashboard",
    icon: <NavIcon path="home" />,
    isActive: true,
  };

  return (
    <DashboardLayout
      navItems={[dashboardNavItem, ...navItems]}
      userName={user.name}
      userEmail={user.email}
      userRole={role}
      settingsHref={profilePath}
      onLogout={logoutAction}
      isLoggingOut={isLoggingOut}
    >
      <div className="space-y-8">
        <DashboardHeader
          title={title}
          subtitle={
            role === "TEACHER"
              ? "A modern dashboard for teachers: fast access to jobs, messages, and requests."
              : "A single place to run your institution hiring workflow with confidence."
          }
          badge={profileStatus === "checking" ? "Checking…" : profileStatus === "complete" ? "Profile Ready" : "Profile Incomplete"}
          badgeColor={profileStatus === "complete" ? "emerald" : profileStatus === "checking" ? "gold" : "red"}
          action={
            <div className="flex flex-wrap items-center gap-3">
              <a href={messagesPath} className="inline-flex items-center rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-navy/20 hover:bg-brand-teal transition duration-200">
                View messages
              </a>
              <a href={jobsPath} className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition duration-200">
                Browse jobs
              </a>
            </div>
          }
        />

        {dashboardError && (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {dashboardError}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <DashboardCard
            title="Daily overview"
            description={
              role === "TEACHER"
                ? "See the most important metrics for your teaching career and keep your next steps front of mind."
                : "Track your hiring health, review requests, and keep the institution pipeline moving without friction."
            }
            highlight
          >
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                <p className="text-sm text-slate-700">
                  {isProfileComplete
                    ? "Your profile is ready to attract interest from institutions and employers."
                    : "Complete your profile now to start matching with the best job opportunities."
                  }
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Open opportunities</p>
                    <p className="mt-3 text-3xl font-semibold text-brand-ink">{dashboardLoading ? "…" : jobCount ?? 0}</p>
                    <p className="mt-2 text-xs text-slate-500">Jobs currently available for you.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Conversations</p>
                    <p className="mt-3 text-3xl font-semibold text-brand-ink">{dashboardLoading ? "…" : messageCount ?? 0}</p>
                    <p className="mt-2 text-xs text-slate-500">Active chats waiting your response.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Requests</p>
                    <p className="mt-3 text-3xl font-semibold text-brand-ink">{dashboardLoading ? "…" : requestCount ?? 0}</p>
                    <p className="mt-2 text-xs text-slate-500">Pending actions in your queue.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <StatBox
                  label={role === "TEACHER" ? "Latest opportunities" : "Published posts"}
                  value={dashboardLoading ? "…" : jobCount ?? 0}
                  icon="📋"
                  color="teal"
                />
                <StatBox
                  label="Unread messages"
                  value={dashboardLoading ? "…" : messageCount ?? 0}
                  icon="💬"
                  color="sky"
                />
                <StatBox
                  label={role === "TEACHER" ? "Hire requests" : "Pending reviews"}
                  value={dashboardLoading ? "…" : requestCount ?? 0}
                  icon="👥"
                  color="gold"
                />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Next steps" description="Quick actions designed to keep your hiring workflow moving fast.">
            <div className="space-y-6">
              <div className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-brand-ink">Recommended actions</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-teal" />
                    {isProfileComplete ? "Keep your profile fresh with new teaching preferences." : "Complete your profile to unlock matching and applications."}
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-sky" />
                    {role === "TEACHER" ? "Reply quickly to recent messages for better response rates." : "Review incoming teacher requests and confirm the best fit."}
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-gold" />
                    {dashboardLoading ? "Refreshing metrics…" : `${dashboardError ? "Check your dashboard for issues." : "Your metrics are up to date."}`}
                  </li>
                </ul>
              </div>

              <div className="grid gap-3">
                <ActionButton href={messagesPath} variant="primary" fullWidth>
                  View messages
                </ActionButton>
                <ActionButton href={jobsPath} variant="secondary" fullWidth>
                  {jobsLabel}
                </ActionButton>
                <ActionButton onClick={() => router.refresh()} variant="outline" fullWidth>
                  Refresh dashboard
                </ActionButton>
              </div>
            </div>
          </DashboardCard>
        </div>

        <DashboardGrid columns={3}>
          <DashboardCard title="Open opportunities" description="The latest matching roles you can review right now.">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-600">
                {role === "TEACHER"
                  ? "Explore the newest teaching jobs and send applications that stand out."
                  : "See how many positions are currently live for your institution."
                }
              </p>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-4xl font-bold text-brand-ink">{dashboardLoading ? "…" : jobCount ?? 0}</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Messages" description="Conversations that need your attention today.">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-600">
                Stay on top of the most recent chats so you never miss a hiring opportunity.
              </p>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-4xl font-bold text-brand-ink">{dashboardLoading ? "…" : messageCount ?? 0}</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Requests" description="Pending actions waiting for your response.">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-600">
                {role === "TEACHER"
                  ? "Review incoming hire invitations and accept the best matches."
                  : "Approve the most relevant teacher requests quickly."
                }
              </p>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-4xl font-bold text-brand-ink">{dashboardLoading ? "…" : requestCount ?? 0}</p>
              </div>
            </div>
          </DashboardCard>
        </DashboardGrid>
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
