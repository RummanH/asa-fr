"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { appCopy, type AppCopy, type AppLanguage } from "@/components/app/app-copy";

const APP_LANGUAGE_STORAGE_KEY = "asa-fr-language";
const APP_LANGUAGE_CHANGE_EVENT = "asa-fr-language-change";

function getStoredAppLanguage(): AppLanguage {
  if (typeof window === "undefined") return "bn";
  const stored = window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
  return stored === "en" || stored === "bn" ? stored : "bn";
}

function setStoredAppLanguage(language: AppLanguage) {
  window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language);
  window.localStorage.setItem("asa-fr-landing-language", language);
  window.dispatchEvent(new Event(APP_LANGUAGE_CHANGE_EVENT));
  window.dispatchEvent(new Event("asa-fr-landing-language-change"));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(APP_LANGUAGE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(APP_LANGUAGE_CHANGE_EVENT, callback);
  };
}

type AppLanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  copy: AppCopy;
};

const AppLanguageContext = createContext<AppLanguageContextValue | null>(null);

export function AppLanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore<AppLanguage>(subscribe, getStoredAppLanguage, () => "bn");

  const value = useMemo<AppLanguageContextValue>(
    () => ({
      language,
      setLanguage: setStoredAppLanguage,
      copy: appCopy[language],
    }),
    [language],
  );

  return <AppLanguageContext.Provider value={value}>{children}</AppLanguageContext.Provider>;
}

export function useAppLanguage() {
  const context = useContext(AppLanguageContext);
  if (!context) throw new Error("useAppLanguage must be used within AppLanguageProvider");
  return context;
}
