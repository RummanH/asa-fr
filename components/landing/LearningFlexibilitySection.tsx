"use client";

import { CalendarClock, MapPin, MessagesSquare } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const features = [
  {
    icon: MapPin,
    title: "Search by fit",
    description: "Filter teachers by subject, class level, location, availability, and online or offline teaching mode.",
  },
  {
    icon: CalendarClock,
    title: "Work around schedules",
    description: "Teachers can find full-time, part-time, contract, and flexible institution requirements.",
  },
  {
    icon: MessagesSquare,
    title: "Discuss before hiring",
    description: "Direct chat keeps expectations, salary range, and role details clear before a request is sent.",
  },
];

export function LearningFlexibilitySection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section bg-white">
      <div className="brand-container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
            Flexible recruitment
          </motion.p>
          <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
            Teacher hiring that adapts to every classroom need.
          </motion.h2>
          <motion.p className="landing-kicker mx-auto mt-4 max-w-2xl" variants={fadeUp(prefersReducedMotion, 12)}>
            The platform handles both sides of the marketplace: institutions get sharper search and teachers get better
            visibility into real opportunities.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-11 grid gap-5 md:grid-cols-3"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.article
              className={`landing-card-subtle p-6 ${index === 1 ? "border-2 border-brand-teal/35 bg-[#f0f9fd]" : ""}`}
              key={title}
              variants={scaleIn(prefersReducedMotion)}
              whileHover={prefersReducedMotion ? undefined : { y: -5 }}
            >
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                  index === 1 ? "bg-brand-light text-brand-teal" : "bg-brand-light text-brand-teal"
                }`}
              >
                <Icon size={21} strokeWidth={2.3} />
              </div>
              <h3 className="mt-5 text-xl font-black text-brand-navy">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-navy/78">{description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
