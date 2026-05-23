import { AuthForm } from "@/components/forms/auth-form";
import { AuthLayout } from "@/components/forms/auth-layout";
import AuthPageShell from "@/components/forms/auth-page-shell";

export default function LoginPage() {
  return (
    <AuthPageShell>
      <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
      >
        <AuthForm mode="login" />
      </AuthLayout>
    </AuthPageShell>
  );
}
