import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useIsDesktop from "../hooks/useIsDesktop";
import { NAV_LINKS } from "../data/navigation";
import { buildContactHref } from "../utils/urls";
import AppLink from "./AppLink";
import OptimizedImage from "./OptimizedImage";

export default function SiteHeader({ currentPage, variant = "solid" }) {
  const [navOpen, setNavOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const location = useLocation();
  const menuButtonRef = useRef(null);
  const navRef = useRef(null);
  const navHidden = !navOpen && !isDesktop;
  const isOverlay = variant === "overlay";

  useEffect(() => {
    if (isDesktop) setNavOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    setNavOpen(false);
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    if (typeof document === "undefined" || !navOpen || isDesktop) return undefined;

    const previousOverflow = document.body.style.overflow;
    const navElement = navRef.current;
    const menuButtonElement = menuButtonRef.current;

    document.body.style.overflow = "hidden";

    const getFocusableElements = () =>
      Array.from(navElement?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') || []);

    const focusFirstElement = () => {
      const [firstFocusable] = getFocusableElements();
      firstFocusable?.focus();
    };

    const frameId = window.requestAnimationFrame(focusFirstElement);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setNavOpen(false);
        menuButtonElement?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (!focusableElements.length) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }

      if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    const handlePointerDown = (event) => {
      if (navElement?.contains(event.target) || menuButtonElement?.contains(event.target)) return;
      setNavOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isDesktop, navOpen]);

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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <AppLink href="/" className="group flex items-center gap-3 shrink-0" aria-label="Surga Indonesia Travel - Home">
          <OptimizedImage
            src="photos/logo.png"
            alt="Surga Indonesia Travel"
            className="h-12 w-auto object-contain sm:h-14 md:h-16"
            fetchPriority="low"
            decoding="async"
            width="64"
            height="64"
          />
          <div className="flex flex-col justify-center leading-[1.05]">
            <p className={logoTitleClass}>Surga Indonesia Travel</p>
            <p className={logoSubtitleClass}>Travel Agency</p>
          </div>
        </AppLink>
        <button
          ref={menuButtonRef}
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
          ref={navRef}
          id="primary-nav"
          className={`absolute left-1/2 top-16 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 transform rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200 transition duration-200 sm:top-20 sm:w-[calc(100%-3rem)] lg:static lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:gap-3 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0 ${
            navOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0 lg:pointer-events-auto lg:scale-100 lg:opacity-100"
          }`}
          hidden={navHidden}
        >
          <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Navigation</p>
            <button
              type="button"
              onClick={() => {
                setNavOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              aria-label="Close menu"
            >
              Close
            </button>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.label.toLowerCase();
              return (
                <AppLink
                  key={link.label}
                  href={link.href}
                  onClick={() => setNavOpen(false)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:px-6 ${
                    isActive ? navLinkActive : navLinkInactive
                  }`}
                >
                  {link.label}
                </AppLink>
              );
            })}
          </div>
          <AppLink
            href={buildContactHref()}
            onClick={() => setNavOpen(false)}
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 lg:mt-0 lg:ml-4"
          >
            Request booking
          </AppLink>
        </nav>
      </div>
    </header>
  );
}
