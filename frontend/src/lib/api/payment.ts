import { apiFetch } from "./client";

export interface PaymentCheckoutRequest {
  bookingId: string;
  amount: number;
  currency?: "LKR" | "USD" | "EUR" | "GBP";
}

export interface PaymentCheckoutResponse {
  checkoutUrl?: string;
  orderId?: string;
  paymentStatus?: string;
  message?: string;
  [key: string]: any;
}

export async function initiatePayment(req: PaymentCheckoutRequest): Promise<PaymentCheckoutResponse> {
  return apiFetch<PaymentCheckoutResponse>("/api/v1/payment/checkout", {
    method: "POST",
    body: JSON.stringify(req),
  });
}
