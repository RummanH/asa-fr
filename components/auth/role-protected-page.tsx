"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { DashboardContentLoader, DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getInstitutionNavItems, getTeacherNavItems } from "@/components/dashboard/teacher-nav";
import { fetchMe, logout } from "@/lib/api";
import {
  clearSession,
  getAccessToken,
  resolveDashboardPath,
  saveUser,
  type AuthUser,
  type UserRole,
} from "@/lib/auth";

type RoleProtectedRenderProps = {
  user: AuthUser;
  accessToken: string;
  logoutAction: () => Promise<void>;
  isLoggingOut: boolean;
};

type RoleProtectedPageProps = {
  role: UserRole;
  loadingLabel?: string;
  children: (props: RoleProtectedRenderProps) => ReactNode;
};

export function RoleProtectedPage({
  role,
  loadingLabel = "Loading...",
  children,
}: RoleProtectedPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken] = useState<string | null>(() => getAccessToken());
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }

    fetchMe(accessToken)
      .then((me) => {
        if (me.role !== role) {
          router.replace(resolveDashboardPath(me.role));
          return;
        }

        saveUser(me);
        setUser(me);
      })
      .catch(() => {
        clearSession();
        router.replace("/login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, role, router]);

  async function logoutAction() {
    setIsLoggingOut(true);

    try {
      if (accessToken) {
        await logout(accessToken);
      }
    } catch {
      // logout is token removal in this phase
    } finally {
      clearSession();
      router.replace("/login");
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    const navItems = role === "TEACHER" ? getTeacherNavItems("dashboard") : getInstitutionNavItems("dashboard");

    return (
      <DashboardLayout
        navItems={navItems}
        userName="Loading..."
        userEmail=""
        userRole={role}
        settingsHref={role === "TEACHER" ? "/teacher/profile" : "/institution/profile"}
      >
        <DashboardContentLoader label={loadingLabel} />
      </DashboardLayout>
    );
  }

  if (!user || !accessToken) {
    return null;
  }

  return children({
    user,
    accessToken,
    logoutAction,
    isLoggingOut,
  });
}

