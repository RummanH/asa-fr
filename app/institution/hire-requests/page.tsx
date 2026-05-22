"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { useToast } from "@/components/ui/toast-provider";
import {
  cancelHireRequest,
  fetchSentHireRequests,
  type HireRequest,
  type HireRequestStatus,
} from "@/lib/api";

export default function InstitutionHireRequestsPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading hire requests...">
      {({ accessToken }) => <InstitutionHireRequestsContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type InstitutionHireRequestsContentProps = {
  accessToken: string;
};

function InstitutionHireRequestsContent({ accessToken }: InstitutionHireRequestsContentProps) {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const data = await fetchSentHireRequests(accessToken);
        if (cancelled) {
          return;
        }
        setRequests(data);
      } catch (error) {
        if (cancelled) {
          return;
        }
        showToast(error instanceof Error ? error.message : "Failed to load sent requests", "error");
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

  async function handleCancel(hireRequestId: string) {
    const confirmed = window.confirm("Cancel this pending hire request?");
    if (!confirmed) {
      return;
    }

    const previousRequests = requests;
    setRequests((prev) =>
      prev.map((request) =>
        request.id === hireRequestId ? { ...request, status: "CANCELLED" } : request,
      ),
    );

    try {
      await cancelHireRequest(accessToken, hireRequestId);
      showToast("Hire request cancelled.", "success");
    } catch (error) {
      setRequests(previousRequests);
      showToast(error instanceof Error ? error.message : "Failed to cancel hire request", "error");
    }
  }

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-6xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-brand-navy">Sent Hire Requests</h1>
              <p className="mt-2 text-sm text-brand-navy/65">
                Track requests you sent to teachers.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                className="app-btn-secondary"
                href="/institution/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="app-btn-secondary"
                href="/institution/teachers"
              >
                Browse Teachers
              </Link>
              <Link
                className="app-btn-secondary"
                href="/institution/hired-teachers"
              >
                Hired Teachers
              </Link>
            </div>
          </div>
        </section>

        <section className="app-panel p-6 sm:p-8">
          {isLoading ? <p className="text-sm text-brand-navy/78">Loading sent requests...</p> : null}

          {!isLoading && requests.length === 0 ? (
            <div className="app-empty">
              <p className="text-base font-medium text-brand-navy/90">No hire requests sent yet.</p>
              <p className="mt-1 text-sm text-brand-navy/65">
                Open a teacher profile and send a hire request.
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
                        {request.teacher.user.name}
                      </h2>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        Job: {request.jobPost.title} ({request.jobPost.subject} -{" "}
                        {request.jobPost.classLevel})
                      </p>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        Sent: {new Date(request.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-sm text-brand-navy/78">
                        Message: {request.message ?? "No message"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={request.status} />
                      {request.status === "PENDING" ? (
                        <button
                          className="app-btn-danger px-3 py-1.5 text-sm"
                          type="button"
                          onClick={() => void handleCancel(request.id)}
                        >
                          Cancel
                        </button>
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

