import { apiFetch } from "./client";
import type { Review, ReviewEntityType } from "../mock-data/reviews";

export interface ReviewRequest {
  entityId: string;
  entityType: ReviewEntityType;
  rating: number;
  comment: string;
  bookingId?: string; // required only for HOTEL reviews
}

export async function getReviews(params: {
  entityId: string;
  entityType: ReviewEntityType;
  page?: number;
  size?: number;
}): Promise<{ content: Review[]; totalElements: number }> {
  return apiFetch<{ content: Review[]; totalElements: number }>("/api/v1/catalog/public/reviews", {
    method: "GET",
    params,
  });
}

export async function submitReview(req: ReviewRequest): Promise<Review> {
  return apiFetch<Review>("/api/v1/catalog/reviews", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function respondToReview(reviewId: string, response: string): Promise<Review> {
  return apiFetch<Review>(`/api/v1/catalog/reviews/${reviewId}/respond`, {
    method: "PUT",
    body: JSON.stringify({ response }),
  });
}
