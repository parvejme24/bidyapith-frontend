import { apiRequest } from "./core";

export interface CreateInstructorInput {
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  designation: string;
  phone?: string;
  specialization?: string;
  joiningDate?: string;
}

export const adminApi = {
  getUsers: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/admin/users${query}`);
  },
  getUserById: (id: string) => apiRequest<unknown>(`/admin/users/${id}`),
  createInstructor: (body: CreateInstructorInput) =>
    apiRequest<{ user: unknown; temporaryPassword?: string }>("/admin/users", {
      method: "POST",
      body: JSON.stringify({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        role: "INSTRUCTOR",
        departmentId: body.departmentId,
        designation: body.designation,
        phone: body.phone,
        specialization: body.specialization,
        joiningDate: body.joiningDate || new Date().toISOString(),
      }),
    }),
  updateUserRole: (id: string, role: string) =>
    apiRequest(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role: role.toUpperCase() }),
    }),
  updateUserStatus: (id: string, status: string) =>
    apiRequest(`/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: status.toUpperCase() }),
    }),
  deleteUser: (id: string) =>
    apiRequest(`/admin/users/${id}`, { method: "DELETE" }),
  getPayments: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/payments${query}`);
  },
  refundPayment: (id: string, reason = "Refund initiated by administrator") =>
    apiRequest(`/payments/${id}/refund`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};
