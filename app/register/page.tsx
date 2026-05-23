import Link from "next/link";
import AuthPageShell from "@/components/forms/auth-page-shell";
import { AuthLayout } from "@/components/forms/auth-layout";

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <AuthLayout
        title="Join Our Platform"
        subtitle="Choose how you want to join - as a Teacher or Institution"
      >
        <div className="w-full space-y-3">
          <Link 
            className="app-btn-primary h-11 justify-center flex items-center"
            href="/register/teacher"
          >
            Register as Teacher
          </Link>
          <Link 
            className="app-btn-secondary h-11 justify-center flex items-center"
            href="/register/institution"
          >
            Register as Institution
          </Link>
        </div>
      </AuthLayout>
    </AuthPageShell>
  );
}
