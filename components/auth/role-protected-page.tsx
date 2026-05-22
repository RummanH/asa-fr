"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
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
    return (
      <main className="app-shell px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-4xl app-panel p-6 sm:p-8">
          <p className="text-sm text-brand-navy/78">{loadingLabel}</p>
        </div>
      </main>
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

