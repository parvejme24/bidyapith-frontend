import { baseApi } from "./baseApi";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
      firstName: string;
      lastName: string;
      status: string;
      studentProfile?: any;
      instructorProfile?: any;
    };
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password?: string; role?: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User", "Student", "Instructor"],
    }),
    register: builder.mutation<any, any>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
    getMe: builder.query<{ success: boolean; data: any }, void>({
      query: () => "/auth/me",
      providesTags: ["Auth", "User"],
    }),
    getStudentProfile: builder.query<{ success: boolean; data: any }, void>({
      query: () => "/students/me",
      providesTags: ["Student"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetStudentProfileQuery,
} = authApi;
