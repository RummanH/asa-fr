"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function CTASection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-24 lg:py-28">
      <div className="brand-container">
        <motion.div
          className="hero-gradient relative overflow-hidden rounded-[2.4rem] px-6 py-14 text-center shadow-[0_26px_75px_rgba(3,42,62,0.35)] sm:px-10 md:px-16 md:py-20"
          initial="hidden"
          variants={fadeUp(prefersReducedMotion, 24)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="bg-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-sky-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-14 bottom-0 h-52 w-52 rounded-full bg-cyan-200/25 blur-3xl" />

          <motion.div
            className="relative z-10 mx-auto max-w-4xl"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              className="text-balance text-[clamp(2rem,4.8vw,3.7rem)] font-black leading-[1.05] tracking-[-0.045em] text-white"
              variants={fadeUp(prefersReducedMotion, 16)}
            >
              Ready To Connect With The Right Teachers Or Institutions?
            </motion.h2>
            <motion.p
              className="mt-5 text-base leading-7 text-slate-100/88 md:text-lg"
              variants={fadeUp(prefersReducedMotion, 12)}
            >
              Join a modern education hiring platform built to help teachers and institutions connect, communicate, and
              complete hiring faster.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
              variants={fadeUp(prefersReducedMotion, 10)}
            >
              <motion.div
                whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              >
                <Link
                  className="btn-primary rounded-xl px-7 py-3 text-sm font-semibold md:text-base"
                  href="/register/teacher"
                >
                  Join As Teacher
                </Link>
              </motion.div>
              <motion.div
                whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              >
                <Link
                  className="btn-secondary rounded-xl px-7 py-3 text-sm font-semibold md:text-base"
                  href="/register/institution"
                >
                  Join As Institution
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

