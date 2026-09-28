import { baseApi } from "./baseApi";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyAttendance: builder.query<{ success: boolean; data: any[] }, { semesterId?: string } | void>({
      query: (params) => ({
        url: "/students/me/attendance",
        params: params || {},
      }),
      providesTags: ["Attendance"],
    }),
    getOfferingAttendance: builder.query<{ success: boolean; data: any[] }, { offeringId: string; date?: string }>({
      query: ({ offeringId, date }) => ({
        url: `/offerings/${offeringId}/attendance`,
        params: date ? { date } : {},
      }),
      providesTags: (_result, _error, { offeringId }) => [{ type: "Attendance", id: offeringId }],
    }),
    recordAttendance: builder.mutation<any, { offeringId: string; date: string; records: Array<{ studentId: string; status: "PRESENT" | "LATE" | "ABSENT" | "EXCUSED" }> }>({
      query: ({ offeringId, ...body }) => ({
        url: `/offerings/${offeringId}/attendance`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { offeringId }) => [
        { type: "Attendance", id: offeringId },
        "Attendance",
      ],
    }),
  }),
});

export const {
  useGetMyAttendanceQuery,
  useGetOfferingAttendanceQuery,
  useRecordAttendanceMutation,
} = attendanceApi;
