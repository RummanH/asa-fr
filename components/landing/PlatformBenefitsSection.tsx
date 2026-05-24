"use client";

import Image from "next/image";
import { CheckCircle2, ClipboardCheck, MessageSquareText, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";
import { redesignImages } from "@/components/landing/redesign-images";
import { useLandingLanguage } from "@/components/landing/landing-language";

const benefitIcons = [ShieldCheck, MessageSquareText, ClipboardCheck, SlidersHorizontal];

const benefitImages = [
  redesignImages.benefitOne,
  redesignImages.benefitTwo,
  redesignImages.benefitThree,
  redesignImages.benefitFour,
];

export function PlatformBenefitsSection() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

  return (
    <section className="landing-section bg-white">
      <div className="brand-container">
        <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            {benefitImages.map((src, index) => (
              <motion.div
                className={`landing-image relative h-44 shadow-[0_16px_38px_rgba(7,17,31,0.1)] md:h-64 ${
                  index % 2 === 1 ? "mt-8" : ""
                }`}
                key={src}
                variants={scaleIn(prefersReducedMotion)}
              >
                <Image
                  alt={`Platform workflow visual ${index + 1}`}
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
              {copy.benefits.eyebrow}
            </motion.p>
            <motion.h2 className="heading-lg landing-section-title mt-4" variants={fadeUp(prefersReducedMotion, 16)}>
              {copy.benefits.title}
            </motion.h2>
            <motion.p className="landing-kicker mt-5 max-w-xl" variants={fadeUp(prefersReducedMotion, 12)}>
              {copy.benefits.description}
            </motion.p>

            <motion.div className="mt-8 grid gap-3" variants={staggerContainer(prefersReducedMotion, 0.08)}>
              {copy.benefits.items.map(({ title, text }, index) => {
                const Icon = benefitIcons[index] ?? ShieldCheck;
                return (
                  <motion.div
                    className="landing-radius grid grid-cols-[auto_1fr] gap-3 border border-brand-navy/8 bg-brand-light p-4"
                    key={title}
                    variants={fadeUp(prefersReducedMotion, 10)}
                  >
                    <Icon className="mt-1 text-brand-teal" size={21} strokeWidth={2.4} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-brand-navy">{title}</h3>
                        <CheckCircle2 className="text-brand-emerald" size={16} strokeWidth={2.4} />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-brand-navy/66">{text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
