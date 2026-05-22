"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createConversation, fetchConversations, type ConversationSummary } from "@/lib/api";
import { type UserRole } from "@/lib/auth";

type ChatInboxPageProps = {
  role: UserRole;
  accessToken: string;
};

export function ChatInboxPage({ role, accessToken }: ChatInboxPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");

  const teacherId = searchParams.get("teacherId");
  const institutionId = searchParams.get("institutionId");

  const createPayload = useMemo(() => {
    if (role === "INSTITUTION" && teacherId) return { teacherId };
    if (role === "TEACHER" && institutionId) return { institutionId };
    return null;
  }, [institutionId, role, teacherId]);

  const conversationBasePath = role === "TEACHER" ? "/teacher/messages" : "/institution/messages";
  const dashboardPath = role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard";

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        if (createPayload) {
          const conversation = await createConversation(accessToken, createPayload);
          if (!cancelled) {
            router.replace(`${conversationBasePath}/${conversation.id}`);
            return;
          }
        }
        const data = await fetchConversations(accessToken);
        if (!cancelled) setConversations(data);
      } catch (error) {
        if (!cancelled) setErrorMessage(error instanceof Error ? error.message : "Failed to load conversations");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [accessToken, conversationBasePath, createPayload, router]);

  const filtered = conversations.filter((c) => {
    const name = role === "TEACHER" ? c.institution.institutionName : c.teacher.user.name;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const avatarGradients = [
    "linear-gradient(135deg, #052f44, #075f75)",
    "linear-gradient(135deg, #075f75, #a9d3ef)",
    "linear-gradient(135deg, #03485e, #0d8fa8)",
    "linear-gradient(135deg, #04354d, #06697e)",
  ];

  return (
    <main className="app-shell min-h-screen px-3 py-5 sm:px-6 sm:py-8">
      <div className="app-container">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={dashboardPath}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-white text-brand-navy/50 transition hover:bg-brand-light hover:text-brand-navy"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="app-title text-xl">Messages</h1>
                {totalUnread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-teal px-1.5 text-[0.65rem] font-bold text-white">
                    {totalUnread}
                  </span>
                )}
              </div>
              <p className="text-[0.72rem] text-brand-navy/45">
                {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Main panel */}
        <div className="app-panel overflow-hidden">
          {/* Top accent */}
          <div
            className="h-0.5 w-full"
            style={{ background: "linear-gradient(90deg, #052f44, #075f75 50%, #a9d3ef)" }}
          />

          {/* Search bar */}
          <div className="border-b border-border px-4 py-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/30"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="app-input pl-9 text-sm"
                placeholder="Search conversations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-600">
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMessage}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-brand-navy/35">
              <svg
                className="animate-spin"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              <span className="text-xs font-medium">Loading conversations…</span>
            </div>
          )}

          {/* Empty */}
          {!isLoading && conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white shadow-sm">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a9d3ef"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-navy/70">No conversations yet</p>
                <p className="mt-1 text-xs text-brand-navy/40">Start a chat from teacher or job pages.</p>
              </div>
            </div>
          )}

          {/* No search results */}
          {!isLoading && conversations.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <p className="text-sm font-semibold text-brand-navy/50">No results for &quot;{search}&quot;</p>
              <button onClick={() => setSearch("")} className="text-xs text-brand-teal underline underline-offset-2">
                Clear search
              </button>
            </div>
          )}

          {/* Conversation list */}
          {!isLoading && filtered.length > 0 && (
            <div className="divide-y divide-border">
              {filtered.map((conversation, i) => {
                const partner =
                  role === "TEACHER" ? conversation.institution.institutionName : conversation.teacher.user.name;
                const partnerMeta =
                  role === "TEACHER" ? conversation.institution.user.email : conversation.teacher.user.email;
                const hasUnread = (conversation.unreadCount ?? 0) > 0;
                const lastTime = formatTime(conversation.lastMessage?.createdAt);

                return (
                  <Link
                    key={conversation.id}
                    href={`${conversationBasePath}/${conversation.id}`}
                    className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors duration-150 hover:bg-brand-light/60"
                  >
                    {/* Avatar */}
                    <div
                      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-sm"
                      style={{ background: avatarGradients[i % avatarGradients.length] }}
                    >
                      {getInitials(partner)}
                      {hasUnread && (
                        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-brand-teal" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={`truncate text-sm ${hasUnread ? "font-bold text-brand-navy" : "font-semibold text-brand-navy/80"}`}
                        >
                          {partner}
                        </span>
                        {lastTime && (
                          <span
                            className={`shrink-0 text-[0.65rem] ${hasUnread ? "font-semibold text-brand-teal" : "text-brand-navy/35"}`}
                          >
                            {lastTime}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[0.72rem] text-brand-navy/40">{partnerMeta}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-xs ${hasUnread ? "font-medium text-brand-navy/70" : "text-brand-navy/45"}`}
                        >
                          {conversation.lastMessage?.message ?? "No messages yet"}
                        </p>
                        {hasUnread && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-teal px-1.5 text-[0.6rem] font-bold text-white">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="shrink-0 text-brand-navy/20 transition group-hover:translate-x-0.5 group-hover:text-brand-teal"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
