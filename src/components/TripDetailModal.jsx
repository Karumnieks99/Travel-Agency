import React, { useEffect, useRef, useState } from "react";
import { buildContactHref } from "../utils/urls";

export default function TripDetailModal({ trip, onClose }) {
  const dialogRef = useRef(null);
  const [expandedDay, setExpandedDay] = useState(null);

  useEffect(() => {
    if (!trip) return undefined;
    setExpandedDay(null);
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previouslyFocused = document.activeElement;
    const focusTarget = dialogRef.current?.querySelector("button, [href], [tabindex]");
    focusTarget?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [trip, onClose]);

  if (!trip) return null;

  const itinerary = trip.itinerary || [];

  const toggleDay = (index) => setExpandedDay((prev) => (prev === index ? null : index));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 px-4 py-8 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-detail-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 h-[90vh] md:h-[88vh] max-h-[96vh] md:max-h-[94vh]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        >
          Close
        </button>
        <div className="grid h-full min-h-0 md:grid-cols-[1.05fr_1.15fr]">
          <div className="relative h-[260px] min-h-[200px] md:h-full">
            <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                {trip.duration} / {trip.region}
              </p>
              <p className="text-lg font-semibold">{trip.title}</p>
            </div>
          </div>
          <div className="flex h-full min-h-0 flex-col gap-2 p-5 md:p-5 overflow-y-auto pr-2">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{trip.region}</p>
              <h3 id="trip-detail-title" className="text-2xl font-semibold text-slate-900">
                {trip.title}
              </h3>
            </div>
            <div className="rounded-2xl bg-slate-50 p-2.5 ring-1 ring-slate-200">
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
            <div className="flex-1 space-y-2 overflow-hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Itinerary</p>
              <div className="divide-y divide-slate-200 overflow-auto rounded-2xl border border-slate-200 pr-1 max-h-[70vh] md:max-h-[80vh]">
                {itinerary.map((day, index) => {
                  const open = expandedDay === index;
                  return (
                    <button
                      type="button"
                      key={day.label}
                      onClick={() => toggleDay(index)}
                      className="w-full text-left"
                      aria-expanded={open}
                    >
                      <div className="flex items-start justify-between gap-3 px-3 py-2 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">{day.label}</p>
                          <p className="text-sm font-semibold leading-snug text-slate-900">{day.title}</p>
                        </div>
                        <span
                          className={`mt-2 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                            open ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500"
                          }`}
                          aria-hidden
                        >
                          {open ? "-" : "+"}
                        </span>
                      </div>
                      {open && <p className="px-3 pb-3 text-sm text-slate-700">{day.detail}</p>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between sticky bottom-0 bg-white pb-2">
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
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
