"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Menu, X, LogOut, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
    isHighlight?: boolean;
  }>;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => Promise<void>;
  isLoggingOut?: boolean;
}

export function DashboardLayout({
  children,
  navItems,
  userEmail,
  userName,
  userRole,
  onLogout,
  isLoggingOut = false,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-brand-sky/10 to-brand-teal/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-brand-teal/5 to-brand-gold/5 blur-3xl" />
      </div>

      <div className="relative flex h-screen">
        {/* Sidebar */}
        <motion.aside
          className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-slate-200/60 bg-white/80 backdrop-blur-xl transition-transform duration-300 lg:relative lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Sidebar header */}
          <div className="border-b border-slate-200/60 p-4 lg:p-6">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-navy to-brand-teal flex items-center justify-center text-white font-bold text-lg">
                TH
              </div>
              <span className="font-bold text-lg text-brand-navy hidden sm:inline">Teacher Hiring</span>
            </Link>

            {/* User info */}
            {userName && (
              <div className="mt-4 rounded-lg bg-gradient-to-br from-brand-light to-blue-50 p-3 border border-brand-sky/20">
                <p className="text-xs font-semibold text-brand-teal uppercase tracking-wider">
                  {userRole === "TEACHER" ? "Teacher" : "Institution"}
                </p>
                <p className="text-sm font-bold text-brand-navy mt-1 truncate">{userName}</p>
                <p className="text-xs text-slate-500 mt-1 truncate">{userEmail}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1 p-4 lg:p-6">
            {navItems.map((item, idx) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 relative group ${
                    item.isActive
                      ? "bg-brand-navy text-white shadow-md"
                      : item.isHighlight
                        ? "bg-brand-sky/15 text-brand-teal border border-brand-sky/30 hover:bg-brand-sky/20"
                        : "text-slate-600 hover:text-brand-navy hover:bg-slate-100"
                  }`}
                >
                  <span className={`flex items-center justify-center h-5 w-5 ${item.isActive ? "text-brand-sky" : ""}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.isHighlight && !item.isActive && (
                    <span className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-slate-200/60 p-4 lg:p-6 mt-auto space-y-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:text-brand-navy hover:bg-slate-100 transition-all duration-200"
            >
              <Settings size={18} />
              Settings
            </Link>
            {onLogout && (
              <button
                onClick={onLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
              >
                <LogOut size={18} />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        </motion.aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="flex-1 lg:flex-none" />

              {/* Top bar actions */}
              <div className="flex items-center gap-3">
                {userEmail && (
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-brand-navy">{userName}</p>
                    <p className="text-xs text-slate-500">{userRole === "TEACHER" ? "Teacher" : "Institution"}</p>
                  </div>
                )}
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-sky to-brand-teal" />
              </div>
            </div>
          </header>

          {/* Content area */}
          <main className="flex-1 overflow-y-auto">
            <motion.div
              className="p-4 lg:p-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </div>
  );
}
