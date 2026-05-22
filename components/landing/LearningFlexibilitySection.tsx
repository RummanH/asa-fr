"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, slideRight, staggerContainer } from "@/lib/animations";

export function LearningFlexibilitySection() {
  const prefersReducedMotion = useReducedMotion();
  const features = [
    "Institutions can find teachers by subject, location, availability, and teaching mode.",
    "Teachers can explore verified institution requirements for online and offline roles.",
    "Both sides can chat directly and manage hiring requests without leaving the platform.",
  ];

  return (
    <section className="bg-white py-20 md:py-24 lg:py-28">
      <div className="brand-container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <motion.div
            className="brand-card image-soft rounded-[2rem] p-5 shadow-[0_20px_55px_rgba(5,47,68,0.12)] sm:p-6"
            initial="hidden"
            variants={slideRight(prefersReducedMotion, 42)}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-[1.6rem] border border-[#d5e6ef]">
              <Image
                alt="Teacher and institution hiring flexibility"
                className="h-[360px] w-full object-cover sm:h-[430px]"
                height={1050}
                src="/landing/flexibility-main.png"
                width={1400}
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.span className="badge-soft" variants={fadeUp(prefersReducedMotion, 12)}>
              Flexible Hiring
            </motion.span>
            <motion.h2 className="heading-lg mt-4 max-w-xl text-brand-navy" variants={fadeUp(prefersReducedMotion, 18)}>
              Experience Teacher Hiring Flexibility At Its Best
            </motion.h2>
            <motion.p
              className="paragraph-soft mt-5 max-w-2xl text-base md:text-lg md:leading-7"
              variants={fadeUp(prefersReducedMotion, 14)}
            >
              Connect with qualified teachers and trusted institutions through a smooth and
              flexible recruitment experience built for modern education teams.
            </motion.p>

            <motion.div className="divider-soft my-7" variants={fadeUp(prefersReducedMotion, 10)} />

            <motion.div className="space-y-3" variants={staggerContainer(prefersReducedMotion, 0.1)}>
              {features.map((feature, index) => (
                <motion.article
                  className="brand-card brand-card-hover rounded-2xl px-4 py-4"
                  key={feature}
                  variants={scaleIn(prefersReducedMotion)}
                  whileHover={prefersReducedMotion ? undefined : { y: -5, scale: 1.01 }}
                  transition={{ duration: 0.24 }}
                >
                  <p className="text-sm font-semibold text-brand-teal">0{index + 1}</p>
                  <p className="mt-1 text-sm leading-7 text-brand-navy/85 sm:text-base">{feature}</p>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

