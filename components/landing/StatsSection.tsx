"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "3K+", label: "Teacher profiles" },
  { value: "400+", label: "Institution posts" },
  { value: "50+", label: "Successful hires" },
];

export function StatsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative z-20 -mt-20 pb-16 md:-mt-24 md:pb-20" id="stats">
      <div className="brand-container">
        <motion.div
          className="rounded-[2rem] bg-brand-sky px-6 py-9 shadow-[0_22px_60px_rgba(4,49,72,0.2)] md:px-10 md:py-12 lg:px-14"
          initial="hidden"
          variants={fadeUp(prefersReducedMotion, 22)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <div className="grid gap-9 lg:grid-cols-[1fr_1.25fr] lg:items-center">
            <div>
              <p className="landing-eyebrow text-brand-navy/72">Trusted marketplace</p>
              <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight text-brand-navy md:text-4xl">
                Built for faster, clearer education recruitment.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-brand-navy/74 md:text-base">
                Institutions and teachers get a single place to publish needs, compare matches, chat, and confirm
                hiring requests.
              </p>
            </div>

            <motion.div
              className="grid gap-6 sm:grid-cols-3"
              initial="hidden"
              variants={staggerContainer(prefersReducedMotion, 0.1)}
              viewport={{ once: true, amount: 0.2 }}
              whileInView="visible"
            >
              {stats.map((item) => (
                <motion.div className="border-l border-brand-navy/20 pl-5" key={item.label} variants={fadeUp(prefersReducedMotion, 16)}>
                  <p className="stat-number">{item.value}</p>
                  <p className="mt-2 text-sm font-bold leading-5 text-brand-navy/72">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
