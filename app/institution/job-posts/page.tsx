"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { useToast } from "@/components/ui/toast-provider";
import {
  closeJobPost,
  deleteJobPost,
  fetchInstitutionJobPosts,
  type JobType,
  type JobPost,
  type JobPostStatus,
  type JobPostsQuery,
  type TeachingMode,
} from "@/lib/api";

export default function InstitutionJobPostsPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading institution job posts...">
      {({ accessToken }) => <InstitutionJobPostsContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type InstitutionJobPostsContentProps = {
  accessToken: string;
};

function InstitutionJobPostsContent({ accessToken }: InstitutionJobPostsContentProps) {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [location, setLocation] = useState("");
  const [teachingMode, setTeachingMode] = useState<TeachingMode | "">("");
  const [jobType, setJobType] = useState<JobType | "">("");
  const [status, setStatus] = useState<JobPostStatus | "">("");

  useEffect(() => {
    fetchPosts(accessToken, buildQuery());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function fetchPosts(token: string, query: JobPostsQuery) {
    try {
      const result = await fetchInstitutionJobPosts(token, query);
      setPosts(result);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to load job posts", "error");
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
      status: status || undefined,
    };
  }

  async function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    await fetchPosts(accessToken, buildQuery());
  }

  async function handleClose(postId: string) {
    const previousPosts = posts;
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, status: "CLOSED" } : post)),
    );

    try {
      await closeJobPost(accessToken, postId);
      showToast("Job post closed successfully.", "success");
    } catch (error) {
      setPosts(previousPosts);
      showToast(error instanceof Error ? error.message : "Failed to close job post", "error");
    }
  }

  async function handleDelete(postId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this job post?");
    if (!confirmed) {
      return;
    }

    const previousPosts = posts;
    setPosts((prev) => prev.filter((post) => post.id !== postId));

    try {
      await deleteJobPost(accessToken, postId);
      showToast("Job post deleted successfully.", "success");
    } catch (error) {
      setPosts(previousPosts);
      showToast(error instanceof Error ? error.message : "Failed to delete job post", "error");
    }
  }

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-6xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-brand-navy">Institution Job Posts</h1>
              <p className="mt-2 text-sm text-brand-navy/65">
                Manage your teacher requirement advertisements.
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
                className="app-btn-primary"
                href="/institution/job-posts/create"
              >
                Create Job Post
              </Link>
            </div>
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

            <select
              className={inputClassName}
              value={status}
              onChange={(e) => setStatus(e.target.value as JobPostStatus | "")}
            >
              <option value="">Status (All)</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="CLOSED">Closed</option>
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
                  setStatus("");
                  setIsLoading(true);
                  await fetchPosts(accessToken, {});
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="app-panel p-6 sm:p-8">
          {isLoading ? <p className="text-sm text-brand-navy/78">Loading job posts...</p> : null}

          {!isLoading && posts.length === 0 ? (
            <div className="app-empty">
              <p className="text-base font-medium text-brand-navy/90">No job posts found.</p>
              <p className="mt-1 text-sm text-brand-navy/65">
                Create a job post or adjust your filters.
              </p>
            </div>
          ) : null}

          {!isLoading && posts.length > 0 ? (
            <div className="grid gap-3">
              {posts.map((post) => (
                <article key={post.id} className="app-panel-muted p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-brand-navy">{post.title}</h2>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        {post.subject} - {post.classLevel} - {formatStatus(post.status)}
                      </p>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        {post.location ?? "Location not specified"} - {formatTeachingMode(post.teachingMode)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        className="app-btn-secondary px-3 py-1.5 text-sm"
                        href={`/institution/job-posts/${post.id}/edit`}
                      >
                        Edit
                      </Link>
                      {post.status === "ACTIVE" ? (
                        <button
                          className="app-btn-secondary px-3 py-1.5 text-sm"
                          type="button"
                          onClick={() => void handleClose(post.id)}
                        >
                          Close
                        </button>
                      ) : null}
                      <button
                        className="app-btn-danger px-3 py-1.5 text-sm"
                        type="button"
                        onClick={() => void handleDelete(post.id)}
                      >
                        Delete
                      </button>
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

function formatStatus(status: JobPostStatus): string {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "CLOSED":
      return "Closed";
    default:
      return status;
  }
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


