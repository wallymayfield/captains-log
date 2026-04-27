import type { CSSProperties } from "react";

type RailItem = {
  label: string;
  id: string;
  color: string;
  filler?: boolean;
};

const ITEMS: RailItem[] = [
  { label: "NEW", id: "01-2847", color: "var(--lcars-orange)" },
  { label: "OPEN", id: "02-3361", color: "var(--lcars-peach)" },
  { label: "SAVE", id: "03-4477", color: "var(--lcars-peach)" },
  { label: "EXPORT", id: "04-5102", color: "var(--lcars-tan)" },
  { label: "", id: "05-6630", color: "var(--lcars-pink)", filler: true },
  { label: "STATUS", id: "06-7715", color: "var(--lcars-violet)" },
];

export function LeftRail() {
  return (
    <div className="lcars-rail" role="navigation" aria-label="Primary">
      {ITEMS.map((item) => {
        const style = { "--bar-color": item.color } as CSSProperties;
        return (
          <div
            key={item.id}
            className={
              "lcars-rail__bar" + (item.filler ? " lcars-rail__bar--filler" : "")
            }
            style={style}
          >
            <span>{item.label}</span>
            <span className="lcars-rail__bar-id">{item.id}</span>
          </div>
        );
      })}
    </div>
  );
}
