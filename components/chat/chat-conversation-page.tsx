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

export function ChatConversationPage({
  role,
  accessToken,
  currentUserId,
}: ChatConversationPageProps) {
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const inboxPath = useMemo(
    () => (role === "TEACHER" ? "/teacher/messages" : "/institution/messages"),
    [role],
  );

  useEffect(() => {
    if (!conversationId) {
      return;
    }

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
          setErrorMessage(
            error instanceof Error ? error.message : "Failed to load conversation",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, [accessToken, conversationId]);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const socket = createChatSocket(accessToken);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("conversation:join", { conversationId });
    });

    socket.on("message:created", (incoming: ConversationMessage) => {
      setMessages((previous) => upsertMessage(previous, incoming));

      if (incoming.senderId !== currentUserId) {
        void markConversationAsRead(accessToken, conversationId);
      }
    });

    socket.on("conversation:read", (payload: { conversationId: string; readerId: string }) => {
      if (payload?.conversationId !== conversationId) {
        return;
      }

      setMessages((previous) =>
        previous.map((message) =>
          message.senderId === currentUserId ? { ...message, isRead: true } : message,
        ),
      );
    });

    return () => {
      socket.emit("conversation:leave", { conversationId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, conversationId, currentUserId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = inputMessage.trim();
    if (!content || !conversationId) {
      return;
    }

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
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-red-700">Invalid conversation id.</p>
          <Link
            className="mt-4 inline-block app-btn-secondary"
            href={inboxPath}
          >
            Back to Messages
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-4xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-brand-navy">Conversation</h1>
            <Link
              className="app-btn-secondary"
              href={inboxPath}
            >
              Back to Messages
            </Link>
          </div>
          <p className="mt-2 text-sm text-brand-navy/65">
            Send and receive messages in real time via socket with REST fallback.
          </p>
        </section>

        <section className="app-panel p-4 sm:p-5">
          {errorMessage ? <p className="mb-2 text-sm text-red-700">{errorMessage}</p> : null}

          <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-[#d7e7ef] section-soft p-4">
            {isLoading ? <p className="text-sm text-brand-navy/78">Loading messages...</p> : null}

            {!isLoading && messages.length === 0 ? (
              <p className="text-sm text-brand-navy/78">No messages yet. Start the conversation.</p>
            ) : null}

            {!isLoading && messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((message) => {
                  const isMine = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-[0_6px_20px_rgba(5,47,68,0.08)] ${
                          isMine
                            ? "bg-brand-navy text-white"
                            : "border border-[#d7e7ef] bg-white text-brand-navy"
                        }`}
                      >
                        <p>{message.message}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            isMine ? "text-white/70" : "text-brand-navy/55"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>
            ) : null}
          </div>

          <form className="mt-3 flex gap-2" onSubmit={handleSendMessage}>
            <input
              className="app-input flex-1"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
            />
            <button
              className="app-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSending}
              type="submit"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function upsertMessage(
  previous: ConversationMessage[],
  incoming: ConversationMessage,
): ConversationMessage[] {
  const existingIndex = previous.findIndex((message) => message.id === incoming.id);

  if (existingIndex === -1) {
    return [...previous, incoming];
  }

  const next = [...previous];
  next[existingIndex] = incoming;
  return next;
}

