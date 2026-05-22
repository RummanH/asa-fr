"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const faqItems = [
  {
    question: "Who can use this platform?",
    answer:
      "Teachers and educational institutions can register, create profiles, communicate, and manage hiring requests.",
  },
  {
    question: "Can institutions post teacher requirements?",
    answer:
      "Yes, institutions can create job posts or requirements so teachers can explore available opportunities.",
  },
  {
    question: "Can teachers chat with institutions?",
    answer:
      "Yes, teachers and institutions can communicate directly through the platform chat system.",
  },
  {
    question: "How does hiring work?",
    answer:
      "After discussion, an institution can send a hiring request, and the teacher can accept or reject it.",
  },
  {
    question: "Is this platform for online and offline teaching?",
    answer:
      "Yes, the platform supports online, offline, full-time, and part-time teaching opportunities.",
  },
];

export function FAQSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-white py-20 md:py-24 lg:py-28" id="faq">
      <div className="brand-container">
        <motion.div
          className="mx-auto text-center"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span className="badge-soft" variants={fadeUp(prefersReducedMotion, 10)}>
            Common Questions
          </motion.span>
          <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
            Frequently Asked Questions
          </motion.h2>
          <motion.p className="paragraph-soft mt-4 text-base md:text-lg" variants={fadeUp(prefersReducedMotion, 12)}>
            Key details about registration, recruitment, chat, and hiring requests.
          </motion.p>
          <motion.div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#d9e8f0]" variants={scaleIn(prefersReducedMotion)}>
            <div className="relative h-44 w-full md:h-56">
              <Image
                alt="Frequently asked questions"
                className="h-full w-full object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                src="/landing-2/faq-cover.png"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-auto mt-11 max-w-4xl space-y-4"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqItems.map((item, index) => (
            <motion.article
              className="brand-card brand-card-hover rounded-2xl border border-[#d9e8f0] p-5 sm:p-6"
              key={item.question}
              variants={scaleIn(prefersReducedMotion)}
              whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.005 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4f2f9] text-sm font-black text-brand-teal">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold tracking-[-0.02em] text-brand-navy">{item.question}</h3>
                  <p className="paragraph-soft mt-2 text-sm leading-7 sm:text-base">{item.answer}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
