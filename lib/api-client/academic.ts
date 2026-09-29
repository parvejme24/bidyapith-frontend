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
  create: (body: Record<string, unknown>) =>
    apiRequest<unknown>("/departments", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Record<string, unknown>) =>
    apiRequest<unknown>(`/departments/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest<unknown>(`/departments/${id}`, { method: "DELETE" }),
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
  getCurriculum: (id: string) => apiRequest<unknown>(`/programs/${id}/curriculum`),
  create: (body: Record<string, unknown>) =>
    apiRequest<unknown>("/programs", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Record<string, unknown>) =>
    apiRequest<unknown>(`/programs/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest<unknown>(`/programs/${id}`, { method: "DELETE" }),
  addCourse: (id: string, body: Record<string, unknown>) =>
    apiRequest<unknown>(`/programs/${id}/courses`, { method: "POST", body: JSON.stringify(body) }),
  updateCourse: (id: string, courseId: string, body: Record<string, unknown>) =>
    apiRequest<unknown>(`/programs/${id}/courses/${courseId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  removeCourse: (id: string, courseId: string) =>
    apiRequest<unknown>(`/programs/${id}/courses/${courseId}`, { method: "DELETE" }),
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
  create: (body: Record<string, unknown>) =>
    apiRequest<unknown>("/courses", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Record<string, unknown>) =>
    apiRequest<unknown>(`/courses/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest<unknown>(`/courses/${id}`, { method: "DELETE" }),
  getPrerequisites: (id: string) =>
    apiRequest<unknown>(`/courses/${id}/prerequisites`),
  getDependents: (id: string) => apiRequest<unknown>(`/courses/${id}/dependents`),
  addPrerequisite: (id: string, prerequisiteId: string, minGradePoint?: number | string) =>
    apiRequest<unknown>(`/courses/${id}/prerequisites`, {
      method: "POST",
      body: JSON.stringify({ prerequisiteId, minGradePoint }),
    }),
  removePrerequisite: (id: string, prerequisiteId: string) =>
    apiRequest<unknown>(`/courses/${id}/prerequisites/${prerequisiteId}`, { method: "DELETE" }),
};
