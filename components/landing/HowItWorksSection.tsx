"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";
import { redesignImages } from "@/components/landing/redesign-images";
import { useLandingLanguage } from "@/components/landing/landing-language";

const steps = [
  {
    number: "01",
    image: redesignImages.stepOne,
  },
  {
    number: "02",
    image: redesignImages.stepTwo,
  },
  {
    number: "03",
    image: redesignImages.stepThree,
  },
];

export function HowItWorksSection() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

  return (
    <section className="landing-section section-soft border-y border-[#dbeaf1]" id="process">
      <div className="brand-container">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <motion.div
            className="lg:sticky lg:top-8"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              {copy.process.eyebrow}
            </motion.p>
            <motion.h2 className="heading-lg landing-section-title mt-4" variants={fadeUp(prefersReducedMotion, 16)}>
              {copy.process.title}
            </motion.h2>
            <motion.p className="landing-kicker mt-5 max-w-xl" variants={fadeUp(prefersReducedMotion, 12)}>
              {copy.process.description}
            </motion.p>
            <motion.div className="landing-radius mt-7 border border-brand-navy/10 bg-white p-5" variants={fadeUp(prefersReducedMotion, 12)}>
              <div className="flex items-center gap-3 text-sm font-black text-brand-navy">
                <CheckCircle2 className="text-brand-emerald" size={20} strokeWidth={2.4} />
                {copy.process.flow[0]}
                <ArrowRight className="text-brand-navy/32" size={16} />
                {copy.process.flow[1]}
                <ArrowRight className="text-brand-navy/32" size={16} />
                {copy.process.flow[2]}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid gap-5"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.12)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            {copy.process.steps.map((stepCopy, index) => {
              const step = steps[index] ?? steps[0];
              return (
              <motion.article
                className="landing-card grid overflow-hidden md:grid-cols-[240px_1fr]"
                key={step.number}
                variants={scaleIn(prefersReducedMotion)}
                whileHover={prefersReducedMotion ? undefined : { y: -5 }}
              >
                <div className="relative min-h-52 md:min-h-full">
                  <Image
                    alt={stepCopy.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    src={step.image}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-4xl font-black leading-none text-brand-sky">{step.number}</p>
                    <span className="landing-radius border border-brand-navy/10 bg-brand-cream px-3 py-1.5 text-xs font-black uppercase tracking-[0.06em] text-brand-navy/70">
                      {stepCopy.note}
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl font-black text-brand-navy">{stepCopy.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-brand-navy/68 md:text-base">{stepCopy.description}</p>
                </div>
              </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
