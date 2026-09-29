import { apiRequest } from "./core";

export interface AttendanceRecordInput {
  enrollmentId: string;
  status: string;
  remarks?: string;
}

export const attendanceApi = {
  getMyAttendance: () => apiRequest<unknown>("/students/me/attendance"),
  getOfferingSummary: (offeringId: string) =>
    apiRequest<unknown>(`/offerings/${offeringId}/attendance/summary`),
  getOfferingSession: (offeringId: string, date: string) =>
    apiRequest<unknown>(`/offerings/${offeringId}/attendance?${new URLSearchParams({ date })}`),
  markOfferingSession: (
    offeringId: string,
    body: { date: string; records: AttendanceRecordInput[] },
  ) =>
    apiRequest<unknown>(`/offerings/${offeringId}/attendance`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  removeOfferingSession: (offeringId: string, date: string) =>
    apiRequest<unknown>(`/offerings/${offeringId}/attendance?${new URLSearchParams({ date })}`, {
      method: "DELETE",
    }),
};