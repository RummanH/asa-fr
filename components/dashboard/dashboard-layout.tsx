"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bell, LogOut, Menu, Settings, X } from "lucide-react";

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

function getInitials(name?: string) {
  if (!name) return "TH";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "TH";
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

  const initials = useMemo(() => getInitials(userName), [userName]);
  const roleLabel = userRole === "TEACHER" ? "Teacher" : "Institution";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(185,231,251,0.52),_transparent_22%),linear-gradient(180deg,_#f4f8fc_0%,_#edf3f8_100%)]">
      <div className="flex min-h-screen w-full gap-3 border border-white/65 bg-white/55 p-2 shadow-[0_24px_80px_rgba(16,32,51,0.12)] backdrop-blur-sm sm:gap-4 sm:p-3">
        <aside
          className={`fixed inset-y-3 left-3 z-40 flex w-[284px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#455a73] text-white shadow-[0_24px_60px_rgba(34,53,77,0.34)] transition-transform duration-300 lg:static lg:inset-auto lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-[115%]"
          }`}
        >
          <div className="border-b border-white/10 px-5 pb-5 pt-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/12">
                <Image src="/redesign/logo-mark.png" alt="Teacher Hiring Platform" width={28} height={28} priority />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">Teacher Hiring</p>
                <p className="truncate text-lg font-semibold text-white">Workspace</p>
              </div>
            </Link>
          </div>

          <div className="px-4 pt-4">
            <div className="rounded-[22px] border border-white/12 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">{roleLabel}</p>
              <p className="mt-2 truncate text-base font-semibold text-white">{userName}</p>
              <p className="mt-1 truncate text-sm text-white/62">{userEmail}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group flex min-h-12 items-center gap-3 rounded-[18px] px-4 text-sm font-medium transition ${
                    item.isActive
                      ? "bg-white text-[#22354d] shadow-[0_14px_28px_rgba(255,255,255,0.14)]"
                      : item.isHighlight
                        ? "bg-white/10 text-white hover:bg-white/14"
                        : "text-white/74 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[14px] transition ${
                      item.isActive ? "bg-[#edf3f8] text-[#22354d]" : "bg-white/6 text-current group-hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.isHighlight && !item.isActive ? <span className="h-2 w-2 rounded-full bg-brand-gold" /> : null}
                </Link>
              </div>
            ))}
          </nav>

          <div className="mt-auto border-t border-white/10 px-4 py-4">
            <div className="space-y-2">
              <Link
                href={settingsHref ?? "/profile"}
                className="flex min-h-11 items-center gap-3 rounded-[18px] px-4 text-sm font-medium text-white/76 transition hover:bg-white/8 hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-white/6">
                  <Settings size={18} />
                </span>
                Settings
              </Link>
              {onLogout ? (
                <button
                  onClick={onLogout}
                  disabled={isLoggingOut}
                  className="flex min-h-11 w-full items-center gap-3 rounded-[18px] px-4 text-left text-sm font-medium text-white/76 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-white/6">
                    <LogOut size={18} />
                  </span>
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-[#f8fbff]">
          <header className="border-b border-slate-200/80 bg-white/86 px-4 py-3 backdrop-blur sm:px-5 lg:px-7">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen((open) => !open)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="hidden min-w-0 flex-1 items-center md:flex">
                <div className="flex h-14 w-full items-center gap-3 rounded-[20px] border border-slate-200 bg-[#fbfdff] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <span className="text-sm font-medium text-slate-400">Teacher workspace</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                  <span className="truncate text-sm text-slate-500">Modern dashboard shell for jobs, messages, and hiring activity</span>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm sm:flex">
                  <Bell size={14} className="text-brand-teal" />
                  Workspace ready
                </div>
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b8f88_0%,#102033_100%)] text-sm font-semibold text-white">
                    {initials}
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
                    <p className="text-xs text-slate-500">{roleLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="p-4 sm:p-5 lg:p-7">
              {children}
            </div>
          </main>
        </div>

        {isSidebarOpen ? (
          <div className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        ) : null}
      </div>
    </div>
  );
}
