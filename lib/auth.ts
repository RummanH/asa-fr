export type UserRole = "TEACHER" | "INSTITUTION";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const TOKEN_KEY = "teacher_hiring_token";
const USER_KEY = "teacher_hiring_user";

export function resolveDashboardPath(role: UserRole): string {
  return role === "TEACHER" ? "/teacher/dashboard" : "/institution/dashboard";
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function saveSession(accessToken: string, user: AuthUser): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveUser(user: AuthUser): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
