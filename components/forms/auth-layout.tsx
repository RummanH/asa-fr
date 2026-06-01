"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { redesignImages } from "@/components/landing/redesign-images";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="w-full bg-transparent">
      <motion.div
        className="relative flex min-h-[auto] lg:min-h-screen flex-col bg-brand-light/80 lg:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(11,143,136,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(243,179,61,0.16),transparent_25%)] pointer-events-none" />

        <div className="relative flex-1 flex items-center justify-center px-5 py-8 sm:px-10 lg:px-12">
          <div className="w-full max-w-5xl">
            <div className="flex flex-col gap-8 rounded-[2rem] border border-slate-200/70 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl overflow-hidden lg:grid lg:grid-cols-[minmax(420px,0.95fr)_minmax(380px,0.8fr)]">
              <div className="p-8 sm:p-10 lg:p-12">
                <div className="flex items-center justify-between gap-4 mb-10">
                  <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold text-brand-navy transition hover:text-brand-teal">
                    <span className="landing-radius relative inline-flex h-12 w-12 shrink-0 overflow-hidden border border-brand-navy/10 bg-brand-light">
                      <Image alt="Teacher Hiring Platform" className="object-contain" fill sizes="48px" src={redesignImages.logoMark} />
                    </span>
                    <span className="truncate text-sm font-black text-brand-navy">Teacher Hiring Platform</span>
                  </Link>
                  <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-teal hover:text-brand-teal">
                    Back to landing
                  </Link>
                </div>

                <div className="space-y-4">
                  <p className="inline-flex rounded-full bg-brand-sky/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal">
                    Modern auth experience
                  </p>
                  {title && <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">{title}</h1>}
                  {subtitle && <p className="max-w-xl text-base leading-7 text-slate-600">{subtitle}</p>}
                </div>

                <div className="mt-10">{children}</div>
              </div>

              <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-brand-navy via-brand-teal to-brand-sky p-10 text-white">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),transparent_40%)]" />
                  <div className="relative space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/85">
                      Smooth hiring workflows
                    </div>
                    <h2 className="text-3xl font-bold leading-tight">Bring great teachers and institutions together.</h2>
                    <p className="text-sm leading-7 text-sky-100/90">
                      A polished onboarding journey with fast registration, secure access, and helpful reminders so every user lands in the right place.
                    </p>

                    <div className="grid gap-4 rounded-[1.75rem] border border-white/15 bg-white/10 p-6">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100/90">Why it works</p>
                        <p className="text-base leading-6 text-slate-100/95">Clear, friendly steps for teachers and institutions so onboarding feels intuitive and premium.</p>
                      </div>
                      <div className="grid gap-3 text-sm leading-6 text-slate-100/85">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 h-8 w-8 rounded-2xl bg-white/15 grid place-items-center text-brand-sky">01</span>
                          <span>Fast access with secure signin and password recovery.</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="mt-1 h-8 w-8 rounded-2xl bg-white/15 grid place-items-center text-brand-sky">02</span>
                          <span>Beautiful forms with modern spacing, labels, and focus states.</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="mt-1 h-8 w-8 rounded-2xl bg-white/15 grid place-items-center text-brand-sky">03</span>
                          <span>Responsive layout that matches the landing page tone.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
