import { apiRequest } from "./core";

export interface CreateInstructorInput {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  phone?: string;
  room?: string;
  specialization?: string;
  temporaryPassword?: string;
  otp?: string;
  sendEmail?: boolean;
}

export const adminApi = {
  getUsers: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/users${query}`);
  },
  createInstructor: (body: CreateInstructorInput) =>
    apiRequest<{ user: unknown; temporaryPassword?: string }>("/users", {
      method: "POST",
      body: JSON.stringify({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        role: "INSTRUCTOR",
        departmentCode: body.department,
        designation: body.designation,
        phone: body.phone,
        room: body.room,
        specialization: body.specialization,
        joiningDate: new Date().toISOString(),
      }),
    }),
  updateUserRole: (id: string, role: string) =>
    apiRequest(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role: role.toUpperCase() }),
    }),
  updateUserStatus: (id: string, status: string) =>
    apiRequest(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: status.toUpperCase() }),
    }),
  deleteUser: (id: string) =>
    apiRequest(`/users/${id}`, { method: "DELETE" }),
  getAuditLogs: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/audit-logs${query}`);
  },
  getPayments: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/payments${query}`);
  },
  verifyPayment: (id: string) =>
    apiRequest(`/payments/${id}/verify`, { method: "POST" }),
  refundPayment: (id: string) =>
    apiRequest(`/payments/${id}/refund`, { method: "POST" }),
};
