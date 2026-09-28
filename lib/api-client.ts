/**
 * Bidyapith API Client
 * Supports local (http://localhost:5001/api/v1) and Render production (https://bidyapith-backend.onrender.com/api/v1)
 */

export const API_ENDPOINTS = {
  local: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1",
  render: process.env.NEXT_PUBLIC_REMOTE_API_URL || "https://bidyapith-backend.onrender.com/api/v1",
};

let currentEndpoint = API_ENDPOINTS.local;

if (typeof window !== "undefined") {
  const saved = localStorage.getItem("bidyapith_api_endpoint");
  if (saved && (saved === API_ENDPOINTS.local || saved === API_ENDPOINTS.render)) {
    currentEndpoint = saved;
  }
}

export function getBaseApiUrl(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("bidyapith_api_endpoint") || currentEndpoint;
  }
  return currentEndpoint;
}

export function setBaseApiUrl(url: string): void {
  currentEndpoint = url;
  if (typeof window !== "undefined") {
    localStorage.setItem("bidyapith_api_endpoint", url);
  }
}

function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("bidyapith-auth-change"));
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bidyapith_token") || sessionStorage.getItem("bidyapith_token");
}

export function setStoredToken(token: string, remember = true): void {
  if (typeof window === "undefined") return;
  if (remember) {
    localStorage.setItem("bidyapith_token", token);
  } else {
    sessionStorage.setItem("bidyapith_token", token);
  }
  notifyAuthChange();
}

export function removeStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("bidyapith_token");
  sessionStorage.removeItem("bidyapith_token");
  localStorage.removeItem("bidyapith_user");
  notifyAuthChange();
}

export function getStoredUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("bidyapith_user");
  if (!user) return null;
  try {
    return JSON.parse(user) as T;
  } catch {
    return null;
  }
}

export function setStoredUser(user: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("bidyapith_user", JSON.stringify(user));
  notifyAuthChange();
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getBaseApiUrl();
  const token = getStoredToken();

  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }

  return data as ApiResponse<T>;
}

export const apiClient = {
  // Auth API
  auth: {
    login: (body: { email: string; password: string }) =>
      apiRequest<{
        accessToken: string;
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
          status: string;
          avatarUrl?: string;
          phone?: string;
        };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    register: (body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      programId: string;
      batch: string;
      phone?: string;
    }) =>
      apiRequest<{ user: unknown; studentId: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    me: () => apiRequest<unknown>("/users/me"),
    logout: () => apiRequest<unknown>("/auth/logout", { method: "POST" }),
  },

  // User Profile & Avatar APIs
  users: {
    getMe: () =>
      apiRequest<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        avatarUrl?: string | null;
        phone?: string | null;
        studentProfile?: unknown;
        instructorProfile?: unknown;
      }>("/users/me"),

    updateMe: (body: { firstName?: string; lastName?: string; phone?: string }) =>
      apiRequest<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        avatarUrl?: string | null;
        phone?: string | null;
      }>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),

    uploadAvatar: async (file: File) => {
      const baseUrl = getBaseApiUrl();
      const token = getStoredToken();
      const formData = new FormData();
      formData.append("avatar", file);

      const headers: Record<string, string> = {
        Accept: "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/users/me/avatar`, {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Avatar upload failed with status ${response.status}`);
      }
      return data as ApiResponse<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string;
      }>;
    },

    deleteAvatar: () =>
      apiRequest<{
        id: string;
        email: string;
        avatarUrl: null;
      }>("/users/me/avatar", {
        method: "DELETE",
      }),
  },

  // Academic APIs
  departments: {
    getAll: () => apiRequest<Array<{ id: string; code: string; name: string; contactEmail?: string }>>("/departments"),
  },

  programs: {
    getAll: () =>
      apiRequest<
        Array<{
          id: string;
          code: string;
          name: string;
          degreeType: string;
          totalCredits: number;
          departmentId: string;
        }>
      >("/programs"),
  },

  courses: {
    getAll: () =>
      apiRequest<
        Array<{
          id: string;
          code: string;
          title: string;
          credits: number | string;
          type: string;
          level: number;
          departmentId: string;
        }>
      >("/courses"),
  },

  instructors: {
    getAll: () =>
      apiRequest<
        Array<{
          id: string;
          employeeId: string;
          departmentId: string;
          designation: string;
          specialization?: string;
          user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            avatarUrl?: string;
            phone?: string;
          };
        }>
      >("/instructors"),
  },

  students: {
    getMe: () =>
      apiRequest<{
        id: string;
        studentId: string;
        batch: string;
        cgpa: string | number;
        totalCreditsEarned: string | number;
        guardianName?: string;
        guardianPhone?: string;
        address?: string;
        program?: {
          id: string;
          code: string;
          name: string;
          department?: { id: string; code: string; name: string };
        };
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          phone?: string;
          avatarUrl?: string;
        };
      }>("/students/me"),

    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiRequest<
        Array<{
          id: string;
          studentId: string;
          batch: string;
          cgpa: string | number;
          totalCreditsEarned: string | number;
          user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            avatarUrl?: string;
            phone?: string;
          };
          program: {
            id: string;
            code: string;
            name: string;
          };
        }>
      >(`/students${query}`);
    },
    getById: (id: string) => apiRequest<unknown>(`/students/${id}`),
  },

  enrollments: {
    getMyCourses: () =>
      apiRequest<
        Array<{
          id: string;
          status: string;
          offering: {
            id: string;
            section: string;
            room?: string;
            course: {
              code: string;
              title: string;
              credits: string | number;
            };
            instructor?: {
              user: { firstName: string; lastName: string };
            };
            schedules?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
          };
        }>
      >("/enrollments/my-courses"),

    getAvailableCourses: () =>
      apiRequest<
        Array<{
          id: string;
          section: string;
          room?: string;
          capacity: number;
          enrolledCount: number;
          course: {
            id: string;
            code: string;
            title: string;
            credits: string | number;
          };
          instructor?: {
            user: { firstName: string; lastName: string };
          };
          schedules?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
        }>
      >("/enrollments/available-courses"),

    create: (offeringId: string) =>
      apiRequest("/enrollments", {
        method: "POST",
        body: JSON.stringify({ offeringId }),
      }),

    drop: (enrollmentId: string) =>
      apiRequest(`/enrollments/${enrollmentId}`, { method: "DELETE" }),
  },

  semesters: {
    getCurrent: () =>
      apiRequest<{
        id: string;
        term: string;
        year: number;
        name: string;
        status: string;
        registrationStart: string;
        registrationEnd: string;
        dropDeadline: string;
        classStartDate: string;
        classEndDate: string;
        resultPublishedAt?: string | null;
        createdAt: string;
        updatedAt: string;
        registrationOpen?: boolean;
        dropAllowed?: boolean;
        daysUntilRegistrationEnd?: number;
      }>("/semesters/current"),
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiRequest<
        Array<{
          id: string;
          term: string;
          year: number;
          name: string;
          status: string;
          registrationStart: string;
          registrationEnd: string;
          dropDeadline: string;
          classStartDate: string;
          classEndDate: string;
          resultPublishedAt?: string | null;
          createdAt: string;
          updatedAt: string;
        }>
      >(`/semesters${query}`);
    },
    getById: (id: string) =>
      apiRequest<{
        id: string;
        term: string;
        year: number;
        name: string;
        status: string;
        registrationStart: string;
        registrationEnd: string;
        dropDeadline: string;
        classStartDate: string;
        classEndDate: string;
      }>(`/semesters/${id}`),
    create: (body: {
      term: string;
      year: number;
      registrationStart: string;
      registrationEnd: string;
      dropDeadline: string;
      classStartDate: string;
      classEndDate: string;
    }) =>
      apiRequest<{
        id: string;
        name: string;
        status: string;
      }>("/semesters", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (
      id: string,
      body: Partial<{
        registrationStart: string;
        registrationEnd: string;
        dropDeadline: string;
        classStartDate: string;
        classEndDate: string;
      }>
    ) =>
      apiRequest<{
        id: string;
        name: string;
        status: string;
      }>(`/semesters/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    changeStatus: (id: string, status: string) =>
      apiRequest<{
        id: string;
        name: string;
        status: string;
      }>(`/semesters/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },

  offerings: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiRequest<unknown[]>(`/offerings${query}`);
    },
  },

  invoices: {
    getAll: () => apiRequest<unknown[]>("/invoices"),
  },

  admin: {
    getUsers: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiRequest<unknown[]>(`/users${query}`);
    },
    createInstructor: (body: {
      firstName: string;
      lastName: string;
      email: string;
      department: string;
      designation: string;
      phone?: string;
      room?: string;
      specialization?: string;
      temporaryPassword?: string;
      otp?: string;
      sendEmail?: boolean;
    }) =>
      apiRequest<{ user: unknown; temporaryPassword?: string }>("/users", {
        method: "POST",
        body: JSON.stringify({
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          role: "INSTRUCTOR",
          departmentCode: body.department,
          designation: body.designation,
          phone: body.phone,
          room: body.room,
          specialization: body.specialization,
          joiningDate: new Date().toISOString(),
        }),
      }),
    updateUserRole: (id: string, role: string) =>
      apiRequest(`/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: role.toUpperCase() }),
      }),
    updateUserStatus: (id: string, status: string) =>
      apiRequest(`/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: status.toUpperCase() }),
      }),
    deleteUser: (id: string) =>
      apiRequest(`/users/${id}`, { method: "DELETE" }),
    getAuditLogs: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiRequest<unknown[]>(`/audit-logs${query}`);
    },
    getPayments: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return apiRequest<unknown[]>(`/payments${query}`);
    },
    verifyPayment: (id: string) =>
      apiRequest(`/payments/${id}/verify`, { method: "POST" }),
    refundPayment: (id: string) =>
      apiRequest(`/payments/${id}/refund`, { method: "POST" }),
  },

  notifications: {
    getAll: () =>
      apiRequest<
        Array<{
          id: string;
          type: string;
          title: string;
          body: string;
          link?: string | null;
          readAt?: string | null;
          createdAt: string;
        }>
      >("/notifications"),
    createBroadcast: (body: {
      title: string;
      body: string;
      target?: "all" | "students" | "faculty";
      type?: string;
      link?: string;
    }) =>
      apiRequest<{
        success: boolean;
        recipientsCount: number;
        title: string;
        body: string;
        target: string;
      }>("/notifications/broadcast", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    markAsRead: (id: string) =>
      apiRequest(`/notifications/${id}/read`, { method: "PATCH" }),
    markAllAsRead: () =>
      apiRequest("/notifications/read-all", { method: "PATCH" }),
  },
};
