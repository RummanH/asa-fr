"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "@/components/landing/Navbar";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { redesignImages } from "@/components/landing/redesign-images";
import { useLandingLanguage } from "@/components/landing/landing-language";

const proofIcons = [GraduationCap, Building2, MessageCircle];

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

  return (
    <section
      className="relative min-h-[calc(100svh-72px)] overflow-hidden bg-brand-navy pb-24 text-white md:pb-28"
      id="home"
    >
      <Image
        alt="Teacher leading students in a modern classroom"
        className="object-cover object-[64%_center]"
        fill
        priority
        sizes="100vw"
        src={redesignImages.heroMain}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.98)_0%,rgba(7,17,31,0.9)_36%,rgba(7,17,31,0.52)_70%,rgba(7,17,31,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.08)_0%,rgba(7,17,31,0.18)_58%,rgba(7,17,31,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-light via-brand-light/82 to-transparent" />

      <Navbar />

      <div className="brand-container relative z-20 pt-24 md:pt-28 lg:pt-32">
        <motion.div
          animate="visible"
          className="max-w-4xl"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
        >
          <motion.span
            className="landing-radius inline-flex items-center gap-2 border border-white/20 bg-white/92 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-brand-navy shadow-[0_18px_48px_rgba(7,17,31,0.22)] sm:text-sm"
            variants={fadeUp(prefersReducedMotion, 14)}
          >
            <Sparkles size={16} strokeWidth={2.4} /> {copy.hero.badge}
          </motion.span>

          <motion.h1 className="heading-xl mt-6 max-w-[12ch] text-white" variants={fadeUp(prefersReducedMotion, 22)}>
            {copy.hero.title}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-sm leading-7 text-white/84 md:text-base"
            variants={fadeUp(prefersReducedMotion, 18)}
          >
            {copy.hero.description}
          </motion.p>

          <motion.div className="landing-action-row mt-9" variants={fadeUp(prefersReducedMotion, 16)}>
            <Link
              className="btn-primary bg-white px-6 py-3 text-sm font-black text-brand-navy hover:bg-brand-sky md:text-base"
              href="/register/institution"
            >
              <Building2 size={18} strokeWidth={2.4} />
              {copy.hero.primary} <ArrowRight size={18} strokeWidth={2.4} />
            </Link>
            <Link className="btn-primary teacher-focus-cta px-6 py-3 text-sm font-black md:text-base" href="/register/teacher">
              <GraduationCap size={18} strokeWidth={2.4} />
              {copy.hero.secondary}
              <ArrowRight size={17} strokeWidth={2.4} />
            </Link>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap gap-2"
            variants={staggerContainer(prefersReducedMotion, 0.06)}
          >
            {copy.hero.trustSignals.map((signal) => (
              <motion.div
                className="landing-radius inline-flex items-center gap-2 border border-white/14 bg-white/10 px-3 py-2 text-sm font-bold text-white/82 backdrop-blur-md"
                key={signal}
                variants={fadeUp(prefersReducedMotion, 10)}
              >
                <CheckCircle2 size={16} className="text-brand-sky" strokeWidth={2.4} />
                {signal}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3"
            variants={staggerContainer(prefersReducedMotion, 0.08)}
          >
            {copy.hero.proofPoints.map(({ metric, label }, index) => {
              const Icon = proofIcons[index] ?? GraduationCap;
              return (
              <motion.div
                className="landing-radius border border-white/14 bg-white/10 p-4 backdrop-blur-md"
                key={label}
                variants={fadeUp(prefersReducedMotion, 12)}
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon
                    className={index === 1 ? "text-brand-gold" : index === 2 ? "text-brand-coral" : "text-brand-sky"}
                    size={20}
                    strokeWidth={2.3}
                  />
                  <ShieldCheck className="text-white/44" size={17} strokeWidth={2.2} />
                </div>
                <p className="mt-4 text-xl font-black leading-none text-white md:text-2xl">{metric}</p>
                <p className="mt-2 text-sm font-semibold leading-5 text-white/72">{label}</p>
              </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
