import React, { useEffect, useState } from "react";
import { buildContactHref } from "../utils/urls";

export default function TripDetailModal({ trip, onClose }) {
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    if (!trip) return undefined;
    setExpandedDay(null);
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [trip, onClose]);

  if (!trip) return null;

  const itinerary = trip.itinerary || [];

  const toggleDay = (index) => setExpandedDay((prev) => (prev === index ? null : index));

  return (
    <section className="bg-white">
      <header className="relative">
        <div className="h-[260px] sm:h-[340px] lg:h-[420px]">
          <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/35 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 pb-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              {trip.duration} / {trip.region}
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">{trip.title}</h1>
            {trip.summary ? <p className="max-w-3xl text-sm text-slate-100/90">{trip.summary}</p> : null}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{trip.region}</p>
            <h2 className="text-2xl font-semibold text-slate-900">Day-by-day itinerary</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            Back to trips
          </button>
        </div>

        {trip.details ? (
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Trip details</p>
            <p className="mt-2 text-sm text-slate-700">{trip.details}</p>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Itinerary</p>
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
              {itinerary.map((day, index) => {
                const open = expandedDay === index;
                return (
                  <button
                    type="button"
                    key={`${day.label}-${day.title}`}
                    onClick={() => toggleDay(index)}
                    className="w-full text-left"
                    aria-expanded={open}
                  >
                    <div className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">{day.label}</p>
                        <p className="text-sm font-semibold leading-snug text-slate-900">{day.title}</p>
                      </div>
                      <span
                        className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                          open ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500"
                        }`}
                        aria-hidden
                      >
                        {open ? "-" : "+"}
                      </span>
                    </div>
                    {open && <p className="px-4 pb-4 text-sm text-slate-700">{day.detail}</p>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Highlights</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {trip.highlights?.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-600" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            href={buildContactHref(trip.id)}
          >
            Plan this route
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            Back to trips
          </button>
        </div>
      </div>
    </section>
  );
}
