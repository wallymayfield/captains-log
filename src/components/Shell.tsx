import type { ReactNode } from "react";

type ShellProps = {
  topLeft: ReactNode;
  topBar: ReactNode;
  rail: ReactNode;
  stage: ReactNode;
  bottomLeft: ReactNode;
  bottomBar: ReactNode;
  alert?: boolean;
};

export function Shell({
  topLeft,
  topBar,
  rail,
  stage,
  bottomLeft,
  bottomBar,
  alert,
}: ShellProps) {
  const cls = "lcars-shell" + (alert ? " lcars-shell--alert" : "");
  return (
    <div className={cls}>
      <div className="lcars-shell__elbow-tl">{topLeft}</div>
      <div className="lcars-shell__topbar">{topBar}</div>
      <div className="lcars-shell__rail">{rail}</div>
      <div className="lcars-shell__stage">{stage}</div>
      <div className="lcars-shell__elbow-bl">{bottomLeft}</div>
      <div className="lcars-shell__bottombar">{bottomBar}</div>
    </div>
  );
}
