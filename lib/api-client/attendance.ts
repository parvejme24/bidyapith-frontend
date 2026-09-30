import { apiRequest } from "./core";

export interface AttendanceRecordInput {
  enrollmentId: string;
  status: string;
  remarks?: string;
}

export interface AttendanceSessionRecord {
  id: string;
  enrollmentId: string;
  status: string;
  remarks: string | null;
  studentId: string;
  firstName: string;
  lastName: string;
}

export interface AttendanceSessionResponse {
  date: string;
  records: AttendanceSessionRecord[];
}

export interface AttendanceSummaryRecord {
  enrollmentId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  sessionsHeld: number;
  attended: number;
  counted: number;
  rate: number;
  examEligible: boolean;
  missedDates: string[];
}

export const attendanceApi = {
  getMyAttendance: () => apiRequest<unknown>("/students/me/attendance"),
  getOfferingSummary: (offeringId: string) =>
    apiRequest<AttendanceSummaryRecord[]>(`/offerings/${offeringId}/attendance/summary`),
  getOfferingSession: (offeringId: string, date: string) =>
    apiRequest<AttendanceSessionResponse>(
      `/offerings/${offeringId}/attendance?${new URLSearchParams({ date })}`,
    ),
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