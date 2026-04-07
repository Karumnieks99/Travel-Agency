import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLink from "../components/AppLink";
import EditorialFooter from "../components/EditorialFooter";
import Layout from "../components/Layout";
import OptimizedImage from "../components/OptimizedImage";
import SiteHeader from "../components/SiteHeader";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { TRIP_OPTIONS } from "../data/trips";
import { AVAILABILITY_LAST_UPDATED } from "../data/trust";
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

const SERVICES_TITLE = "Indonesia Destinations, Island Routes & Departure Dates";
const SERVICES_DESCRIPTION =
  "Browse Indonesia destination routes with day-by-day plans, pricing, departure dates, and booking support from Surga Indonesia Travel.";
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
        { name: "Destinations", url: pageUrl },
      ]),
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#destination-list`,
        name: "Indonesia destination routes",
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
  const availableDestinations = useMemo(() => TRIP_OPTIONS.filter((trip) => trip.seatsLeft > 0).length, []);

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
    <Layout currentPage="trips" renderHeader={false} renderFooter={false}>
      <div className="bg-[#faf8ff] text-[#131b2e]">
        <section className="relative isolate overflow-hidden bg-[#0d0d0b] text-white">
          <div className="absolute inset-0 -z-20">
            <OptimizedImage
              src={HERO_POSTER_SRC}
              alt="Island shoreline and clear water"
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1600"
              height="1066"
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
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/45 to-black/80" aria-hidden />

          <div className="relative z-10">
            <SiteHeader
              currentPage="trips"
              variant="editorial"
              ctaHref={buildContactHref({ source: "destinations-header", topic: "Start planning" })}
              ctaLabel="Start planning"
              showCta={false}
              brandSubtitle={null}
            />

            <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
              <div className="max-w-4xl">
                <p className="font-editorial-label text-xs uppercase tracking-[0.34em] text-white/80">Curated destinations</p>
                <h1 className="font-editorial-display mt-6 text-5xl font-bold uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl lg:text-[5.4rem]">
                  Routes Built For
                  <br />
                  <span className="font-editorial-serif italic normal-case tracking-tight">real Indonesia travel</span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl sm:leading-9">
                  Every route here is a working starting point with actual pacing, actual boat timing, and room to reshape the islands around your dates and budget.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <AppLink
                    href="#destinations-grid"
                    className="inline-flex items-center justify-center bg-black px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Explore destinations
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
            <div>
              <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-slate-500">Published routes</p>
              <p className="font-editorial-serif mt-2 text-3xl font-bold text-[#131b2e]">{TRIP_OPTIONS.length}</p>
            </div>
            <div>
              <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-slate-500">Open departures</p>
              <p className="font-editorial-serif mt-2 text-3xl font-bold text-[#131b2e]">{availableDestinations}</p>
            </div>
            <div>
              <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-slate-500">Regions covered</p>
              <p className="font-editorial-serif mt-2 text-3xl font-bold text-[#131b2e]">{regions.length}</p>
            </div>
            <div>
              <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-slate-500">Availability refreshed</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#131b2e]">
                {formatUpdatedDate(AVAILABILITY_LAST_UPDATED)}
              </p>
            </div>
          </div>
        </section>

        <section id="destinations-grid" className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-b-2 border-black pb-8">
              <p className="font-editorial-label text-[10px] uppercase tracking-[0.3em] text-[#8d4b00]">Signature departures</p>
              <div className="mt-4 max-w-3xl">
                  <h2 className="font-editorial-display text-4xl font-bold text-[#131b2e] sm:text-5xl">Destinations with structure already built in</h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    Filter by region, pace, or budget tier, then start from the route that feels closest. From there, we adjust nights, crossings, and stays around your version of the trip.
                  </p>
              </div>
            </div>

            <div className="mt-10 border border-black/10 bg-white p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  <span>Region</span>
                  <select
                    value={regionFilter}
                    onChange={(event) => setRegionFilter(event.target.value)}
                    className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="all">All regions</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  <span>Style</span>
                  <select
                    value={styleFilter}
                    onChange={(event) => setStyleFilter(event.target.value)}
                    className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="all">All styles</option>
                    {styles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  <span>Duration</span>
                  <select
                    value={durationFilter}
                    onChange={(event) => setDurationFilter(event.target.value)}
                    className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="all">Any length</option>
                    <option value="up-to-7">Up to 7 days</option>
                    <option value="8-9">8 to 9 days</option>
                    <option value="10-plus">10+ days</option>
                  </select>
                </label>
                <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  <span>Budget</span>
                  <select
                    value={budgetFilter}
                    onChange={(event) => setBudgetFilter(event.target.value)}
                    className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="all">All budgets</option>
                    {budgets.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  <span>Sort</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="mt-2 w-full border border-slate-200 bg-white px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low-high">Price: low to high</option>
                    <option value="departure-soonest">Departure: soonest</option>
                    <option value="duration-short-long">Duration: short to long</option>
                  </select>
                </label>
                <label className="flex min-h-[78px] items-center gap-3 border border-slate-200 bg-[#faf8ff] px-4 py-3 text-sm font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(event) => setOnlyAvailable(event.target.checked)}
                    className="h-4 w-4 border-slate-300 text-black focus:ring-black"
                  />
                  Only available destinations
                </label>
              </div>

              <div className="mt-4 flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing <span className="font-semibold text-slate-900">{filteredTrips.length}</span> of{" "}
                  <span className="font-semibold text-slate-900">{TRIP_OPTIONS.length}</span> destinations.
                </p>
                <p className="font-editorial-label text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Availability updated {formatUpdatedDate(AVAILABILITY_LAST_UPDATED)}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredTrips.map((trip) => (
                <article key={trip.id} className="flex h-full flex-col border border-black/10 bg-white">
                  <div className="aspect-[4/3] overflow-hidden">
                    <OptimizedImage
                      src={trip.image}
                      alt={trip.title}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
                      width="900"
                      height="600"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                      <span>{trip.duration}</span>
                      <span>{trip.region}</span>
                    </div>
                    <h3 className="font-editorial-display mt-4 text-2xl font-bold text-[#131b2e]">{trip.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{trip.summary}</p>

                    <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
                      <span className="bg-[#ffdcc3] px-3 py-1 text-[#6e3900]">From {formatPrice(trip.priceFrom)}</span>
                      <span className="bg-slate-100 px-3 py-1 text-slate-700">Next {formatDepartureDate(trip.nextDeparture)}</span>
                      <span className={`px-3 py-1 ${trip.seatsLeft > 0 ? "bg-[#cee5ff] text-[#004a75]" : "bg-[#ffdad6] text-[#93000a]"}`}>
                        {trip.seatsLeft > 0 ? `${trip.seatsLeft} seats left` : "Waitlist"}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">
                      <span className="bg-slate-100 px-3 py-1">{trip.style}</span>
                      <span className="bg-slate-100 px-3 py-1">{trip.budgetTier}</span>
                    </div>

                    <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm leading-7 text-slate-700">
                      {trip.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-[10px] h-1.5 w-1.5 bg-[#8d4b00]" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 space-y-3">
                      <AppLink
                        href={buildTripHref(trip.id)}
                        className="inline-flex w-full items-center justify-center bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
                            source: "destinations-page",
                            requestType: "waitlist",
                            topic: `Waitlist: ${trip.title}`,
                          })}
                          className="inline-flex w-full items-center justify-center border border-[#8d4b00] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#8d4b00] transition hover:bg-[#8d4b00] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3]"
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
              <div className="mt-8 border border-dashed border-black/20 bg-white p-8 text-center">
                <p className="text-sm text-slate-700">No destinations match these filters yet.</p>
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
                  className="mt-4 inline-flex items-center justify-center border border-black px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Reset filters
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="bg-[#faf8ff] py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t-2 border-black bg-white p-10 md:p-14">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="font-editorial-label text-[10px] uppercase tracking-[0.3em] text-[#8d4b00]">Custom route desk</p>
                  <h2 className="font-editorial-display mt-4 text-4xl font-bold text-[#131b2e] sm:text-5xl">Need a route that starts here but does not end here?</h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    Send your month, group size, and the islands you care about most. We will reshape the route, confirm what is actually available, and come back with a version that fits your timing.
                  </p>
                </div>

                <div className="w-full max-w-sm">
                  <AppLink
                    href={buildContactHref({ source: "destinations-cta", topic: "Route planning conversation" })}
                    className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Talk through your route
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EditorialFooter conciergeTopic="Concierge: Destinations" />
      </div>
    </Layout>
  );
}
