"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-stretch bg-white">
      {/* Left side - Form */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <motion.a
            href="/"
            className="inline-flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-navy to-brand-teal flex items-center justify-center text-white font-bold">
              TH
            </div>
            <span className="font-bold text-lg text-brand-navy">Teacher Hiring</span>
          </motion.a>

          {/* Heading */}
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {title && <h1 className="text-3xl font-bold text-brand-navy mb-2">{title}</h1>}
              {subtitle && <p className="text-slate-600 text-base">{subtitle}</p>}
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Image */}
      <motion.div
        className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-teal to-brand-sky"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full bg-brand-sky/20 blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-10 text-white text-center">
          <div className="max-w-md space-y-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold mb-4">Welcome to Teacher Hiring Platform</h2>
              <p className="text-brand-sky/90 text-lg leading-relaxed">
                Connect qualified teachers with institutions seeking talented educators. Streamline your hiring process and find the perfect match.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-xs text-brand-sky/70 mt-1">Teachers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">100+</p>
                <p className="text-xs text-brand-sky/70 mt-1">Institutions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">1000+</p>
                <p className="text-xs text-brand-sky/70 mt-1">Matches</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
