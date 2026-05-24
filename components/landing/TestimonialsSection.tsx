"use client";

import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";
import { redesignImages } from "@/components/landing/redesign-images";

const testimonials = [
  {
    id: "testimonial-1",
    quote: "Posting requirements, reviewing profiles, and starting a direct chat from one place gives our admin team a cleaner hiring rhythm.",
    name: "Admin Representative",
    role: "School Institution",
    image: redesignImages.testimonialOne,
  },
  {
    id: "testimonial-2",
    quote: "My subjects, schedule, salary expectation, and teaching mode are visible before the conversation starts, so the matches feel more relevant.",
    name: "Professional Teacher",
    role: "Subject Specialist",
    image: redesignImages.testimonialTwo,
  },
  {
    id: "testimonial-3",
    quote: "The request flow is simple enough for everyday hiring, but structured enough that every decision has context.",
    name: "Education Coordinator",
    role: "Training Center",
    image: redesignImages.testimonialThree,
  },
];

export function TestimonialsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section bg-white">
      <div className="brand-container">
        <motion.div
          className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <div>
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              Trusted feedback
            </motion.p>
            <motion.h2 className="heading-lg landing-section-title mt-4" variants={fadeUp(prefersReducedMotion, 16)}>
              Clearer hiring for education teams.
            </motion.h2>
          </div>
          <motion.p className="landing-kicker max-w-2xl lg:ml-auto" variants={fadeUp(prefersReducedMotion, 12)}>
            The product story is simple: less fragmented communication, better profile context, and fewer uncertain
            hiring steps.
          </motion.p>
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
              <div className="flex items-center justify-between gap-4">
                <Quote className="text-brand-sky" size={30} strokeWidth={2.1} />
                <div className="flex text-brand-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
              </div>
              <p className="mt-5 flex-1 text-base leading-8 text-brand-navy/76">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                <div className="landing-radius relative h-12 w-12 overflow-hidden border border-border bg-brand-light">
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
