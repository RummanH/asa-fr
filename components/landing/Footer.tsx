"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Opportunities", href: "#opportunities" },
  { label: "How It Works", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

const accountLinks = [
  { label: "Teacher registration", href: "/register/teacher" },
  { label: "Institution registration", href: "/register/institution" },
  { label: "Login", href: "/login" },
];

export function Footer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.footer
      className="bg-brand-navy py-14 text-white md:py-16"
      initial="hidden"
      variants={fadeUp(prefersReducedMotion, 18)}
      viewport={{ once: true, amount: 0.2 }}
      whileInView="visible"
    >
      <div className="brand-container">
        <motion.div
          className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.9fr]"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <Link className="inline-flex items-center gap-3" href="/">
              <span className="relative inline-flex h-11 w-11 overflow-hidden rounded-xl border border-white/10 bg-white/10">
                <Image alt="Teacher Hiring Platform" className="object-cover" fill sizes="44px" src="/landing/logo-mark.png" />
              </span>
              <span className="text-xl font-black text-white">Teacher Hiring Platform</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              A focused marketplace for qualified teachers and trusted educational institutions.
            </p>
          </motion.div>

          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <h4 className="text-sm font-extrabold uppercase tracking-[0.12em] text-brand-sky">Explore</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm font-semibold text-white/72 transition hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <h4 className="text-sm font-extrabold uppercase tracking-[0.12em] text-brand-sky">Accounts</h4>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm font-semibold text-white/72 transition hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <h4 className="text-sm font-extrabold uppercase tracking-[0.12em] text-brand-sky">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-white/72">
              <li className="flex items-center gap-2">
                <Mail size={16} /> support@example.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Dhaka, Bangladesh
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-10 h-px bg-white/10" />
        <p className="mt-6 text-center text-xs font-semibold text-white/58 sm:text-sm">
          &copy; 2026 Teacher Hiring Platform. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
