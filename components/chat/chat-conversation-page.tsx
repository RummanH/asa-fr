"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

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
        if (!cancelled) setErrorMessage(error instanceof Error ? error.message : "Failed to load conversation");
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
      setMessages((prev) => prev.map((m) => (m.senderId === currentUserId ? { ...m, isRead: true } : m)));
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
      inputRef.current?.focus();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }

  if (!conversationId) {
    return (
      <main className="app-shell px-4 py-8">
        <div className="app-container">
          <div className="app-panel p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e5484d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-brand-navy">Invalid conversation ID</p>
            <Link className="app-btn-secondary mt-4 text-xs" href={inboxPath}>
              ← Back to Messages
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Group messages by date
  const groupedMessages: { date: string; items: ConversationMessage[] }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.createdAt);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) last.items.push(msg);
    else groupedMessages.push({ date, items: [msg] });
  }

  return (
    <main className="app-shell px-3 py-5 sm:px-6 sm:py-8">
      <div className="app-container flex flex-col gap-0" style={{ height: "calc(100vh - 4rem)" }}>
        {/* Header */}
        <div
          className="flex items-center justify-between gap-3 rounded-t-2xl border border-b-0 border-border bg-white px-5 py-4"
          style={{ boxShadow: "0 -2px 0 0 transparent" }}
        >
          <div className="flex items-center gap-3">
            <Link
              href={inboxPath}
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
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #052f44, #075f75)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p className="app-title text-sm">Conversation</p>
              <p className="text-[0.68rem] text-brand-navy/45 truncate max-w-[180px]">ID: {conversationId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${
                isConnected
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`}
              />
              {isConnected ? "Live" : "Connecting"}
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto border-x border-border bg-gradient-to-b from-[#f7fbfd] to-[#edf7fb] px-4 py-4 min-h-0">
          {errorMessage && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs text-red-600">
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

          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-brand-navy/40">
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
              <span className="text-xs font-medium">Loading messages…</span>
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
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
              <p className="text-xs font-semibold text-brand-navy/50">No messages yet</p>
              <p className="text-[0.7rem] text-brand-navy/35">Send the first message below</p>
            </div>
          )}

          {!isLoading && groupedMessages.length > 0 && (
            <div className="space-y-5">
              {groupedMessages.map(({ date, items }) => (
                <div key={date}>
                  {/* Date separator */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="rounded-full border border-border bg-white px-2.5 py-0.5 text-[0.65rem] font-semibold text-brand-navy/40">
                      {date}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
                  </div>

                  <div className="space-y-2">
                    {items.map((message, idx) => {
                      const isMine = message.senderId === currentUserId;
                      const isFirst = idx === 0 || items[idx - 1]?.senderId !== message.senderId;
                      const isLast = idx === items.length - 1 || items[idx + 1]?.senderId !== message.senderId;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                          style={{ marginTop: isFirst && idx !== 0 ? "0.75rem" : undefined }}
                        >
                          {/* Other user avatar placeholder */}
                          {!isMine && (
                            <div
                              className={`mr-2 mt-auto h-6 w-6 shrink-0 rounded-lg ${
                                isLast
                                  ? "flex items-center justify-center text-[0.6rem] font-bold text-white"
                                  : "opacity-0"
                              }`}
                              style={isLast ? { background: "linear-gradient(135deg, #075f75, #a9d3ef)" } : {}}
                            >
                              {isLast ? "T" : ""}
                            </div>
                          )}

                          <div className={`flex max-w-[75%] flex-col ${isMine ? "items-end" : "items-start"}`}>
                            <div
                              className={`px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                                isMine
                                  ? "rounded-2xl rounded-br-md text-white"
                                  : "rounded-2xl rounded-bl-md border border-border bg-white text-brand-navy"
                              }`}
                              style={isMine ? { background: "linear-gradient(135deg, #052f44 0%, #075f75 100%)" } : {}}
                            >
                              {message.message}
                            </div>

                            {isLast && (
                              <div
                                className={`mt-1 flex items-center gap-1 text-[0.62rem] ${isMine ? "text-brand-navy/40" : "text-brand-navy/35"}`}
                              >
                                <span>{formatTime(message.createdAt)}</span>
                                {isMine && (
                                  <span className={message.isRead ? "text-brand-teal" : "text-brand-navy/30"}>
                                    {message.isRead ? (
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    ) : (
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-2.5 rounded-b-2xl border border-t-0 border-border bg-white px-4 py-3.5"
        >
          <input
            ref={inputRef}
            className="app-input flex-1 text-sm"
            placeholder="Type a message…"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="flex h-[2.85rem] w-[2.85rem] shrink-0 items-center justify-center rounded-xl text-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #052f44, #075f75)",
              boxShadow: "0 8px 20px rgba(5,47,68,0.22)",
            }}
          >
            {isSending ? (
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
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
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

function upsertMessage(previous: ConversationMessage[], incoming: ConversationMessage): ConversationMessage[] {
  const existingIndex = previous.findIndex((m) => m.id === incoming.id);
  if (existingIndex === -1) return [...previous, incoming];
  const next = [...previous];
  next[existingIndex] = incoming;
  return next;
}
