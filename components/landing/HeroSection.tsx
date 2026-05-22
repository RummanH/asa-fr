"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, MessageCircle, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "@/components/landing/Navbar";
import { fadeUp, staggerContainer } from "@/lib/animations";

const proofPoints = [
  { icon: GraduationCap, label: "Verified teacher profiles" },
  { icon: Building2, label: "Institution job posts" },
  { icon: MessageCircle, label: "Direct chat workflow" },
];

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[760px] overflow-hidden bg-brand-navy pb-28 text-white md:min-h-[820px]" id="home">
      <Image
        alt="Teacher helping students in a modern learning setting"
        className="object-cover object-[62%_center]"
        fill
        priority
        sizes="100vw"
        src="/landing/hero-main.png"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,35,52,0.98)_0%,rgba(3,47,68,0.9)_38%,rgba(3,47,68,0.45)_68%,rgba(3,47,68,0.24)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,35,52,0.2)_0%,rgba(3,35,52,0.1)_55%,rgba(3,35,52,0.7)_100%)]" />

      <Navbar />

      <div className="brand-container relative z-20 pt-16 md:pt-20 lg:pt-24">
        <motion.div
          animate="visible"
          className="max-w-3xl"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
        >
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-gold/70 bg-brand-gold px-4 py-2 text-sm font-extrabold uppercase tracking-[0.08em] text-brand-navy shadow-[0_10px_26px_rgba(245,200,75,0.4)]"
            variants={fadeUp(prefersReducedMotion, 14)}
          >
            <ShieldCheck size={16} strokeWidth={2.6} /> Modern education hiring
          </motion.span>

          <motion.h1 className="heading-xl mt-6 max-w-[11ch] text-white" variants={fadeUp(prefersReducedMotion, 22)}>
            Teacher Hiring Platform
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-8 text-white/82 md:text-lg"
            variants={fadeUp(prefersReducedMotion, 18)}
          >
            Find qualified teachers, publish institution requirements, start direct conversations, and move hiring
            requests forward from one focused marketplace.
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap items-center gap-3" variants={fadeUp(prefersReducedMotion, 16)}>
            <Link className="btn-primary bg-white px-7 py-3 text-sm font-extrabold text-brand-navy hover:bg-brand-sky md:text-base" href="/register/institution">
              Hire Teachers <ArrowRight size={18} strokeWidth={2.4} />
            </Link>
            <Link className="btn-secondary px-7 py-3 text-sm font-extrabold md:text-base" href="/register/teacher">
              Join As Teacher
            </Link>
          </motion.div>

          <motion.div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3" variants={staggerContainer(prefersReducedMotion, 0.08)}>
            {proofPoints.map(({ icon: Icon, label }) => (
              <motion.div
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md"
                key={label}
                variants={fadeUp(prefersReducedMotion, 12)}
              >
                <Icon className="text-brand-sky" size={18} strokeWidth={2.3} />
                <p className="mt-2 text-sm font-semibold leading-5 text-white/86">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
