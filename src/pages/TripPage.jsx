import React, { useEffect, useMemo, useRef, useState } from "react";
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
import {
  LEGAL_PATHS,
  TRIPS_PATH,
  buildContactHref,
  buildWhatsAppHref,
} from "../utils/urls";

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const TRIP_EDITORIAL_META = {
  "bali-nusa-penida": {
    eyebrow: "Expedition / Bali Archipelago",
    headline: "BALI + NUSA PENIDA: THE SPIRIT OF THE ARCHIPELAGO",
    mediaPool: ["photos/dest-besakih-bali.jpg", "photos/gallery-rice-terrace.jpg"],
    bookingFeatures: [
      { icon: "bed", label: "Curated villa stays" },
      { icon: "verified", label: "Private local guiding" },
      { icon: "map", label: "Fast-boat logistics handled" },
      { icon: "policy", label: "Flexible planning flow" },
    ],
  },
  "sumatra-java-volcano": {
    eyebrow: "Expedition / Sumatra + Java",
    headline: "SUMATRA + JAVA: VOLCANO SUNRISES & RAINFOREST TRACKS",
    mediaPool: ["photos/gallery-rice-terrace.jpg", "photos/dest-sumatra-java.jpg"],
    bookingFeatures: [
      { icon: "forest", label: "Wildlife-first pacing" },
      { icon: "hiking", label: "Sunrise trek planning" },
      { icon: "flight", label: "Domestic flight coordination" },
      { icon: "policy", label: "Weather-aware route edits" },
    ],
  },
  "raja-ampat-liveaboard": {
    eyebrow: "Expedition / West Papua",
    headline: "RAJA AMPAT: A LIVEABOARD THROUGH THE BLUE LABYRINTH",
    mediaPool: ["photos/dest-papua.jpg", "photos/dest-maluku.jpg"],
    bookingFeatures: [
      { icon: "sailing", label: "Crewed small-boat support" },
      { icon: "scuba_diving", label: "Reef and manta windows" },
      { icon: "map", label: "Park fees pre-arranged" },
      { icon: "policy", label: "Sea-condition flexibility" },
    ],
  },
  "borneo-river": {
    eyebrow: "Expedition / Kalimantan",
    headline: "BORNEO: RIVER DRIFTING INTO THE RAINFOREST",
    mediaPool: ["photos/dest-kalimantan.jpg", "photos/dest-papua.jpg"],
    bookingFeatures: [
      { icon: "directions_boat", label: "Private klotok cruising" },
      { icon: "pets", label: "Ranger-led wildlife access" },
      { icon: "restaurant", label: "Onboard meal planning" },
      { icon: "policy", label: "Permit slots secured" },
    ],
  },
  "bali-lombok-gili": {
    eyebrow: "Expedition / Bali to Gilis",
    headline: "BALI + LOMBOK + GILIS: A CLEANER ISLAND-HOPPING WEEK",
    mediaPool: ["photos/dest-besakih-bali.jpg", "photos/dest-lombok-gili.jpg"],
    bookingFeatures: [
      { icon: "bed", label: "Boutique island stays" },
      { icon: "directions_boat", label: "Boat and luggage timing" },
      { icon: "waves", label: "Snorkel and beach days" },
      { icon: "policy", label: "Multi-island backups ready" },
    ],
  },
  "flores-komodo-overland": {
    eyebrow: "Expedition / Flores + Komodo",
    headline: "FLORES + KOMODO: RIDGELINES, DRAGONS & OPEN WATER",
    mediaPool: ["photos/dest-kelimutu.jpg", "photos/gallery-flores-ridge.jpg"],
    bookingFeatures: [
      { icon: "landscape", label: "Sunrise ridge planning" },
      { icon: "hiking", label: "Ranger-led island walks" },
      { icon: "directions_boat", label: "Boat and overland handoff" },
      { icon: "policy", label: "Realistic transit pacing" },
    ],
  },
  "maluku-spice-isles": {
    eyebrow: "Expedition / Maluku",
    headline: "MALUKU: SPICE ISLES, FORTS & CLEAR WATER",
    mediaPool: ["photos/dest-maluku.jpg", "photos/dest-raja-ampat.jpg"],
    bookingFeatures: [
      { icon: "history_edu", label: "Heritage route design" },
      { icon: "waves", label: "Lagoon and reef days" },
      { icon: "restaurant", label: "Spice-led food stops" },
      { icon: "policy", label: "Seasonal timing checks" },
    ],
  },
  "sulawesi-highlands-togian": {
    eyebrow: "Expedition / Sulawesi",
    headline: "SULAWESI: HIGHLANDS TO TOGIAN REEFS",
    mediaPool: ["photos/dest-sulawesi.jpg", "photos/dest-raja-ampat.jpg"],
    bookingFeatures: [
      { icon: "terrain", label: "Highland driver support" },
      { icon: "waves", label: "Private island boats" },
      { icon: "coffee", label: "Village and coffee stops" },
      { icon: "policy", label: "Sea-buffer planning" },
    ],
  },
  "papua-highlands": {
    eyebrow: "Expedition / Papua",
    headline: "PAPUA: VALLEYS, VILLAGES & LAKE SENTANI",
    mediaPool: ["photos/dest-papua.jpg", "photos/dest-raja-ampat.jpg"],
    bookingFeatures: [
      { icon: "altitude", label: "Altitude-aware pacing" },
      { icon: "hiking", label: "Porter-supported trekking" },
      { icon: "diversity_3", label: "Community-hosted visits" },
      { icon: "policy", label: "Weather and runway buffers" },
    ],
  },
};

const DEFAULT_BOOKING_FEATURES = [
  { icon: "bed", label: "Carefully selected stays" },
  { icon: "verified", label: "Vetted local operators" },
  { icon: "map", label: "Transport timing handled" },
  { icon: "policy", label: "Clear booking terms" },
];

const SIDE_NAV_ITEMS = [
  { icon: "map", label: "Overview", href: "#trip-overview" },
  { icon: "calendar_today", label: "Itinerary", href: "#trip-itinerary" },
  { icon: "bed", label: "Booking", href: "#trip-booking" },
  { icon: "verified", label: "Inclusions", href: "#trip-inclusions" },
  { icon: "policy", label: "Policies", href: "#trip-policies" },
];

const DAY_CONTEXT_NOTES = [
  {
    category: "arrival",
    pattern: /\b(arrive|arrival|depart|departure|disembark|airport|port)\b/i,
    text: "The pacing stays intentionally light around arrival or departure windows, so transfers and check-in never swallow the best part of the day.",
  },
  {
    category: "sea",
    pattern: /\b(boat|ferry|sail|cruise|crossing|harbor|jetty)\b/i,
    text: "Sea timing can shift with weather and port flow, which is why tickets, luggage handling, and onward transfers are lined up in advance instead of improvised at the dock.",
  },
  {
    category: "sunrise",
    pattern: /\b(sunrise|pre-dawn|ridge|summit|hike|trek|climb|trail|volcano)\b/i,
    text: "It is an early start, but that is what gives you cooler air, clearer light, and a much calmer window before the main traffic builds.",
  },
  {
    category: "water",
    pattern: /\b(snorkel|dive|manta|reef|lagoon|swim|kayak|sandbar)\b/i,
    text: "Water stops are adjusted to current, tide, and visibility on the day, so the experience stays comfortable rather than overly scripted.",
  },
  {
    category: "culture",
    pattern: /\b(temple|market|village|palace|fort|coffee|food|cooking|craft|heritage)\b/i,
    text: "There is enough room to linger for coffee, conversation, or a small detour when the atmosphere deserves it, instead of treating each stop like a quick photo break.",
  },
  {
    category: "recovery",
    pattern: /\b(spa|free time|relax|leisure|rest|shopping|cafe|beach club)\b/i,
    text: "Nothing critical is stacked on top of this window, so you can keep the pace slow or trade it for something spontaneous once you are there.",
  },
];

const TRANSIT_CONTEXT_NOTES = {
  "air-road": [
    "This day links a road leg to a domestic flight, so the schedule keeps real margin for traffic, bag drop, and the handoff on the other side instead of pretending those pieces click together instantly.",
    "Road-to-airport days are where rushed itineraries usually crack, so there is enough space here for traffic, check-in, and the next transfer to happen without the whole plan tightening up.",
    "The overland section and flight window are treated as one connected operation, with enough slack built in that one delay does not put pressure on everything after it.",
    "Days that move from the road into an airport are paced with deliberate buffer, so the travel mechanics stay under control instead of crowding out the rest of the plan.",
  ],
  "sea-return": [
    "Because this leg comes back off the water, the route keeps the rest of the day intentionally flexible instead of stacking another hard-timed commitment right after the dock.",
    "Return crossings are given breathing room on purpose, so sea conditions, unloading, and the next handoff do not make the day feel compressed.",
    "Coming back from a boat segment is handled with extra slack, which keeps the landing, luggage flow, and onward transfer feeling smooth rather than rushed.",
    "Water-to-land return days are kept deliberately loose, so docking, unloading, and the next transfer can happen at a realistic pace.",
  ],
  sea: [
    "The crossing is treated as part of the day, with margin on both sides for harbor flow, boarding order, and luggage handling rather than wedging another fixed appointment around it.",
    "Sea legs work better when the route allows for tide, dock rhythm, and loading time, so the onward plan starts after the crossing settles instead of before it should.",
    "Boat timing here is given proper space, which keeps the transfer feeling calm even if the harbor runs on island time instead of the printed schedule.",
    "This crossing is paced with enough room for boarding, sea conditions, and the arrival handoff, so the day still feels composed once you are back on land.",
  ],
  road: [
    "Long road sections are broken with worthwhile stops and real buffer, so the day keeps moving without feeling like a straight haul between beds.",
    "This overland stretch is paced with room for traffic, lookout stops, and slower local timing, which makes the transfer feel deliberate rather than purely functional.",
    "The route treats the drive as part of the experience, with enough slack built in that roadside stops and timing changes do not throw off the rest of the day.",
    "Road mileage is handled with realistic timing and breathing room, so the transfer does not end up feeling like a long gap between the better parts of the trip.",
  ],
  air: [
    "Flight windows are kept looser than they look on paper, so airport handling, security, and baggage retrieval do not force the next part of the route into a sprint.",
    "Domestic flight days are paced around the realities of check-in and baggage timing, which is why the schedule does not pretend the airport is just a quick stop.",
    "There is deliberate buffer around the airport sequence here, so the day still feels composed even if the flight side of the plan runs less cleanly than expected.",
    "Airport timing is treated as its own part of the day, with enough margin that check-in, baggage, and the onward transfer do not put the route under pressure.",
  ],
  handoff: [
    "This handoff is kept intentionally clean, with enough room to arrive, settle, and reset before the next piece begins.",
    "The route leaves space around this transfer so you are not moving straight from one logistics moment into the next without time to reset.",
    "Transitions like this are given a little slack on purpose, which keeps the day feeling polished instead of over-packed.",
    "The schedule gives this changeover proper breathing room, so one logistics step can finish before the next one needs to start.",
  ],
};

const STYLE_NOTES = {
  "Island & Culture":
    "This route works best when the practical pieces stay invisible, so boats, temple logistics, and dinner timing are handled cleanly and the days still feel loose.",
  "Adventure & Culture":
    "These are bigger travel days than they look on a map, so the sequence is built around realistic road and flight timing rather than idealized transfer estimates.",
  "Marine Expedition":
    "On liveaboard routes, the exact order of reefs and landings can shift with sea conditions, and that flexibility is what keeps the trip feeling smooth instead of forced.",
  Wildlife:
    "Wildlife days always run on nature's clock, so the strongest sighting windows are protected and the rest of the schedule stays deliberately unhurried.",
  "Island Hopping":
    "Boat crossings, hotel handovers, and luggage moves are treated as part of the service, which is what keeps an island route feeling polished instead of fragmented.",
  Adventure:
    "This route covers serious ground, so the pacing matters as much as the highlights and the stops are chosen to keep long overland sections feeling worthwhile.",
  "Marine & Heritage":
    "The appeal here is the contrast between fort towns and open water, so the days leave room for both proper sea time and slower hours on land.",
  "Culture & Reef":
    "The balance between inland culture and reef time is deliberate, with enough slack in the middle of the trip that one side never crowds out the other.",
  Expedition:
    "Papua works best with patient pacing, weather buffers, and respectful community timing, so the route is designed to feel steady rather than over-packed.",
};

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

function getTripEditorialMeta(trip) {
  return TRIP_EDITORIAL_META[trip.id] || {
    eyebrow: `Expedition / ${trip.region}`,
    headline: `${trip.title.toUpperCase()}: A PRIVATE INDONESIA ROUTE`,
    mediaPool: [trip.image],
    bookingFeatures: DEFAULT_BOOKING_FEATURES,
  };
}

function getTripMediaPool(trip, meta) {
  const media = [trip.image, ...(meta.mediaPool || [])].filter(Boolean);
  return Array.from(new Set(media));
}

function getTransitContextKey(dayText) {
  const hasAir = /\b(flight|airport)\b/i.test(dayText);
  const hasSea = /\b(boat|ferry|sail|cruise|crossing|harbor|jetty|port|disembark)\b/i.test(dayText);
  const hasRoad = /\b(drive|overland|road|jeep)\b/i.test(dayText);
  const hasHandoff = /\b(transfer|pickup|pick up|return|check-in|check in)\b/i.test(dayText);
  const isReturn = /\b(return|back)\b/i.test(dayText);

  if (hasAir && (hasRoad || hasHandoff)) return "air-road";
  if (hasSea && isReturn) return "sea-return";
  if (hasSea) return "sea";
  if (hasRoad) return "road";
  if (hasAir) return "air";
  if (hasHandoff) return "handoff";

  return null;
}

function getTransitContextNote(dayText, trip, index) {
  const transitKey = getTransitContextKey(dayText);
  const notePool = transitKey ? TRANSIT_CONTEXT_NOTES[transitKey] : null;
  if (!notePool?.length) return null;

  const itinerary = trip?.itinerary || [];
  let occurrenceIndex = 0;

  for (let cursor = 0; cursor <= index && cursor < itinerary.length; cursor += 1) {
    const itineraryDay = itinerary[cursor];
    const itineraryDayText = `${itineraryDay?.title || ""} ${itineraryDay?.detail || ""}`;
    if (getTransitContextKey(itineraryDayText) === transitKey) {
      occurrenceIndex += 1;
    }
  }

  return notePool[(occurrenceIndex - 1) % notePool.length];
}

function getEditorialParagraphs(day, trip, index) {
  const paragraphs = [];
  if (day?.detail) paragraphs.push(day.detail.trim());
  if (index === 0 && trip?.details) paragraphs.push(trip.details.trim());

  const dayText = `${day?.title || ""} ${day?.detail || ""}`;
  const matchedNote = DAY_CONTEXT_NOTES.find((item) => item.pattern.test(dayText));
  const styleNote = STYLE_NOTES[trip?.style];
  const isTransitDay = /\b(drive|transfer|flight|overland|return|pickup|check-in|check in)\b/i.test(dayText);
  const transitNote =
    isTransitDay && index > 0 && index < (trip?.itinerary?.length || 0) - 1 ? getTransitContextNote(dayText, trip, index) : null;
  const shouldUseMatchedNote =
    matchedNote && !(transitNote && ["arrival", "sea"].includes(matchedNote.category));

  if (shouldUseMatchedNote) paragraphs.push(matchedNote.text);

  if (transitNote) {
    paragraphs.push(transitNote);
  } else if (!matchedNote && styleNote) {
    paragraphs.push(styleNote);
  }

  return Array.from(new Set(paragraphs.filter(Boolean))).slice(0, index === 0 ? 3 : 3);
}

function getDayMediaLayout(index, mediaPool) {
  if (mediaPool.length > 1 && index % 4 === 1) return "split";
  return "single";
}

function getDayMediaSources(index, mediaPool) {
  if (!mediaPool.length) return [];
  const primary = mediaPool[index % mediaPool.length];
  const secondary = mediaPool[(index + 1) % mediaPool.length];
  return [primary, secondary];
}

function getAvailabilityText(trip) {
  if (trip.seatsLeft > 0) return `${trip.seatsLeft} SLOTS`;
  return "WAITLIST";
}

function getAvailabilityTone(trip) {
  return trip.seatsLeft > 0 ? "text-[#006096]" : "text-[#ba1a1a]";
}

function ScrollRevealImage({ src, alt, heightClass, revealOnScroll = false }) {
  const frameRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(!revealOnScroll);

  useEffect(() => {
    if (!revealOnScroll) {
      setIsRevealed(true);
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsRevealed(true);
      return undefined;
    }

    const frameElement = frameRef.current;
    if (!frameElement) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsRevealed(true);
        observer.disconnect();
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    observer.observe(frameElement);

    return () => observer.disconnect();
  }, [revealOnScroll]);

  return (
    <div ref={frameRef} className={`relative w-full overflow-hidden ${heightClass}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition duration-700 ${revealOnScroll && !isRevealed ? "grayscale" : ""}`}
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        width="1400"
        height="900"
      />
    </div>
  );
}

function renderDayMedia(day, trip, index, mediaPool) {
  const layout = getDayMediaLayout(index, mediaPool);
  const [primary, secondary] = getDayMediaSources(index, mediaPool);

  if (!primary) return null;

  if (layout === "split" && secondary) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[primary, secondary].map((src, imageIndex) => (
          <div key={`${src}-${imageIndex}`} className="relative h-72 overflow-hidden md:h-80">
            <OptimizedImage
              src={src}
              alt={`${day.title} on ${trip.title}`}
              className="h-full w-full object-cover"
              loading="lazy"
              fetchPriority="low"
              decoding="async"
              width="900"
              height="900"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollRevealImage
      src={primary}
      alt={`${day.title} on ${trip.title}`}
      heightClass={index % 4 === 3 ? "h-[420px] md:h-[600px]" : "h-80 md:h-96"}
      revealOnScroll={index % 2 === 0}
    />
  );
}

export default function TripPage() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("trip") || "";
  const year = new Date().getFullYear();

  const trip = useMemo(() => TRIP_OPTIONS.find((item) => item.id === tripId) || null, [tripId]);
  const itinerary = trip?.itinerary || [];
  const soldOut = (trip?.seatsLeft || 0) <= 0;
  const tripMeta = useMemo(() => (trip ? getTripEditorialMeta(trip) : null), [trip]);
  const mediaPool = useMemo(() => (trip && tripMeta ? getTripMediaPool(trip, tripMeta) : []), [trip, tripMeta]);

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
            { name: "Destinations", url: buildAbsoluteUrl("platform.html") },
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
          { name: "Destinations", url: buildAbsoluteUrl("platform.html") },
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

  if (!trip || !tripMeta) {
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
            Back to destinations
          </AppLink>
        </section>
      </Layout>
    );
  }

  return (
    <Layout currentPage="trips" renderHeader={false} renderFooter={false}>
      <div className="bg-[#faf8ff] text-[#131b2e] selection:bg-[#ffdcc3] selection:text-[#2f1500]">
        <aside className="group fixed left-0 top-0 z-40 hidden h-screen w-16 flex-col items-center border-r border-[#887364]/20 bg-white py-8 transition-all duration-300 hover:w-64 xl:flex">
          <div className="mb-12">
            <span className="material-symbols-outlined text-[#8d4b00]">explore</span>
          </div>
          <div className="flex flex-1 flex-col gap-8 self-stretch">
            {SIDE_NAV_ITEMS.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 pl-4 transition-all ${
                  index === 0
                    ? "border-l-4 border-[#8d4b00] font-bold text-[#8d4b00]"
                    : "text-[#565e74] hover:bg-[#f2f3ff]"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] group-hover:block">{item.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-auto group-hover:px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffdcc3] text-[10px] font-bold uppercase text-[#6e3900]">
              ST
            </div>
          </div>
        </aside>

        <main className="relative">
          <section className="relative h-[620px] min-h-[520px] w-full overflow-hidden md:h-[760px] xl:h-[870px]">
            <div className="absolute inset-0 z-0">
              <OptimizedImage
                src={trip.image}
                alt={trip.title}
                className="h-full w-full object-cover brightness-75"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="1600"
                height="1066"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="relative z-10">
              <SiteHeader currentPage="trips" variant="editorial" showCta={false} brandSubtitle={null} forceLightNav />
            </div>

            <div className="relative z-10 flex h-full items-center justify-center">
              <div className="mx-auto max-w-5xl px-6 text-center xl:pl-28">
                <p className="font-editorial-label mb-6 text-xs uppercase tracking-[0.4em] text-white">{tripMeta.eyebrow}</p>
                <h1 className="font-editorial-serif text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl xl:text-8xl">
                  {tripMeta.headline}
                </h1>
              </div>
            </div>
          </section>

          <section id="trip-overview" className="sticky top-[77px] z-40 border-y border-black/10 bg-white">
            <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-6 px-6 py-5 xl:pl-28 xl:pr-12">
              <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-[0.22em] text-[#131b2e] md:gap-8">
                <div className="flex flex-col">
                  <span className="mb-1 text-[#565e74]/60">Duration</span>
                  <span>{trip.duration.toUpperCase()}</span>
                </div>
                <div className="hidden h-8 w-px bg-black/10 md:block" />
                <div className="flex flex-col">
                  <span className="mb-1 text-[#565e74]/60">Region</span>
                  <span>{trip.region.toUpperCase()}</span>
                </div>
                <div className="hidden h-8 w-px bg-black/10 md:block" />
                <div className="flex flex-col">
                  <span className="mb-1 text-[#565e74]/60">Investment</span>
                  <span>FROM {formatPrice(trip.priceFrom)}</span>
                </div>
              </div>
              <div className={`text-xs font-bold uppercase tracking-[0.22em] ${getAvailabilityTone(trip)}`}>
                Availability: {getAvailabilityText(trip)}
              </div>
            </div>
          </section>

          <div className="mx-auto flex max-w-screen-2xl flex-col gap-16 px-6 py-16 xl:pl-28 xl:pr-12 xl:py-24 lg:flex-row lg:gap-20">
            <div className="flex-1 space-y-20 lg:space-y-28">
              <section className="border-t border-black/15 pt-8">
                <p className="font-editorial-label text-xs font-bold uppercase tracking-[0.28em] text-[#8d4b00]">Route Overview</p>
                <h2 className="font-editorial-serif mt-4 max-w-4xl text-3xl font-bold leading-tight text-[#131b2e] md:text-5xl">
                  {trip.summary}
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#565e74]">{trip.details}</p>
              </section>

              <section id="trip-itinerary" className="space-y-20 lg:space-y-28">
                {itinerary.map((day, index) => {
                  const accentClass = index === 0 ? "bg-[#8d4b00]" : "bg-[#131b2e]";
                  const paragraphs = getEditorialParagraphs(day, trip, index);

                  return (
                    <article key={`${trip.id}-${day.label || index}`} id={`day-${index + 1}`} className="group relative border-l border-black/20 pl-10 md:pl-16">
                      <div className={`absolute -left-2 top-0 h-4 w-4 md:-left-3 md:h-6 md:w-6 ${accentClass}`} />
                      <span className="font-editorial-label mb-4 block text-sm font-bold uppercase tracking-[0.3em] text-[#8d4b00]">
                        {day.label || `Day ${String(index + 1).padStart(2, "0")}`}
                      </span>
                      <h2 className="font-editorial-serif mb-8 text-3xl font-bold uppercase leading-tight tracking-tight text-[#131b2e] md:text-4xl">
                        {day.title}
                      </h2>
                      <div className="mb-12 max-w-2xl space-y-5">
                        {paragraphs.map((paragraph) => (
                          <p key={paragraph} className="text-lg leading-relaxed text-[#565e74]">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      {renderDayMedia(day, trip, index, mediaPool)}
                    </article>
                  );
                })}
              </section>

              <section id="trip-inclusions" className="grid gap-4 border-t border-black/15 pt-10 md:grid-cols-3">
                <article className="border border-black/10 bg-white p-6">
                  <p className="font-editorial-label text-xs font-bold uppercase tracking-[0.24em] text-[#565e74]">Included</p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#565e74]">
                    {[
                      "Accommodation and pre-arranged local transfers",
                      "Core guiding, transport coordination, and required permits",
                      "Experiences named in the route summary and final proposal",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#8d4b00]" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="border border-black/10 bg-white p-6">
                  <p className="font-editorial-label text-xs font-bold uppercase tracking-[0.24em] text-[#565e74]">Not Included</p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#565e74]">
                    {[
                      "International flights and visa-related costs",
                      "Travel insurance and personal incidental spending",
                      "Optional add-ons not listed in the confirmed proposal",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#131b2e]" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
                <article id="trip-policies" className="border border-black/10 bg-white p-6">
                  <p className="font-editorial-label text-xs font-bold uppercase tracking-[0.24em] text-[#565e74]">Booking Policy</p>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#565e74]">
                    {BOOKING_CONFIDENCE_POINTS.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#8d4b00]" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </section>
            </div>

            <aside className="lg:w-96">
              <div className="space-y-6 lg:sticky lg:top-40">
                <div id="trip-booking" className="border border-white/5 bg-[#131b2e] p-8 text-white shadow-[20px_40px_40px_rgba(19,27,46,0.06)] md:p-10">
                  <h3 className="font-editorial-serif text-2xl font-bold">Book Your Journey</h3>
                  <p className="font-editorial-label mb-8 mt-2 text-xs uppercase tracking-[0.28em] text-[#ffdcc3]">
                    Exclusive Curator Access
                  </p>

                  <div className="mb-10 space-y-5">
                    {(tripMeta.bookingFeatures || DEFAULT_BOOKING_FEATURES).map((feature) => (
                      <div key={feature.label} className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.18em]">
                        <span className="material-symbols-outlined text-[#ffdcc3]">{feature.icon}</span>
                        <span>{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-8 border-t border-white/10 pt-8">
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <span className="font-editorial-label text-xs uppercase tracking-[0.24em] text-white/60">Total Value</span>
                      <span className="font-editorial-serif text-3xl font-bold">{formatPrice(trip.priceFrom)}</span>
                    </div>
                    <p className="font-editorial-label text-[10px] uppercase tracking-[0.18em] text-white/40">
                      Per person, double occupancy
                    </p>
                  </div>

                  <AppLink
                    href={bookingHref}
                    className="font-editorial-label inline-flex w-full items-center justify-center bg-[#8d4b00] px-5 py-4 text-xs font-bold uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:bg-[#b15f00]"
                  >
                    {soldOut ? "Request Waitlist" : "Request Booking"}
                  </AppLink>
                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noreferrer"
                    className="font-editorial-label mt-3 inline-flex w-full items-center justify-center border border-white/20 px-5 py-4 text-xs font-bold uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:bg-white/10"
                  >
                    WhatsApp Concierge
                  </a>
                  <p className="font-editorial-label mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Estimated response: 2 hours
                  </p>
                </div>

                <div className="border border-black/10 bg-white p-6">
                  <p className="font-editorial-label text-xs font-bold uppercase tracking-[0.24em] text-[#565e74]">Trip Notes</p>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#565e74]">
                    <p>
                      Next departure: <span className="font-semibold text-[#131b2e]">{formatDepartureDate(trip.nextDeparture)}</span>
                    </p>
                    <p>
                      Budget tier: <span className="font-semibold text-[#131b2e]">{trip.budgetTier}</span>
                    </p>
                    <p>
                      Availability updated: <span className="font-semibold text-[#131b2e]">{formatUpdatedDate(AVAILABILITY_LAST_UPDATED)}</span>
                    </p>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#565e74]">
                    {trip.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#8d4b00]" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <footer className="mt-24 border-t border-white/10 bg-[#131b2e] px-6 py-12 xl:pl-28 xl:pr-12 xl:py-16">
          <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <span className="font-editorial-serif text-2xl font-bold tracking-tight text-[#8d4b00]">Surga Indonesia Travel</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <AppLink
                href={LEGAL_PATHS.privacy}
                className="text-xs uppercase tracking-[0.18em] text-white/60 transition-opacity hover:text-[#8d4b00]"
              >
                Privacy
              </AppLink>
              <AppLink
                href={LEGAL_PATHS.terms}
                className="text-xs uppercase tracking-[0.18em] text-white/60 transition-opacity hover:text-[#8d4b00]"
              >
                Terms
              </AppLink>
              <AppLink
                href={buildContactHref({ source: "trip-footer", topic: `Concierge: ${trip.title}` })}
                className="text-xs uppercase tracking-[0.18em] text-white/60 transition-opacity hover:text-[#8d4b00]"
              >
                Concierge
              </AppLink>
              <AppLink
                href={buildContactHref({ source: "trip-footer" })}
                className="text-xs uppercase tracking-[0.18em] text-white/60 transition-opacity hover:text-[#8d4b00]"
              >
                Contact
              </AppLink>
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/40">
              (c) {year} SURGA INDONESIA TRAVEL. ALL RIGHTS RESERVED.
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
