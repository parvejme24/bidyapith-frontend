import { apiRequest, getBaseApiUrl, getStoredToken, type ApiResponse } from "./core";

export interface UserMeResponse {
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
}

export const usersApi = {
  getMe: () => apiRequest<UserMeResponse>("/users/me"),

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
};
