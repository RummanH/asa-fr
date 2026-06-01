"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { fetchJobPostById, type JobPost } from "@/lib/api";

export default function TeacherJobDetailsPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading job details...">
      {({ user, accessToken, logoutAction, isLoggingOut }) => (
        <DashboardLayout
          navItems={[
            { href: "/teacher/profile", label: "Edit Profile", icon: <span />, isActive: false },
            { href: "/teacher/jobs", label: "Browse Jobs", icon: <span />, isActive: true },
            { href: "/teacher/messages", label: "Messages", icon: <span /> },
            { href: "/teacher/change-password", label: "Change Password", icon: <span /> },
            { href: "/teacher/hire-requests", label: "Received Requests", icon: <span /> },
          ]}
          userName={user.name}
          userEmail={user.email}
          userRole={user.role}
          settingsHref="/teacher/profile"
          onLogout={logoutAction}
          isLoggingOut={isLoggingOut}
        >
          <TeacherJobDetailsContent accessToken={accessToken} />
        </DashboardLayout>
      )}
    </RoleProtectedPage>
  );
}

/* ── helpers ── */
function formatJobType(t: string) { return t.replaceAll("_", " "); }
function formatTeachingMode(m: string) {
  return m === "ONLINE" ? "Online" : m === "OFFLINE" ? "In-Person" : m === "BOTH" ? "Hybrid" : m;
}
function formatSalary(min: number | null, max: number | null) {
  if (min === null && max === null) return "Not specified";
  const fmt = (n: number) => "$" + n.toLocaleString();
  if (min !== null && max !== null) return `${fmt(min)} – ${fmt(max)} / yr`;
  if (min !== null) return `From ${fmt(min)} / yr`;
  return `Up to ${fmt(max!)} / yr`;
}

/* ── icons ── */
function Icon({ d, size = 15 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const I = {
  back:      "M10 13L5 8l5-5",
  building:  "M3 14V5l5-3 5 3v9M6 14v-4h4v4",
  book:      "M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM5 6h6M5 9h4",
  grade:     "M8 2a6 6 0 100 12A6 6 0 008 2zM5.5 8l2 2L11 6",
  clock:     "M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v3.5l2.5 1.5",
  monitor:   "M2 3h12a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1zM5 13h6M8 11v2",
  pin:       "M8 1.5A3.5 3.5 0 018 8.5c-2 0-3.5-2.5-3.5-2.5A3.5 3.5 0 018 1.5zM8 5a1 1 0 100 2 1 1 0 000-2zM8 8.5v6",
  money:     "M2 5h12a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zM5.5 8.5h5",
  chat:      "M2 3h12a1 1 0 011 1v6a1 1 0 01-1 1H9l-3 3v-3H2a1 1 0 01-1-1V4a1 1 0 011-1z",
  inbox:     "M2 4h12a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1zM1 5l7 5 7-5",
  list:      "M3 4h10M3 8h7M3 12h9",
  arrow:     "M3 8h10M9 4l4 4-4 4",
};

/* ── section card ── */
function SectionCard({ iconD, title, children }: { iconD: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "white", borderRadius: 20,
      border: "1px solid rgba(212,230,239,0.8)",
      boxShadow: "0 4px 18px rgba(5,47,68,0.06)",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 22px", borderBottom: "1px solid rgba(212,230,239,0.5)",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: "linear-gradient(135deg,#052f44,#075f75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 8px rgba(5,47,68,0.2)",
        }}>
          <span style={{ color: "#a9d3ef", display: "flex" }}><Icon d={iconD} size={13} /></span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#052f44", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {title}
        </span>
      </div>
      <div style={{ padding: "18px 22px" }}>{children}</div>
    </div>
  );
}

/* ── skeleton ── */
function Skeleton() {
  return (
    <>
      <style>{`@keyframes sk-pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
      <div style={{ padding: "1.5rem 1rem 3rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {[120, 180, 140].map((h, i) => (
            <div key={i} style={{ background: "white", borderRadius: 20, border: "1px solid rgba(212,230,239,0.8)", height: h,
              animation: "sk-pulse 1.4s ease-in-out infinite", boxShadow: "0 4px 18px rgba(5,47,68,0.05)" }} />
          ))}
        </div>
      </div>
    </>
  );
}

/* ── error state ── */
function ErrorState({ message }: { message: string }) {
  return (
    <div style={{ padding: "1.5rem 1rem 3rem" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{
          background: "white", borderRadius: 20, border: "1px solid rgba(229,72,77,0.2)",
          padding: "40px 28px", textAlign: "center",
          boxShadow: "0 4px 18px rgba(5,47,68,0.06)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: "0 auto 16px",
            background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#e5484d",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#052f44", margin: "0 0 6px" }}>{message}</p>
          <Link href="/teacher/jobs" style={{
            display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16,
            background: "linear-gradient(135deg,#052f44,#075f75)", color: "white",
            borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 700,
            textDecoration: "none", boxShadow: "0 6px 18px rgba(5,47,68,0.2)",
          }}>
            <Icon d={I.back} size={13} /> Back to Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── main content ── */
function TeacherJobDetailsContent({ accessToken }: { accessToken: string }) {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<JobPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const jobPostId = params.id;

  useEffect(() => {
    if (!jobPostId) return;
    fetchJobPostById(accessToken, jobPostId)
      .then(result => { setJob(result); setErrorMessage(""); })
      .catch(error => setErrorMessage(error instanceof Error ? error.message : "Failed to load job post"))
      .finally(() => setIsLoading(false));
  }, [accessToken, jobPostId]);

  if (isLoading) return <Skeleton />;
  if (!jobPostId) return <ErrorState message="Invalid job post ID." />;
  if (!job) return <ErrorState message={errorMessage || "Job post not found."} />;

  const initials = job.institution.institutionName.slice(0, 2).toUpperCase();

  return (
    <>
      <style>{`
        @keyframes jd-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .jd-root { animation: jd-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .jd-action-btn { transition: transform 160ms, box-shadow 160ms; }
        .jd-action-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div className="jd-root" style={{ padding: "0 0 2rem" }}>
        <div style={{ width: "100%", maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* ── Hero header ── */}
          <div style={{
            background: "linear-gradient(135deg, #052f44 0%, #065770 55%, #076b82 100%)",
            borderRadius: 22, overflow: "hidden", position: "relative",
            boxShadow: "0 16px 48px rgba(5,47,68,0.22)",
          }}>
            <svg style={{ position: "absolute", top: -20, right: -10, opacity: 0.08, pointerEvents: "none" }}
              width="200" height="160" viewBox="0 0 200 160" fill="none">
              <circle cx="180" cy="0" r="140" stroke="white" strokeWidth="1" />
              <circle cx="180" cy="0" r="90" stroke="white" strokeWidth="0.7" />
              <circle cx="180" cy="0" r="50" stroke="white" strokeWidth="0.5" />
            </svg>

            <div style={{ padding: "22px 24px 24px", position: "relative" }}>
              {/* Back link */}
              <Link href="/teacher/jobs" style={{
                display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 18,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8, padding: "5px 11px", textDecoration: "none",
                color: "rgba(169,211,239,0.8)", fontSize: 11, fontWeight: 700,
                transition: "background 150ms",
              }}>
                <Icon d={I.back} size={12} /> Back to Jobs
              </Link>

              {/* Institution + title */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: "linear-gradient(135deg,rgba(169,211,239,0.22),rgba(169,211,239,0.1))",
                  border: "1.5px solid rgba(169,211,239,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 17, fontWeight: 800, color: "#a9d3ef", letterSpacing: "-0.02em",
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: 20, fontWeight: 900, color: "white", letterSpacing: "-0.04em", margin: "0 0 4px", lineHeight: 1.15 }}>
                    {job.title}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(169,211,239,0.75)" }}>
                    <Icon d={I.building} size={12} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{job.institution.institutionName}</span>
                  </div>
                </div>
              </div>

              {/* Meta chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                {[
                  { icon: I.book,    label: job.subject },
                  { icon: I.grade,   label: job.classLevel },
                  { icon: I.clock,   label: formatJobType(job.jobType) },
                  { icon: I.monitor, label: formatTeachingMode(job.teachingMode) },
                  { icon: I.pin,     label: job.location ?? "Location TBD" },
                  { icon: I.money,   label: formatSalary(job.salaryMin ?? null, job.salaryMax ?? null) },
                ].map(({ icon, label }) => (
                  <div key={label} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 8, padding: "5px 11px",
                  }}>
                    <span style={{ color: "#a9d3ef", display: "flex" }}><Icon d={icon} size={11} /></span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          <SectionCard iconD={I.list} title="Description">
            <p style={{ fontSize: 13, color: "#2d4f60", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>
              {job.description}
            </p>
          </SectionCard>

          {/* ── Requirements ── */}
          <SectionCard iconD={I.grade} title="Requirements">
            <p style={{ fontSize: 13, color: "#2d4f60", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>
              {job.requirements ?? "No extra requirements provided."}
            </p>
          </SectionCard>

          {/* ── Actions ── */}
          <SectionCard iconD={I.arrow} title="Apply & Connect">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link
                href={`/teacher/messages?institutionId=${job.institution.id}`}
                className="jd-action-btn"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "linear-gradient(135deg,#052f44,#075f75)",
                  color: "white", borderRadius: 11, padding: "10px 20px",
                  fontSize: 13, fontWeight: 800, textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(5,47,68,0.22)",
                  letterSpacing: "-0.01em",
                }}
              >
                <Icon d={I.chat} size={14} /> Start Chat
              </Link>
              <Link
                href="/teacher/hire-requests"
                className="jd-action-btn"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "white", color: "#052f44",
                  border: "1.5px solid rgba(212,230,239,0.9)",
                  borderRadius: 11, padding: "10px 20px",
                  fontSize: 13, fontWeight: 700, textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(5,47,68,0.07)",
                }}
              >
                <Icon d={I.inbox} size={14} /> View Hire Requests
              </Link>
            </div>
          </SectionCard>

        </div>
      </div>
    </>
  );
}