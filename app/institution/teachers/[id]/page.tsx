"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { SendHireRequestButton } from "@/components/hire/send-hire-request-button";
import { useToast } from "@/components/ui/toast-provider";
import { fetchTeacherById, type TeacherDirectoryItem } from "@/lib/api";

export default function InstitutionTeacherDetailsPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading teacher details...">
      {({ accessToken }) => <InstitutionTeacherDetailsContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type InstitutionTeacherDetailsContentProps = {
  accessToken: string;
};

function InstitutionTeacherDetailsContent({ accessToken }: InstitutionTeacherDetailsContentProps) {
  const { showToast } = useToast();
  const params = useParams<{ id: string }>();
  const teacherId = params.id;

  const [teacher, setTeacher] = useState<TeacherDirectoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!teacherId) {
      return;
    }

    fetchTeacherById(accessToken, teacherId)
      .then((result) => {
        setTeacher(result);
        setErrorMessage("");
      })
      .catch((error) => {
        const nextMessage =
          error instanceof Error ? error.message : "Failed to load teacher details";
        setErrorMessage(nextMessage);
        showToast(nextMessage, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, showToast, teacherId]);

  if (isLoading) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-brand-navy/78">Loading teacher details...</p>
        </div>
      </main>
    );
  }

  if (!teacherId) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-red-700">Invalid teacher id.</p>
          <Link
            className="mt-4 inline-block app-btn-secondary"
            href="/institution/teachers"
          >
            Back to Teachers
          </Link>
        </div>
      </main>
    );
  }

  if (!teacher) {
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="app-container max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-red-700">{errorMessage || "Teacher not found"}</p>
          <Link
            className="mt-4 inline-block app-btn-secondary"
            href="/institution/teachers"
          >
            Back to Teachers
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container max-w-4xl space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-brand-navy">{teacher.user.name}</h1>
            <Link
              className="app-btn-secondary"
              href="/institution/teachers"
            >
              Back to Teachers
            </Link>
          </div>
          <p className="mt-2 text-sm text-brand-navy/65">{teacher.user.email}</p>
          <p className="mt-1 text-sm text-brand-navy/65">
            {teacher.location ?? "Location not specified"} - {" "}
            {teacher.teachingMode ? formatTeachingMode(teacher.teachingMode) : "Mode not set"}
          </p>
          <p className="mt-1 text-sm text-brand-navy/65">
            Availability: {teacher.isAvailable ? "Available" : "Unavailable"}
          </p>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand-navy">Profile Summary</h2>
          <div className="mt-3 grid gap-2 text-sm text-brand-navy/78">
            <p>
              Subjects: {teacher.subjects.length > 0 ? teacher.subjects.join(", ") : "Not listed"}
            </p>
            <p>
              Class Levels:{" "}
              {teacher.classLevels.length > 0 ? teacher.classLevels.join(", ") : "Not listed"}
            </p>
            <p>Education: {teacher.education ?? "Not provided"}</p>
            <p>Experience: {teacher.experience ?? "Not provided"}</p>
            <p>
              Expected Salary:{" "}
              {teacher.expectedSalary !== null ? String(teacher.expectedSalary) : "Not specified"}
            </p>
            <p>Phone: {teacher.phone ?? "Not provided"}</p>
          </div>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand-navy">Bio</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-brand-navy/78">
            {teacher.bio ?? "No bio provided."}
          </p>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-brand-navy">Actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {teacher.isAvailable ? (
              <Link
                className="app-btn-primary"
                href={`/institution/messages?teacherId=${teacher.id}`}
              >
                Start Chat
              </Link>
            ) : (
              <button
                className="app-btn-secondary opacity-60 disabled:cursor-not-allowed"
                type="button"
                disabled
              >
                Chat Unavailable
              </button>
            )}
            <SendHireRequestButton
              accessToken={accessToken}
              teacherId={teacher.id}
              buttonClassName="app-btn-secondary"
              disabled={!teacher.isAvailable}
              disabledLabel="Unavailable"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function formatTeachingMode(mode: "ONLINE" | "OFFLINE" | "BOTH"): string {
  if (mode === "ONLINE") {
    return "Online";
  }
  if (mode === "OFFLINE") {
    return "Offline";
  }
  return "Online/Offline";
}
