import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLink from "../components/AppLink";
import Layout from "../components/Layout";
import OptimizedImage from "../components/OptimizedImage";
import SiteHeader from "../components/SiteHeader";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { HOLIDAY_GALLERY } from "../data/home";
import { FEATURED_TRIPS } from "../data/featuredTrips";
import { AVAILABILITY_LAST_UPDATED, TESTIMONIALS, TRUST_STATS } from "../data/trust";
import {
  buildAbsoluteUrl,
  createBreadcrumbSchema,
  createTravelAgencySchema,
  createWebPageSchema,
  createWebsiteSchema,
  usePageSeo,
} from "../utils/seo";
import { buildContactHref, buildTripHref } from "../utils/urls";

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const HOME_TITLE = "Indonesia Private Trips & Custom Island Routes";
const HOME_DESCRIPTION =
  "Surga Indonesia Travel creates private and small-group Indonesia itineraries with custom routes, local coordination, and on-trip support.";
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

export default function HomePage() {
  const videoRef = useRef(null);
  const galleryRef = useRef(null);
  const [videoFading, setVideoFading] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(max-width: 767px)").matches;
  });
  const [loadHeroVideo, setLoadHeroVideo] = useState(false);
  const [enableGalleryVideo, setEnableGalleryVideo] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const featuredTrips = isMobileViewport ? FEATURED_TRIPS.slice(0, 2) : FEATURED_TRIPS;
  const seoSchema = useMemo(() => {
    const pageUrl = buildAbsoluteUrl("");
    return [
      createTravelAgencySchema(),
      createWebsiteSchema(),
      createWebPageSchema({
        url: pageUrl,
        title: HOME_TITLE,
        description: HOME_DESCRIPTION,
        image: HERO_POSTER_SRC,
      }),
      createBreadcrumbSchema([{ name: "Home", url: pageUrl }]),
    ];
  }, []);

  usePageSeo({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: "",
    image: HERO_POSTER_SRC,
    imageAlt: "Sunrise above Indonesian islands",
    schema: seoSchema,
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);
    syncViewport();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }
    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isMobileViewport) {
      setLoadHeroVideo(false);
      setVideoFading(false);
      return undefined;
    }
    setVideoFading(true);
    const timer = window.setTimeout(() => setLoadHeroVideo(true), 250);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion, isMobileViewport]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (prefersReducedMotion || !loadHeroVideo) {
      videoEl.pause();
      return;
    }
    videoEl.play().catch(() => {});
  }, [loadHeroVideo, prefersReducedMotion]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || prefersReducedMotion || !loadHeroVideo) return undefined;

    const handleLoadedMetadata = () => {
      setVideoFading(false);
    };

    const handlePlay = () => setVideoFading(false);

    const handleTimeUpdate = () => {
      if (!videoEl.duration) return;
      const remaining = videoEl.duration - videoEl.currentTime;
      setVideoFading(remaining <= 1.2);
    };

    videoEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoEl.addEventListener("play", handlePlay);
    videoEl.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoEl.removeEventListener("play", handlePlay);
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [loadHeroVideo, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || isMobileViewport) {
      setEnableGalleryVideo(false);
      return undefined;
    }
    const target = galleryRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setEnableGalleryVideo(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEnableGalleryVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [isMobileViewport, prefersReducedMotion]);

  return (
    <Layout currentPage="home" renderHeader={false}>
      <section id="hero" className="relative isolate min-h-[72vh] overflow-hidden bg-slate-900 lg:min-h-0">
        {!isMobileViewport ? (
          <div className="absolute inset-0 -z-20">
            <OptimizedImage
              src={HERO_POSTER_SRC}
              alt="Sunrise on an Indonesian cliffside"
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
              width="700"
              height="466"
            />
          </div>
        ) : null}
        {!prefersReducedMotion && loadHeroVideo ? (
          <div className="absolute inset-0 -z-20">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              style={{ opacity: videoFading ? 0 : 1, transition: "opacity 700ms ease" }}
              aria-hidden="true"
            >
              <source src={HERO_VIDEO_WEBM_SRC} type="video/webm" />
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          </div>
        ) : null}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.55) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <SiteHeader currentPage="home" variant="overlay" />
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-20 sm:px-6 sm:pt-24 lg:flex-row lg:items-center lg:pb-24 lg:pt-28">
            <div className="flex-1 space-y-6 text-white">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight">The islands are waiting.</h1>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 opacity-80" aria-hidden />
      </section>

      <div className="bg-[#F7F2E7]">
        <section id="recommendations" className="py-12">
          <div className="mx-auto max-w-6xl px-4 space-y-8 sm:px-6">
            <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-lg ring-1 ring-amber-100/80 sm:p-8">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Handpicked routes</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Routes worth rearranging your year for.</h2>
                <p className="mt-2 text-sm text-slate-500">Availability updated {formatUpdatedDate(AVAILABILITY_LAST_UPDATED)}</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredTrips.map((item) => (
                  <AppLink
                    key={item.id}
                    href={buildTripHref(item.id)}
                    className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    aria-label={`View itinerary for ${item.title}`}
                  >
                    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-amber-100 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-amber-200/70 group-hover:ring-amber-300">
                      <div className="relative aspect-[4/3] bg-cover bg-center" role="img" aria-label={item.title}>
                        <OptimizedImage
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          fetchPriority="low"
                          decoding="async"
                          width="900"
                          height="600"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-60 transition group-hover:opacity-80" aria-hidden />
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-[0.18em] text-amber-800">{item.style}</p>
                          <p className="text-lg font-semibold">{item.title}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-amber-700/90">
                          <span>{item.duration}</span>
                          <span className="text-right">{item.region}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold">
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-900">From {formatPrice(item.priceFrom)}</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">Next {formatDepartureDate(item.nextDeparture)}</span>
                          <span
                            className={`rounded-full px-2.5 py-1 ${
                              item.seatsLeft > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {item.seatsLeft > 0 ? `${item.seatsLeft} seats left` : "Sold out"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{item.summary}</p>
                      </div>
                    </article>
                  </AppLink>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg ring-1 ring-slate-800 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Who travels with us</p>
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Every detail handled before you land.</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {TRUST_STATS.map((item) => (
                      <article key={item.label} className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
                        <p className="text-2xl font-semibold text-amber-200">{item.value}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
                        <p className="mt-1 text-xs text-slate-200">{item.note}</p>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {TESTIMONIALS.map((item) => (
                    <article key={item.name} className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
                      <p className="text-sm text-slate-100">"{item.quote}"</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-amber-200">{item.name}</p>
                      <p className="text-xs text-slate-200">{item.trip}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">What's included</p>
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Indonesia, done properly.</h2>
                  <p className="text-slate-600">
                    Boats leave on time. Guides know the back roads. You show up and the day is already arranged from the morning coffee to the ferry that gets you there before the light drops.
                  </p>
                  <div className="flex flex-col gap-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-600" aria-hidden />
                      Island-hopping routes timed around tides and ferries, not guesswork.
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-600" aria-hidden />
                      Private boats, summit hikes, and reef dives booked ahead of arrival.
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-600" aria-hidden />
                      One WhatsApp line to your planner from first inquiry to last transfer.
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <AppLink
                      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                      href={buildContactHref()}
                    >
                      Request booking
                    </AppLink>
                    <a
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                      href="#recommendations"
                    >
                      Browse routes
                    </a>
                  </div>
                </div>
                <div ref={galleryRef} className="grid gap-4 sm:grid-cols-2">
                  {HOLIDAY_GALLERY.map((item, index) => (
                    <div key={item.src} className={`overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200 ${index === 0 ? "sm:col-span-2" : ""}`}>
                      {item.type === "video" && enableGalleryVideo && !prefersReducedMotion && !isMobileViewport ? (
                        <video
                          className="h-full w-full object-cover"
                          autoPlay
                          loop
                          muted
                          controls={false}
                          playsInline
                          preload="none"
                          poster={item.poster}
                        >
                          {item.webm ? <source src={item.webm} type="video/webm" /> : null}
                          <source src={item.src} type="video/mp4" />
                        </video>
                      ) : (
                        <OptimizedImage
                          src={item.type === "video" ? item.poster : item.src}
                          alt={item.alt}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          fetchPriority="low"
                          decoding="async"
                          width="1080"
                          height="810"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
