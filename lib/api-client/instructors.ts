import { apiRequest } from "./core";

export interface InstructorProfileData {
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
}

export const instructorsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<InstructorProfileData[]>(`/instructors${query}`);
  },
  getMe: () => apiRequest<InstructorProfileData>("/instructors/me"),
  updateMe: (body: { specialization?: string; designation?: string }) =>
    apiRequest("/instructors/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
