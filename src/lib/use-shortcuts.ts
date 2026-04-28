import { useEffect, useRef } from "react";

export type ShortcutHandlers = {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onTogglePreview: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onFind: () => void;
};

// Cmd/Ctrl-modified shortcuts. Handlers are read through a ref so
// the listener doesn't need to re-bind every render.
export function useShortcuts(handlers: ShortcutHandlers): void {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      const h = ref.current;

      if (key === "n" && !e.shiftKey) {
        e.preventDefault();
        h.onNew();
      } else if (key === "o" && !e.shiftKey) {
        e.preventDefault();
        h.onOpen();
      } else if (key === "s" && !e.shiftKey) {
        e.preventDefault();
        h.onSave();
      } else if (key === "s" && e.shiftKey) {
        e.preventDefault();
        h.onSaveAs();
      } else if (key === "p" && !e.shiftKey) {
        e.preventDefault();
        h.onTogglePreview();
      } else if (key === "," && !e.shiftKey) {
        e.preventDefault();
        h.onOpenSettings();
      } else if (key === "/" && !e.shiftKey) {
        e.preventDefault();
        h.onOpenHelp();
      } else if (key === "f" && !e.shiftKey) {
        e.preventDefault();
        h.onFind();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
