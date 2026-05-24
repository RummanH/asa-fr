"use client";

import { Building2, Clock3, GraduationCap, MessagesSquare } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/animations";

const stats = [
  { icon: GraduationCap, value: "3K+", label: "active teacher profiles", tone: "text-brand-teal" },
  { icon: Building2, value: "400+", label: "institution requirements", tone: "text-brand-coral" },
  { icon: MessagesSquare, value: "Direct", label: "chat before decisions", tone: "text-brand-gold" },
  { icon: Clock3, value: "Fast", label: "shorter hiring workflow", tone: "text-brand-emerald" },
];

export function StatsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative z-20 -mt-14 bg-brand-light pb-14 md:-mt-16 md:pb-20" id="stats">
      <div className="brand-container">
        <motion.div
          className="border border-white/80 bg-white/92 p-4 shadow-[0_24px_70px_rgba(7,17,31,0.1)] backdrop-blur md:p-5"
          initial="hidden"
          variants={fadeUp(prefersReducedMotion, 22)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ icon: Icon, value, label, tone }) => (
              <motion.div
                className="border border-brand-navy/8 bg-white p-5"
                key={label}
                variants={fadeUp(prefersReducedMotion, 10)}
              >
                <Icon className={tone} size={22} strokeWidth={2.4} />
                <p className="mt-5 text-3xl font-black leading-none text-brand-navy">{value}</p>
                <p className="mt-2 text-sm font-bold leading-5 text-brand-navy/60">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
