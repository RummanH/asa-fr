import { AuthForm } from "@/components/forms/auth-form";
import { AuthPageShell } from "@/components/forms/auth-page-shell";

export default function RegisterTeacherPage() {
  return (
    <AuthPageShell>
      <AuthForm mode="register" role="TEACHER" />
    </AuthPageShell>
  );
}
