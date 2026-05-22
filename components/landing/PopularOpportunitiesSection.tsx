"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const opportunities = [
  {
    title: "School Teacher",
    description: "Full classroom roles for primary, secondary, and institution-based teaching needs.",
    image: "/landing/opportunity-school.png",
    meta: "On-site roles",
  },
  {
    title: "Online Tutor",
    description: "Remote tutoring opportunities for institutions and families that need flexible support.",
    image: "/landing/opportunity-online.png",
    meta: "Remote classes",
  },
  {
    title: "Subject Specialist",
    description: "Focused hiring for math, science, English, Arabic, and exam preparation.",
    image: "/landing/opportunity-specialist.png",
    meta: "Expert profiles",
  },
  {
    title: "Part-Time Teacher",
    description: "Flexible schedules for coaching centers, institutions, and short-term programs.",
    image: "/landing/opportunity-parttime.png",
    meta: "Flexible hours",
  },
];

export function PopularOpportunitiesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section section-soft" id="opportunities">
      <div className="brand-container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
            Popular opportunities
          </motion.p>
          <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
            Browse the roles institutions request most.
          </motion.h2>
          <motion.p className="landing-kicker mx-auto mt-4 max-w-2xl" variants={fadeUp(prefersReducedMotion, 12)}>
            Clear categories help teachers discover openings faster and help institutions describe what they need.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-11 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {opportunities.map((item) => (
            <motion.article
              className="landing-card flex h-full flex-col overflow-hidden"
              key={item.title}
              variants={scaleIn(prefersReducedMotion)}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
            >
              <div className="relative h-48 w-full">
                <Image
                  alt={item.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  src={item.image}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="landing-mini-label">{item.meta}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold">
                    <Star size={14} fill="currentColor" strokeWidth={0} /> Featured
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-black text-brand-navy">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-brand-navy/68">{item.description}</p>
                <Link className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-brand-teal" href="/register">
                  View openings <ArrowRight size={16} strokeWidth={2.4} />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
