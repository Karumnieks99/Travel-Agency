export const HOME_PATH = "/";
export const HOME_ALIAS_PATH = "/index.html";
export const TRIPS_PATH = "/platform.html";
export const CONTACT_PATH = "/support.html";
export const TRIP_PATH = "/trip.html";
export const LEGAL_PATHS = {
  terms: "/terms.html",
  cancellation: "/cancellation.html",
  privacy: "/privacy.html",
  payments: "/payments.html",
};
const WHATSAPP_NUMBER = "6281138062116";

function formatTravelMonthFromDate(rawDate) {
  if (!rawDate) return "";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function buildContactHref(input) {
  const params = new URLSearchParams();

  if (typeof input === "string") {
    if (input) params.set("trip", input);
  } else if (input && typeof input === "object") {
    const tripId = input.tripId || "";
    const tripName = input.tripName || input.tripTitle || "";
    const nextDeparture = input.nextDeparture || "";
    const travelMonth = input.travelMonth || formatTravelMonthFromDate(nextDeparture);
    const source = input.source || "";
    const topic = input.topic || "";
    const requestType = input.requestType || "";

    if (tripId) params.set("trip", tripId);
    if (tripName) params.set("trip_name", tripName);
    if (nextDeparture) params.set("departure", nextDeparture);
    if (travelMonth) params.set("travel_month", travelMonth);
    if (source) params.set("source", source);
    if (topic) params.set("topic", topic);
    if (requestType) params.set("request_type", requestType);
  }

  const query = params.toString();
  return `${CONTACT_PATH}${query ? `?${query}` : ""}#contact`;
}

export function buildTripHref(tripId) {
  if (!tripId) return TRIPS_PATH;
  return `${TRIP_PATH}?trip=${encodeURIComponent(tripId)}`;
}

export function buildWhatsAppHref(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
