import { baseApi } from "./baseApi";
import type { AdmissionApplication } from "@/lib/app-types";

export const admissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmissions: builder.query<{ success: boolean; data: AdmissionApplication[] }, { status?: string; type?: string } | void>({
      query: (params) => ({
        url: "/admissions",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Admission" as const, id })),
              { type: "Admission", id: "LIST" },
            ]
          : [{ type: "Admission", id: "LIST" }],
    }),
    getMyAdmissions: builder.query<{ success: boolean; data: AdmissionApplication[] }, void>({
      query: () => "/admissions/me",
      providesTags: [{ type: "Admission", id: "ME" }],
    }),
    submitAdmission: builder.mutation<{ success: boolean; data: AdmissionApplication }, Partial<AdmissionApplication>>({
      query: (data) => ({
        url: "/admissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Admission", id: "LIST" },
        { type: "Admission", id: "ME" },
        "Notification",
      ],
    }),
    approveAdmission: builder.mutation<{ success: boolean; data: AdmissionApplication }, string>({
      query: (id) => ({
        url: `/admissions/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Admission", id },
        { type: "Admission", id: "LIST" },
        { type: "Admission", id: "ME" },
        "Notification",
      ],
    }),
    rejectAdmission: builder.mutation<{ success: boolean; data: AdmissionApplication }, string>({
      query: (id) => ({
        url: `/admissions/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Admission", id },
        { type: "Admission", id: "LIST" },
        { type: "Admission", id: "ME" },
      ],
    }),
  }),
});

export const {
  useGetAdmissionsQuery,
  useGetMyAdmissionsQuery,
  useSubmitAdmissionMutation,
  useApproveAdmissionMutation,
  useRejectAdmissionMutation,
} = admissionsApi;
