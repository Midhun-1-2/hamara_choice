import { useRef } from "react";
import { useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useIsTouch } from "./useMediaQuery";

interface TiltOptions {
  /** Maximum rotation in degrees at the panel's corner. */
  max?: number;
  /** How far the panel lifts towards the viewer on hover, in pixels. */
  lift?: number;
}

/**
 * Panels lean towards the cursor. Pointer position is normalised to -0.5..0.5
 * across the element, then run through a spring so the panel follows rather
 * than snaps. Returns handlers plus the style to spread on a motion element.
 */
export function useTilt({ max = 6, lift = 10 }: TiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  /*
    A touch device never has a cursor to lean towards, and the style this hook
    returns opens a 3D rendering context on every panel that carries it — eight
    of them on the dashboard, each promoting its whole subtree for a lean that
    can never happen. Hand back nothing there.
  */
  const touch = useIsTouch();
  const off = reduced || touch;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hovered = useMotionValue(0);

  const config = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), config);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), config);
  const z = useSpring(useTransform(hovered, [0, 1], [0, lift]), config);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (off || event.pointerType === "touch") return;
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    px.set((event.clientX - box.left) / box.width - 0.5);
    py.set((event.clientY - box.top) / box.height - 0.5);
    hovered.set(1);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
    hovered.set(0);
  };

  return {
    ref,
    handlers: off ? {} : { onPointerMove, onPointerLeave },
    style: off
      ? undefined
      : { rotateX, rotateY, z, transformPerspective: 1100, transformStyle: "preserve-3d" as const },
  };
}
