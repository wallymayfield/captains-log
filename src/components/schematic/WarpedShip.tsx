import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Ship } from "./Ship";

export type WarpPhase =
  | "idle"
  | "windup"
  | "out"
  | "gone"
  | "in"
  | "recover";

export const WARP_DURATIONS: Record<Exclude<WarpPhase, "idle">, number> = {
  windup: 5000,
  out: 800,
  gone: 1200,
  in: 1000,
  recover: 1200,
};

type Props = {
  phase: WarpPhase;
  phaseStart: number;
};

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeInCubic = (x: number) => x * x * x;
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const WARP_DISTANCE = 220;
const PULLBACK_DISTANCE = 0.6;
const ROTATION_START = 0.45;
const ROTATION_END = 0.92;

export function WarpedShip({ phase, phaseStart }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const baseQuat = useRef(new THREE.Quaternion());
  const outQuat = useRef(new THREE.Quaternion());
  const inQuat = useRef(new THREE.Quaternion());
  const warpAxis = useRef(new THREE.Vector3(0, 0, 1));

  useEffect(() => {
    if (phase !== "windup" || !groupRef.current) return;
    const g = groupRef.current;

    baseQuat.current.copy(g.quaternion);

    const camFwd = new THREE.Vector3();
    camera.getWorldDirection(camFwd);
    warpAxis.current.copy(camFwd).normalize();

    const tmp = new THREE.Object3D();
    tmp.position.copy(g.position);

    tmp.lookAt(g.position.clone().add(warpAxis.current));
    outQuat.current.copy(tmp.quaternion);

    tmp.lookAt(g.position.clone().sub(warpAxis.current));
    inQuat.current.copy(tmp.quaternion);
  }, [phase, camera]);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;

    const t = (performance.now() - phaseStart) / 1000;

    if (phase === "idle") {
      g.position.set(0, 0, 0);
      g.scale.set(1, 1, 1);
      g.quaternion.identity();
      g.visible = true;
      return;
    }

    if (phase === "windup") {
      const p = clamp01(t / (WARP_DURATIONS.windup / 1000));

      const pullEased = easeInOutCubic(Math.min(1, p / 0.85));
      g.position
        .copy(warpAxis.current)
        .multiplyScalar(-PULLBACK_DISTANCE * pullEased);

      const rotP = clamp01((p - ROTATION_START) / (ROTATION_END - ROTATION_START));
      const rotEased = easeInOutCubic(rotP);
      g.quaternion.copy(baseQuat.current).slerp(outQuat.current, rotEased);

      g.scale.set(1, 1, 1);
      g.visible = true;
      return;
    }

    if (phase === "out") {
      const p = clamp01(t / (WARP_DURATIONS.out / 1000));
      const eased = easeInCubic(p);
      const startPos = -PULLBACK_DISTANCE;
      const dist = startPos + (WARP_DISTANCE - startPos) * eased;
      g.position.copy(warpAxis.current).multiplyScalar(dist);
      g.quaternion.copy(outQuat.current);
      const stretch = 1 + eased * 22;
      const squeeze = 1 - p * 0.5;
      const shrinkP = clamp01((p - 0.55) / 0.45);
      const shrink = 1 - shrinkP * shrinkP;
      g.scale.set(squeeze * shrink, squeeze * shrink, stretch * shrink);
      g.visible = true;
      return;
    }

    if (phase === "gone") {
      g.visible = false;
      return;
    }

    if (phase === "in") {
      const p = clamp01(t / (WARP_DURATIONS.in / 1000));
      const eased = easeOutCubic(p);
      const dist = (1 - eased) * WARP_DISTANCE;
      g.position.copy(warpAxis.current).multiplyScalar(dist);
      g.quaternion.copy(inQuat.current);
      const stretch = 1 + (1 - eased) * 22;
      const squeeze = 1 - (1 - p) * 0.5;
      const growP = clamp01(p / 0.45);
      const grow = 1 - (1 - growP) * (1 - growP);
      g.scale.set(squeeze * grow, squeeze * grow, stretch * grow);
      g.visible = true;
      return;
    }

    if (phase === "recover") {
      const p = clamp01(t / (WARP_DURATIONS.recover / 1000));
      const eased = easeInOutCubic(p);
      g.quaternion.copy(inQuat.current).slerp(baseQuat.current, eased);
      g.position.set(0, 0, 0);
      g.scale.set(1, 1, 1);
      g.visible = true;
      return;
    }
  });

  return (
    <group ref={groupRef}>
      <Ship />
    </group>
  );
}
