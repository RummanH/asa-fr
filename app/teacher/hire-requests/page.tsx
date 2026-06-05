"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock3,
  Loader2,
  Mail,
  Sparkles,
  UserRoundCheck,
  X,
} from "lucide-react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DistributionChartCard, MetricChartCard } from "@/components/dashboard/dashboard-charts";
import { getTeacherNavItems } from "@/components/dashboard/teacher-nav";
import { useToast } from "@/components/ui/toast-provider";
import {
  acceptHireRequest,
  fetchReceivedHireRequests,
  rejectHireRequest,
  type HireRequest,
  type HireRequestStatus,
} from "@/lib/api";

function statusTone(status: HireRequestStatus) {
  if (status === "PENDING") return "bg-amber-50 text-amber-700";
  if (status === "ACCEPTED") return "bg-emerald-50 text-emerald-700";
  if (status === "REJECTED") return "bg-rose-50 text-rose-700";
  if (status === "COMPLETED") return "bg-sky-50 text-sky-700";
  return "bg-slate-100 text-slate-700";
}

function RequestCard({
  request,
  onAccept,
  onReject,
  isBusy,
}: {
  request: HireRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isBusy: boolean;
}) {
  const isPending = request.status === "PENDING";

  return (
    <article className="rounded-[20px] bg-white/78 p-4 shadow-none ring-1 ring-slate-200/55 backdrop-blur-sm md:rounded-[24px] md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-[0_16px_38px_rgba(17,34,68,0.06)] md:ring-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${statusTone(request.status)}`}>
              {request.status}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#f7faff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              {new Date(request.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h2 className="mt-3 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#31455f]">
            {request.institution.institutionName}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{request.jobPost.title}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isPending ? (
            <>
              <button
                type="button"
                onClick={() => onAccept(request.id)}
                disabled={isBusy}
                className="inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />
                Accept
              </button>
              <button
                type="button"
                onClick={() => onReject(request.id)}
                disabled={isBusy}
                className="inline-flex min-h-11 items-center gap-2 rounded-[16px] border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
                Reject
              </button>
            </>
          ) : null}
          <Link
            href="/teacher/messages"
            className="inline-flex min-h-11 items-center gap-2 rounded-[16px] border border-brand-sky/35 bg-brand-light px-4 text-sm font-semibold text-brand-navy transition hover:bg-white"
          >
            <Mail size={16} />
            Messages
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[16px] bg-[#f7fbff] px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Subject</p>
          <p className="mt-2 text-sm font-semibold text-[#31455f]">{request.jobPost.subject}</p>
        </div>
        <div className="rounded-[16px] bg-[#f7fbff] px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Class level</p>
          <p className="mt-2 text-sm font-semibold text-[#31455f]">{request.jobPost.classLevel}</p>
        </div>
        <div className="rounded-[16px] bg-[#f7fbff] px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Job status</p>
          <p className="mt-2 text-sm font-semibold text-[#31455f]">{request.jobPost.status}</p>
        </div>
        <div className="rounded-[16px] bg-[#f7fbff] px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Institution</p>
          <p className="mt-2 text-sm font-semibold text-[#31455f]">{request.institution.user.email}</p>
        </div>
      </div>

      {request.message ? (
        <div className="mt-4 rounded-[16px] bg-[#f8fbfd] px-3.5 py-3.5 md:mt-5 md:rounded-[20px] md:border md:border-slate-200 md:bg-white md:px-4 md:py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Message</p>
          <p className="mt-3 text-sm leading-7 text-slate-500">{request.message}</p>
        </div>
      ) : null}
    </article>
  );
}

function TeacherHireRequestsContent({ accessToken }: { accessToken: string }) {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<HireRequestStatus | "ALL">("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      try {
        const data = await fetchReceivedHireRequests(accessToken);
        if (!cancelled) setRequests(data);
      } catch (error) {
        if (!cancelled) showToast(error instanceof Error ? error.message : "Failed to load requests", "error");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadRequests();

    return () => {
      cancelled = true;
    };
  }, [accessToken, showToast]);

  async function handleAccept(id: string) {
    if (!window.confirm("Accept this hire request?")) return;
    const previous = requests;
    setBusyId(id);
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, status: "ACCEPTED" } : request)));

    try {
      await acceptHireRequest(accessToken, id);
      showToast("Hire request accepted.", "success");
    } catch (error) {
      setRequests(previous);
      showToast(error instanceof Error ? error.message : "Failed to accept request", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id: string) {
    if (!window.confirm("Reject this hire request?")) return;
    const previous = requests;
    setBusyId(id);
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, status: "REJECTED" } : request)));

    try {
      await rejectHireRequest(accessToken, id);
      showToast("Hire request rejected.", "success");
    } catch (error) {
      setRequests(previous);
      showToast(error instanceof Error ? error.message : "Failed to reject request", "error");
    } finally {
      setBusyId(null);
    }
  }

  const counts = useMemo(
    () => ({
      ALL: requests.length,
      PENDING: requests.filter((request) => request.status === "PENDING").length,
      ACCEPTED: requests.filter((request) => request.status === "ACCEPTED").length,
      REJECTED: requests.filter((request) => request.status === "REJECTED").length,
    }),
    [requests],
  );

  const filtered = activeFilter === "ALL" ? requests : requests.filter((request) => request.status === activeFilter);

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="overflow-hidden rounded-[20px] bg-transparent px-0 py-1 shadow-none sm:px-0 md:rounded-[28px] md:border md:border-slate-200 md:bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] md:px-5 md:py-5 md:shadow-[0_18px_44px_rgba(17,34,68,0.08)] md:sm:px-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.9fr)] xl:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-sky/40 bg-brand-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-navy/70">
                <Sparkles size={14} className="text-brand-teal" />
                Institution interest
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-sky/35 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-navy/65">
                {isLoading ? "Refreshing" : `${filtered.length} visible requests`}
              </span>
            </div>
            <h1 className="mt-3 font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-brand-navy sm:text-[2.7rem]">
              Received Hire Requests
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-[14px]">Review and respond to incoming requests.</p>
          </div>

          <div className="rounded-[18px] bg-white/82 p-2.5 shadow-none ring-1 ring-slate-200/55 backdrop-blur-sm md:rounded-[24px] md:border md:border-slate-200 md:bg-white md:p-3 md:shadow-[0_12px_32px_rgba(17,34,68,0.06)] md:ring-0">
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <div className="rounded-[16px] bg-white px-3.5 py-3 md:rounded-[20px] md:border md:border-slate-200 md:px-4 md:py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Total</p>
              <p className="mt-2.5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-brand-navy">
                {isLoading ? "..." : counts.ALL}
              </p>
            </div>
            <div className="rounded-[16px] bg-brand-cream px-3.5 py-3 md:rounded-[20px] md:border md:border-brand-gold/25 md:px-4 md:py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Pending</p>
              <p className="mt-2.5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#c58a14]">
                {isLoading ? "..." : counts.PENDING}
              </p>
            </div>
            <div className="rounded-[16px] bg-emerald-50 px-3.5 py-3 md:rounded-[20px] md:border md:border-emerald-300/25 md:px-4 md:py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Accepted</p>
              <p className="mt-2.5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-emerald-600">
                {isLoading ? "..." : counts.ACCEPTED}
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.25fr_0.9fr]">
        <MetricChartCard
          title="Request chart"
          totalLabel="All requests"
          totalValue={isLoading ? "..." : counts.ALL}
          labels={["Pending", "Accepted", "Rejected"]}
          values={[counts.PENDING, counts.ACCEPTED, counts.REJECTED]}
          colors={["#f3b33d", "#15a36f", "#ef6a5b"]}
        />
        <DistributionChartCard
          title="Status mix"
          labels={["Pending", "Accepted", "Rejected"]}
          values={[counts.PENDING, counts.ACCEPTED, counts.REJECTED]}
          colors={["#f3b33d", "#15a36f", "#ef6a5b"]}
        />
      </section>

      {!isLoading && requests.length > 0 ? (
        <section className="flex flex-wrap gap-2">
          {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-[16px] px-4 text-sm font-semibold transition ${
                activeFilter === filter
                  ? "bg-brand-navy text-white"
                  : "border border-brand-sky/35 bg-white text-brand-navy hover:bg-brand-light"
              }`}
            >
              {filter === "ALL" ? "All" : filter.charAt(0) + filter.slice(1).toLowerCase()}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeFilter === filter ? "bg-white/14 text-white" : "bg-brand-light text-brand-teal"
                }`}
              >
                {counts[filter]}
              </span>
            </button>
          ))}
        </section>
      ) : null}

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-[20px] bg-white/72 px-5 py-10 text-center shadow-none ring-1 ring-slate-200/55 backdrop-blur-sm md:rounded-[26px] md:border md:border-slate-200 md:bg-white md:px-6 md:py-12 md:shadow-[0_16px_38px_rgba(17,34,68,0.05)] md:ring-0">
            <Loader2 size={24} className="mx-auto animate-spin text-slate-400" />
            <p className="mt-4 text-sm font-medium text-slate-500">Loading hire requests</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[20px] bg-white/72 px-5 py-10 text-center shadow-none ring-1 ring-slate-200/55 backdrop-blur-sm md:rounded-[26px] md:border md:border-dashed md:border-slate-200 md:bg-white md:px-6 md:py-12 md:shadow-[0_16px_38px_rgba(17,34,68,0.05)] md:ring-0">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eef5fb] text-brand-teal">
              <Clock3 size={24} />
            </div>
            <h3 className="mt-5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#31455f]">
              {activeFilter === "ALL" ? "No hire requests yet" : `No ${activeFilter.toLowerCase()} requests`}
            </h3>
            <p className="mx-auto mt-3 text-sm leading-7 text-slate-500">
              {activeFilter === "ALL" ? "Requests will appear here." : "Try another filter."}
            </p>
          </div>
        ) : (
          filtered.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={(id) => void handleAccept(id)}
              onReject={(id) => void handleReject(id)}
              isBusy={busyId === request.id}
            />
          ))
        )}
      </section>

      <section className="grid items-start gap-3 xl:grid-cols-2">
        <div className="rounded-[20px] bg-white/78 p-4 shadow-none ring-1 ring-slate-200/55 backdrop-blur-sm md:rounded-[26px] md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-[0_16px_38px_rgba(17,34,68,0.06)] md:ring-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Decision rhythm</p>
          <h3 className="mt-2 font-[family:var(--font-display)] text-[1.7rem] font-semibold tracking-tight text-[#31455f]">
            Best next move
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-500">Review pending requests first.</p>
        </div>

        <div className="rounded-[20px] bg-white/78 p-4 shadow-none ring-1 ring-slate-200/55 backdrop-blur-sm md:rounded-[26px] md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-[0_16px_38px_rgba(17,34,68,0.06)] md:ring-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Teacher workflow</p>
          <h3 className="mt-2 font-[family:var(--font-display)] text-[1.7rem] font-semibold tracking-tight text-[#31455f]">
            Related routes
          </h3>
          <div className="mt-5 grid gap-3">
            <Link href="/teacher/messages" className="flex min-h-11 items-center justify-between rounded-[16px] border border-brand-sky/35 bg-brand-light px-4 text-sm font-semibold text-brand-navy transition hover:bg-white">
              Messages
              <Mail size={16} />
            </Link>
            <Link href="/teacher/jobs" className="flex min-h-11 items-center justify-between rounded-[16px] border border-brand-sky/35 bg-brand-light px-4 text-sm font-semibold text-brand-navy transition hover:bg-white">
              Browse Jobs
              <UserRoundCheck size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function TeacherHireRequestsPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading hire requests...">
      {({ user, accessToken, logoutAction, isLoggingOut }) => (
        <DashboardLayout
          navItems={getTeacherNavItems("requests")}
          userName={user.name}
          userEmail={user.email}
          userRole={user.role}
          settingsHref="/teacher/profile"
          onLogout={logoutAction}
          isLoggingOut={isLoggingOut}
        >
          <TeacherHireRequestsContent accessToken={accessToken} />
        </DashboardLayout>
      )}
    </RoleProtectedPage>
  );
}
