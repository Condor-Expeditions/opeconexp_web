// src/data/core/image.service.ts
// Image helpers — wrappers para astro:assets y metadata

import type { Tour, MediaItem, MeetingPoint, ItineraryDay } from "./types";
import { getValidImageUrl } from "./utils";

let _meetingPoints: MeetingPoint[] = [];

export function setMeetingPoints(meetingPoints: MeetingPoint[]): void {
  _meetingPoints = meetingPoints;
}

export function getTourImage(tour: Tour, fallback = "/images/tours/city-tour-cuenca.webp"): string {
  return tour.image ?? tour.gallery?.[0]?.src ?? fallback;
}

export function getTourGallery(tour: Tour): MediaItem[] {
  return tour.gallery ?? [];
}

export function getTourMap(tour: Tour): { lat: number; lng: number } {
  if (tour.map?.lat) return tour.map;
  const mp = tour.meetingPoints?.[0]
    ? _meetingPoints.find((m) => m.id === tour.meetingPoints?.[0]?.id)
    : undefined;
  return mp?.location ?? { lat: -2.8974, lng: -79.0045 };
}

export function getTourItinerary(tour: Tour): ItineraryDay[] {
  return tour.itinerary ?? [];
}