"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const opportunities = [
  {
    title: "School Teacher",
    description:
      "Find qualified teachers for school-level subjects and classroom teaching needs.",
    image: "/landing/opportunity-school.png",
  },
  {
    title: "Online Tutor",
    description:
      "Hire flexible online tutors for remote classes and ongoing academic support.",
    image: "/landing/opportunity-online.png",
  },
  {
    title: "Subject Specialist",
    description:
      "Connect with expert teachers for math, science, English, and specialized subjects.",
    image: "/landing/opportunity-specialist.png",
  },
  {
    title: "Part-Time Teacher",
    description:
      "Discover part-time teacher opportunities and flexible institution recruitment needs.",
    image: "/landing/opportunity-parttime.png",
  },
];

export function PopularOpportunitiesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="section-soft py-20 md:py-24 lg:py-28" id="opportunities">
      <div className="brand-container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span className="badge-soft" variants={fadeUp(prefersReducedMotion, 10)}>
            Popular Opportunities
          </motion.span>
          <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
            Browse In-Demand Teacher Recruitment Categories
          </motion.h2>
          <motion.p className="paragraph-soft mt-4 text-base md:text-lg" variants={fadeUp(prefersReducedMotion, 12)}>
            Explore active institution requirements and teaching opportunities across full-time,
            part-time, online, and offline roles.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-11 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {opportunities.map((item) => (
            <motion.article
              className="brand-card brand-card-hover flex h-full flex-col overflow-hidden rounded-[1.6rem]"
              key={item.title}
              variants={scaleIn(prefersReducedMotion)}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.015 }}
              transition={{ duration: 0.24 }}
            >
              <div className="relative h-44 w-full">
                <Image alt={item.title} className="h-full w-full object-cover" fill src={item.image} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold tracking-[-0.02em] text-brand-navy">{item.title}</h3>
                <p className="paragraph-soft mt-3 flex-1 text-sm leading-7">{item.description}</p>
                <motion.div whileHover={prefersReducedMotion ? undefined : { y: -2 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
                  <Link
                    className="btn-primary mt-6 w-fit rounded-xl px-5 py-2.5 text-sm font-semibold"
                    href="/register"
                  >
                    View Opportunities
                  </Link>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
