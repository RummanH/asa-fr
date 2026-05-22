"use client";

import { FormEvent, type ReactNode, useMemo, useState } from "react";
import {
  type JobPost,
  type JobPostPayload,
  type JobType,
  type TeachingMode,
} from "@/lib/api";
import { useToast } from "@/components/ui/toast-provider";

type JobPostFormProps = {
  initialValues?: JobPost | null;
  submitLabel: string;
  onSubmit: (payload: JobPostPayload) => Promise<void>;
};

export function JobPostForm({ initialValues, submitLabel, onSubmit }: JobPostFormProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [subject, setSubject] = useState(initialValues?.subject ?? "");
  const [classLevel, setClassLevel] = useState(initialValues?.classLevel ?? "");
  const [jobType, setJobType] = useState<JobType>(initialValues?.jobType ?? "FULL_TIME");
  const [salaryMin, setSalaryMin] = useState(
    initialValues?.salaryMin === null || initialValues?.salaryMin === undefined
      ? ""
      : String(initialValues.salaryMin),
  );
  const [salaryMax, setSalaryMax] = useState(
    initialValues?.salaryMax === null || initialValues?.salaryMax === undefined
      ? ""
      : String(initialValues.salaryMax),
  );
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>(
    initialValues?.teachingMode ?? "ONLINE",
  );
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [requirements, setRequirements] = useState(initialValues?.requirements ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const salaryValidation = useMemo(() => {
    if (!salaryMin || !salaryMax) {
      return "";
    }
    const min = Number(salaryMin);
    const max = Number(salaryMax);
    if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) {
      return "Minimum salary cannot be greater than maximum salary.";
    }
    return "";
  }, [salaryMin, salaryMax]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (salaryValidation) {
      showToast(salaryValidation, "error");
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
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      <Field label="Title">
        <input
          className={inputClassName}
          value={title}
          required
          minLength={2}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field label="Subject">
        <input
          className={inputClassName}
          value={subject}
          required
          minLength={2}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Field>

      <Field label="Class Level">
        <input
          className={inputClassName}
          value={classLevel}
          required
          minLength={1}
          onChange={(e) => setClassLevel(e.target.value)}
        />
      </Field>

      <Field label="Job Type">
        <select
          className={inputClassName}
          value={jobType}
          onChange={(e) => setJobType(e.target.value as JobType)}
        >
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="TEMPORARY">Temporary</option>
        </select>
      </Field>

      <Field label="Salary Min">
        <input
          className={inputClassName}
          value={salaryMin}
          type="number"
          min="0"
          onChange={(e) => setSalaryMin(e.target.value)}
        />
      </Field>

      <Field label="Salary Max">
        <input
          className={inputClassName}
          value={salaryMax}
          type="number"
          min="0"
          onChange={(e) => setSalaryMax(e.target.value)}
        />
      </Field>

      <Field label="Location">
        <input className={inputClassName} value={location} onChange={(e) => setLocation(e.target.value)} />
      </Field>

      <Field label="Teaching Mode">
        <select
          className={inputClassName}
          value={teachingMode}
          onChange={(e) => setTeachingMode(e.target.value as TeachingMode)}
        >
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
          <option value="BOTH">Both</option>
        </select>
      </Field>

      <div className="md:col-span-2">
        <Field label="Description">
          <textarea
            className={`app-textarea min-h-24`}
            value={description}
            required
            minLength={10}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="Requirements">
          <textarea
            className={`app-textarea min-h-20`}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
        </Field>
      </div>

      <div className="md:col-span-2">
        <button
          className="app-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="grid gap-1 text-sm text-brand-navy/90">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "app-input";

