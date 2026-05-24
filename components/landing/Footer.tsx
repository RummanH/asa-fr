"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { redesignImages } from "@/components/landing/redesign-images";
import { useLandingLanguage } from "@/components/landing/landing-language";

export function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const { copy } = useLandingLanguage();

  const footerLinks = [
    { label: copy.nav.platform, href: "#flexible-recruitment" },
    { label: copy.nav.roles, href: "#opportunities" },
    { label: copy.nav.process, href: "#process" },
    { label: copy.nav.contact, href: "#contact" },
    { label: copy.nav.faq, href: "#faq" },
  ];

  const accountLinks = [
    { label: copy.footer.teacherRegistration, href: "/register/teacher" },
    { label: copy.footer.institutionRegistration, href: "/register/institution" },
    { label: copy.footer.login, href: "/login" },
  ];

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
          className="grid gap-9 md:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.85fr_0.95fr]"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <Link className="inline-flex items-center gap-3" href="/">
              <span className="landing-radius relative inline-flex h-11 w-11 overflow-hidden border border-white/10 bg-white/10">
                <Image alt="Teacher Hiring Platform" className="object-cover" fill sizes="44px" src={redesignImages.logoMark} />
              </span>
              <span className="text-xl font-black text-white">Teacher Hiring Platform</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/68">
              {copy.footer.description}
            </p>
            <Link
              className="landing-radius mt-6 inline-flex items-center gap-2 border border-white/14 bg-white/8 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/14"
              href="/register"
            >
              {copy.footer.createAccount} <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <h4 className="text-sm font-black uppercase tracking-[0.08em] text-brand-sky">{copy.footer.explore}</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm font-semibold text-white/68 transition hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <h4 className="text-sm font-black uppercase tracking-[0.08em] text-brand-sky">{copy.footer.accounts}</h4>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm font-semibold text-white/68 transition hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp(prefersReducedMotion, 12)}>
            <h4 className="text-sm font-black uppercase tracking-[0.08em] text-brand-sky">{copy.footer.contact}</h4>
            <ul className="mt-4 space-y-3 text-sm font-semibold text-white/68">
              <li className="flex items-center gap-2">
                <Mail size={16} /> support@example.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 shrink-0" size={16} />
                <address className="not-italic">
                  <span className="block text-xs font-black uppercase tracking-[0.06em] text-white/42">{copy.footer.address}</span>
                  <span className="mt-1 block leading-6">Dhaka, Bangladesh</span>
                </address>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-10 h-px bg-white/10" />
        <p className="mt-6 text-center text-xs font-semibold text-white/52 sm:text-sm">
          &copy; 2026 {copy.footer.rights}
        </p>
      </div>
    </motion.footer>
  );
}
