import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import SiteHeader from "../components/SiteHeader";
import { HOURS, QUICK_LINKS } from "../data/contact";
import { CONTACT_ENDPOINT } from "../config";

export default function ContactPage() {
  const [feedback, setFeedback] = useState({ status: null, message: "We reply within one business day." });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tripFromQuery = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("trip") || "";
  }, []);

  const defaultTopic = tripFromQuery ? `Trip: ${tripFromQuery}` : "";
  const defaultMessage = tripFromQuery ? `Interested in the ${tripFromQuery} route.` : "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const required = ["name", "email", "message"];
    const missing = required.filter((field) => !(data.get(field) || "").trim());

    if (missing.length) {
      setFeedback({
        status: "error",
        message: "Please add your name, email, and message so we can respond.",
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
        topic: data.get("topic") || defaultTopic,
        message: data.get("message"),
        trip: tripFromQuery,
        source: "contacts-page",
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
        message: "Thanks for your note. A planner will reply within one business day from Bali.",
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
    <Layout currentPage="contacts" renderHeader={false}>
      <section className="relative isolate overflow-hidden bg-slate-900 text-white">
        <img
          src="/photos/dest-raja-ampat.jpg"
          alt="Indonesian coastline"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-amber-900/60" aria-hidden />
        <div className="relative z-10">
          <SiteHeader currentPage="contacts" variant="overlay" />
          <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 lg:pb-20 lg:pt-24">
            <nav className="flex items-center gap-2 text-sm text-slate-100/80">
              <a className="font-semibold hover:text-amber-200" href="index.html">
                Home
              </a>
              <span aria-hidden>/</span>
              <span className="text-slate-100">Contacts</span>
            </nav>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Contact Surga Indonesia Travel</h1>
            <p className="mt-3 max-w-3xl text-lg text-slate-100/90">
              Speak directly with our Bali-based planners for trip questions, changes, or to start a new itinerary.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {QUICK_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex flex-col gap-1 rounded-2xl bg-white/10 p-4 text-white shadow-sm ring-1 ring-white/15 transition hover:bg-white/15"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">{item.label}</span>
                  <span className="text-lg font-semibold">{item.value}</span>
                  <span className="text-sm text-slate-100/80 group-hover:text-white">{item.hint}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Visit or call</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Planning desk & office details.</h2>
              <p className="max-w-3xl text-slate-600">
                Drop by our Ubud office or set up a call. One desk focuses on new itineraries and another on guests already traveling.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Office</p>
                  <p className="text-base font-semibold text-slate-900">Jl. Raya Ubud No. 7, Gianyar, Bali 80571</p>
                  <p className="text-sm text-slate-600">Entrance beside Ubud Palace parking. Please call ahead for meetings.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Planning & sales</p>
                  <p className="text-base font-semibold text-slate-900">
                    <a className="hover:text-amber-700" href="tel:+6281138062116">
                      +62 811-3806-2116
                    </a>
                  </p>
                  <p className="text-sm text-slate-600">New trip ideas, pricing, and availability.</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">On-trip support</p>
                  <p className="text-base font-semibold text-slate-900">
                    <a className="hover:text-amber-700" href="mailto:ops@surgaindonesia.travel">
                      ops@surgaindonesia.travel
                    </a>
                  </p>
                  <p className="text-sm text-slate-600">Changes, delays, and in-destination help.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Opening hours</h3>
                <dl className="mt-3 space-y-2 text-sm text-slate-700">
                  {HOURS.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <dt className="text-slate-600">{item.label}</dt>
                      <dd className="font-semibold text-slate-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Payments</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>
                    <span className="font-semibold text-slate-900">Bank</span>: Bank Central Asia (BCA)
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">Account</span>: PT Surga Indonesia Travel
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">IBAN</span>: 1234 5678 9012
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">Notes</span>: Invoices issued in IDR or USD. Credit card links available on request.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="aspect-[4/3] bg-slate-100">
              <iframe
                title="Surga Indonesia Travel office location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=115.254%2C-8.514%2C115.268%2C-8.494&layer=mapnik&marker=-8.504%2C115.261"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="bg-slate-900/90 px-4 py-3 text-sm text-white">
              <p className="font-semibold">Ubud office map</p>
              <a
                className="inline-flex items-center gap-2 text-amber-200 transition hover:text-amber-100"
                href="https://www.openstreetmap.org/?mlat=-8.504&mlon=115.261#map=17/-8.504/115.261"
                target="_blank"
                rel="noreferrer"
              >
                Open larger map
                <span aria-hidden>-</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Write to us</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Send a message.</h2>
              <p className="text-slate-600">
                Tell us dates, group size, and the islands you have in mind. A planner will follow up by email or WhatsApp.
              </p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li>
                  <span className="font-semibold text-slate-900">Private trips:</span> planning@surgaindonesia.travel
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Groups & retreats:</span> groups@surgaindonesia.travel
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Press & partners:</span> press@surgaindonesia.travel
                </li>
              </ul>
            </div>

            <form
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              data-contact-form
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span>Full name *</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span>Email *</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span>Phone or WhatsApp</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+62 812 3456 7890"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span>Topic</span>
                  <input
                    type="text"
                    name="topic"
                    placeholder="Trip idea, change, billing"
                    defaultValue={defaultTopic}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                </label>
              </div>
              <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span>Message *</span>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Share dates, travelers, and any must-see spots."
                  defaultValue={defaultMessage}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  required
                />
              </label>
              <button
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
              <p
                className={`mt-3 text-sm font-semibold ${
                  feedback.status === "success" ? "text-emerald-600" : feedback.status === "error" ? "text-red-600" : "text-slate-600"
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
    </Layout>
  );
}
