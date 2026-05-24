"use client";

import Image from "next/image";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";
import { redesignImages } from "@/components/landing/redesign-images";
import { useLandingLanguage } from "@/components/landing/landing-language";

export function FAQSection() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

  return (
    <section className="landing-section bg-white" id="faq">
      <div className="brand-container">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <motion.div
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              {copy.faq.eyebrow}
            </motion.p>
            <motion.h2 className="heading-lg landing-section-title mt-4" variants={fadeUp(prefersReducedMotion, 16)}>
              {copy.faq.title}
            </motion.h2>
            <motion.p className="landing-kicker mt-5 max-w-xl" variants={fadeUp(prefersReducedMotion, 12)}>
              {copy.faq.description}
            </motion.p>
            <motion.div className="landing-image relative mt-8 h-64 shadow-[0_18px_48px_rgba(7,17,31,0.1)]" variants={scaleIn(prefersReducedMotion)}>
              <Image
                alt="Teacher hiring questions"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                src={redesignImages.faqCover}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.08)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            {copy.faq.items.map((item, index) => (
              <motion.details
                className="group landing-card overflow-hidden p-5 open:border-brand-sky"
                key={item.question}
                open={index === 0}
                variants={fadeUp(prefersReducedMotion, 10)}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-brand-navy">
                  <span className="flex min-w-0 items-center gap-3">
                    <HelpCircle className="shrink-0 text-brand-teal" size={19} strokeWidth={2.4} />
                    <span>{item.question}</span>
                  </span>
                  <ChevronDown className="shrink-0 text-brand-teal transition group-open:rotate-180" size={20} strokeWidth={2.4} />
                </summary>
                <p className="mt-3 pl-8 text-sm leading-7 text-brand-navy/68 md:text-base">{item.answer}</p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
