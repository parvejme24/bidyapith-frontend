import { apiRequest } from "./core";

export interface AdmissionApplyRequest {
  programId?: string;
  courseCode?: string;
  courseTitle?: string;
  courseCredits?: number;
  studentName: string;
  email: string;
  phone: string;
  prevInstitution?: string;
  gpa?: number;
  documents?: string[];
  notes?: string;
}

export const admissionsApi = {
  apply: (body: AdmissionApplyRequest) =>
    apiRequest<{ id: string; status: string }>("/admissions", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getMyApplications: () => apiRequest<unknown[]>("/admissions/me"),
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/admissions${query}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/admissions/${id}`),
  approve: (id: string) =>
    apiRequest(`/admissions/${id}/approve`, { method: "PATCH" }),
  reject: (id: string, body?: { reason?: string }) =>
    apiRequest(`/admissions/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(body || {}),
    }),
  payFee: (id: string, body?: { paymentMethod?: string }) =>
    apiRequest(`/admissions/${id}/pay`, {
      method: "POST",
      body: JSON.stringify(body || {}),
    }),
};
