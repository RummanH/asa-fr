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
    "linear-gradient(135deg, #0d7d8f, #06b6d4)",
    "linear-gradient(135deg, #06b6d4, #a9d3ef)",
    "linear-gradient(135deg, #0d7d8f, #0f172a)",
    "linear-gradient(135deg, #06b6d4, #10b981)",
  ];

  return (
    <main className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={dashboardPath}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors flex-shrink-0"
            >
              <svg
                width="18"
                height="18"
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

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">Messages</h1>
                {totalUnread > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {totalUnread}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and content area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Search bar */}
        <div className="flex-shrink-0 border-b border-border bg-card px-4 sm:px-6 py-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              width="16"
              height="16"
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
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="flex-shrink-0 mx-4 sm:mx-6 mt-3 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 mt-0.5"
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
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
            <svg
              className="animate-spin text-muted-foreground"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span className="text-sm font-medium text-muted-foreground">Loading conversations…</span>
          </div>
        )}

        {/* Empty */}
        {!isLoading && conversations.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 sm:px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No conversations yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Start a chat from teacher or job pages.</p>
            </div>
          </div>
        )}

        {/* No search results */}
        {!isLoading && conversations.length > 0 && filtered.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center px-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-foreground">No results for &quot;{search}&quot;</p>
              <button
                onClick={() => setSearch("")}
                className="text-xs text-primary hover:underline mt-2"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Conversation list */}
        {!isLoading && filtered.length > 0 && (
          <div className="flex-1 overflow-y-auto">
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
                    className="group flex items-center gap-3 px-4 sm:px-6 py-3.5 transition-colors duration-150 hover:bg-muted/50 active:bg-muted"
                  >
                    {/* Avatar */}
                    <div
                      className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                      style={{ background: avatarGradients[i % avatarGradients.length] }}
                    >
                      {getInitials(partner)}
                      {hasUnread && (
                        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span
                          className={`truncate text-sm ${hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground"}`}
                        >
                          {partner}
                        </span>
                        {lastTime && (
                          <span
                            className={`flex-shrink-0 text-xs ${hasUnread ? "font-semibold text-primary" : "text-muted-foreground"}`}
                          >
                            {lastTime}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{partnerMeta}</p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-xs ${
                            hasUnread ? "font-medium text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {conversation.lastMessage?.message ?? "No messages yet"}
                        </p>
                        {hasUnread && (
                          <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="flex-shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
                      width="18"
                      height="18"
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
          </div>
        )}
      </div>
    </main>
  );
}
