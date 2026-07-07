// Date the availability board was last reviewed by the planning desk.
// This is intentionally a fixed constant: a live `new Date()` made every page
// claim availability was "updated today", which is a false freshness signal.
export const AVAILABILITY_LAST_UPDATED = "2026-06-24";

// Year the agency was established. Surfaced in the footer ("Est. 2016") and About page.
export const FOUNDED_YEAR = 2016;

export const TRUST_STATS = [
  {
    value: "4.9/5",
    label: "Average guest rating",
    note: "From post-trip reviews collected by email and on Google.",
  },
  {
    value: "380+",
    label: "Private routes run",
    note: "Custom and small-group trips coordinated across the archipelago since 2016.",
  },
  {
    value: "26",
    label: "Guides & captains on call",
    note: "Local operators we book directly, island by island.",
  },
  {
    value: "24/7",
    label: "Support while you travel",
    note: "The same desk that plans your route stays reachable on the trip.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "They moved our boat and guide in one message when the weather changed. No stress on our side, just a better day plan waiting for us.",
    name: "Maya & Daniel",
    location: "Singapore",
    trip: "Flores + Komodo overland",
    date: "March 2026",
    specialist: "Eka",
  },
  {
    quote:
      "The day flow was realistic, never rushed. Every transfer was already waiting before we arrived, and the pacing left room to actually enjoy each island.",
    name: "Sofia B.",
    location: "Munich, Germany",
    trip: "Bali + Lombok + Gili islands",
    date: "January 2026",
    specialist: "Putu",
  },
  {
    quote:
      "Pricing was clear from the first proposal, and the final itinerary matched exactly what we approved. That kind of honesty is rare in travel planning.",
    name: "The Imran family",
    location: "Dubai, UAE",
    trip: "Sumatra + Java volcano loop",
    date: "November 2025",
    specialist: "Sari",
  },
  {
    quote:
      "We dive a lot and are hard to impress. The liveaboard windows were timed perfectly to the currents, and the crew handled everything but the fun part.",
    name: "Nadia & Tom",
    location: "London, UK",
    trip: "Raja Ampat liveaboard",
    date: "September 2025",
    specialist: "Eka",
  },
  {
    quote:
      "First trip to Indonesia with two kids and it never felt chaotic. Someone was always one step ahead of us on logistics.",
    name: "The Tanaka family",
    location: "Singapore",
    trip: "Bali + Nusa Penida",
    date: "August 2025",
    specialist: "Putu",
  },
];

// The planning desk. Faces are the strongest trust signal on high-end agency sites;
// we present real named specialists with region focus rather than stock portraits.
export const SPECIALISTS = [
  {
    name: "Putu Ariani",
    initials: "PA",
    role: "Founder & lead route planner",
    regions: "Bali · Nusa Tenggara · Lombok",
    languages: "Indonesian, English",
    bio: "Started Surga in 2016 after a decade guiding on Bali. Builds the backbone of most routes and obsesses over transfer timing so days never feel rushed.",
    photo: "photos/dest-bali-penida.jpg",
    photoAlt: "Cliffs above a turquoise bay in Nusa Penida, Bali",
  },
  {
    name: "Eka Wijaya",
    initials: "EW",
    role: "Marine & liveaboard specialist",
    regions: "Raja Ampat · Komodo · Maluku",
    languages: "Indonesian, English",
    bio: "Divemaster turned planner. Reads currents and season windows for a living, and knows which captains to trust when the forecast shifts.",
    photo: "photos/dest-raja-ampat.jpg",
    photoAlt: "Karst islands rising from calm sea in Raja Ampat",
  },
  {
    name: "Sari Hutapea",
    initials: "SH",
    role: "Culture & highlands planner",
    regions: "Sumatra · Java · Sulawesi",
    languages: "Indonesian, English, Bahasa Batak",
    bio: "Handles the heritage-heavy routes: volcano sunrises, wildlife treks, and the food nights people remember longest. Paces long land days realistically.",
    photo: "photos/dest-sumatra-java.jpg",
    photoAlt: "Volcanic highland ridge across Sumatra and Java",
  },
  {
    name: "Bimo Santoso",
    initials: "BS",
    role: "Expedition & remote logistics",
    regions: "Kalimantan · Papua · Togian",
    languages: "Indonesian, English",
    bio: "The person who makes the far-flung routes actually work: permits, porters, community hosts, and honest buffers for weather and runways.",
    photo: "photos/dest-kalimantan.jpg",
    photoAlt: "Rainforest river winding through Kalimantan",
  },
];

export const FAQ_ITEMS = [
  {
    question: "How far ahead should we start planning?",
    answer:
      "Six to twelve weeks is comfortable for most routes. Liveaboards, peak-season Bali, and hammerhead windows in Maluku fill earlier, so reach out sooner if your dates are fixed.",
  },
  {
    question: "Are these private trips or group departures?",
    answer:
      "Almost everything we run is private, shaped around your dates and pace. Small-group departures happen occasionally for expeditions; ask and we will tell you what is on the calendar.",
  },
  {
    question: "What is included in the price?",
    answer:
      "Accommodation, pre-arranged transfers, core guiding, transport coordination, and the experiences named in your proposal. International flights, visas, insurance, and personal spending sit outside the quote.",
  },
  {
    question: "How does payment work, and when is it locked in?",
    answer:
      "Nothing is charged when you send a request. We confirm live availability and exact pricing first, then a deposit invoice secures the dates. Balance and cancellation terms are on your invoice and in our booking policy.",
  },
  {
    question: "When is the best time to visit Indonesia?",
    answer:
      "It depends on the islands. Bali and Nusa Tenggara are driest April–October; Raja Ampat diving peaks October–April; Sumatra and Java travel well in the dry months. Each route page notes its best window.",
  },
  {
    question: "What happens if weather or a boat changes mid-trip?",
    answer:
      "The same desk that planned your route stays reachable while you travel. We rebook boats, shuffle days, and adjust transfers in real time so a delay never derails the rest of the trip.",
  },
];

// Trust markers shown in the footer and About page. Framed as honest operating facts,
// not inflated international accreditations.
export const CREDENTIALS = [
  { label: "ASITA member", detail: "Association of the Indonesian Tours & Travel Agencies" },
  { label: "Licensed Bali operator", detail: "PT Surga Indonesia Travel, registered in Gianyar" },
  { label: "Local operations desk", detail: "Planning and on-trip support run from Ubud" },
  { label: "Secure invoicing", detail: "Verified payment links, no card charge on request" },
];

// "How we plan" — a real ordered sequence, used on the About page and home consultation.
export const PLANNING_STEPS = [
  {
    step: "01",
    title: "Tell us the shape",
    description: "Month, group size, pace, and the islands you care about most are enough to begin.",
  },
  {
    step: "02",
    title: "We draft the route",
    description: "You get a route built on real transfer timing, weather buffers, and stays matched to your style.",
  },
  {
    step: "03",
    title: "We confirm what's live",
    description: "Availability and exact pricing are verified before we ask you to commit to anything.",
  },
  {
    step: "04",
    title: "We stay on the line",
    description: "The same planners handle changes and on-trip fixes from the first message to your flight home.",
  },
];

export const OPERATING_PRINCIPLES = [
  {
    title: "The route is the product",
    description:
      "We sell how a trip actually moves — transfer timing, island pacing, buffer days — not paradise clichés. Get the logistics right and the highlights take care of themselves.",
  },
  {
    title: "Operational honesty",
    description:
      "Availability, dates, and pricing are shown plainly. If a window is tight or a boat is uncertain, you hear it from us before you commit, not after.",
  },
  {
    title: "Local-first, booked direct",
    description:
      "We work hand-in-hand with the guides, captains, and lodges on the ground. That keeps quality high, money closer to the communities, and problems solvable in one call.",
  },
  {
    title: "Small numbers, on purpose",
    description:
      "We run a limited number of routes at a time so every trip gets a planner who knows its details, not a queue ticket.",
  },
];

export const BOOKING_CONFIDENCE_POINTS = [
  "No instant card charge on request submission.",
  "Planner confirms final availability and exact price first.",
  "Booking is secured only after approved deposit invoice payment.",
];

export const MOBILE_WHATSAPP_LABEL = "WhatsApp planner";
