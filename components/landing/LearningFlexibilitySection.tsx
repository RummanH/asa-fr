"use client";

import { CalendarClock, CheckCircle2, MapPin, MessagesSquare } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const features = [
  {
    icon: MapPin,
    title: "Precision matching",
    description: "Search by subject, class level, location, availability, salary expectation, and teaching mode.",
    details: ["Subject and level filters", "Location-aware discovery", "Online and offline modes"],
    tone: "bg-brand-teal text-white",
  },
  {
    icon: CalendarClock,
    title: "Flexible opportunities",
    description: "Support full-time, part-time, contract, temporary, coaching, and online tutoring roles.",
    details: ["Schedule-fit roles", "Institution posts", "Teacher-side browsing"],
    tone: "bg-brand-coral text-white",
  },
  {
    icon: MessagesSquare,
    title: "Conversation first",
    description: "Use direct chat to confirm expectations before either side commits to a hiring request.",
    details: ["Shared context", "Clear salary discussion", "Request status tracking"],
    tone: "bg-brand-gold text-brand-navy",
  },
];

export function LearningFlexibilitySection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="landing-section section-soft border-y border-[#dbeaf1]" id="flexible-recruitment">
      <div className="brand-container">
        <motion.div
          className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
          initial={prefersReducedMotion ? "visible" : "hidden"}
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <div>
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              Flexible recruitment
            </motion.p>
            <motion.h2 className="heading-lg landing-section-title mt-4" variants={fadeUp(prefersReducedMotion, 16)}>
              Hiring that adapts to every classroom need.
            </motion.h2>
          </div>
          <motion.p className="landing-kicker max-w-2xl lg:ml-auto" variants={fadeUp(prefersReducedMotion, 12)}>
            Institutions get sharper discovery and teachers get better visibility into real roles, without forcing a
            slow recruitment workflow onto either side.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-11 grid gap-5 md:grid-cols-3"
          initial={prefersReducedMotion ? "visible" : "hidden"}
          variants={staggerContainer(prefersReducedMotion, 0.12)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {features.map(({ icon: Icon, title, description, details, tone }) => (
            <motion.article
              className="landing-card-subtle h-full p-5"
              key={title}
              variants={scaleIn(prefersReducedMotion)}
              whileHover={prefersReducedMotion ? undefined : { y: -5 }}
            >
              <div className={`landing-radius inline-flex h-11 w-11 items-center justify-center ${tone}`}>
                <Icon size={21} strokeWidth={2.4} />
              </div>
              <h3 className="mt-5 text-xl font-black text-brand-navy">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-navy/70">{description}</p>
              <div className="mt-5 space-y-2 border-t border-brand-navy/10 pt-4">
                {details.map((line) => (
                  <div className="flex items-center gap-2 text-sm font-bold text-brand-navy/72" key={line}>
                    <CheckCircle2 className="shrink-0 text-brand-emerald" size={16} strokeWidth={2.4} />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
