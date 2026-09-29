import { apiRequest } from "./core";

export interface PaymentInitiateRequest {
  invoiceId: string;
  amount: number;
  gateway: "STRIPE" | "SSLCOMMERZ" | "BKASH" | "NAGAD";
}

export interface PaymentInitiateResponse {
  paymentId: string;
  transactionRef: string;
  paymentUrl?: string;
  clientSecret?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  status: string;
  payment: unknown;
}

export const paymentsApi = {
  initiate: (body: PaymentInitiateRequest) =>
    apiRequest<PaymentInitiateResponse>("/payments/initiate", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verify: (transactionRef: string) =>
    apiRequest<PaymentVerifyResponse>(`/payments/verify/${transactionRef}`),
  getMyHistory: () => apiRequest<unknown[]>("/payments/my-history"),
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<unknown[]>(`/payments${query}`);
  },
  refund: (id: string, body?: { reason?: string }) =>
    apiRequest(`/payments/${id}/refund`, {
      method: "POST",
      body: JSON.stringify(body || {}),
    }),
};
