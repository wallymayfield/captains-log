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
 * saucer at the front; an egg-shaped engineering hull tucked behind
 * and below the saucer; nacelles riding BELOW the saucer plane,
 * connected to the engineering hull via short curved pylons that
 * emerge from the sides of the secondary hull.
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

// ---------- Engineering hull profile (lathed around Y, rotated +π/2 around X) ----------
// Profile y=+1 is the rounded nose; y=-1 is the flat back face. After
// rotation, +y of the lathe becomes +z of the scene (bow direction).
const ENGINEERING_PROFILE = [
  new THREE.Vector2(0.001, -1.0),
  new THREE.Vector2(0.42, -1.0),
  new THREE.Vector2(0.45, -0.8),
  new THREE.Vector2(0.5, -0.4),
  new THREE.Vector2(0.5, 0.2),
  new THREE.Vector2(0.45, 0.6),
  new THREE.Vector2(0.32, 0.85),
  new THREE.Vector2(0.18, 0.97),
  new THREE.Vector2(0.001, 1.0),
];

// ---------- Pylon cross-section (extruded along a 3D curve) ----------
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
// the side of the engineering hull (mid-height) up and outward to
// the nacelle bottom. Mirrored across X for the opposing side.
function CurvedPylon({ side }: { side: number }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.42, -0.6, -1.6),
      new THREE.Vector3(side * 0.62, -0.5, -1.7),
      new THREE.Vector3(side * 0.85, -0.35, -1.7),
      new THREE.Vector3(side * 1.05, -0.28, -1.6),
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
          SAUCER (primary hull) — dominates the front of the silhouette.
          ============================================================ */}
      <group position={[0, 0.45, 1.0]} scale={[1, 1, 0.92]}>
        <mesh geometry={saucerGeo}>
          <Hull threshold={10} />
        </mesh>

        {/* Single subtle deck-line ring at the rim equator */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.36, 0.012, 6, 80]} />
          <meshBasicMaterial color={ACCENT_COLOR} />
        </mesh>

        {/* Bridge module — small low dome on top, dead center */}
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
          NECK — short slab connecting saucer underside to engineering top.
          ============================================================ */}
      <mesh
        position={[0, -0.05, -0.85]}
        rotation={[Math.PI / 9, 0, 0]}
      >
        <boxGeometry args={[0.5, 0.65, 0.55]} />
        <Hull />
      </mesh>

      {/* ============================================================
          ENGINEERING HULL (secondary hull) — egg shape, nose forward.
          ============================================================ */}
      <group position={[0, -0.6, -1.6]}>
        <mesh
          geometry={engineeringGeo}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.85, 1, 0.7]}
        >
          <Hull threshold={8} />
        </mesh>
        {/* Deflector at the front face (z = +1 in engineering's local) */}
        <Deflector position={[0, 0, 0.95]} />
      </group>

      {/* ============================================================
          PYLONS + NACELLES — pylons emerge from engineering sides as
          short curved arcs to nacelles riding BELOW the saucer.
          ============================================================ */}
      {[1, -1].map((side) => (
        <group key={`nac-${side}`}>
          <CurvedPylon side={side} />

          {/* Nacelle body — long slender cigar, BELOW saucer plane */}
          <mesh
            position={[side * 1.05, -0.1, -1.6]}
            scale={[0.18, 0.18, 1.7]}
          >
            <sphereGeometry args={[1, 28, 18]} />
            <Hull threshold={8} />
          </mesh>

          {/* Bussard collector — prominent red dome at the FRONT */}
          <mesh position={[side * 1.05, -0.1, 0.18]}>
            <sphereGeometry args={[0.22, 24, 18]} />
            <EmissivePulse
              color={BUSSARD_COLOR}
              base={1.6}
              amp={0.4}
              freq={4}
            />
          </mesh>

          {/* Warp coil grille — continuous emissive blue strip on TOP */}
          <mesh position={[side * 1.05, 0.07, -1.6]}>
            <boxGeometry args={[0.18, 0.05, 2.6]} />
            <EmissivePulse
              color={COIL_COLOR}
              base={1.2}
              amp={0.25}
              freq={1.6}
            />
          </mesh>

          {/* Aft cap — small simple dome */}
          <mesh position={[side * 1.05, -0.1, -3.4]}>
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
