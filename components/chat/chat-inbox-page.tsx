"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
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
  const activeLabel = role === "TEACHER" ? "Institution inbox" : "Teacher inbox";

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7rem)] max-w-4xl flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(17,34,68,0.08)]">
      <section className="border-b border-slate-100 bg-[linear-gradient(180deg,#fbfdff_0%,#f6fbff_100%)] px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={dashboardPath}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy transition hover:bg-brand-light"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-brand-navy sm:text-xl">Messages</p>
              <p className="truncate text-xs font-medium text-slate-500">{isLoading ? "Refreshing inbox" : activeLabel}</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-brand-light hover:text-brand-navy"
            aria-label="Conversation options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <label className="relative block min-w-0 flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </span>
            <input
              className="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-sky/25"
              placeholder="Search conversations"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-brand-light px-4 text-sm font-semibold text-brand-navy">
            <SlidersHorizontal size={16} className="text-brand-teal" />
            <span>{isLoading ? "..." : filtered.length}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white">
            All chats
            <span className="rounded-full bg-white/15 px-2 py-0.5">{isLoading ? "..." : conversations.length}</span>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-sky/35 bg-white px-4 py-2 text-xs font-semibold text-brand-navy/72">
            Unread
            <span className="rounded-full bg-brand-light px-2 py-0.5 text-brand-teal">{isLoading ? "..." : totalUnread}</span>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="mx-4 mt-4 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="min-h-0 flex-1 overflow-y-auto bg-[#f8fbfe] p-2 sm:p-3">
        {isLoading ? (
          <div className="rounded-[22px] border border-slate-200 bg-white px-6 py-12 text-center shadow-[0_12px_26px_rgba(17,34,68,0.05)]">
            <Loader2 size={24} className="mx-auto animate-spin text-slate-400" />
            <p className="mt-4 text-sm font-medium text-slate-500">Loading conversations</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-[0_12px_26px_rgba(17,34,68,0.05)]">
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
          <div className="rounded-[22px] border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-[0_12px_26px_rgba(17,34,68,0.05)]">
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
          <div className="space-y-1.5">
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
                  className={`block rounded-[22px] border px-4 py-3 transition ${
                    hasUnread
                      ? "border-brand-sky/35 bg-white shadow-[0_14px_34px_rgba(17,34,68,0.06)]"
                      : "border-transparent bg-white/82 hover:border-slate-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                      style={{
                        background:
                          index % 3 === 0
                            ? "linear-gradient(135deg,#1f3650,#365b78)"
                            : index % 3 === 1
                              ? "linear-gradient(135deg,#0b8f88,#55c7c2)"
                              : "linear-gradient(135deg,#f3b33d,#d89f26)",
                      }}
                    >
                      {getInitials(partnerName)}
                      {hasUnread ? <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-teal" /> : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className={`truncate text-[15px] ${hasUnread ? "font-bold text-brand-navy" : "font-semibold text-[#31455f]"}`}>
                            {partnerName}
                          </h3>
                          <p className="mt-0.5 truncate text-xs text-slate-400">{partnerMeta}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className={`text-[11px] ${hasUnread ? "font-semibold text-brand-teal" : "font-medium text-slate-400"}`}>
                            {formatTime(conversation.lastMessage?.createdAt)}
                          </p>
                          {hasUnread ? (
                            <span className="mt-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-brand-navy px-2 text-[11px] font-semibold text-white">
                              {conversation.unreadCount! > 9 ? "9+" : conversation.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <p className={`mt-2 line-clamp-2 text-sm leading-6 ${hasUnread ? "font-medium text-brand-navy/78" : "text-slate-500"}`}>
                        {conversation.lastMessage?.message || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
