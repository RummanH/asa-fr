"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast-provider";
import { createHireRequest, fetchInstitutionJobPosts, type JobPost } from "@/lib/api";

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

  const activeJobPosts = useMemo(() => jobPosts.filter((post) => post.status === "ACTIVE"), [jobPosts]);

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
        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy/40 cursor-not-allowed select-none"
        type="button"
        disabled
      >
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
        {disabledLabel}
      </button>
    );
  }

  return (
    <>
      <button className={buttonClassName} type="button" onClick={() => void openModal()}>
        Send Hire Request
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          style={{ background: "rgba(3,24,36,0.55)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_32px_80px_rgba(5,47,68,0.28)]"
            style={{ animation: "modalIn 220ms cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            {/* Header */}
            <div className="relative overflow-hidden px-6 pt-6 pb-5">
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{ background: "linear-gradient(135deg, #052f44 0%, #075f75 100%)" }}
              />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-teal/10 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-widest text-brand-teal">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    New Request
                  </div>
                  <h3 className="app-title text-xl">Send Hire Request</h3>
                  <p className="mt-0.5 text-xs text-brand-navy/55">Select a job post and optionally add a message.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-brand-navy/40 transition hover:bg-brand-light hover:text-brand-navy"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="divider-soft" />

            {/* Body */}
            <div className="space-y-4 px-6 py-5">
              {/* Job post selector */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-navy/70 uppercase tracking-wide">
                  Job Post
                </label>
                {isLoadingJobs ? (
                  <div className="flex items-center gap-2.5 rounded-xl border border-border bg-brand-light/50 px-3.5 py-3">
                    <svg
                      className="animate-spin text-brand-teal"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span className="text-sm text-brand-navy/55">Loading job posts…</span>
                  </div>
                ) : activeJobPosts.length === 0 ? (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3">
                    <svg
                      className="mt-0.5 shrink-0 text-red-500"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-xs text-red-600">No active job posts found. Create one first.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      className="app-input appearance-none pr-10 text-sm font-medium"
                      value={selectedJobPostId}
                      onChange={(e) => setSelectedJobPostId(e.target.value)}
                    >
                      {activeJobPosts.map((post) => (
                        <option key={post.id} value={post.id}>
                          {post.title} ({post.subject} – {post.classLevel})
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/40"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-navy/70 uppercase tracking-wide">
                  Message <span className="normal-case font-normal text-brand-navy/40">(optional)</span>
                </label>
                <textarea
                  className="app-textarea h-28 resize-none text-sm"
                  placeholder="Introduce yourself or add context for the teacher…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="mt-1 text-right text-[0.68rem] text-brand-navy/35">{message.length} chars</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border bg-brand-light/40 px-6 py-4">
              <button className="app-btn-secondary text-xs" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button
                className="app-btn-primary gap-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={isSubmitting || isLoadingJobs || activeJobPosts.length === 0}
                onClick={() => void handleSubmit()}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
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
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: translateY(16px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
