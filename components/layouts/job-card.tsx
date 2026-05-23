"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "motion/react";
import { MapPin, Briefcase, DollarSign, Clock, ChevronRight } from "lucide-react";

interface JobCardProps {
  id: string;
  title: string;
  institution: string;
  location?: string;
  type?: string;
  mode?: "ONLINE" | "OFFLINE" | "BOTH";
  salaryMin?: number | null;
  salaryMax?: number | null;
  experience?: string;
  deadline?: string;
  href: string;
  action?: ReactNode;
}

const modeColors = {
  ONLINE: { bg: "bg-blue-100", text: "text-blue-700" },
  OFFLINE: { bg: "bg-amber-100", text: "text-amber-700" },
  BOTH: { bg: "bg-purple-100", text: "text-purple-700" },
};

function formatSalary(min: number | null | undefined, max: number | null | undefined): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export function JobCard({
  id,
  title,
  institution,
  location,
  type,
  mode,
  salaryMin,
  salaryMax,
  experience,
  deadline,
  href,
  action,
}: JobCardProps) {
  const salary = formatSalary(salaryMin, salaryMax);
  const modeColor = mode ? modeColors[mode] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all p-6"
    >
      {/* Header */}
      <div className="mb-4">
        <Link href={href} className="group">
          <h3 className="font-bold text-lg text-brand-navy group-hover:text-brand-teal transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-brand-navy/60 mt-1">{institution}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mode && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${modeColor?.bg} ${modeColor?.text}`}>
            {mode === "ONLINE" ? "🌐 Online" : mode === "OFFLINE" ? "📍 In-Person" : "🔄 Hybrid"}
          </span>
        )}
        {type && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {type}
          </span>
        )}
      </div>

      {/* Details grid */}
      <div className="space-y-3 mb-4 pb-4 border-b border-slate-100">
        {location && (
          <div className="flex items-center gap-2 text-sm text-brand-navy/70">
            <MapPin className="w-4 h-4 flex-shrink-0 text-brand-teal" />
            <span>{location}</span>
          </div>
        )}

        {salary && (
          <div className="flex items-center gap-2 text-sm text-brand-navy/70">
            <DollarSign className="w-4 h-4 flex-shrink-0 text-brand-gold" />
            <span>{salary}</span>
          </div>
        )}

        {experience && (
          <div className="flex items-center gap-2 text-sm text-brand-navy/70">
            <Briefcase className="w-4 h-4 flex-shrink-0 text-brand-teal" />
            <span>{experience}</span>
          </div>
        )}

        {deadline && (
          <div className="flex items-center gap-2 text-sm text-brand-navy/70">
            <Clock className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>Apply by {deadline}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Link
          href={href}
          className="text-sm font-semibold text-brand-teal hover:text-brand-navy transition-colors flex items-center gap-1"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </Link>
        {action && <div>{action}</div>}
      </div>
    </motion.div>
  );
}
