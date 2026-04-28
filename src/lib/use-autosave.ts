import { useEffect, useRef } from "react";
import type { Doc } from "@/lib/document";

const KEY = "captains-log:draft";
const SAVE_INTERVAL_MS = 1500;

type Snapshot = {
  doc: Doc;
  path: string | null;
  savedAt: number;
};

export function loadDraft(): Snapshot | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Record<string, unknown>;
    const d = p["doc"] as Record<string, unknown> | undefined;
    if (
      !d ||
      typeof d["title"] !== "string" ||
      typeof d["date"] !== "string" ||
      typeof d["excerpt"] !== "string" ||
      typeof d["body"] !== "string"
    ) {
      return null;
    }
    return {
      doc: {
        title: d["title"],
        date: d["date"],
        excerpt: d["excerpt"],
        body: d["body"],
      },
      path: typeof p["path"] === "string" ? p["path"] : null,
      savedAt: typeof p["savedAt"] === "number" ? p["savedAt"] : 0,
    };
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* unavailable */
  }
}

// Persist `doc` + `path` to localStorage, debounced. Cleared by
// callers when a fresh new() doc replaces working state.
export function useAutosave(doc: Doc, path: string | null): void {
  const lastWritten = useRef<string>("");

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const payload = JSON.stringify({
          doc,
          path,
          savedAt: Date.now(),
        });
        if (payload !== lastWritten.current) {
          localStorage.setItem(KEY, payload);
          lastWritten.current = payload;
        }
      } catch {
        /* localStorage unavailable */
      }
    }, SAVE_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [doc, path]);
}
