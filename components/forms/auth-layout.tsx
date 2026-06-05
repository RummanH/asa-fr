"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { LanguageToggle } from "@/components/app/language-toggle";
import { useAppLanguage } from "@/components/app/app-language";
import { ArrowLeft, BriefcaseBusiness, Building2, MessageSquareMore, ShieldCheck } from "lucide-react";
import { redesignImages } from "@/components/landing/redesign-images";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { copy } = useAppLanguage();

  return (
    <div className="w-full bg-transparent">
      <motion.div
        className="relative flex min-h-[100dvh] flex-col bg-brand-light/85 lg:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(11,143,136,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(243,179,61,0.16),transparent_25%)]" />

        <div className="relative flex flex-1 items-center justify-center px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
          <div className="grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.82fr)] lg:items-center">
            <div className="rounded-[32px] bg-white/72 p-6 backdrop-blur-xl sm:p-8 lg:min-h-[calc(100dvh-2.5rem)] lg:rounded-[36px] lg:p-10">
              <div className="mb-8 flex items-center justify-between gap-4">
                <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold text-brand-navy transition hover:text-brand-teal">
                  <span className="landing-radius relative inline-flex h-12 w-12 shrink-0 overflow-hidden border border-brand-navy/10 bg-brand-light">
                    <Image alt="Al Asatizah" className="object-contain" fill sizes="48px" src={redesignImages.logoMark} />
                  </span>
                  <span className="truncate text-sm font-black text-brand-navy">Al Asatizah</span>
                </Link>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-teal hover:text-brand-teal"
                  >
                    <ArrowLeft size={16} />
                    {copy.common.back}
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <p className="inline-flex rounded-full border border-brand-sky/30 bg-brand-sky/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-teal">
                  {copy.auth.accountAccess}
                </p>
                {title ? <h1 className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">{title}</h1> : null}
                {subtitle ? <p className="max-w-xl text-base leading-7 text-slate-600">{subtitle}</p> : null}
              </div>

              <div className="mt-10">{children}</div>
            </div>

            <div className="hidden lg:flex lg:justify-center">
              <div className="relative w-full max-w-sm rounded-[36px] bg-[linear-gradient(180deg,#07111f_0%,#0b3d47_52%,#0b8f88_100%)] p-8 text-white shadow-[0_36px_90px_rgba(16,32,51,0.18)]">
                <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),transparent_40%)]" />
                <div className="relative space-y-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/85">
                    Al Asatizah
                  </div>
                  <h2 className="text-3xl font-semibold leading-tight">Simple access for teachers and institutions.</h2>
                  <p className="text-sm leading-7 text-sky-100/90">
                    Clean onboarding, secure access, and a direct path into the real workspace.
                  </p>

                  <div className="grid gap-4 rounded-[28px] border border-white/15 bg-white/10 p-6">
                    <div className="grid gap-3 text-sm leading-6 text-slate-100/90">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-[16px] bg-white/12 text-brand-sky">
                          <ShieldCheck size={18} />
                        </span>
                        <div>
                          <p className="font-semibold text-white">Secure access</p>
                          <p className="text-sky-100/80">Protected sign in and direct dashboard routing.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-[16px] bg-white/12 text-brand-sky">
                          <MessageSquareMore size={18} />
                        </span>
                        <div>
                          <p className="font-semibold text-white">Fast onboarding</p>
                          <p className="text-sky-100/80">Clear forms with focused inputs and quick next steps.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                      <div className="rounded-[20px] border border-white/10 bg-white/8 p-4">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[16px] bg-white/12 text-brand-sky">
                          <BriefcaseBusiness size={18} />
                        </div>
                        <p className="text-sm font-semibold text-white">Teachers</p>
                        <p className="mt-1 text-xs leading-5 text-sky-100/75">Profiles, jobs, requests</p>
                      </div>
                      <div className="rounded-[20px] border border-white/10 bg-white/8 p-4">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[16px] bg-white/12 text-brand-sky">
                          <Building2 size={18} />
                        </div>
                        <p className="text-sm font-semibold text-white">Institutions</p>
                        <p className="mt-1 text-xs leading-5 text-sky-100/75">Hiring, messaging, review</p>
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
