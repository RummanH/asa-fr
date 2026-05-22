"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const testimonials = [
  {
    id: "testimonial-1",
    quote: "Posting teacher requirements and starting a direct chat from the same place saves our admin team real time.",
    name: "Admin Representative",
    role: "School Institution",
    image: "/landing/testimonial-1.png",
  },
  {
    id: "testimonial-2",
    quote: "I can show my subjects, browse institution posts, and respond to hiring requests without scattered messages.",
    name: "Professional Teacher",
    role: "Subject Specialist",
    image: "/landing/testimonial-2.png",
  },
  {
    id: "testimonial-3",
    quote: "The workflow is simple enough for repeated hiring, but structured enough to keep every request clear.",
    name: "Education Coordinator",
    role: "Training Center",
    image: "/landing/testimonial-3.png",
  },
];

export function TestimonialsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section section-soft">
      <div className="brand-container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
            Trusted feedback
          </motion.p>
          <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
            Clearer hiring for real education teams.
          </motion.h2>
        </motion.div>

        <motion.div
          className="mt-11 grid gap-5 lg:grid-cols-3"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {testimonials.map((item) => (
            <motion.article
              className="landing-card flex h-full flex-col p-6"
              key={item.id}
              variants={scaleIn(prefersReducedMotion)}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
            >
              <Quote className="text-brand-sky" size={30} strokeWidth={2.1} />
              <p className="mt-5 flex-1 text-base leading-8 text-brand-navy/76">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-brand-light">
                  <Image alt={item.name} className="object-cover" fill sizes="48px" src={item.image} />
                </div>
                <div>
                  <p className="text-sm font-black text-brand-navy">{item.name}</p>
                  <p className="landing-mini-label mt-0.5">{item.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
