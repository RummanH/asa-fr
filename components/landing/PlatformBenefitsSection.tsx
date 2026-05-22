"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const benefits = [
  "Professional profiles for teachers and institutions",
  "Direct messaging before any hiring decision",
  "Status tracking for sent and received requests",
  "Online, offline, part-time, full-time, and contract roles",
];

export function PlatformBenefitsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section section-soft">
      <div className="brand-container">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            {["/landing-2/benefit-1.png", "/landing-2/benefit-2.png", "/landing-2/benefit-3.png", "/landing-2/benefit-4.png"].map((src, index) => (
              <motion.div
                className={`landing-image relative h-48 shadow-[0_16px_38px_rgba(5,47,68,0.12)] md:h-64 ${index % 2 === 1 ? "mt-8" : ""}`}
                key={src}
                variants={scaleIn(prefersReducedMotion)}
              >
                <Image
                  alt={`Platform benefit ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 50vw, 280px"
                  src={src}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              Platform benefits
            </motion.p>
            <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
              Everything needed to make hiring decisions with confidence.
            </motion.h2>
            <motion.p className="landing-kicker mt-5 max-w-xl" variants={fadeUp(prefersReducedMotion, 12)}>
              The product brings matching, communication, and request management into one quiet workflow designed for
              repeated recruitment work.
            </motion.p>

            <motion.div className="mt-8 space-y-3" variants={staggerContainer(prefersReducedMotion, 0.08)}>
              {benefits.map((benefit) => (
                <motion.div className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 shadow-[0_10px_30px_rgba(5,47,68,0.06)]" key={benefit} variants={fadeUp(prefersReducedMotion, 10)}>
                  <CheckCircle2 className="mt-0.5 shrink-0 text-brand-teal" size={20} strokeWidth={2.4} />
                  <p className="text-sm font-semibold leading-6 text-brand-navy/78 md:text-base">{benefit}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
