import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AppLink from "./AppLink";
import OptimizedImage from "./OptimizedImage";
import useSavedRoutes from "../hooks/useSavedRoutes";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { TRIP_OPTIONS } from "../data/trips";
import { buildContactHref, buildTripHref } from "../utils/urls";

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatPrice(priceFrom) {
  return typeof priceFrom === "number" ? USD_FORMATTER.format(priceFrom) : "Quote on request";
}

// Header trigger + slide-over wishlist. Rendered in SiteHeader, so it rides along on every page.
// The panel is portaled to <body> to stay clear of the fixed header's stacking context.
export default function SavedRoutesDrawer({ tone = "dark" }) {
  const { saved, remove, clear, count } = useSavedRoutes();
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const savedTrips = saved.map((id) => TRIP_OPTIONS.find((trip) => trip.id === id)).filter(Boolean);

  useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;

    const getFocusable = () =>
      Array.from(
        panel?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') || []
      );

    const frame = window.requestAnimationFrame(() => {
      const [first] = getFocusable();
      first?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  const triggerClass =
    tone === "light"
      ? "border-black/15 bg-white text-[#131b2e] hover:bg-black hover:text-white"
      : "border-white/20 bg-white/10 text-white hover:bg-white/20";

  const trigger =
    count > 0 ? (
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3] ${triggerClass}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: '"FILL" 1' }} aria-hidden="true">
          favorite
        </span>
        <span className="hidden sm:inline">Saved</span>
        <span aria-label={`${count} saved routes`}>{count}</span>
      </button>
    ) : null;

  const drawer =
    open && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Saved routes">
            <button
              type="button"
              aria-label="Close saved routes"
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-black/50"
              tabIndex={-1}
            />
            <div
              ref={panelRef}
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f8f5ee] shadow-[0_0_60px_rgba(0,0,0,0.35)]"
              style={{
                transform: "translateX(0)",
                animation: prefersReducedMotion ? undefined : "surga-drawer-in 320ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-black/10 bg-[#131b2e] px-6 py-5 text-white">
                <div>
                  <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-white/55">Your shortlist</p>
                  <h2 className="font-editorial-serif text-xl font-bold">Saved routes ({savedTrips.length})</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3]"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {savedTrips.length ? (
                  <ul className="space-y-4">
                    {savedTrips.map((trip) => (
                      <li key={trip.id} className="flex gap-4 border border-black/10 bg-white p-3">
                        <AppLink
                          href={buildTripHref(trip.id)}
                          onClick={() => setOpen(false)}
                          className="relative h-20 w-24 shrink-0 overflow-hidden bg-slate-100"
                        >
                          <OptimizedImage
                            src={trip.image}
                            alt={trip.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                            width="240"
                            height="180"
                          />
                        </AppLink>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <AppLink
                            href={buildTripHref(trip.id)}
                            onClick={() => setOpen(false)}
                            className="font-editorial-serif text-base font-bold leading-tight text-[#131b2e] transition hover:text-[#8d4b00]"
                          >
                            {trip.title}
                          </AppLink>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                            {trip.duration} &middot; From {formatPrice(trip.priceFrom)}
                          </p>
                          <button
                            type="button"
                            onClick={() => remove(trip.id)}
                            className="mt-auto self-start text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8d4b00] transition hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d4b00]"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300" aria-hidden="true">
                      favorite_border
                    </span>
                    <p className="mt-4 font-editorial-serif text-lg font-bold text-[#131b2e]">No saved routes yet</p>
                    <p className="mt-2 max-w-xs text-sm leading-7 text-slate-600">
                      Tap the heart on any destination to keep a shortlist while you plan.
                    </p>
                    <AppLink
                      href="/platform.html"
                      onClick={() => setOpen(false)}
                      className="mt-6 inline-flex items-center justify-center border border-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white"
                    >
                      Browse destinations
                    </AppLink>
                  </div>
                )}
              </div>

              {savedTrips.length ? (
                <div className="space-y-3 border-t border-black/10 bg-white px-6 py-5">
                  <AppLink
                    href={buildContactHref({ source: "saved-routes", topic: `Saved routes shortlist (${savedTrips.length})` })}
                    onClick={() => setOpen(false)}
                    className="inline-flex w-full items-center justify-center bg-[#8d4b00] px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#b15f00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3]"
                  >
                    Enquire about these routes
                  </AppLink>
                  <button
                    type="button"
                    onClick={clear}
                    className="w-full text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-[#8d4b00]"
                  >
                    Clear all
                  </button>
                </div>
              ) : null}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {trigger}
      {drawer}
    </>
  );
}
