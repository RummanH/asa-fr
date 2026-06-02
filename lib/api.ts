import type { AuthUser } from "@/lib/auth";

const PRODUCTION_API_URL = "https://alasatizah.onrender.com";
const LOCAL_API_URL = "http://localhost:5001";

function isLocalhostUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(parsedUrl.hostname);
  } catch {
    return false;
  }
}

function resolveApiUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isProduction = process.env.NODE_ENV === "production";
  const shouldIgnoreConfiguredLocalhost = isProduction && configuredUrl ? isLocalhostUrl(configuredUrl) : false;
  const baseUrl =
    configuredUrl && configuredUrl.length > 0 && !shouldIgnoreConfiguredLocalhost
      ? configuredUrl
      : isProduction
        ? PRODUCTION_API_URL
        : LOCAL_API_URL;

  return baseUrl.replace(/\/+$/, "");
}

const API_URL = resolveApiUrl();

function normalizeMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    return new URL(url).toString();
  } catch {
    return new URL(url.replace(/^\/+/, ""), `${API_URL}/`).toString();
  }
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type AuthPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type ForgotPasswordPayload = {
  email: string;
};

type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

type LogoutResponse = {
  success: boolean;
  message: string;
};

type ForgotPasswordResponse = {
  message: string;
  resetToken?: string;
  resetTokenExpiresAt?: string;
};

type ResetPasswordResponse = {
  message: string;
};

type ChangePasswordResponse = {
  message: string;
};

type UploadImageResponse = {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
};

type ApiSuccessEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ApiErrorEnvelope = {
  success?: boolean;
  statusCode?: number;
  message?: string | string[];
  error?: string;
  errors?: string[];
  timestamp?: string;
  path?: string;
};

export type TeacherProfile = {
  id: string;
  userId: string;
  phone: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED" | null;
  dateOfBirth: string | null;
  education: string | null;
  experience: string | null;
  subjects: string[];
  classLevels: string[];
  expectedSalary: number | null;
  location: string | null;
  teachingMode: "ONLINE" | "OFFLINE" | "BOTH" | null;
  isAvailable: boolean;
  bio: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InstitutionProfile = {
  id: string;
  userId: string;
  institutionName: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  description: string | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TeacherProfilePayload = {
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";
  dateOfBirth?: string;
  education?: string;
  experience?: string;
  subjects?: string[];
  classLevels?: string[];
  expectedSalary?: number;
  location?: string;
  teachingMode?: "ONLINE" | "OFFLINE" | "BOTH";
  bio?: string;
  profileImage?: string;
};

export type InstitutionProfilePayload = {
  institutionName?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
  logo?: string;
};

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY";
export type TeachingMode = "ONLINE" | "OFFLINE" | "BOTH";
export type JobPostStatus = "ACTIVE" | "INACTIVE" | "CLOSED";
export type HireRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";

export type JobPost = {
  id: string;
  institutionId: string;
  title: string;
  subject: string;
  classLevel: string;
  jobType: JobType;
  salaryMin: number | null;
  salaryMax: number | null;
  location: string | null;
  teachingMode: TeachingMode;
  description: string;
  requirements: string | null;
  status: JobPostStatus;
  createdAt: string;
  updatedAt: string;
  institution: {
    id: string;
    institutionName: string;
  };
};

export type JobPostPayload = {
  title?: string;
  subject?: string;
  classLevel?: string;
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  teachingMode?: TeachingMode;
  description?: string;
  requirements?: string;
  status?: JobPostStatus;
};

export type JobPostsQuery = {
  subject?: string;
  classLevel?: string;
  location?: string;
  teachingMode?: TeachingMode;
  jobType?: JobType;
  status?: JobPostStatus;
};

export type TeacherDirectoryQuery = {
  subject?: string;
  classLevel?: string;
  location?: string;
  teachingMode?: TeachingMode;
  isAvailable?: boolean;
};

export type TeacherDirectoryItem = {
  id: string;
  userId: string;
  phone: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED" | null;
  dateOfBirth: string | null;
  education: string | null;
  experience: string | null;
  subjects: string[];
  classLevels: string[];
  expectedSalary: number | null;
  location: string | null;
  teachingMode: TeachingMode | null;
  isAvailable: boolean;
  bio: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type ConversationSummary = {
  id: string;
  teacherId: string;
  institutionId: string;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  institution: {
    id: string;
    institutionName: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  lastMessage: {
    id: string;
    senderId: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  } | null;
  unreadCount: number;
};

export type ConversationMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: "TEACHER" | "INSTITUTION";
  };
};

export type HireRequest = {
  id: string;
  teacherId: string;
  institutionId: string;
  jobPostId: string;
  message: string | null;
  status: HireRequestStatus;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  institution: {
    id: string;
    institutionName: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  jobPost: {
    id: string;
    title: string;
    subject: string;
    classLevel: string;
    status: JobPostStatus;
  };
};

function isApiSuccessEnvelope(value: unknown): value is ApiSuccessEnvelope<unknown> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeEnvelope = value as Record<string, unknown>;
  return typeof maybeEnvelope.success === "boolean" && Object.prototype.hasOwnProperty.call(maybeEnvelope, "data");
}

function getErrorMessageFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const errorPayload = payload as ApiErrorEnvelope;

  if (Array.isArray(errorPayload.errors) && errorPayload.errors.length > 0) {
    return errorPayload.errors.join(", ");
  }

  if (Array.isArray(errorPayload.message) && errorPayload.message.length > 0) {
    return errorPayload.message.join(", ");
  }

  if (typeof errorPayload.message === "string" && errorPayload.message.trim().length > 0) {
    return errorPayload.message;
  }

  if (typeof errorPayload.error === "string" && errorPayload.error.trim().length > 0) {
    return errorPayload.error;
  }

  return null;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const errorPayload = (await response.json()) as unknown;
      const extractedMessage = getErrorMessageFromPayload(errorPayload);
      if (extractedMessage) {
        message = extractedMessage;
      }
    } catch {
      message = `${response.status} ${response.statusText}`;
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json()) as unknown;

  if (isApiSuccessEnvelope(payload)) {
    if (!payload.success) {
      throw new ApiError(payload.message ?? "Request failed", response.status);
    }

    return payload.data as T;
  }

  return payload as T;
}

export function registerTeacher(payload: AuthPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register/teacher", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerInstitution(payload: AuthPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register/institution", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  return apiRequest<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function changePassword(token: string, payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
  return apiRequest<ChangePasswordResponse>("/auth/change-password", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function fetchMe(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function logout(token: string): Promise<LogoutResponse> {
  return apiRequest<LogoutResponse>("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function uploadImage(token: string, file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/uploads/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let message = "Image upload failed";

    try {
      const errorPayload = (await response.json()) as unknown;
      const extractedMessage = getErrorMessageFromPayload(errorPayload);
      if (extractedMessage) {
        message = extractedMessage;
      }
    } catch {
      message = `${response.status} ${response.statusText}`;
    }

    throw new ApiError(message, response.status);
  }

  const payload = (await response.json()) as unknown;

  if (isApiSuccessEnvelope(payload)) {
    if (!payload.success) {
      throw new ApiError(payload.message ?? "Image upload failed", response.status);
    }

    const data = payload.data as UploadImageResponse;
    return {
      ...data,
      url: normalizeMediaUrl(data.url) ?? data.url,
    };
  }

  const data = payload as UploadImageResponse;
  return {
    ...data,
    url: normalizeMediaUrl(data.url) ?? data.url,
  };
}

export function fetchTeacherProfile(token: string): Promise<TeacherProfile> {
  return apiRequest<TeacherProfile>("/teacher/profile/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  }).then((profile) => ({
    ...profile,
    profileImage: normalizeMediaUrl(profile.profileImage),
  }));
}

export function createTeacherProfile(token: string, payload: TeacherProfilePayload): Promise<TeacherProfile> {
  return apiRequest<TeacherProfile>("/teacher/profile", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateTeacherProfile(token: string, payload: TeacherProfilePayload): Promise<TeacherProfile> {
  return apiRequest<TeacherProfile>("/teacher/profile", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateTeacherAvailability(token: string, isAvailable: boolean): Promise<TeacherProfile> {
  return apiRequest<TeacherProfile>("/teacher/profile/availability", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isAvailable }),
  });
}

export function fetchInstitutionProfile(token: string): Promise<InstitutionProfile> {
  return apiRequest<InstitutionProfile>("/institution/profile/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function createInstitutionProfile(
  token: string,
  payload: InstitutionProfilePayload,
): Promise<InstitutionProfile> {
  return apiRequest<InstitutionProfile>("/institution/profile", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateInstitutionProfile(
  token: string,
  payload: InstitutionProfilePayload,
): Promise<InstitutionProfile> {
  return apiRequest<InstitutionProfile>("/institution/profile", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

function buildQueryString(query?: Record<string, unknown>): string {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function createJobPost(token: string, payload: JobPostPayload): Promise<JobPost> {
  return apiRequest<JobPost>("/job-posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function fetchActiveJobPosts(token: string, query?: JobPostsQuery): Promise<JobPost[]> {
  return apiRequest<JobPost[]>(`/job-posts${buildQueryString(query)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function fetchJobPostById(token: string, jobPostId: string): Promise<JobPost> {
  return apiRequest<JobPost>(`/job-posts/${jobPostId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function fetchInstitutionJobPosts(token: string, query?: JobPostsQuery): Promise<JobPost[]> {
  return apiRequest<JobPost[]>(`/institution/job-posts${buildQueryString(query)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function fetchTeachers(token: string, query?: TeacherDirectoryQuery): Promise<TeacherDirectoryItem[]> {
  return apiRequest<TeacherDirectoryItem[]>(`/teachers${buildQueryString(query)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function fetchAvailableTeachers(token: string, query?: TeacherDirectoryQuery): Promise<TeacherDirectoryItem[]> {
  return apiRequest<TeacherDirectoryItem[]>(`/teachers/available${buildQueryString(query)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function fetchTeacherById(token: string, teacherId: string): Promise<TeacherDirectoryItem> {
  return apiRequest<TeacherDirectoryItem>(`/teachers/${teacherId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function createConversation(
  token: string,
  payload: { teacherId?: string; institutionId?: string },
): Promise<ConversationSummary> {
  return apiRequest<ConversationSummary>("/conversations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function fetchConversations(token: string): Promise<ConversationSummary[]> {
  return apiRequest<ConversationSummary[]>("/conversations", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function fetchConversationMessages(token: string, conversationId: string): Promise<ConversationMessage[]> {
  return apiRequest<ConversationMessage[]>(`/conversations/${conversationId}/messages`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function sendConversationMessage(
  token: string,
  conversationId: string,
  message: string,
): Promise<ConversationMessage> {
  return apiRequest<ConversationMessage>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
}

export function markConversationAsRead(
  token: string,
  conversationId: string,
): Promise<{ success: boolean; updatedCount: number }> {
  return apiRequest<{ success: boolean; updatedCount: number }>(`/conversations/${conversationId}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
}

export function updateJobPost(token: string, jobPostId: string, payload: JobPostPayload): Promise<JobPost> {
  return apiRequest<JobPost>(`/job-posts/${jobPostId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function closeJobPost(token: string, jobPostId: string): Promise<JobPost> {
  return apiRequest<JobPost>(`/job-posts/${jobPostId}/close`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
}

export function deleteJobPost(token: string, jobPostId: string): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`/job-posts/${jobPostId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createHireRequest(
  token: string,
  payload: { teacherId: string; jobPostId: string; message?: string },
): Promise<HireRequest> {
  return apiRequest<HireRequest>("/hire-requests", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function fetchSentHireRequests(token: string): Promise<HireRequest[]> {
  return apiRequest<HireRequest[]>("/hire-requests/sent", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function fetchReceivedHireRequests(token: string): Promise<HireRequest[]> {
  return apiRequest<HireRequest[]>("/hire-requests/received", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export function acceptHireRequest(token: string, hireRequestId: string): Promise<HireRequest> {
  return apiRequest<HireRequest>(`/hire-requests/${hireRequestId}/accept`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
}

export function rejectHireRequest(token: string, hireRequestId: string): Promise<HireRequest> {
  return apiRequest<HireRequest>(`/hire-requests/${hireRequestId}/reject`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
}

export function cancelHireRequest(token: string, hireRequestId: string): Promise<HireRequest> {
  return apiRequest<HireRequest>(`/hire-requests/${hireRequestId}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
}
