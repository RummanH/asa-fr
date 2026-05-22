"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { JobPostForm } from "@/components/forms/job-post-form";
import { useToast } from "@/components/ui/toast-provider";
import {
  closeJobPost,
  fetchJobPostById,
  updateJobPost,
  type JobPost,
  type JobPostPayload,
} from "@/lib/api";

export default function EditJobPostPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading edit job post page...">
      {({ accessToken }) => <EditJobPostContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type EditJobPostContentProps = {
  accessToken: string;
};

function EditJobPostContent({ accessToken }: EditJobPostContentProps) {
  const { showToast } = useToast();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const jobPostId = params.id;

  useEffect(() => {
    if (!jobPostId) {
      return;
    }

    fetchJobPostById(accessToken, jobPostId)
      .then((post) => {
        setJobPost(post);
        setErrorMessage("");
      })
      .catch((error) => {
        const nextMessage = error instanceof Error ? error.message : "Failed to load job post";
        setErrorMessage(nextMessage);
        showToast(nextMessage, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, jobPostId, showToast]);

  async function handleUpdate(payload: JobPostPayload) {
    if (!jobPostId) {
      throw new Error("Invalid job post id");
    }

    const updated = await updateJobPost(accessToken, jobPostId, payload);
    setJobPost(updated);
    showToast("Job post updated.", "success");
  }

  async function handleClose() {
    if (!jobPostId) {
      return;
    }

    const updated = await closeJobPost(accessToken, jobPostId);
    setJobPost(updated);
    showToast("Job post closed.", "success");
  }

  if (isLoading) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-brand-navy/78">Loading job post...</p>
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
            href="/institution/job-posts"
          >
            Back to Job Posts
          </Link>
        </div>
      </main>
    );
  }

  if (!jobPost) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-red-700">{errorMessage || "Job post not found"}</p>
          <Link
            className="mt-4 inline-block app-btn-secondary"
            href="/institution/job-posts"
          >
            Back to Job Posts
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
            <h1 className="text-2xl font-semibold text-brand-navy">Edit Job Post</h1>
            <div className="flex flex-wrap gap-2">
              <Link
                className="app-btn-secondary"
                href="/institution/job-posts"
              >
                Back to Job Posts
              </Link>
              {jobPost.status === "ACTIVE" ? (
                <button
                  className="app-btn-secondary"
                  type="button"
                  onClick={() => void handleClose()}
                >
                  Close Post
                </button>
              ) : null}
              <button
                className="app-btn-primary"
                type="button"
                onClick={() => router.refresh()}
              >
                Refresh
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-brand-navy/65">
            Status: {jobPost.status}. Update the fields below and save.
          </p>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <JobPostForm initialValues={jobPost} submitLabel="Update Job Post" onSubmit={handleUpdate} />
        </section>
      </div>
    </main>
  );
}
