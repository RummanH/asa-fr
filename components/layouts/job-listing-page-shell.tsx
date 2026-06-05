"use client";

import { ReactNode } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { ModernInput } from "@/components/forms/modern-form";
import { ModernSelect } from "@/components/forms/modern-form";
import { motion } from "motion/react";
import { Search, RotateCcw } from "lucide-react";

interface JobListingPageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showFilters?: boolean;
  onSearch?: (query: string) => void;
  onFilterChange?: (key: string, value: string) => void;
  searchValue?: string;
  filters?: Record<string, { label: string; options: Array<{ value: string; label: string }> }>;
}

export function JobListingPageShell({
  title,
  subtitle,
  children,
  showFilters = true,
  onSearch,
  onFilterChange,
  searchValue = "",
  filters = {},
}: JobListingPageShellProps) {
  return (
    <PageLayout
      title={title}
      subtitle={subtitle || "Explore available opportunities"}
      maxWidth="xl"
    >
      <div className="space-y-4 md:space-y-6">
        {/* Search and filters */}
        {showFilters && (
          <motion.div
            className="rounded-[20px] bg-white/88 p-4 shadow-none ring-1 ring-slate-200/55 backdrop-blur-sm md:rounded-2xl md:border md:border-slate-200/60 md:bg-white md:p-6 md:shadow-sm md:ring-0 space-y-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Search bar */}
            <div>
              <ModernInput
                icon={<Search className="w-4 h-4" />}
                placeholder="Search by title, institution, or location..."
                value={searchValue}
                onChange={(e) => onSearch?.(e.target.value)}
                variant="filled"
              />
            </div>

            {/* Filter controls */}
            {Object.keys(filters).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(filters).map(([key, filter]) => (
                  <ModernSelect
                    key={key}
                    options={filter.options}
                    onChange={(e) => {
                      onFilterChange?.(key, e.currentTarget.value);
                    }}
                    variant="filled"
                  />
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    Object.keys(filters).forEach((key) => {
                      onFilterChange?.(key, "");
                    });
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-brand-navy hover:bg-brand-light/40 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Filters
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </PageLayout>
  );
}
