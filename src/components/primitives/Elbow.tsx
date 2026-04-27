import type { CSSProperties } from "react";
import { colorVar, type LcarsColor } from "@/lib/lcars-colors";

export type ElbowCorner = "tl" | "tr" | "bl" | "br";

type ElbowProps = {
  corner: ElbowCorner;
  color?: LcarsColor;
  label?: string;
};

export function Elbow({ corner, color = "orange", label }: ElbowProps) {
  const style = { "--elbow-color": colorVar(color) } as CSSProperties;
  return (
    <div
      className={`lcars-elbow lcars-elbow--${corner}`}
      style={style}
      aria-hidden="true"
    >
      {label ? <span className="lcars-elbow__label">{label}</span> : null}
    </div>
  );
}
