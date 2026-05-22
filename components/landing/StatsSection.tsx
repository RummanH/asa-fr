"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "3K+", label: "Available Teachers" },
  { value: "400+", label: "Institution Posts" },
  { value: "50+", label: "Successful Connections" },
];

export function StatsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative -mt-10 pb-16 md:-mt-16 md:pb-24" id="stats">
      <div className="brand-container">
        <motion.div
          className="section-blue brand-card rounded-[2.3rem] px-6 py-10 shadow-[0_20px_55px_rgba(3,54,81,0.16)] sm:px-8 md:rounded-[2.8rem] md:px-11 md:py-14"
          initial="hidden"
          variants={fadeUp(prefersReducedMotion, 24)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid gap-9 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-11">
            <motion.div
              variants={staggerContainer(prefersReducedMotion, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.p
                className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-navy/70"
                variants={fadeUp(prefersReducedMotion, 14)}
              >
                Platform Snapshot
              </motion.p>
              <motion.h2 className="heading-lg mt-3 max-w-lg text-brand-navy" variants={fadeUp(prefersReducedMotion, 20)}>
                Trusted by institutions and teachers for faster recruitment.
              </motion.h2>
              <motion.p
                className="paragraph-soft mt-4 max-w-md text-brand-navy/80 md:text-base md:leading-7"
                variants={fadeUp(prefersReducedMotion, 16)}
              >
                From job posts to direct chat and hiring requests, the platform keeps the full
                teacher hiring workflow in one place.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4"
              initial="hidden"
              variants={staggerContainer(prefersReducedMotion, 0.12)}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {stats.map((item) => (
                <motion.article
                  className="brand-card brand-card-hover rounded-[1.6rem] p-5 text-center shadow-[0_14px_38px_rgba(5,52,78,0.14)] md:p-6"
                  key={item.label}
                  variants={scaleIn(prefersReducedMotion)}
                  whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }}
                  transition={{ duration: 0.24 }}
                >
                  <p className="stat-number">{item.value}</p>
                  <p className="mt-2 text-sm font-semibold text-brand-navy/75">{item.label}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}




