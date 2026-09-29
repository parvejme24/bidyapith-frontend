import { apiRequest } from "./core";

export interface StudentMeResponse {
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
}

export interface StudentListItem {
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
}

export const studentsApi = {
  getMe: () => apiRequest<StudentMeResponse>("/students/me"),

  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<StudentListItem[]>(`/students${query}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/students/${id}`),
  getMyAttendance: () => apiRequest<unknown>("/students/me/attendance"),
  getMyResults: () => apiRequest<unknown>("/students/me/results"),
  getMyTranscript: () => apiRequest<unknown>("/students/me/transcript"),
};
