"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CTASection } from "@/components/landing/CTASection";
import { ContactSection } from "@/components/landing/ContactSection";
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
import { fetchMe } from "@/lib/api";
import { clearSession, getAccessToken, resolveDashboardPath } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    let isActive = true;

    void Promise.resolve().then(async () => {
      if (!isActive) return;

      setIsRedirecting(true);
      try {
        const user = await fetchMe(token);
        if (isActive) {
          router.replace(resolveDashboardPath(user.role));
        }
      } catch {
        clearSession();
        if (isActive) {
          setIsRedirecting(false);
        }
      }
    });

    return () => {
      isActive = false;
    };
  }, [router]);

  if (isRedirecting) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #07111f 0%, #0b3d47 50%, #0b8f88 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 border-2 border-white/10" />
            <div
              className="absolute inset-0 border-2 border-transparent"
              style={{
                borderTopColor: "#b9e7fb",
                borderRightColor: "rgba(185,231,251,0.3)",
                animation: "spin 0.9s cubic-bezier(0.5,0,0.5,1) infinite",
              }}
            />
            <div className="absolute inset-[14px] bg-brand-sky/70" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-sky">Redirecting...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-brand-light">
      <HeroSection />
      <StatsSection />
      <LearningFlexibilitySection />
      <PopularOpportunitiesSection />
      <HowItWorksSection />
      <PlatformBenefitsSection />
      <TeacherInstitutionSection />
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
