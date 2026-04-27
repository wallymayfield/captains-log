export const LCARS_COLORS = [
  "orange",
  "peach",
  "pink",
  "violet",
  "blue",
  "tan",
  "red",
] as const;

export type LcarsColor = (typeof LCARS_COLORS)[number];

export function colorVar(color: LcarsColor): string {
  return `var(--lcars-${color})`;
}
