import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLink from "../components/AppLink";
import Layout from "../components/Layout";
import OptimizedImage from "../components/OptimizedImage";
import SiteHeader from "../components/SiteHeader";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { INCLUSIONS, TIMELINE_STEPS, TRIP_OPTIONS } from "../data/trips";
import { AVAILABILITY_LAST_UPDATED, BOOKING_CONFIDENCE_POINTS, TRUST_STATS } from "../data/trust";
import {
  buildAbsoluteUrl,
  createBreadcrumbSchema,
  createTravelAgencySchema,
  createWebPageSchema,
  usePageSeo,
} from "../utils/seo";
import { buildContactHref, buildTripHref } from "../utils/urls";

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const SERVICES_TITLE = "Indonesia Trips, Island Routes & Departure Dates";
const SERVICES_DESCRIPTION =
  "Browse Indonesia trip routes with day-by-day plans, pricing, departure dates, and booking support from Surga Indonesia Travel.";
const HERO_VIDEO_SRC = "videos/bali-video.mp4";
const HERO_VIDEO_WEBM_SRC = "videos/bali-video.webm";
const HERO_POSTER_SRC = "photos/dest-lombok-gili.jpg";

function formatPrice(priceFrom) {
  return typeof priceFrom === "number" ? USD_FORMATTER.format(priceFrom) : "Quote on request";
}

function formatDepartureDate(rawDate) {
  if (!rawDate) return "Flexible dates";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Flexible dates";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatUpdatedDate(rawDate) {
  if (!rawDate) return "Recently updated";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return "Recently updated";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTravelMonth(rawDate) {
  if (!rawDate) return "";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function ServicesPage() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const heroVideoRef = useRef(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [regionFilter, setRegionFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [loadHeroVideo, setLoadHeroVideo] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const seoSchema = useMemo(() => {
    const homeUrl = buildAbsoluteUrl("");
    const pageUrl = buildAbsoluteUrl("platform.html");

    return [
      createTravelAgencySchema(),
      createWebPageSchema({
        url: pageUrl,
        title: SERVICES_TITLE,
        description: SERVICES_DESCRIPTION,
        image: "photos/dest-raja-ampat.jpg",
        pageType: "CollectionPage",
      }),
      createBreadcrumbSchema([
        { name: "Home", url: homeUrl },
        { name: "Trips", url: pageUrl },
      ]),
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#trip-list`,
        name: "Indonesia trip routes",
        numberOfItems: TRIP_OPTIONS.length,
        itemListElement: TRIP_OPTIONS.map((trip, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: trip.title,
          item: buildAbsoluteUrl(buildTripHref(trip.id)),
        })),
      },
    ];
  }, []);

  usePageSeo({
    title: SERVICES_TITLE,
    description: SERVICES_DESCRIPTION,
    path: "platform.html",
    image: "photos/dest-raja-ampat.jpg",
    imageAlt: "Raja Ampat lagoon islands",
    schema: seoSchema,
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const applyViewport = () => setIsMobileViewport(mediaQuery.matches);
    applyViewport();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", applyViewport);
      return () => mediaQuery.removeEventListener("change", applyViewport);
    }
    mediaQuery.addListener(applyViewport);
    return () => mediaQuery.removeListener(applyViewport);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setLoadHeroVideo(false);
      setHeroVideoReady(false);
      return undefined;
    }
    setHeroVideoReady(false);
    if (isMobileViewport) {
      setLoadHeroVideo(false);
      const timer = window.setTimeout(() => setLoadHeroVideo(true), 1200);
      return () => window.clearTimeout(timer);
    }
    setLoadHeroVideo(true);
    return undefined;
  }, [prefersReducedMotion, isMobileViewport]);

  useEffect(() => {
    if (!loadHeroVideo || prefersReducedMotion || !heroVideoRef.current) return;
    heroVideoRef.current.play().catch(() => {});
  }, [loadHeroVideo, prefersReducedMotion]);

  const regions = useMemo(() => Array.from(new Set(TRIP_OPTIONS.map((trip) => trip.region))).sort(), []);
  const styles = useMemo(() => Array.from(new Set(TRIP_OPTIONS.map((trip) => trip.style))).sort(), []);
  const budgets = useMemo(() => Array.from(new Set(TRIP_OPTIONS.map((trip) => trip.budgetTier))).sort(), []);

  const filteredTrips = useMemo(() => {
    const matchesDuration = (trip) => {
      if (durationFilter === "all") return true;
      if (durationFilter === "up-to-7") return trip.durationDays <= 7;
      if (durationFilter === "8-9") return trip.durationDays >= 8 && trip.durationDays <= 9;
      if (durationFilter === "10-plus") return trip.durationDays >= 10;
      return true;
    };

    const trips = TRIP_OPTIONS.filter((trip) => {
      if (onlyAvailable && trip.seatsLeft <= 0) return false;
      if (regionFilter !== "all" && trip.region !== regionFilter) return false;
      if (styleFilter !== "all" && trip.style !== styleFilter) return false;
      if (budgetFilter !== "all" && trip.budgetTier !== budgetFilter) return false;
      if (!matchesDuration(trip)) return false;
      return true;
    });

    const sorted = [...trips];
    if (sortBy === "price-low-high") {
      sorted.sort((a, b) => a.priceFrom - b.priceFrom);
    } else if (sortBy === "departure-soonest") {
      sorted.sort((a, b) => new Date(`${a.nextDeparture}T00:00:00`) - new Date(`${b.nextDeparture}T00:00:00`));
    } else if (sortBy === "duration-short-long") {
      sorted.sort((a, b) => a.durationDays - b.durationDays);
    }
    return sorted;
  }, [onlyAvailable, regionFilter, styleFilter, durationFilter, budgetFilter, sortBy]);

  return (
    <Layout currentPage="trips" renderHeader={false}>
      <section id="overview" className="relative isolate overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 -z-20">
          <OptimizedImage
            src={HERO_POSTER_SRC}
            alt="Island shoreline and clear water"
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="700"
            height="466"
          />
        </div>
        {!prefersReducedMotion && loadHeroVideo ? (
          <div className="absolute inset-0 -z-20">
            <video
              ref={heroVideoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload={isMobileViewport ? "none" : "metadata"}
              onLoadedData={() => setHeroVideoReady(true)}
              onCanPlay={() => setHeroVideoReady(true)}
              style={{ opacity: heroVideoReady ? 1 : 0, transition: "opacity 700ms ease" }}
              aria-hidden="true"
            >
              <source src={HERO_VIDEO_WEBM_SRC} type="video/webm" />
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          </div>
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/70 via-slate-900/55 to-slate-950/80" aria-hidden />
        <div className="relative z-10">
          <SiteHeader currentPage="trips" variant="overlay" />
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 sm:pt-16 lg:pb-14 lg:pt-20">
            <div className="max-w-3xl space-y-6">
              <p className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100 ring-1 ring-white/20">
                Trips & routes
              </p>
              <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Thirteen thousand islands. Pick yours.</h1>
              <p className="text-lg text-slate-100">
                Tell us where you want to go. We handle the boats, permits, and drivers — so nothing falls through between islands.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                  href="#routes"
                >
                  View trips
                </a>
                <AppLink
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                  href={buildContactHref()}
                >
                  Request booking
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="routes" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signature trips</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Every route is a starting point.</h2>
          <p className="max-w-3xl text-slate-600">
            Pick the shape of a trip, then pull it apart. Add days, swap islands, or slow it down. We rebuild the logistics around your changes.
          </p>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <span>Region</span>
              <select
                value={regionFilter}
                onChange={(event) => setRegionFilter(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="all">All regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <span>Style</span>
              <select
                value={styleFilter}
                onChange={(event) => setStyleFilter(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="all">All styles</option>
                {styles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <span>Duration</span>
              <select
                value={durationFilter}
                onChange={(event) => setDurationFilter(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="all">Any length</option>
                <option value="up-to-7">Up to 7 days</option>
                <option value="8-9">8 to 9 days</option>
                <option value="10-plus">10+ days</option>
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <span>Budget</span>
              <select
                value={budgetFilter}
                onChange={(event) => setBudgetFilter(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="all">All budgets</option>
                {budgets.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <span>Sort</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low-high">Price: low to high</option>
                <option value="departure-soonest">Departure: soonest</option>
                <option value="duration-short-long">Duration: short to long</option>
              </select>
            </label>
            <label className="inline-flex min-h-[74px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(event) => setOnlyAvailable(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              Only available trips
            </label>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredTrips.length}</span> of{" "}
            <span className="font-semibold text-slate-900">{TRIP_OPTIONS.length}</span> trips.
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Availability updated {formatUpdatedDate(AVAILABILITY_LAST_UPDATED)}
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTrips.map((trip) => (
            <article key={trip.id} className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="aspect-[4/3]">
                <OptimizedImage
                  src={trip.image}
                  alt={trip.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
                  width="900"
                  height="600"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{trip.duration}</span>
                  <span className="text-right">{trip.region}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-900">From {formatPrice(trip.priceFrom)}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">Next {formatDepartureDate(trip.nextDeparture)}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 ${
                      trip.seatsLeft > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {trip.seatsLeft > 0 ? `${trip.seatsLeft} seats left` : "Sold out"}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{trip.title}</h3>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">{trip.style}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">{trip.budgetTier}</span>
                </div>
                <ul className="flex flex-1 flex-col gap-2 text-sm text-slate-700">
                  {trip.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <AppLink
                    href={buildTripHref(trip.id)}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  >
                    View day-by-day
                  </AppLink>
                  {trip.seatsLeft <= 0 ? (
                    <AppLink
                      href={buildContactHref({
                        tripId: trip.id,
                        tripName: trip.title,
                        nextDeparture: trip.nextDeparture,
                        travelMonth: formatTravelMonth(trip.nextDeparture),
                        source: "trips-page",
                        requestType: "waitlist",
                        topic: `Waitlist: ${trip.title}`,
                      })}
                      className="inline-flex w-full items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    >
                      Join waitlist
                    </AppLink>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
        {!filteredTrips.length ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="text-sm text-slate-700">No trips match these filters yet.</p>
            <button
              type="button"
              onClick={() => {
                setOnlyAvailable(false);
                setRegionFilter("all");
                setStyleFilter("all");
                setDurationFilter("all");
                setBudgetFilter("all");
                setSortBy("recommended");
              }}
              className="mt-3 inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Reset filters
            </button>
          </div>
        ) : null}
      </section>

      <section id="inclusions" className="bg-gradient-to-b from-white via-amber-50/40 to-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800 ring-1 ring-amber-200">
                  Included in every trip
                </div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">You travel. We manage the moving parts.</h2>
                <p className="max-w-3xl text-slate-600">
                Ferries booked with backup options. Drivers confirmed the night before. Guides vetted and briefed. One person responsible for the whole thing.
                </p>
              </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-amber-200/70">
              24/7 Bali-based support - Local partners only - Backups on every leg
            </div>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 md:grid-cols-2">
              {INCLUSIONS.map((item) => (
                <article
                  key={item.title}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-amber-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-white opacity-0 transition group-hover:opacity-100" aria-hidden />
                  <div className="relative space-y-2">
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden />
                      {item.title}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="flex h-full flex-col justify-between rounded-2xl bg-white px-6 py-7 shadow-sm ring-1 ring-amber-200/60">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-700">How we operate</p>
                <h3 className="text-2xl font-semibold leading-tight text-slate-900">One planner before you go. One fixer while you travel.</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Clear ownership, daily check-ins when weather shifts, and proactive moves on ferries, boats, or drivers so your days stay smooth.
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {[
                    "One WhatsApp thread with your planner and fixer",
                    "Night-before updates on weather and ferries",
                    "Backups and vetted local crews on every leg",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 rounded-xl bg-amber-50 p-4 text-center text-sm font-semibold text-amber-800 ring-1 ring-amber-200/70">
                <span className="inline-flex flex-wrap items-center justify-center gap-2">
                  <span>Replies &lt;30min</span>
                  <span aria-hidden>|</span>
                  <span>Plan A/B/C ready</span>
                  <span aria-hidden>|</span>
                  <span>Local vetted crews</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">How planning works</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How a trip comes together.</h2>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {TIMELINE_STEPS.map((step, index) => (
              <li
                key={step.label}
                className="step-card group relative overflow-hidden rounded-2xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-amber-200/80"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-white to-sky-50 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden />
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-500/70 via-amber-400/40 to-sky-400/60 opacity-70" aria-hidden />
                <div className="relative space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-800">
                    <span className="inline-flex h-2 w-2 items-center justify-center rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(251,191,36,0.2)] animate-pulse" aria-hidden />
                    <span>{step.label}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.copy}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-800">
                    <span>Next</span>
                    <span className="h-px w-12 bg-gradient-to-r from-amber-500/50 via-amber-400 to-sky-400" aria-hidden />
                  </div>
                </div>
                <div className="absolute inset-x-4 bottom-3 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-60" aria-hidden />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Social proof</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Numbers from the field.</h2>
            </div>
            <AppLink
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
              href={buildContactHref()}
            >
              Request booking
            </AppLink>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_STATS.map((item) => (
              <article key={item.label} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-semibold text-amber-200">{item.value}</p>
                <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-xs text-slate-200">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-amber-50 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Something different in mind?</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Tell us the rough idea. We'll build around it.</h2>
            <p className="max-w-2xl text-slate-700">
              Bring a date range and a list of islands. We come back with a route, a price, and a plan — nothing locked until you say so.
            </p>
          </div>
          <AppLink
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            href={buildContactHref()}
          >
            Request booking
          </AppLink>
        </div>
        <ul className="mx-auto mt-4 max-w-6xl space-y-1 px-4 text-sm text-amber-900 sm:px-6">
          {BOOKING_CONFIDENCE_POINTS.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-amber-700" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
