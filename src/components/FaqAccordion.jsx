import React from "react";
import { FAQ_ITEMS } from "../data/trust";

// Built on native <details>/<summary>: keyboard-accessible and functional without JS,
// styled flat to match the editorial system. Chevron rotates via the group-open state.
export default function FaqAccordion({ items = FAQ_ITEMS, tone = "light", className = "" }) {
  const isDark = tone === "dark";
  const ruleClass = isDark ? "border-white/12" : "border-black/12";
  const questionText = isDark ? "text-white" : "text-[#131b2e]";
  const answerText = isDark ? "text-white/70" : "text-slate-600";
  const chevronText = isDark ? "text-[#ffdcc3]" : "text-[#8d4b00]";

  return (
    <div className={`border-t ${ruleClass} ${className}`}>
      {items.map((item) => (
        <details key={item.question} className={`group border-b ${ruleClass}`}>
          <summary
            className={`flex cursor-pointer list-none items-center justify-between gap-6 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d4b00] [&::-webkit-details-marker]:hidden`}
          >
            <span className={`font-editorial-serif text-lg font-bold leading-snug md:text-xl ${questionText}`}>
              {item.question}
            </span>
            <span
              className={`material-symbols-outlined shrink-0 transition-transform duration-300 group-open:rotate-180 ${chevronText}`}
              aria-hidden="true"
            >
              expand_more
            </span>
          </summary>
          <p className={`max-w-3xl pb-6 text-base leading-7 ${answerText}`}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
