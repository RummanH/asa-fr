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
      <div className="w-full h-full flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground">Invalid conversation ID</p>
            <Link
              className="inline-block mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              href={inboxPath}
            >
              ← Back to Messages
            </Link>
          </div>
        </div>
      </div>
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

  const partnerName = messages.find((m) => m.senderId !== currentUserId)?.sender?.name ?? "Conversation";
  const partnerRole = messages.find((m) => m.senderId !== currentUserId)?.sender?.role ?? "INSTITUTION";

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/80 shadow-sm">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={inboxPath}
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
              <p className="text-sm font-semibold text-foreground truncate">{partnerName}</p>
              <p className="text-xs text-muted-foreground truncate">{partnerRole === "TEACHER" ? "Teacher chat" : "Institution chat"}</p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                isConnected
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${isConnected ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
              />
              {isConnected ? "Live" : "Connecting"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-background px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 min-h-0">
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in-up">
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
            <span>{errorMessage}</span>
          </div>
        )}

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
            <span className="text-sm font-medium text-muted-foreground">Loading messages…</span>
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
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
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground mt-1">Send the first message below</p>
            </div>
          </div>
        )}

        {!isLoading && groupedMessages.length > 0 && (
          <div className="space-y-6">
            {groupedMessages.map(({ date, items }) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-border" />
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {date}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-3">
                  {items.map((message, idx) => {
                    const isMine = message.senderId === currentUserId;
                    const isFirst = idx === 0 || items[idx - 1]?.senderId !== message.senderId;
                    const isLast = idx === items.length - 1 || items[idx + 1]?.senderId !== message.senderId;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isMine ? "justify-end" : "justify-start"} animate-fade-in-up`}
                      >
                        {!isMine && (
                          <div
                            className={`h-8 w-8 rounded-lg flex-shrink-0 ${
                              isLast
                                ? "flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-teal-500 to-teal-600"
                                : "opacity-0"
                            }`}
                          >
                            {isLast ? "T" : ""}
                          </div>
                        )}

                        <div className={`flex max-w-[82%] ${isMine ? "flex-row-reverse" : "flex-row"} gap-2`}>
                          <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                            <div
                              className={`px-4 py-3 rounded-3xl text-sm leading-relaxed ${
                                isMine
                                  ? "bg-primary text-primary-foreground rounded-br-none shadow-xl"
                                  : "bg-white border border-border text-foreground rounded-bl-none shadow-sm"
                              }`}
                            >
                              {message.message}
                            </div>

                            {isLast && (
                              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground px-1">
                                <span>{formatTime(message.createdAt)}</span>
                                {isMine && (
                                  <span className={message.isRead ? "text-primary" : "text-muted-foreground"}>
                                    {message.isRead ? (
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    ) : (
                                      <svg
                                        width="14"
                                        height="14"
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
      <div className="flex-shrink-0 border-t border-border bg-card/90 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="h-20 px-4 sm:px-6 py-4 flex items-center gap-3">
          <input
            ref={inputRef}
            className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50"
            placeholder="Type a message…"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isSending ? (
              <svg
                className="animate-spin"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
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
    </div>
  );
}

function upsertMessage(previous: ConversationMessage[], incoming: ConversationMessage): ConversationMessage[] {
  const existingIndex = previous.findIndex((m) => m.id === incoming.id);
  if (existingIndex === -1) return [...previous, incoming];
  const next = [...previous];
  next[existingIndex] = incoming;
  return next;
}
