import { apiRequest } from "./core";

export const invoicesApi = {
  getMyInvoices: () => apiRequest<unknown[]>("/invoices/my"),
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/invoices${query}`);
  },
  getSummary: () => apiRequest<unknown>("/invoices/summary"),
  getById: (id: string) => apiRequest<unknown>(`/invoices/${id}`),
};
