import { baseApi } from "./baseApi";

export const invoicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyInvoices: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/invoices/me",
      providesTags: ["Invoice"],
    }),
    getInvoiceById: builder.query<{ success: boolean; data: any }, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Invoice", id }],
    }),
    createPaymentSession: builder.mutation<{ success: boolean; data: { checkoutUrl: string; sessionId?: string } }, { invoiceId: string; gateway?: string }>({
      query: (body) => ({
        url: "/payments/create-session",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Invoice", "Payment"],
    }),
  }),
});

export const {
  useGetMyInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreatePaymentSessionMutation,
} = invoicesApi;
