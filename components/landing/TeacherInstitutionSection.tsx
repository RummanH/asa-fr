"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

export function TeacherInstitutionSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-white py-20 md:py-24 lg:py-28">
      <div className="brand-container">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span className="badge-soft" variants={fadeUp(prefersReducedMotion, 10)}>
            For Everyone
          </motion.span>
          <motion.h2 className="heading-lg mt-4 text-brand-navy" variants={fadeUp(prefersReducedMotion, 16)}>
            Designed For Both Teachers And Institutions
          </motion.h2>
          <motion.p className="paragraph-soft mt-4 text-base md:text-lg" variants={fadeUp(prefersReducedMotion, 12)}>
            Whether you are searching for teaching opportunities or hiring qualified teachers, the
            platform provides a professional recruitment workflow for both sides.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-11 grid grid-cols-1 gap-6 lg:grid-cols-2"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.12)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.article
            className="brand-card brand-card-hover overflow-hidden rounded-[1.9rem] bg-[linear-gradient(150deg,#ffffff_0%,#f1f9fd_100%)] shadow-[0_18px_48px_rgba(4,50,73,0.11)]"
            variants={scaleIn(prefersReducedMotion)}
            whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01 }}
            transition={{ duration: 0.24 }}
          >
            <div className="relative h-52 w-full">
              <Image alt="For Teachers" className="h-full w-full object-cover" fill src="/landing/teacher-card.png" />
            </div>
            <div className="p-7 sm:p-8">
              <h3 className="text-2xl font-black tracking-[-0.03em] text-brand-navy">For Teachers</h3>
              <p className="paragraph-soft mt-4 text-sm leading-7 sm:text-base">
                Create your profile, highlight your subjects and teaching mode, browse institution
                requirements, chat directly, and manage hiring requests.
              </p>
              <motion.div whileHover={prefersReducedMotion ? undefined : { y: -2 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
                <Link
                  className="btn-primary mt-7 rounded-xl px-6 py-3 text-sm font-semibold md:text-base"
                  href="/register/teacher"
                >
                  Join As Teacher
                </Link>
              </motion.div>
            </div>
          </motion.article>

          <motion.article
            className="brand-card-hover overflow-hidden rounded-[1.9rem] border border-white/20 bg-[linear-gradient(160deg,#052f44_0%,#075f75_100%)] text-white shadow-[0_18px_55px_rgba(3,43,62,0.22)]"
            variants={scaleIn(prefersReducedMotion)}
            whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01 }}
            transition={{ duration: 0.24 }}
          >
            <div className="relative h-52 w-full">
              <Image alt="For Institutions" className="h-full w-full object-cover" fill src="/landing/institution-card.png" />
            </div>
            <div className="p-7 sm:p-8">
              <h3 className="text-2xl font-black tracking-[-0.03em] text-white">For Institutions</h3>
              <p className="mt-4 text-sm leading-7 text-slate-100/88 sm:text-base">
                Post teacher requirements, review available teachers, communicate through direct
                chat, and send hiring requests with clear status tracking.
              </p>
              <motion.div whileHover={prefersReducedMotion ? undefined : { y: -2 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
                <Link
                  className="btn-secondary mt-7 rounded-xl px-6 py-3 text-sm font-semibold md:text-base"
                  href="/register/institution"
                >
                  Join As Institution
                </Link>
              </motion.div>
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
