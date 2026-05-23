import { AuthForm } from "@/components/forms/auth-form";
import { AuthLayout } from "@/components/forms/auth-layout";
import AuthPageShell from "@/components/forms/auth-page-shell";

export default function RegisterTeacherPage() {
  return (
    <AuthPageShell>
      <AuthLayout
        title="Register as Teacher"
        subtitle="Create your account to start offering your expertise"
      >
        <AuthForm mode="register" role="TEACHER" />
      </AuthLayout>
    </AuthPageShell>
  );
}
