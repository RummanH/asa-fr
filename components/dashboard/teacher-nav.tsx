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
