"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function CTASection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="brand-container">
        <motion.div
          className="relative overflow-hidden rounded-[2rem] bg-brand-navy px-6 py-14 text-white shadow-[0_24px_72px_rgba(3,42,62,0.3)] md:px-12 md:py-[4.5rem] lg:px-16"
          initial="hidden"
          variants={fadeUp(prefersReducedMotion, 22)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <Image
            alt="Teacher hiring platform call to action"
            className="object-cover opacity-[0.22]"
            fill
            sizes="100vw"
            src="/landing/flexibility-main.png"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,47,68,0.94)_0%,rgba(5,47,68,0.82)_52%,rgba(5,47,68,0.6)_100%)]" />

          <motion.div
            className="relative z-10 max-w-3xl"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.p className="text-sm font-extrabold uppercase tracking-[0.14em] text-brand-sky" variants={fadeUp(prefersReducedMotion, 10)}>
              Start today
            </motion.p>
            <motion.h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl" variants={fadeUp(prefersReducedMotion, 16)}>
              Bring your next teacher hiring decision into one clear workflow.
            </motion.h2>
            <motion.p className="mt-5 max-w-2xl text-base leading-8 text-white/80 md:text-lg" variants={fadeUp(prefersReducedMotion, 12)}>
              Join as an institution to publish requirements, or create a teacher profile and start discovering roles.
            </motion.p>

            <motion.div className="mt-9 flex flex-wrap gap-3" variants={fadeUp(prefersReducedMotion, 10)}>
              <Link className="btn-primary bg-white px-7 py-3 text-sm font-extrabold text-brand-navy hover:bg-brand-sky md:text-base" href="/register/institution">
                Hire teachers <ArrowRight size={18} strokeWidth={2.4} />
              </Link>
              <Link className="btn-secondary px-7 py-3 text-sm font-extrabold md:text-base" href="/register/teacher">
                Join as teacher
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
