import type { CSSProperties, ReactNode } from "react";
import { colorVar, type LcarsColor } from "@/lib/lcars-colors";

type CellProps = {
  label: string;
  value: ReactNode;
  color?: LcarsColor;
};

export function Cell({ label, value, color }: CellProps) {
  const style = color
    ? ({ "--cell-color": colorVar(color) } as CSSProperties)
    : undefined;
  return (
    <div className="lcars-cell" style={style}>
      <span className="lcars-cell__label">{label}</span>
      <span className="lcars-cell__value">{value}</span>
    </div>
  );
}
