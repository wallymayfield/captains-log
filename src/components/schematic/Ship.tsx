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
// forward-leaning sail. Top is tall enough to bury into the saucer
// underside so the connection reads as continuous.
const DORSAL_FIN_SHAPE = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.6, 0);
  s.lineTo(0.5, 0);
  s.lineTo(0.25, 0.72);
  s.lineTo(-0.05, 0.72);
  s.lineTo(-0.6, 0);
  return s;
})();
const DORSAL_FIN_EXTRUDE = { depth: 0.16, bevelEnabled: false };


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

// Pylon: a simple straight slab from engineering hull's
// back-bottom-side to the nacelle bottom. Single rotated box —
// avoids the Frenet-frame twisting issues of a curved extrusion.
function Pylon({ side }: { side: number }) {
  const { position, rotation, length } = useMemo(() => {
    const start = new THREE.Vector3(side * 0.36, -0.82, -1.9);
    const end = new THREE.Vector3(side * 1.05, -0.05, -1.4);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const len = start.distanceTo(end);
    const dir = end.clone().sub(start).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir,
    );
    const eu = new THREE.Euler().setFromQuaternion(quat);
    return {
      position: [mid.x, mid.y, mid.z] as [number, number, number],
      rotation: [eu.x, eu.y, eu.z] as [number, number, number],
      length: len,
    };
  }, [side]);

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.1, length, 0.32]} />
      <Hull />
    </mesh>
  );
}

// Concentric deflector dish — blue outer / amber middle / red center.
// Bigger and inverted layering so the inner glow sits DEEPEST and the
// outer ring is at the surface — gives a recessed-bowl read instead
// of a bulge. All materials double-sided.
function Deflector({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <ringGeometry args={[0.16, 0.24, 40]} />
        <meshBasicMaterial
          color={COIL_COLOR}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -0.008]}>
        <ringGeometry args={[0.08, 0.16, 40]} />
        <meshBasicMaterial
          color={ACCENT_COLOR}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -0.016]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial
          color={BUSSARD_COLOR}
          emissive={BUSSARD_COLOR}
          emissiveIntensity={1.6}
          roughness={0.4}
          side={THREE.DoubleSide}
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

        {/* Deflector recessed into the hull's nose at engineering
            local z=0.95 (world z≈-0.45) — the hull has enough radius
            here for the larger rings while still reading as a forward
            feature. */}
        <Deflector position={[0, 0.0, 0.95]} />
      </group>

      {/* Dorsal fin — rises from engineering top to saucer underside.
          Shape is in XY of geometry frame; rotated around Y by -π/2
          so shape's X aligns with scene's +Z (forward). Position.x
          is shifted by depth/2 so the extrusion is centered at x=0. */}
      <mesh
        position={[0.08, -0.3, -0.95]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <extrudeGeometry args={[DORSAL_FIN_SHAPE, DORSAL_FIN_EXTRUDE]} />
        <Hull />
      </mesh>

      {/* ============================================================
          PYLONS + NACELLES — pylons curve from engineering's lower
          sides outward to nacelles. Nacelles are a closed cylinder
          with a single emissive Bussard hemisphere built onto the
          front; no separate aft cap.
          ============================================================ */}
      {[1, -1].map((side) => (
        <group key={`nac-${side}`}>
          <Pylon side={side} />

          {/* Nacelle main body — closed cylinder, axis along scene Z */}
          <mesh
            position={[side * 1.05, 0.05, -1.4]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.18, 0.18, 3.0, 24]} />
            <Hull threshold={8} />
          </mesh>

          {/* Bussard collector — emissive red hemisphere on the FRONT.
              Flat side aligns with the cylinder front; dome bulges +z. */}
          <mesh
            position={[side * 1.05, 0.05, 0.1]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <sphereGeometry
              args={[0.18, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <EmissivePulse
              color={BUSSARD_COLOR}
              base={1.6}
              amp={0.4}
              freq={4}
            />
          </mesh>

          {/* Warp coil grille — embedded blue glow strip in the upper
              hull. Sits inside the nacelle so it reads as an integral
              feature glowing through the dark transparent fill. */}
          <mesh position={[side * 1.05, 0.13, -1.4]}>
            <boxGeometry args={[0.14, 0.04, 2.6]} />
            <EmissivePulse
              color={COIL_COLOR}
              base={1.3}
              amp={0.25}
              freq={1.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
