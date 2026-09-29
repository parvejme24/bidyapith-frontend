import { apiRequest } from "./core";

export interface CourseGradeInput {
  enrollmentId: string;
  letterGrade?: string;
  remarks?: string;
}

export const resultsApi = {
  getOfferingGrades: (offeringId: string) =>
    apiRequest<unknown>(`/offerings/${offeringId}/grades`),
  submitOfferingGrades: (offeringId: string, grades: CourseGradeInput[]) =>
    apiRequest<unknown>(`/offerings/${offeringId}/grades`, {
      method: "POST",
      body: JSON.stringify({ grades }),
    }),
  updateEnrollmentGrade: (enrollmentId: string, letterGrade: string) =>
    apiRequest<unknown>(`/enrollments/${enrollmentId}/grade`, {
      method: "PATCH",
      body: JSON.stringify({ letterGrade }),
    }),
  getSemesterReadiness: (semesterId: string) =>
    apiRequest<unknown>(`/semesters/${semesterId}/results/readiness`),
  publishSemesterResults: (semesterId: string) =>
    apiRequest<unknown>(`/semesters/${semesterId}/publish-results`, { method: "POST" }),
  getMyResults: (params?: { semesterId?: string }) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return apiRequest<unknown[]>(`/students/me/results${query}`);
  },
  getMyTranscript: () => apiRequest<unknown>("/students/me/transcript"),
  getStudentTranscript: (studentId: string) =>
    apiRequest<unknown>(`/students/${studentId}/transcript`),
};