import type { CSSProperties, ReactNode } from "react";
import { colorVar, type LcarsColor } from "@/lib/lcars-colors";
import { lcarsId } from "@/lib/lcars-id";

type BarProps = {
  label?: string;
  color?: LcarsColor;
  roundLeft?: boolean;
  roundRight?: boolean;
  grow?: boolean;
  refId?: string;
  showId?: boolean;
  className?: string;
  children?: ReactNode;
};

export function Bar({
  label,
  color = "orange",
  roundLeft,
  roundRight,
  grow,
  refId,
  showId = true,
  className,
  children,
}: BarProps) {
  const id =
    refId ?? (label && showId ? lcarsId(`bar:${label}`) : undefined);
  const style = {
    "--bar-color": colorVar(color),
    ...(grow ? { flex: "1 1 auto" } : null),
  } as CSSProperties;
  const cls = [
    "lcars-bar",
    roundLeft ? "lcars-bar--round-l" : "",
    roundRight ? "lcars-bar--round-r" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} style={style}>
      {label ? <span className="lcars-bar__label">{label}</span> : null}
      {children}
      {id ? <span className="lcars-bar__id">{id}</span> : null}
    </div>
  );
}
