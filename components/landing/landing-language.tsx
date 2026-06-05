"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAppLanguage } from "@/components/app/app-language";
import { landingCopy, type LandingLanguage } from "@/components/landing/landing-copy";

type LandingLanguageContextValue = {
  language: LandingLanguage;
  setLanguage: (language: LandingLanguage) => void;
  copy: (typeof landingCopy)[LandingLanguage];
};

const LandingLanguageContext = createContext<LandingLanguageContextValue | null>(null);

export function LandingLanguageProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useAppLanguage();

  const value = useMemo<LandingLanguageContextValue>(
    () => ({
      language: language as LandingLanguage,
      setLanguage: (nextLanguage) => setLanguage(nextLanguage),
      copy: landingCopy[language],
    }),
    [language, setLanguage],
  );

  return (
    <LandingLanguageContext.Provider value={value}>
      <div lang={language === "bn" ? "bn" : "en"}>{children}</div>
    </LandingLanguageContext.Provider>
  );
}

export function useLandingLanguage() {
  const context = useContext(LandingLanguageContext);
  if (!context) {
    throw new Error("useLandingLanguage must be used within LandingLanguageProvider");
  }
  return context;
}
