import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppLink from "../components/AppLink";
import EditorialFooter from "../components/EditorialFooter";
import Layout from "../components/Layout";
import OptimizedImage from "../components/OptimizedImage";
import SiteHeader from "../components/SiteHeader";
import { CONTACT_ENDPOINT } from "../config";
import { HOURS, QUICK_LINKS } from "../data/contact";
import {
  buildAbsoluteUrl,
  createBreadcrumbSchema,
  createTravelAgencySchema,
  createWebPageSchema,
  usePageSeo,
} from "../utils/seo";
import { CONTACT_PATH } from "../utils/urls";

const CONTACT_TITLE = "Contact Surga Indonesia Travel";
const CONTACT_DESCRIPTION =
  "Contact Surga Indonesia Travel to request booking support, availability checks, or custom Indonesia route planning.";
const MAX_TRAVELERS = 40;

export default function ContactPage() {
  const [feedback, setFeedback] = useState({ status: null, message: "We confirm availability and next steps within one business day." });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const travelMonthPlaceholder = useMemo(() => {
    const sampleDate = new Date();
    sampleDate.setMonth(sampleDate.getMonth() + 2);
    return `e.g. ${sampleDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
  }, []);

  const seoSchema = useMemo(() => {
    const homeUrl = buildAbsoluteUrl("");
    const pageUrl = buildAbsoluteUrl("support.html");

    return [
      createTravelAgencySchema(),
      createWebPageSchema({
        url: pageUrl,
        title: CONTACT_TITLE,
        description: CONTACT_DESCRIPTION,
        image: "photos/dest-raja-ampat.jpg",
        pageType: "ContactPage",
      }),
      createBreadcrumbSchema([
        { name: "Home", url: homeUrl },
        { name: "Contact", url: pageUrl },
      ]),
    ];
  }, []);

  const bookingPrefill = useMemo(() => {
    const tripId = searchParams.get("trip") || "";
    const tripNameFromQuery = searchParams.get("trip_name") || "";
    const departure = searchParams.get("departure") || "";
    const travelMonth = searchParams.get("travel_month") || "";
    const source = searchParams.get("source") || "";
    const requestType = searchParams.get("request_type") || "booking";
    const topicFromQuery = searchParams.get("topic") || "";

    const tripNameFallback = tripId
      ? tripId
          .split("-")
          .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
          .join(" ")
      : "";
    const tripName = tripNameFromQuery || tripNameFallback;
    const defaultTopic = topicFromQuery || (tripName ? `${requestType === "waitlist" ? "Waitlist" : "Booking request"}: ${tripName}` : "");
    const defaultMessage = tripName
      ? `I would like to ${requestType === "waitlist" ? "join the waitlist for" : "request booking for"} the ${tripName} route.${
          departure ? ` Preferred departure: ${departure}.` : ""
        }`
      : "";

    return {
      tripId,
      tripName,
      departure,
      travelMonth,
      source,
      requestType,
      defaultTopic,
      defaultMessage,
    };
  }, [searchParams]);

  usePageSeo({
    title: CONTACT_TITLE,
    description: CONTACT_DESCRIPTION,
    path: "support.html",
    image: "photos/dest-raja-ampat.jpg",
    imageAlt: "Indonesian island coastline",
    schema: seoSchema,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const required = ["name", "email", "message"];
    const missing = required.filter((field) => !(data.get(field) || "").trim());
    const travelersValue = String(data.get("travelers") || "").trim();
    const travelersCount = travelersValue ? Number(travelersValue) : null;

    if (missing.length) {
      setFeedback({
        status: "error",
        message: "Please add your name, email, and message so we can respond.",
      });
      return;
    }

    if (
      travelersValue &&
      (!Number.isFinite(travelersCount) || !Number.isInteger(travelersCount) || travelersCount < 1 || travelersCount > MAX_TRAVELERS)
    ) {
      setFeedback({
        status: "error",
        message: `Traveler count must be between 1 and ${MAX_TRAVELERS}.`,
      });
      return;
    }

    if (!CONTACT_ENDPOINT) {
      setFeedback({
        status: "error",
        message: "Contact endpoint is not configured. Please set VITE_CONTACT_ENDPOINT.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone") || "",
        travelMonth: data.get("travel_month") || bookingPrefill.travelMonth || "",
        travelers: travelersValue,
        topic: data.get("topic") || bookingPrefill.defaultTopic,
        message: data.get("message"),
        tripId: bookingPrefill.tripId,
        tripName: bookingPrefill.tripName,
        departureDate: bookingPrefill.departure,
        requestType: bookingPrefill.requestType,
        source: bookingPrefill.source || "contacts-page",
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

      setFeedback({
        status: "success",
        message: "Booking request received. A planner will confirm availability, pricing, and deposit steps within one business day from Bali.",
      });
      form.reset();
    } catch (error) {
      setFeedback({
        status: "error",
        message: "We could not send your message. Please retry or email hello@surgaindonesia.travel.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout currentPage="contacts" renderHeader={false} renderFooter={false}>
      <div className="bg-[#faf8ff] text-[#131b2e]">
        <section className="relative isolate overflow-hidden bg-[#0d0d0b] text-white">
          <OptimizedImage
            src="photos/dest-raja-ampat.jpg"
            alt="Indonesian coastline"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="1600"
            height="1066"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/80" aria-hidden />

          <div className="relative z-10">
            <SiteHeader
              currentPage="contacts"
              variant="editorial"
              ctaHref="#contact"
              ctaLabel="Start planning"
              showCta={false}
              brandSubtitle={null}
            />

            <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
              <nav className="font-editorial-label flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/70">
                <AppLink className="transition hover:text-white" href="/">
                  Home
                </AppLink>
                <span aria-hidden>/</span>
                <span className="text-white">Contact</span>
              </nav>
              <div className="mt-6 max-w-4xl">
                <p className="font-editorial-label text-xs uppercase tracking-[0.34em] text-white/80">Planning desk</p>
                <h1 className="font-editorial-display mt-6 text-5xl font-bold uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl lg:text-[5.4rem]">
                  Talk To A
                  <br />
                  <span className="font-editorial-serif italic normal-case tracking-tight">real planner</span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl sm:leading-9">
                  Based in Ubud. Replies within one business day. No automated queue, no fake concierge copy, just the team that actually handles route planning and on-trip fixes.
                </p>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {QUICK_LINKS.map((item) => (
                  <a key={item.label} href={item.href} className="border border-white/10 bg-white/5 p-5 text-white transition hover:bg-white/10">
                    <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-white/60">{item.label}</p>
                    <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm leading-7 text-white/75">{item.hint}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
            <div className="space-y-8">
              <div>
                <p className="font-editorial-label text-[10px] uppercase tracking-[0.3em] text-[#8d4b00]">Visit or call</p>
                <h2 className="font-editorial-display mt-4 text-4xl font-bold text-[#131b2e] sm:text-5xl">Planning desk and office details</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                  Walk in or call ahead. One desk handles new requests, and one operations line stays focused on travelers already moving between islands.
                </p>
              </div>

              <div className="border border-black/10 bg-[#faf8ff] p-6">
                <div className="space-y-5">
                  <div>
                    <p className="font-editorial-label text-[10px] uppercase tracking-[0.22em] text-slate-500">Office</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">Jl. Raya Ubud No. 7, Gianyar, Bali 80571</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">Entrance beside Ubud Palace parking. Meetings are better with advance notice so the right planner is available.</p>
                  </div>
                  <div>
                    <p className="font-editorial-label text-[10px] uppercase tracking-[0.22em] text-slate-500">Planning and sales</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      <a className="transition hover:text-[#8d4b00]" href="tel:+6281138062116">
                        +62 811-3806-2116
                      </a>
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">New route ideas, live pricing checks, and departure availability.</p>
                  </div>
                  <div>
                    <p className="font-editorial-label text-[10px] uppercase tracking-[0.22em] text-slate-500">On-trip support</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      <a className="transition hover:text-[#8d4b00]" href="mailto:ops@surgaindonesia.travel">
                        ops@surgaindonesia.travel
                      </a>
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">Changes, delays, and practical help once you are already traveling.</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-black/10 bg-white p-5">
                  <h3 className="font-editorial-serif text-xl font-bold text-[#131b2e]">Opening hours</h3>
                  <dl className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                    {HOURS.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-4 border-b border-black/5 pb-2 last:border-b-0 last:pb-0">
                        <dt className="text-slate-600">{item.label}</dt>
                        <dd className="font-semibold text-slate-900">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="border border-black/10 bg-white p-5">
                  <h3 className="font-editorial-serif text-xl font-bold text-[#131b2e]">Payments</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                    <li><span className="font-semibold text-slate-900">Bank</span>: Bank Central Asia (BCA)</li>
                    <li><span className="font-semibold text-slate-900">Account</span>: PT Surga Indonesia Travel</li>
                    <li><span className="font-semibold text-slate-900">IBAN</span>: 1234 5678 9012</li>
                    <li><span className="font-semibold text-slate-900">Notes</span>: Invoices are issued in IDR or USD, with verified payment links available on request.</li>
                    <li><span className="font-semibold text-slate-900">Booking flow</span>: Dates and rates are only locked after planner confirmation.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="overflow-hidden border border-black/10 bg-white">
              <div className="aspect-[4/3] bg-slate-100">
                <iframe
                  title="Surga Indonesia Travel office location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=115.254%2C-8.514%2C115.268%2C-8.494&layer=mapnik&marker=-8.504%2C115.261"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="bg-[#131b2e] px-5 py-4 text-white">
                <p className="font-editorial-label text-[10px] uppercase tracking-[0.22em] text-white/60">Ubud office map</p>
                <a
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#ffdcc3] transition hover:text-white"
                  href="https://www.openstreetmap.org/?mlat=-8.504&mlon=115.261#map=17/-8.504/115.261"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open larger map
                  <span aria-hidden="true">+</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#faf8ff] py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-5">
                <p className="font-editorial-label text-[10px] uppercase tracking-[0.3em] text-[#8d4b00]">Write to us</p>
                <h2 className="font-editorial-display text-4xl font-bold text-[#131b2e] sm:text-5xl">Send the rough shape of the trip</h2>
                <p className="text-lg leading-8 text-slate-600">
                  Dates, group size, and the islands you care about most are enough to start. We confirm live availability and exact pricing before anything is locked.
                </p>
                {bookingPrefill.tripName ? (
                  <div className="border border-[#96ccff] bg-[#cee5ff] p-4 text-sm leading-7 text-[#004a75]">
                    Prefilled from route: <span className="font-semibold">{bookingPrefill.tripName}</span>
                    {bookingPrefill.departure ? <span className="font-semibold"> (next departure {bookingPrefill.departure})</span> : null}
                  </div>
                ) : null}
                <ul className="space-y-3 text-sm leading-7 text-slate-700">
                  <li><span className="font-semibold text-slate-900">Private trips:</span> planning@surgaindonesia.travel</li>
                  <li><span className="font-semibold text-slate-900">Groups and retreats:</span> groups@surgaindonesia.travel</li>
                  <li><span className="font-semibold text-slate-900">Press and partners:</span> press@surgaindonesia.travel</li>
                </ul>
                <div className="border border-[#ffdcc3] bg-[#fff1e5] p-5 text-sm leading-7 text-[#6e3900]">
                  <p className="font-editorial-label text-[10px] uppercase tracking-[0.22em]">How confirmation works</p>
                  <ol className="mt-3 space-y-1 list-decimal pl-4">
                    <li>You send dates, route, and traveler count.</li>
                    <li>We confirm live availability and exact pricing.</li>
                    <li>Booking is locked after deposit invoice payment.</li>
                  </ol>
                </div>
              </div>

              <form
                className="border border-black/10 bg-white p-6 md:p-8"
                data-contact-form
                onSubmit={handleSubmit}
                noValidate
                style={{ colorScheme: "light" }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    <span>Full name *</span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                      required
                    />
                  </label>
                  <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    <span>Email *</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                      required
                    />
                  </label>
                  <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    <span>Phone or WhatsApp</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+62 812 3456 7890"
                      className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                  <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    <span>Travel month</span>
                    <input
                      type="text"
                      name="travel_month"
                      placeholder={travelMonthPlaceholder}
                      defaultValue={bookingPrefill.travelMonth}
                      className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                  <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    <span>Travelers</span>
                    <input
                      type="number"
                      name="travelers"
                      min="1"
                      max={MAX_TRAVELERS}
                      step="1"
                      placeholder="2"
                      className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                  <label className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                    <span>Topic</span>
                    <input
                      type="text"
                      name="topic"
                      placeholder="Trip idea, change, billing"
                      defaultValue={bookingPrefill.defaultTopic}
                      className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                </div>

                <label className="font-editorial-label mt-4 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  <span>Message *</span>
                  <textarea
                    name="message"
                    rows="6"
                    placeholder="Share route ideas, dates, flight city, and room preference."
                    defaultValue={bookingPrefill.defaultMessage}
                    className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                    required
                  />
                </label>

                <button
                  className="mt-5 inline-flex w-full items-center justify-center bg-[#8d4b00] px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#b15f00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3] disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending details..." : "Send details"}
                </button>
                <p
                  className={`mt-4 text-sm font-semibold ${
                    feedback.status === "success" ? "text-emerald-700" : feedback.status === "error" ? "text-red-700" : "text-slate-600"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {feedback.message}
                </p>
              </form>
            </div>
          </div>
        </section>

        <EditorialFooter conciergeTopic="Concierge: Contact Page" />
      </div>
    </Layout>
  );
}
