"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Navbar } from "@/components/landing/Navbar";
import { fadeUp, slideLeft, staggerContainer } from "@/lib/animations";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="hero-gradient relative min-h-[760px] overflow-hidden pb-24 text-white md:pb-28 lg:min-h-[860px] lg:pb-0"
      id="home"
    >
      <div className="bg-pattern pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-8 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl" />

      <Navbar />

      <div className="brand-container relative z-20 grid items-center gap-10 pt-12 md:pt-16 lg:grid-cols-[1.03fr_0.97fr] lg:gap-14 lg:pt-16">
        <motion.div
          animate="visible"
          className="pb-6 lg:pb-20"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
        >
          <motion.span className="badge-soft bg-white/16 text-white" variants={fadeUp(prefersReducedMotion, 18)}>
            Modern Teacher Hiring Marketplace
          </motion.span>
          <motion.h1
            className="text-balance mt-6 max-w-[14ch] text-[clamp(2.35rem,5.9vw,5.7rem)] font-black leading-[0.98] tracking-[-0.055em] text-white"
            variants={fadeUp(prefersReducedMotion, 24)}
          >
            Find Qualified Teachers Or Discover Teaching Opportunities
          </motion.h1>
          <motion.p
            className="paragraph-soft mt-6 max-w-xl text-base text-slate-100/88 md:text-lg md:leading-7"
            variants={fadeUp(prefersReducedMotion, 20)}
          >
            A modern platform where institutions can connect with available teachers, post requirements, chat directly,
            and complete hiring requests with confidence.
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap items-center gap-3" variants={fadeUp(prefersReducedMotion, 18)}>
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                className="btn-primary rounded-xl px-7 py-3 text-sm font-semibold md:px-8 md:text-base"
                href="/register/teacher"
              >
                Join As Teacher
              </Link>
            </motion.div>
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                className="btn-secondary rounded-xl px-7 py-3 text-sm font-semibold md:px-8 md:text-base"
                href="/register/institution"
              >
                Join As Institution
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[610px] pb-10 sm:pb-12 lg:pb-16"
          initial="hidden"
          variants={slideLeft(prefersReducedMotion, 56)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="glass-card overflow-hidden rounded-[2.25rem] border-white/20 bg-white/8 p-3 shadow-[0_28px_80px_rgba(2,37,58,0.38)] sm:p-4">
            <div className="relative overflow-hidden rounded-[1.8rem]">
              <Image
                alt="Teacher hiring marketplace overview"
                className="h-[430px] w-full object-cover object-[center_30%] sm:h-[500px] lg:h-[580px]"
                height={1000}
                priority
                src="/landing/hero-main.png"
                width={780}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04273966] via-transparent to-transparent" />
            </div>
          </div>

          <motion.article
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, -6, 0],
                  }
            }
            className="glass-card absolute left-3 top-6 z-10 w-40 rounded-2xl p-3.5 sm:-left-6 sm:top-11 sm:w-48 sm:p-4"
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 5.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <p className="text-xs text-white/72">Available Teachers</p>
            <p className="mt-2 text-2xl font-extrabold leading-none text-white sm:text-[2rem]">3,200+</p>
          </motion.article>

          <motion.article
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, 6, 0],
                  }
            }
            className="glass-card absolute -bottom-2 right-2 z-10 w-44 rounded-2xl p-3.5 sm:-bottom-4 sm:-right-6 sm:w-52 sm:p-4"
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <p className="text-xs text-white/72">Active Hiring Requests</p>
            <p className="mt-2 text-2xl font-extrabold leading-none text-white sm:text-[2rem]">940+</p>
          </motion.article>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 -bottom-8 h-24 rounded-t-[2.8rem] bg-[#a9d3ef80] blur-xl" />
    </section>
  );
}

