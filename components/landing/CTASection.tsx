"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { redesignImages } from "@/components/landing/redesign-images";
import { useLandingLanguage } from "@/components/landing/landing-language";

export function CTASection() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

  return (
    <section className="relative overflow-hidden bg-brand-navy py-16 text-white md:py-24">
      <Image
        alt="Teacher hiring platform call to action"
        className="object-cover opacity-[0.24]"
        fill
        sizes="100vw"
        src={redesignImages.flexibilityMain}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.96)_0%,rgba(7,17,31,0.88)_52%,rgba(7,17,31,0.7)_100%)]" />
      <div className="brand-container relative z-10">
        <motion.div
          className="grid gap-9 lg:grid-cols-[1fr_0.8fr] lg:items-end"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <div>
            <motion.p className="text-sm font-black uppercase tracking-[0.08em] text-brand-sky" variants={fadeUp(prefersReducedMotion, 10)}>
              {copy.cta.eyebrow}
            </motion.p>
            <motion.h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl" variants={fadeUp(prefersReducedMotion, 16)}>
              {copy.cta.title}
            </motion.h2>
            <motion.p className="mt-5 max-w-2xl text-base leading-8 text-white/78 md:text-lg" variants={fadeUp(prefersReducedMotion, 12)}>
              {copy.cta.description}
            </motion.p>
          </div>

          <motion.div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1" variants={fadeUp(prefersReducedMotion, 10)}>
            <Link
              className="btn-primary bg-white px-6 py-3 text-sm font-black text-brand-navy hover:bg-brand-sky md:text-base"
              href="/register/institution"
            >
              <Building2 size={18} strokeWidth={2.4} />
              {copy.cta.primary}
              <ArrowRight size={18} strokeWidth={2.4} />
            </Link>
            <Link className="btn-secondary px-6 py-3 text-sm font-black md:text-base" href="/register/teacher">
              <GraduationCap size={18} strokeWidth={2.4} />
              {copy.cta.secondary}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
