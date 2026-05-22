"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import {
  fetchActiveJobPosts,
  type JobPost,
  type JobPostsQuery,
  type JobType,
  type TeachingMode,
} from "@/lib/api";

export default function TeacherJobsPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading teacher jobs...">
      {({ accessToken }) => <TeacherJobsContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type TeacherJobsContentProps = {
  accessToken: string;
};

function TeacherJobsContent({ accessToken }: TeacherJobsContentProps) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [location, setLocation] = useState("");
  const [teachingMode, setTeachingMode] = useState<TeachingMode | "">("");
  const [jobType, setJobType] = useState<JobType | "">("");

  useEffect(() => {
    loadJobs(accessToken, {});
  }, [accessToken]);

  async function loadJobs(token: string, query: JobPostsQuery) {
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

  async function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    await loadJobs(accessToken, buildQuery());
  }

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-6xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-brand-navy">Find Job Posts</h1>
              <p className="mt-2 text-sm text-brand-navy/65">
                Browse active institution requirements and open details.
              </p>
            </div>
            <Link
              className="app-btn-secondary"
              href="/teacher/dashboard"
            >
              Dashboard
            </Link>
          </div>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <form className="grid gap-3 md:grid-cols-3" onSubmit={handleFilter}>
            <input
              className={inputClassName}
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              className={inputClassName}
              placeholder="Class Level"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
            />
            <input
              className={inputClassName}
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <select
              className={inputClassName}
              value={teachingMode}
              onChange={(e) => setTeachingMode(e.target.value as TeachingMode | "")}
            >
              <option value="">Teaching Mode (All)</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="BOTH">Both</option>
            </select>

            <select
              className={inputClassName}
              value={jobType}
              onChange={(e) => setJobType(e.target.value as JobType | "")}
            >
              <option value="">Job Type (All)</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="TEMPORARY">Temporary</option>
            </select>

            <div className="md:col-span-3 flex flex-wrap gap-2">
              <button
                className="app-btn-primary"
                type="submit"
              >
                Apply Filters
              </button>
              <button
                className="app-btn-secondary"
                type="button"
                onClick={async () => {
                  setSubject("");
                  setClassLevel("");
                  setLocation("");
                  setTeachingMode("");
                  setJobType("");
                  setIsLoading(true);
                  await loadJobs(accessToken, {});
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="app-panel p-6 sm:p-8">
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
          {isLoading ? <p className="text-sm text-brand-navy/78">Loading job posts...</p> : null}

          {!isLoading && jobs.length === 0 ? (
            <div className="app-empty">
              <p className="text-base font-medium text-brand-navy/90">No active job posts found.</p>
              <p className="mt-1 text-sm text-brand-navy/65">
                Try adjusting your filters to find more opportunities.
              </p>
            </div>
          ) : null}

          {!isLoading && jobs.length > 0 ? (
            <div className="grid gap-3">
              {jobs.map((job) => (
                <article key={job.id} className="app-panel-muted p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-brand-navy">{job.title}</h2>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        {job.institution.institutionName} • {job.subject} • {job.classLevel}
                      </p>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        {job.location ?? "Location not specified"} • {formatTeachingMode(job.teachingMode)}
                      </p>
                    </div>
                    <Link
                      className="app-btn-primary px-3 py-1.5 text-sm"
                      href={`/teacher/jobs/${job.id}`}
                    >
                      View Details
                    </Link>
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

function formatTeachingMode(mode: string): string {
  if (mode === "ONLINE") {
    return "Online";
  }
  if (mode === "OFFLINE") {
    return "Offline";
  }
  if (mode === "BOTH") {
    return "Online/Offline";
  }
  return mode;
}

const inputClassName =
  "app-input";

