import { apiRequest } from "./core";

export const departmentsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<
      Array<{
        id: string;
        code: string;
        name: string;
        contactEmail?: string;
      }>
    >(`/departments${query}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/departments/${id}`),
};

export const programsApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<
      Array<{
        id: string;
        code: string;
        name: string;
        degreeType: string;
        totalCredits: number;
        durationYears?: number;
        feePerCredit?: string | number;
        registrationFee?: string | number;
        departmentId: string;
        department?: { id: string; code: string; name: string };
      }>
    >(`/programs${query}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/programs/${id}`),
};

export const coursesApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<
      Array<{
        id: string;
        code: string;
        title: string;
        description?: string;
        credits: number | string;
        type: string;
        level: number;
        departmentId: string;
        department?: { id: string; code: string; name: string };
      }>
    >(`/courses${query}`);
  },
  getById: (id: string) => apiRequest<unknown>(`/courses/${id}`),
};
