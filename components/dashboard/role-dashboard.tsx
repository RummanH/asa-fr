"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Home,
  Lock,
  Mail,
  RefreshCcw,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import {
  ApiError,
  fetchActiveJobPosts,
  fetchConversations,
  fetchInstitutionJobPosts,
  fetchInstitutionProfile,
  fetchReceivedHireRequests,
  fetchSentHireRequests,
  fetchTeacherProfile,
  type InstitutionProfile,
  type TeacherProfile,
} from "@/lib/api";
import { type UserRole } from "@/lib/auth";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { DistributionChartCard, MetricChartCard } from "@/components/dashboard/dashboard-charts";
import { DashboardLayout } from "./dashboard-layout";

type RoleDashboardProps = {
  role: UserRole;
  title: string;
};

type DashboardMetricState = {
  jobCount?: number;
  messageCount?: number;
  requestCount?: number;
  loading: boolean;
  error: string;
};

type DashboardContentProps = {
  title: string;
  role: UserRole;
  user: { name: string; email: string; role: UserRole };
  accessToken: string;
  logoutAction: () => Promise<void>;
  isLoggingOut: boolean;
};

function NavIcon({ icon }: { icon: React.ReactNode }) {
  return <span className="text-[18px]">{icon}</span>;
}

function useDashboardData(accessToken: string, role: UserRole) {
  const [refreshTick, setRefreshTick] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [metrics, setMetrics] = useState<DashboardMetricState>({
    jobCount: undefined,
    messageCount: undefined,
    requestCount: undefined,
    loading: true,
    error: "",
  });

  const loadProfile = useCallback(async () => {
    try {
      const profile =
        role === "TEACHER" ? await fetchTeacherProfile(accessToken) : await fetchInstitutionProfile(accessToken);
      setIsProfileComplete(Boolean((profile as TeacherProfile | InstitutionProfile).id));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setIsProfileComplete(false);
      } else {
        setProfileError(error instanceof Error ? error.message : "Failed to load profile status");
      }
    } finally {
      setIsCheckingProfile(false);
    }
  }, [accessToken, role]);

  const loadMetrics = useCallback(async () => {
    const jobsRequest = role === "TEACHER" ? fetchActiveJobPosts(accessToken) : fetchInstitutionJobPosts(accessToken);
    const messagesRequest = fetchConversations(accessToken);
    const requestsRequest = role === "TEACHER" ? fetchReceivedHireRequests(accessToken) : fetchSentHireRequests(accessToken);

    const [jobsResult, messagesResult, requestsResult] = await Promise.allSettled([
      jobsRequest,
      messagesRequest,
      requestsRequest,
    ]);

    setMetrics({
      jobCount: jobsResult.status === "fulfilled" ? jobsResult.value.length : undefined,
      messageCount: messagesResult.status === "fulfilled" ? messagesResult.value.length : undefined,
      requestCount: requestsResult.status === "fulfilled" ? requestsResult.value.length : undefined,
      loading: false,
      error:
        jobsResult.status === "rejected" ||
        messagesResult.status === "rejected" ||
        requestsResult.status === "rejected"
          ? "Unable to refresh some dashboard metrics. Try again in a moment."
          : "",
    });
  }, [accessToken, role]);

  useEffect(() => {
    let active = true;

    async function run() {
      if (!active) return;
      await loadProfile();
      if (!active) return;
      await loadMetrics();
    }

    void run();

    return () => {
      active = false;
    };
  }, [loadMetrics, loadProfile, refreshTick]);

  function refresh() {
    setIsCheckingProfile(true);
    setProfileError("");
    setMetrics((current) => ({ ...current, loading: true, error: "" }));
    setRefreshTick((current) => current + 1);
  }

  return {
    isProfileComplete,
    isCheckingProfile,
    profileError,
    metrics,
    refresh,
  };
}

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

function DashboardContent({ title, role, user, accessToken, logoutAction, isLoggingOut }: DashboardContentProps) {
  const { isProfileComplete, isCheckingProfile, profileError, metrics, refresh } = useDashboardData(accessToken, role);
  const { jobCount, messageCount, requestCount, loading: dashboardLoading, error: dashboardError } = metrics;

  const profilePath = role === "TEACHER" ? "/teacher/profile" : "/institution/profile";
  const jobsPath = role === "TEACHER" ? "/teacher/jobs" : "/institution/job-posts";
  const jobsLabel = role === "TEACHER" ? "Browse Jobs" : "Manage Job Posts";
  const messagesPath = role === "TEACHER" ? "/teacher/messages" : "/institution/messages";
  const changePasswordPath = role === "TEACHER" ? "/teacher/change-password" : "/institution/change-password";
  const hireRequestsPath = role === "TEACHER" ? "/teacher/hire-requests" : "/institution/hire-requests";
  const hireRequestsLabel = role === "TEACHER" ? "Received Requests" : "Sent Requests";

  const navItems = [
    {
      href: role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard",
      label: "Dashboard",
      icon: <NavIcon icon={<Home size={18} strokeWidth={2} />} />,
      isActive: true,
    },
    {
      href: profilePath,
      label: isProfileComplete ? "Edit Profile" : "Create Profile",
      icon: <NavIcon icon={<UserRound size={18} strokeWidth={2} />} />,
      isHighlight: !isProfileComplete,
    },
    {
      href: jobsPath,
      label: jobsLabel,
      icon: <NavIcon icon={<BriefcaseBusiness size={18} strokeWidth={2} />} />,
    },
    {
      href: messagesPath,
      label: "Messages",
      icon: <NavIcon icon={<Mail size={18} strokeWidth={2} />} />,
    },
    {
      href: changePasswordPath,
      label: "Change Password",
      icon: <NavIcon icon={<Lock size={18} strokeWidth={2} />} />,
    },
    {
      href: hireRequestsPath,
      label: hireRequestsLabel,
      icon: <NavIcon icon={<Users size={18} strokeWidth={2} />} />,
    },
    ...(role === "INSTITUTION"
      ? [
          {
            href: "/institution/teachers",
            label: "Browse Teachers",
            icon: <NavIcon icon={<Users size={18} strokeWidth={2} />} />,
          },
          {
            href: "/institution/hired-teachers",
            label: "Hired Teachers",
            icon: <NavIcon icon={<CheckCircle2 size={18} strokeWidth={2} />} />,
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userName={user.name}
      userEmail={user.email}
      userRole={role}
      settingsHref={profilePath}
      onLogout={logoutAction}
      isLoggingOut={isLoggingOut}
    >
      {role === "TEACHER" ? (
        <TeacherDashboardView
          title={title}
          jobsPath={jobsPath}
          jobsLabel={jobsLabel}
          messagesPath={messagesPath}
          hireRequestsPath={hireRequestsPath}
          profilePath={profilePath}
          isProfileComplete={isProfileComplete}
          isCheckingProfile={isCheckingProfile}
          profileError={profileError}
          dashboardLoading={dashboardLoading}
          dashboardError={dashboardError}
          jobCount={jobCount}
          messageCount={messageCount}
          requestCount={requestCount}
          refresh={refresh}
          userName={user.name}
        />
      ) : (
        <InstitutionDashboardFallback
          title={title}
          jobsPath={jobsPath}
          jobsLabel={jobsLabel}
          messagesPath={messagesPath}
          hireRequestsPath={hireRequestsPath}
          profilePath={profilePath}
          isProfileComplete={isProfileComplete}
          isCheckingProfile={isCheckingProfile}
          dashboardLoading={dashboardLoading}
          dashboardError={dashboardError}
          jobCount={jobCount}
          messageCount={messageCount}
          requestCount={requestCount}
          refresh={refresh}
        />
      )}
    </DashboardLayout>
  );
}

type TeacherDashboardViewProps = {
  title: string;
  jobsPath: string;
  jobsLabel: string;
  messagesPath: string;
  hireRequestsPath: string;
  profilePath: string;
  isProfileComplete: boolean;
  isCheckingProfile: boolean;
  profileError: string;
  dashboardLoading: boolean;
  dashboardError: string;
  jobCount?: number;
  messageCount?: number;
  requestCount?: number;
  refresh: () => void;
  userName: string;
};

function TeacherDashboardView({
  title,
  jobsPath,
  jobsLabel,
  messagesPath,
  hireRequestsPath,
  profilePath,
  isProfileComplete,
  isCheckingProfile,
  profileError,
  dashboardLoading,
  dashboardError,
  jobCount = 0,
  messageCount = 0,
  requestCount = 0,
  refresh,
  userName,
}: TeacherDashboardViewProps) {
  const profileLabel = isCheckingProfile ? "Checking profile" : isProfileComplete ? "Profile ready" : "Profile incomplete";
  const totalVisibleWork = Math.max(jobCount + messageCount + requestCount, 1);
  const profileTone = isCheckingProfile
    ? "bg-amber-50 text-amber-700"
    : isProfileComplete
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";
  const profileDot = isCheckingProfile ? "bg-amber-500" : isProfileComplete ? "bg-emerald-500" : "bg-rose-500";

  const pipeline = [
    {
      label: "Open roles",
      value: jobCount,
      note: "Matching opportunities",
      color: "from-[#2f435d] to-[#3d5776]",
      fill: "bg-[#31465f]",
      href: jobsPath,
      icon: <BriefcaseBusiness size={18} strokeWidth={2} />,
    },
    {
      label: "Messages",
      value: messageCount,
      note: "Active conversations",
      color: "from-[#64caef] to-[#42b7e3]",
      fill: "bg-[#57c5eb]",
      href: messagesPath,
      icon: <Mail size={18} strokeWidth={2} />,
    },
    {
      label: "Requests",
      value: requestCount,
      note: "Pending hire actions",
      color: "from-[#f2cf77] to-[#f3b33d]",
      fill: "bg-[#efbf59]",
      href: hireRequestsPath,
      icon: <Users size={18} strokeWidth={2} />,
    },
  ];

  const shortcuts = [
    {
      title: isProfileComplete ? "Refine profile" : "Complete profile",
      description: isProfileComplete
        ? "Keep your teaching profile current so schools can evaluate you faster."
        : "Finish your profile to make job discovery and hiring requests meaningful.",
      href: profilePath,
      icon: <UserRound size={18} strokeWidth={2} />,
      tone: "bg-[#eef6ff] text-[#27415c]",
    },
    {
      title: "Reply to messages",
      description: "Fast responses improve conversion from interest to active hiring discussions.",
      href: messagesPath,
      icon: <Mail size={18} strokeWidth={2} />,
      tone: "bg-[#eefbf8] text-[#166660]",
    },
    {
      title: "Review requests",
      description: "Check incoming hire requests and move the strongest opportunities first.",
      href: hireRequestsPath,
      icon: <Users size={18} strokeWidth={2} />,
      tone: "bg-[#fff8e8] text-[#92661a]",
    },
  ];

  const dashboardSummary = [
    {
      label: "Roles",
      value: jobCount,
      valueClass: "text-brand-navy",
      cardClass: "border-slate-200 bg-white",
      labelClass: "text-slate-400",
    },
    {
      label: "Messages",
      value: messageCount,
      valueClass: "text-brand-sky",
      cardClass: "border-brand-sky/35 bg-brand-light",
      labelClass: "text-slate-400",
    },
    {
      label: "Requests",
      value: requestCount,
      valueClass: "text-[#ffe39a]",
      cardClass: "border-brand-gold/30 bg-brand-cream",
      labelClass: "text-slate-400",
    },
    {
      label: "Profile",
      value: isCheckingProfile ? "..." : isProfileComplete ? "Ready" : "Action",
      valueClass: isCheckingProfile ? "text-[#ffd57d]" : isProfileComplete ? "text-[#8df0bf]" : "text-[#ffb4b4]",
      cardClass: isCheckingProfile
        ? "border-brand-gold/30 bg-brand-cream"
        : isProfileComplete
          ? "border-emerald-300/30 bg-emerald-50"
          : "border-rose-300/30 bg-rose-50",
      labelClass: "text-slate-400",
    },
  ];

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-4 py-4 shadow-[0_12px_30px_rgba(17,34,68,0.06)] sm:rounded-[28px] sm:px-6 sm:py-5 sm:shadow-[0_18px_44px_rgba(17,34,68,0.08)]">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)] xl:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-sky/40 bg-brand-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-navy/70">
                <Sparkles size={14} className="text-brand-teal" />
                Teacher workspace
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${profileTone}`}>
                <span className={`h-2 w-2 rounded-full ${profileDot}`} />
                {profileLabel}
              </span>
            </div>
            <h1 className="mt-3 font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-brand-navy sm:text-[2.7rem]">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[14px]">Track roles, messages, requests, and profile status.</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link
                href={jobsPath}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[16px] bg-brand-navy px-4 text-sm font-semibold text-white transition hover:bg-brand-teal"
              >
                {jobsLabel}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={messagesPath}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[16px] border border-brand-sky/35 bg-brand-light px-4 text-sm font-semibold text-brand-navy transition hover:bg-white"
              >
                View messages
              </Link>
              <button
                onClick={refresh}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[16px] border border-brand-sky/35 bg-white px-4 text-sm font-semibold text-brand-navy transition hover:bg-brand-light"
              >
                <RefreshCcw size={16} className={dashboardLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-200/80 bg-white p-3 shadow-[0_10px_24px_rgba(17,34,68,0.05)] sm:rounded-[24px] sm:shadow-[0_12px_32px_rgba(17,34,68,0.06)]">
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-2">
            {dashboardSummary.map((item) => (
              <div
                key={item.label}
                className={`rounded-[20px] border px-4 py-3.5 ${item.cardClass}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${item.labelClass}`}>{item.label}</p>
                <p
                  className={`mt-2.5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight ${item.valueClass}`}
                >
                  {dashboardLoading && item.label !== "Profile" ? "..." : item.value}
                </p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {dashboardError || profileError ? (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {dashboardError || profileError}
        </div>
      ) : null}

      <section className="grid gap-3 xl:grid-cols-[1.25fr_0.9fr]">
        <MetricChartCard
          title="Activity chart"
          totalLabel="Current visible work"
          totalValue={dashboardLoading ? "..." : totalVisibleWork}
          labels={["Roles", "Messages", "Requests"]}
          values={[jobCount, messageCount, requestCount]}
          colors={["#102033", "#0b8f88", "#f3b33d"]}
        />
        <DistributionChartCard
          title="Profile mix"
          labels={["Ready", "Needs work", "Requests", "Messages"]}
          values={[
            isProfileComplete ? 1 : 0,
            isProfileComplete ? 0 : 1,
            Math.max(requestCount, 0),
            Math.max(messageCount, 0),
          ]}
          colors={["#15a36f", "#ef6a5b", "#f3b33d", "#0b8f88"]}
        />
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[1.55fr_0.9fr]">
        <div className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_12px_30px_rgba(17,34,68,0.06)] sm:rounded-[26px] sm:p-5.5 sm:shadow-[0_18px_44px_rgba(17,34,68,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Activity snapshot</p>
              <h2 className="mt-2 font-[family:var(--font-display)] text-[1.9rem] font-semibold tracking-tight text-[#31455f]">
                Pipeline overview
              </h2>
            </div>
            <span className="rounded-full bg-[#eef4fa] px-3 py-1 text-xs font-medium text-slate-500">
              {dashboardLoading ? "Updating metrics" : `${totalVisibleWork} visible items`}
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[22px] bg-[linear-gradient(180deg,#f8fbff_0%,#f2f7fb_100%)] p-4">
              <div className="space-y-3">
                {pipeline.slice(1).map((item) => {
                  const width = Math.max(8, Math.round((item.value / totalVisibleWork) * 100));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group block rounded-[18px] border border-white bg-white/88 p-4 shadow-[0_12px_28px_rgba(17,34,68,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(17,34,68,0.08)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br ${item.color} text-white`}>
                            {item.icon}
                          </div>
                          <p className="mt-3 text-sm font-semibold text-[#31455f]">{item.label}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-400">{item.note}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-[family:var(--font-display)] text-[1.9rem] font-semibold tracking-tight text-[#31455f]">
                            {dashboardLoading ? "..." : item.value}
                          </p>
                          <p className="text-xs font-medium text-slate-400">Live</p>
                        </div>
                      </div>

                      <div className="mt-3.5">
                        <div className="h-2.5 rounded-full bg-slate-100">
                          <div
                            className={`h-2.5 rounded-full ${item.fill} transition-all duration-300 group-hover:opacity-85`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 rounded-[20px] border border-slate-200 bg-white px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Execution note</p>
                    <p className="mt-2 text-lg font-semibold text-[#31455f]">Best next move</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${profileTone}`}>{profileLabel}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-500">Keep profile, messages, and requests current.</p>
              </div>

              <div className="mt-4 rounded-[20px] border border-slate-200 bg-white px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Response rhythm</p>
                    <p className="mt-2 text-lg font-semibold text-[#31455f]">Where attention should go now</p>
                  </div>
                  <span className="rounded-full bg-[#eef4fa] px-3 py-1 text-xs font-semibold text-slate-500">
                    Live
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] bg-[linear-gradient(135deg,#f7fbff_0%,#eef8fd_100%)] px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Messages</p>
                    <p className="mt-2 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#31455f]">
                      {dashboardLoading ? "..." : messageCount}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Reply quickly.</p>
                  </div>

                  <div className="rounded-[18px] bg-[linear-gradient(135deg,#fffaf0_0%,#fff5dc_100%)] px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Requests</p>
                    <p className="mt-2 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#31455f]">
                      {dashboardLoading ? "..." : requestCount}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Review early.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-[22px] bg-[#f7faff] p-4">
                <div className="space-y-2.5">
                  {shortcuts.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex items-start gap-3 rounded-[16px] border border-white bg-white px-4 py-3.5 shadow-[0_12px_24px_rgba(17,34,68,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(17,34,68,0.08)]"
                    >
                      <span className={`mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[15px] ${item.tone}`}>
                        {item.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-[#31455f]">{item.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-slate-500">{item.description}</span>
                      </span>
                      <ArrowRight size={16} className="mt-1 flex-shrink-0 text-slate-300 transition group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>

              <DashboardMiniPanel title="Profile readiness" eyebrow="Profile">
                <div className="space-y-4">
                  <div className="rounded-[22px] bg-[linear-gradient(135deg,#f5fbfd_0%,#eef6ff_100%)] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Current status</p>
                    <p className="mt-3 font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-[#31455f]">
                      {isCheckingProfile ? "..." : isProfileComplete ? "Ready" : "Needs work"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {isProfileComplete ? "Your profile is ready." : "Complete the missing fields."}
                    </p>
                  </div>
                  <Link
                    href={profilePath}
                    className="inline-flex min-h-11 w-full items-center justify-between rounded-[18px] border border-slate-200 bg-[#fbfdff] px-4 text-sm font-semibold text-[#31455f] transition hover:bg-slate-50"
                  >
                    {isProfileComplete ? "Open profile" : "Complete profile"}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </DashboardMiniPanel>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <DashboardMiniPanel title="Priority board" eyebrow="Action center">
            <div className="space-y-3">
              <PriorityRow
                label={isProfileComplete ? "Profile is live" : "Profile setup needed"}
                value={isProfileComplete ? "Ready" : "Pending"}
                tone={isProfileComplete ? "emerald" : "rose"}
              />
              <PriorityRow
                label="Message queue"
                value={dashboardLoading ? "..." : `${messageCount} threads`}
                tone="sky"
              />
              <PriorityRow
                label="Hiring queue"
                value={dashboardLoading ? "..." : `${requestCount} requests`}
                tone="gold"
              />
              <PriorityRow
                label="Job market"
                value={dashboardLoading ? "..." : `${jobCount} roles`}
                tone="slate"
              />
            </div>
          </DashboardMiniPanel>

          <DashboardMiniPanel title="Quick access" eyebrow="Routes">
            <div className="grid gap-3">
              <RouteLink href={profilePath} label="Profile" detail="Teaching details and account setup" />
              <RouteLink href={jobsPath} label="Jobs" detail="Review current opportunities" />
              <RouteLink href={messagesPath} label="Messages" detail="Continue active conversations" />
              <RouteLink href={hireRequestsPath} label="Hire requests" detail="Respond to institution interest" />
            </div>
          </DashboardMiniPanel>

          <DashboardMiniPanel title="Workspace status" eyebrow="Summary">
            <div className="space-y-4">
              <div className="rounded-[20px] bg-[#f7faff] p-4">
                <p className="text-sm font-medium text-slate-500">Signed in as</p>
                <p className="mt-2 text-lg font-semibold text-[#31455f]">{userName}</p>
              </div>
              <div className="rounded-[20px] border border-dashed border-slate-200 p-4">
                <p className="text-sm text-slate-500">
                  {dashboardLoading ? "Refreshing metrics." : dashboardError ? "Some metrics are unavailable." : "All metrics available."}
                </p>
              </div>
            </div>
          </DashboardMiniPanel>
        </div>
      </section>

      <section className="grid items-start gap-3 xl:grid-cols-2">
        <DashboardMiniPanel title="Inbox activity" eyebrow="Messages">
          <div className="space-y-4">
            <div className="rounded-[22px] bg-[linear-gradient(135deg,#f7fbff_0%,#eef8fd_100%)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Active threads</p>
              <p className="mt-3 font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-[#31455f]">
                {dashboardLoading ? "..." : messageCount}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Keep conversations moving.</p>
            </div>
            <Link
              href={messagesPath}
              className="inline-flex min-h-11 w-full items-center justify-between rounded-[18px] border border-slate-200 bg-[#fbfdff] px-4 text-sm font-semibold text-[#31455f] transition hover:bg-slate-50"
            >
              Open inbox
              <ArrowRight size={16} />
            </Link>
          </div>
        </DashboardMiniPanel>

        <DashboardMiniPanel title="Request queue" eyebrow="Hiring">
          <div className="space-y-4">
            <div className="rounded-[22px] bg-[linear-gradient(135deg,#fffaf0_0%,#fff5dc_100%)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Pending requests</p>
              <p className="mt-3 font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-[#31455f]">
                {dashboardLoading ? "..." : requestCount}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Review and decide early.</p>
            </div>
            <Link
              href={hireRequestsPath}
              className="inline-flex min-h-11 w-full items-center justify-between rounded-[18px] border border-slate-200 bg-[#fbfdff] px-4 text-sm font-semibold text-[#31455f] transition hover:bg-slate-50"
            >
              Review requests
              <ArrowRight size={16} />
            </Link>
          </div>
        </DashboardMiniPanel>
      </section>
    </div>
  );
}

type InstitutionDashboardFallbackProps = {
  title: string;
  jobsPath: string;
  jobsLabel: string;
  messagesPath: string;
  hireRequestsPath: string;
  profilePath: string;
  isProfileComplete: boolean;
  isCheckingProfile: boolean;
  dashboardLoading: boolean;
  dashboardError: string;
  jobCount?: number;
  messageCount?: number;
  requestCount?: number;
  refresh: () => void;
};

function InstitutionDashboardFallback({
  title,
  jobsPath,
  jobsLabel,
  messagesPath,
  hireRequestsPath,
  profilePath,
  isProfileComplete,
  isCheckingProfile,
  dashboardLoading,
  dashboardError,
  jobCount = 0,
  messageCount = 0,
  requestCount = 0,
  refresh,
}: InstitutionDashboardFallbackProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_44px_rgba(17,34,68,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Institution dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#31455f]">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">Manage posts, messages, requests, and profile status.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={jobsPath}
              className="inline-flex min-h-12 items-center justify-center rounded-[18px] bg-[#31465f] px-4 text-sm font-semibold text-white transition hover:bg-[#25384f]"
            >
              {jobsLabel}
            </Link>
            <button
              onClick={refresh}
              className="inline-flex min-h-12 items-center justify-center rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>
      </section>

      {dashboardError ? (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {dashboardError}
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-4">
        <MetricCard
          label="Published posts"
          value={jobCount}
          loading={dashboardLoading}
          detail="Current job posts"
          icon={<BriefcaseBusiness size={20} strokeWidth={2} />}
          accent="bg-[#31465f]"
        />
        <MetricCard
          label="Conversations"
          value={messageCount}
          loading={dashboardLoading}
          detail="Active conversations"
          icon={<Mail size={20} strokeWidth={2} />}
          accent="bg-[#57c5eb]"
        />
        <MetricCard
          label="Sent requests"
          value={requestCount}
          loading={dashboardLoading}
          detail="Active requests"
          icon={<Users size={20} strokeWidth={2} />}
          accent="bg-[#efbf59]"
        />
        <MetricCard
          label="Profile"
          value={isCheckingProfile ? "..." : isProfileComplete ? "Ready" : "Action"}
          loading={false}
          detail="Profile status"
          icon={<CheckCircle2 size={20} strokeWidth={2} />}
          accent={isProfileComplete ? "bg-emerald-500" : "bg-rose-500"}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <DashboardMiniPanel title="Core routes" eyebrow="Navigation">
          <div className="grid gap-3">
            <RouteLink href={profilePath} label="Profile" detail="Institution profile and settings" />
            <RouteLink href={jobsPath} label="Job posts" detail="Create and manage openings" />
            <RouteLink href={messagesPath} label="Messages" detail="Stay on top of teacher conversations" />
            <RouteLink href={hireRequestsPath} label="Hire requests" detail="Monitor sent requests" />
          </div>
        </DashboardMiniPanel>

        <DashboardMiniPanel title="Workspace note" eyebrow="Status">
          <p className="text-sm leading-7 text-slate-500">Core institution routes in one place.</p>
        </DashboardMiniPanel>

        <DashboardMiniPanel title="Attention" eyebrow="Operational">
          <div className="space-y-3">
            <PriorityRow label="Messages" value={`${messageCount} threads`} tone="sky" />
            <PriorityRow label="Requests" value={`${requestCount} items`} tone="gold" />
            <PriorityRow label="Posts" value={`${jobCount} live`} tone="slate" />
          </div>
        </DashboardMiniPanel>
      </section>
    </div>
  );
}

function DashboardMiniPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(17,34,68,0.06)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{eyebrow}</p>
      <h3 className="mt-2 font-[family:var(--font-display)] text-[1.7rem] font-semibold tracking-tight text-[#31455f]">
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  loading,
  detail,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  loading: boolean;
  detail: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(17,34,68,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
          <p className="mt-3 font-[family:var(--font-display)] text-[2.2rem] font-semibold tracking-tight text-[#31455f]">
            {loading ? "..." : value}
          </p>
        </div>
        <span className={`flex h-12 w-12 items-center justify-center rounded-[18px] text-white shadow-sm ${accent}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

function PriorityRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "rose" | "sky" | "gold" | "slate";
}) {
  const toneClass = {
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    sky: "bg-sky-50 text-sky-700",
    gold: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-200 bg-[#fbfdff] px-4 py-3">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass[tone]}`}>{value}</span>
    </div>
  );
}

function RouteLink({ href, label, detail }: { href: string; label: string; detail: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-4 rounded-[18px] border border-slate-200 bg-[#fbfdff] px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#31455f]">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-500">{detail}</span>
      </span>
      <ArrowRight size={16} className="mt-1 flex-shrink-0 text-slate-400 transition group-hover:translate-x-0.5" />
    </Link>
  );
}
