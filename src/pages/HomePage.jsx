import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLink from "../components/AppLink";
import Layout from "../components/Layout";
import OptimizedImage from "../components/OptimizedImage";
import SiteHeader from "../components/SiteHeader";
import { CONTACT_ENDPOINT } from "../config";
import { FEATURED_TRIPS } from "../data/featuredTrips";
import { LEGAL_NAV } from "../data/legal";
import { AVAILABILITY_LAST_UPDATED, TESTIMONIALS } from "../data/trust";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import {
  buildAbsoluteUrl,
  createBreadcrumbSchema,
  createTravelAgencySchema,
  createWebPageSchema,
  createWebsiteSchema,
  usePageSeo,
} from "../utils/seo";
import { buildContactHref, buildTripHref, buildWhatsAppHref } from "../utils/urls";

const HOME_TITLE = "Indonesia Private Trips & Custom Island Routes";
const HOME_DESCRIPTION =
  "Surga Indonesia Travel creates private and small-group Indonesia itineraries with custom routes, local coordination, and on-trip support.";
const HERO_VIDEO_SRC = "videos/bali-video.mp4";
const HERO_VIDEO_WEBM_SRC = "videos/bali-video.webm";
const HERO_POSTER_SRC = "photos/gallery-rice-terrace.jpg";
const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatUpdatedDate(rawDate) {
  if (!rawDate) return "Recently updated";
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return "Recently updated";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatPrice(priceFrom) {
  if (typeof priceFrom !== "number") return "Quote on request";
  return USD_FORMATTER.format(priceFrom);
}

function formatDepartureDate(rawDate) {
  if (!rawDate) return "Flexible dates";
  const parsed = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Flexible dates";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAvailability(seatsLeft) {
  if (typeof seatsLeft !== "number" || seatsLeft <= 0) return "Waitlist available";
  return `${seatsLeft} places left`;
}

export default function HomePage() {
  const videoRef = useRef(null);
  const [videoFading, setVideoFading] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(max-width: 767px)").matches;
  });
  const [loadHeroVideo, setLoadHeroVideo] = useState(false);
  const [isConsultationSubmitting, setIsConsultationSubmitting] = useState(false);
  const [consultationFeedback, setConsultationFeedback] = useState({
    status: null,
    message: "Share your preferred destination and we will confirm the next planning step by email.",
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const year = new Date().getFullYear();
  const baliTrip = FEATURED_TRIPS.find((item) => item.id === "bali-nusa-penida") ?? FEATURED_TRIPS[0] ?? null;
  const heroTrip = FEATURED_TRIPS.find((item) => item.id === "sumatra-java-volcano") ?? FEATURED_TRIPS[0] ?? null;
  const marineTrip =
    FEATURED_TRIPS.find((item) => item.id === "raja-ampat-liveaboard") ?? FEATURED_TRIPS[1] ?? FEATURED_TRIPS[0] ?? null;
  const routeInFocus = heroTrip ?? baliTrip ?? marineTrip;
  const featuredTestimonial =
    TESTIMONIALS[0] ??
    {
      quote: "They handled our route changes before we even had time to worry about them.",
      name: "Recent traveler",
      trip: "Indonesia private route",
    };
  const consultationTestimonial =
    TESTIMONIALS[1] ??
    {
      quote: "Everything moved exactly when it needed to, with no guessing on our side.",
      name: "Recent traveler",
      trip: "Indonesia private route",
    };
  const destinationCards = [
    baliTrip
      ? {
          trip: baliTrip,
          eyebrow: "Best for a first Indonesia trip",
          kicker: "Villas, ceremonies, and easy island pacing",
          accent: "Private villas + cultural access",
        }
      : null,
    heroTrip
      ? {
          trip: heroTrip,
          eyebrow: "For travelers who want land movement",
          kicker: "Volcano mornings, trains, and rainforest edges",
          accent: "Java + Sumatra overland flow",
        }
      : null,
    marineTrip
      ? {
          trip: marineTrip,
          eyebrow: "For marine-first travelers",
          kicker: "Remote anchorages and reef-heavy days",
          accent: "Liveaboard planning with actual buffers",
        }
      : null,
  ].filter(Boolean);
  const leadDestination = destinationCards[0] ?? null;
  const secondaryDestinations = destinationCards.slice(1);
  const planningPillars = [
    {
      title: "Start with a route that already flows",
      description:
        "You do not start from a blank page. We begin with a route that already makes sense on the ground, then reshape it around your dates and pace.",
    },
    {
      title: "Check the timing before you commit",
      description:
        "Boat timing, inter-island handoffs, arrival days, and room holds are checked before we call something confirmed.",
    },
    {
      title: "Keep Support Human",
      description:
        "The same team that builds the route is the one you reach if weather shifts or timing changes once you are traveling.",
    },
  ];
  const planningSteps = [
    {
      step: "01",
      title: "Share the route basics",
      description: "Month, traveler count, and the islands you care about most are enough to start.",
    },
    {
      step: "02",
      title: "We verify availability",
      description: "We check availability, route logic, and pricing before asking you to commit.",
    },
    {
      step: "03",
      title: "Approve the final route",
      description: "Once the shape is right, we lock the exact version you approved and move into booking.",
    },
  ];
  const consultationOptions = [
    { value: baliTrip?.id || "bali", label: "Bali & Nusa Tenggara", trip: baliTrip },
    { value: "komodo-flores", label: "Komodo & Flores" },
    { value: marineTrip?.id || "raja-ampat", label: "Raja Ampat & Papua", trip: marineTrip },
    { value: heroTrip?.id || "java-sumatra", label: "Java & Sumatra", trip: heroTrip },
  ];
  const footerColumns = [
    {
      title: "Explore",
      links: [
        { label: "Featured routes", href: "#destinations" },
        { label: "Full destinations page", href: "/platform.html" },
        { label: "Luxury route planning", href: buildContactHref({ source: "home-footer", topic: "Luxury route planning" }) },
      ],
    },
    {
      title: "Planning",
      links: [
        { label: "Start consultation", href: "#consultation" },
        { label: "WhatsApp desk", href: buildWhatsAppHref("Hello, I would like help planning an Indonesia trip.") },
        { label: "Booking support", href: buildContactHref({ source: "home-footer", topic: "Booking support" }) },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Privacy Policy", href: LEGAL_NAV.find((item) => item.label === "Privacy")?.href ?? "/privacy.html" },
        { label: "Terms of Service", href: LEGAL_NAV.find((item) => item.label === "Terms")?.href ?? "/terms.html" },
        { label: "Partner with us", href: buildContactHref({ source: "home-footer", topic: "Partner with Us" }) },
      ],
    },
  ];
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

  const handleConsultationSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const destinationId = String(data.get("destination") || "").trim();
    const destinationOption =
      consultationOptions.find((option) => option.value === destinationId) ?? consultationOptions[0];
    const destinationTrip = destinationOption?.trip ?? null;

    if (!name || !email) {
      setConsultationFeedback({
        status: "error",
        message: "Add your name and email so we can reply with availability and next steps.",
      });
      return;
    }

    if (!CONTACT_ENDPOINT) {
      setConsultationFeedback({
        status: "error",
        message: "Planning form is not configured right now. Use the contact page or WhatsApp instead.",
      });
      return;
    }

    setIsConsultationSubmitting(true);

    try {
      const payload = {
        name,
        email,
        phone: "",
        travelMonth: "",
        travelers: "",
        topic: `Consultation request: ${destinationOption?.label ?? "Indonesia route"}`,
        message: `I would like a consultation for ${destinationOption?.label ?? "an Indonesia route"}.`,
        tripId: destinationTrip?.id || "",
        tripName: destinationTrip?.title || destinationOption?.label || "",
        departureDate: destinationTrip?.nextDeparture || "",
        requestType: "consultation",
        source: "home-consultation-form",
      };

      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setConsultationFeedback({
        status: "success",
        message: "Consultation request received. A planner will reply with live availability and routing options.",
      });
      form.reset();
    } catch (error) {
      setConsultationFeedback({
        status: "error",
        message: "We could not send the request right now. Use the contact page or WhatsApp to reach us directly.",
      });
    } finally {
      setIsConsultationSubmitting(false);
    }
  };

  return (
    <Layout currentPage="home" renderHeader={false} renderFooter={false}>
      <section id="hero" className="relative isolate overflow-hidden bg-[#0d0d0b] text-white">
        <div className="absolute inset-0 -z-20">
          <OptimizedImage
            src={HERO_POSTER_SRC}
            alt="Sunrise on an Indonesian coastline"
            className="h-full w-full scale-105 object-cover"
            loading="eager"
            fetchPriority="high"
            width="1600"
            height="1066"
          />
        </div>
        {!prefersReducedMotion && loadHeroVideo ? (
          <div className="absolute inset-0 -z-20">
            <video
              ref={videoRef}
              className="h-full w-full scale-105 object-cover"
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
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/35 to-[#09090b]/95" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#09090b] to-transparent" aria-hidden />
        <div
          className="absolute right-[-12rem] top-24 -z-10 h-80 w-80 rounded-full bg-[#ffdcc3]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute left-[-8rem] top-40 -z-10 h-64 w-64 rounded-full bg-[#cee5ff]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <SiteHeader
            currentPage="home"
            variant="editorial"
            ctaHref="#consultation"
            ctaLabel="Start planning"
            showCta={false}
            brandSubtitle={null}
          />
          <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:px-8 lg:pb-24">
            <div className="flex flex-col justify-center py-8 lg:py-14">
              <span className="font-editorial-label mb-6 block text-xs uppercase tracking-[0.34em] text-white/80">
                Private routes through the archipelago
              </span>
              <h1 className="font-editorial-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.04em] text-white sm:text-7xl lg:text-[5.7rem]">
                Journeys built for
                <br />
                <span className="font-editorial-serif italic normal-case tracking-tight text-[#ffdcc3]">
                  how Indonesia actually moves
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl sm:leading-9">
                The route is the product. We build Indonesia trips around real transfer timing, island pacing, and
                live availability, then stay close once you are traveling.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <AppLink
                  href="#consultation"
                  className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-[#ffdcc3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                >
                  Start planning
                  <span className="material-symbols-outlined text-lg" aria-hidden="true">
                    north_east
                  </span>
                </AppLink>
                <AppLink
                  href="#destinations"
                  className="inline-flex items-center justify-center border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                >
                  Explore destinations
                </AppLink>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/78">
                <span className="border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">Private departures</span>
                <span className="border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">Real route timing</span>
                <span className="border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">Planner-led support</span>
              </div>

            </div>

            <div className="grid content-end gap-5 pb-4 lg:pb-10">
              {routeInFocus ? (
                <AppLink
                  href={buildTripHref(routeInFocus.id)}
                  className="group overflow-hidden border border-white/10 bg-white/[0.08] backdrop-blur-sm transition hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <OptimizedImage
                      src={routeInFocus.image}
                      alt={routeInFocus.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
                      width="1200"
                      height="900"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="font-editorial-label text-[10px] uppercase tracking-[0.26em] text-white/65">
                        Route in focus
                      </p>
                      <h2 className="font-editorial-display mt-3 text-3xl font-bold leading-tight text-white">
                        {routeInFocus.title}
                      </h2>
                      <p className="mt-3 max-w-md text-sm leading-7 text-white/72">{routeInFocus.summary}</p>
                      <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.22em]">
                        <span className="bg-white px-3 py-2 text-black">{routeInFocus.duration}</span>
                        <span className="border border-white/20 bg-white/10 px-3 py-2 text-white">
                          Next {formatDepartureDate(routeInFocus.nextDeparture)}
                        </span>
                        <span className="border border-white/20 bg-white/10 px-3 py-2 text-white">
                          From {formatPrice(routeInFocus.priceFrom)}
                        </span>
                      </div>
                    </div>
                  </div>
                </AppLink>
              ) : null}

            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#faf8ff] text-[#131b2e]">
        <section id="trust" className="relative overflow-hidden bg-[#101826] py-24 text-white">
          <div
            className="absolute inset-y-0 left-[-10rem] w-80 rounded-full bg-[#ffdcc3]/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-[-8rem] right-[-10rem] h-80 w-80 rounded-full bg-[#cee5ff]/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="border-t-2 border-[#ffdcc3] pt-8">
              <p className="font-editorial-label text-[10px] uppercase tracking-[0.3em] text-white/60">
                Why travelers trust us
              </p>
              <h2 className="font-editorial-display mt-4 text-4xl font-bold text-white sm:text-5xl">
                Planning strong enough for real travel days
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                The headline experience matters, but so do the invisible pieces underneath it: transfer timing, weather
                buffers, and a team that can still fix the route when conditions shift.
              </p>

              <article className="mt-8 border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="font-editorial-serif text-2xl italic leading-9 text-white">
                  "{featuredTestimonial.quote}"
                </p>
                <div className="mt-6 flex flex-col gap-2 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-white">{featuredTestimonial.name}</span>
                  <span className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-white/50">
                    {featuredTestimonial.trip}
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="destinations" className="bg-[#f5efe4] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-b-2 border-black pb-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <span className="font-editorial-label block text-[10px] uppercase tracking-[0.3em] text-[#8d4b00]">
                    Featured destinations
                  </span>
                  <h2 className="font-editorial-display mt-3 text-4xl font-bold text-[#131b2e] sm:text-5xl">
                    Same planning logic, three very different route moods
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    The destinations page already does the heavier browse-and-filter job. Here, the goal is clearer:
                    show the kind of route logic we build and the range it can cover.
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Availability updated {formatUpdatedDate(AVAILABILITY_LAST_UPDATED)}
                  </p>
                </div>

                <AppLink
                  href="/platform.html"
                  className="inline-flex items-center justify-center border-2 border-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  View all destinations
                </AppLink>
              </div>
            </div>

            {leadDestination ? (
              <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <AppLink
                  href={buildTripHref(leadDestination.trip.id)}
                  className="group overflow-hidden border border-black/10 bg-[#131b2e] text-white transition duration-300 hover:shadow-[0_24px_60px_rgba(19,27,46,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  <div className="grid h-full lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative min-h-[360px] overflow-hidden">
                      <OptimizedImage
                        src={leadDestination.trip.image}
                        alt={leadDestination.trip.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        loading="lazy"
                        fetchPriority="low"
                        decoding="async"
                        width="1200"
                        height="900"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                    </div>

                    <div className="flex flex-col justify-between gap-6 p-8">
                      <div>
                        <p className="font-editorial-label text-[10px] uppercase tracking-[0.28em] text-[#ffdcc3]">
                          {leadDestination.eyebrow}
                        </p>
                        <h3 className="font-editorial-display mt-4 text-4xl font-bold leading-tight text-white">
                          {leadDestination.trip.title}
                        </h3>
                        <p className="mt-4 text-base leading-8 text-white/78">{leadDestination.kicker}</p>
                        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-white/55">
                          {leadDestination.accent}
                        </p>
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
                          <span className="bg-white px-3 py-2 text-black">{leadDestination.trip.duration}</span>
                          <span className="bg-white/10 px-3 py-2 text-white">{leadDestination.trip.region}</span>
                          <span className="bg-white/10 px-3 py-2 text-white">{leadDestination.trip.style}</span>
                        </div>
                        <p className="mt-6 text-sm leading-7 text-white/72">{leadDestination.trip.summary}</p>
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                          <div>
                            <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-white/50">
                              Starting from
                            </p>
                            <p className="mt-2 font-editorial-serif text-3xl font-bold text-white">
                              {formatPrice(leadDestination.trip.priceFrom)}
                            </p>
                          </div>
                          <div className="text-right text-sm text-white/72">
                            <p>Next departure {formatDepartureDate(leadDestination.trip.nextDeparture)}</p>
                            <p>{formatAvailability(leadDestination.trip.seatsLeft)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AppLink>

                <div className="grid gap-6">
                  {secondaryDestinations.map((card) => (
                    <AppLink
                      key={card.trip.id}
                      href={buildTripHref(card.trip.id)}
                      className="group overflow-hidden border border-black/15 bg-[#fcfaf5] transition duration-300 hover:shadow-[0_18px_40px_rgba(19,27,46,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500"
                    >
                      <div className="grid sm:grid-cols-[0.95fr_1.05fr]">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <OptimizedImage
                            src={card.trip.image}
                            alt={card.trip.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            loading="lazy"
                            fetchPriority="low"
                            decoding="async"
                            width="900"
                            height="675"
                          />
                        </div>

                        <div className="flex flex-col justify-between gap-5 p-6">
                          <div>
                            <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-[#8d4b00]">
                              {card.eyebrow}
                            </p>
                            <h3 className="font-editorial-display mt-3 text-2xl font-bold text-[#131b2e]">
                              {card.trip.title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">{card.kicker}</p>
                          </div>

                          <div>
                            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                              <span className="bg-white px-3 py-2">{card.trip.duration}</span>
                              <span className="bg-white px-3 py-2">{card.trip.region}</span>
                            </div>
                            <div className="mt-5 flex items-end justify-between gap-4">
                              <div>
                                <p className="text-lg font-bold text-[#8d4b00]">{formatPrice(card.trip.priceFrom)}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                                  {formatAvailability(card.trip.seatsLeft)}
                                </p>
                              </div>
                              <span className="material-symbols-outlined text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-[#8d4b00]">
                                arrow_right_alt
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AppLink>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {planningPillars.map((item) => (
                <article key={item.title} className="border border-black/20 bg-[#fcfaf5] p-6">
                  <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    Planning principle
                  </p>
                  <h3 className="mt-3 font-editorial-serif text-2xl font-bold text-[#131b2e]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="consultation" className="overflow-hidden bg-[#f5efe4] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t-2 border-black bg-[#fcfaf5] p-6 sm:p-10 lg:p-14">
              <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-8">
                  <div>
                    <span className="font-editorial-label block text-[10px] uppercase tracking-[0.3em] text-[#8d4b00]">
                      Start the conversation
                    </span>
                    <h2 className="font-editorial-display mt-4 text-4xl font-bold leading-tight text-[#131b2e] sm:text-5xl">
                      Start with the route you want,
                      <br />
                      <span className="font-editorial-serif italic text-[#8d4b00]">we map the version that works</span>
                    </h2>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                      Share your month, group size, and the islands you care about most. We come back with route
                      logic, live availability, and next steps built around how you actually want to move.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {planningSteps.map((item) => (
                      <article key={item.step} className="border border-[#d8e5e0] bg-white p-5">
                        <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-slate-500">
                          Step {item.step}
                        </p>
                        <h3 className="mt-3 font-editorial-serif text-lg font-bold leading-tight text-[#131b2e]">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                      </article>
                    ))}
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <article className="border border-[#d8e5e0] bg-white p-6">
                      <p className="font-editorial-label text-[10px] uppercase tracking-[0.22em] text-[#8d4b00]">
                        Traveler note
                      </p>
                      <p className="mt-3 font-editorial-serif text-2xl italic leading-9 text-[#131b2e]">
                        "{consultationTestimonial.quote}"
                      </p>
                      <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-semibold text-[#131b2e]">{consultationTestimonial.name}</span>
                        <span className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-slate-400">
                          {consultationTestimonial.trip}
                        </span>
                      </div>
                    </article>

                    <div className="border border-[#d8e5e0] bg-[#eaf3ef] p-6">
                      <p className="font-editorial-label text-[10px] uppercase tracking-[0.22em] text-[#8d4b00]">
                        Prefer WhatsApp first?
                      </p>
                      <p className="mt-3 font-editorial-serif text-2xl font-bold leading-tight text-[#131b2e]">
                        Ask quick route questions
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        Use WhatsApp for timing checks, routing questions, and follow-up once the first plan is in motion.
                      </p>
                      <a
                        className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d4b00] transition hover:text-black"
                        href={buildWhatsAppHref("Hello, I would like help planning an Indonesia trip.")}
                      >
                        Message on WhatsApp
                        <span className="material-symbols-outlined text-base" aria-hidden="true">
                          call_made
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border border-[#d1dfda] bg-[#14343a] p-8 text-white shadow-[0_24px_60px_rgba(20,52,58,0.14)] md:p-10">
                    <p className="font-editorial-label text-[10px] uppercase tracking-[0.28em] text-[#ffdcc3]">
                      Consultation form
                    </p>
                    <h3 className="mt-3 font-editorial-display text-3xl font-bold text-white">Start planning</h3>
                    <p className="mt-3 max-w-lg text-sm leading-7 text-white/70">
                      Send the rough route idea first. Availability and exact pricing get confirmed before anything is locked.
                    </p>

                    <form className="mt-8 space-y-4" onSubmit={handleConsultationSubmit} noValidate style={{ colorScheme: "light" }}>
                      <label className="block">
                        <span className="font-editorial-label mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">
                          Full name
                        </span>
                        <input
                          name="name"
                          type="text"
                          placeholder="Alexander Graham"
                          className="w-full border border-transparent bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ffdcc3] focus:outline-none focus:ring-2 focus:ring-[#ffdcc3]/20"
                          required
                        />
                      </label>
                      <label className="block">
                        <span className="font-editorial-label mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">
                          Email address
                        </span>
                        <input
                          name="email"
                          type="email"
                          placeholder="alex@concierge.com"
                          className="w-full border border-transparent bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#ffdcc3] focus:outline-none focus:ring-2 focus:ring-[#ffdcc3]/20"
                          required
                        />
                      </label>
                      <label className="block">
                        <span className="font-editorial-label mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">
                          Preferred destination
                        </span>
                        <select
                          name="destination"
                          defaultValue={consultationOptions[0]?.value || ""}
                          className="w-full appearance-none border border-transparent bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#ffdcc3] focus:outline-none focus:ring-2 focus:ring-[#ffdcc3]/20"
                        >
                          {consultationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        className="mt-3 inline-flex w-full items-center justify-center bg-[#8d4b00] py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#b15f00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3] disabled:cursor-not-allowed disabled:opacity-70"
                        type="submit"
                        disabled={isConsultationSubmitting}
                      >
                        {isConsultationSubmitting ? "Sending details..." : "Send details"}
                      </button>
                      <p
                        className={`text-sm ${
                          consultationFeedback.status === "success"
                            ? "text-emerald-300"
                            : consultationFeedback.status === "error"
                              ? "text-[#ffb4ab]"
                              : "text-white/65"
                        }`}
                        role="status"
                        aria-live="polite"
                      >
                        {consultationFeedback.message}
                      </p>
                    </form>

                    <div className="mt-8 border-t border-white/10 pt-6 text-sm leading-7 text-white/60">
                      Need a faster back-and-forth? Use WhatsApp for the first route conversation, then we can move the final details into email.
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#131b2e] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
              <div className="max-w-md">
                <p className="font-editorial-serif text-3xl font-bold tracking-tight text-[#ffdcc3]">Surga Indonesia Travel</p>
                <p className="mt-5 text-sm leading-7 text-white/65">
                  Private Indonesia routes with practical planning underneath them. Less brochure language, more route logic that actually survives the trip.
                </p>
                <div className="mt-6 flex gap-4 text-white/55">
                  <a
                    className="transition hover:text-white"
                    href={buildWhatsAppHref("Hello, I would like to plan an Indonesia trip.")}
                    aria-label="WhatsApp"
                  >
                    <span className="material-symbols-outlined">public</span>
                  </a>
                  <a className="transition hover:text-white" href="/platform.html" aria-label="Destinations">
                    <span className="material-symbols-outlined">explore</span>
                  </a>
                  <a className="transition hover:text-white" href="mailto:hello@surgaindonesia.travel" aria-label="Email">
                    <span className="material-symbols-outlined">mail</span>
                  </a>
                </div>
              </div>

              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h3 className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                    {column.title}
                  </h3>
                  <ul className="mt-5 space-y-4 text-sm text-white/65">
                    {column.links.map((link) => (
                      <li key={`${column.title}-${link.label}`}>
                        <AppLink className="transition hover:text-[#ffdcc3]" href={link.href}>
                          {link.label}
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 text-xs uppercase tracking-[0.18em] text-white/35 md:flex-row md:items-center md:justify-between">
              <span>(c) {year} Surga Indonesia Travel. All rights reserved.</span>
              <div className="flex gap-6 text-white/25">
                <span className="material-symbols-outlined text-lg">verified</span>
                <span className="material-symbols-outlined text-lg">travel_explore</span>
                <span className="material-symbols-outlined text-lg">shield</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
