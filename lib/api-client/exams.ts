import { apiRequest } from "./core";

export interface OfferingExam {
  id: string;
  offeringId: string;
  type: "MIDTERM" | "ASSIGNMENT" | "FINAL";
  title: string;
  totalMarks: string;
  weight: string;
  examDate: string;
  isPublished: boolean;
}

export interface OfferingExamList {
  weightRemaining: string;
  exams: OfferingExam[];
}

export interface ExamResultRecord {
  id: string;
  enrollmentId: string;
  marksObtained: string;
  remarks: string | null;
  examEligible: boolean;
  studentId: string;
  firstName: string;
  lastName: string;
}

export interface ExamResultInput {
  enrollmentId: string;
  marksObtained: number | string;
  remarks?: string;
}

export const examsApi = {
  createForOffering: (
    offeringId: string,
    body: {
      type: string;
      title: string;
      totalMarks: number | string;
      weight: number | string;
      examDate: string;
    },
  ) =>
    apiRequest<unknown>(`/offerings/${offeringId}/exams`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getForOffering: (offeringId: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<OfferingExamList>(`/offerings/${offeringId}/exams${query}`);
  },
  update: (examId: string, body: Record<string, unknown>) =>
    apiRequest<unknown>(`/exams/${examId}`, { method: "PATCH", body: JSON.stringify(body) }),
  publish: (examId: string, isPublished: boolean) =>
    apiRequest<unknown>(`/exams/${examId}/publish`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished }),
    }),
  enterResults: (examId: string, results: ExamResultInput[]) =>
    apiRequest<unknown>(`/exams/${examId}/results`, {
      method: "POST",
      body: JSON.stringify({ results }),
    }),
  getResults: (examId: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<ExamResultRecord[]>(`/exams/${examId}/results${query}`);
  },
  remove: (examId: string) => apiRequest<unknown>(`/exams/${examId}`, { method: "DELETE" }),
  getMyResults: (params?: { offeringId?: string }) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/students/me/exam-results${query}`);
  },
};