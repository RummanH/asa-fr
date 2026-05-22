"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Teachers and institutions register, complete their profiles, and set hiring preferences.",
    image: "/landing-2/step-1.png",
  },
  {
    number: "02",
    title: "Discover And Chat",
    description: "Institutions browse available teachers, and teachers explore institution job posts and requirements.",
    image: "/landing-2/step-2.png",
  },
  {
    number: "03",
    title: "Send Hiring Request",
    description: "After direct discussion, institutions send hiring requests and teachers can accept or reject.",
    image: "/landing-2/step-3.png",
  },
];

export function HowItWorksSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-white py-20 md:py-24 lg:py-28">
      <div className="brand-container">
        <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <motion.div
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.1)}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.span className="badge-soft" variants={fadeUp(prefersReducedMotion, 10)}>
              Simple Process
            </motion.span>
            <motion.h2 className="heading-lg mt-4 max-w-xl text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
              Hire Or Get Hired In A Few Simple Steps
            </motion.h2>
            <motion.p
              className="paragraph-soft mt-5 max-w-xl text-base md:text-lg md:leading-7"
              variants={fadeUp(prefersReducedMotion, 12)}
            >
              The platform keeps recruitment simple by combining teacher discovery, institution job posts, direct chat,
              and hiring requests in one workflow.
            </motion.p>
            <motion.div className="divider-soft mt-8 hidden lg:block" variants={fadeUp(prefersReducedMotion, 8)} />
          </motion.div>

          <motion.div
            className="grid gap-4 sm:gap-5"
            initial="hidden"
            variants={staggerContainer(prefersReducedMotion, 0.12)}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {steps.map((step) => (
              <motion.article
                className="brand-card brand-card-hover overflow-hidden rounded-[1.45rem] border border-[#d6e6ef]"
                key={step.number}
                variants={scaleIn(prefersReducedMotion)}
                whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.012 }}
                transition={{ duration: 0.24 }}
              >
                <div className="relative h-36 w-full">
                  <Image
                    alt={step.title}
                    className="h-full w-full object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    src={step.image}
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-2xl font-black tracking-[-0.04em] text-brand-teal">{step.number}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-brand-navy">{step.title}</h3>
                  <p className="paragraph-soft mt-2 text-sm leading-7 sm:text-base">{step.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

