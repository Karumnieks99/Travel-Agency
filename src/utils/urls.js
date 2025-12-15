export function buildContactHref(tripId) {
  const base = "support.html";
  if (!tripId) return `${base}#contact`;
  return `${base}?trip=${encodeURIComponent(tripId)}#contact`;
}
