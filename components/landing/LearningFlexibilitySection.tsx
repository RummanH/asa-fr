"use client";

import { CalendarClock, CheckCircle2, MapPin, MessagesSquare } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";
import { useLandingLanguage } from "@/components/landing/landing-language";

const featureMeta = [
  {
    icon: MapPin,
    tone: "bg-brand-teal text-white",
  },
  {
    icon: CalendarClock,
    tone: "bg-brand-coral text-white",
  },
  {
    icon: MessagesSquare,
    tone: "bg-brand-gold text-brand-navy",
  },
];

export function LearningFlexibilitySection() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

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
              {copy.flexible.eyebrow}
            </motion.p>
            <motion.h2 className="heading-lg landing-section-title mt-4" variants={fadeUp(prefersReducedMotion, 16)}>
              {copy.flexible.title}
            </motion.h2>
          </div>
          <motion.p className="landing-kicker max-w-2xl lg:ml-auto" variants={fadeUp(prefersReducedMotion, 12)}>
            {copy.flexible.description}
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-11 grid gap-5 md:grid-cols-3"
          initial={prefersReducedMotion ? "visible" : "hidden"}
          variants={staggerContainer(prefersReducedMotion, 0.12)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {copy.flexible.features.map(({ title, description, details }, index) => {
            const { icon: Icon, tone } = featureMeta[index] ?? featureMeta[0];
            return (
              <motion.article
                className="landing-card-subtle h-full p-5"
                key={title}
                variants={scaleIn(prefersReducedMotion)}
                whileHover={prefersReducedMotion ? undefined : { y: -5 }}
              >
                <div className={`landing-radius inline-flex h-11 w-11 items-center justify-center ${tone}`}>
                  <Icon size={21} strokeWidth={2.4} />
                </div>
                <h3 className="mt-5 text-lg font-black text-brand-navy md:text-xl">{title}</h3>
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
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
