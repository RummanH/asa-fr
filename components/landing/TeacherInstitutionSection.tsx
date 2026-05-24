"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";
import { redesignImages } from "@/components/landing/redesign-images";
import { useLandingLanguage } from "@/components/landing/landing-language";

const audiences = [
  {
    icon: GraduationCap,
    href: "/register/teacher",
    tone: "bg-brand-teal text-white",
  },
  {
    icon: Building2,
    href: "/register/institution",
    tone: "bg-brand-coral text-white",
  },
];

export function TeacherInstitutionSection() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

  return (
    <section className="landing-section section-soft">
      <div className="brand-container">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              {copy.audiences.eyebrow}
            </motion.p>
            <motion.h2 className="heading-lg landing-section-title mt-4" variants={fadeUp(prefersReducedMotion, 16)}>
              {copy.audiences.title}
            </motion.h2>
            <motion.p className="landing-kicker mt-5 max-w-xl" variants={fadeUp(prefersReducedMotion, 12)}>
              {copy.audiences.description}
            </motion.p>

            <motion.div className="mt-8 grid gap-4 sm:grid-cols-2" variants={staggerContainer(prefersReducedMotion, 0.1)}>
              {copy.audiences.items.map(({ title, description, cta }, index) => {
                const { icon: Icon, href, tone } = audiences[index] ?? audiences[0];
                return (
                  <motion.article className="landing-card-subtle p-5" key={title} variants={scaleIn(prefersReducedMotion)}>
                    <div className={`landing-radius inline-flex h-11 w-11 items-center justify-center ${tone}`}>
                      <Icon size={23} strokeWidth={2.4} />
                    </div>
                    <h3 className="mt-4 text-xl font-black text-brand-navy">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-brand-navy/68">{description}</p>
                    <Link
                      className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-teal transition hover:text-brand-coral"
                      href={href}
                    >
                      {cta} <ArrowRight size={16} strokeWidth={2.4} />
                    </Link>
                  </motion.article>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-[0.9fr_1fr] items-end gap-4"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            viewport={{ once: true, amount: 0.2 }}
            whileInView="visible"
          >
            <motion.div
              className="landing-image relative h-72 shadow-[0_18px_46px_rgba(7,17,31,0.12)] md:h-[420px]"
              variants={scaleIn(prefersReducedMotion)}
            >
              <Image alt="Teacher profile preview" className="object-cover" fill sizes="(max-width: 1024px) 45vw, 420px" src={redesignImages.teacherCard} />
            </motion.div>
            <motion.div className="space-y-4" variants={staggerContainer(prefersReducedMotion, 0.1)}>
              <motion.div
                className="landing-image relative h-48 shadow-[0_18px_46px_rgba(7,17,31,0.1)] md:h-64"
                variants={scaleIn(prefersReducedMotion)}
              >
                <Image alt="Institution profile preview" className="object-cover" fill sizes="(max-width: 1024px) 45vw, 380px" src={redesignImages.institutionCard} />
              </motion.div>
              <motion.div
                className="landing-radius border border-brand-navy/10 bg-brand-navy p-5 text-white shadow-[0_18px_44px_rgba(7,17,31,0.18)]"
                variants={fadeUp(prefersReducedMotion, 10)}
              >
                <p className="text-sm font-black text-brand-sky">{copy.audiences.directMatching}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xl font-black sm:text-2xl">
                  <span>{copy.audiences.flow[0]}</span>
                  <ArrowRight className="text-brand-sky" size={20} />
                  <span>{copy.audiences.flow[1]}</span>
                  <ArrowRight className="text-brand-sky" size={20} />
                  <span>{copy.audiences.flow[2]}</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
