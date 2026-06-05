"use client";

import { motion } from "motion/react";
import { PageLayout } from "@/components/layouts/page-layout";
import { ConversationListItem } from "@/components/layouts/chat-components";
import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";
import { ReactNode } from "react";

interface MessagePageShellProps {
  title: string;
  role: "TEACHER" | "INSTITUTION";
  conversations?: Array<{
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    avatar: string;
    unread?: number;
  }>;
  children?: ReactNode;
}

export function MessagePageShell({
  title,
  role,
  conversations = [],
  children,
}: MessagePageShellProps) {
  const dashboardPath = role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard";

  return (
    <PageLayout
      title={title}
      subtitle={`Manage your conversations with ${role === "TEACHER" ? "institutions" : "teachers"}`}
      maxWidth="full"
    >
      <div className="grid min-h-[520px] grid-cols-1 gap-6 lg:min-h-[600px] lg:grid-cols-4">
        {/* Conversations list */}
        <motion.div
          className="lg:col-span-1 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-teal" />
              <h2 className="font-semibold text-brand-navy">Conversations</h2>
            </div>
            <span className="text-xs font-semibold bg-brand-gold/20 text-brand-gold px-2 py-1 rounded">
              {conversations.length}
            </span>
          </div>

          {conversations.length > 0 ? (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {conversations.map((conv, idx) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ConversationListItem
                    name={conv.name}
                    lastMessage={conv.lastMessage}
                    timestamp={conv.timestamp}
                    avatar={conv.avatar}
                    unread={conv.unread}
                    onClick={() => {}}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MessageSquare className="w-12 h-12 text-brand-navy/20 mb-3" />
              <p className="text-sm text-brand-navy/60">No conversations yet</p>
              <Link
                href={dashboardPath}
                className="text-xs text-brand-teal hover:text-brand-navy mt-3 flex items-center gap-1"
              >
                Back to Dashboard
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Chat area */}
        <motion.div
          className="lg:col-span-3 min-h-[420px] bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children || (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-16 h-16 text-brand-navy/10 mb-4" />
              <p className="text-base font-semibold text-brand-navy">Select a conversation</p>
              <p className="text-sm text-brand-navy/60 mt-2">
                Choose a conversation from the list to view messages
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}
