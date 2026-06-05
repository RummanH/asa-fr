"use client";

import { AuthForm } from "@/components/forms/auth-form";
import { useAppLanguage } from "@/components/app/app-language";
import { AuthLayout } from "@/components/forms/auth-layout";
import AuthPageShell from "@/components/forms/auth-page-shell";

export default function LoginPage() {
  const { copy } = useAppLanguage();

  return (
    <AuthPageShell>
      <AuthLayout
        title={copy.auth.welcomeBack}
        subtitle={copy.auth.signInSubtitle}
      >
        <AuthForm mode="login" />
      </AuthLayout>
    </AuthPageShell>
  );
}
