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
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
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
  onClick,
  disabled,
  ariaLabel,
  children,
}: BarProps) {
  const id =
    refId ?? (label && showId ? lcarsId(`bar:${label}`) : undefined);
  const style = {
    "--bar-color": colorVar(color),
    ...(grow ? { flex: "1 1 auto" } : null),
  } as CSSProperties;
  const interactive = onClick !== undefined;
  const cls = [
    "lcars-bar",
    roundLeft ? "lcars-bar--round-l" : "",
    roundRight ? "lcars-bar--round-r" : "",
    interactive ? "lcars-bar--interactive" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {label ? <span className="lcars-bar__label">{label}</span> : null}
      {children}
      {id ? <span className="lcars-bar__id">{id}</span> : null}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        className={cls}
        style={style}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
      >
        {content}
      </button>
    );
  }
  return (
    <div className={cls} style={style}>
      {content}
    </div>
  );
}
