import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppLink from "../components/AppLink";
import Layout from "../components/Layout";
import OptimizedImage from "../components/OptimizedImage";
import SiteHeader from "../components/SiteHeader";
import { TRIP_OPTIONS } from "../data/trips";
import { AVAILABILITY_LAST_UPDATED, BOOKING_CONFIDENCE_POINTS } from "../data/trust";
import {
  ORGANIZATION_ID,
  SITE_NAME,
  buildAbsoluteUrl,
  createBreadcrumbSchema,
  createTravelAgencySchema,
  createWebPageSchema,
  usePageSeo,
} from "../utils/seo";
import { HOME_PATH, TRIPS_PATH, buildContactHref, buildWhatsAppHref } from "../utils/urls";

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatPrice(priceFrom) {
  return typeof priceFrom === "number" ? USD_FORMATTER.format(priceFrom) : "Quote on request";
}

function formatDepartureDate(rawDate) {
  if (!rawDate) return "Flexible dates";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Flexible dates";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTravelMonth(rawDate) {
  if (!rawDate) return "";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatUpdatedDate(rawDate) {
  if (!rawDate) return "Recently updated";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return "Recently updated";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const TIME_SEGMENT_LABELS = ["Morning", "Afternoon", "Evening"];

function splitIntoSentences(copy) {
  if (typeof copy !== "string") return [];
  const sentences = copy.match(/[^.!?]+[.!?]?/g) || [];
  return sentences.map((line) => line.trim()).filter(Boolean);
}

function getTimelineSegments(day) {
  if (!day) return [];

  const customTimeline = Array.isArray(day.timeline)
    ? day.timeline
        .map((item, index) => {
          if (!item) return null;
          const slot = item.slot || item.label || TIME_SEGMENT_LABELS[index] || `Segment ${index + 1}`;
          const description = item.description || item.detail || "";
          return description ? { slot, description } : null;
        })
        .filter(Boolean)
    : [];

  if (customTimeline.length) return customTimeline;

  const sentences = splitIntoSentences(day.detail);
  if (!sentences.length) return [];

  const timeline = sentences.slice(0, 3).map((line, index) => ({
    slot: TIME_SEGMENT_LABELS[index] || `Segment ${index + 1}`,
    description: line,
  }));

  if (sentences.length > 3) {
    timeline.push({
      slot: "Anytime",
      description: sentences.slice(3).join(" "),
    });
  }

  return timeline;
}

function getDayTags(day) {
  if (!day) return [];
  const explicitTags = Array.isArray(day.tags) ? day.tags.filter(Boolean) : [];
  if (explicitTags.length) return explicitTags.slice(0, 3);

  const text = `${day.title || ""} ${day.detail || ""}`.toLowerCase();
  const tags = [];

  if (/\b(transfer|flight|airport|boat|ferry|drive|sail|cruise|port|disembark|arrive|departure)\b/.test(text)) tags.push("Transfer day");
  if (/\b(hike|trek|climb|walk|snorkel|dive|surf|kayak|paddle|trail|summit)\b/.test(text)) tags.push("Active moments");
  if (/\b(temple|market|village|heritage|fort|palace|cooking|coffee|food|dinner|cafe|craft)\b/.test(text)) tags.push("Local culture");
  if (/\b(spa|relax|free time|leisure|slow|rest|downtime|sunset|golden-hour)\b/.test(text)) tags.push("Leisure time");

  return tags.slice(0, 3);
}

export default function TripPage() {
  const [expandedDay, setExpandedDay] = useState(null);
  const [searchParams] = useSearchParams();

  const tripId = searchParams.get("trip") || "";

  const trip = useMemo(() => TRIP_OPTIONS.find((item) => item.id === tripId) || null, [tripId]);
  const itinerary = trip?.itinerary || [];
  const soldOut = (trip?.seatsLeft || 0) <= 0;
  const bookingHref = trip
    ? buildContactHref({
        tripId: trip.id,
        tripName: trip.title,
        nextDeparture: trip.nextDeparture,
        travelMonth: formatTravelMonth(trip.nextDeparture),
        source: "trip-page",
        requestType: soldOut ? "waitlist" : "booking",
        topic: soldOut ? `Waitlist: ${trip.title}` : `Booking request: ${trip.title}`,
      })
    : buildContactHref();
  const whatsAppHref = trip
    ? buildWhatsAppHref(`Hi Surga team, I want help with ${trip.title} (${trip.duration}).`)
    : buildWhatsAppHref();
  const seoData = useMemo(() => {
    if (!trip) {
      const pageUrl = buildAbsoluteUrl("trip.html");
      return {
        title: "Trip Details",
        description: "View detailed day-by-day Indonesia itineraries, highlights, pricing, and booking options.",
        path: "trip.html",
        image: "photos/dest-raja-ampat.jpg",
        imageAlt: "Indonesia trip overview",
        schema: [
          createTravelAgencySchema(),
          createWebPageSchema({
            url: pageUrl,
            title: "Trip Details",
            description: "View detailed day-by-day Indonesia itineraries, highlights, pricing, and booking options.",
            image: "photos/dest-raja-ampat.jpg",
          }),
          createBreadcrumbSchema([
            { name: "Home", url: buildAbsoluteUrl("") },
            { name: "Trips", url: buildAbsoluteUrl("platform.html") },
            { name: "Trip Details", url: pageUrl },
          ]),
        ],
      };
    }

    const path = `trip.html?trip=${encodeURIComponent(trip.id)}`;
    const pageUrl = buildAbsoluteUrl(path);
    const title = `${trip.title} Itinerary, Pricing & Departure`;
    const description = trip.summary || trip.details || "View the day-by-day route, trip highlights, and booking details.";

    return {
      title,
      description,
      path,
      image: trip.image,
      imageAlt: trip.title,
      schema: [
        createTravelAgencySchema(),
        createWebPageSchema({
          url: pageUrl,
          title,
          description,
          image: trip.image,
        }),
        createBreadcrumbSchema([
          { name: "Home", url: buildAbsoluteUrl("") },
          { name: "Trips", url: buildAbsoluteUrl("platform.html") },
          { name: trip.title, url: pageUrl },
        ]),
        {
          "@type": "Product",
          "@id": `${pageUrl}#trip`,
          name: trip.title,
          description,
          image: buildAbsoluteUrl(trip.image),
          brand: {
            "@type": "Brand",
            name: SITE_NAME,
          },
          sku: trip.id,
          category: `${trip.style} trip`,
          areaServed: {
            "@type": "Country",
            name: "Indonesia",
          },
          additionalProperty: [
            { "@type": "PropertyValue", name: "Region", value: trip.region },
            { "@type": "PropertyValue", name: "Duration", value: trip.duration },
            { "@type": "PropertyValue", name: "Budget tier", value: trip.budgetTier },
            { "@type": "PropertyValue", name: "Next departure", value: formatDepartureDate(trip.nextDeparture) },
          ],
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: String(trip.priceFrom),
            availability: trip.seatsLeft > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
            url: pageUrl,
            seller: {
              "@id": ORGANIZATION_ID,
            },
          },
        },
        trip.itinerary?.length
          ? {
              "@type": "ItemList",
              "@id": `${pageUrl}#itinerary`,
              name: `${trip.title} itinerary`,
              itemListElement: trip.itinerary.map((day, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: day.title || day.label || `Day ${index + 1}`,
                description: day.detail,
              })),
            }
          : null,
      ],
    };
  }, [trip]);

  usePageSeo({
    title: seoData.title,
    description: seoData.description,
    path: seoData.path,
    image: seoData.image,
    imageAlt: seoData.imageAlt,
    schema: seoData.schema,
  });

  useEffect(() => {
    setExpandedDay(itinerary.length ? 0 : null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [tripId, itinerary.length]);

  const toggleDay = (index) => setExpandedDay((prev) => (prev === index ? null : index));

  if (!trip) {
    return (
      <Layout currentPage="trips">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Trip not found</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">We could not find this itinerary.</h1>
          <p className="mt-3 text-slate-600">The trip link may be outdated or missing a trip id.</p>
          <AppLink
            href={TRIPS_PATH}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Back to trips
          </AppLink>
        </section>
      </Layout>
    );
  }

  return (
    <Layout currentPage="trips" renderHeader={false}>
      <section className="relative isolate overflow-hidden bg-slate-900 text-white">
        <OptimizedImage
          src={trip.image}
          alt={trip.title}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1200"
          height="800"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/70 via-slate-900/55 to-slate-950/80" aria-hidden />
        <div className="relative z-10">
          <SiteHeader currentPage="trips" variant="overlay" />
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pt-16 lg:pb-14 lg:pt-20">
            <nav className="flex items-center gap-2 text-sm text-slate-100/80">
              <AppLink className="font-semibold hover:text-amber-200" href={HOME_PATH}>
                Home
              </AppLink>
              <span aria-hidden>/</span>
              <AppLink className="font-semibold hover:text-amber-200" href={TRIPS_PATH}>
                Trips
              </AppLink>
              <span aria-hidden>/</span>
              <span className="text-slate-100">{trip.title}</span>
            </nav>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
              {trip.duration} / {trip.region}
            </p>
            <h1 className="mt-2 break-words text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{trip.title}</h1>
            {trip.summary ? <p className="mt-3 max-w-3xl text-lg text-slate-100">{trip.summary}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-amber-200/90 px-3 py-1 text-slate-900">From {formatPrice(trip.priceFrom)}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-white">Next departure: {formatDepartureDate(trip.nextDeparture)}</span>
              <span className={`rounded-full px-3 py-1 ${trip.seatsLeft > 0 ? "bg-emerald-300/90 text-slate-900" : "bg-rose-300/90 text-slate-900"}`}>
                {trip.seatsLeft > 0 ? `${trip.seatsLeft} seats left` : "Sold out"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{trip.region}</p>
              <h2 className="text-2xl font-semibold text-slate-900">Day-by-day itinerary</h2>
            </div>
            <AppLink
              href={TRIPS_PATH}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Back to trips
            </AppLink>
          </div>

          {trip.details ? (
            <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 via-white to-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Trip details</p>
              <p className="mt-2 text-sm text-slate-700">{trip.details}</p>
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Itinerary</p>
              <p className="text-sm text-slate-600">Each day balances movement, experiences, and downtime for a smoother trip flow.</p>
              {itinerary.length ? (
                <div className="relative space-y-3">
                  <div className="pointer-events-none absolute bottom-8 left-[17px] top-8 hidden w-px bg-gradient-to-b from-amber-300 via-slate-300 to-transparent sm:block" aria-hidden />
                  {itinerary.map((day, index) => {
                    const open = expandedDay === index;
                    const panelId = `${trip.id}-day-panel-${index}`;
                    const buttonId = `${trip.id}-day-button-${index}`;
                    const timeline = getTimelineSegments(day);
                    const tags = getDayTags(day);
                    const preview = day.preview || timeline[0]?.description || day.detail || "";
                    return (
                      <article
                        key={`${day.label}-${day.title}`}
                        className={`relative overflow-hidden rounded-2xl border shadow-sm transition ${
                          open
                            ? "border-amber-300 bg-gradient-to-br from-amber-50/90 via-white to-white ring-1 ring-amber-100"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <button
                          id={buttonId}
                          type="button"
                          onClick={() => toggleDay(index)}
                          className="w-full text-left"
                          aria-expanded={open}
                          aria-controls={panelId}
                        >
                          <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
                            <span
                              className={`relative z-10 mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                                open ? "border-amber-400 bg-amber-100 text-amber-900" : "border-slate-300 bg-white text-slate-600"
                              }`}
                              aria-hidden
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{day.label || `Day ${index + 1}`}</p>
                                {tags.map((tag) => (
                                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <p className="mt-1 text-base font-semibold leading-snug text-slate-900 sm:text-lg">{day.title}</p>
                              {!open && preview ? <p className="mt-1 text-sm text-slate-600">{preview}</p> : null}
                            </div>
                            <span
                              className={`mt-0.5 inline-flex h-7 min-w-14 items-center justify-center rounded-full border px-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                                open ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-500"
                              }`}
                              aria-hidden
                            >
                              {open ? "Hide" : "View"}
                            </span>
                          </div>
                        </button>
                        {open ? (
                          <div id={panelId} role="region" aria-labelledby={buttonId} className="px-4 pb-4 sm:px-5 sm:pb-5">
                            {timeline.length ? (
                              <ol className="space-y-2.5">
                                {timeline.map((item) => (
                                  <li key={`${item.slot}-${item.description}`} className="rounded-xl border border-slate-200 bg-white/80 p-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">{item.slot}</p>
                                    <p className="mt-1 text-sm text-slate-700">{item.description}</p>
                                  </li>
                                ))}
                              </ol>
                            ) : day.detail ? (
                              <p className="text-sm text-slate-700">{day.detail}</p>
                            ) : null}
                            {Array.isArray(day.highlights) && day.highlights.length ? (
                              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                                {day.highlights.map((item) => (
                                  <li key={item} className="flex items-start gap-2">
                                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                            {day.note ? <p className="mt-3 rounded-xl bg-slate-900 px-3 py-2 text-xs text-slate-100">{day.note}</p> : null}
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">Detailed day-by-day steps are being finalized for this trip.</p>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-lg ring-1 ring-slate-800">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Trip booking</p>
                <p className="mt-2 text-3xl font-semibold">{formatPrice(trip.priceFrom)}</p>
                <p className="text-sm text-slate-200">per person, twin-share estimate</p>
                <div className="mt-4 space-y-2 rounded-xl bg-white/10 p-3 text-sm">
                  <p className="flex items-center justify-between gap-3">
                    <span className="text-slate-200">Next departure</span>
                    <span className="font-semibold text-white">{formatDepartureDate(trip.nextDeparture)}</span>
                  </p>
                  <p className="flex items-center justify-between gap-3">
                    <span className="text-slate-200">Availability</span>
                    <span className="font-semibold text-white">{trip.seatsLeft > 0 ? `${trip.seatsLeft} seats left` : "Sold out"}</span>
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold">
                  <span className="rounded-lg bg-white/10 px-2 py-1 text-center text-slate-100">{trip.duration}</span>
                  <span className="rounded-lg bg-white/10 px-2 py-1 text-center text-slate-100">{trip.style}</span>
                  <span className="rounded-lg bg-white/10 px-2 py-1 text-center text-slate-100">{trip.budgetTier}</span>
                  <span className="rounded-lg bg-white/10 px-2 py-1 text-center text-slate-100">{trip.region}</span>
                </div>
                <AppLink
                  href={bookingHref}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                >
                  {soldOut ? "Join waitlist" : "Request booking"}
                </AppLink>
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-emerald-300/60 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                >
                  Chat on WhatsApp
                </a>
                <AppLink
                  href={TRIPS_PATH}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                >
                  Compare other routes
                </AppLink>
                <ul className="mt-3 space-y-1 text-xs text-slate-200">
                  {BOOKING_CONFIDENCE_POINTS.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                  Availability updated {formatUpdatedDate(AVAILABILITY_LAST_UPDATED)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Highlights</p>
                {trip.highlights?.length ? (
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {trip.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-700">Highlights will be added soon.</p>
                )}
              </div>
            </aside>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Included</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {["Hotels and local transfers", "Local guides and permits", "Core tours and experiences"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Not included</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {["International flights", "Travel insurance", "Personal expenses and optional add-ons"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Booking policy</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {[
                  "25% deposit secures your departure date.",
                  "Remaining balance due 30 days before arrival.",
                  "Date changes allowed up to 14 days before start, subject to availability.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </Layout>
  );
}
