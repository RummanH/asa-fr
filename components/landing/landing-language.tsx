"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { landingCopy, type LandingLanguage } from "@/components/landing/landing-copy";

type LandingLanguageContextValue = {
  language: LandingLanguage;
  setLanguage: (language: LandingLanguage) => void;
  copy: (typeof landingCopy)[LandingLanguage];
};

const LandingLanguageContext = createContext<LandingLanguageContextValue | null>(null);

export function LandingLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LandingLanguage>("bn");

  const value = useMemo<LandingLanguageContextValue>(
    () => ({
      language,
      setLanguage,
      copy: landingCopy[language],
    }),
    [language],
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
