import type { CSSProperties } from "react";
import { colorVar, type LcarsColor } from "@/lib/lcars-colors";
import { lcarsId } from "@/lib/lcars-id";

type PillProps = {
  label: string;
  color?: LcarsColor;
  refId?: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export function Pill({
  label,
  color = "orange",
  refId,
  onClick,
  disabled,
  ariaLabel,
}: PillProps) {
  const id = refId ?? lcarsId(`pill:${label}`);
  const style = { "--pill-color": colorVar(color) } as CSSProperties;
  return (
    <button
      type="button"
      className="lcars-pill"
      style={style}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
    >
      <span className="lcars-pill__label">{label}</span>
      <span className="lcars-pill__id">{id}</span>
    </button>
  );
}
