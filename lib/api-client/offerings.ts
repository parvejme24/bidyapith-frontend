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

export interface OfferingRosterEntry {
  enrollmentId: string;
  status: string;
  enrolledAt: string;
  examEligible: boolean;
  totalMarks: string | null;
  letterGrade: string | null;
  gradePoint: string | null;
  attendancePct: number;
  student: {
    id: string;
    studentId: string;
    batch: string;
    cgpa: string;
    program: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      avatarUrl?: string | null;
    };
  };
  recentAttendance: Array<{ date: string; status: string }>;
}

export interface OfferingRosterResponse {
  offering: {
    id: string;
    section: string;
    course: { id: string; code: string; title: string; credits: string };
  };
  data: OfferingRosterEntry[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

export const offeringsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/offerings${query}`);
  },
  create: (body: Record<string, unknown>) =>
    apiRequest<unknown>("/offerings", { method: "POST", body: JSON.stringify(body) }),
  getById: (id: string) => apiRequest<unknown>(`/offerings/${id}`),
  update: (id: string, body: Record<string, unknown>) =>
    apiRequest<unknown>(`/offerings/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  assignInstructor: (id: string, instructorId: string) =>
    apiRequest<unknown>(`/offerings/${id}/instructor`, {
      method: "PATCH",
      body: JSON.stringify({ instructorId }),
    }),
  changeStatus: (id: string, status: string) =>
    apiRequest<unknown>(`/offerings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  addSchedule: (id: string, body: Record<string, unknown>) =>
    apiRequest<unknown>(`/offerings/${id}/schedules`, { method: "POST", body: JSON.stringify(body) }),
  removeSchedule: (id: string, scheduleId: string) =>
    apiRequest<unknown>(`/offerings/${id}/schedules/${scheduleId}`, { method: "DELETE" }),
  remove: (id: string) => apiRequest<unknown>(`/offerings/${id}`, { method: "DELETE" }),
  getMyTeaching: () =>
    apiRequest<TeachingOffering[]>("/offerings/my-teaching"),
  getRoster: (id: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<OfferingRosterResponse>(`/offerings/${id}/students${query}`);
  },
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
