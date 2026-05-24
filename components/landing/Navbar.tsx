"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, LogIn, Menu, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { fadeUp } from "@/lib/animations";

const navLinks = [
  { href: "#flexible-recruitment", label: "Platform" },
  { href: "#opportunities", label: "Roles" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
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
      className="brand-container relative z-30 pt-4 md:pt-6"
      initial="hidden"
      variants={fadeUp(prefersReducedMotion, 16)}
    >
      <nav className="border border-white/55 bg-white/88 px-3 py-3 text-brand-navy shadow-[0_24px_70px_rgba(7,17,31,0.18)] backdrop-blur-xl sm:px-4 lg:px-5">
        <div className="flex min-h-12 items-center justify-between gap-3">
          <Link className="inline-flex min-w-0 items-center gap-3" href="/">
            <span className="relative inline-flex h-10 w-10 shrink-0 overflow-hidden border border-brand-navy/10 bg-brand-light">
              <Image
                alt="Teacher Hiring Platform"
                className="object-cover"
                fill
                sizes="40px"
                src="/landing/logo-mark.png"
              />
            </span>
            <span className="truncate text-sm font-black text-brand-navy sm:text-base">
              Teacher Hiring Platform
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex items-center px-4 py-2 text-sm font-bold text-brand-navy/64 transition hover:bg-brand-mist hover:text-brand-navy"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              className="inline-flex items-center gap-2 border border-brand-navy/12 px-4 py-2.5 text-sm font-extrabold text-brand-navy transition hover:bg-brand-mist"
              href="/login"
            >
              <LogIn size={16} strokeWidth={2.4} />
              Login
            </Link>
            <Link className="btn-primary px-4 py-2.5 text-sm font-extrabold" href="/register">
              Register <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
          </div>

          <button
            aria-controls="mobile-nav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-brand-navy/12 bg-white text-brand-navy transition hover:bg-brand-mist lg:hidden"
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
            <div className="my-3 h-px bg-brand-navy/10" />
            <ul className="grid gap-1">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    className="block px-3 py-2.5 text-sm font-bold text-brand-navy/76 transition hover:bg-brand-mist hover:text-brand-navy"
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
              <Link
                className="inline-flex items-center justify-center gap-2 border border-brand-navy/12 px-4 py-2.5 text-center text-sm font-extrabold text-brand-navy"
                href="/login"
              >
                <LogIn size={15} /> Login
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 bg-brand-navy px-4 py-2.5 text-center text-sm font-extrabold text-white"
                href="/register"
              >
                <BookOpenCheck size={15} /> Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
