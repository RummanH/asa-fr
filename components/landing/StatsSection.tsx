"use client";

import { Building2, Clock3, GraduationCap, MessagesSquare } from "lucide-react";
import { useLandingLanguage } from "@/components/landing/landing-language";

const statMeta = [
  { icon: GraduationCap, tone: "text-brand-teal" },
  { icon: Building2, tone: "text-brand-coral" },
  { icon: MessagesSquare, tone: "text-brand-gold" },
  { icon: Clock3, tone: "text-brand-emerald" },
];

export function StatsSection() {
  const { copy } = useLandingLanguage();

  return (
    <section className="relative z-20 -mt-14 bg-transparent pb-14 md:-mt-16 md:pb-20" id="stats">
      <div className="brand-container">
        <div
          className="landing-radius border border-white/80 bg-white/92 p-4 shadow-[0_24px_70px_rgba(7,17,31,0.1)] backdrop-blur md:p-5"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {copy.stats.map(({ value, label }, index) => {
              const { icon: Icon, tone } = statMeta[index] ?? statMeta[0];
              return (
                <div
                  className="landing-radius border border-brand-navy/8 bg-white p-5"
                  key={label}
                >
                  <Icon className={tone} size={22} strokeWidth={2.4} />
                  <p className="mt-5 text-2xl font-black leading-none text-brand-navy md:text-3xl">{value}</p>
                  <p className="mt-2 text-sm font-bold leading-5 text-brand-navy/60">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
