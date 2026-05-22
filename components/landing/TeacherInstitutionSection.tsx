"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const audiences = [
  {
    icon: GraduationCap,
    title: "For Teachers",
    description: "Build a profile that shows your subjects, availability, preferred teaching mode, and expected salary.",
    href: "/register/teacher",
    cta: "Join as teacher",
  },
  {
    icon: Building2,
    title: "For Institutions",
    description: "Publish requirements, review matching teachers, start conversations, and send hiring requests.",
    href: "/register/institution",
    cta: "Hire teachers",
  },
];

export function TeacherInstitutionSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section bg-white">
      <div className="brand-container">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              Built for both sides
            </motion.p>
            <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
              One marketplace for teachers and education teams.
            </motion.h2>
            <motion.p className="landing-kicker mt-5 max-w-xl" variants={fadeUp(prefersReducedMotion, 12)}>
              Teachers need visibility and institutions need speed. The landing experience now makes both paths
              obvious without splitting the product into separate tools.
            </motion.p>

            <motion.div className="mt-8 grid gap-4 sm:grid-cols-2" variants={staggerContainer(prefersReducedMotion, 0.1)}>
              {audiences.map(({ icon: Icon, title, description, href, cta }) => (
                <motion.article className="landing-card-subtle p-5" key={title} variants={scaleIn(prefersReducedMotion)}>
                  <Icon className="text-brand-teal" size={24} strokeWidth={2.3} />
                  <h3 className="mt-4 text-xl font-black text-brand-navy">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-brand-navy/68">{description}</p>
                  <Link className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-brand-teal" href={href}>
                    {cta} <ArrowRight size={16} strokeWidth={2.4} />
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-[0.9fr_1fr] items-end gap-4"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.div className="landing-image relative h-72 shadow-[0_18px_46px_rgba(5,47,68,0.14)] md:h-[420px]" variants={scaleIn(prefersReducedMotion)}>
              <Image alt="Teacher profile" className="object-cover" fill sizes="(max-width: 1024px) 45vw, 420px" src="/landing/teacher-card.png" />
            </motion.div>
            <motion.div className="space-y-4" variants={staggerContainer(prefersReducedMotion, 0.1)}>
              <motion.div className="landing-image relative h-48 shadow-[0_18px_46px_rgba(5,47,68,0.12)] md:h-64" variants={scaleIn(prefersReducedMotion)}>
                <Image alt="Institution profile" className="object-cover" fill sizes="(max-width: 1024px) 45vw, 380px" src="/landing/institution-card.png" />
              </motion.div>
              <motion.div className="rounded-2xl bg-brand-navy p-5 text-white shadow-[0_18px_44px_rgba(5,47,68,0.18)]" variants={fadeUp(prefersReducedMotion, 10)}>
                <p className="text-sm font-bold text-brand-sky">Direct matching</p>
                <p className="mt-2 text-2xl font-black">Profile {"->"} Chat {"->"} Request</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
