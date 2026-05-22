import { AuthForm } from "@/components/forms/auth-form";
import { AuthPageShell } from "@/components/forms/auth-page-shell";

export default function LoginPage() {
  return (
    <AuthPageShell>
      <AuthForm mode="login" />
    </AuthPageShell>
  );
}
