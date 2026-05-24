"use client";

import Link from "next/link";
import { Clock3, Mail, MapPin, MessageSquareText, Phone, Send } from "lucide-react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, scaleIn, staggerContainer } from "@/lib/animations";

const contactCards = [
  {
    icon: Mail,
    label: "Email",
    value: "support@example.com",
    href: "mailto:support@example.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1700 000000",
    href: "tel:+8801700000000",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: "https://maps.google.com/?q=Dhaka%2C%20Bangladesh",
  },
  {
    icon: Clock3,
    label: "Support",
    value: "Sat-Thu, 9:00 AM-6:00 PM",
    href: "mailto:support@example.com?subject=Support%20request",
  },
];

export function ContactSection() {
  const prefersReducedMotion = useReducedMotion();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Teacher Hiring Platform inquiry from ${name || "website visitor"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    window.location.href = `mailto:support@example.com?subject=${subject}&body=${body}`;
  }

  return (
    <section className="landing-section section-soft border-t border-[#dbeaf1]" id="contact">
      <div className="brand-container">
        <motion.div
          className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
          initial="hidden"
          variants={staggerContainer(prefersReducedMotion, 0.1)}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <div>
            <motion.p className="landing-eyebrow" variants={fadeUp(prefersReducedMotion, 10)}>
              Contact us
            </motion.p>
            <motion.h2 className="heading-lg landing-section-title mt-4" variants={fadeUp(prefersReducedMotion, 16)}>
              Talk to the education hiring team.
            </motion.h2>
            <motion.p className="landing-kicker mt-5 max-w-xl" variants={fadeUp(prefersReducedMotion, 12)}>
              Have a question about teacher registration, institution hiring, job posts, or the request workflow? Send a
              message and the team can follow up directly.
            </motion.p>

            <motion.div className="mt-8 grid gap-3 sm:grid-cols-2" variants={staggerContainer(prefersReducedMotion, 0.08)}>
              {contactCards.map(({ icon: Icon, label, value, href }) => (
                <motion.div className="landing-card-subtle p-4" key={label} variants={scaleIn(prefersReducedMotion)}>
                  <Link
                    className="group flex h-full items-start gap-3"
                    href={href}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    target={href.startsWith("http") ? "_blank" : undefined}
                  >
                    <span className="landing-radius inline-flex h-10 w-10 shrink-0 items-center justify-center bg-brand-navy text-white transition group-hover:bg-brand-teal">
                      <Icon size={19} strokeWidth={2.4} />
                    </span>
                    <span>
                      <span className="landing-mini-label block">{label}</span>
                      <span className="mt-1 block text-sm font-black leading-6 text-brand-navy">{value}</span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.form
            className="landing-card bg-white p-5 shadow-[0_24px_70px_rgba(7,17,31,0.09)] md:p-7"
            onSubmit={handleSubmit}
            variants={scaleIn(prefersReducedMotion)}
          >
            <div className="flex items-center gap-3 border-b border-brand-navy/10 pb-5">
              <span className="landing-radius inline-flex h-11 w-11 items-center justify-center bg-brand-coral text-white">
                <MessageSquareText size={21} strokeWidth={2.4} />
              </span>
              <div>
                <h3 className="text-xl font-black text-brand-navy">Send a message</h3>
                <p className="mt-1 text-sm font-semibold text-brand-navy/56">Opens your email client with the details.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black text-brand-navy">
                Name
                <input
                  className="landing-radius h-12 border border-brand-navy/12 bg-brand-light px-4 text-sm font-semibold text-brand-navy outline-none transition focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10"
                  name="name"
                  placeholder="Your name"
                  type="text"
                />
              </label>
              <label className="grid gap-2 text-sm font-black text-brand-navy">
                Email
                <input
                  className="landing-radius h-12 border border-brand-navy/12 bg-brand-light px-4 text-sm font-semibold text-brand-navy outline-none transition focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                />
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-black text-brand-navy">
              Message
              <textarea
                className="landing-radius min-h-36 resize-y border border-brand-navy/12 bg-brand-light px-4 py-3 text-sm font-semibold leading-6 text-brand-navy outline-none transition focus:border-brand-teal focus:bg-white focus:ring-4 focus:ring-brand-teal/10"
                name="message"
                placeholder="Tell us what you need help with"
                required
              />
            </label>

            <button className="btn-primary mt-5 w-full px-6 py-3 text-sm font-black sm:w-auto" type="submit">
              Send message <Send size={17} strokeWidth={2.4} />
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
