import { AuthForm } from "@/components/forms/auth-form";
import { AuthLayout } from "@/components/forms/auth-layout";
import AuthPageShell from "@/components/forms/auth-page-shell";

export default function RegisterInstitutionPage() {
  return (
    <AuthPageShell>
      <AuthLayout
        title="Register as Institution"
        subtitle="Create your account to start hiring qualified teachers"
      >
        <AuthForm mode="register" role="INSTITUTION" />
      </AuthLayout>
    </AuthPageShell>
  );
}
