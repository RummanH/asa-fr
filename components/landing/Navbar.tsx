"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/animations";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#stats", label: "Available Teachers" },
  { href: "#opportunities", label: "Institution Posts" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setIsMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <motion.header
      animate="visible"
      className="brand-container relative z-30 pt-5 md:pt-8"
      initial="hidden"
      variants={fadeUp(prefersReducedMotion, 18)}
    >
      <nav className="glass-card rounded-[1.35rem] border-white/20 bg-[#02283bc4] px-4 py-3 sm:px-6 md:px-9 md:py-4">
        <div className="flex min-h-[52px] items-center justify-between gap-4 md:min-h-[56px]">
          <Link className="inline-flex items-center gap-3" href="/">
            <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/16 md:h-11 md:w-11">
              <Image
                alt="Teacher Hiring Platform logo"
                className="h-full w-full object-cover"
                height={128}
                src="/landing/logo-mark.png"
                width={128}
              />
            </span>
            <span className="hidden text-sm font-semibold tracking-wide text-white/92 sm:inline-block md:text-base">
              Teacher Hiring Platform
            </span>
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((item) => (
              <li key={item.label}>
                <Link className="text-sm font-medium text-white/80 transition hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 sm:flex sm:gap-3">
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <Link className="btn-secondary rounded-xl px-4 py-2 text-sm sm:px-5 sm:py-2.5" href="/login">
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <Link className="btn-primary rounded-xl px-4 py-2 text-sm sm:px-5 sm:py-2.5" href="/register">
                Register
              </Link>
            </motion.div>
          </div>

          <button
            aria-controls="mobile-nav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/16 lg:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            type="button"
          >
            <span className="text-xl leading-none">{isMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 lg:hidden ${
            isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          id="mobile-nav"
        >
          <div className="overflow-hidden">
            <div className="divider-soft my-3" />
            <ul className="space-y-2">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-white/88 transition hover:bg-white/12 hover:text-white"
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
              <motion.div
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              >
                <Link className="btn-secondary block w-full rounded-xl px-4 py-2 text-center text-sm" href="/login">
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              >
                <Link className="btn-primary block w-full rounded-xl px-4 py-2 text-center text-sm" href="/register">
                  Register
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
