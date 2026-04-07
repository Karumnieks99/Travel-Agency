import React, { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import AppLink from "./AppLink";
import BackToTopButton from "./BackToTopButton";
import SiteHeader from "./SiteHeader";
import MobileWhatsAppButton from "./MobileWhatsAppButton";
import { buildContactHref } from "../utils/urls";
import { LEGAL_NAV } from "../data/legal";
import OptimizedImage from "./OptimizedImage";

const scrollPositions = new Map();

export default function Layout({
  currentPage,
  children,
  renderHeader = true,
  headerVariant = "solid",
  renderFooter = true,
}) {
  const year = useMemo(() => new Date().getFullYear(), []);
  const location = useLocation();
  const navigationType = useNavigationType();
  const mainRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.history?.scrollRestoration) return undefined;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const scrollKey = location.key || `${location.pathname}${location.search}`;

    const focusHashTarget = () => {
      const targetId = decodeURIComponent(location.hash.slice(1));
      if (!targetId) return false;

      const target = document.getElementById(targetId);
      if (!target) return false;

      const hadTabIndex = target.hasAttribute("tabindex");
      const previousTabIndex = target.getAttribute("tabindex");

      if (!hadTabIndex) {
        target.setAttribute("tabindex", "-1");
      }

      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start" });

      return () => {
        if (!hadTabIndex) {
          target.removeAttribute("tabindex");
          return;
        }

        if (previousTabIndex !== null) {
          target.setAttribute("tabindex", previousTabIndex);
        }
      };
    };

    let restoreTargetFocus;
    const frameId = window.requestAnimationFrame(() => {
      const restoreHashTarget = location.hash ? focusHashTarget() : false;

      if (restoreHashTarget) {
        restoreTargetFocus = restoreHashTarget;
        return;
      }

      if (navigationType === "POP") {
        const savedScrollTop = scrollPositions.get(scrollKey);

        if (typeof savedScrollTop === "number") {
          window.scrollTo({ top: savedScrollTop, left: 0, behavior: "auto" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      mainRef.current?.focus({ preventScroll: true });
    });

    return () => {
      scrollPositions.set(scrollKey, window.scrollY);
      window.cancelAnimationFrame(frameId);
      restoreTargetFocus?.();
    };
  }, [location.hash, location.key, location.pathname, location.search, navigationType]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-amber-100 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-amber-800"
      >
        Skip to content
      </a>

      {renderHeader && <SiteHeader currentPage={currentPage} variant={headerVariant} />}

      <main id="main" ref={mainRef} tabIndex={-1} className="pb-16 focus:outline-none">
        {children}
      </main>

      {renderFooter ? (
        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-4 text-center lg:flex-row lg:items-center lg:text-left">
              <div className="flex items-center gap-3">
                <OptimizedImage
                  src="photos/logo.png"
                  alt="Surga Indonesia Travel"
                  className="h-9 w-9 rounded-lg object-cover"
                  loading="lazy"
                  decoding="async"
                  width="36"
                  height="36"
                />
                <p className="whitespace-normal text-xs font-semibold uppercase leading-tight tracking-[0.2em] text-slate-500 lg:whitespace-nowrap">
                  Surga Indonesia Travel - Discover the Spirit of Indonesia
                </p>
              </div>
              <p className="text-sm text-slate-500">(c) {year} Surga Indonesia Travel. All rights reserved.</p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-700 lg:flex-nowrap lg:gap-4">
                <AppLink className="hover:text-amber-700" href="/">
                  Home
                </AppLink>
                <AppLink className="hover:text-amber-700" href="/platform.html">
                  Destinations
                </AppLink>
                <AppLink className="hover:text-amber-700" href={buildContactHref()}>
                  Contact
                </AppLink>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-200 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 lg:justify-start">
              {LEGAL_NAV.map((item) => (
                <AppLink key={item.href} className="hover:text-amber-700" href={item.href}>
                  {item.label}
                </AppLink>
              ))}
            </div>
          </div>
        </footer>
      ) : null}

      <MobileWhatsAppButton />
      <BackToTopButton />
    </div>
  );
}
