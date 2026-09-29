import { apiRequest } from "./core";

export const invoicesApi = {
  getMyInvoices: () => apiRequest<unknown[]>("/invoices/my"),
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/invoices${query}`);
  },
  getSummary: () => apiRequest<unknown>("/invoices/summary"),
  getById: (id: string) => apiRequest<unknown>(`/invoices/${id}`),
  generate: (semesterId: string) =>
    apiRequest<unknown>("/invoices/generate", {
      method: "POST",
      body: JSON.stringify({ semesterId }),
    }),
  create: (body: Record<string, unknown>) =>
    apiRequest<unknown>("/invoices", { method: "POST", body: JSON.stringify(body) }),
  waive: (id: string, reason: string) =>
    apiRequest<unknown>(`/invoices/${id}/waive`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),
  cancel: (id: string) => apiRequest<unknown>(`/invoices/${id}/cancel`, { method: "PATCH" }),
};
