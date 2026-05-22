"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { fadeUp } from "@/lib/animations";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#opportunities", label: "Opportunities" },
  { href: "#process", label: "How It Works" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <motion.header
      animate="visible"
      className="brand-container relative z-30 pt-5 md:pt-7"
      initial="hidden"
      variants={fadeUp(prefersReducedMotion, 16)}
    >
      <nav className="rounded-2xl border border-white/20 bg-[#03334bcc] px-4 py-3 shadow-[0_18px_50px_rgba(0,24,38,0.26)] backdrop-blur-xl sm:px-5 lg:px-7">
        <div className="flex min-h-12 items-center justify-between gap-4">
          <Link className="inline-flex items-center gap-3" href="/">
            <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-xl border border-white/15 bg-white/10">
              <Image
                alt="Teacher Hiring Platform"
                className="object-cover"
                fill
                sizes="40px"
                src="/landing/logo-mark.png"
              />
            </span>
            <span className="text-sm font-extrabold text-white sm:text-base">Teacher Hiring Platform</span>
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link className="text-sm font-semibold text-white/76 transition hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              href="/login"
            >
              Login
            </Link>
            <Link className="btn-primary bg-white px-5 py-2.5 text-sm font-bold text-brand-navy hover:bg-brand-sky" href="/register">
              Register <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
          </div>

          <button
            aria-controls="mobile-nav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/15 lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 lg:hidden ${
            isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          id="mobile-nav"
        >
          <div className="overflow-hidden">
            <div className="my-3 h-px bg-white/12" />
            <ul className="space-y-1">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-white/86 transition hover:bg-white/10 hover:text-white"
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
              <Link className="rounded-xl border border-white/15 px-4 py-2.5 text-center text-sm font-bold text-white" href="/login">
                Login
              </Link>
              <Link className="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-bold text-brand-navy" href="/register">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
