"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Loader2, MoreHorizontal, Send, Wifi, WifiOff } from "lucide-react";
import { type Socket } from "socket.io-client";
import {
  fetchConversationMessages,
  markConversationAsRead,
  sendConversationMessage,
  type ConversationMessage,
} from "@/lib/api";
import { type UserRole } from "@/lib/auth";
import { createChatSocket } from "@/lib/socket";

type ChatConversationPageProps = {
  role: UserRole;
  accessToken: string;
  currentUserId: string;
};

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
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

export function ChatConversationPage({ role, accessToken, currentUserId }: ChatConversationPageProps) {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const inboxPath = useMemo(() => (role === "TEACHER" ? "/teacher/messages" : "/institution/messages"), [role]);

  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;

    async function loadMessages() {
      try {
        const data = await fetchConversationMessages(accessToken, conversationId);
        if (!cancelled) {
          setMessages(data);
          setErrorMessage("");
        }
        await markConversationAsRead(accessToken, conversationId);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load conversation");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, [accessToken, conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const socket = createChatSocket(accessToken);
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("conversation:join", { conversationId });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("message:created", (incoming: ConversationMessage) => {
      setMessages((prev) => upsertMessage(prev, incoming));
      if (incoming.senderId !== currentUserId) {
        void markConversationAsRead(accessToken, conversationId);
      }
    });

    socket.on("conversation:read", (payload: { conversationId: string; readerId: string }) => {
      if (payload?.conversationId !== conversationId) return;
      setMessages((prev) => prev.map((message) => (message.senderId === currentUserId ? { ...message, isRead: true } : message)));
    });

    return () => {
      socket.emit("conversation:leave", { conversationId });
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [accessToken, conversationId, currentUserId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = inputMessage.trim();
    if (!content || !conversationId) return;

    setIsSending(true);
    setErrorMessage("");

    try {
      const newMessage = await sendConversationMessage(accessToken, conversationId, content);
      setMessages((prev) => upsertMessage(prev, newMessage));
      setInputMessage("");
      await markConversationAsRead(accessToken, conversationId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }

  if (!conversationId) {
    return (
      <div className="rounded-[26px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-rose-700">
        Invalid conversation ID.
      </div>
    );
  }

  const groupedMessages: { date: string; items: ConversationMessage[] }[] = [];
  for (const message of messages) {
    const date = formatDate(message.createdAt);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) {
      last.items.push(message);
    } else {
      groupedMessages.push({ date, items: [message] });
    }
  }

  const partnerName = messages.find((message) => message.senderId !== currentUserId)?.sender?.name ?? "Conversation";
  const partnerRole = messages.find((message) => message.senderId !== currentUserId)?.sender?.role ?? "INSTITUTION";
  const partnerRoleLabel = partnerRole === "TEACHER" ? "Teacher" : "Institution";

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7rem)] max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(17,34,68,0.08)]">
      <section className="border-b border-slate-100 bg-[linear-gradient(180deg,#fbfdff_0%,#f6fbff_100%)] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <Link
            href={inboxPath}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy transition hover:bg-brand-light"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1f3650,#365b78)] text-sm font-bold text-white shadow-sm">
            {getInitials(partnerName)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-brand-navy sm:text-base">{partnerName}</p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
              {isConnected ? <Wifi size={13} className="text-brand-teal" /> : <WifiOff size={13} className="text-brand-gold" />}
              <span>{isConnected ? `${partnerRoleLabel} is active` : `${partnerRoleLabel} chat`}</span>
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
      </section>

      {errorMessage ? (
        <div className="mx-4 mt-4 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="flex min-h-0 flex-1 flex-col bg-[#f4f7fb]">
        <div className="min-h-0 flex-1 px-3 py-4 sm:px-5 sm:py-5">
          {isLoading ? (
            <div className="py-12 text-center">
              <Loader2 size={24} className="mx-auto animate-spin text-slate-400" />
              <p className="mt-4 text-sm font-medium text-slate-500">Loading conversation</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-[family:var(--font-display)] text-[1.6rem] font-semibold tracking-tight text-[#31455f]">
                No messages yet
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-500">Send the first message.</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-1">
              <div className="space-y-6">
                {groupedMessages.map(({ date, items }) => (
                  <div key={date}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                        {date}
                      </span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="space-y-3">
                      {items.map((message) => {
                        const isMine = message.senderId === currentUserId;

                        return (
                          <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] ${isMine ? "items-end" : "items-start"} flex flex-col sm:max-w-[78%]`}>
                              <div
                                className={`rounded-[24px] px-4 py-3 text-sm leading-7 shadow-sm ${
                                  isMine
                                    ? "rounded-br-[8px] bg-[linear-gradient(135deg,#102033_0%,#0b8f88_100%)] text-white"
                                    : "rounded-bl-[8px] border border-slate-200 bg-white text-slate-700"
                                }`}
                              >
                                {message.message}
                              </div>
                              <div className="mt-1.5 flex items-center gap-2 px-1 text-xs text-slate-400">
                                <span>{formatTime(message.createdAt)}</span>
                                {isMine ? (
                                  <span className={message.isRead ? "text-brand-teal" : "text-slate-400"}>
                                    {message.isRead ? "Read" : "Sent"}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white/92 px-3 py-3 backdrop-blur sm:px-5 sm:py-4">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex min-w-0 flex-1 items-end rounded-[24px] border border-slate-200 bg-[#f8fbfe] px-3 py-2 focus-within:border-brand-teal focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-sky/20">
              <input
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                placeholder="Type a message"
                className="min-h-10 w-full bg-transparent px-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#102033_0%,#0b8f88_100%)] text-white shadow-[0_12px_24px_rgba(11,143,136,0.26)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function upsertMessage(previous: ConversationMessage[], incoming: ConversationMessage): ConversationMessage[] {
  const index = previous.findIndex((message) => message.id === incoming.id);
  if (index === -1) return [...previous, incoming];
  const next = [...previous];
  next[index] = incoming;
  return next;
}
