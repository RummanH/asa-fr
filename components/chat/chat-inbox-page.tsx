"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createConversation,
  fetchConversations,
  type ConversationSummary,
} from "@/lib/api";
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

  const teacherId = searchParams.get("teacherId");
  const institutionId = searchParams.get("institutionId");

  const createPayload = useMemo(() => {
    if (role === "INSTITUTION" && teacherId) {
      return { teacherId };
    }
    if (role === "TEACHER" && institutionId) {
      return { institutionId };
    }
    return null;
  }, [institutionId, role, teacherId]);

  const conversationBasePath = role === "TEACHER" ? "/teacher/messages" : "/institution/messages";

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
        if (!cancelled) {
          setConversations(data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load conversations");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [accessToken, conversationBasePath, createPayload, router]);

  const dashboardPath = role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard";

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-5xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-brand-navy">Messages</h1>
              <p className="mt-2 text-sm text-brand-navy/65">
                Your conversations with institutions and teachers.
              </p>
            </div>
            <Link
              className="app-btn-secondary"
              href={dashboardPath}
            >
              Dashboard
            </Link>
          </div>
        </section>

        <section className="app-panel p-6 sm:p-8">
          {errorMessage ? <p className="mb-2 text-sm text-red-700">{errorMessage}</p> : null}

          {isLoading ? <p className="text-sm text-brand-navy/78">Loading conversations...</p> : null}

          {!isLoading && conversations.length === 0 ? (
            <div className="app-empty">
              <p className="text-base font-medium text-brand-navy/90">No conversations yet.</p>
              <p className="mt-1 text-sm text-brand-navy/65">
                Start chat from teacher/job pages to open a conversation.
              </p>
            </div>
          ) : null}

          {!isLoading && conversations.length > 0 ? (
            <div className="grid gap-3">
              {conversations.map((conversation) => {
                const partner =
                  role === "TEACHER"
                    ? conversation.institution.institutionName
                    : conversation.teacher.user.name;
                const partnerMeta =
                  role === "TEACHER"
                    ? conversation.institution.user.email
                    : conversation.teacher.user.email;

                return (
                  <Link
                    key={conversation.id}
                    className="app-panel-muted p-4 transition hover:border-brand-teal/40"
                    href={`${conversationBasePath}/${conversation.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-brand-navy">{partner}</h2>
                        <p className="mt-1 text-sm text-brand-navy/65">{partnerMeta}</p>
                        <p className="mt-2 text-sm text-brand-navy/78">
                          {conversation.lastMessage
                            ? conversation.lastMessage.message
                            : "No messages yet."}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 ? (
                        <span className="rounded-full bg-brand-navy px-2 py-1 text-xs font-medium text-white">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

