"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { JobPostForm } from "@/components/forms/job-post-form";
import { useToast } from "@/components/ui/toast-provider";
import { closeJobPost, fetchJobPostById, updateJobPost, type JobPost, type JobPostPayload } from "@/lib/api";

export default function EditJobPostPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading edit job post page...">
      {({ accessToken }) => <EditJobPostContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

function EditJobPostContent({ accessToken }: { accessToken: string }) {
  const { showToast } = useToast();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const jobPostId = params.id;

  useEffect(() => {
    if (!jobPostId) return;
    fetchJobPostById(accessToken, jobPostId)
      .then((post) => {
        setJobPost(post);
        setErrorMessage("");
      })
      .catch((error) => {
        const msg = error instanceof Error ? error.message : "Failed to load job post";
        setErrorMessage(msg);
        showToast(msg, "error");
      })
      .finally(() => setIsLoading(false));
  }, [accessToken, jobPostId, showToast]);

  async function handleUpdate(payload: JobPostPayload) {
    if (!jobPostId) throw new Error("Invalid job post id");
    const updated = await updateJobPost(accessToken, jobPostId, payload);
    setJobPost(updated);
    showToast("Job post updated.", "success");
  }

  async function handleClose() {
    if (!jobPostId) return;
    setIsClosing(true);
    try {
      const updated = await closeJobPost(accessToken, jobPostId);
      setJobPost(updated);
      showToast("Job post closed.", "success");
    } finally {
      setIsClosing(false);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="app-shell min-h-screen px-3 py-5 sm:px-6 sm:py-8">
        <div className="app-container">
          <div className="app-panel flex flex-col items-center justify-center gap-3 py-20">
            <svg
              className="animate-spin text-brand-teal"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p className="text-xs font-medium text-brand-navy/40">Loading job post…</p>
          </div>
        </div>
      </main>
    );
  }

  // Error / not found states
  if (!jobPostId || !jobPost) {
    return (
      <main className="app-shell min-h-screen px-3 py-5 sm:px-6 sm:py-8">
        <div className="app-container">
          <div className="app-panel overflow-hidden">
            <div className="h-0.5 w-full bg-red-400" />
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e5484d"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy/70">
                  {!jobPostId ? "Invalid job post ID" : errorMessage || "Job post not found"}
                </p>
                <p className="mt-1 text-xs text-brand-navy/35">
                  This post may have been removed or the link is invalid.
                </p>
              </div>
              <Link href="/institution/job-posts" className="app-btn-secondary mt-1 gap-1.5 text-xs">
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
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Job Posts
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isActive = jobPost.status === "ACTIVE";
  const isClosed = jobPost.status === "CLOSED";

  const statusConfig = {
    ACTIVE: { classes: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500", label: "Active" },
    CLOSED: { classes: "bg-[#eaf3f7] text-brand-navy/50 border-border", dot: "bg-brand-navy/25", label: "Closed" },
    DRAFT: {
      classes: "bg-amber-50 text-amber-600 border-amber-100",
      dot: "bg-amber-400 animate-pulse",
      label: "Draft",
    },
  }[jobPost.status] ?? {
    classes: "bg-blue-50 text-blue-600 border-blue-100",
    dot: "bg-blue-400",
    label: jobPost.status,
  };

  return (
    <main className="app-shell min-h-screen px-3 py-5 sm:px-6 sm:py-8">
      <div className="app-container space-y-4">
        {/* Header */}
        <div className="app-panel overflow-hidden">
          <div
            className="h-0.5 w-full"
            style={{ background: "linear-gradient(90deg, #052f44, #075f75 50%, #a9d3ef)" }}
          />
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Post
                </div>
                <h1 className="app-title text-xl sm:text-2xl">{jobPost.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold ${statusConfig.classes}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                    {statusConfig.label}
                  </span>
                  {jobPost.subject && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-0.5 text-[0.68rem] font-medium text-brand-navy/50">
                      {jobPost.subject}
                    </span>
                  )}
                  {jobPost.classLevel && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-0.5 text-[0.68rem] font-medium text-brand-navy/50">
                      {jobPost.classLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/institution/job-posts" className="app-btn-secondary gap-1.5 text-xs">
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
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Job Posts
                </Link>

                {isActive && (
                  <button
                    type="button"
                    disabled={isClosing}
                    onClick={() => void handleClose()}
                    className="app-btn-danger gap-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isClosing ? (
                      <svg
                        className="animate-spin"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    ) : (
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
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    )}
                    {isClosing ? "Closing…" : "Close Post"}
                  </button>
                )}

                <button type="button" onClick={() => router.refresh()} className="app-btn-secondary gap-1.5 text-xs">
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
                  Refresh
                </button>
              </div>
            </div>

            {/* Closed warning */}
            {isClosed && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-600">
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
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                This post is closed. You can still edit its details but it won't appear in searches.
              </div>
            )}
          </div>
        </div>

        {/* Form panel */}
        <div className="app-panel overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-navy/35">Post Details</p>
          </div>
          <div className="p-5 sm:p-6">
            <JobPostForm initialValues={jobPost} submitLabel="Update Job Post" onSubmit={handleUpdate} />
          </div>
        </div>
      </div>
    </main>
  );
}
