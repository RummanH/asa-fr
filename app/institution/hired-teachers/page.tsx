"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { fetchSentHireRequests, type HireRequest } from "@/lib/api";

export default function InstitutionHiredTeachersPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading hired teachers...">
      {({ accessToken }) => <InstitutionHiredTeachersContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type HiredTeacherCard = {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  acceptedRequests: HireRequest[];
  firstAcceptedAt: string;
  latestAcceptedAt: string;
};

function InstitutionHiredTeachersContent({ accessToken }: { accessToken: string }) {
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const data = await fetchSentHireRequests(accessToken);
        if (!cancelled) {
          setRequests(data);
          setErrorMessage("");
        }
      } catch (error) {
        if (!cancelled) setErrorMessage(error instanceof Error ? error.message : "Failed to load hired teachers");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const hiredTeachers = useMemo(() => {
    const accepted = requests.filter((r) => r.status === "ACCEPTED");
    const grouped = new Map<string, HiredTeacherCard>();

    for (const request of accepted) {
      const existing = grouped.get(request.teacherId);
      if (!existing) {
        grouped.set(request.teacherId, {
          teacherId: request.teacherId,
          teacherName: request.teacher.user.name,
          teacherEmail: request.teacher.user.email,
          acceptedRequests: [request],
          firstAcceptedAt: request.updatedAt,
          latestAcceptedAt: request.updatedAt,
        });
        continue;
      }
      existing.acceptedRequests.push(request);
      if (new Date(request.updatedAt) < new Date(existing.firstAcceptedAt))
        existing.firstAcceptedAt = request.updatedAt;
      if (new Date(request.updatedAt) > new Date(existing.latestAcceptedAt))
        existing.latestAcceptedAt = request.updatedAt;
    }

    return Array.from(grouped.values()).sort(
      (a, b) => new Date(b.latestAcceptedAt).getTime() - new Date(a.latestAcceptedAt).getTime(),
    );
  }, [requests]);

  const avatarGradients = [
    "linear-gradient(135deg, #052f44, #075f75)",
    "linear-gradient(135deg, #065068, #0d8fa8)",
    "linear-gradient(135deg, #03485e, #06697e)",
    "linear-gradient(135deg, #04354d, #097a8e)",
  ];

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

  return (
    <main className="app-shell min-h-screen px-3 py-5 sm:px-6 sm:py-8">
      <div className="app-container max-w-5xl space-y-4">
        {/* Header */}
        <div className="app-panel overflow-hidden">
          <div
            className="h-0.5 w-full"
            style={{ background: "linear-gradient(90deg, #052f44, #075f75 50%, #a9d3ef)" }}
          />
          <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-widest text-emerald-600">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Hired
              </div>
              <h1 className="app-title text-xl sm:text-2xl">Hired Teachers</h1>
              <p className="mt-0.5 text-xs text-brand-navy/45">Teachers who accepted your hire requests.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/institution/dashboard" className="app-btn-secondary gap-1.5 text-xs">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Dashboard
              </Link>
              <Link href="/institution/hire-requests" className="app-btn-secondary gap-1.5 text-xs">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Sent Requests
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        {!isLoading && hiredTeachers.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              {
                label: "Total Hired",
                value: hiredTeachers.length,
                icon: (
                  <svg
                    width="16"
                    height="16"
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
                bg: "bg-brand-light",
                color: "text-brand-teal",
              },
              {
                label: "Total Jobs",
                value: hiredTeachers.reduce((s, t) => s + t.acceptedRequests.length, 0),
                icon: (
                  <svg
                    width="16"
                    height="16"
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
                bg: "bg-emerald-50",
                color: "text-emerald-600",
              },
              {
                label: "Most Recent",
                value: hiredTeachers[0] ? formatDate(hiredTeachers[0].latestAcceptedAt) : "—",
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                bg: "bg-blue-50",
                color: "text-blue-500",
              },
            ].map(({ label, value, icon, bg, color }) => (
              <div key={label} className="app-panel flex items-center gap-3 p-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-navy leading-none">{value}</p>
                  <p className="mt-0.5 text-[0.68rem] text-brand-navy/45">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="app-panel overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-navy/35">
              {isLoading ? "Loading…" : `${hiredTeachers.length} teacher${hiredTeachers.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-600">
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMessage}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-brand-navy/35">
              <svg
                className="animate-spin"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-xs font-medium">Loading hired teachers…</span>
            </div>
          )}

          {/* Empty */}
          {!isLoading && hiredTeachers.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white shadow-sm">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a9d3ef"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy/60">No hired teachers yet</p>
                <p className="mt-1 text-xs text-brand-navy/35">Teachers appear here once they accept your requests.</p>
              </div>
              <Link href="/institution/teachers" className="app-btn-primary mt-1 gap-1.5 text-xs">
                Browse Teachers
              </Link>
            </div>
          )}

          {/* Grid */}
          {!isLoading && hiredTeachers.length > 0 && (
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {hiredTeachers.map((teacher, i) => {
                const isExpanded = expanded === teacher.teacherId;
                return (
                  <article key={teacher.teacherId} className="bg-white p-5 transition-colors hover:bg-brand-light/40">
                    {/* Top row */}
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-sm"
                        style={{ background: avatarGradients[i % avatarGradients.length] }}
                      >
                        {teacher.teacherName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-brand-navy">{teacher.teacherName}</p>
                        <p className="truncate text-[0.72rem] text-brand-navy/45">{teacher.teacherEmail}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-600">
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {teacher.acceptedRequests.length} job{teacher.acceptedRequests.length !== 1 ? "s" : ""}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-brand-light px-2 py-0.5 text-[0.65rem] font-medium text-brand-navy/50">
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Since {formatDate(teacher.firstAcceptedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Accepted jobs toggle */}
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : teacher.teacherId)}
                      className="mt-4 flex w-full items-center justify-between rounded-xl border border-border bg-white px-3.5 py-2.5 text-left transition hover:bg-brand-light/60"
                    >
                      <span className="text-xs font-semibold text-brand-navy/60">Accepted Jobs</span>
                      <svg
                        className={`text-brand-navy/30 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 rounded-xl border border-border bg-brand-light/40 p-3">
                        {teacher.acceptedRequests.map((req) => (
                          <div key={req.id} className="flex items-start gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
                            <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-emerald-100">
                              <svg
                                width="9"
                                height="9"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#059669"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-brand-navy">{req.jobPost.title}</p>
                              <p className="text-[0.65rem] text-brand-navy/40">
                                {req.jobPost.subject} · {req.jobPost.classLevel}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
