"use client";

import Link from "next/link";
import { FormEvent, type ReactNode, useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import {
  ApiError,
  createTeacherProfile,
  fetchTeacherProfile,
  updateTeacherAvailability,
  updateTeacherProfile,
  type TeacherProfilePayload,
} from "@/lib/api";
import { useToast } from "@/components/ui/toast-provider";

type GenderValue = "" | "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";
type TeachingModeValue = "" | "ONLINE" | "OFFLINE" | "BOTH";

export default function TeacherProfilePage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading teacher profile...">
      {({ accessToken }) => <TeacherProfileForm accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type TeacherProfileFormProps = {
  accessToken: string;
};

function TeacherProfileForm({ accessToken }: TeacherProfileFormProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<GenderValue>("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [subjectsText, setSubjectsText] = useState("");
  const [classLevelsText, setClassLevelsText] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [location, setLocation] = useState("");
  const [teachingMode, setTeachingMode] = useState<TeachingModeValue>("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    fetchTeacherProfile(accessToken)
      .then((profile) => {
        setProfileExists(true);
        setPhone(profile.phone ?? "");
        setGender(profile.gender ?? "");
        setDateOfBirth(profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "");
        setEducation(profile.education ?? "");
        setExperience(profile.experience ?? "");
        setSubjectsText(profile.subjects.join(", "));
        setClassLevelsText(profile.classLevels.join(", "));
        setExpectedSalary(
          profile.expectedSalary === null || profile.expectedSalary === undefined
            ? ""
            : String(profile.expectedSalary),
        );
        setLocation(profile.location ?? "");
        setTeachingMode(profile.teachingMode ?? "");
        setBio(profile.bio ?? "");
        setProfileImage(profile.profileImage ?? "");
        setIsAvailable(profile.isAvailable);
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) {
          setProfileExists(false);
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : "Failed to load profile");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: TeacherProfilePayload = {
        phone,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
        education,
        experience,
        subjects: parseList(subjectsText),
        classLevels: parseList(classLevelsText),
        expectedSalary: expectedSalary ? Number(expectedSalary) : undefined,
        location,
        teachingMode: teachingMode || undefined,
        bio,
        profileImage,
      };

      if (profileExists) {
        await updateTeacherProfile(accessToken, payload);
      } else {
        await createTeacherProfile(accessToken, payload);
        setProfileExists(true);
      }

      await updateTeacherAvailability(accessToken, isAvailable);
      showToast("Teacher profile saved successfully.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-brand-navy/78">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-4xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-brand-navy">Teacher Profile</h1>
            <Link
              className="app-btn-secondary"
              href="/teacher/dashboard"
            >
              Back to Dashboard
            </Link>
          </div>
          <p className="mt-2 text-sm text-brand-navy/65">
            {profileExists ? "Update your profile details." : "Create your teacher profile."}
          </p>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Field label="Phone">
              <input className={inputClassName} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Gender">
              <select
                className={inputClassName}
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderValue)}
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="UNSPECIFIED">Unspecified</option>
              </select>
            </Field>
            <Field label="Date of Birth">
              <input
                className={inputClassName}
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </Field>
            <Field label="Expected Salary">
              <input
                className={inputClassName}
                type="number"
                min="0"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
              />
            </Field>
            <Field label="Education">
              <input
                className={inputClassName}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            </Field>
            <Field label="Experience">
              <input
                className={inputClassName}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </Field>
            <Field label="Subjects (comma separated)">
              <input
                className={inputClassName}
                value={subjectsText}
                onChange={(e) => setSubjectsText(e.target.value)}
              />
            </Field>
            <Field label="Class Levels (comma separated)">
              <input
                className={inputClassName}
                value={classLevelsText}
                onChange={(e) => setClassLevelsText(e.target.value)}
              />
            </Field>
            <Field label="Location">
              <input
                className={inputClassName}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Field>
            <Field label="Teaching Mode">
              <select
                className={inputClassName}
                value={teachingMode}
                onChange={(e) => setTeachingMode(e.target.value as TeachingModeValue)}
              >
                <option value="">Select</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="BOTH">Both</option>
              </select>
            </Field>
            <Field label="Profile Image URL">
              <input
                className={inputClassName}
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Bio">
                <textarea
                  className={`app-textarea min-h-24`}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-brand-navy/90">
                <input
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  type="checkbox"
                />
                Available for new opportunities
              </label>
            </div>

            {errorMessage ? (
              <p className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <div className="md:col-span-2">
              <button
                className="app-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Saving..." : profileExists ? "Update Profile" : "Create Profile"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function parseList(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    ),
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

