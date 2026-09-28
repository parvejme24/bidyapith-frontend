import { baseApi } from "./baseApi";

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/enrollments/me",
      providesTags: ["Enrollment", "Offering"],
    }),
    enrollOffering: builder.mutation<any, { offeringId: string }>({
      query: (body) => ({
        url: "/enrollments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Enrollment", "Offering", "Student", "Invoice"],
    }),
    dropOffering: builder.mutation<any, string>({
      query: (enrollmentId) => ({
        url: `/enrollments/${enrollmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enrollment", "Offering", "Student", "Invoice"],
    }),
  }),
});

export const {
  useGetMyEnrollmentsQuery,
  useEnrollOfferingMutation,
  useDropOfferingMutation,
} = enrollmentsApi;
