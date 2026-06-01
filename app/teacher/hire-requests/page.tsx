"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { useToast } from "@/components/ui/toast-provider";
import {
  acceptHireRequest,
  fetchReceivedHireRequests,
  rejectHireRequest,
  type HireRequest,
  type HireRequestStatus,
} from "@/lib/api";

export default function TeacherHireRequestsPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading hire requests...">
      {({ accessToken }) => <TeacherHireRequestsContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

function Icon({ d, size = 15 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const I = {
  dashboard: "M2 9l6-6 6 6M4 7v6h3v-3h2v3h3V7",
  jobs: "M3 5h10M3 8h7M3 11h5M13 10l-3 3-1.5-1.5",
  inbox: "M2 4h12a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1zM1 5l7 5 7-5",
  briefcase: "M5 6V4a2 2 0 014 0v2M2 6h12a1 1 0 011 1v6a1 1 0 01-1 1H2a1 1 0 01-1-1V7a1 1 0 011-1z",
  calendar: "M2 5h12M5 2v3M11 2v3M3 5h10a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z",
  message: "M2 3h12a1 1 0 011 1v6a1 1 0 01-1 1H9l-3 3v-3H2a1 1 0 01-1-1V4a1 1 0 011-1z",
};

function StatusBadge({ status }: { status: HireRequestStatus }) {
  const map: Record<HireRequestStatus, { bg: string; color: string; dot: string; label: string }> = {
    PENDING: { bg: "rgba(245,168,36,0.12)", color: "#a16207", dot: "#f5a524", label: "Pending" },
    ACCEPTED: { bg: "rgba(48,164,108,0.12)", color: "#1a7a4a", dot: "#30a46c", label: "Accepted" },
    REJECTED: { bg: "rgba(229,72,77,0.1)", color: "#c11b1f", dot: "#e5484d", label: "Rejected" },
    CANCELLED: { bg: "rgba(142,170,184,0.15)", color: "#5d7280", dot: "#8eaab8", label: "Cancelled" },
    COMPLETED: { bg: "rgba(7,95,117,0.1)", color: "#075f75", dot: "#075f75", label: "Completed" },
  };
  const s = map[status] ?? map.PENDING;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

function RequestCard({
  request,
  onAccept,
  onReject,
}: {
  request: HireRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const isPending = request.status === "PENDING";

  return (
    <article className="app-panel-muted overflow-hidden p-6 sm:p-7">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-black uppercase tracking-[0.08em] text-sky-200 shadow-sm">
              {request.institution.institutionName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-semibold text-brand-navy">{request.institution.institutionName}</h2>
              <p className="text-sm text-brand-navy/70">{request.jobPost.title}</p>
            </div>
          </div>

          <StatusBadge status={request.status} />
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="app-chip bg-slate-100 text-brand-navy">{request.jobPost.subject}</span>
          <span className="app-chip bg-slate-100 text-brand-navy">{request.jobPost.classLevel}</span>
          <span className="app-chip bg-slate-100 text-brand-navy">
            {new Date(request.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {request.message ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-brand-navy/80">
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-brand-navy/50">Message</p>
            <p className="italic leading-6">“{request.message}”</p>
          </div>
        ) : null}

        {isPending ? (
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => onAccept(request.id)} className="app-btn-primary rounded-2xl px-4 py-2 text-sm">
              Accept
            </button>
            <button type="button" onClick={() => onReject(request.id)} className="app-btn-danger rounded-2xl px-4 py-2 text-sm">
              Reject
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-brand-sky bg-brand-navy text-white shadow-sm"
          : "border-slate-200 bg-white text-brand-navy hover:border-brand-sky/70 hover:bg-slate-50"
      }`}
    >
      <span>{label}</span>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-brand-navy">{count}</span>
    </button>
  );
}

function TeacherHireRequestsContent({ accessToken }: { accessToken: string }) {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<HireRequestStatus | "ALL">("ALL");

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const data = await fetchReceivedHireRequests(accessToken);
        if (!cancelled) setRequests(data);
      } catch (error) {
        if (!cancelled) showToast(error instanceof Error ? error.message : "Failed to load requests", "error");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [accessToken, showToast]);

  async function handleAccept(id: string) {
    if (!window.confirm("Accept this hire request?")) return;

    const previousRequests = requests;
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: "ACCEPTED" } : request)));

    try {
      await acceptHireRequest(accessToken, id);
      showToast("Hire request accepted.", "success");
    } catch (error) {
      setRequests(previousRequests);
      showToast(error instanceof Error ? error.message : "Failed to accept", "error");
    }
  }

  async function handleReject(id: string) {
    if (!window.confirm("Reject this hire request?")) return;

    const previousRequests = requests;
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: "REJECTED" } : request)));

    try {
      await rejectHireRequest(accessToken, id);
      showToast("Hire request rejected.", "success");
    } catch (error) {
      setRequests(previousRequests);
      showToast(error instanceof Error ? error.message : "Failed to reject", "error");
    }
  }

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter((request) => request.status === "PENDING").length,
    ACCEPTED: requests.filter((request) => request.status === "ACCEPTED").length,
    REJECTED: requests.filter((request) => request.status === "REJECTED").length,
  };

  const filtered = filter === "ALL" ? requests : requests.filter((request) => request.status === filter);

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-6xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">Teacher space</p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-brand-navy">Received Hire Requests</h1>
                <p className="text-sm text-brand-navy/70">
                  Review institutions that reached out, respond fast, and keep your profile moving.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/teacher/dashboard" className="app-btn-secondary">
                Dashboard
              </Link>
              <Link href="/teacher/jobs" className="app-btn-secondary">
                Browse Jobs
              </Link>
              <Link href="/teacher/messages" className="app-btn-secondary">
                Messages
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total", value: counts.ALL, tone: "text-brand-navy" },
              { label: "Pending", value: counts.PENDING, tone: "text-amber-600" },
              { label: "Accepted", value: counts.ACCEPTED, tone: "text-emerald-700" },
              { label: "Rejected", value: counts.REJECTED, tone: "text-red-600" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className={`text-3xl font-black ${stat.tone}`}>{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-brand-navy/50 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {!isLoading && requests.length > 0 ? (
          <section className="flex flex-wrap gap-2">
            {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((status) => (
              <FilterTab
                key={status}
                label={status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                count={counts[status]}
                active={filter === status}
                onClick={() => setFilter(status)}
              />
            ))}
          </section>
        ) : null}

        <section className="app-panel p-6 sm:p-8">
          {isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="app-empty">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light/80 text-brand-navy">
                <Icon d={I.inbox} size={24} />
              </div>
              <p className="text-base font-semibold text-brand-navy/90">
                {filter === "ALL" ? "No hire requests yet" : `No ${filter.toLowerCase()} requests`}
              </p>
              <p className="mt-2 text-sm text-brand-navy/70">
                {filter === "ALL"
                  ? "Requests from institutions will appear here once they find your profile."
                  : "Try switching to a different filter above."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={(id) => void handleAccept(id)}
                  onReject={(id) => void handleReject(id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
