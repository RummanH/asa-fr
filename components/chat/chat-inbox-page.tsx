"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
} from "lucide-react";
import { createConversation, fetchConversations, type ConversationSummary } from "@/lib/api";
import { type UserRole } from "@/lib/auth";

type ChatInboxPageProps = {
  role: UserRole;
  accessToken: string;
};

function formatTime(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function ChatInboxPage({ role, accessToken }: ChatInboxPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");

  const teacherId = searchParams.get("teacherId");
  const institutionId = searchParams.get("institutionId");
  const conversationBasePath = role === "TEACHER" ? "/teacher/messages" : "/institution/messages";
  const dashboardPath = role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard";

  const createPayload = useMemo(() => {
    if (role === "INSTITUTION" && teacherId) return { teacherId };
    if (role === "TEACHER" && institutionId) return { institutionId };
    return null;
  }, [institutionId, role, teacherId]);

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
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load conversations");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [accessToken, conversationBasePath, createPayload, router]);

  const filtered = conversations.filter((conversation) => {
    const name = role === "TEACHER" ? conversation.institution.institutionName : conversation.teacher.user.name;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const totalUnread = conversations.reduce((sum, conversation) => sum + (conversation.unreadCount ?? 0), 0);

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-5 py-5 shadow-[0_18px_44px_rgba(17,34,68,0.08)] sm:px-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.9fr)] xl:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-sky/40 bg-brand-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-navy/70">
                <Sparkles size={14} className="text-brand-teal" />
                Inbox
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-sky/35 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-navy/65">
                {isLoading ? "Refreshing" : `${filtered.length} visible conversations`}
              </span>
            </div>
            <h1 className="mt-3 font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-brand-navy sm:text-[2.7rem]">
              Messages
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-[14px]">Search and continue conversations.</p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(17,34,68,0.06)]">
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Conversations</p>
              <p className="mt-2.5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-brand-navy">
                {isLoading ? "..." : conversations.length}
              </p>
            </div>
            <div className="rounded-[20px] border border-brand-sky/20 bg-brand-light px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Unread</p>
              <p className="mt-2.5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-brand-sky">
                {isLoading ? "..." : totalUnread}
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(17,34,68,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Search</p>
            <h2 className="mt-2 font-[family:var(--font-display)] text-[1.7rem] font-semibold tracking-tight text-[#31455f]">
              Conversation list
            </h2>
          </div>
          <Link
            href={dashboardPath}
            className="inline-flex min-h-11 items-center gap-2 rounded-[16px] border border-brand-sky/35 bg-brand-light px-4 text-sm font-semibold text-brand-navy transition hover:bg-white"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </div>

        <label className="relative mt-5 block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={16} />
          </span>
          <input
            className="h-11 w-full rounded-[16px] border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-sky/25"
            placeholder="Search conversations"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </section>

      {errorMessage ? (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="space-y-3">
        {isLoading ? (
          <div className="rounded-[26px] border border-slate-200 bg-white px-6 py-12 text-center shadow-[0_16px_38px_rgba(17,34,68,0.05)]">
            <Loader2 size={24} className="mx-auto animate-spin text-slate-400" />
            <p className="mt-4 text-sm font-medium text-slate-500">Loading conversations</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-[0_16px_38px_rgba(17,34,68,0.05)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eef5fb] text-brand-teal">
              <MessageSquare size={24} />
            </div>
            <h3 className="mt-5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#31455f]">
              No conversations yet
            </h3>
            <p className="mx-auto mt-3 text-sm leading-7 text-slate-500">
              New conversations will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-[0_16px_38px_rgba(17,34,68,0.05)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eef5fb] text-brand-teal">
              <Search size={24} />
            </div>
            <h3 className="mt-5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#31455f]">
              No matching conversations
            </h3>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-brand-navy px-4 text-sm font-semibold text-white transition hover:bg-brand-teal"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="rounded-[26px] border border-slate-200 bg-white shadow-[0_16px_38px_rgba(17,34,68,0.06)]">
            <div className="max-h-[calc(100vh-22rem)] overflow-y-auto p-4 sm:p-5">
              <div className="space-y-3">
                {filtered.map((conversation, index) => {
                  const partnerName =
                    role === "TEACHER" ? conversation.institution.institutionName : conversation.teacher.user.name;
                  const partnerMeta =
                    role === "TEACHER" ? conversation.institution.user.email : conversation.teacher.user.email;
                  const hasUnread = (conversation.unreadCount ?? 0) > 0;

                  return (
                    <Link
                      key={conversation.id}
                      href={`${conversationBasePath}/${conversation.id}`}
                      className="block rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(17,34,68,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(17,34,68,0.08)]"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[16px] text-sm font-semibold text-white shadow-sm"
                          style={{
                            background:
                              index % 3 === 0
                                ? "linear-gradient(135deg,#31465f,#4a6079)"
                                : index % 3 === 1
                                  ? "linear-gradient(135deg,#5fc8ec,#36b4de)"
                                  : "linear-gradient(135deg,#f3b33d,#d89f26)",
                          }}
                        >
                          {getInitials(partnerName)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-base font-semibold text-[#31455f]">{partnerName}</h3>
                              <p className="mt-1 truncate text-sm text-slate-500">{partnerMeta}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {hasUnread ? (
                                <span className="inline-flex min-h-7 items-center rounded-full bg-[#eef5fb] px-3 text-xs font-semibold text-brand-teal">
                                  {conversation.unreadCount} unread
                                </span>
                              ) : null}
                              <span className="text-xs font-medium text-slate-400">
                                {formatTime(conversation.lastMessage?.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                              {conversation.lastMessage?.message || "No messages yet"}
                            </p>
                            <span className="flex-shrink-0 text-sm font-semibold text-brand-teal">Open</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
