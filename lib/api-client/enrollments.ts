import { apiRequest } from "./core";

export interface MyCourseEnrollment {
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
}

export interface AvailableCourseOffering {
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
}

export const enrollmentsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/enrollments${query}`);
  },
  getMyCourses: () =>
    apiRequest<MyCourseEnrollment[]>("/enrollments/my-courses"),

  getAvailableCourses: () =>
    apiRequest<AvailableCourseOffering[]>("/enrollments/available-courses"),

  create: (offeringId: string) =>
    apiRequest("/enrollments", {
      method: "POST",
      body: JSON.stringify({ offeringId }),
    }),
  createAdmin: (body: { studentId: string; offeringId: string }) =>
    apiRequest<unknown>("/enrollments/admin", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  drop: (enrollmentId: string) =>
    apiRequest(`/enrollments/${enrollmentId}`, { method: "DELETE" }),
};
