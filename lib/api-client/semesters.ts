import { apiRequest } from "./core";

export interface CurrentSemesterData {
  id: string;
  term: string;
  year: number;
  name: string;
  status: string;
  registrationStart: string;
  registrationEnd: string;
  dropDeadline: string;
  classStartDate: string;
  classEndDate: string;
  resultPublishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  registrationOpen?: boolean;
  dropAllowed?: boolean;
  daysUntilRegistrationEnd?: number;
}

export interface SemesterListItem {
  id: string;
  term: string;
  year: number;
  name: string;
  status: string;
  registrationStart: string;
  registrationEnd: string;
  dropDeadline: string;
  classStartDate: string;
  classEndDate: string;
  resultPublishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const semestersApi = {
  getCurrent: () => apiRequest<CurrentSemesterData>("/semesters/current"),
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<SemesterListItem[]>(`/semesters${query}`);
  },
  getById: (id: string) => apiRequest<CurrentSemesterData>(`/semesters/${id}`),
  create: (body: {
    term: string;
    year: number;
    registrationStart: string;
    registrationEnd: string;
    dropDeadline: string;
    classStartDate: string;
    classEndDate: string;
  }) =>
    apiRequest<{
      id: string;
      name: string;
      status: string;
    }>("/semesters", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (
    id: string,
    body: Partial<{
      registrationStart: string;
      registrationEnd: string;
      dropDeadline: string;
      classStartDate: string;
      classEndDate: string;
    }>
  ) =>
    apiRequest<{
      id: string;
      name: string;
      status: string;
    }>(`/semesters/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  changeStatus: (id: string, status: string) =>
    apiRequest<{
      id: string;
      name: string;
      status: string;
    }>(`/semesters/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
