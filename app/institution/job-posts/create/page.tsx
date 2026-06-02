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
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container space-y-5">
        <section className="app-panel p-6 sm:p-8">
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
        </section>

        <section className="app-panel p-6 sm:p-8">
          <JobPostForm submitLabel="Create Job Post" onSubmit={handleCreate} />
        </section>
      </div>
    </main>
  );
}

