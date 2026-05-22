"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast-provider";
import {
  createHireRequest,
  fetchInstitutionJobPosts,
  type JobPost,
} from "@/lib/api";

type SendHireRequestButtonProps = {
  accessToken: string;
  teacherId: string;
  buttonClassName: string;
  disabled?: boolean;
  disabledLabel?: string;
};

export function SendHireRequestButton({
  accessToken,
  teacherId,
  buttonClassName,
  disabled = false,
  disabledLabel = "Send Hire Request",
}: SendHireRequestButtonProps) {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [selectedJobPostId, setSelectedJobPostId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeJobPosts = useMemo(
    () => jobPosts.filter((post) => post.status === "ACTIVE"),
    [jobPosts],
  );

  async function openModal() {
    setIsOpen(true);
    setIsLoadingJobs(true);

    try {
      const posts = await fetchInstitutionJobPosts(accessToken, { status: "ACTIVE" });
      setJobPosts(posts);
      setSelectedJobPostId(posts[0]?.id ?? "");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to load job posts", "error");
    } finally {
      setIsLoadingJobs(false);
    }
  }

  async function handleSubmit() {
    if (!selectedJobPostId) {
      showToast("Please select a job post.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await createHireRequest(accessToken, {
        teacherId,
        jobPostId: selectedJobPostId,
        message: message.trim() || undefined,
      });

      setIsOpen(false);
      setMessage("");
      showToast("Hire request sent successfully.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to send hire request", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (disabled) {
    return (
      <button
        className="app-btn-secondary px-3 py-1.5 text-sm opacity-60 disabled:cursor-not-allowed"
        type="button"
        disabled
      >
        {disabledLabel}
      </button>
    );
  }

  return (
    <>
      <button className={buttonClassName} type="button" onClick={() => void openModal()}>
        Send Hire Request
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/45 p-4 backdrop-blur-[2px]">
          <div className="brand-card w-full max-w-lg rounded-2xl bg-white p-6 shadow-[0_28px_80px_rgba(5,47,68,0.24)]">
            <h3 className="text-lg font-semibold text-brand-navy">Send Hire Request</h3>
            <p className="mt-1 text-sm text-brand-navy/65">
              Choose one of your job posts and send a request.
            </p>

            <div className="mt-4 space-y-3">
              {isLoadingJobs ? (
                <p className="text-sm text-brand-navy/78">Loading your job posts...</p>
              ) : null}

              {!isLoadingJobs && activeJobPosts.length === 0 ? (
                <p className="text-sm text-red-700">
                  No active job posts found. Create an active job post first.
                </p>
              ) : null}

              {!isLoadingJobs && activeJobPosts.length > 0 ? (
                <select
                  className="app-input"
                  value={selectedJobPostId}
                  onChange={(event) => setSelectedJobPostId(event.target.value)}
                >
                  {activeJobPosts.map((post) => (
                    <option key={post.id} value={post.id}>
                      {post.title} ({post.subject} - {post.classLevel})
                    </option>
                  ))}
                </select>
              ) : null}

              <textarea
                className="app-textarea h-28"
                placeholder="Optional message to teacher"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                className="app-btn-secondary"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="app-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={isSubmitting || isLoadingJobs || activeJobPosts.length === 0}
                onClick={() => void handleSubmit()}
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

