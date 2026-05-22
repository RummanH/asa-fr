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

type TeacherHireRequestsContentProps = {
  accessToken: string;
};

function TeacherHireRequestsContent({ accessToken }: TeacherHireRequestsContentProps) {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const data = await fetchReceivedHireRequests(accessToken);
        if (cancelled) {
          return;
        }
        setRequests(data);
      } catch (error) {
        if (cancelled) {
          return;
        }
        showToast(
          error instanceof Error ? error.message : "Failed to load received requests",
          "error",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [accessToken, showToast]);

  async function handleAccept(hireRequestId: string) {
    const confirmed = window.confirm("Accept this hire request?");
    if (!confirmed) {
      return;
    }

    const previousRequests = requests;
    setRequests((prev) =>
      prev.map((request) =>
        request.id === hireRequestId ? { ...request, status: "ACCEPTED" } : request,
      ),
    );

    try {
      await acceptHireRequest(accessToken, hireRequestId);
      showToast("Hire request accepted.", "success");
    } catch (error) {
      setRequests(previousRequests);
      showToast(error instanceof Error ? error.message : "Failed to accept hire request", "error");
    }
  }

  async function handleReject(hireRequestId: string) {
    const confirmed = window.confirm("Reject this hire request?");
    if (!confirmed) {
      return;
    }

    const previousRequests = requests;
    setRequests((prev) =>
      prev.map((request) =>
        request.id === hireRequestId ? { ...request, status: "REJECTED" } : request,
      ),
    );

    try {
      await rejectHireRequest(accessToken, hireRequestId);
      showToast("Hire request rejected.", "success");
    } catch (error) {
      setRequests(previousRequests);
      showToast(error instanceof Error ? error.message : "Failed to reject hire request", "error");
    }
  }

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-6xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-brand-navy">Received Hire Requests</h1>
              <p className="mt-2 text-sm text-brand-navy/65">
                Review and respond to institution requests.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                className="app-btn-secondary"
                href="/teacher/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="app-btn-secondary"
                href="/teacher/jobs"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </section>

        <section className="app-panel p-6 sm:p-8">
          {isLoading ? <p className="text-sm text-brand-navy/78">Loading received requests...</p> : null}

          {!isLoading && requests.length === 0 ? (
            <div className="app-empty">
              <p className="text-base font-medium text-brand-navy/90">
                No hire requests received yet.
              </p>
              <p className="mt-1 text-sm text-brand-navy/65">
                Requests from institutions will appear here.
              </p>
            </div>
          ) : null}

          {!isLoading && requests.length > 0 ? (
            <div className="grid gap-3">
              {requests.map((request) => (
                <article key={request.id} className="app-panel-muted p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-brand-navy">
                        {request.institution.institutionName}
                      </h2>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        Job: {request.jobPost.title} ({request.jobPost.subject} -{" "}
                        {request.jobPost.classLevel})
                      </p>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        Received: {new Date(request.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-brand-navy/78">
                        Message: {request.message ?? "No message"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={request.status} />
                      {request.status === "PENDING" ? (
                        <>
                          <button
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500"
                            type="button"
                            onClick={() => void handleAccept(request.id)}
                          >
                            Accept
                          </button>
                          <button
                            className="app-btn-danger px-3 py-1.5 text-sm"
                            type="button"
                            onClick={() => void handleReject(request.id)}
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: HireRequestStatus }) {
  const classes =
    status === "PENDING"
      ? "bg-amber-100 text-amber-700"
      : status === "ACCEPTED"
        ? "bg-emerald-100 text-emerald-700"
        : status === "REJECTED"
          ? "bg-red-100 text-red-700"
          : status === "CANCELLED"
            ? "bg-[#e6f0f6] text-brand-navy/78"
            : "bg-blue-100 text-blue-700";

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${classes}`}>
      {status}
    </span>
  );
}

