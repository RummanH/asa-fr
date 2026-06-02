import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2 } from "lucide-react";
import AuthPageShell from "@/components/forms/auth-page-shell";
import { AuthLayout } from "@/components/forms/auth-layout";

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <AuthLayout title="Create your account" subtitle="Choose your workspace and continue.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/register/teacher"
            className="group flex flex-col justify-between rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcfd_100%)] p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-teal hover:shadow-[0_20px_55px_rgba(5,47,68,0.08)]"
          >
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-brand-teal/12 text-brand-teal">
                <BriefcaseBusiness size={22} />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy">Teacher account</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Create your profile, manage requests, and connect with institutions.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal transition group-hover:text-brand-navy">
              Start as Teacher
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
              <h3 className="text-xl font-semibold text-brand-navy">Institution account</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Set up your hiring workspace, post jobs, and manage teacher outreach.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition group-hover:text-brand-navy">
              Start as Institution
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </AuthLayout>
    </AuthPageShell>
  );
}
