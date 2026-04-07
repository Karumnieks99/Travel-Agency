import { TRIP_OPTIONS } from "./trips";

const FEATURED_TRIP_IDS = [
  "bali-nusa-penida",
  "sumatra-java-volcano",
  "raja-ampat-liveaboard",
  "borneo-river",
];

export const FEATURED_TRIPS = FEATURED_TRIP_IDS.map((tripId) => TRIP_OPTIONS.find((trip) => trip.id === tripId))
  .filter(Boolean)
  .map((trip) => ({
    id: trip.id,
    title: trip.title,
    region: trip.region,
    duration: trip.duration,
    priceFrom: trip.priceFrom,
    nextDeparture: trip.nextDeparture,
    seatsLeft: trip.seatsLeft,
    style: trip.style,
    image: trip.image,
    summary: trip.summary,
  }));
