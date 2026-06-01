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
  settingsHref?: string;
  onLogout?: () => Promise<void>;
  isLoggingOut?: boolean;
}

export function DashboardLayout({
  children,
  navItems,
  userEmail,
  userName,
  userRole,
  settingsHref,
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
    <div className="w-full h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card overflow-y-auto transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sidebar header */}
        <div className="border-b border-border p-4 lg:p-6 sticky top-0 bg-card">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
              TH
            </div>
            <span className="font-bold text-sm text-foreground hidden sm:inline">Teacher Hiring</span>
          </Link>

          {/* User info */}
          {userName && (
            <div className="rounded-lg bg-muted p-3 border border-border">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                {userRole === "TEACHER" ? "Teacher" : "Institution"}
              </p>
              <p className="text-sm font-bold text-foreground mt-2 truncate">{userName}</p>
              <p className="text-xs text-muted-foreground mt-1 truncate">{userEmail}</p>
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
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 relative group ${
                  item.isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : item.isHighlight
                      ? "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className={`flex items-center justify-center h-5 w-5 flex-shrink-0`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.isHighlight && !item.isActive && (
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-border p-4 lg:p-6 mt-auto space-y-2 sticky bottom-0 bg-card">
          <Link
            href={settingsHref ?? "/profile"}
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          >
            <Settings size={18} />
            Settings
          </Link>
          {onLogout && (
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all duration-200 disabled:opacity-50"
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
        <header className="border-b border-border bg-card flex-shrink-0 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-4 h-16">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors"
            >
              {isSidebarOpen ? (
                <X size={20} className="text-foreground" />
              ) : (
                <Menu size={20} className="text-foreground" />
              )}
            </button>

            <div className="flex-1 lg:flex-none" />

            {/* Top bar actions */}
            <div className="flex items-center gap-3">
              {userEmail && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userRole === "TEACHER" ? "Teacher" : "Institution"}</p>
                </div>
              )}
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex-shrink-0" />
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <motion.div
            className="p-4 sm:p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.div>
        </main>
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
