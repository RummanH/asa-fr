"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useLandingLanguage } from "@/components/landing/landing-language";

export function ObjectiveSection() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

  return (
    <section className="bg-brand-light pb-12 pt-3 md:pb-16 md:pt-4">
      <div className="brand-container">
        <motion.div
          className="landing-radius border border-brand-navy/10 bg-white p-6 shadow-[0_18px_44px_rgba(7,17,31,0.08)] md:p-8"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
            {copy.objective.eyebrow}
          </motion.p>
          <motion.p
            className="mt-4 text-lg font-semibold leading-9 text-brand-navy md:text-xl"
            variants={fadeUp(prefersReducedMotion, 14)}
          >
            {copy.objective.description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
