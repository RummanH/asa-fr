import { AuthForm } from "@/components/forms/auth-form";
import { AuthPageShell } from "@/components/forms/auth-page-shell";

export default function RegisterInstitutionPage() {
  return (
    <AuthPageShell>
      <AuthForm mode="register" role="INSTITUTION" />
    </AuthPageShell>
  );
}
