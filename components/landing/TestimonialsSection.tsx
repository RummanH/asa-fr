"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const testimonials = [
  {
    id: "testimonial-1",
    quote:
      "This platform makes it easier for our institution to find available teachers and send hiring requests quickly.",
    name: "Admin Representative",
    role: "School Institution",
    image: "/landing/testimonial-1.png",
  },
  {
    id: "testimonial-2",
    quote: "I can browse active institution posts, chat directly, and respond to hiring requests in one place.",
    name: "Professional Teacher",
    role: "Subject Specialist",
    image: "/landing/testimonial-2.png",
  },
  {
    id: "testimonial-3",
    quote: "The direct chat and hiring workflow helps both teachers and institutions make faster, clearer decisions.",
    name: "Education Coordinator",
    role: "Training Center",
    image: "/landing/testimonial-3.png",
  },
];

export function TestimonialsSection() {
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
            Trusted Feedback
          </motion.span>
          <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
            What Users Say About The Platform
          </motion.h2>
        </motion.div>

        <motion.div
          className="mt-11 grid grid-cols-1 gap-5 lg:grid-cols-3"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((item) => (
            <motion.article
              className="brand-card brand-card-hover flex h-full flex-col rounded-[1.6rem] p-6 shadow-[0_15px_42px_rgba(5,47,68,0.11)]"
              key={item.id}
              variants={scaleIn(prefersReducedMotion)}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01 }}
              transition={{ duration: 0.24 }}
            >
              <p className="text-base leading-7 text-brand-navy/84">&ldquo;{item.quote}&rdquo;</p>
              <div className="divider-soft my-6" />
              <div className="mt-auto flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#d6e7f0] bg-[#e8f4fa]">
                  <Image alt={item.name} className="h-full w-full object-cover" fill src={item.image} />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-navy">{item.name}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-brand-teal/80">{item.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

