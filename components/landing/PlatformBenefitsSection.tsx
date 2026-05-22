"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const benefits = [
  {
    title: "Verified Profiles",
    description:
      "Teachers and institutions can create professional profiles with clear hiring details.",
    image: "/landing-2/benefit-1.png",
  },
  {
    title: "Direct Communication",
    description:
      "Both sides can chat directly before sending or responding to hiring requests.",
    image: "/landing-2/benefit-2.png",
  },
  {
    title: "Faster Hiring",
    description:
      "Institutions can quickly find available teachers that match role requirements.",
    image: "/landing-2/benefit-3.png",
  },
  {
    title: "Flexible Opportunities",
    description:
      "Teachers can explore full-time, part-time, online, and offline opportunities.",
    image: "/landing-2/benefit-4.png",
  },
];

export function PlatformBenefitsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="section-soft py-20 md:py-24 lg:py-28">
      <div className="brand-container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span className="badge-soft" variants={fadeUp(prefersReducedMotion, 10)}>
            Why Choose Us
          </motion.span>
          <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
            A Smarter Way To Connect Teachers And Institutions
          </motion.h2>
          <motion.p className="paragraph-soft mt-4 text-base md:text-lg" variants={fadeUp(prefersReducedMotion, 12)}>
            Built for modern education recruitment, the platform simplifies teacher discovery,
            communication, and hiring decisions.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {benefits.map((benefit) => (
            <motion.article
              className="brand-card brand-card-hover flex h-full flex-col overflow-hidden rounded-[1.5rem] shadow-[0_14px_40px_rgba(4,48,70,0.11)]"
              key={benefit.title}
              variants={scaleIn(prefersReducedMotion)}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.015 }}
              transition={{ duration: 0.24 }}
            >
              <div className="relative h-44 w-full">
                <Image alt={benefit.title} className="h-full w-full object-cover" fill src={benefit.image} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold tracking-[-0.02em] text-brand-navy">
                  {benefit.title}
                </h3>
                <p className="paragraph-soft mt-3 text-sm leading-7">{benefit.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
