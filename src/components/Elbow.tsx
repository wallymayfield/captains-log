import type { CSSProperties } from "react";

type ElbowProps = {
  corner: "tl" | "bl";
  color?: string;
  label?: string;
};

/**
 * The L-shaped frame piece. Step 2 will expand this into the full
 * primitives library with a showcase route.
 */
export function Elbow({ corner, color, label }: ElbowProps) {
  const style = color
    ? ({ "--elbow-color": color } as CSSProperties)
    : undefined;
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
