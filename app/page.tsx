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
import { useEffect, useState } from "react";
import { fetchMe } from "@/lib/api";
import { clearSession, getAccessToken, resolveDashboardPath } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    setIsRedirecting(true);
    fetchMe(token)
      .then((user) => {
        router.replace(resolveDashboardPath(user.role));
      })
      .catch(() => {
        clearSession();
        setIsRedirecting(false);
      });
  }, [router]);

  if (isRedirecting) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #03293d 0%, #04485f 48%, #076b82 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "#a9d3ef",
                borderRightColor: "rgba(169,211,239,0.3)",
                animation: "spin 0.9s cubic-bezier(0.5,0,0.5,1) infinite",
              }}
            />
            <div className="absolute inset-[14px] rounded-full bg-brand-sky/60" />
          </div>
          <p className="text-brand-sky text-sm font-semibold tracking-widest uppercase">
            Redirecting…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

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