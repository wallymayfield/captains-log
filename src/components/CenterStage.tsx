import type { ReactNode } from "react";

type CenterStageProps = {
  children?: ReactNode;
};

export function CenterStage({ children }: CenterStageProps) {
  if (children) {
    return <main className="lcars-stage">{children}</main>;
  }
  return (
    <main className="lcars-stage">
      <span className="lcars-stage__placeholder">Stand by for input</span>
    </main>
  );
}
