import Link from "next/link";
import { AuthPageShell } from "@/components/forms/auth-page-shell";

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <div className="w-full max-w-md app-panel p-6 sm:p-8 shadow-[0_20px_55px_rgba(5,47,68,0.12)]">
        <h1 className="text-2xl font-semibold text-brand-navy">Choose registration type</h1>
        <p className="mt-2 text-sm text-brand-navy/65">
          Select how you want to join the platform.
        </p>

        <div className="mt-6 grid gap-3">
          <Link
            className="app-btn-primary justify-center"
            href="/register/teacher"
          >
            Register as Teacher
          </Link>
          <Link
            className="app-btn-secondary justify-center"
            href="/register/institution"
          >
            Register as Institution
          </Link>
        </div>
      </div>
    </AuthPageShell>
  );
}
