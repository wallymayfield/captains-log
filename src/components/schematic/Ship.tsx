import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

/**
 * USS Enterprise NCC-1701-D, hand-built from primitives.
 *
 * Coordinate convention: +z = forward (bow), +y = up, +x = starboard.
 *
 * Reference proportions (Galaxy class, 642m total length):
 *   - Saucer ~280m long, ~470m wide   → here: r ≈ 2.4
 *   - Engineering ~310m long, ~70m wide → here: scale ≈ (0.5, 0.42, 1.7)
 *   - Nacelle ~366m long, ~25m wide   → here: scale ≈ (0.22, 0.22, 1.7)
 *   - Total span (nacelle to nacelle) ~318m → here: ±1.95
 */

const HULL_COLOR = "#FF9933";
const ACCENT_COLOR = "#FFCC66";
const COIL_COLOR = "#6699CC";
const BUSSARD_COLOR = "#CC6666";

// ---------- Saucer lathe profile (rotated around Y axis) ----------
const SAUCER_PROFILE = [
  new THREE.Vector2(0.001, -0.18),
  new THREE.Vector2(0.45, -0.24),
  new THREE.Vector2(1.4, -0.22),
  new THREE.Vector2(2.1, -0.14),
  new THREE.Vector2(2.42, -0.04),
  new THREE.Vector2(2.42, 0.05),
  new THREE.Vector2(2.1, 0.16),
  new THREE.Vector2(1.4, 0.22),
  new THREE.Vector2(0.45, 0.3),
  new THREE.Vector2(0.001, 0.34),
];

// ---------- Pylon shape (extruded along its z-thickness) ----------
const PYLON_SHAPE = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.55, 0);
  s.lineTo(0.55, 0);
  s.lineTo(0.18, 1);
  s.lineTo(-0.18, 1);
  s.lineTo(-0.55, 0);
  return s;
})();
const PYLON_EXTRUDE = { depth: 0.2, bevelEnabled: false };

// ---------- Neck shape (extruded across X for thickness) ----------
const NECK_SHAPE = (() => {
  // 2D side profile: top is at saucer underside, bottom at engineering
  // top. Slopes down-and-back so the connection sits flush.
  const s = new THREE.Shape();
  s.moveTo(-0.5, 0);
  s.lineTo(0.55, 0);
  s.lineTo(0.45, 0.55);
  s.lineTo(-0.35, 0.55);
  s.lineTo(-0.5, 0);
  return s;
})();
const NECK_EXTRUDE = { depth: 0.5, bevelEnabled: false };

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
  fillOpacity = 0.18,
  threshold = 14,
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

// ---------- Saucer detail: lifeboat hatch ring around the rim ----------
function SaucerLifeboats() {
  const positions = useMemo(() => {
    const arr: { angle: number }[] = [];
    const n = 36;
    for (let i = 0; i < n; i++) arr.push({ angle: (i / n) * Math.PI * 2 });
    return arr;
  }, []);
  return (
    <group>
      {positions.map((p, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(p.angle) * 2.3,
            0,
            Math.sin(p.angle) * 2.3,
          ]}
        >
          <boxGeometry args={[0.07, 0.04, 0.07]} />
          <meshBasicMaterial color={HULL_COLOR} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- Warp coil grille: row of emissive segments ----------
function WarpCoils({ side }: { side: number }) {
  const segments = 14;
  const start = -1.5;
  const end = 1.0;
  const step = (end - start) / segments;
  const cells: React.ReactElement[] = [];
  for (let i = 0; i < segments; i++) {
    const z = start + i * step + step / 2;
    cells.push(
      <mesh key={i} position={[side * 1.95, 0.36, z]}>
        <boxGeometry args={[0.32, 0.05, step * 0.7]} />
        <EmissivePulse color={COIL_COLOR} base={1.0} amp={0.3} freq={1.6} />
      </mesh>,
    );
  }
  return <>{cells}</>;
}

export function Ship() {
  const saucerGeo = useMemo(
    () => new THREE.LatheGeometry(SAUCER_PROFILE, 80),
    [],
  );

  return (
    <group>
      {/* ============================================================
          SAUCER (primary hull)
          ============================================================ */}
      <group position={[0, 0.5, 1.5]}>
        {/* Outer hull */}
        <mesh geometry={saucerGeo}>
          <Hull threshold={10} />
        </mesh>

        {/* Phaser strip — torus along the rim, top */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <torusGeometry args={[2.36, 0.018, 8, 80]} />
          <meshBasicMaterial color={ACCENT_COLOR} />
        </mesh>
        {/* Phaser strip — bottom */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <torusGeometry args={[2.36, 0.014, 8, 80]} />
          <meshBasicMaterial color={ACCENT_COLOR} transparent opacity={0.7} />
        </mesh>

        {/* Inner deck division ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <torusGeometry args={[1.55, 0.006, 8, 64]} />
          <meshBasicMaterial color={HULL_COLOR} transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <torusGeometry args={[0.85, 0.006, 8, 48]} />
          <meshBasicMaterial color={HULL_COLOR} transparent opacity={0.4} />
        </mesh>

        {/* Lifeboat hatch ring */}
        <SaucerLifeboats />

        {/* Bridge module — flattened oval */}
        <group position={[0, 0.34, -0.05]}>
          <mesh scale={[1, 0.55, 0.7]}>
            <sphereGeometry
              args={[0.22, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <Hull />
          </mesh>
          {/* Observation lounge step (rear of bridge) */}
          <mesh position={[0, -0.05, -0.2]}>
            <boxGeometry args={[0.28, 0.04, 0.06]} />
            <Hull />
          </mesh>
        </group>

        {/* Lower sensor dome — main sensor array under the saucer */}
        <mesh position={[0, -0.18, 0.15]}>
          <sphereGeometry
            args={[0.5, 32, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
          />
          <Hull fillOpacity={0.1} />
        </mesh>

        {/* Captain's yacht (flat docking under saucer, slightly forward) */}
        <mesh position={[0, -0.18, 1.4]}>
          <boxGeometry args={[0.6, 0.12, 0.6]} />
          <Hull fillOpacity={0.1} />
        </mesh>

        {/* Impulse engines — three emissive vents on rear top edge */}
        {[-0.45, 0, 0.45].map((x) => (
          <mesh key={`imp-${x}`} position={[x, 0.16, -2.2]}>
            <boxGeometry args={[0.32, 0.08, 0.18]} />
            <EmissivePulse
              color={ACCENT_COLOR}
              base={1.0}
              amp={0.2}
              freq={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* ============================================================
          NECK (saucer → engineering)
          ============================================================ */}
      {/* Tilted forward-leaning trapezoid that bridges saucer underside
          to engineering hull dorsal surface. */}
      <mesh
        position={[0, -0.05, 0.6]}
        rotation={[-Math.PI / 7, 0, 0]}
      >
        <extrudeGeometry args={[NECK_SHAPE, NECK_EXTRUDE]} />
        <Hull />
      </mesh>

      {/* ============================================================
          ENGINEERING HULL (secondary hull)
          ============================================================ */}
      <group position={[0, -0.45, -0.3]}>
        {/* Main cigar — stretched sphere */}
        <mesh scale={[0.5, 0.42, 1.7]}>
          <sphereGeometry args={[1, 36, 22]} />
          <Hull threshold={8} />
        </mesh>

        {/* Deflector housing — forward bulge */}
        <mesh position={[0, 0.04, 1.55]} scale={[0.45, 0.4, 0.35]}>
          <sphereGeometry args={[1, 28, 18]} />
          <Hull />
        </mesh>

        {/* Deflector dish — emissive cone-cap */}
        <mesh position={[0, 0.04, 1.78]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.28, 0.18, 32]} />
          <EmissivePulse
            color={ACCENT_COLOR}
            base={1.4}
            amp={0.4}
            freq={1.2}
          />
        </mesh>
        {/* Inner deflector ring (intense glow) */}
        <mesh position={[0, 0.04, 1.86]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.16, 32]} />
          <meshBasicMaterial
            color={ACCENT_COLOR}
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Photon torpedo launcher — slim slit at front, just above deflector */}
        <mesh position={[0, 0.18, 1.45]}>
          <boxGeometry args={[0.18, 0.04, 0.06]} />
          <meshBasicMaterial color={HULL_COLOR} />
        </mesh>

        {/* Computer core / antimatter section — visible bottom bump */}
        <mesh position={[0, -0.36, 0]} scale={[0.4, 0.18, 1.0]}>
          <sphereGeometry args={[1, 24, 14]} />
          <Hull fillOpacity={0.1} />
        </mesh>

        {/* Aft shuttle bay door — rectangular at rear */}
        <mesh position={[0, 0.1, -1.65]}>
          <boxGeometry args={[0.45, 0.22, 0.2]} />
          <Hull />
        </mesh>
        {/* Shuttle bay opening glow */}
        <mesh position={[0, 0.1, -1.78]}>
          <planeGeometry args={[0.32, 0.16]} />
          <meshBasicMaterial color={COIL_COLOR} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* ============================================================
          PYLONS + NACELLES
          ============================================================ */}
      {[1, -1].map((side) => (
        <group key={`nac-${side}`}>
          {/* Pylon — wedge from engineering hull top to nacelle bottom.
              Composed via local transform: extrudeGeometry of trapezoid
              has y=0 at engineering attach, y=1 at nacelle attach. */}
          <mesh
            position={[side * 0.18, -0.45, -0.45]}
            rotation={[0.42, 0, side * -0.45]}
            scale={[0.7, 1.4, 1]}
          >
            <extrudeGeometry args={[PYLON_SHAPE, PYLON_EXTRUDE]} />
            <Hull />
          </mesh>

          {/* Nacelle: composed of three sections — Bussard housing,
              main body, aft cap — each its own mesh so they read
              as distinct features. */}

          {/* Bussard housing (front bulb) */}
          <mesh
            position={[side * 1.95, 0.4, 0.85]}
            scale={[0.32, 0.32, 0.35]}
          >
            <sphereGeometry args={[1, 28, 20]} />
            <Hull />
          </mesh>
          {/* Bussard collector glow inside */}
          <mesh position={[side * 1.95, 0.4, 0.85]}>
            <sphereGeometry args={[0.27, 24, 18]} />
            <EmissivePulse
              color={BUSSARD_COLOR}
              base={1.5}
              amp={0.5}
              freq={4}
            />
          </mesh>

          {/* Main nacelle body — between Bussard and aft */}
          <mesh
            position={[side * 1.95, 0.4, -0.4]}
            scale={[0.24, 0.22, 1.4]}
          >
            <sphereGeometry args={[1, 28, 18]} />
            <Hull threshold={8} />
          </mesh>

          {/* Hull seam ring between Bussard and main body */}
          <mesh
            position={[side * 1.95, 0.4, 0.65]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <torusGeometry args={[0.26, 0.012, 8, 32]} />
            <meshBasicMaterial color={HULL_COLOR} />
          </mesh>

          {/* Warp coil grille: row of emissive segments along the
              underside of the nacelle */}
          <WarpCoils side={side} />

          {/* Aft cap — slightly squared off */}
          <mesh
            position={[side * 1.95, 0.4, -1.85]}
            scale={[0.25, 0.22, 0.18]}
          >
            <sphereGeometry args={[1, 20, 14]} />
            <Hull fillOpacity={0.12} />
          </mesh>
          {/* Aft thruster glow */}
          <mesh position={[side * 1.95, 0.4, -1.95]}>
            <circleGeometry args={[0.12, 24]} />
            <meshBasicMaterial
              color={ACCENT_COLOR}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
