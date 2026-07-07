import React from "react";
import { TRUST_STATS } from "../data/trust";

// Numeric proof strip. Flat, rule-topped, serif numerals — matches the destinations-page
// stat strip so the whole site shares one trust language.
export default function TrustStats({ items = TRUST_STATS, tone = "light", className = "" }) {
  const isDark = tone === "dark";
  const labelClass = isDark ? "text-white/55" : "text-slate-500";
  const valueClass = isDark ? "text-white" : "text-[#131b2e]";
  const noteClass = isDark ? "text-white/60" : "text-slate-600";
  const dividerClass = isDark ? "divide-white/10" : "divide-black/10";

  return (
    <dl
      className={`grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 ${dividerClass} ${
        isDark ? "sm:divide-x sm:divide-white/10" : "sm:divide-x sm:divide-black/10"
      } ${className}`}
    >
      {items.map((stat) => (
        <div key={stat.label} className="px-0 py-6 sm:px-6 sm:py-2 sm:first:pl-0">
          <dt className={`font-editorial-label text-[10px] uppercase tracking-[0.24em] ${labelClass}`}>
            {stat.label}
          </dt>
          <dd className={`font-editorial-display mt-2 text-4xl font-bold ${valueClass}`}>{stat.value}</dd>
          {stat.note ? <dd className={`mt-2 text-sm leading-6 ${noteClass}`}>{stat.note}</dd> : null}
        </div>
      ))}
    </dl>
  );
}
