"use client";

import { AuthForm } from "@/components/forms/auth-form";
import { useAppLanguage } from "@/components/app/app-language";
import { AuthLayout } from "@/components/forms/auth-layout";
import AuthPageShell from "@/components/forms/auth-page-shell";

export default function RegisterTeacherPage() {
  const { copy } = useAppLanguage();

  return (
    <AuthPageShell>
      <AuthLayout
        title={copy.auth.registerTeacherTitle}
        subtitle={copy.auth.registerTeacherSubtitle}
      >
        <AuthForm mode="register" role="TEACHER" />
      </AuthLayout>
    </AuthPageShell>
  );
}
