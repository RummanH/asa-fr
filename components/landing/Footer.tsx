"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "For Teachers", href: "/register/teacher" },
  { label: "For Institutions", href: "/register/institution" },
  { label: "Opportunities", href: "#opportunities" },
  { label: "Contact", href: "#faq" },
];

export function Footer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.footer
      className="bg-brand-navy py-14 text-white md:py-16"
      initial="hidden"
      variants={fadeUp(prefersReducedMotion, 20)}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="brand-container">
        <motion.div
          className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr] lg:gap-12"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <div className="inline-flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/10">
                <Image alt="Teacher Hiring Platform logo" className="h-full w-full object-cover" height={128} src="/landing/logo-mark.png" width={128} />
              </span>
              <h3 className="text-2xl font-black tracking-[-0.03em] text-white">Teacher Hiring Platform</h3>
            </div>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-200/88 sm:text-base">
              A modern hiring marketplace that connects qualified teachers with trusted
              educational institutions.
            </p>
          </motion.div>

          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-sky-100">Useful Links</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link className="text-sm text-slate-100/85 transition hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-sky-100">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-100/85">
              <li>support@example.com</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="divider-soft mt-10" />
        <motion.p className="mt-6 text-center text-xs text-slate-200/80 sm:text-sm" variants={fadeUp(prefersReducedMotion, 8)}>
          &copy; 2026 Teacher Hiring Platform. All rights reserved.
        </motion.p>
      </div>
    </motion.footer>
  );
}
