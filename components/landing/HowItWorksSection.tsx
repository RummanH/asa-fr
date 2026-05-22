"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const steps = [
  {
    number: "01",
    title: "Create a strong profile",
    description: "Teachers add subjects, class levels, experience, salary expectations, and teaching mode.",
    image: "/landing-2/step-1.png",
  },
  {
    number: "02",
    title: "Discover the right match",
    description: "Institutions browse teachers while teachers review active job posts and requirements.",
    image: "/landing-2/step-2.png",
  },
  {
    number: "03",
    title: "Chat and confirm",
    description: "Both sides clarify details in chat before a hiring request is accepted or declined.",
    image: "/landing-2/step-3.png",
  },
];

export function HowItWorksSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section bg-white" id="process">
      <div className="brand-container">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div
            className="lg:sticky lg:top-8"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              How it works
            </motion.p>
            <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
              From profile to hiring request in three focused steps.
            </motion.h2>
            <motion.p className="landing-kicker mt-5 max-w-xl" variants={fadeUp(prefersReducedMotion, 12)}>
              The workflow is intentionally direct: create a profile, discover matches, discuss the details, and move
              the hiring decision forward.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid gap-5"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.12)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            {steps.map((step) => (
              <motion.article
                className="landing-card grid overflow-hidden md:grid-cols-[220px_1fr]"
                key={step.number}
                variants={scaleIn(prefersReducedMotion)}
                whileHover={prefersReducedMotion ? undefined : { y: -5 }}
              >
                <div className="relative min-h-48 md:min-h-full">
                  <Image
                    alt={step.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 220px"
                    src={step.image}
                  />
                </div>
                <div className="p-6">
                  <p className="text-4xl font-black text-brand-sky">{step.number}</p>
                  <h3 className="mt-3 text-2xl font-black text-brand-navy">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-brand-navy/68 md:text-base">{step.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
