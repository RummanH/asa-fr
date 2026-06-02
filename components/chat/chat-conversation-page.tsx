"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Loader2, Send, Wifi, WifiOff } from "lucide-react";
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

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-[#344b66] bg-[radial-gradient(circle_at_top_left,_rgba(100,202,239,0.28),_transparent_28%),linear-gradient(135deg,#31465f_0%,#41566f_58%,#4a6079_100%)] px-5 py-5 text-white shadow-[0_28px_64px_rgba(34,53,77,0.26)] sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/76">
                {isConnected ? <Wifi size={14} className="text-[#7ce2e8]" /> : <WifiOff size={14} className="text-[#ffd57d]" />}
                {isConnected ? "Live conversation" : "Connecting"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/76">
                {partnerRole === "TEACHER" ? "Teacher chat" : "Institution chat"}
              </span>
            </div>
            <h1 className="mt-3 font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-white sm:text-[2.7rem]">
              {partnerName}
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/72 sm:text-[14px]">
              Continue the conversation in the same teacher workspace without switching to a separate messaging surface.
            </p>
          </div>

          <Link
            href={inboxPath}
            className="inline-flex min-h-11 items-center gap-2 rounded-[16px] border border-white/12 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/14"
          >
            <ArrowLeft size={16} />
            Back to inbox
          </Link>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="flex min-h-[560px] flex-col rounded-[26px] border border-slate-200 bg-white shadow-[0_16px_38px_rgba(17,34,68,0.06)] lg:h-[calc(100vh-18rem)] lg:max-h-[960px]">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Conversation</p>
              <h2 className="mt-2 font-[family:var(--font-display)] text-[1.7rem] font-semibold tracking-tight text-[#31455f]">
                Message thread
              </h2>
            </div>
            <span
              className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-xs font-semibold ${
                isConnected ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
              {isConnected ? "Connected" : "Waiting"}
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 px-5 py-5">
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
              <p className="mt-3 text-sm leading-7 text-slate-500">Send the first message below to start the conversation.</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto pr-1">
              <div className="space-y-6">
                {groupedMessages.map(({ date, items }) => (
                  <div key={date}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="rounded-full bg-[#f7faff] px-3 py-1 text-xs font-semibold text-slate-500">
                        {date}
                      </span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="space-y-3">
                      {items.map((message) => {
                        const isMine = message.senderId === currentUserId;

                        return (
                          <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[82%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                              <div
                                className={`rounded-[22px] px-4 py-3 text-sm leading-7 ${
                                  isMine
                                    ? "rounded-br-md bg-[#31465f] text-white"
                                    : "rounded-bl-md border border-slate-200 bg-[#fbfdff] text-slate-700"
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

        <form onSubmit={handleSendMessage} className="border-t border-slate-200 px-5 py-4">
          <div className="flex items-end gap-3">
            <input
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              placeholder="Type a message"
              className="h-11 flex-1 rounded-[16px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-sky/25"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#31465f] text-white transition hover:bg-[#25384f] disabled:cursor-not-allowed disabled:opacity-50"
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
