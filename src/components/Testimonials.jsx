import React from "react";
import { TESTIMONIALS } from "../data/trust";

function StarRow({ tone }) {
  const color = tone === "dark" ? "text-[#ffdcc3]" : "text-[#8d4b00]";
  return (
    <div className={`flex items-center gap-1 ${color}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>
          star
        </span>
      ))}
    </div>
  );
}

function Quote({ item, tone }) {
  const isDark = tone === "dark";
  const panel = isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-white";
  const quoteText = isDark ? "text-white" : "text-[#131b2e]";
  const nameText = isDark ? "text-white" : "text-[#131b2e]";
  const metaText = isDark ? "text-white/55" : "text-slate-500";
  const ruleClass = isDark ? "border-white/10" : "border-black/10";

  return (
    <figure className={`flex h-full flex-col border ${panel} p-6 md:p-8`}>
      <StarRow tone={tone} />
      <blockquote className={`font-editorial-serif mt-5 flex-1 text-xl italic leading-8 ${quoteText}`}>
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption className={`mt-6 border-t ${ruleClass} pt-5`}>
        <div className={`text-sm font-semibold ${nameText}`}>
          {item.name}
          {item.location ? <span className={`font-normal ${metaText}`}> · {item.location}</span> : null}
        </div>
        <div className={`font-editorial-label mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.2em] ${metaText}`}>
          <span>{item.trip}</span>
          {item.date ? (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>{item.date}</span>
            </>
          ) : null}
          {item.specialist ? (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>Planned with {item.specialist}</span>
            </>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}

// Reusable social proof. `count` picks how many quotes to show; `startIndex` lets different
// pages surface different reviews so the site doesn't repeat the same quote everywhere.
export default function Testimonials({
  items = TESTIMONIALS,
  tone = "light",
  count = 3,
  startIndex = 0,
  className = "",
}) {
  const shown = [];
  for (let i = 0; i < Math.min(count, items.length); i += 1) {
    shown.push(items[(startIndex + i) % items.length]);
  }

  const columns = shown.length >= 3 ? "lg:grid-cols-3" : shown.length === 2 ? "sm:grid-cols-2" : "";

  return (
    <div className={`grid gap-6 ${columns} ${className}`}>
      {shown.map((item) => (
        <Quote key={`${item.name}-${item.trip}`} item={item} tone={tone} />
      ))}
    </div>
  );
}
