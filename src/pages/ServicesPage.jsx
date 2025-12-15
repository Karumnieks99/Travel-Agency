import React, { useState } from "react";
import Layout from "../components/Layout";
import SiteHeader from "../components/SiteHeader";
import TripDetailModal from "../components/TripDetailModal";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { EXPERIENCE_TYPES, INCLUSIONS, TIMELINE_STEPS, TRIP_OPTIONS } from "../data/trips";
import { buildContactHref } from "../utils/urls";

export default function ServicesPage() {
  const [activeTrip, setActiveTrip] = useState(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleTripOpen = (trip) => setActiveTrip(trip);
  const handleTripClose = () => setActiveTrip(null);

  return (
    <Layout currentPage="trips" renderHeader={false}>
      <section id="overview" className="relative isolate overflow-hidden bg-slate-900 text-white">
        {!prefersReducedMotion ? (
          <div className="absolute inset-0 -z-20">
            <video
              src="/videos/island.mp4"
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/photos/dest-lombok-gili.jpg"
              aria-hidden="true"
            />
          </div>
        ) : (
          <img
            src="/photos/dest-lombok-gili.jpg"
            alt="Island shoreline and clear water"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900/70 via-slate-900/55 to-slate-950/80" aria-hidden />
        <div className="relative z-10">
          <SiteHeader currentPage="trips" variant="overlay" />
          <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 lg:pb-14 lg:pt-20">
            <div className="max-w-3xl space-y-6">
              <p className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100 ring-1 ring-white/20">
                Trips & routes
              </p>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Indonesia trips crafted end-to-end.</h1>
              <p className="text-lg text-slate-100">
                Tell us the islands on your mind. We line up boats, drivers, and guides with buffers so you can wake up and wander.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                  href="#routes"
                >
                  View trips
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                  href={buildContactHref()}
                >
                  Plan my route
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="routes" className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signature trips</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pick a route and we will tailor it to your crew.</h2>
          <p className="max-w-3xl text-slate-600">
            Start with a route that already flows, then stretch the stays, ferry times, and guides so it matches how you like to travel.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TRIP_OPTIONS.map((trip) => (
            <article
              key={trip.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
              role="button"
              tabIndex={0}
              onClick={() => handleTripOpen(trip)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleTripOpen(trip);
                }
              }}
            >
              <div className="aspect-[4/3]">
                <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{trip.duration}</span>
                  <span className="text-right">{trip.region}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{trip.title}</h3>
                <ul className="flex flex-1 flex-col gap-2 text-sm text-slate-700">
                  {trip.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleTripOpen(trip);
                    }}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  >
                    View day-by-day
                  </button>
                  <a
                    className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    href={buildContactHref(trip.id)}
                    onClick={(event) => event.stopPropagation()}
                  >
                    Plan this route
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="inclusions" className="bg-gradient-to-b from-white via-amber-50/40 to-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800 ring-1 ring-amber-200">
                Included in every trip
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">We run logistics so you can stay in the moment.</h2>
              <p className="max-w-3xl text-slate-600">
                Boats, drivers, guides, permits, and stays are pre-arranged with buffers for weather. You get one point of contact before and during travel.
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
                  <span aria-hidden>•</span>
                  <span>Plan A/B/C ready</span>
                  <span aria-hidden>•</span>
                  <span>Local vetted crews</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">How planning works</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">One itinerary, built together.</h2>
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
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <span className="inline-flex h-2 w-2 items-center justify-center rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(251,191,36,0.2)] animate-pulse" aria-hidden />
                    <span>{step.label}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.copy}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700/90">
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

      <section className="bg-amber-50 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Need a custom route?</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Let us shape the right Indonesia trip together.</h2>
            <p className="max-w-2xl text-slate-700">
              Mix islands, add free days, or build around a celebration. We will propose a route and handle the moving pieces.
            </p>
          </div>
          <a
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            href={buildContactHref()}
          >
            Start the conversation
          </a>
        </div>
      </section>
      <TripDetailModal trip={activeTrip} onClose={handleTripClose} />
    </Layout>
  );
}
