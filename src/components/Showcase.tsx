import type { ReactNode } from "react";
import { Bar, Cell, Elbow, Pill } from "@/components/primitives";
import {
  LCARS_COLORS,
  type LcarsColor,
} from "@/lib/lcars-colors";
import { navigate } from "@/lib/use-hash-route";

const ELBOW_CORNERS = ["tl", "tr", "bl", "br"] as const;

export function Showcase() {
  return (
    <div className="lcars-showcase">
      <header className="lcars-showcase__header">
        <span className="lcars-showcase__heading">LCARS PRIMITIVES</span>
        <Pill label="BACK" color="orange" onClick={() => navigate("editor")} />
      </header>

      <Section title="Elbow / 4 corners">
        <div className="lcars-showcase__elbows">
          {ELBOW_CORNERS.map((corner) => (
            <div key={corner} className="lcars-showcase__elbow-cell">
              <Elbow corner={corner} color="orange" label={corner} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Bar / palette">
        <div className="lcars-showcase__stack">
          {LCARS_COLORS.map((color) => (
            <Bar
              key={color}
              label={color.toUpperCase()}
              color={color}
              roundRight
            />
          ))}
        </div>
      </Section>

      <Section title="Bar / end-cap variants">
        <div className="lcars-showcase__stack">
          <Bar label="ROUND LEFT" color="peach" roundLeft />
          <Bar label="ROUND BOTH" color="tan" roundLeft roundRight />
          <Bar label="ROUND RIGHT" color="violet" roundRight />
          <Bar label="NO ROUNDING" color="blue" />
        </div>
      </Section>

      <Section title="Pill / palette">
        <div className="lcars-showcase__row">
          {LCARS_COLORS.map((color) => (
            <Pill key={color} label={color.toUpperCase()} color={color} />
          ))}
          <Pill label="DISABLED" color="orange" disabled />
        </div>
      </Section>

      <Section title="Cell / data blocks">
        <div className="lcars-showcase__row lcars-showcase__row--gap">
          <Cell label="STARDATE" value="-296599.7" />
          <Cell label="STATUS" value="STANDBY" color={"violet" as LcarsColor} />
          <Cell label="WORDS" value="0" color="peach" />
          <Cell label="MODE" value="PROSE" color="tan" />
          <Cell label="WARP" value="9.975" color="blue" />
        </div>
      </Section>

      <p className="lcars-showcase__note">
        Hash route — open <code>#/showcase</code> directly or click PRIMITIVES
        on the rail.
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="lcars-showcase__section">
      <h2 className="lcars-showcase__section-title">{title}</h2>
      {children}
    </section>
  );
}
