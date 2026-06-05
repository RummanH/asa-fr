import type { InstitutionProfile, TeacherProfile } from "@/lib/api";

function percentFromFlags(flags: boolean[]): number {
  const total = flags.length;
  if (total === 0) return 0;
  const filled = flags.filter(Boolean).length;
  return Math.round((filled / total) * 100);
}

function hasText(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function getTeacherProfileCompletion(profile: TeacherProfile | null | undefined): number {
  if (!profile) return 0;

  return percentFromFlags([
    hasText(profile.phone),
    Boolean(profile.gender),
    hasText(profile.dateOfBirth),
    hasText(profile.education),
    hasText(profile.experience),
    profile.subjects.length > 0,
    profile.classLevels.length > 0,
    profile.expectedSalary !== null,
    hasText(profile.location),
    Boolean(profile.teachingMode),
    hasText(profile.bio),
    hasText(profile.profileImage),
  ]);
}

export function getInstitutionProfileCompletion(profile: InstitutionProfile | null | undefined): number {
  if (!profile) return 0;

  return percentFromFlags([
    hasText(profile.institutionName),
    hasText(profile.phone),
    hasText(profile.address),
    hasText(profile.website),
    hasText(profile.description),
    hasText(profile.logo),
  ]);
}
