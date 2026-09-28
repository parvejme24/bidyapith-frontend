import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
  }
  return process.env.INTERNAL_API_URL || "http://localhost:5001/api/v1";
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      let token: string | null = null;

      // First check Redux state
      const state = getState() as any;
      if (state.auth?.token) {
        token = state.auth.token;
      }

      // Fallback to localStorage
      if (!token && typeof window !== "undefined") {
        try {
          token = localStorage.getItem("bidyapith_access_token");
        } catch {}
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "User",
    "Student",
    "Instructor",
    "Course",
    "Offering",
    "Enrollment",
    "Admission",
    "Attendance",
    "Result",
    "Invoice",
    "Payment",
    "Notification",
    "Department",
    "Program",
    "Semester",
    "Stats",
  ],
  endpoints: () => ({}),
});
