"use client";

import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { type JobPost, type JobPostPayload, type JobType, type TeachingMode } from "@/lib/api";
import { useToast } from "@/components/ui/toast-provider";

type JobPostFormProps = {
  initialValues?: JobPost | null;
  submitLabel: string;
  onSubmit: (payload: JobPostPayload) => Promise<void>;
};

/* ── icons ── */
function IconBriefcase() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1" y="4.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.35" />
      <path d="M4.5 4.5V3a1.5 1.5 0 013 0v1.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M1 8h12" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}
function IconBook() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 2.5A1.5 1.5 0 013.5 1h7a1 1 0 011 1v9.5a1 1 0 01-1 1H3.5A1.5 1.5 0 012 11V2.5z"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <path d="M5 4.5h4M5 7h3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}
function IconGrade() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M5 7l1.5 1.5L9 5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.35" />
      <path d="M7 4v3.5l2 1.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}
function IconMoney() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.35" />
      <circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1.5A3.5 3.5 0 017 8.5c-2 0-3.5-3-3.5-3A3.5 3.5 0 017 1.5z" stroke="currentColor" strokeWidth="1.35" />
      <circle cx="7" cy="5" r="1" fill="currentColor" />
      <path d="M7 8.5v4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}
function IconMonitor() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="1" y="2" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.35" />
      <path d="M5 12h4M7 10v2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}
function IconText() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 3.5h10M2 6.5h7M2 9.5h9" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}
function IconList() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="2.5" cy="4" r="1" fill="currentColor" />
      <circle cx="2.5" cy="7" r="1" fill="currentColor" />
      <circle cx="2.5" cy="10" r="1" fill="currentColor" />
      <path d="M5 4h7M5 7h5M5 10h6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 7h10M7.5 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      style={{ animation: "jpf-spin 0.8s linear infinite" }}
    >
      <circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <path d="M7.5 2a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── section header ── */
function SectionHeader({ icon, title, step }: { icon: ReactNode; title: string; step: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, gridColumn: "1 / -1" }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          flexShrink: 0,
          background: "linear-gradient(135deg,#052f44,#075f75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(5,47,68,0.2)",
        }}
      >
        <span style={{ color: "#a9d3ef", display: "flex" }}>{icon}</span>
      </div>
      <span
        style={{ fontSize: 11, fontWeight: 800, color: "#052f44", letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #d4e6ef, transparent)" }} />
      <span style={{ fontSize: 10, fontWeight: 700, color: "#8eaab8", letterSpacing: "0.04em" }}>{step} / 3</span>
    </div>
  );
}

/* ── field wrapper ── */
function Field({
  label,
  icon,
  children,
  span2 = false,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  span2?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: span2 ? "1 / -1" : undefined }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 10,
          fontWeight: 800,
          color: "#052f44",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "#075f75", display: "flex" }}>{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

/* ── shared input style factory ── */
const baseInputStyle: React.CSSProperties = {
  width: "100%",
  height: "2.6rem",
  borderRadius: 10,
  border: "1.5px solid #ccdde8",
  background: "#fafcfe",
  color: "#052f44",
  fontSize: 13,
  fontWeight: 500,
  padding: "0 12px",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 160ms, background 160ms, box-shadow 160ms",
};

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        ...baseInputStyle,
        borderColor: focused ? "#075f75" : "#ccdde8",
        background: focused ? "#f4fbff" : "#fafcfe",
        boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...props}
      style={{
        ...baseInputStyle,
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238eaab8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: 32,
        cursor: "pointer",
        borderColor: focused ? "#075f75" : "#ccdde8",
        background: focused ? "#f4fbff" : "#fafcfe",
        boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      style={{
        ...baseInputStyle,
        height: undefined,
        minHeight: props.style?.minHeight ?? 96,
        padding: "10px 12px",
        resize: "vertical",
        lineHeight: 1.65,
        borderColor: focused ? "#075f75" : "#ccdde8",
        background: focused ? "#f4fbff" : "#fafcfe",
        boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/* ── salary range visualiser ── */
function SalaryHint({ min, max }: { min: string; max: string }) {
  const minN = Number(min),
    maxN = Number(max);
  if (!min && !max) return null;
  const valid = min && max && !isNaN(minN) && !isNaN(maxN) && minN <= maxN;
  if (min && max && minN > maxN) {
    return (
      <p
        style={{
          gridColumn: "1 / -1",
          fontSize: 11,
          color: "#e5484d",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginTop: -4,
        }}
      >
        ⚠ Min salary cannot exceed max salary
      </p>
    );
  }
  if (valid) {
    return (
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(169,211,239,0.12)",
          border: "1px solid rgba(169,211,239,0.3)",
          borderRadius: 10,
          padding: "8px 14px",
          marginTop: -4,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: "#075f75" }}>
          💰 Salary band: ${minN.toLocaleString()} – ${maxN.toLocaleString()} / yr
        </span>
        <div style={{ flex: 1, height: 5, borderRadius: 99, background: "#e4eef5", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 99,
              background: "linear-gradient(90deg,#075f75,#a9d3ef)",
              width: "100%",
            }}
          />
        </div>
      </div>
    );
  }
  return null;
}

/* ── divider ── */
function Divider() {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        height: 1,
        background: "linear-gradient(90deg, transparent, #d4e6ef 40%, #d4e6ef 60%, transparent)",
        margin: "4px 0",
      }}
    />
  );
}

/* ── main component ── */
export function JobPostForm({ initialValues, submitLabel, onSubmit }: JobPostFormProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [subject, setSubject] = useState(initialValues?.subject ?? "");
  const [classLevel, setClassLevel] = useState(initialValues?.classLevel ?? "");
  const [jobType, setJobType] = useState<JobType>(initialValues?.jobType ?? "FULL_TIME");
  const [salaryMin, setSalaryMin] = useState(initialValues?.salaryMin == null ? "" : String(initialValues.salaryMin));
  const [salaryMax, setSalaryMax] = useState(initialValues?.salaryMax == null ? "" : String(initialValues.salaryMax));
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>(initialValues?.teachingMode ?? "ONLINE");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [requirements, setRequirements] = useState(initialValues?.requirements ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const salaryError = useMemo(() => {
    if (!salaryMin || !salaryMax) return "";
    const min = Number(salaryMin),
      max = Number(salaryMax);
    return !isNaN(min) && !isNaN(max) && min > max ? "Minimum salary cannot be greater than maximum salary." : "";
  }, [salaryMin, salaryMax]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (salaryError) {
      showToast(salaryError, "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        subject: subject.trim(),
        classLevel: classLevel.trim(),
        jobType,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        location: location.trim(),
        teachingMode,
        description: description.trim(),
        requirements: requirements.trim(),
      });
      showToast("Saved successfully.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save job post", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes jpf-spin { to { transform: rotate(360deg); } }
        @keyframes jpf-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .jpf-root { animation: jpf-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .jpf-submit { transition: transform 160ms, box-shadow 160ms, background 160ms; }
        .jpf-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 20px 44px rgba(5,47,68,0.3) !important; }
        .jpf-submit:active:not(:disabled) { transform: none; }
      `}</style>

      <div
        className="jpf-root"
        style={{
          background: "white",
          borderRadius: 24,
          border: "1px solid rgba(212,230,239,0.8)",
          boxShadow: "0 20px 60px rgba(5,47,68,0.1), 0 1px 0 rgba(255,255,255,0.9) inset",
          overflow: "hidden",
        }}
      >
        {/* Card header */}
        <div
          style={{
            background: "linear-gradient(135deg, #052f44 0%, #065770 55%, #076b82 100%)",
            padding: "22px 28px 20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg
            style={{ position: "absolute", bottom: -24, right: -12, opacity: 0.1, pointerEvents: "none" }}
            width="150"
            height="100"
            viewBox="0 0 150 100"
            fill="none"
          >
            <circle cx="130" cy="100" r="90" stroke="white" strokeWidth="1" />
            <circle cx="130" cy="100" r="55" stroke="white" strokeWidth="0.7" />
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                flexShrink: 0,
                background: "rgba(169,211,239,0.15)",
                border: "1px solid rgba(169,211,239,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <rect x="2" y="6" width="16" height="11" rx="2" stroke="#a9d3ef" strokeWidth="1.5" />
                <path d="M6 6V4.5A2.5 2.5 0 0110 4.5V6" stroke="#a9d3ef" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 11h16" stroke="#a9d3ef" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: "white", letterSpacing: "-0.035em", margin: 0 }}>
                {initialValues ? "Edit Job Post" : "Post a New Job"}
              </h2>
              <p style={{ fontSize: 12, color: "rgba(169,211,239,0.75)", margin: "2px 0 0", lineHeight: 1 }}>
                Fill in the details below to {initialValues ? "update your listing" : "attract the right teachers"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "28px 28px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
            {/* ── Section 1: Role ── */}
            <SectionHeader icon={<IconBriefcase />} title="Role Details" step={1} />

            <Field label="Job Title" icon={<IconBriefcase />}>
              <StyledInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={2}
                placeholder="e.g. Senior Math Teacher"
              />
            </Field>

            <Field label="Subject" icon={<IconBook />}>
              <StyledInput
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                minLength={2}
                placeholder="e.g. Mathematics"
              />
            </Field>

            <Field label="Class Level" icon={<IconGrade />}>
              <StyledInput
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                required
                minLength={1}
                placeholder="e.g. Grade 9–12"
              />
            </Field>

            <Field label="Job Type" icon={<IconClock />}>
              <StyledSelect value={jobType} onChange={(e) => setJobType(e.target.value as JobType)}>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="TEMPORARY">Temporary</option>
              </StyledSelect>
            </Field>

            <Divider />

            {/* ── Section 2: Compensation & Location ── */}
            <SectionHeader icon={<IconMoney />} title="Compensation & Location" step={2} />

            <Field label="Salary Min ($/yr)" icon={<IconMoney />}>
              <StyledInput
                type="number"
                min="0"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="e.g. 40000"
              />
            </Field>

            <Field label="Salary Max ($/yr)" icon={<IconMoney />}>
              <StyledInput
                type="number"
                min="0"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="e.g. 70000"
              />
            </Field>

            <SalaryHint min={salaryMin} max={salaryMax} />

            <Field label="Location" icon={<IconPin />}>
              <StyledInput
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, NY"
              />
            </Field>

            <Field label="Teaching Mode" icon={<IconMonitor />}>
              <StyledSelect value={teachingMode} onChange={(e) => setTeachingMode(e.target.value as TeachingMode)}>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">In-Person</option>
                <option value="BOTH">Hybrid (Both)</option>
              </StyledSelect>
            </Field>

            <Divider />

            {/* ── Section 3: Description ── */}
            <SectionHeader icon={<IconText />} title="Job Description" step={3} />

            <Field label="Description" icon={<IconText />} span2>
              <StyledTextarea
                value={description}
                required
                minLength={10}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role, responsibilities, school culture…"
                style={{ minHeight: 112 }}
              />
            </Field>

            <Field label="Requirements" icon={<IconList />} span2>
              <StyledTextarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Qualifications, certifications, experience…"
                style={{ minHeight: 88 }}
              />
            </Field>

            {/* ── Submit ── */}
            <div style={{ gridColumn: "1 / -1", paddingTop: 8 }}>
              <button
                className="jpf-submit"
                type="submit"
                disabled={isSubmitting || !!salaryError}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  height: "2.85rem",
                  borderRadius: 12,
                  border: "none",
                  cursor: isSubmitting || !!salaryError ? "not-allowed" : "pointer",
                  background:
                    isSubmitting || !!salaryError
                      ? "#7a9fb0"
                      : "linear-gradient(135deg, #052f44 0%, #065770 60%, #076b82 100%)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  boxShadow: "0 12px 32px rgba(5,47,68,0.22)",
                  opacity: isSubmitting || !!salaryError ? 0.75 : 1,
                  fontFamily: "inherit",
                }}
              >
                {isSubmitting ? (
                  <>
                    <IconSpinner /> Saving…
                  </>
                ) : (
                  <>
                    {submitLabel} <IconArrow />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
