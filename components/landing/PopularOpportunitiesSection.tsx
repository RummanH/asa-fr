"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const opportunities = [
  {
    title: "School Teacher",
    description: "Full classroom roles for primary, secondary, and institution-based teaching needs.",
    image: "/landing/opportunity-school.png",
    meta: "On-site",
    accent: "bg-brand-teal text-white",
  },
  {
    title: "Online Tutor",
    description: "Remote tutoring opportunities for institutions and families that need flexible support.",
    image: "/landing/opportunity-online.png",
    meta: "Remote",
    accent: "bg-brand-coral text-white",
  },
  {
    title: "Subject Specialist",
    description: "Focused hiring for math, science, English, Arabic, and exam preparation.",
    image: "/landing/opportunity-specialist.png",
    meta: "Expert",
    accent: "bg-brand-gold text-brand-navy",
  },
  {
    title: "Part-Time Teacher",
    description: "Flexible schedules for coaching centers, institutions, and short-term programs.",
    image: "/landing/opportunity-parttime.png",
    meta: "Flexible",
    accent: "bg-brand-emerald text-white",
  },
];

export function PopularOpportunitiesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section bg-white" id="opportunities">
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
              Popular opportunities
            </motion.p>
            <motion.h2 className="heading-lg mt-4 max-w-xl text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
              Find the right teaching opportunity faster.
            </motion.h2>
          </div>
          <motion.p className="landing-kicker max-w-2xl lg:ml-auto" variants={fadeUp(prefersReducedMotion, 12)}>
            Each path is framed around the real decisions teachers and institutions make: teaching mode, schedule,
            expertise, and classroom fit.
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
              className="landing-card group flex h-full flex-col overflow-hidden"
              key={item.title}
              variants={scaleIn(prefersReducedMotion)}
              whileHover={prefersReducedMotion ? undefined : { y: -6 }}
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  alt={item.title}
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  src={item.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/42 to-transparent" />
                <span className={`absolute left-4 top-4 px-3 py-1.5 text-xs font-black uppercase tracking-[0.06em] ${item.accent}`}>
                  {item.meta}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-black text-brand-gold">
                    <Star size={14} fill="currentColor" strokeWidth={0} /> Featured
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy/48">
                    <Clock3 size={14} /> Active
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-brand-navy">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-brand-navy/68">{item.description}</p>
                <Link
                  className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-teal transition hover:text-brand-coral"
                  href="/register"
                >
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
