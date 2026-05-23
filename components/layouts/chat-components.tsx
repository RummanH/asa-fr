"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { Send, Paperclip } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "other";
  content: string;
  timestamp?: string;
  avatar?: string;
  name?: string;
}

export function ChatMessage({
  role,
  content,
  timestamp,
  avatar,
  name,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {!isUser && avatar && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-teal to-brand-navy flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {avatar}
        </div>
      )}

      <div className={`max-w-xs ${isUser ? "lg:max-w-md" : ""}`}>
        {!isUser && name && (
          <p className="text-xs font-semibold text-brand-navy mb-1">{name}</p>
        )}
        <motion.div
          className={`px-4 py-3 rounded-lg ${
            isUser
              ? "bg-gradient-to-r from-brand-navy to-brand-teal text-white rounded-br-none"
              : "bg-slate-100 text-brand-navy rounded-bl-none"
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <p className="text-sm break-words">{content}</p>
        </motion.div>
        {timestamp && (
          <p className={`text-xs mt-1 ${isUser ? "text-right" : ""} text-brand-navy/50`}>
            {timestamp}
          </p>
        )}
      </div>
    </motion.div>
  );
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isSubmitting = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
      onChange("");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="border-t border-slate-200 bg-white p-4 flex gap-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        type="button"
        className="p-2 rounded-lg hover:bg-brand-light text-brand-navy/60 hover:text-brand-navy transition-colors"
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={isSubmitting}
        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20 disabled:opacity-50"
      />

      <motion.button
        type="submit"
        disabled={!value.trim() || isSubmitting}
        className="p-2 rounded-lg bg-brand-navy text-white hover:bg-brand-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Send className="w-5 h-5" />
      </motion.button>
    </motion.form>
  );
}

interface ConversationListItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar?: string;
  unread?: number;
  onClick?: () => void;
  isActive?: boolean;
}

export function ConversationListItem({
  name,
  lastMessage,
  timestamp,
  avatar,
  unread,
  onClick,
  isActive,
}: ConversationListItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left px-4 py-4 border-b border-slate-100 hover:bg-brand-light/40 transition-colors ${
        isActive ? "bg-brand-light/60 border-l-4 border-l-brand-teal" : ""
      }`}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-center gap-3">
        {avatar && (
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-teal to-brand-navy flex items-center justify-center text-white font-semibold flex-shrink-0">
            {avatar}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-brand-navy truncate">{name}</h3>
            <span className="text-xs text-brand-navy/50 flex-shrink-0">{timestamp}</span>
          </div>
          <p className="text-sm text-brand-navy/60 truncate">{lastMessage}</p>
        </div>
        {unread ? (
          <motion.span
            className="w-6 h-6 rounded-full bg-brand-gold text-brand-navy text-xs font-semibold flex items-center justify-center flex-shrink-0"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        ) : null}
      </div>
    </motion.button>
  );
}
