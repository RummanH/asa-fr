"use client";

import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  Home,
  Lock,
  Mail,
  UserRound,
  Users,
} from "lucide-react";

type TeacherNavKey =
  | "dashboard"
  | "profile"
  | "jobs"
  | "messages"
  | "password"
  | "requests";

type TeacherNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  isActive?: boolean;
  isHighlight?: boolean;
};

type InstitutionNavKey =
  | "dashboard"
  | "profile"
  | "jobs"
  | "messages"
  | "password"
  | "requests"
  | "teachers"
  | "hired";

function navIcon(icon: ReactNode) {
  return <span className="text-[18px]">{icon}</span>;
}

export function getTeacherNavItems(active: TeacherNavKey, profileComplete = true): TeacherNavItem[] {
  return [
    {
      href: "/teacher/dashboard",
      label: "Dashboard",
      icon: navIcon(<Home size={18} strokeWidth={2} />),
      isActive: active === "dashboard",
    },
    {
      href: "/teacher/profile",
      label: profileComplete ? "Edit Profile" : "Create Profile",
      icon: navIcon(<UserRound size={18} strokeWidth={2} />),
      isActive: active === "profile",
      isHighlight: !profileComplete && active !== "profile",
    },
    {
      href: "/teacher/jobs",
      label: "Browse Jobs",
      icon: navIcon(<BriefcaseBusiness size={18} strokeWidth={2} />),
      isActive: active === "jobs",
    },
    {
      href: "/teacher/messages",
      label: "Messages",
      icon: navIcon(<Mail size={18} strokeWidth={2} />),
      isActive: active === "messages",
    },
    {
      href: "/teacher/change-password",
      label: "Change Password",
      icon: navIcon(<Lock size={18} strokeWidth={2} />),
      isActive: active === "password",
    },
    {
      href: "/teacher/hire-requests",
      label: "Received Requests",
      icon: navIcon(<Users size={18} strokeWidth={2} />),
      isActive: active === "requests",
    },
  ];
}

export function getInstitutionNavItems(active: InstitutionNavKey, profileComplete = true): TeacherNavItem[] {
  return [
    {
      href: "/institution/dashboard",
      label: "Dashboard",
      icon: navIcon(<Home size={18} strokeWidth={2} />),
      isActive: active === "dashboard",
    },
    {
      href: "/institution/profile",
      label: profileComplete ? "Edit Profile" : "Create Profile",
      icon: navIcon(<UserRound size={18} strokeWidth={2} />),
      isActive: active === "profile",
      isHighlight: !profileComplete && active !== "profile",
    },
    {
      href: "/institution/job-posts",
      label: "Manage Job Posts",
      icon: navIcon(<BriefcaseBusiness size={18} strokeWidth={2} />),
      isActive: active === "jobs",
    },
    {
      href: "/institution/messages",
      label: "Messages",
      icon: navIcon(<Mail size={18} strokeWidth={2} />),
      isActive: active === "messages",
    },
    {
      href: "/institution/change-password",
      label: "Change Password",
      icon: navIcon(<Lock size={18} strokeWidth={2} />),
      isActive: active === "password",
    },
    {
      href: "/institution/hire-requests",
      label: "Sent Requests",
      icon: navIcon(<Users size={18} strokeWidth={2} />),
      isActive: active === "requests",
    },
    {
      href: "/institution/teachers",
      label: "Browse Teachers",
      icon: navIcon(<Users size={18} strokeWidth={2} />),
      isActive: active === "teachers",
    },
    {
      href: "/institution/hired-teachers",
      label: "Hired Teachers",
      icon: navIcon(<Users size={18} strokeWidth={2} />),
      isActive: active === "hired",
    },
  ];
}
