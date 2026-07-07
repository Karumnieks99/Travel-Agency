import React from "react";
import OptimizedImage from "./OptimizedImage";
import { SPECIALISTS } from "../data/trust";

// The planning desk. We don't invent stock portraits of people who don't exist — each specialist
// is shown against the region they actually plan, with a flat monogram badge for identity. Honest,
// on-brand (flat, sharp, ink + sand), and it still gives the section a real "meet the team" weight.
export default function SpecialistGrid({ items = SPECIALISTS, className = "" }) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {items.map((person) => (
        <article key={person.name} className="flex h-full flex-col border border-black/10 bg-white">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#131b2e]">
            {person.photo ? (
              <OptimizedImage
                src={person.photo}
                alt={person.photoAlt ?? `Landscape from ${person.regions}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-[#131b2e]/45 to-[#131b2e]/10" aria-hidden="true" />
            <span
              className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center border border-[#ffdcc3]/40 bg-[#131b2e]/85 font-editorial-display text-lg font-bold tracking-tight text-[#ffdcc3]"
              aria-hidden="true"
            >
              {person.initials}
            </span>
            <span className="absolute inset-x-0 bottom-0 px-5 py-3 font-editorial-label text-[10px] uppercase tracking-[0.22em] text-white/80">
              {person.regions}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-editorial-serif text-xl font-bold text-[#131b2e]">{person.name}</h3>
            <p className="font-editorial-label mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8d4b00]">{person.role}</p>
            <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{person.bio}</p>
            <p className="mt-5 border-t border-black/10 pt-4 text-xs leading-6 text-slate-500">
              <span className="font-semibold text-slate-700">Speaks:</span> {person.languages}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
