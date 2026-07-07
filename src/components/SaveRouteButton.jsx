import React from "react";
import useSavedRoutes from "../hooks/useSavedRoutes";

const FILLED = { fontVariationSettings: '"FILL" 1' };

// Heart toggle for saving a route to the wishlist.
// `overlay` — icon-only, sits on a card image. `inline` — labeled, for a dark panel (trip page).
export default function SaveRouteButton({ tripId, tripTitle, variant = "overlay", className = "" }) {
  const { isSaved, toggle } = useSavedRoutes();
  const active = isSaved(tripId);
  const label = active ? `Remove ${tripTitle || "this route"} from saved` : `Save ${tripTitle || "this route"}`;

  const handleClick = (event) => {
    // Cards wrap the whole tile in a link; don't navigate when saving.
    event.preventDefault();
    event.stopPropagation();
    toggle(tripId);
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={label}
        className={`inline-flex items-center justify-center gap-2 border px-5 py-4 text-xs font-bold uppercase tracking-[0.24em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3] ${
          active ? "border-[#ffdcc3] bg-[#ffdcc3] text-[#2f1500]" : "border-white/20 text-white hover:bg-white/10"
        } ${className}`}
      >
        <span className="material-symbols-outlined text-base" style={active ? FILLED : undefined} aria-hidden="true">
          {active ? "favorite" : "favorite_border"}
        </span>
        {active ? "Saved to wishlist" : "Save this route"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center border shadow-sm backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d4b00] ${
        active
          ? "border-[#8d4b00] bg-[#8d4b00] text-white hover:bg-[#b15f00]"
          : "border-black/10 bg-white/85 text-[#131b2e] hover:bg-white"
      } ${className}`}
    >
      <span className="material-symbols-outlined text-xl" style={active ? FILLED : undefined} aria-hidden="true">
        {active ? "favorite" : "favorite_border"}
      </span>
    </button>
  );
}
