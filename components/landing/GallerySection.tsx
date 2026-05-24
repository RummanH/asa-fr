"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { redesignImages } from "@/components/landing/redesign-images";
import { useLandingLanguage } from "@/components/landing/landing-language";

const galleryCards = [
  { image: redesignImages.benefitOne, accent: "bg-brand-teal/92 text-white" },
  { image: redesignImages.benefitTwo, accent: "bg-brand-coral/92 text-white" },
  { image: redesignImages.benefitThree, accent: "bg-brand-gold/92 text-brand-navy" },
  { image: redesignImages.benefitFour, accent: "bg-brand-emerald/92 text-white" },
  { image: redesignImages.stepOne, accent: "bg-brand-navy/92 text-white" },
  { image: redesignImages.stepTwo, accent: "bg-white/92 text-brand-navy" },
] as const;

export function GallerySection() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

  const rowCards = [...copy.gallery.items, ...copy.gallery.items];
  const reverseCards = [...copy.gallery.items].reverse();
  const reverseLoop = [...reverseCards, ...reverseCards];

  return (
    <section className="landing-section bg-white">
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
              {copy.gallery.eyebrow}
            </motion.p>
            <motion.h2 className="heading-lg landing-section-title mt-4" variants={fadeUp(prefersReducedMotion, 16)}>
              {copy.gallery.title}
            </motion.h2>
          </div>
          <motion.p className="landing-kicker max-w-2xl lg:ml-auto" variants={fadeUp(prefersReducedMotion, 12)}>
            {copy.gallery.description}
          </motion.p>
        </motion.div>

        <div className="mt-10 space-y-4">
          <div className="gallery-viewport">
            <div className="gallery-track" style={prefersReducedMotion ? undefined : { animationDuration: "34s" }}>
              {rowCards.map((label, index) => {
                const meta = galleryCards[index % galleryCards.length];
                return (
                  <article
                    className="landing-radius group relative aspect-[4/5] w-[clamp(13.5rem,20vw,17rem)] shrink-0 overflow-hidden border border-brand-navy/10 bg-brand-light shadow-[0_20px_52px_rgba(7,17,31,0.12)]"
                    key={`${label}-${index}`}
                  >
                    <Image
                      alt={label}
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      fill
                      sizes="(max-width: 768px) 74vw, (max-width: 1280px) 22vw, 17rem"
                      src={meta.image}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.02)_0%,rgba(7,17,31,0.08)_42%,rgba(7,17,31,0.78)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <span className={`landing-radius inline-flex px-3 py-1.5 text-xs font-black uppercase tracking-[0.06em] ${meta.accent}`}>
                        {copy.gallery.eyebrow}
                      </span>
                      <p className="mt-3 text-lg font-black leading-tight text-white">{label}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="gallery-viewport">
            <div
              className="gallery-track gallery-track-reverse"
              style={prefersReducedMotion ? undefined : { animationDuration: "40s" }}
            >
              {reverseLoop.map((label, index) => {
                const meta = galleryCards[(index + 2) % galleryCards.length];
                return (
                  <article
                    className="landing-radius group relative aspect-[4/5] w-[clamp(13.5rem,20vw,17rem)] shrink-0 overflow-hidden border border-brand-navy/10 bg-brand-light shadow-[0_20px_52px_rgba(7,17,31,0.12)]"
                    key={`${label}-${index}-reverse`}
                  >
                    <Image
                      alt={label}
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      fill
                      sizes="(max-width: 768px) 74vw, (max-width: 1280px) 22vw, 17rem"
                      src={meta.image}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.02)_0%,rgba(7,17,31,0.08)_42%,rgba(7,17,31,0.78)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <span className={`landing-radius inline-flex px-3 py-1.5 text-xs font-black uppercase tracking-[0.06em] ${meta.accent}`}>
                        {copy.gallery.eyebrow}
                      </span>
                      <p className="mt-3 text-lg font-black leading-tight text-white">{label}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
