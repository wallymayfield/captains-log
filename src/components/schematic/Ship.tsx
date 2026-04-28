import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

/**
 * USS Enterprise NCC-1701-D — Galaxy class.
 *
 * Coordinate convention: +z = forward (bow), +y = up, +x = starboard.
 *
 * Reworked against the Kennedy Shipyards elevation drawing:
 *   - Saucer dominates the front of the silhouette.
 *   - Engineering hull is a long cigar with a forward-leaning DORSAL
 *     FIN rising to meet the saucer underside (the fin is the
 *     connection — there is no separate neck box).
 *   - Nacelles ride just above engineering hull top.
 *   - Pylons curve outward from engineering's mid-sides to the
 *     nacelle bottoms.
 */

const HULL_COLOR = "#FF9933";
const ACCENT_COLOR = "#FFCC66";
const COIL_COLOR = "#6699CC";
const BUSSARD_COLOR = "#CC6666";

// ---------- Saucer profile (lathed around Y) ----------
const SAUCER_PROFILE = [
  new THREE.Vector2(0.001, -0.16),
  new THREE.Vector2(0.5, -0.2),
  new THREE.Vector2(1.4, -0.18),
  new THREE.Vector2(2.1, -0.12),
  new THREE.Vector2(2.4, -0.04),
  new THREE.Vector2(2.4, 0.04),
  new THREE.Vector2(2.1, 0.13),
  new THREE.Vector2(1.4, 0.18),
  new THREE.Vector2(0.5, 0.21),
  new THREE.Vector2(0.001, 0.22),
];

// ---------- Engineering hull profile ----------
// Long cigar: rounded blunt nose at +y end, mostly cylindrical mid,
// flat shuttlebay face at -y end.
const ENGINEERING_PROFILE = [
  new THREE.Vector2(0.001, -1.0),
  new THREE.Vector2(0.36, -1.0),
  new THREE.Vector2(0.42, -0.85),
  new THREE.Vector2(0.46, -0.55),
  new THREE.Vector2(0.48, 0.0),
  new THREE.Vector2(0.48, 0.4),
  new THREE.Vector2(0.44, 0.7),
  new THREE.Vector2(0.32, 0.9),
  new THREE.Vector2(0.001, 1.0),
];

// ---------- Dorsal fin shape ----------
// 2D side profile in shape XY (X = front-back, Y = vertical). Wider
// at the bottom (engineering attach), narrower at the top (saucer
// attach), with the top edge shifted forward — the canonical
// forward-leaning sail.
const DORSAL_FIN_SHAPE = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.6, 0);
  s.lineTo(0.5, 0);
  s.lineTo(0.32, 0.55);
  s.lineTo(-0.08, 0.55);
  s.lineTo(-0.6, 0);
  return s;
})();
const DORSAL_FIN_EXTRUDE = { depth: 0.16, bevelEnabled: false };

// ---------- Pylon cross-section ----------
const PYLON_CROSS_SECTION = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.04, -0.18);
  s.lineTo(0.04, -0.18);
  s.lineTo(0.04, 0.18);
  s.lineTo(-0.04, 0.18);
  s.lineTo(-0.04, -0.18);
  return s;
})();

type EmissivePulseProps = {
  color: string;
  base: number;
  amp: number;
  freq: number;
};
function EmissivePulse({ color, base, amp, freq }: EmissivePulseProps) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.emissiveIntensity =
        base + Math.sin(state.clock.elapsedTime * freq) * amp;
    }
  });
  return (
    <meshStandardMaterial
      ref={ref}
      color={color}
      emissive={color}
      emissiveIntensity={base}
      roughness={0.55}
    />
  );
}

type HullProps = {
  edgeColor?: string;
  fillOpacity?: number;
  threshold?: number;
};
function Hull({
  edgeColor = HULL_COLOR,
  fillOpacity = 0.16,
  threshold = 12,
}: HullProps) {
  return (
    <>
      <meshBasicMaterial
        color="#000000"
        transparent
        opacity={fillOpacity}
      />
      <Edges color={edgeColor} threshold={threshold} />
    </>
  );
}

// Curved pylon: cross-section swept along a CatmullRomCurve3 from
// the engineering hull mid-side outward (and slightly back) to the
// nacelle bottom.
function CurvedPylon({ side }: { side: number }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.4, -0.55, -1.4),
      new THREE.Vector3(side * 0.65, -0.45, -1.55),
      new THREE.Vector3(side * 0.9, -0.25, -1.55),
      new THREE.Vector3(side * 1.05, -0.1, -1.4),
    ]);
    return new THREE.ExtrudeGeometry(PYLON_CROSS_SECTION, {
      steps: 32,
      bevelEnabled: false,
      extrudePath: curve,
    });
  }, [side]);

  return (
    <mesh geometry={geo}>
      <Hull />
    </mesh>
  );
}

// Concentric deflector dish — blue outer / amber middle / red center.
function Deflector({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.28, 40]} />
        <meshBasicMaterial
          color={COIL_COLOR}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
        <ringGeometry args={[0.08, 0.18, 40]} />
        <meshBasicMaterial
          color={ACCENT_COLOR}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
        <circleGeometry args={[0.08, 32]} />
        <EmissivePulse
          color={BUSSARD_COLOR}
          base={1.6}
          amp={0.4}
          freq={1.3}
        />
      </mesh>
    </group>
  );
}

export function Ship() {
  const saucerGeo = useMemo(
    () => new THREE.LatheGeometry(SAUCER_PROFILE, 80),
    [],
  );
  const engineeringGeo = useMemo(
    () => new THREE.LatheGeometry(ENGINEERING_PROFILE, 32),
    [],
  );

  return (
    <group>
      {/* ============================================================
          SAUCER (primary hull)
          ============================================================ */}
      <group position={[0, 0.45, 1.0]} scale={[1, 1, 0.92]}>
        <mesh geometry={saucerGeo}>
          <Hull threshold={10} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.36, 0.012, 6, 80]} />
          <meshBasicMaterial color={ACCENT_COLOR} />
        </mesh>
        {/* Bridge module — small low dome dead-center on top */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.09, 0.12, 0.04, 24, 1]} />
          <Hull />
        </mesh>
        <mesh position={[0, 0.245, 0]}>
          <sphereGeometry
            args={[0.09, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <Hull />
        </mesh>
        {/* Lower sensor dome */}
        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry
            args={[0.18, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
          />
          <Hull fillOpacity={0.1} />
        </mesh>
        {/* Impulse engines at the rear */}
        <mesh position={[0, 0.04, -2.18]}>
          <boxGeometry args={[1.2, 0.07, 0.1]} />
          <EmissivePulse
            color={ACCENT_COLOR}
            base={0.9}
            amp={0.2}
            freq={0.9}
          />
        </mesh>
      </group>

      {/* ============================================================
          ENGINEERING HULL + DORSAL FIN
          The dorsal fin connects engineering top to saucer underside;
          there is no separate neck.
          ============================================================ */}
      <group position={[0, -0.55, -1.4]}>
        {/* Main cigar */}
        <mesh
          geometry={engineeringGeo}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.85, 1.15, 0.7]}
        >
          <Hull threshold={8} />
        </mesh>

        {/* Deflector at the front face (z = +1 in engineering's local) */}
        <Deflector position={[0, 0.0, 1.1]} />
      </group>

      {/* Dorsal fin — rises from engineering top to saucer underside.
          Shape is in XY of geometry frame; rotated around Y by -π/2
          so shape's X aligns with scene's +Z (forward). */}
      <mesh
        position={[-0.08, -0.3, -0.95]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <extrudeGeometry args={[DORSAL_FIN_SHAPE, DORSAL_FIN_EXTRUDE]} />
        <Hull />
      </mesh>

      {/* ============================================================
          PYLONS + NACELLES — pylons curve from engineering mid-sides
          outward to nacelles riding just above engineering top.
          ============================================================ */}
      {[1, -1].map((side) => (
        <group key={`nac-${side}`}>
          <CurvedPylon side={side} />

          {/* Nacelle main body */}
          <mesh
            position={[side * 1.05, 0.05, -1.4]}
            scale={[0.18, 0.18, 1.85]}
          >
            <sphereGeometry args={[1, 28, 18]} />
            <Hull threshold={8} />
          </mesh>

          {/* Bussard collector — red dome at the FRONT */}
          <mesh position={[side * 1.05, 0.05, 0.45]}>
            <sphereGeometry args={[0.22, 24, 18]} />
            <EmissivePulse
              color={BUSSARD_COLOR}
              base={1.6}
              amp={0.4}
              freq={4}
            />
          </mesh>

          {/* Warp coil grille — continuous emissive blue strip on TOP */}
          <mesh position={[side * 1.05, 0.22, -1.4]}>
            <boxGeometry args={[0.18, 0.05, 2.8]} />
            <EmissivePulse
              color={COIL_COLOR}
              base={1.2}
              amp={0.25}
              freq={1.6}
            />
          </mesh>

          {/* Aft cap */}
          <mesh position={[side * 1.05, 0.05, -3.25]}>
            <sphereGeometry
              args={[0.18, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <Hull fillOpacity={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
