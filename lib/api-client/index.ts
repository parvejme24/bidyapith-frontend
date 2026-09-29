/**
 * Bidyapith Unified API Client
 * Modular API client organized by domain
 */

import { authApi } from "./auth";
import { usersApi } from "./users";
import { departmentsApi, programsApi, coursesApi } from "./academic";
import { instructorsApi } from "./instructors";
import { studentsApi } from "./students";
import { enrollmentsApi } from "./enrollments";
import { semestersApi } from "./semesters";
import { offeringsApi } from "./offerings";
import { invoicesApi } from "./invoices";
import { paymentsApi } from "./payments";
import { admissionsApi } from "./admissions";
import { adminApi } from "./admin";
import { notificationsApi } from "./notifications";
import { attendanceApi } from "./attendance";
import { examsApi } from "./exams";
import { resultsApi } from "./results";

export const apiClient = {
  auth: authApi,
  users: usersApi,
  departments: departmentsApi,
  programs: programsApi,
  courses: coursesApi,
  instructors: instructorsApi,
  students: studentsApi,
  enrollments: enrollmentsApi,
  semesters: semestersApi,
  offerings: offeringsApi,
  invoices: invoicesApi,
  payments: paymentsApi,
  admissions: admissionsApi,
  admin: adminApi,
  notifications: notificationsApi,
  attendance: attendanceApi,
  exams: examsApi,
  results: resultsApi,
};

export default apiClient;

// Re-export core utilities & types
export * from "./core";
export * from "./auth";
export * from "./users";
export * from "./academic";
export * from "./instructors";
export * from "./students";
export * from "./enrollments";
export * from "./semesters";
export * from "./offerings";
export * from "./invoices";
export * from "./payments";
export * from "./admissions";
export * from "./admin";
export * from "./notifications";
export * from "./attendance";
export * from "./exams";
export * from "./results";
