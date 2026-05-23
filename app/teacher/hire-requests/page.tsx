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

/* ── icons ── */
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
  building: "M3 14V5l5-3 5 3v9M6 14v-4h4v4",
  check: "M3 8l3.5 3.5L13 4",
  x: "M4 4l8 8M12 4l-8 8",
  clock: "M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v3.5l2.5 1.5",
  briefcase: "M5 6V4a2 2 0 014 0v2M2 6h12a1 1 0 011 1v6a1 1 0 01-1 1H2a1 1 0 01-1-1V7a1 1 0 011-1z",
  calendar: "M2 5h12M5 2v3M11 2v3M3 5h10a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z",
  message: "M2 3h12a1 1 0 011 1v6a1 1 0 01-1 1H9l-3 3v-3H2a1 1 0 01-1-1V4a1 1 0 011-1z",
  empty: "M8 2a6 6 0 100 12A6 6 0 008 2zM8 6v4M8 11.5v.5",
};

/* ── status badge ── */
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
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        borderRadius: 999,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 700,
        color: s.color,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ── request card ── */
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
    <article
      style={{
        background: "white",
        borderRadius: 18,
        border: "1px solid rgba(212,230,239,0.8)",
        boxShadow: "0 4px 18px rgba(5,47,68,0.06)",
        overflow: "hidden",
        transition: "box-shadow 200ms, transform 200ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 32px rgba(5,47,68,0.11)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(5,47,68,0.06)";
        (e.currentTarget as HTMLElement).style.transform = "none";
      }}
    >
      {/* Top accent strip for pending */}
      {isPending && <div style={{ height: 3, background: "linear-gradient(90deg,#f5a524,#f5c84b)" }} />}

      <div style={{ padding: "18px 20px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Institution avatar */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                flexShrink: 0,
                background: "linear-gradient(135deg,#052f44,#075f75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 800,
                color: "#a9d3ef",
                letterSpacing: "-0.02em",
                boxShadow: "0 4px 12px rgba(5,47,68,0.18)",
              }}
            >
              {request.institution.institutionName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#052f44",
                  letterSpacing: "-0.025em",
                  margin: "0 0 2px",
                }}
              >
                {request.institution.institutionName}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#5d7280" }}>
                <Icon d={I.briefcase} size={11} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>{request.jobPost.title}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {/* Meta chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "14px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(169,211,239,0.12)",
              border: "1px solid rgba(169,211,239,0.25)",
              borderRadius: 8,
              padding: "4px 10px",
            }}
          >
            <Icon d={I.briefcase} size={11} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#052f44" }}>
              {request.jobPost.subject} · {request.jobPost.classLevel}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(169,211,239,0.12)",
              border: "1px solid rgba(169,211,239,0.25)",
              borderRadius: 8,
              padding: "4px 10px",
            }}
          >
            <Icon d={I.calendar} size={11} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#052f44" }}>
              {new Date(request.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Message */}
        {request.message && (
          <div
            style={{
              background: "linear-gradient(135deg,rgba(234,246,251,0.8),rgba(244,250,253,0.6))",
              border: "1px solid rgba(212,230,239,0.6)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 14,
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ color: "#075f75", flexShrink: 0, marginTop: 1 }}>
              <Icon d={I.message} size={13} />
            </span>
            <p style={{ fontSize: 12, color: "#2d4f60", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              "{request.message}"
            </p>
          </div>
        )}

        {/* Actions */}
        {isPending && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => onAccept(request.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(135deg,#1a7a4a,#22a05a)",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(26,122,74,0.28)",
                transition: "transform 150ms, box-shadow 150ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(26,122,74,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(26,122,74,0.28)";
              }}
            >
              <Icon d={I.check} size={13} /> Accept
            </button>
            <button
              type="button"
              onClick={() => onReject(request.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(229,72,77,0.08)",
                color: "#c11b1f",
                border: "1px solid rgba(229,72,77,0.22)",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 150ms, transform 150ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(229,72,77,0.14)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(229,72,77,0.08)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <Icon d={I.x} size={13} /> Reject
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

/* ── skeleton loader ── */
function SkeletonCard() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 18,
        border: "1px solid rgba(212,230,239,0.8)",
        padding: "18px 20px",
        boxShadow: "0 4px 18px rgba(5,47,68,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "#e8f2f8",
            animation: "hrp-pulse 1.4s ease-in-out infinite",
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              height: 14,
              width: "55%",
              borderRadius: 6,
              background: "#e8f2f8",
              animation: "hrp-pulse 1.4s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: 10,
              width: "35%",
              borderRadius: 6,
              background: "#e8f2f8",
              animation: "hrp-pulse 1.4s ease-in-out 0.1s infinite",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div
          style={{
            height: 26,
            width: 120,
            borderRadius: 8,
            background: "#e8f2f8",
            animation: "hrp-pulse 1.4s ease-in-out 0.2s infinite",
          }}
        />
        <div
          style={{
            height: 26,
            width: 90,
            borderRadius: 8,
            background: "#e8f2f8",
            animation: "hrp-pulse 1.4s ease-in-out 0.3s infinite",
          }}
        />
      </div>
      <div
        style={{
          height: 52,
          borderRadius: 10,
          background: "#e8f2f8",
          animation: "hrp-pulse 1.4s ease-in-out 0.1s infinite",
        }}
      />
    </div>
  );
}

/* ── filter tab ── */
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        borderRadius: 10,
        border: "none",
        background: active ? "linear-gradient(135deg,#052f44,#075f75)" : "white",
        color: active ? "white" : "#5d7280",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        border: active ? "none" : "1px solid rgba(212,230,239,0.8)",
        boxShadow: active ? "0 4px 14px rgba(5,47,68,0.2)" : "none",
        transition: "all 160ms",
      }}
    >
      {label}
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          borderRadius: 999,
          padding: "1px 6px",
          background: active ? "rgba(255,255,255,0.2)" : "rgba(169,211,239,0.2)",
          color: active ? "white" : "#075f75",
        }}
      >
        {count}
      </span>
    </button>
  );
}

/* ── main content ── */
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
    const prev = requests;
    setRequests((r) => r.map((req) => (req.id === id ? { ...req, status: "ACCEPTED" } : req)));
    try {
      await acceptHireRequest(accessToken, id);
      showToast("Hire request accepted.", "success");
    } catch (error) {
      setRequests(prev);
      showToast(error instanceof Error ? error.message : "Failed to accept", "error");
    }
  }

  async function handleReject(id: string) {
    if (!window.confirm("Reject this hire request?")) return;
    const prev = requests;
    setRequests((r) => r.map((req) => (req.id === id ? { ...req, status: "REJECTED" } : req)));
    try {
      await rejectHireRequest(accessToken, id);
      showToast("Hire request rejected.", "success");
    } catch (error) {
      setRequests(prev);
      showToast(error instanceof Error ? error.message : "Failed to reject", "error");
    }
  }

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    ACCEPTED: requests.filter((r) => r.status === "ACCEPTED").length,
    REJECTED: requests.filter((r) => r.status === "REJECTED").length,
  };

  const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  return (
    <>
      <style>{`
        @keyframes hrp-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hrp-pulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.45; }
        }
        .hrp-root { animation: hrp-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <main className="hrp-root app-shell" style={{ padding: "1.5rem 1rem 3rem" }}>
        <div
          style={{ width: "100%", maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* ── Header card ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #052f44 0%, #065770 55%, #076b82 100%)",
              borderRadius: 22,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 16px 48px rgba(5,47,68,0.2)",
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
            <div style={{ padding: "22px 24px 20px", position: "relative" }}>
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
                    <Icon d={I.inbox} size={18} />
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
                      Received Hire Requests
                    </h1>
                    <p style={{ fontSize: 11, color: "rgba(169,211,239,0.7)", margin: 0 }}>
                      Review and respond to institution requests
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
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
                      transition: "background 150ms",
                    }}
                  >
                    <Icon d={I.dashboard} size={12} /> Dashboard
                  </Link>
                  <Link
                    href="/teacher/jobs"
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
                    <Icon d={I.jobs} size={12} /> Browse Jobs
                  </Link>
                </div>
              </div>

              {/* Stats strip */}
              {!isLoading && requests.length > 0 && (
                <div style={{ display: "flex", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
                  {[
                    { label: "Total", value: counts.ALL, color: "#a9d3ef" },
                    { label: "Pending", value: counts.PENDING, color: "#f5a524" },
                    { label: "Accepted", value: counts.ACCEPTED, color: "#30a46c" },
                    { label: "Rejected", value: counts.REJECTED, color: "#e5484d" },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 900,
                          color: s.color,
                          letterSpacing: "-0.04em",
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: "rgba(169,211,239,0.55)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Filter tabs ── */}
          {!isLoading && requests.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((f) => (
                <FilterTab
                  key={f}
                  label={f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
                  count={counts[f]}
                  active={filter === f}
                  onClick={() => setFilter(f)}
                />
              ))}
            </div>
          )}

          {/* ── Loading skeletons ── */}
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!isLoading && filtered.length === 0 && (
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
                <Icon d={I.inbox} size={22} />
              </div>
              <p
                style={{ fontSize: 15, fontWeight: 800, color: "#052f44", margin: "0 0 6px", letterSpacing: "-0.02em" }}
              >
                {filter === "ALL" ? "No hire requests yet" : `No ${filter.toLowerCase()} requests`}
              </p>
              <p style={{ fontSize: 12, color: "#5d7280", margin: 0, lineHeight: 1.6 }}>
                {filter === "ALL"
                  ? "Requests from institutions will appear here once they find your profile."
                  : "Try switching to a different filter above."}
              </p>
            </div>
          )}

          {/* ── Request cards ── */}
          {!isLoading && filtered.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
        </div>
      </main>
    </>
  );
}
