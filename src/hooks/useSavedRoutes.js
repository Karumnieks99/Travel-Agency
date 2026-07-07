import { useCallback, useEffect, useState } from "react";

// localStorage-backed wishlist of trip ids. No backend — the honest static-site equivalent
// of a "my account", and it keeps every mounted component in sync via a custom event
// (the native `storage` event only fires in *other* tabs).
const STORAGE_KEY = "surga:saved-routes";
const CHANGE_EVENT = "surga:saved-routes-change";

function readSaved() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeSaved(ids) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore quota / private-mode write failures */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: ids }));
}

export default function useSavedRoutes() {
  const [saved, setSaved] = useState(readSaved);

  useEffect(() => {
    const sync = () => setSaved(readSaved());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id) => {
    if (!id) return;
    const current = readSaved();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    writeSaved(next);
    setSaved(next);
  }, []);

  const remove = useCallback((id) => {
    const current = readSaved();
    if (!current.includes(id)) return;
    const next = current.filter((item) => item !== id);
    writeSaved(next);
    setSaved(next);
  }, []);

  const clear = useCallback(() => {
    writeSaved([]);
    setSaved([]);
  }, []);

  const isSaved = useCallback((id) => saved.includes(id), [saved]);

  return { saved, isSaved, toggle, remove, clear, count: saved.length };
}
