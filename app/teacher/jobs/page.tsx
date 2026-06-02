"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Filter,
  Loader2,
  MapPin,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DistributionChartCard, MetricChartCard } from "@/components/dashboard/dashboard-charts";
import { getTeacherNavItems } from "@/components/dashboard/teacher-nav";
import {
  fetchActiveJobPosts,
  type JobPost,
  type JobPostsQuery,
  type JobType,
  type TeachingMode,
} from "@/lib/api";

type FilterState = {
  subject: string;
  classLevel: string;
  location: string;
  teachingMode: TeachingMode | "";
  jobType: JobType | "";
};

const defaultFilters: FilterState = {
  subject: "",
  classLevel: "",
  location: "",
  teachingMode: "",
  jobType: "",
};

function formatTeachingMode(mode: TeachingMode) {
  if (mode === "ONLINE") return "Online";
  if (mode === "OFFLINE") return "In-person";
  return "Hybrid";
}

function formatJobType(type: JobType) {
  return type.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSalary(min: number | null, max: number | null) {
  if (min === null && max === null) return "Salary not listed";
  const format = (value: number) => `$${value.toLocaleString()}`;
  if (min !== null && max !== null) return `${format(min)} - ${format(max)}`;
  if (min !== null) return `From ${format(min)}`;
  return `Up to ${format(max!)}`;
}

function buildQuery(filters: FilterState): JobPostsQuery {
  return {
    subject: filters.subject.trim() || undefined,
    classLevel: filters.classLevel.trim() || undefined,
    location: filters.location.trim() || undefined,
    teachingMode: filters.teachingMode || undefined,
    jobType: filters.jobType || undefined,
  };
}

function FilterInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-[16px] border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-sky/25"
      />
    </label>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-[16px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-sky/25"
    >
      {children}
    </select>
  );
}

function JobListCard({ job }: { job: JobPost }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(17,34,68,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(17,34,68,0.08)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eef5fb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#61748b]">
              {formatTeachingMode(job.teachingMode)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f7faff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              {formatJobType(job.jobType)}
            </span>
          </div>
          <h2 className="mt-3 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#31455f]">
            {job.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{job.institution.institutionName}</p>
        </div>

        <Link
          href={`/teacher/jobs/${job.id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-[#31465f] px-4 text-sm font-semibold text-white transition hover:bg-[#25384f]"
        >
          View details
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[18px] bg-[#f7fbff] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Subject</p>
          <p className="mt-2 text-sm font-semibold text-[#31455f]">{job.subject}</p>
        </div>
        <div className="rounded-[18px] bg-[#f7fbff] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Class level</p>
          <p className="mt-2 text-sm font-semibold text-[#31455f]">{job.classLevel}</p>
        </div>
        <div className="rounded-[18px] bg-[#f7fbff] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Location</p>
          <p className="mt-2 text-sm font-semibold text-[#31455f]">{job.location || "Remote / flexible"}</p>
        </div>
        <div className="rounded-[18px] bg-[#f7fbff] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Compensation</p>
          <p className="mt-2 text-sm font-semibold text-[#31455f]">{formatSalary(job.salaryMin, job.salaryMax)}</p>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-slate-200 bg-white px-4 py-4">
        <p className="line-clamp-3 text-sm leading-7 text-slate-500">{job.description}</p>
      </div>
    </article>
  );
}

function EmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <div className="rounded-[26px] border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-[0_16px_38px_rgba(17,34,68,0.05)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eef5fb] text-brand-teal">
        <BriefcaseBusiness size={24} />
      </div>
      <h3 className="mt-5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#31455f]">
        No jobs found
      </h3>
      <p className="mx-auto mt-3 text-sm leading-7 text-slate-500">
        {hasFilters
          ? "Try adjusting the filters to broaden the results."
          : "Active teaching opportunities will appear here as institutions publish them."}
      </p>
      {hasFilters ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-[#31465f] px-4 text-sm font-semibold text-white transition hover:bg-[#25384f]"
        >
          <RefreshCcw size={16} />
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

function TeacherJobsContent({ accessToken }: { accessToken: string }) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const hasFilters = Object.values(filters).some(Boolean);
  const openRoles = jobs.length;
  const remoteFriendly = jobs.filter((job) => job.teachingMode !== "OFFLINE").length;
  const salaryVisible = jobs.filter((job) => job.salaryMin !== null || job.salaryMax !== null).length;

  const loadJobs = useCallback(async (query: JobPostsQuery, options?: { preserveLoading?: boolean }) => {
    if (!options?.preserveLoading) {
      setIsLoading(true);
    }
    try {
      const result = await fetchActiveJobPosts(accessToken, query);
      setJobs(result);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void Promise.resolve().then(() => loadJobs({}, { preserveLoading: true }));
  }, [loadJobs]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadJobs(buildQuery(filters));
  }

  async function handleReset() {
    setFilters(defaultFilters);
    await loadJobs({});
  }

  const summaryLabel = useMemo(() => {
    if (isLoading) return "Refreshing opportunities";
    if (hasFilters) return `${jobs.length} filtered opportunities`;
    return `${jobs.length} active opportunities`;
  }, [hasFilters, isLoading, jobs.length]);

  return (
    <div className="space-y-4 lg:space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-brand-navy/50 bg-[radial-gradient(circle_at_top_left,_rgba(185,231,251,0.24),_transparent_28%),linear-gradient(135deg,#07111f_0%,#0b3d47_52%,#0b8f88_100%)] px-5 py-5 text-white shadow-[0_28px_64px_rgba(16,32,51,0.26)] sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/76">
                <Sparkles size={14} className="text-[#7ce2e8]" />
                Opportunity board
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/76">
                {summaryLabel}
              </span>
            </div>
            <h1 className="mt-3 font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-white sm:text-[2.7rem]">
              Browse Jobs
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/72 sm:text-[14px]">Filter and review active opportunities.</p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] border border-white/10 bg-white/10 px-4 py-3.5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/44">Open roles</p>
              <p className="mt-2.5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-white">
                {isLoading ? "..." : openRoles}
              </p>
            </div>
            <div className="rounded-[20px] border border-brand-sky/20 bg-brand-sky/12 px-4 py-3.5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/44">Remote friendly</p>
              <p className="mt-2.5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-brand-sky">
                {isLoading ? "..." : remoteFriendly}
              </p>
            </div>
            <div className="rounded-[20px] border border-[#ffd57d]/20 bg-[#f3b33d]/14 px-4 py-3.5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/44">Salary shown</p>
              <p className="mt-2.5 font-[family:var(--font-display)] text-[1.8rem] font-semibold tracking-tight text-[#ffe39a]">
                {isLoading ? "..." : salaryVisible}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(17,34,68,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Filters</p>
            <h2 className="mt-2 font-[family:var(--font-display)] text-[1.7rem] font-semibold tracking-tight text-[#31455f]">
              Find the right match
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="inline-flex min-h-11 items-center gap-2 rounded-[16px] border border-brand-sky/35 bg-brand-light px-4 text-sm font-semibold text-brand-navy transition hover:bg-white"
            >
              <SlidersHorizontal size={16} />
              {filtersOpen ? "Hide filters" : "Show filters"}
            </button>
            <button
              type="button"
              onClick={() => void loadJobs(buildQuery(filters))}
              className="inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-brand-navy px-4 text-sm font-semibold text-white transition hover:bg-brand-teal"
            >
              <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {filtersOpen ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <FilterInput
                icon={<Search size={16} />}
                placeholder="Subject"
                value={filters.subject}
                onChange={(value) => setFilters((current) => ({ ...current, subject: value }))}
              />
              <FilterInput
                icon={<BookOpen size={16} />}
                placeholder="Class level"
                value={filters.classLevel}
                onChange={(value) => setFilters((current) => ({ ...current, classLevel: value }))}
              />
              <FilterInput
                icon={<MapPin size={16} />}
                placeholder="Location"
                value={filters.location}
                onChange={(value) => setFilters((current) => ({ ...current, location: value }))}
              />
              <FilterSelect
                value={filters.teachingMode}
                onChange={(value) => setFilters((current) => ({ ...current, teachingMode: value as TeachingMode | "" }))}
              >
                <option value="">Teaching mode</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">In-person</option>
                <option value="BOTH">Hybrid</option>
              </FilterSelect>
              <FilterSelect
                value={filters.jobType}
                onChange={(value) => setFilters((current) => ({ ...current, jobType: value as JobType | "" }))}
              >
                <option value="">Job type</option>
                <option value="FULL_TIME">Full time</option>
                <option value="PART_TIME">Part time</option>
                <option value="CONTRACT">Contract</option>
                <option value="TEMPORARY">Temporary</option>
              </FilterSelect>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center gap-2 rounded-[16px] bg-brand-navy px-4 text-sm font-semibold text-white transition hover:bg-brand-teal"
              >
                <Filter size={16} />
                Apply filters
              </button>
              <button
                type="button"
                onClick={() => void handleReset()}
                className="inline-flex min-h-11 items-center gap-2 rounded-[16px] border border-brand-sky/35 bg-brand-light px-4 text-sm font-semibold text-brand-navy transition hover:bg-white"
              >
                <RefreshCcw size={16} />
                Reset
              </button>
            </div>
          </form>
        ) : null}
      </section>

      {errorMessage ? (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-3 xl:grid-cols-[1.25fr_0.9fr]">
        <MetricChartCard
          title="Opportunity chart"
          totalLabel="Current feed"
          totalValue={isLoading ? "..." : jobs.length}
          labels={["Open", "Remote", "Salary"]}
          values={[openRoles, remoteFriendly, salaryVisible]}
          colors={["#102033", "#0b8f88", "#f3b33d"]}
        />
        <DistributionChartCard
          title="Role mix"
          labels={["Remote-friendly", "On-site", "Salary shown"]}
          values={[remoteFriendly, Math.max(openRoles - remoteFriendly, 0), salaryVisible]}
          colors={["#0b8f88", "#102033", "#f3b33d"]}
        />
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-[26px] border border-slate-200 bg-white px-6 py-12 text-center shadow-[0_16px_38px_rgba(17,34,68,0.05)]">
            <Loader2 size={24} className="mx-auto animate-spin text-slate-400" />
            <p className="mt-4 text-sm font-medium text-slate-500">Loading opportunities</p>
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onReset={() => void handleReset()} />
        ) : (
          jobs.map((job) => <JobListCard key={job.id} job={job} />)
        )}
      </section>
    </div>
  );
}

export default function TeacherJobsPage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading teacher jobs...">
      {({ user, accessToken, logoutAction, isLoggingOut }) => (
        <DashboardLayout
          navItems={getTeacherNavItems("jobs")}
          userName={user.name}
          userEmail={user.email}
          userRole={user.role}
          settingsHref="/teacher/profile"
          onLogout={logoutAction}
          isLoggingOut={isLoggingOut}
        >
          <TeacherJobsContent accessToken={accessToken} />
        </DashboardLayout>
      )}
    </RoleProtectedPage>
  );
}
