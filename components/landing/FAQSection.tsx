"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const faqItems = [
  {
    question: "Who can use this platform?",
    answer: "Teachers and educational institutions can register, create profiles, communicate, and manage hiring requests.",
  },
  {
    question: "Can institutions post teacher requirements?",
    answer: "Yes. Institutions can create job posts so teachers can review active opportunities and apply through the hiring flow.",
  },
  {
    question: "Can teachers chat with institutions?",
    answer: "Yes. Direct chat is part of the workflow so both sides can clarify expectations before any request is accepted.",
  },
  {
    question: "How does hiring work?",
    answer: "After discussion, an institution sends a hiring request. The teacher can accept, reject, or continue the conversation.",
  },
  {
    question: "Does it support online and offline teaching?",
    answer: "Yes. The platform supports online, offline, full-time, part-time, contract, and temporary teaching opportunities.",
  },
];

export function FAQSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section bg-white" id="faq">
      <div className="brand-container">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              Common questions
            </motion.p>
            <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
              Answers before you create an account.
            </motion.h2>
            <motion.p className="landing-kicker mt-5 max-w-xl" variants={fadeUp(prefersReducedMotion, 12)}>
              Key details about registration, job posts, direct chat, and the hiring request flow.
            </motion.p>
            <motion.div className="landing-image relative mt-8 h-64 shadow-[0_18px_48px_rgba(5,47,68,0.12)]" variants={scaleIn(prefersReducedMotion)}>
              <Image
                alt="Teacher hiring questions"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                src="/landing-2/faq-cover.png"
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
            {faqItems.map((item, index) => (
              <motion.details
                className="group landing-card overflow-hidden p-5 open:border-brand-sky"
                key={item.question}
                open={index === 0}
                variants={fadeUp(prefersReducedMotion, 10)}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-brand-navy">
                  {item.question}
                  <ChevronDown className="shrink-0 text-brand-teal transition group-open:rotate-180" size={20} strokeWidth={2.4} />
                </summary>
                <p className="mt-3 text-sm leading-7 text-brand-navy/68 md:text-base">{item.answer}</p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
