"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { useToast } from "@/components/ui/toast-provider";
import {
  closeJobPost,
  deleteJobPost,
  fetchInstitutionJobPosts,
  type JobType,
  type JobPost,
  type JobPostStatus,
  type JobPostsQuery,
  type TeachingMode,
} from "@/lib/api";

export default function InstitutionJobPostsPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading institution job posts...">
      {({ accessToken }) => <InstitutionJobPostsContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

function InstitutionJobPostsContent({ accessToken }: { accessToken: string }) {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [location, setLocation] = useState("");
  const [teachingMode, setTeachingMode] = useState<TeachingMode | "">("");
  const [jobType, setJobType] = useState<JobType | "">("");
  const [status, setStatus] = useState<JobPostStatus | "">("");

  const hasActiveFilters = Boolean(subject || classLevel || location || teachingMode || jobType || status);

  useEffect(() => {
    void fetchPosts(accessToken, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function fetchPosts(token: string, query: JobPostsQuery) {
    setIsLoading(true);
    try {
      const result = await fetchInstitutionJobPosts(token, query);
      setPosts(result);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to load job posts", "error");
    } finally {
      setIsLoading(false);
    }
  }

  function buildQuery(): JobPostsQuery {
    return {
      subject: subject.trim() || undefined,
      classLevel: classLevel.trim() || undefined,
      location: location.trim() || undefined,
      teachingMode: teachingMode || undefined,
      jobType: jobType || undefined,
      status: status || undefined,
    };
  }

  async function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetchPosts(accessToken, buildQuery());
  }

  async function handleReset() {
    setSubject("");
    setClassLevel("");
    setLocation("");
    setTeachingMode("");
    setJobType("");
    setStatus("");
    await fetchPosts(accessToken, {});
  }

  async function handleClose(postId: string) {
    setClosingId(postId);
    const prev = posts;
    setPosts((p) => p.map((post) => (post.id === postId ? { ...post, status: "CLOSED" } : post)));
    try {
      await closeJobPost(accessToken, postId);
      showToast("Job post closed.", "success");
    } catch (error) {
      setPosts(prev);
      showToast(error instanceof Error ? error.message : "Failed to close job post", "error");
    } finally {
      setClosingId(null);
    }
  }

  async function handleDelete(postId: string) {
    if (!window.confirm("Delete this job post? This cannot be undone.")) return;
    setDeletingId(postId);
    const prev = posts;
    setPosts((p) => p.filter((post) => post.id !== postId));
    try {
      await deleteJobPost(accessToken, postId);
      showToast("Job post deleted.", "success");
    } catch (error) {
      setPosts(prev);
      showToast(error instanceof Error ? error.message : "Failed to delete job post", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const statusConfig: Record<JobPostStatus, { classes: string; dot: string; label: string }> = {
    ACTIVE: { classes: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500", label: "Active" },
    INACTIVE: {
      classes: "bg-amber-50 text-amber-600 border-amber-100",
      dot: "bg-amber-400 animate-pulse",
      label: "Inactive",
    },
    CLOSED: { classes: "bg-[#eaf3f7] text-brand-navy/50 border-border", dot: "bg-brand-navy/25", label: "Closed" },
  };

  const modeLabel: Record<string, string> = {
    ONLINE: "Online",
    OFFLINE: "Offline",
    BOTH: "Online & Offline",
  };

  const statCounts = {
    total: posts.length,
    active: posts.filter((p) => p.status === "ACTIVE").length,
    closed: posts.filter((p) => p.status === "CLOSED").length,
  };

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
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-brand-sky/30 bg-brand-light px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-widest text-brand-teal">
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
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
                Institution
              </div>
              <h1 className="app-title text-xl sm:text-2xl">Job Posts</h1>
              <p className="mt-0.5 text-xs text-brand-navy/45">Manage your teacher requirement advertisements.</p>
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
              <Link href="/institution/job-posts/create" className="app-btn-primary gap-1.5 text-xs">
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
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Post
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        {!isLoading && posts.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Posts", value: statCounts.total, bg: "bg-brand-light", color: "text-brand-teal" },
              { label: "Active", value: statCounts.active, bg: "bg-emerald-50", color: "text-emerald-600" },
              { label: "Closed", value: statCounts.closed, bg: "bg-[#eaf3f7]", color: "text-brand-navy/50" },
            ].map(({ label, value, bg, color }) => (
              <div key={label} className="app-panel flex items-center gap-3 p-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <span className={`text-base font-black ${color}`}>{value}</span>
                </div>
                <span className="text-xs font-semibold text-brand-navy/50">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Filter panel */}
        <div className="app-panel overflow-hidden">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-3.5 transition hover:bg-brand-light/40"
          >
            <div className="flex items-center gap-2">
              <svg
                className="text-brand-teal"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-navy/50">Filters</span>
              {hasActiveFilters && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-teal text-[0.55rem] font-bold text-white">
                  ✓
                </span>
              )}
            </div>
            <svg
              className={`text-brand-navy/30 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
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

          {showFilters && (
            <>
              <div className="divider-soft" />
              <form className="grid gap-3 p-5 sm:grid-cols-2 md:grid-cols-3" onSubmit={handleFilter}>
                {[
                  { placeholder: "Subject", value: subject, onChange: setSubject },
                  { placeholder: "Class Level", value: classLevel, onChange: setClassLevel },
                  { placeholder: "Location", value: location, onChange: setLocation },
                ].map(({ placeholder, value, onChange }) => (
                  <div key={placeholder} className="relative">
                    <input
                      className="app-input text-sm"
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    />
                  </div>
                ))}

                {[
                  {
                    value: teachingMode,
                    onChange: (v: string) => setTeachingMode(v as TeachingMode | ""),
                    options: [
                      ["", "Teaching Mode (All)"],
                      ["ONLINE", "Online"],
                      ["OFFLINE", "Offline"],
                      ["BOTH", "Both"],
                    ],
                  },
                  {
                    value: jobType,
                    onChange: (v: string) => setJobType(v as JobType | ""),
                    options: [
                      ["", "Job Type (All)"],
                      ["FULL_TIME", "Full Time"],
                      ["PART_TIME", "Part Time"],
                      ["CONTRACT", "Contract"],
                      ["TEMPORARY", "Temporary"],
                    ],
                  },
                  {
                    value: status,
                    onChange: (v: string) => setStatus(v as JobPostStatus | ""),
                    options: [
                      ["", "Status (All)"],
                      ["ACTIVE", "Active"],
                      ["INACTIVE", "Inactive"],
                      ["CLOSED", "Closed"],
                    ],
                  },
                ].map(({ value, onChange, options }, i) => (
                  <div key={i} className="relative">
                    <select
                      className="app-input appearance-none pr-8 text-sm"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                    >
                      {options.map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/30"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                ))}

                <div className="flex gap-2 sm:col-span-2 md:col-span-3">
                  <button type="submit" className="app-btn-primary gap-1.5 text-xs">
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
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Apply Filters
                  </button>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => void handleReset()}
                      className="app-btn-secondary gap-1.5 text-xs"
                    >
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
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>

        {/* Posts list */}
        <div className="app-panel overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-navy/35">
              {isLoading ? "Loading…" : `${posts.length} post${posts.length !== 1 ? "s" : ""}`}
            </p>
          </div>

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
              <span className="text-xs font-medium">Loading job posts…</span>
            </div>
          )}

          {!isLoading && posts.length === 0 && (
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
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy/60">No job posts found</p>
                <p className="mt-1 text-xs text-brand-navy/35">
                  {hasActiveFilters ? "Try adjusting your filters." : "Create your first job post."}
                </p>
              </div>
              {!hasActiveFilters && (
                <Link href="/institution/job-posts/create" className="app-btn-primary mt-1 gap-1.5 text-xs">
                  Create Job Post
                </Link>
              )}
            </div>
          )}

          {!isLoading && posts.length > 0 && (
            <div className="divide-y divide-border">
              {posts.map((post) => {
                const sc = statusConfig[post.status] ?? statusConfig.CLOSED;
                return (
                  <article key={post.id} className="group p-4 transition-colors hover:bg-brand-light/40 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3.5">
                        {/* Icon */}
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-teal">
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
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-sm font-bold text-brand-navy">{post.title}</h2>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold ${sc.classes}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                              {sc.label}
                            </span>
                          </div>

                          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                            <span className="flex items-center gap-1 text-[0.72rem] text-brand-navy/50">
                              <svg
                                width="10"
                                height="10"
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
                              {post.subject} · {post.classLevel}
                            </span>
                            {post.location && (
                              <span className="flex items-center gap-1 text-[0.72rem] text-brand-navy/40">
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {post.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-[0.72rem] text-brand-navy/40">
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="2" y="3" width="20" height="14" rx="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                              </svg>
                              {modeLabel[post.teachingMode] ?? post.teachingMode}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Link
                          href={`/institution/job-posts/${post.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-brand-navy/40 transition hover:border-brand-sky hover:bg-brand-light hover:text-brand-teal"
                          title="Edit"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>

                        {post.status === "ACTIVE" && (
                          <button
                            type="button"
                            disabled={closingId === post.id}
                            onClick={() => void handleClose(post.id)}
                            title="Close"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-500 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {closingId === post.id ? (
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
                            ) : (
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={deletingId === post.id}
                          onClick={() => void handleDelete(post.id)}
                          title="Delete"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-400 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === post.id ? (
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
                          ) : (
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
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
