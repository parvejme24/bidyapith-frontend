import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<{ success: boolean; data: any[] }, { role?: string; status?: string; search?: string } | void>({
      query: (params) => ({
        url: "/admin/users",
        params: params || {},
      }),
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation<any, { userId: string; role: string; status?: string }>({
      query: ({ userId, ...body }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getAdminPayments: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/payments",
      providesTags: ["Payment"],
    }),
    getStats: builder.query<{ success: boolean; data: any }, void>({
      query: () => "/admin/stats",
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useGetAdminPaymentsQuery,
  useGetStatsQuery,
} = adminApi;
