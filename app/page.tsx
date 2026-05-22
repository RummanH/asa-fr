"use client";

import { CTASection } from "@/components/landing/CTASection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LearningFlexibilitySection } from "@/components/landing/LearningFlexibilitySection";
import { PlatformBenefitsSection } from "@/components/landing/PlatformBenefitsSection";
import { PopularOpportunitiesSection } from "@/components/landing/PopularOpportunitiesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { TeacherInstitutionSection } from "@/components/landing/TeacherInstitutionSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchMe } from "@/lib/api";
import { clearSession, getAccessToken, resolveDashboardPath } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      return;
    }

    fetchMe(token)
      .then((user) => {
        router.replace(resolveDashboardPath(user.role));
      })
      .catch(() => {
        clearSession();
      });
  }, [router]);

  return (
    <main className="min-h-screen overflow-x-clip bg-brand-light">
      <HeroSection />
      <StatsSection />
      <LearningFlexibilitySection />
      <PopularOpportunitiesSection />
      <HowItWorksSection />
      <PlatformBenefitsSection />
      <TeacherInstitutionSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </main>
  );
}
