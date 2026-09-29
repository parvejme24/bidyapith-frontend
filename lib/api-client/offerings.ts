import { apiRequest } from "./core";

export interface TeachingOffering {
  id: string;
  section: string;
  room?: string;
  capacity: number;
  enrolledCount: number;
  status: string;
  course: {
    id: string;
    code: string;
    title: string;
    credits: number | string;
  };
  schedules?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
}

export interface OfferingRosterStudent {
  id: string;
  status: string;
  student: {
    id: string;
    studentId: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      avatarUrl?: string;
    };
  };
  grade?: {
    quizMarks?: number;
    midtermMarks?: number;
    finalMarks?: number;
    assignmentMarks?: number;
    letterGrade?: string;
    gradePoint?: number;
  };
}

export const offeringsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/offerings${query}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/offerings/${id}`),
  getMyTeaching: () =>
    apiRequest<TeachingOffering[]>("/offerings/my-teaching"),
  getRoster: (id: string) =>
    apiRequest<OfferingRosterStudent[]>(`/offerings/${id}/students`),
  getGrades: (id: string) => apiRequest<unknown>(`/offerings/${id}/grades`),
  submitGrades: (id: string, body: unknown) =>
    apiRequest(`/offerings/${id}/grades`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  markAttendance: (id: string, body: unknown) =>
    apiRequest(`/offerings/${id}/attendance`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAttendanceSummary: (id: string) =>
    apiRequest<unknown>(`/offerings/${id}/attendance/summary`),
};
