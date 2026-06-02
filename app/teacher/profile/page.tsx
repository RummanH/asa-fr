"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { RoleProtectedPage } from "@/components/auth/role-protected-page";
import {
  ApiError,
  createTeacherProfile,
  fetchTeacherProfile,
  uploadImage,
  updateTeacherAvailability,
  updateTeacherProfile,
  type TeacherProfilePayload,
} from "@/lib/api";
import { useToast } from "@/components/ui/toast-provider";
import { redesignImages } from "@/components/landing/redesign-images";

type GenderValue = "" | "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";
type TeachingModeValue = "" | "ONLINE" | "OFFLINE" | "BOTH";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getTeacherNavItems } from "@/components/dashboard/teacher-nav";

export default function TeacherProfilePage() {
  return (
    <RoleProtectedPage role="TEACHER" loadingLabel="Loading teacher profile...">
      {({ user, accessToken, logoutAction, isLoggingOut }) => {
        return (
          <DashboardLayout
            navItems={getTeacherNavItems("profile")}
            userName={user.name}
            userEmail={user.email}
            userRole={user.role}
            settingsHref="/teacher/profile"
            onLogout={logoutAction}
            isLoggingOut={isLoggingOut}
          >
            <TeacherProfileForm accessToken={accessToken} />
          </DashboardLayout>
        );
      }}
    </RoleProtectedPage>
  );
}

/* ── helpers ── */
function parseList(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}

/* ── icons ── */
function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const I = {
  user: "M8 2a3 3 0 100 6 3 3 0 000-6zM2 14c0-3.314 2.686-6 6-6s6 2.686 6 6",
  phone: "M3 2h3l1.5 3.5-2 1.5a9 9 0 004.5 4.5l1.5-2L15 11v3a1 1 0 01-1 1A13 13 0 012 3a1 1 0 011-1z",
  gender: "M10 2h4m0 0v4m0-4L9 7m-1 2a4 4 0 11-8 0 4 4 0 018 0z",
  calendar: "M2 5h12M5 2v3M11 2v3M3 5h10a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z",
  money: "M2 5h12a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zM5.5 8.5h5",
  grad: "M8 2l7 4-7 4-7-4 7-4zM3 8v4c0 1.657 2.239 3 5 3s5-1.343 5-3V8",
  star: "M8 1l2 4.5H15l-4 3 1.5 5L8 11l-4.5 2.5L5 8.5 1 5.5h5z",
  book: "M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM5 6h6M5 9h4",
  grade: "M8 2a6 6 0 100 12A6 6 0 008 2zM5.5 8l2 2L11 6",
  pin: "M8 1.5A3.5 3.5 0 018 8.5c-2 0-3.5-2.5-3.5-2.5A3.5 3.5 0 018 1.5zM8 5a1 1 0 100 2 1 1 0 000-2zM8 8.5v6",
  monitor: "M2 3h12a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1zM5 13h6M8 11v2",
  image: "M2 3h12a1 1 0 011 1v9a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1zM1 10l3.5-3.5L7 9l2.5-2.5L15 12",
  text: "M2 3.5h12M2 7h9M2 10.5h10",
  check: "M3 8l3.5 3.5L13 4",
  arrow: "M3 8h10M9 4l4 4-4 4",
  upload: "M8 11V3M4 7l4-4 4 4M2 13h12",
  back: "M10 13L5 8l5-5",
  spinner: "",
};

/* ── styled field inputs ── */
function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        width: "100%",
        height: "2.55rem",
        padding: props.type === "file" ? "6px 12px" : "0 12px",
        borderRadius: 10,
        border: `1.5px solid ${focused ? "#075f75" : "#ccdde8"}`,
        backgroundColor: focused ? "#f4fbff" : "#fafcfe",
        color: "#052f44",
        fontSize: 13,
        fontWeight: 500,
        outline: "none",
        fontFamily: "inherit",
        boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
        transition: "border-color 160ms, background 160ms, box-shadow 160ms",
        cursor: props.type === "file" ? "pointer" : undefined,
      }}
    />
  );
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        width: "100%",
        height: "2.55rem",
        padding: "0 30px 0 12px",
        borderRadius: 10,
        border: `1.5px solid ${focused ? "#075f75" : "#ccdde8"}`,
        backgroundColor: focused ? "#f4fbff" : "#fafcfe",
        color: "#052f44",
        fontSize: 13,
        fontWeight: 500,
        outline: "none",
        fontFamily: "inherit",
        appearance: "none",
        cursor: "pointer",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238eaab8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 11px center",
        boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
        transition: "border-color 160ms, background 160ms, box-shadow 160ms",
      }}
    />
  );
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        width: "100%",
        minHeight: 96,
        padding: "10px 12px",
        borderRadius: 10,
        border: `1.5px solid ${focused ? "#075f75" : "#ccdde8"}`,
        backgroundColor: focused ? "#f4fbff" : "#fafcfe",
        color: "#052f44",
        fontSize: 13,
        fontWeight: 500,
        outline: "none",
        fontFamily: "inherit",
        resize: "vertical",
        lineHeight: 1.65,
        boxShadow: focused ? "0 0 0 3px rgba(7,95,117,0.1)" : "none",
        transition: "border-color 160ms, background 160ms, box-shadow 160ms",
      }}
    />
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
  icon: string;
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
        <span style={{ color: "#075f75", display: "flex" }}>
          <Icon d={icon} size={12} />
        </span>
        {label}
      </span>
      {children}
    </label>
  );
}

/* ── section header ── */
function SectionHeader({ icon, title, step, total }: { icon: string; title: string; step: number; total: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        gridColumn: "1 / -1",
        marginTop: step === 1 ? 0 : 8,
        marginBottom: 2,
      }}
    >
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
          boxShadow: "0 3px 8px rgba(5,47,68,0.2)",
        }}
      >
        <span style={{ color: "#a9d3ef", display: "flex" }}>
          <Icon d={icon} size={13} />
        </span>
      </div>
      <span
        style={{ fontSize: 11, fontWeight: 800, color: "#052f44", letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#d4e6ef,transparent)" }} />
      <span style={{ fontSize: 10, fontWeight: 700, color: "#8eaab8" }}>
        {step} / {total}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        height: 1,
        background: "linear-gradient(90deg,transparent,#d4e6ef 40%,#d4e6ef 60%,transparent)",
        margin: "4px 0",
      }}
    />
  );
}

/* ── availability toggle ── */
function AvailabilityToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: checked ? "rgba(48,164,108,0.08)" : "rgba(212,230,239,0.25)",
          border: `1.5px solid ${checked ? "rgba(48,164,108,0.3)" : "#ccdde8"}`,
          borderRadius: 12,
          padding: "12px 16px",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
          fontFamily: "inherit",
          transition: "background 200ms, border-color 200ms",
        }}
      >
        {/* Toggle pill */}
        <div
          style={{
            width: 40,
            height: 22,
            borderRadius: 999,
            flexShrink: 0,
            position: "relative",
            background: checked ? "linear-gradient(135deg,#1a7a4a,#22a05a)" : "#c8dde9",
            boxShadow: checked ? "0 2px 8px rgba(26,122,74,0.3)" : "none",
            transition: "background 200ms",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "white",
              position: "absolute",
              top: 3,
              left: checked ? 21 : 3,
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              transition: "left 200ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#052f44", margin: "0 0 2px" }}>
            Available for new opportunities
          </p>
          <p style={{ fontSize: 11, color: "#5d7280", margin: 0 }}>
            {checked
              ? "Your profile is visible to institutions actively hiring"
              : "You are currently hidden from job searches"}
          </p>
        </div>
        {checked && (
          <div
            style={{
              marginLeft: "auto",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(48,164,108,0.1)",
              border: "1px solid rgba(48,164,108,0.25)",
              borderRadius: 999,
              padding: "3px 10px",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#30a46c",
                boxShadow: "0 0 0 2px rgba(48,164,108,0.25)",
              }}
            />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#1a7a4a" }}>Active</span>
          </div>
        )}
      </button>
    </div>
  );
}

/* ── avatar upload zone ── */
function AvatarUpload({
  profileImage,
  isUploading,
  onUpload,
}: {
  profileImage?: string | undefined;
  isUploading: boolean;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 20 }}>
      {/* Avatar preview */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: profileImage ? "none" : "linear-gradient(135deg,#052f44,#075f75)",
            border: "2px solid rgba(169,211,239,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(5,47,68,0.18)",
          }}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: "#a9d3ef", display: "flex" }}>
              <Icon d={I.user} size={28} />
            </span>
          )}
        </div>
        {isUploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              background: "rgba(5,47,68,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={{ animation: "tpf-spin 0.8s linear infinite" }}
            >
              <circle cx="10" cy="10" r="7" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
              <path d="M10 3a7 7 0 017 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Upload controls */}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#052f44", margin: "0 0 4px" }}>Profile Photo</p>
        <p style={{ fontSize: 11, color: "#5d7280", margin: "0 0 10px", lineHeight: 1.5 }}>
          Upload a clear photo. JPG, PNG or WebP, max 5MB.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "linear-gradient(135deg,#052f44,#075f75)",
              color: "white",
              border: "none",
              borderRadius: 9,
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: isUploading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: isUploading ? 0.7 : 1,
              boxShadow: "0 4px 12px rgba(5,47,68,0.2)",
              transition: "transform 150ms",
            }}
          >
            <Icon d={I.upload} size={13} />
            {isUploading ? "Uploading…" : "Upload Photo"}
          </button>
          {profileImage && (
            <a
              href={profileImage}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "white",
                color: "#052f44",
                border: "1.5px solid rgba(212,230,239,0.9)",
                borderRadius: 9,
                padding: "7px 14px",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Icon d={I.image} size={13} /> View Photo
            </a>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onUpload}
          disabled={isUploading}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}

/* ── spinner button ── */
function IconSpinner() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      style={{ animation: "tpf-spin 0.8s linear infinite" }}
    >
      <circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <path d="M7.5 2a5.5 5.5 0 015.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── main form ── */
function TeacherProfileForm({ accessToken }: { accessToken: string }) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
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
        setExpectedSalary(profile.expectedSalary == null ? "" : String(profile.expectedSalary));
        setLocation(profile.location ?? "");
        setTeachingMode(profile.teachingMode ?? "");
        setBio(profile.bio ?? "");
        setProfileImage(profile.profileImage ?? undefined);
        setIsAvailable(profile.isAvailable);
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) {
          setProfileExists(false);
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : "Failed to load profile");
      })
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  async function handleProfileImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Basic client-side validation
    if (!file.type.startsWith("image/")) {
      const msg = "Please upload a valid image file (JPG/PNG/WebP).";
      setErrorMessage(msg);
      showToast(msg, "error");
      e.target.value = "";
      return;
    }
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      const msg = "Image is too large. Maximum size is 5MB.";
      setErrorMessage(msg);
      showToast(msg, "error");
      e.target.value = "";
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage("");
    try {
      const result = await uploadImage(accessToken, file);
      setProfileImage(result.url);
      showToast("Profile image uploaded.", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to upload image";
      setErrorMessage(msg);
      showToast(msg, "error");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        ...(profileImage ? { profileImage } : {}),
      };
      if (profileExists) {
        await updateTeacherProfile(accessToken, payload);
      } else {
        await createTeacherProfile(accessToken, payload);
        setProfileExists(true);
      }
      await updateTeacherAvailability(accessToken, isAvailable);
      showToast("Profile saved successfully.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <style>{`@keyframes tpf-spin{to{transform:rotate(360deg)}} @keyframes tpf-pulse{0%,100%{opacity:1}50%{opacity:0.45}}`}</style>
        <main className="app-shell" style={{ padding: "1.5rem 1rem 3rem" }}>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
            {[100, 400, 120].map((h, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 20,
                  height: h,
                  border: "1px solid rgba(212,230,239,0.8)",
                  animation: "tpf-pulse 1.4s ease-in-out infinite",
                  boxShadow: "0 4px 16px rgba(5,47,68,0.05)",
                }}
              />
            ))}
          </div>
        </main>
      </>
    );
  }

  const submitLabel = isSubmitting
    ? "Saving…"
    : isUploadingImage
      ? "Uploading image…"
      : profileExists
        ? "Update Profile"
        : "Create Profile";

  return (
    <>
      <style>{`
        @keyframes tpf-spin { to { transform: rotate(360deg); } }
        @keyframes tpf-fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .tpf-root { animation: tpf-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .tpf-submit { transition: transform 160ms, box-shadow 160ms; }
        .tpf-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 20px 44px rgba(5,47,68,0.28) !important; }
      `}</style>

      <main className="tpf-root app-shell" style={{ padding: "1.5rem 1rem 3rem" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* ── Header ── */}
          <div
            style={{
              background: "linear-gradient(180deg,#ffffff 0%,#f7fbff 100%)",
              borderRadius: 28,
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(212,230,239,0.8)",
              boxShadow: "0 18px 44px rgba(17,34,68,0.08)",
            }}
          >
            <svg
              style={{ position: "absolute", top: -20, right: -10, opacity: 0.08, pointerEvents: "none" }}
              width="200"
              height="160"
              viewBox="0 0 200 160"
              fill="none"
            >
              <circle cx="180" cy="0" r="140" stroke="white" strokeWidth="1" />
              <circle cx="180" cy="0" r="90" stroke="white" strokeWidth="0.7" />
            </svg>
            <div style={{ padding: "24px 26px", position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 52, height: 52, position: "relative", flexShrink: 0 }}>
                    <Image src={redesignImages.logoMark} alt="Logo" fill className="object-contain" sizes="52px" />
                  </div>
                  <div>
                    <h1
                      style={{
                        fontSize: 18,
                        fontWeight: 900,
                        color: "#102033",
                        letterSpacing: "-0.035em",
                        margin: "0 0 2px",
                      }}
                    >
                      Teacher Profile
                    </h1>
                    <p style={{ fontSize: 11, color: "rgba(16,32,51,0.58)", margin: 0 }}>
                      {profileExists ? "Update your profile details" : "Create your teacher profile"}
                    </p>
                  </div>
                </div>
                <Link
                  href="/teacher/dashboard"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "#f5fbfd",
                    border: "1px solid rgba(169,211,239,0.35)",
                    borderRadius: 14,
                    padding: "9px 14px",
                    textDecoration: "none",
                    color: "#102033",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <Icon d={I.back} size={12} /> Dashboard
                </Link>
              </div>

              {/* Status badges */}
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: profileExists ? "rgba(48,164,108,0.10)" : "rgba(245,168,36,0.10)",
                    border: `1px solid ${profileExists ? "rgba(48,164,108,0.3)" : "rgba(245,168,36,0.3)"}`,
                    borderRadius: 999,
                    padding: "3px 10px",
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: profileExists ? "#30a46c" : "#f5a524",
                    }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 700, color: profileExists ? "#1f7a57" : "#a56b10" }}>
                    {profileExists ? "Profile exists" : "No profile yet"}
                  </span>
                </div>
                {isAvailable && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      background: "rgba(48,164,108,0.10)",
                      border: "1px solid rgba(48,164,108,0.3)",
                      borderRadius: 999,
                      padding: "3px 10px",
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#30a46c" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#1f7a57" }}>Available for hire</span>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  marginTop: 18,
                }}
              >
                <div
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(212,230,239,0.8)",
                    background: "#ffffff",
                    padding: "14px 16px",
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(16,32,51,0.42)", margin: 0 }}>
                    Profile
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#102033", margin: "8px 0 0" }}>
                    {profileExists ? "Ready" : "Draft"}
                  </p>
                </div>
                <div
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(185,231,251,0.18)",
                    background: "#f5fbfd",
                    padding: "14px 16px",
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(16,32,51,0.42)", margin: 0 }}>
                    Visibility
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0b8f88", margin: "8px 0 0" }}>
                    {isAvailable ? "Live" : "Hidden"}
                  </p>
                </div>
                <div
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(243,179,61,0.18)",
                    background: "#fff8ed",
                    padding: "14px 16px",
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(16,32,51,0.42)", margin: 0 }}>
                    Photo
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#c58a14", margin: "8px 0 0" }}>
                    {profileImage ? "Added" : "Missing"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Form card ── */}
          <div
            style={{
              background: "white",
              borderRadius: 26,
              border: "1px solid rgba(212,230,239,0.8)",
              boxShadow: "0 14px 38px rgba(5,47,68,0.08)",
              overflow: "hidden",
            }}
          >
            <form onSubmit={handleSubmit} style={{ padding: "28px 28px 32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px 22px" }}>
                {/* Section 1 – Personal */}
                <SectionHeader icon={I.user} title="Personal Info" step={1} total={4} />

                <AvatarUpload
                  profileImage={profileImage}
                  isUploading={isUploadingImage}
                  onUpload={handleProfileImageUpload}
                />

                <Field label="Phone" icon={I.phone}>
                  <StyledInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
                </Field>

                <Field label="Gender" icon={I.gender}>
                  <StyledSelect value={gender} onChange={(e) => setGender(e.target.value as GenderValue)}>
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="UNSPECIFIED">Prefer not to say</option>
                  </StyledSelect>
                </Field>

                <Field label="Date of Birth" icon={I.calendar}>
                  <StyledInput type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </Field>

                <Field label="Expected Salary ($/yr)" icon={I.money}>
                  <StyledInput
                    type="number"
                    min="0"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="e.g. 50000"
                  />
                </Field>

                <Divider />

                {/* Section 2 – Qualifications */}
                <SectionHeader icon={I.grad} title="Qualifications" step={2} total={4} />

                <Field label="Education" icon={I.grad}>
                  <StyledInput
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. B.Ed Mathematics, Harvard"
                  />
                </Field>

                <Field label="Experience" icon={I.star}>
                  <StyledInput
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5 years secondary school"
                  />
                </Field>

                <Field label="Subjects (comma separated)" icon={I.book}>
                  <StyledInput
                    value={subjectsText}
                    onChange={(e) => setSubjectsText(e.target.value)}
                    placeholder="e.g. Math, Physics, Chemistry"
                  />
                </Field>

                <Field label="Class Levels (comma separated)" icon={I.grade}>
                  <StyledInput
                    value={classLevelsText}
                    onChange={(e) => setClassLevelsText(e.target.value)}
                    placeholder="e.g. Grade 9, Grade 10, A-Level"
                  />
                </Field>

                <Divider />

                {/* Section 3 – Location & Mode */}
                <SectionHeader icon={I.pin} title="Location & Teaching Mode" step={3} total={4} />

                <Field label="Location" icon={I.pin}>
                  <StyledInput
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, NY"
                  />
                </Field>

                <Field label="Teaching Mode" icon={I.monitor}>
                  <StyledSelect
                    value={teachingMode}
                    onChange={(e) => setTeachingMode(e.target.value as TeachingModeValue)}
                  >
                    <option value="">Select mode</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">In-Person</option>
                    <option value="BOTH">Hybrid (Both)</option>
                  </StyledSelect>
                </Field>

                <Divider />

                {/* Section 4 – Bio & Availability */}
                <SectionHeader icon={I.text} title="Bio & Availability" step={4} total={4} />

                <Field label="Bio" icon={I.text} span2>
                  <StyledTextarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell institutions about yourself, your teaching style, and what makes you great…"
                  />
                </Field>

                <AvailabilityToggle checked={isAvailable} onChange={setIsAvailable} />

                {/* Error */}
                {errorMessage && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      background: "rgba(229,72,77,0.07)",
                      border: "1px solid rgba(229,72,77,0.2)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#c11b1f",
                    }}
                  >
                    ⚠ {errorMessage}
                  </div>
                )}

                {/* Submit */}
                <div style={{ gridColumn: "1 / -1", paddingTop: 8 }}>
                  <button
                    className="tpf-submit"
                    type="submit"
                    disabled={isSubmitting || isUploadingImage}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      width: "100%",
                      height: "2.85rem",
                      borderRadius: 12,
                      border: "none",
                      cursor: isSubmitting || isUploadingImage ? "not-allowed" : "pointer",
                      background:
                        isSubmitting || isUploadingImage
                          ? "#7a9fb0"
                          : "linear-gradient(135deg,#052f44 0%,#065770 60%,#076b82 100%)",
                      color: "white",
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                      boxShadow: "0 12px 32px rgba(5,47,68,0.22)",
                      opacity: isSubmitting || isUploadingImage ? 0.8 : 1,
                      fontFamily: "inherit",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <IconSpinner /> {submitLabel}
                      </>
                    ) : (
                      <>
                        {submitLabel} <Icon d={I.arrow} size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
