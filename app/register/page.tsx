"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2 } from "lucide-react";
import { useAppLanguage } from "@/components/app/app-language";
import AuthPageShell from "@/components/forms/auth-page-shell";
import { AuthLayout } from "@/components/forms/auth-layout";

export default function RegisterPage() {
  const { copy } = useAppLanguage();

  return (
    <AuthPageShell>
      <AuthLayout title={copy.auth.createAccountTitle} subtitle={copy.auth.createAccountSubtitle}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/register/teacher"
            className="group flex flex-col justify-between rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcfd_100%)] p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-teal hover:shadow-[0_20px_55px_rgba(5,47,68,0.08)]"
          >
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-brand-teal/12 text-brand-teal">
                <BriefcaseBusiness size={22} />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy">{copy.auth.teacherAccount}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {copy.auth.teacherAccountDescription}
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal transition group-hover:text-brand-navy">
              {copy.auth.startAsTeacher}
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="/register/institution"
            className="group flex flex-col justify-between rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fcfbf7_100%)] p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-[0_20px_55px_rgba(5,47,68,0.08)]"
          >
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-brand-gold/16 text-brand-gold">
                <Building2 size={22} />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy">{copy.auth.institutionAccount}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {copy.auth.institutionAccountDescription}
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition group-hover:text-brand-navy">
              {copy.auth.startAsInstitution}
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </AuthLayout>
    </AuthPageShell>
  );
}
