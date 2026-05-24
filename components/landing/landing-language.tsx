"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { landingCopy, type LandingLanguage } from "@/components/landing/landing-copy";

const LANDING_LANGUAGE_STORAGE_KEY = "asa-fr-landing-language";
const LANDING_LANGUAGE_CHANGE_EVENT = "asa-fr-landing-language-change";

function getStoredLandingLanguage(): LandingLanguage {
  if (typeof window === "undefined") {
    return "bn";
  }

  const storedLanguage = window.localStorage.getItem(LANDING_LANGUAGE_STORAGE_KEY);
  return storedLanguage === "en" || storedLanguage === "bn" ? storedLanguage : "bn";
}

function setStoredLandingLanguage(language: LandingLanguage) {
  window.localStorage.setItem(LANDING_LANGUAGE_STORAGE_KEY, language);
  window.dispatchEvent(new Event(LANDING_LANGUAGE_CHANGE_EVENT));
}

function subscribeToLandingLanguage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LANDING_LANGUAGE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANDING_LANGUAGE_CHANGE_EVENT, callback);
  };
}

type LandingLanguageContextValue = {
  language: LandingLanguage;
  setLanguage: (language: LandingLanguage) => void;
  copy: (typeof landingCopy)[LandingLanguage];
};

const LandingLanguageContext = createContext<LandingLanguageContextValue | null>(null);

export function LandingLanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore<LandingLanguage>(
    subscribeToLandingLanguage,
    getStoredLandingLanguage,
    () => "bn",
  );

  const value = useMemo<LandingLanguageContextValue>(
    () => ({
      language,
      setLanguage: setStoredLandingLanguage,
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
