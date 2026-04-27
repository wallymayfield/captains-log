import { useMemo } from "react";
import { formatStardate } from "@/lib/stardate";

type SchematicProps = {
  date: Date;
};

const STAR_COUNT = 90;

export function Schematic({ date }: SchematicProps) {
  // Stars are placed once on mount; their twinkle is CSS-driven.
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.6 + 0.4,
        duration: Math.random() * 4 + 2.5,
        delay: Math.random() * 4,
      })),
    [],
  );

  return (
    <div className="lcars-schematic">
      <div className="lcars-schematic__starfield" aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className="lcars-schematic__star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <svg
        className="lcars-schematic__svg"
        viewBox="-150 -150 300 300"
        aria-hidden="true"
      >
        {/* Sensor sweep ring (background, beneath the ship) */}
        <circle
          className="lcars-schematic__ring"
          cx="0"
          cy="0"
          r="125"
        />
        <circle
          className="lcars-schematic__ring"
          cx="0"
          cy="0"
          r="90"
        />
        <line
          className="lcars-schematic__sweep"
          x1="0"
          y1="0"
          x2="0"
          y2="-125"
        />

        {/* Ship hull, top-down view, bow at top of screen. */}
        <g className="lcars-schematic__hull">
          {/* Engineering hull */}
          <ellipse cx="0" cy="60" rx="22" ry="55" />
          {/* Pylons */}
          <line x1="-15" y1="40" x2="-55" y2="40" />
          <line x1="15" y1="40" x2="55" y2="40" />
          {/* Nacelles */}
          <ellipse cx="-65" cy="40" rx="13" ry="55" />
          <ellipse cx="65" cy="40" rx="13" ry="55" />
          {/* Glowing nacelle caps (front) */}
          <circle
            className="lcars-schematic__cap"
            cx="-65"
            cy="-15"
            r="8"
          />
          <circle
            className="lcars-schematic__cap"
            cx="65"
            cy="-15"
            r="8"
          />
          {/* Neck */}
          <line x1="0" y1="0" x2="0" y2="35" />
          {/* Saucer */}
          <ellipse cx="0" cy="-50" rx="95" ry="55" />
          <ellipse cx="0" cy="-50" rx="55" ry="32" opacity="0.55" />
          <ellipse cx="0" cy="-50" rx="20" ry="12" opacity="0.4" />
          {/* Bridge dome */}
          <circle
            className="lcars-schematic__bridge"
            cx="0"
            cy="-50"
            r="5"
          />
          {/* Deflector dish */}
          <ellipse
            className="lcars-schematic__deflector"
            cx="0"
            cy="12"
            rx="10"
            ry="4"
          />
        </g>
      </svg>

      <div className="lcars-schematic__readout lcars-schematic__readout--tl">
        <span className="lcars-schematic__readout-label">Stardate</span>
        <span className="lcars-schematic__readout-value">
          {formatStardate(date)}
        </span>
      </div>
      <div className="lcars-schematic__readout lcars-schematic__readout--tr">
        <span className="lcars-schematic__readout-label">Position</span>
        <span className="lcars-schematic__readout-value">
          Sector 001 · Alpha
        </span>
      </div>
      <div className="lcars-schematic__readout lcars-schematic__readout--bl">
        <span className="lcars-schematic__readout-label">Heading</span>
        <span className="lcars-schematic__readout-value">
          287 mark 19
        </span>
      </div>
      <div className="lcars-schematic__readout lcars-schematic__readout--br">
        <span className="lcars-schematic__readout-label">Designation</span>
        <span className="lcars-schematic__readout-value">
          USS HORIZON · NCC-2401
        </span>
      </div>
    </div>
  );
}
