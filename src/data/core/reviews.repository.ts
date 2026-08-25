// src/data/core/reviews.repository.ts
// Repository para reviews y ratings

import type { Review, RatingSummary } from "./types";

let _reviews: Review[] = [];

export function setReviews(reviews: Review[]): void {
  _reviews = reviews;
}

export function getReviews(tourId: string): Review[] {
  return _reviews.filter((r) => r.tourId === tourId);
}

export function getAllReviews(): Review[] {
  return _reviews;
}

export function getRating(tourId: string): RatingSummary {
  const reviews = getReviews(tourId);
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((a: number, r: Review) => a + r.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}