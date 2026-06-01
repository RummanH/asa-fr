import Link from "next/link";
import AuthPageShell from "@/components/forms/auth-page-shell";
import { AuthLayout } from "@/components/forms/auth-layout";

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <AuthLayout
        title="Create your account"
        subtitle="Choose the best path for your role, then get started with hiring, messaging, and managing qualified teachers."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            href="/register/teacher"
            className="group flex flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-teal hover:bg-white hover:shadow-[0_20px_55px_rgba(5,47,68,0.08)]"
          >
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-sky/15 text-brand-navy text-xl font-black">
                T
              </div>
              <h3 className="text-xl font-semibold text-brand-navy">Teacher account</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Create a profile, showcase your skills, and connect with institutions that need your expertise.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal transition group-hover:text-brand-navy">
              Start as Teacher
              <span aria-hidden>→</span>
            </span>
          </Link>

          <Link
            href="/register/institution"
            className="group flex flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-teal hover:bg-white hover:shadow-[0_20px_55px_rgba(5,47,68,0.08)]"
          >
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-gold/15 text-brand-navy text-xl font-black">
                I
              </div>
              <h3 className="text-xl font-semibold text-brand-navy">Institution account</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Register your school or academy and start posting jobs, reviewing candidates, and hiring with ease.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition group-hover:text-brand-navy">
              Start as Institution
              <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </AuthLayout>
    </AuthPageShell>
  );
}
