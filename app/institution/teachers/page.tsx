"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import { SendHireRequestButton } from "@/components/hire/send-hire-request-button";
import { useToast } from "@/components/ui/toast-provider";
import {
  fetchTeachers,
  type TeacherDirectoryItem,
  type TeacherDirectoryQuery,
  type TeachingMode,
} from "@/lib/api";

export default function InstitutionTeachersPage() {
  return (
    <RoleProtectedPage role="INSTITUTION" loadingLabel="Loading teachers...">
      {({ accessToken }) => <InstitutionTeachersContent accessToken={accessToken} />}
    </RoleProtectedPage>
  );
}

type InstitutionTeachersContentProps = {
  accessToken: string;
};

function InstitutionTeachersContent({ accessToken }: InstitutionTeachersContentProps) {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<TeacherDirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [location, setLocation] = useState("");
  const [teachingMode, setTeachingMode] = useState<TeachingMode | "">("");
  const [availability, setAvailability] = useState<"ALL" | "AVAILABLE" | "UNAVAILABLE">(
    "AVAILABLE",
  );

  const loadTeachers = useCallback(
    async (token: string, query: TeacherDirectoryQuery) => {
      try {
        const result = await fetchTeachers(token, query);
        setTeachers(result);
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Failed to load teachers", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTeachers(accessToken, { isAvailable: true });
  }, [accessToken, loadTeachers]);

  function buildQuery(): TeacherDirectoryQuery {
    return {
      subject: subject.trim() || undefined,
      classLevel: classLevel.trim() || undefined,
      location: location.trim() || undefined,
      teachingMode: teachingMode || undefined,
      isAvailable:
        availability === "AVAILABLE"
          ? true
          : availability === "UNAVAILABLE"
            ? false
            : undefined,
    };
  }

  async function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    await loadTeachers(accessToken, buildQuery());
  }

  return (
    <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="app-container space-y-5">
        <section className="app-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-brand-navy">Browse Teachers</h1>
              <p className="mt-2 text-sm text-brand-navy/65">
                Explore teacher profiles and open details for hiring discussion.
              </p>
            </div>
            <Link
              className="app-btn-secondary"
              href="/institution/dashboard"
            >
              Dashboard
            </Link>
          </div>
        </section>

        <section className="app-panel p-6 sm:p-8">
          <form className="grid gap-3 md:grid-cols-3" onSubmit={handleFilter}>
            <input
              className={inputClassName}
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              className={inputClassName}
              placeholder="Class Level"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
            />
            <input
              className={inputClassName}
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <select
              className={inputClassName}
              value={teachingMode}
              onChange={(e) => setTeachingMode(e.target.value as TeachingMode | "")}
            >
              <option value="">Teaching Mode (All)</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="BOTH">Both</option>
            </select>
            <select
              className={inputClassName}
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value as "ALL" | "AVAILABLE" | "UNAVAILABLE")
              }
            >
              <option value="ALL">All Teachers</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="UNAVAILABLE">Unavailable Only</option>
            </select>
            <div className="md:col-span-3 flex flex-wrap gap-2">
              <button
                className="app-btn-primary"
                type="submit"
              >
                Apply Filters
              </button>
              <button
                className="app-btn-secondary"
                type="button"
                onClick={async () => {
                  setSubject("");
                  setClassLevel("");
                  setLocation("");
                  setTeachingMode("");
                  setAvailability("AVAILABLE");
                  setIsLoading(true);
                  await loadTeachers(accessToken, { isAvailable: true });
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="app-panel p-6 sm:p-8">
          {isLoading ? <p className="text-sm text-brand-navy/78">Loading teachers...</p> : null}

          {!isLoading && teachers.length === 0 ? (
            <div className="app-empty">
              <p className="text-base font-medium text-brand-navy/90">No teachers found.</p>
              <p className="mt-1 text-sm text-brand-navy/65">Try adjusting your filters.</p>
            </div>
          ) : null}

          {!isLoading && teachers.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {teachers.map((teacher) => (
                <article key={teacher.id} className="app-panel-muted p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-brand-navy">{teacher.user.name}</h2>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        {teacher.location ?? "Location not specified"} - {" "}
                        {teacher.teachingMode
                          ? formatTeachingMode(teacher.teachingMode)
                          : "Mode not set"}
                      </p>
                      <p className="mt-1 text-sm text-brand-navy/65">
                        {teacher.subjects.length > 0 ? teacher.subjects.join(", ") : "Subjects not listed"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        teacher.isAvailable
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#edf6fb] text-brand-navy/78"
                      }`}
                    >
                      {teacher.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {teacher.isAvailable ? (
                      <Link
                        className="app-btn-primary px-3 py-1.5 text-sm"
                        href={`/institution/teachers/${teacher.id}`}
                      >
                        View Details
                      </Link>
                    ) : (
                      <button
                        className="app-btn-secondary px-3 py-1.5 text-sm opacity-60 disabled:cursor-not-allowed"
                        type="button"
                        disabled
                      >
                        Details Hidden
                      </button>
                    )}
                    {teacher.isAvailable ? (
                      <Link
                        className="app-btn-secondary px-3 py-1.5 text-sm"
                        href={`/institution/messages?teacherId=${teacher.id}`}
                      >
                        Start Chat
                      </Link>
                    ) : (
                      <button
                        className="app-btn-secondary px-3 py-1.5 text-sm opacity-60 disabled:cursor-not-allowed"
                        type="button"
                        disabled
                      >
                        Chat Unavailable
                      </button>
                    )}
                    <SendHireRequestButton
                      accessToken={accessToken}
                      teacherId={teacher.id}
                      buttonClassName="app-btn-secondary px-3 py-1.5 text-sm"
                      disabled={!teacher.isAvailable}
                      disabledLabel="Unavailable"
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function formatTeachingMode(mode: TeachingMode): string {
  if (mode === "ONLINE") {
    return "Online";
  }
  if (mode === "OFFLINE") {
    return "Offline";
  }
  return "Online/Offline";
}

const inputClassName =
  "app-input";

