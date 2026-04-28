import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Ship } from "./schematic/Ship";
import { useTicker } from "@/lib/use-ticker";
import { formatStardate } from "@/lib/stardate";
import { startBridgeAmbient, stopBridgeAmbient } from "@/lib/sound";

const STAR_COUNT = 90;

export function Schematic() {
  const [muted, setMuted] = useState(false);
  const now = useTicker(60_000);

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.4 + 0.4,
        duration: Math.random() * 4 + 2.5,
        delay: Math.random() * 4,
      })),
    [],
  );

  useEffect(() => {
    if (muted) {
      stopBridgeAmbient();
    } else {
      startBridgeAmbient();
    }
    return () => stopBridgeAmbient();
  }, [muted]);

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

      <Canvas
        className="lcars-schematic__canvas"
        camera={{ position: [6, 3.5, 6], fov: 38 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.35} />
        <pointLight position={[6, 6, 6]} intensity={0.6} />
        <pointLight
          position={[-6, -3, -4]}
          intensity={0.4}
          color="#6699CC"
        />

        <Stars
          radius={60}
          depth={40}
          count={1500}
          factor={3}
          saturation={0}
          fade
          speed={0.3}
        />

        <Suspense fallback={null}>
          <Ship />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={4}
          maxDistance={14}
          autoRotate
          autoRotateSpeed={0.6}
          rotateSpeed={0.6}
          zoomSpeed={0.6}
        />
      </Canvas>

      {/* Top-left: live stardate */}
      <div className="lcars-schematic__corner lcars-schematic__corner--tl">
        <span className="lcars-schematic__readout-label">Stardate</span>
        <span className="lcars-schematic__readout-value">
          {formatStardate(now)}
        </span>
      </div>

      {/* Top-right: position */}
      <div className="lcars-schematic__corner lcars-schematic__corner--tr">
        <span className="lcars-schematic__readout-label">Position</span>
        <span className="lcars-schematic__readout-value">
          Sector 001 · Alpha
        </span>
      </div>

      {/* Bottom-left: ship designation */}
      <div className="lcars-schematic__corner lcars-schematic__corner--bl">
        <span className="lcars-schematic__readout-label">Designation</span>
        <span className="lcars-schematic__readout-value">
          USS Horizon · NCC-2401
        </span>
      </div>

      {/* Bottom-right: heading + ambient mute toggle */}
      <div className="lcars-schematic__corner lcars-schematic__corner--br">
        <span className="lcars-schematic__readout-label">Heading</span>
        <span className="lcars-schematic__readout-value">287 mark 19</span>
        <button
          type="button"
          className="lcars-schematic__mute"
          onClick={() => setMuted((m) => !m)}
          aria-label={
            muted ? "Unmute bridge ambient" : "Mute bridge ambient"
          }
        >
          {muted ? "Audio · Off" : "Audio · On"}
        </button>
      </div>
    </div>
  );
}
