"use client";

import Link from "next/link";
import { useAppLanguage } from "@/components/app/app-language";

type TermsAndConditionsContentProps = {
  compact?: boolean;
};

export function TermsAndConditionsContent({ compact = false }: TermsAndConditionsContentProps) {
  const { copy } = useAppLanguage();

  return (
    <div className={`space-y-5 text-sm leading-7 text-slate-600 ${compact ? "" : "max-w-3xl"}`}>
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">{copy.terms.title}</h1>
        <p>{copy.terms.intro}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">{copy.terms.accountTitle}</h2>
        <p>{copy.terms.accountBody}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">{copy.terms.contentTitle}</h2>
        <p>{copy.terms.contentBody}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">{copy.terms.useTitle}</h2>
        <p>{copy.terms.useBody}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">{copy.terms.hiringTitle}</h2>
        <p>{copy.terms.hiringBody}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">{copy.terms.rightsTitle}</h2>
        <p>{copy.terms.rightsBody}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">{copy.terms.acceptanceTitle}</h2>
        <p>{copy.terms.acceptanceBody}</p>
      </section>

      {!compact ? (
        <div className="border-t border-slate-200 pt-4">
          <Link href="/register" className="text-sm font-semibold text-brand-teal transition hover:text-brand-navy">
            {copy.terms.backToRegister}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
