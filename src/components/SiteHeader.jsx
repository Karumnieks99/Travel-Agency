import React, { useEffect, useState } from "react";
import useIsDesktop from "../hooks/useIsDesktop";
import { NAV_LINKS } from "../data/navigation";
import { buildContactHref } from "../utils/urls";

export default function SiteHeader({ currentPage, variant = "solid" }) {
  const [navOpen, setNavOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const navHidden = !navOpen && !isDesktop;
  const isOverlay = variant === "overlay";

  useEffect(() => {
    if (isDesktop) setNavOpen(false);
  }, [isDesktop]);

  const headerClasses = isOverlay
    ? "sticky top-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur"
    : "sticky top-0 z-50 border-b border-white/10 bg-white/80 shadow-sm backdrop-blur";

  const logoTitleClass = isOverlay
    ? "text-sm font-semibold tracking-tight text-white"
    : "text-sm font-semibold tracking-tight";
  const logoSubtitleClass = isOverlay ? "text-xs text-slate-200" : "text-xs text-slate-500";

  const navLinkActive = isOverlay
    ? "bg-amber-100 text-amber-900 lg:bg-white/15 lg:text-white"
    : "bg-amber-100 text-amber-900";

  const navLinkInactive = isOverlay
    ? "text-slate-700 hover:bg-slate-100 hover:text-amber-700 lg:text-white lg:hover:bg-white/10 lg:hover:text-yellow-400"
    : "text-slate-700 hover:bg-slate-100 hover:text-yellow-500";

  const menuButtonClass = isOverlay
    ? "inline-flex items-center gap-2 rounded-lg border border-white/40 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 lg:hidden"
    : "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 lg:hidden";

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 h-20">
        <a href="index.html" className="group flex items-center gap-3 shrink-0" aria-label="Surga Indonesia Travel - Home">
          <img src="/photos/logo.png" alt="Surga Indonesia Travel" className="h-14 md:h-16 w-auto object-contain" />
          <div className="flex flex-col justify-center leading-[1.05]">
            <p className={logoTitleClass}>Surga Indonesia Travel</p>
            <p className={logoSubtitleClass}>Travel Agency</p>
          </div>
        </a>
        <button
          type="button"
          aria-expanded={navOpen}
          aria-controls="primary-nav"
          onClick={() => setNavOpen((open) => !open)}
          className={menuButtonClass}
        >
          <span>Menu</span>
          <span className="h-px w-5 bg-current" aria-hidden />
        </button>

        <nav
          id="primary-nav"
          className={`absolute left-1/2 top-20 w-[calc(100%-3rem)] max-w-xl -translate-x-1/2 transform rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200 transition duration-200 lg:static lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:gap-3 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0 ${
            navOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0 lg:pointer-events-auto lg:scale-100 lg:opacity-100"
          }`}
          hidden={navHidden}
        >
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.label.toLowerCase();
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setNavOpen(false)}
                  className={`rounded-lg px-6 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
                    isActive ? navLinkActive : navLinkInactive
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
          <a
            href={buildContactHref()}
            onClick={() => setNavOpen(false)}
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 lg:mt-0 lg:ml-4"
          >
            Plan your trip
          </a>
        </nav>
      </div>
    </header>
  );
}
