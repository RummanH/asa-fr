"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { fetchJobPostById, type JobPost } from "@/lib/api";

export default function TeacherJobDetailsPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading job details...">
      {({ accessToken }) => <TeacherJobDetailsContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type TeacherJobDetailsContentProps = {
  accessToken: string;
};

function TeacherJobDetailsContent({ accessToken }: TeacherJobDetailsContentProps) {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<JobPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const jobPostId = params.id;

  useEffect(() => {
    if (!jobPostId) {
      return;
    }

    fetchJobPostById(accessToken, jobPostId)
      .then((result) => {
        setJob(result);
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Failed to load job post");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, jobPostId]);

  if (isLoading) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-brand-navy/78">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (!jobPostId) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-red-700">Invalid job post id.</p>
          <Link
            className="mt-4 inline-block app-btn-secondary"
            href="/teacher/jobs"
          >
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-red-700">{errorMessage || "Job post not found"}</p>
          <Link
            className="mt-4 inline-block app-btn-secondary"
            href="/teacher/jobs"
          >
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-4xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-brand-navy">{job.title}</h1>
            <Link
              className="app-btn-secondary"
              href="/teacher/jobs"
            >
              Back to Jobs
            </Link>
          </div>
          <p className="mt-2 text-sm text-brand-navy/65">
            {job.institution.institutionName} - {job.subject} - {job.classLevel}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-brand-navy/78">
            <p>Job Type: {formatJobType(job.jobType)}</p>
            <p>Teaching Mode: {formatTeachingMode(job.teachingMode)}</p>
            <p>Location: {job.location ?? "Not specified"}</p>
            <p>
              Salary:{" "}
              {job.salaryMin !== null || job.salaryMax !== null
                ? `${job.salaryMin ?? "N/A"} - ${job.salaryMax ?? "N/A"}`
                : "Not specified"}
            </p>
          </div>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand-navy">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-brand-navy/78">
            {job.description}
          </p>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand-navy">Requirements</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-brand-navy/78">
            {job.requirements ?? "No extra requirements provided."}
          </p>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand-navy">Actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              className="app-btn-primary"
              href={`/teacher/messages?institutionId=${job.institution.id}`}
            >
              Start Chat
            </Link>
            <Link
              className="app-btn-secondary"
              href="/teacher/hire-requests"
            >
              View Hire Requests
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function formatJobType(type: string): string {
  return type.replaceAll("_", " ");
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
