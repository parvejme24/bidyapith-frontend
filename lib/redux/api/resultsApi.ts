import { baseApi } from "./baseApi";

export const resultsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyResults: builder.query<{ success: boolean; data: any }, void>({
      query: () => "/students/me/results",
      providesTags: ["Result"],
    }),
    getMyTranscript: builder.query<{ success: boolean; data: any }, void>({
      query: () => "/students/me/transcript",
      providesTags: ["Result"],
    }),
    submitGrades: builder.mutation<any, { offeringId: string; grades: Array<{ studentId: string; marks: number; letterGrade?: string }> }>({
      query: ({ offeringId, ...body }) => ({
        url: `/offerings/${offeringId}/grades`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Result", "Offering"],
    }),
  }),
});

export const {
  useGetMyResultsQuery,
  useGetMyTranscriptQuery,
  useSubmitGradesMutation,
} = resultsApi;
