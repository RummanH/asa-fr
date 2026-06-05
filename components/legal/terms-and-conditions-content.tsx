import Link from "next/link";

type TermsAndConditionsContentProps = {
  compact?: boolean;
};

export function TermsAndConditionsContent({ compact = false }: TermsAndConditionsContentProps) {
  return (
    <div className={`space-y-5 text-sm leading-7 text-slate-600 ${compact ? "" : "max-w-3xl"}`}>
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-3xl">Terms and Conditions</h1>
        <p>
          These terms govern the use of Al Asatizah as a platform for institutions and teachers to connect, create
          profiles, communicate, and manage hiring activity.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">1. Account responsibility</h2>
        <p>Users must provide accurate registration information and are responsible for activity performed through their account.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">2. Profile and content accuracy</h2>
        <p>
          Teachers and institutions should keep profile information, job details, messages, and requests truthful,
          relevant, and up to date.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">3. Respectful use</h2>
        <p>
          Users must not misuse the platform, send harmful or misleading content, impersonate others, or use the
          service for unlawful activity.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">4. Hiring and communication</h2>
        <p>
          Al Asatizah facilitates connection and communication, but hiring decisions, verification, and agreements
          remain the responsibility of the teacher and institution involved.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">5. Platform rights</h2>
        <p>
          We may update platform features, moderate inappropriate content, and suspend accounts that violate these
          terms or harm the platform community.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-brand-navy">6. Acceptance</h2>
        <p>By registering, you confirm that you have read and accepted these terms and conditions.</p>
      </section>

      {!compact ? (
        <div className="border-t border-slate-200 pt-4">
          <Link href="/register" className="text-sm font-semibold text-brand-teal transition hover:text-brand-navy">
            Back to registration
          </Link>
        </div>
      ) : null}
    </div>
  );
}
