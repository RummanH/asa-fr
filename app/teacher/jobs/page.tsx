"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { fetchActiveJobPosts, type JobPost, type JobPostsQuery, type JobType, type TeachingMode } from "@/lib/api";

export default function TeacherJobsPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading teacher jobs...">
      {({ accessToken }) => <TeacherJobsContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

/* ── helpers ── */
function formatTeachingMode(m: string) {
  return m === "ONLINE" ? "Online" : m === "OFFLINE" ? "In-Person" : m === "BOTH" ? "Hybrid" : m;
}
function formatJobType(t: string) {
  return t.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function formatSalary(min: number | null, max: number | null) {
  if (min === null && max === null) return null;
  const fmt = (n: number) => "$" + n.toLocaleString();
  if (min !== null && max !== null) return `${fmt(min)} – ${fmt(max)}`;
  if (min !== null) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

/* ── icons ── */
function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const I = {
  search: "M7 2a5 5 0 100 10A5 5 0 007 2zM14 14l-3-3",
  filter: "M2 4h12M4 8h8M6 12h4",
  reset: "M2 8a6 6 0 0110.47-4M14 8a6 6 0 01-10.47 4M2 4v4h4M14 12v-4h-4",
  dashboard: "M2 9l6-6 6 6M4 7v6h3v-3h2v3h3V7",
  building: "M3 14V5l5-3 5 3v9M6 14v-4h4v4",
  book: "M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM5 6h6M5 9h4",
  grade: "M8 2a6 6 0 100 12A6 6 0 008 2zM5.5 8l2 2L11 6",
  pin: "M8 1.5A3.5 3.5 0 018 8.5c-2 0-3.5-2.5-3.5-2.5A3.5 3.5 0 018 1.5zM8 5a1 1 0 100 2 1 1 0 000-2zM8 8.5v6",
  monitor: "M2 3h12a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1zM5 13h6M8 11v2",
  clock: "M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v3.5l2.5 1.5",
  money: "M2 5h12a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zM5.5 8.5h5",
  arrow: "M3 8h10M9 4l4 4-4 4",
  jobs: "M3 5h10M3 8h7M3 11h5M13 10l-3 3-1.5-1.5",
  empty: "M8 2a6 6 0 100 12A6 6 0 008 2zM8 6v4M8 11.5v.5",
};

/* ── mode badge ── */
const modeBadge: Record<string, { bg: string; color: string }> = {
  Online: { bg: "rgba(48,164,108,0.1)", color: "#1a7a4a" },
  "In-Person": { bg: "rgba(7,95,117,0.1)", color: "#075f75" },
  Hybrid: { bg: "rgba(245,168,36,0.1)", color: "#a16207" },
};
function ModeBadge({ mode }: { mode: string }) {
  const s = modeBadge[mode] ?? { bg: "rgba(169,211,239,0.15)", color: "#052f44" };
  return (
    <span
      style={{ fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "2px 8px", background: s.bg, color: s.color }}
    >
      {mode}
    </span>
  );
}

/* ── styled input / select ── */
function StyledInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 11,
          top: "50%",
          transform: "translateY(-50%)",
          color: focused ? "#075f75" : "#8eaab8",
          display: "flex",
          pointerEvents: "none",
          transition: "color 150ms",
        }}
      >
        <Icon d={I.search} size={13} />
      </span>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          height: "2.5rem",
          paddingLeft: 34,
          paddingRight: 12,
          borderRadius: 10,
          border: `1.5px solid ${focused ? "#075f75" : "#ccdde8"}`,
          background: focused ? "#f4fbff" : "#fafcfe",
          color: "#052f44",
          fontSize: 13,
          fontWeight: 500,
          outline: "none",
          fontFamily: "inherit",
          boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
          transition: "border-color 160ms, background 160ms, box-shadow 160ms",
        }}
      />
    </div>
  );
}

function StyledSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        height: "2.5rem",
        padding: "0 30px 0 12px",
        borderRadius: 10,
        border: `1.5px solid ${focused ? "#075f75" : "#ccdde8"}`,
        background: focused ? "#f4fbff" : "#fafcfe",
        color: "#052f44",
        fontSize: 13,
        fontWeight: 500,
        outline: "none",
        fontFamily: "inherit",
        appearance: "none",
        cursor: "pointer",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238eaab8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 11px center",
        boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
        transition: "border-color 160ms, background 160ms, box-shadow 160ms",
      }}
    >
      {children}
    </select>
  );
}

/* ── job card ── */
function JobCard({ job }: { job: JobPost }) {
  const salary = formatSalary(job.salaryMin ?? null, job.salaryMax ?? null);
  const initials = job.institution.institutionName.slice(0, 2).toUpperCase();

  return (
    <article
      style={{
        background: "white",
        borderRadius: 18,
        border: "1px solid rgba(212,230,239,0.8)",
        boxShadow: "0 4px 16px rgba(5,47,68,0.06)",
        overflow: "hidden",
        transition: "transform 180ms, box-shadow 180ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(5,47,68,0.11)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "none";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(5,47,68,0.06)";
      }}
    >
      {/* Left accent bar */}
      <div style={{ display: "flex" }}>
        <div style={{ width: 4, flexShrink: 0, background: "linear-gradient(180deg,#052f44,#075f75)" }} />

        <div style={{ flex: 1, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            {/* Left */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#052f44,#075f75)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#a9d3ef",
                  boxShadow: "0 4px 10px rgba(5,47,68,0.18)",
                }}
              >
                {initials}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                  <h2
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#052f44",
                      letterSpacing: "-0.025em",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {job.title}
                  </h2>
                  <ModeBadge mode={formatTeachingMode(job.teachingMode)} />
                </div>
                <p style={{ fontSize: 11, color: "#5d7280", margin: "0 0 10px", fontWeight: 500 }}>
                  {job.institution.institutionName}
                </p>

                {/* Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    { icon: I.book, label: job.subject },
                    { icon: I.grade, label: job.classLevel },
                    { icon: I.clock, label: formatJobType(job.jobType) },
                    { icon: I.pin, label: job.location ?? "Remote" },
                    ...(salary ? [{ icon: I.money, label: salary }] : []),
                  ].map(({ icon, label }) => (
                    <div
                      key={label}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: "rgba(169,211,239,0.1)",
                        border: "1px solid rgba(169,211,239,0.22)",
                        borderRadius: 7,
                        padding: "3px 8px",
                      }}
                    >
                      <span style={{ color: "#075f75", display: "flex" }}>
                        <Icon d={icon} size={11} />
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#052f44" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/teacher/jobs/${job.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                flexShrink: 0,
                background: "linear-gradient(135deg,#052f44,#075f75)",
                color: "white",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(5,47,68,0.22)",
                transition: "transform 150ms, box-shadow 150ms",
                alignSelf: "flex-start",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(5,47,68,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(5,47,68,0.22)";
              }}
            >
              Details <Icon d={I.arrow} size={12} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── skeleton ── */
function SkeletonCard() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 18,
        border: "1px solid rgba(212,230,239,0.8)",
        padding: "16px 18px",
        display: "flex",
        gap: 12,
        boxShadow: "0 4px 16px rgba(5,47,68,0.05)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 11,
          background: "#e8f2f8",
          flexShrink: 0,
          animation: "tj-pulse 1.4s ease-in-out infinite",
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            height: 14,
            width: "50%",
            borderRadius: 6,
            background: "#e8f2f8",
            animation: "tj-pulse 1.4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 10,
            width: "30%",
            borderRadius: 6,
            background: "#e8f2f8",
            animation: "tj-pulse 1.4s ease-in-out 0.1s infinite",
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {[80, 70, 90].map((w, i) => (
            <div
              key={i}
              style={{
                height: 22,
                width: w,
                borderRadius: 7,
                background: "#e8f2f8",
                animation: `tj-pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── main content ── */
function TeacherJobsContent({ accessToken }: { accessToken: string }) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [location, setLocation] = useState("");
  const [teachingMode, setTeachingMode] = useState<TeachingMode | "">("");
  const [jobType, setJobType] = useState<JobType | "">("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    loadJobs(accessToken, {});
  }, [accessToken]);

  async function loadJobs(token: string, query: JobPostsQuery) {
    setIsLoading(true);
    try {
      const result = await fetchActiveJobPosts(token, query);
      setJobs(result);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load jobs");
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
    };
  }

  async function handleFilter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await loadJobs(accessToken, buildQuery());
  }

  async function handleReset() {
    setSubject("");
    setClassLevel("");
    setLocation("");
    setTeachingMode("");
    setJobType("");
    await loadJobs(accessToken, {});
  }

  const hasFilters = !!(subject || classLevel || location || teachingMode || jobType);

  return (
    <>
      <style>{`
        @keyframes tj-fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tj-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .tj-root { animation: tj-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .tj-filter-toggle { transition: background 150ms; }
        .tj-filter-toggle:hover { background: rgba(5,47,68,0.06) !important; }
      `}</style>

      <main className="tj-root app-shell" style={{ padding: "1.5rem 1rem 3rem" }}>
        <div
          style={{ width: "100%", maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* ── Header ── */}
          <div
            style={{
              background: "linear-gradient(135deg,#052f44 0%,#065770 55%,#076b82 100%)",
              borderRadius: 22,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 16px 48px rgba(5,47,68,0.22)",
            }}
          >
            <svg
              style={{ position: "absolute", top: -20, right: -10, opacity: 0.08, pointerEvents: "none" }}
              width="200"
              height="160"
              viewBox="0 0 200 160"
              fill="none"
            >
              <circle cx="180" cy="0" r="140" stroke="white" strokeWidth="1" />
              <circle cx="180" cy="0" r="90" stroke="white" strokeWidth="0.7" />
            </svg>
            <div style={{ padding: "22px 24px 22px", position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "rgba(169,211,239,0.15)",
                      border: "1px solid rgba(169,211,239,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#a9d3ef",
                    }}
                  >
                    <Icon d={I.jobs} size={18} />
                  </div>
                  <div>
                    <h1
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: "white",
                        letterSpacing: "-0.035em",
                        margin: "0 0 2px",
                      }}
                    >
                      Find Job Posts
                    </h1>
                    <p style={{ fontSize: 11, color: "rgba(169,211,239,0.7)", margin: 0 }}>
                      Browse active institution opportunities
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {/* Result count */}
                  {!isLoading && (
                    <div
                      style={{
                        background: "rgba(169,211,239,0.15)",
                        border: "1px solid rgba(169,211,239,0.22)",
                        borderRadius: 999,
                        padding: "4px 12px",
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#a9d3ef" }}>
                        {jobs.length} {jobs.length === 1 ? "result" : "results"}
                      </span>
                    </div>
                  )}
                  <Link
                    href="/teacher/dashboard"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      borderRadius: 9,
                      padding: "6px 12px",
                      textDecoration: "none",
                      color: "rgba(169,211,239,0.85)",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    <Icon d={I.dashboard} size={12} /> Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Filter panel ── */}
          <div
            style={{
              background: "white",
              borderRadius: 18,
              border: "1px solid rgba(212,230,239,0.8)",
              boxShadow: "0 4px 16px rgba(5,47,68,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Filter header toggle */}
            <button
              type="button"
              className="tj-filter-toggle"
              onClick={() => setFiltersOpen((o) => !o)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "14px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                borderBottom: filtersOpen ? "1px solid rgba(212,230,239,0.5)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#075f75", display: "flex" }}>
                  <Icon d={I.filter} size={14} />
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#052f44", letterSpacing: "0.03em" }}>
                  Filter Jobs
                </span>
                {hasFilters && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 999,
                      padding: "2px 7px",
                      background: "rgba(7,95,117,0.1)",
                      color: "#075f75",
                    }}
                  >
                    Active
                  </span>
                )}
              </div>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{
                  transform: filtersOpen ? "rotate(180deg)" : "none",
                  transition: "transform 200ms",
                  color: "#8eaab8",
                }}
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {filtersOpen && (
              <form onSubmit={handleFilter} style={{ padding: "16px 20px 20px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <StyledInput placeholder="Subject" value={subject} onChange={setSubject} />
                  <StyledInput placeholder="Class Level" value={classLevel} onChange={setClassLevel} />
                  <StyledInput placeholder="Location" value={location} onChange={setLocation} />
                  <StyledSelect value={teachingMode} onChange={(v) => setTeachingMode(v as TeachingMode | "")}>
                    <option value="">Teaching Mode (All)</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">In-Person</option>
                    <option value="BOTH">Hybrid</option>
                  </StyledSelect>
                  <StyledSelect value={jobType} onChange={(v) => setJobType(v as JobType | "")}>
                    <option value="">Job Type (All)</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="TEMPORARY">Temporary</option>
                  </StyledSelect>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "linear-gradient(135deg,#052f44,#075f75)",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      padding: "8px 18px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxShadow: "0 4px 14px rgba(5,47,68,0.2)",
                      transition: "transform 150ms, box-shadow 150ms",
                    }}
                  >
                    <Icon d={I.search} size={13} /> Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "white",
                      color: "#052f44",
                      border: "1.5px solid rgba(212,230,239,0.9)",
                      borderRadius: 10,
                      padding: "8px 18px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "background 150ms",
                    }}
                  >
                    <Icon d={I.reset} size={13} /> Reset
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Error ── */}
          {errorMessage && (
            <div
              style={{
                background: "rgba(229,72,77,0.08)",
                border: "1px solid rgba(229,72,77,0.2)",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: "#c11b1f",
              }}
            >
              ⚠ {errorMessage}
            </div>
          )}

          {/* ── Loading skeletons ── */}
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[0, 1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!isLoading && jobs.length === 0 && !errorMessage && (
            <div
              style={{
                background: "white",
                borderRadius: 20,
                border: "1px dashed rgba(169,211,239,0.5)",
                padding: "52px 24px",
                textAlign: "center",
                boxShadow: "0 4px 16px rgba(5,47,68,0.05)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  margin: "0 auto 16px",
                  background: "rgba(169,211,239,0.12)",
                  border: "1px solid rgba(169,211,239,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#075f75",
                }}
              >
                <Icon d={I.jobs} size={22} />
              </div>
              <p
                style={{ fontSize: 15, fontWeight: 800, color: "#052f44", margin: "0 0 6px", letterSpacing: "-0.02em" }}
              >
                No active job posts found
              </p>
              <p style={{ fontSize: 12, color: "#5d7280", margin: "0 0 20px", lineHeight: 1.6 }}>
                {hasFilters
                  ? "Try adjusting your filters to find more opportunities."
                  : "New opportunities will appear here as institutions post them."}
              </p>
              {hasFilters && (
                <button
                  onClick={handleReset}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "linear-gradient(135deg,#052f44,#075f75)",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "8px 18px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: "0 4px 14px rgba(5,47,68,0.2)",
                  }}
                >
                  <Icon d={I.reset} size={13} /> Clear Filters
                </button>
              )}
            </div>
          )}

          {/* ── Job cards ── */}
          {!isLoading && jobs.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
