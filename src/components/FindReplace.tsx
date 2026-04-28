import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  body: string;
  onChange: (next: string) => void;
  onClose: () => void;
};

export function FindReplace({ open, body, onChange, onClose }: Props) {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [matches, setMatches] = useState(0);
  const findRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Focus the find input shortly after mount so the input is ready.
      setTimeout(() => findRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    if (!find) {
      setMatches(0);
      return;
    }
    try {
      const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(escaped, "g");
      setMatches((body.match(re) ?? []).length);
    } catch {
      setMatches(0);
    }
  }, [find, body]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const replaceAll = () => {
    if (!find) return;
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escaped, "g");
    onChange(body.replace(re, replace));
  };

  return (
    <div className="lcars-find" role="dialog" aria-label="Find and replace">
      <div className="lcars-find__row">
        <span className="lcars-find__label">Find</span>
        <input
          ref={findRef}
          type="text"
          className="lcars-find__input"
          value={find}
          onChange={(e) => setFind(e.target.value)}
          spellCheck={false}
        />
        <span className="lcars-find__count">
          {find ? `${matches} match${matches === 1 ? "" : "es"}` : ""}
        </span>
      </div>
      <div className="lcars-find__row">
        <span className="lcars-find__label">Replace</span>
        <input
          type="text"
          className="lcars-find__input"
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
          spellCheck={false}
        />
        <button
          type="button"
          className="lcars-find__btn"
          onClick={replaceAll}
          disabled={!find}
        >
          Replace all
        </button>
        <button
          type="button"
          className="lcars-find__btn lcars-find__btn--close"
          onClick={onClose}
          aria-label="Close find"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
