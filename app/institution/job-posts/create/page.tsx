"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { JobPostForm } from "@/components/forms/job-post-form";
import { createJobPost, type JobPostPayload } from "@/lib/api";

export default function CreateJobPostPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading create job post form...">
      {({ accessToken }) => <CreateJobPostContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type CreateJobPostContentProps = {
  accessToken: string;
};

function CreateJobPostContent({ accessToken }: CreateJobPostContentProps) {
  const router = useRouter();

  async function handleCreate(payload: JobPostPayload) {
    await createJobPost(accessToken, payload);
    router.push("/institution/job-posts");
  }

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .cj-root {
            margin: 0 -0.45rem;
            padding: 0 0 1.5rem !important;
          }
          .cj-shell {
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
            padding: 1rem 0.95rem 1.5rem !important;
          }
        }
      `}</style>

      <main className="cj-root app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container">
        <section className="cj-shell app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-brand-navy">Create Job Post</h1>
            <Link
              className="app-btn-secondary"
              href="/institution/job-posts"
            >
              Back to Job Posts
            </Link>
          </div>
          <p className="mt-2 text-sm text-brand-navy/65">
            Add a new teacher requirement for institutions to publish.
          </p>
          <div className="mt-6">
            <JobPostForm submitLabel="Create Job Post" onSubmit={handleCreate} />
          </div>
        </section>
      </div>
    </main>
    </>
  );
}

