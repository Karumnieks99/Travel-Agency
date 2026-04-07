import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useIsDesktop from "../hooks/useIsDesktop";
import { NAV_LINKS } from "../data/navigation";
import { buildContactHref } from "../utils/urls";
import AppLink from "./AppLink";
import OptimizedImage from "./OptimizedImage";

export default function SiteHeader({
  currentPage,
  variant = "solid",
  navLinks = NAV_LINKS,
  forceLightNav = false,
  ctaHref,
  ctaLabel,
  showCta = true,
  brandTitle = "Surga Indonesia Travel",
  brandSubtitle = undefined,
}) {
  const [navOpen, setNavOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const location = useLocation();
  const menuButtonRef = useRef(null);
  const navRef = useRef(null);
  const isTrip = variant === "trip";
  const navHidden = !navOpen && !isDesktop;
  const isOverlay = variant === "overlay";
  const isEditorial = variant === "editorial";
  const showMenuButton = isTrip ? !isDesktop : true;
  const useHighContrastEditorialNav = isEditorial && forceLightNav;

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
  }, [isDesktop, isTrip, navOpen]);

  const headerClasses = isTrip
    ? "sticky top-0 z-50"
    : isEditorial
      ? "sticky top-0 z-50 border-b border-white/10 bg-[#0d171b]/40 backdrop-blur-md"
      : isOverlay
        ? "sticky top-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur"
        : "sticky top-0 z-50 border-b border-white/10 bg-white/80 shadow-sm backdrop-blur";

  const logoTitleClass = isTrip
    ? "font-editorial-serif text-2xl font-bold text-white"
    : isEditorial
      ? "font-editorial-serif text-2xl font-bold tracking-tight text-[#f5efe4]"
      : isOverlay
        ? "text-sm font-semibold tracking-tight text-white"
        : "text-sm font-semibold tracking-tight";

  const logoSubtitleClass = isTrip
    ? "font-editorial-label text-[10px] uppercase tracking-[0.32em] text-white/55"
    : isEditorial
      ? "font-editorial-label text-[10px] uppercase tracking-[0.32em] text-white/55"
      : isOverlay
        ? "text-xs text-slate-200"
        : "text-xs text-slate-500";

  const navLinkActive = isTrip
    ? "border-b-2 border-[#ffdcc3] pb-1 text-white"
    : isEditorial
      ? "border-b-2 border-[#ffdcc3] text-white"
      : isOverlay
        ? "bg-amber-100 text-amber-900 lg:bg-white/15 lg:text-white"
        : "bg-amber-100 text-amber-900";

  const navLinkInactive = isTrip
    ? "text-white/72 transition-colors duration-300 hover:text-[#ffdcc3]"
    : useHighContrastEditorialNav
      ? "text-white hover:text-[#ffdcc3]"
      : isEditorial
        ? "text-white hover:text-[#ffdcc3] lg:text-white/72"
      : isOverlay
        ? "text-slate-700 hover:bg-slate-100 hover:text-amber-700 lg:text-white lg:hover:bg-white/10 lg:hover:text-yellow-400"
        : "text-slate-700 hover:bg-slate-100 hover:text-yellow-500";

  const menuButtonClass = isEditorial || isTrip
    ? "inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3] lg:hidden"
    : isOverlay
      ? "inline-flex items-center gap-2 rounded-lg border border-white/40 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 lg:hidden"
      : "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 lg:hidden";

  const navShellClasses = isTrip
    ? `absolute left-1/2 top-20 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 transform border border-white/10 bg-[#112127] p-4 shadow-[0_24px_48px_rgba(0,0,0,0.3)] transition duration-200 sm:w-[calc(100%-3rem)] lg:static lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
        navOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0 lg:pointer-events-auto lg:scale-100 lg:opacity-100"
      }`
    : isEditorial
      ? `absolute left-1/2 top-20 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 transform border border-white/10 bg-[#112127] p-4 shadow-[0_24px_48px_rgba(0,0,0,0.3)] transition duration-200 sm:w-[calc(100%-3rem)] lg:static lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
          navOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0 lg:pointer-events-auto lg:scale-100 lg:opacity-100"
        }`
      : `absolute left-1/2 top-16 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 transform rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200 transition duration-200 sm:top-20 sm:w-[calc(100%-3rem)] lg:static lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:gap-3 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0 ${
          navOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0 lg:pointer-events-auto lg:scale-100 lg:opacity-100"
        }`;

  const navLinkBase = isTrip
    ? "block py-2 font-editorial-serif text-lg tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d4b00] lg:py-0"
    : isEditorial
      ? "border-b-2 border-transparent px-0 py-2 font-editorial-serif text-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3]"
      : "rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:px-6";

  const resolvedBrandSubtitle =
    brandSubtitle !== undefined ? brandSubtitle : isEditorial ? "Luxury archipelago routes" : "Travel Agency";

  const resolvedCtaHref = ctaHref ?? buildContactHref();
  const resolvedCtaLabel = ctaLabel ?? "Start planning";

  const ctaClass = isEditorial
    ? "mt-3 inline-flex items-center justify-center bg-[#8d4b00] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#b15f00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3] lg:mt-0 lg:ml-4"
    : "mt-3 inline-flex items-center justify-center rounded-lg bg-[#8d4b00] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b15f00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3] lg:mt-0 lg:ml-4";

  const navLabelClass = isEditorial || isTrip
    ? "text-xs font-semibold uppercase tracking-[0.18em] text-white/50"
    : "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500";

  const closeButtonClass = isEditorial || isTrip
    ? "inline-flex items-center justify-center border border-white/15 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3]"
    : "inline-flex items-center justify-center border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500";

  const containerClass = isTrip
    ? "mx-auto flex max-w-screen-2xl items-center justify-between gap-6 px-6 py-5 xl:pl-28 xl:pr-12"
    : `mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 ${isEditorial ? "max-w-7xl py-5" : "h-16 max-w-6xl sm:h-20"}`;

  const brandLinkClass = isEditorial || isTrip ? "shrink-0" : "group flex shrink-0 items-center gap-3";

  const navItemsClass = isTrip
    ? "flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-10"
    : `flex flex-col gap-2 lg:flex-row lg:items-center ${isEditorial ? "lg:gap-8" : "lg:gap-3"}`;

  return (
    <header className={headerClasses}>
      <div className={containerClass}>
        <AppLink href="/" className={brandLinkClass} aria-label="Surga Indonesia Travel - Home">
          {isEditorial || isTrip ? (
            <div className="flex flex-col justify-center leading-none">
              <p className={logoTitleClass}>{brandTitle}</p>
              {resolvedBrandSubtitle ? <p className={logoSubtitleClass}>{resolvedBrandSubtitle}</p> : null}
            </div>
          ) : (
            <>
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
                <p className={logoTitleClass}>{brandTitle}</p>
                {resolvedBrandSubtitle ? <p className={logoSubtitleClass}>{resolvedBrandSubtitle}</p> : null}
              </div>
            </>
          )}
        </AppLink>
        {showMenuButton ? (
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
        ) : null}

        <nav ref={navRef} id="primary-nav" className={navShellClasses} hidden={navHidden}>
          <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
            <p className={navLabelClass}>Navigation</p>
            <button
              type="button"
              onClick={() => {
                setNavOpen(false);
                menuButtonRef.current?.focus();
              }}
              className={closeButtonClass}
              aria-label="Close menu"
            >
              Close
            </button>
          </div>
          <div className={navItemsClass}>
            {navLinks.map((link) => {
              const isActive = currentPage === (link.pageKey ?? link.label.toLowerCase());
              return (
                <AppLink
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={() => setNavOpen(false)}
                  className={`${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`}
                >
                  {link.label}
                </AppLink>
              );
            })}
          </div>
          {showCta ? (
            <AppLink href={resolvedCtaHref} onClick={() => setNavOpen(false)} className={ctaClass}>
              {resolvedCtaLabel}
            </AppLink>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
