"use client";

import { AuthForm } from "@/components/forms/auth-form";
import { useAppLanguage } from "@/components/app/app-language";
import { AuthLayout } from "@/components/forms/auth-layout";
import AuthPageShell from "@/components/forms/auth-page-shell";

export default function RegisterInstitutionPage() {
  const { copy } = useAppLanguage();

  return (
    <AuthPageShell>
      <AuthLayout
        title={copy.auth.registerInstitutionTitle}
        subtitle={copy.auth.registerInstitutionSubtitle}
      >
        <AuthForm mode="register" role="INSTITUTION" />
      </AuthLayout>
    </AuthPageShell>
  );
}
