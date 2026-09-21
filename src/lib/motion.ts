import type { Transition, Variants } from "framer-motion";

/**
 * MOTION LANGUAGE — "Atelier".
 *
 * The old system moved everything on the Y axis with a blur: things slid up
 * and sharpened. This one does not slide. Surfaces *settle* — they arrive
 * slightly small and tilted away from the viewer, then drop flat with a light
 * overshoot, the way a card is laid down on a counter. Lists arrive across the
 * X axis instead of up it. Hovers scale rather than lift.
 */

export const ease = {
  /** Long, silky deceleration. The house curve. */
  silk: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Even both ends — used for anything that travels a distance. */
  glide: [0.65, 0, 0.35, 1] as [number, number, number, number],
  /** Quick, decisive departure. */
  exit: [0.55, 0, 0.45, 1] as [number, number, number, number],
};

export const spring = {
  /** Screens: heavy, unhurried, no visible bounce. */
  screen: { type: "spring", stiffness: 88, damping: 20, mass: 1 } as Transition,
  /** Cards and reveals: light overshoot, so surfaces feel placed rather than faded in. */
  soft: { type: "spring", stiffness: 210, damping: 21, mass: 0.85 } as Transition,
  /** Press feedback: fast and dry. */
  press: { type: "spring", stiffness: 620, damping: 32, mass: 0.5 } as Transition,
  /** Sheet travel. */
  sheet: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as Transition,
  /** Hover: tracks the cursor closely, with a touch of give. */
  hover: { type: "spring", stiffness: 320, damping: 24, mass: 0.6 } as Transition,
};

/** Depth used by the tilt entrances. Apply as a style on the animating node. */
export const PERSPECTIVE = 1400;

/**
 * Screens: arrive tipped back and slightly small, settle flat. Leaving, they
 * fall away from the viewer instead of rising out of frame.
 */
export const screenVariants: Variants = {
  initial: { opacity: 0, scale: 0.955, rotateX: 6 },
  animate: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: { ...spring.screen, opacity: { duration: 0.5, ease: ease.silk } },
  },
  exit: {
    opacity: 0,
    scale: 1.035,
    rotateX: -3,
    transition: { duration: 0.34, ease: ease.exit },
  },
};

export const stagger: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
};

/** Faster cadence for dense rows — ledgers, tiles, feeds. */
export const staggerTight: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.032, delayChildren: 0.04 } },
};

/**
 * The child reveal. Blooms open from 94% with a light overshoot — no travel,
 * so a column of these reads as surfaces appearing, not a list scrolling in.
 */
export const rise: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1, transition: spring.soft },
};

/** Row reveal: comes in across the page, with a whisper of tilt. */
export const slideIn: Variants = {
  initial: { opacity: 0, x: -18, rotateY: 4 },
  animate: { opacity: 1, x: 0, rotateY: 0, transition: spring.soft },
};

export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.44, ease: ease.silk } },
  exit: { opacity: 0, transition: { duration: 0.26, ease: ease.exit } },
};

/** Tab to tab: the outgoing panel recedes, the incoming one comes forward. */
/*
  Tab to tab: the outgoing panel recedes, the incoming one comes forward. Kept
  short — this runs before the panel's own contents may begin their stagger, so
  every millisecond here is a millisecond the tab looks empty.
*/
export const tabVariants: Variants = {
  initial: { opacity: 0, scale: 0.985, x: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.3, ease: ease.silk },
  },
  exit: { opacity: 0, scale: 0.994, x: -10, transition: { duration: 0.16, ease: ease.exit } },
};

/**
 * Dashboard entrance. Panels are *dealt* onto the set — each arrives a little
 * low and off-square, then straightens. Distinct from `rise`, which blooms in
 * place and is what the rest of the app uses.
 */
export const dealIn: Variants = {
  initial: { opacity: 0, y: 18, rotate: -1, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 26, mass: 0.8 },
  },
};

/*
  The dashboard deals nine panels. At 70ms apart the last one arrived two
  thirds of a second after the first, which on a phone reads as the page still
  loading rather than the page arriving.
*/
export const bentoStagger: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.045, delayChildren: 0.03 } },
};

/** Shared hover/press gestures, so every interactive surface agrees. */
export const gesture = {
  card: { whileHover: { scale: 1.012 }, whileTap: { scale: 0.988 } },
  tile: { whileHover: { scale: 1.035 }, whileTap: { scale: 0.96 } },
  button: { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 } },
};

/** Shared-element ids used across screens. */
export const layout = {
  logo: "brand-logo",
  primaryAction: "primary-action",
} as const;
