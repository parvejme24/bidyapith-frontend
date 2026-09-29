import { apiRequest } from "./core";

export interface LoginResponseData {
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
}

export interface RegisterResponseData {
  user: unknown;
  studentId: string;
}

export const authApi = {
  login: (body: { email: string; password: string }) =>
    apiRequest<LoginResponseData>("/auth/login", {
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
    apiRequest<RegisterResponseData>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => apiRequest<unknown>("/users/me"),
  logout: () => apiRequest<unknown>("/auth/logout", { method: "POST" }),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
