import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

/**
 * USS Enterprise NCC-1701-D — Galaxy class.
 *
 * Coordinate convention: +z = forward (bow), +y = up, +x = starboard.
 *
 * Built to match the canonical silhouette: a dominant lens-shaped
 * saucer at the front, a chubby egg-shaped engineering hull tucked
 * behind and below the saucer, two short pylons sweeping up-and-out
 * to closely-spaced nacelles that ride level with the saucer.
 */

const HULL_COLOR = "#FF9933";
const ACCENT_COLOR = "#FFCC66";
const COIL_COLOR = "#6699CC";
const BUSSARD_COLOR = "#CC6666";

// ---------- Saucer profile (lathed around Y) ----------
// Thin lens — dome on top, shallow concave underneath.
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

// ---------- Engineering hull profile (lathed around Y, rotated) ----------
// Egg-shape: rounded blunt nose at the front (where the deflector
// dish sits), tapering to a flat back face. Lathe is rotated -π/2
// around X so the long axis points along scene's +z (bow).
const ENGINEERING_PROFILE = [
  new THREE.Vector2(0.001, -1.0), // back face
  new THREE.Vector2(0.42, -1.0),
  new THREE.Vector2(0.45, -0.8),
  new THREE.Vector2(0.5, -0.4),
  new THREE.Vector2(0.5, 0.2),
  new THREE.Vector2(0.45, 0.6),
  new THREE.Vector2(0.32, 0.85),
  new THREE.Vector2(0.18, 0.97),
  new THREE.Vector2(0.001, 1.0), // rounded nose tip
];

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

// Concentric deflector dish: amber outer ring + red glowing center.
function Deflector({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      {/* Outer rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.28, 40]} />
        <meshBasicMaterial
          color={COIL_COLOR}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Amber middle ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
        <ringGeometry args={[0.08, 0.18, 40]} />
        <meshBasicMaterial
          color={ACCENT_COLOR}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Red hot center */}
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
          SAUCER (primary hull) — dominates the front of the silhouette.
          ============================================================ */}
      <group position={[0, 0.45, 1.0]} scale={[1, 1, 0.92]}>
        <mesh geometry={saucerGeo}>
          <Hull threshold={10} />
        </mesh>

        {/* Subtle deck-line ring at the rim equator */}
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

        {/* Lower sensor dome — small hemisphere on saucer underside */}
        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry
            args={[0.18, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
          />
          <Hull fillOpacity={0.1} />
        </mesh>

        {/* Impulse engines — single emissive bar at saucer rear */}
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
          NECK — short, slightly forward-leaning slab.
          Top sits flush under the saucer rear; bottom flush on the
          engineering hull dorsal forward face.
          ============================================================ */}
      <mesh
        position={[0, -0.05, -0.85]}
        rotation={[Math.PI / 9, 0, 0]}
      >
        <boxGeometry args={[0.5, 0.65, 0.55]} />
        <Hull />
      </mesh>

      {/* ============================================================
          ENGINEERING HULL (secondary hull) — egg-shape lathed and
          rotated so the long axis runs along z. Front faces +z.
          ============================================================ */}
      <group position={[0, -0.6, -1.6]}>
        <mesh
          geometry={engineeringGeo}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[0.85, 1, 0.7]}
        >
          <Hull threshold={8} />
        </mesh>

        {/* Deflector dish — concentric rings on the front face */}
        <Deflector position={[0, 0, 0.95]} />
      </group>

      {/* ============================================================
          PYLONS + NACELLES — short pylons sweep up-and-outward at
          ~50° from vertical; nacelles ride level with the saucer.
          ============================================================ */}
      {[1, -1].map((side) => (
        <group key={`nac-${side}`}>
          {/* Pylon — flat slab from engineering top to nacelle bottom.
              Length 0.95, rotated -50° around Z (port mirrors). */}
          <mesh
            position={[side * 0.62, -0.14, -1.6]}
            rotation={[0, 0, side * -0.87]}
          >
            <boxGeometry args={[0.1, 0.95, 0.4]} />
            <Hull />
          </mesh>

          {/* Nacelle main body — long slender cylinder.
              x = ±1.1 (close to centerline, matches references). */}
          <mesh
            position={[side * 1.1, 0.45, -1.6]}
            scale={[0.18, 0.18, 1.7]}
          >
            <sphereGeometry args={[1, 28, 18]} />
            <Hull threshold={8} />
          </mesh>

          {/* Bussard collector — prominent red dome at the front */}
          <mesh position={[side * 1.1, 0.45, 0.18]}>
            <sphereGeometry args={[0.22, 24, 18]} />
            <EmissivePulse
              color={BUSSARD_COLOR}
              base={1.6}
              amp={0.4}
              freq={4}
            />
          </mesh>

          {/* Warp coil grille — continuous emissive blue strip on TOP */}
          <mesh position={[side * 1.1, 0.62, -1.6]}>
            <boxGeometry args={[0.18, 0.05, 2.6]} />
            <EmissivePulse
              color={COIL_COLOR}
              base={1.2}
              amp={0.25}
              freq={1.6}
            />
          </mesh>

          {/* Aft cap — simple small dome */}
          <mesh position={[side * 1.1, 0.45, -3.4]}>
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
