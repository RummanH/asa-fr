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

type InstitutionHiredTeachersContentProps = {
  accessToken: string;
};

type HiredTeacherCard = {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  acceptedRequests: HireRequest[];
  firstAcceptedAt: string;
  latestAcceptedAt: string;
};

function InstitutionHiredTeachersContent({ accessToken }: InstitutionHiredTeachersContentProps) {
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const data = await fetchSentHireRequests(accessToken);
        if (cancelled) {
          return;
        }
        setRequests(data);
        setErrorMessage("");
      } catch (error) {
        if (cancelled) {
          return;
        }
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load hired teachers",
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
  }, [accessToken]);

  const hiredTeachers = useMemo(() => {
    const accepted = requests.filter((request) => request.status === "ACCEPTED");
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
      if (new Date(request.updatedAt) < new Date(existing.firstAcceptedAt)) {
        existing.firstAcceptedAt = request.updatedAt;
      }
      if (new Date(request.updatedAt) > new Date(existing.latestAcceptedAt)) {
        existing.latestAcceptedAt = request.updatedAt;
      }
    }

    return Array.from(grouped.values()).sort(
      (a, b) => new Date(b.latestAcceptedAt).getTime() - new Date(a.latestAcceptedAt).getTime(),
    );
  }, [requests]);

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-6xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-brand-navy">Hired Teachers</h1>
              <p className="mt-2 text-sm text-brand-navy/65">
                Teachers with accepted hire requests from your institution.
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
                href="/institution/hire-requests"
              >
                Sent Requests
              </Link>
            </div>
          </div>
        </section>

        <section className="app-panel p-6 sm:p-8">
          {errorMessage ? <p className="mb-2 text-sm text-red-700">{errorMessage}</p> : null}
          {isLoading ? <p className="text-sm text-brand-navy/78">Loading hired teachers...</p> : null}

          {!isLoading && hiredTeachers.length === 0 ? (
            <div className="app-empty">
              <p className="text-base font-medium text-brand-navy/90">No hired teachers yet.</p>
              <p className="mt-1 text-sm text-brand-navy/65">
                Teachers appear here once they accept your hire requests.
              </p>
            </div>
          ) : null}

          {!isLoading && hiredTeachers.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {hiredTeachers.map((teacher) => (
                <article key={teacher.teacherId} className="app-panel-muted p-4">
                  <h2 className="text-lg font-semibold text-brand-navy">{teacher.teacherName}</h2>
                  <p className="mt-1 text-sm text-brand-navy/65">{teacher.teacherEmail}</p>
                  <p className="mt-2 text-sm text-brand-navy/78">
                    Accepted requests: {teacher.acceptedRequests.length}
                  </p>
                  <p className="mt-1 text-sm text-brand-navy/65">
                    First accepted: {new Date(teacher.firstAcceptedAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-brand-navy/65">
                    Latest accepted: {new Date(teacher.latestAcceptedAt).toLocaleString()}
                  </p>

                  <div className="mt-3">
                    <p className="text-sm font-medium text-brand-navy/90">Accepted Jobs</p>
                    <ul className="mt-1 list-disc pl-5 text-sm text-brand-navy/78">
                      {teacher.acceptedRequests.map((request) => (
                        <li key={request.id}>
                          {request.jobPost.title} ({request.jobPost.subject} -{" "}
                          {request.jobPost.classLevel})
                        </li>
                      ))}
                    </ul>
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

