"use client";

import { useAppLanguage } from "@/components/app/app-language";

type LanguageToggleProps = {
  compact?: boolean;
};

export function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { language, setLanguage, copy } = useAppLanguage();

  return (
    <div className={`grid grid-cols-2 border border-brand-navy/12 bg-white p-1 ${compact ? "rounded-[14px]" : "rounded-full"}`}>
      <button
        className={`${compact ? "rounded-[10px] px-3 py-2 text-sm" : "rounded-full px-3 py-1.5 text-xs"} font-black transition ${
          language === "en" ? "bg-brand-navy text-white" : "text-brand-navy/60 hover:text-brand-navy"
        }`}
        onClick={() => setLanguage("en")}
        type="button"
      >
        {compact ? copy.common.english : "EN"}
      </button>
      <button
        className={`${compact ? "rounded-[10px] px-3 py-2 text-sm" : "rounded-full px-3 py-1.5 text-xs"} font-black transition ${
          language === "bn" ? "bg-brand-navy text-white" : "text-brand-navy/60 hover:text-brand-navy"
        }`}
        onClick={() => setLanguage("bn")}
        type="button"
      >
        {compact ? copy.common.bangla : "বাংলা"}
      </button>
    </div>
  );
}
