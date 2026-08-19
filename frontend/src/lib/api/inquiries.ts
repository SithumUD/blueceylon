import { apiFetch } from "./client";

export interface InquiryRequest {
  businessId: string;
  subject: string;
  message: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Inquiry {
  id: string;
  businessId: string;
  customerId?: string;
  subject: string;
  message: string;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

export async function createInquiry(req: InquiryRequest): Promise<Inquiry> {
  return apiFetch<Inquiry>("/api/v1/inquiries", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getMyInquiries(): Promise<Inquiry[]> {
  return apiFetch<Inquiry[]>("/api/v1/inquiries/me", { method: "GET" });
}

export async function getBusinessInquiries(businessId: string): Promise<Inquiry[]> {
  return apiFetch<Inquiry[]>(`/api/v1/inquiries/business/${businessId}`, { method: "GET" });
}
