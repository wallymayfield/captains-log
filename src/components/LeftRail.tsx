import { Bar, Pill } from "@/components/primitives";
import type { LcarsColor } from "@/lib/lcars-colors";
import { navigate } from "@/lib/use-hash-route";

type RailItem = {
  label: string;
  color: LcarsColor;
  filler?: boolean;
};

const ITEMS: RailItem[] = [
  { label: "NEW", color: "orange" },
  { label: "OPEN", color: "peach" },
  { label: "SAVE", color: "peach" },
  { label: "EXPORT", color: "tan" },
  { label: "", color: "pink", filler: true },
  { label: "STATUS", color: "violet" },
];

export function LeftRail() {
  return (
    <div className="lcars-rail" role="navigation" aria-label="Primary">
      {ITEMS.map((item, i) =>
        item.filler ? (
          <Bar key={i} color={item.color} grow showId={false} />
        ) : (
          <Bar key={i} label={item.label} color={item.color} />
        ),
      )}
      {import.meta.env.DEV ? (
        <Pill
          label="PRIMITIVES"
          color="blue"
          onClick={() => navigate("showcase")}
        />
      ) : null}
    </div>
  );
}
