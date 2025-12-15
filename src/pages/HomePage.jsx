import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/Layout";
import SiteHeader from "../components/SiteHeader";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { HOLIDAY_GALLERY, HERO_BLURBS, RECOMMENDATIONS, VALUE_PROPS } from "../data/home";
import { buildContactHref } from "../utils/urls";

export default function HomePage() {
  const heroVideo = "videos/bali-video.mp4";
  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [videoFading, setVideoFading] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
      setVideoFading(false);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || prefersReducedMotion) return undefined;

    const handleLoadedMetadata = () => {
      setVideoDuration(videoEl.duration || null);
      setVideoFading(false);
    };

    const handlePlay = () => setVideoFading(false);

    const handleTimeUpdate = () => {
      if (!videoDuration) return;
      const remaining = videoDuration - videoEl.currentTime;
      setVideoFading(remaining <= 1.2);
    };

    videoEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoEl.addEventListener("play", handlePlay);
    videoEl.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoEl.removeEventListener("play", handlePlay);
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoDuration, prefersReducedMotion]);

  const heroCta = useMemo(() => buildContactHref(), []);

  return (
    <Layout currentPage="home" renderHeader={false}>
      <section id="hero" className="relative isolate overflow-hidden bg-slate-900">
        {!prefersReducedMotion ? (
          <div className="absolute inset-0 -z-20">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="photos/dest-bali-penida.jpg"
              style={{ opacity: videoFading ? 0 : 1, transition: "opacity 700ms ease" }}
              aria-hidden="true"
            />
          </div>
        ) : (
          <img
            src="photos/dest-bali-penida.jpg"
            alt="Sunrise on an Indonesian cliffside"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            loading="lazy"
          />
        )}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.55) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <SiteHeader currentPage="home" variant="overlay" />
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-24 lg:flex-row lg:items-center lg:pb-24 lg:pt-28">
            <div className="flex-1 space-y-6 text-white">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Visit Indonesia</h1>
              <div className="grid gap-6 text-sm text-slate-200 sm:grid-cols-2">
                {HERO_BLURBS.map((copy) => (
                  <p key={copy}>{copy}</p>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                {VALUE_PROPS.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/10 p-3 text-sm font-semibold text-white ring-1 ring-white/15">
                    <p className="text-amber-100">{item.title}</p>
                    <p className="text-slate-100/90">{item.copy}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                  href={heroCta}
                >
                  Plan your trip
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                  href="platform.html"
                >
                  View trips
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 opacity-80" aria-hidden />
      </section>

      <div className="bg-[#F7F2E7]">
        <section id="recommendations" className="py-12">
          <div className="mx-auto max-w-6xl px-6 space-y-8">
            <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-lg ring-1 ring-amber-100/80 sm:p-8">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Destination recommendations</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Confident picks for your next trip.</h2>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {RECOMMENDATIONS.map((item) => (
                  <a
                    key={item.title}
                    href={buildContactHref(item.id)}
                    className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    aria-label={`Plan a trip to ${item.location}`}
                  >
                    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-amber-100 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-amber-200/70 group-hover:ring-amber-300">
                      <div className="relative aspect-[4/3] bg-cover bg-center" role="img" aria-label={item.location}>
                        <img src={item.image} alt={item.location} className="h-full w-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-60 transition group-hover:opacity-80" aria-hidden />
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-[0.18em] text-amber-800">{item.title}</p>
                          <p className="text-lg font-semibold">{item.location}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-amber-700">
                          <span>{item.duration}</span>
                          <span className="text-right">{item.price}</span>
                        </div>
                        <p className="text-sm text-slate-700">{item.description}</p>
                        <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
                          <span>Plan this trip</span>
                          <span className="transition group-hover:translate-x-1" aria-hidden>
                            &gt;
                          </span>
                        </div>
                      </div>
                    </article>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Travel and enjoy your holiday</p>
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Choose your fun holiday</h2>
                  <p className="text-slate-600">
                    Tiny islands sit in rings of glassy water. Villages welcome you in, the sea glows turquoise, and every day ends with a slow sunset.
                  </p>
                  <div className="flex flex-col gap-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-600" aria-hidden />
                      Tailored island-hopping itineraries with local guides.
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-600" aria-hidden />
                      Private boat charters and sunrise summit hikes.
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-600" aria-hidden />
                      Reef-safe diving, snorkeling, and cultural tours.
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                      href={buildContactHref()}
                    >
                      Plan your trip
                    </a>
                    <a
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                      href="#recommendations"
                    >
                      View destinations
                    </a>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {HOLIDAY_GALLERY.map((item, index) => (
                    <div key={item.src} className={`overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200 ${index === 0 ? "sm:col-span-2" : ""}`}>
                      {item.type === "video" ? (
                        <video
                          src={item.src}
                          className="h-full w-full object-cover"
                          autoPlay={!prefersReducedMotion}
                          loop={!prefersReducedMotion}
                          muted
                          controls={prefersReducedMotion}
                          playsInline
                          preload="metadata"
                          poster={item.poster}
                        />
                      ) : (
                        <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
