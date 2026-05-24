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

const proofPoints = [
  { icon: GraduationCap, metric: "3K+", label: "teacher profiles" },
  { icon: Building2, metric: "400+", label: "institution posts" },
  { icon: MessageCircle, metric: "Direct", label: "chat before requests" },
];

const trustSignals = ["Verified education profiles", "Role-ready search", "Teacher and institution paths"];

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

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
        src="/landing/hero-main.png"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.98)_0%,rgba(7,17,31,0.9)_36%,rgba(7,17,31,0.52)_70%,rgba(7,17,31,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.08)_0%,rgba(7,17,31,0.18)_58%,rgba(7,17,31,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-light via-brand-light/82 to-transparent" />

      <Navbar />

      <div className="brand-container relative z-20 pt-12 md:pt-16 lg:pt-20">
        <motion.div
          animate="visible"
          className="max-w-4xl"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
        >
          <motion.span
            className="inline-flex items-center gap-2 border border-white/20 bg-white/92 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-brand-navy shadow-[0_18px_48px_rgba(7,17,31,0.22)] sm:text-sm"
            variants={fadeUp(prefersReducedMotion, 14)}
          >
            <Sparkles size={16} strokeWidth={2.4} /> Education hiring, redesigned
          </motion.span>

          <motion.h1 className="heading-xl mt-6 max-w-[12ch] text-white" variants={fadeUp(prefersReducedMotion, 22)}>
            Teacher Hiring Platform
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-8 text-white/84 md:text-lg"
            variants={fadeUp(prefersReducedMotion, 18)}
          >
            A premium marketplace where institutions discover qualified teachers, teachers find better opportunities,
            and both sides move from profile to chat to hiring request with less friction.
          </motion.p>

          <motion.div className="landing-action-row mt-9" variants={fadeUp(prefersReducedMotion, 16)}>
            <Link
              className="btn-primary bg-white px-6 py-3 text-sm font-black text-brand-navy hover:bg-brand-sky md:text-base"
              href="/register/institution"
            >
              Hire Teachers <ArrowRight size={18} strokeWidth={2.4} />
            </Link>
            <Link className="btn-secondary px-6 py-3 text-sm font-black md:text-base" href="/register/teacher">
              Join As Teacher
            </Link>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap gap-2"
            variants={staggerContainer(prefersReducedMotion, 0.06)}
          >
            {trustSignals.map((signal) => (
              <motion.div
                className="inline-flex items-center gap-2 border border-white/14 bg-white/10 px-3 py-2 text-sm font-bold text-white/82 backdrop-blur-md"
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
            {proofPoints.map(({ icon: Icon, metric, label }, index) => (
              <motion.div
                className="border border-white/14 bg-white/10 p-4 backdrop-blur-md"
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
                <p className="mt-4 text-2xl font-black leading-none text-white">{metric}</p>
                <p className="mt-2 text-sm font-semibold leading-5 text-white/72">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
