import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ReactNode } from "react";
import * as THREE from "three";

/**
 * USS Enterprise NCC-1701-D, hand-built from primitives in Three.js.
 *
 * Style: vector-style wireframe with emissive accents — meant to read
 * as a TNG-era tactical display, not a photoreal model. Single warm
 * accent color for hull edges, blue for warp coils, red Bussards.
 *
 * Coordinate convention:
 *   +z = forward (bow), -z = aft, +y = up, +x = starboard
 */

const HULL_COLOR = "#FF9933"; // LCARS orange
const COIL_COLOR = "#6699CC"; // LCARS blue
const BUSSARD_COLOR = "#CC6666"; // LCARS red
const DEFLECTOR_COLOR = "#FFCC66"; // LCARS tan/amber

type WireProps = {
  color?: string;
  opacity?: number;
};

function Wire({ color = HULL_COLOR, opacity = 1 }: WireProps) {
  return (
    <meshBasicMaterial
      color={color}
      wireframe
      transparent
      opacity={opacity}
    />
  );
}

type EmissivePulseProps = {
  color: string;
  base: number;
  amp: number;
  freq: number;
  children?: ReactNode;
};

/**
 * A small wrapper that re-binds onto its child <mesh>'s material and
 * animates emissiveIntensity. Avoids the optional-ref TS gymnastics.
 */
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
    />
  );
}

export function Ship() {
  const group = useRef<THREE.Group>(null);

  return (
    <group ref={group}>
      {/* ----- Saucer (primary hull) ----- */}
      <group position={[0, 0.15, 1.6]}>
        {/* Disc shape, slightly thicker at center */}
        <mesh>
          <cylinderGeometry args={[2.6, 2.6, 0.45, 48, 1]} />
          <Wire />
        </mesh>
        {/* Top "dome" — flatter cylinder above the disc */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[1.3, 2.2, 0.25, 32, 1]} />
          <Wire opacity={0.85} />
        </mesh>
        {/* Bridge module on top center */}
        <mesh position={[0, 0.42, -0.1]}>
          <sphereGeometry
            args={[0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <Wire />
        </mesh>
        {/* Lower sensor dome under the saucer */}
        <mesh position={[0, -0.2, 0.2]}>
          <sphereGeometry
            args={[0.65, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
          />
          <Wire opacity={0.6} />
        </mesh>
      </group>

      {/* ----- Neck (saucer → engineering) ----- */}
      <mesh position={[0, -0.2, 0.6]} rotation={[Math.PI / 8, 0, 0]}>
        <boxGeometry args={[0.45, 0.6, 0.7]} />
        <Wire />
      </mesh>

      {/* ----- Engineering hull (secondary hull) ----- */}
      <group position={[0, -0.5, -0.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.55, 2.2, 8, 24]} />
          <Wire />
        </mesh>
        {/* Deflector dish — front of engineering hull */}
        <mesh position={[0, 0, 1.55]} rotation={[0, 0, 0]}>
          <sphereGeometry
            args={[0.32, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.4]}
          />
          <EmissivePulse
            color={DEFLECTOR_COLOR}
            base={1.2}
            amp={0.4}
            freq={1.2}
          />
        </mesh>
        {/* Shuttle bay aft */}
        <mesh position={[0, 0.1, -1.45]}>
          <boxGeometry args={[0.4, 0.18, 0.2]} />
          <Wire opacity={0.7} />
        </mesh>
      </group>

      {/* ----- Pylons + Nacelles ----- */}
      {[1, -1].map((side) => (
        <group key={`nacelle-${side}`}>
          {/* Pylon: angled box from engineering top to nacelle bottom */}
          <mesh
            position={[side * 0.9, 0.0, -0.6]}
            rotation={[0.18, 0, side * -0.55]}
          >
            <boxGeometry args={[0.18, 1.8, 0.5]} />
            <Wire opacity={0.85} />
          </mesh>
          {/* Nacelle body */}
          <mesh
            position={[side * 1.85, 0.55, -0.3]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.28, 0.28, 3.2, 18, 1]} />
            <Wire />
          </mesh>
          {/* Bussard collector — emissive red sphere at nacelle front */}
          <mesh position={[side * 1.85, 0.55, 1.32]}>
            <sphereGeometry args={[0.32, 20, 14]} />
            <EmissivePulse
              color={BUSSARD_COLOR}
              base={1.4}
              amp={0.4}
              freq={4}
            />
          </mesh>
          {/* Warp coil grille — long thin emissive plane on the inside-bottom */}
          <mesh
            position={[side * 1.85, 0.31, -0.3]}
            rotation={[0, 0, 0]}
          >
            <boxGeometry args={[0.3, 0.05, 2.6]} />
            <EmissivePulse
              color={COIL_COLOR}
              base={1.0}
              amp={0.3}
              freq={1.6}
            />
          </mesh>
          {/* Aft cap */}
          <mesh position={[side * 1.85, 0.55, -1.6]}>
            <sphereGeometry args={[0.28, 16, 12]} />
            <Wire opacity={0.7} />
          </mesh>
        </group>
      ))}

      {/* ----- Impulse engines: two emissive bars at the rear of the saucer ----- */}
      <mesh position={[0.4, 0.15, 0.85]}>
        <boxGeometry args={[0.5, 0.1, 0.08]} />
        <meshStandardMaterial
          color={DEFLECTOR_COLOR}
          emissive={DEFLECTOR_COLOR}
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[-0.4, 0.15, 0.85]}>
        <boxGeometry args={[0.5, 0.1, 0.08]} />
        <meshStandardMaterial
          color={DEFLECTOR_COLOR}
          emissive={DEFLECTOR_COLOR}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}
