import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIsTouch } from "../hooks/useMediaQuery";

/**
 * The house set, carried through the whole app. It is the same photograph the
 * sign-in screen stands on, pre-blurred at build time and laid under a warm
 * ivory veil — so every screen sits in the same room, and nothing on top of it
 * ever has to fight for contrast.
 */

const BG_PORTRAIT = "/brand/app-bg-mobile.jpg";
const BG_LANDSCAPE = "/brand/app-bg-desktop.jpg";

/** Deterministic motes — transform and opacity only, so the loop stays cheap. */
const motes = Array.from({ length: 7 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  return {
    left: `${(r * 100).toFixed(2)}%`,
    top: `${(((i * 47) % 92) + r * 5).toFixed(2)}%`,
    size: 2 + (i % 3) * 0.8,
    rise: 22 + (i % 4) * 14,
    duration: 24 + (i % 6) * 5,
    delay: (i % 7) * 2.2,
    opacity: 0.2 + (i % 3) * 0.08,
  };
});

function PageBackgroundBase() {
  const reduced = useReducedMotion();
  /*
    The set is full-bleed. Drifting it means a viewport-sized texture being
    composited on every single frame, underneath everything the user is
    scrolling — the most expensive pixel in the app and the least noticed. On a
    phone it stays exactly where it is, and the room looks the same.
  */
  const touch = useIsTouch();
  const still = reduced || touch;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-ivory">
      {/* The photograph, drifting very slowly. Scaled past the edge so the
          blur never shows a soft border. */}
      <motion.div
        className={`absolute -inset-[6%] bg-cover sm:hidden ${still ? "" : "will-change-transform"}`}
        style={{ backgroundImage: `url(${BG_PORTRAIT})`, backgroundPosition: "50% 62%" }}
        animate={still ? undefined : { x: [0, 14, 0], y: [0, -10, 0] }}
        transition={{ duration: 54, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute -inset-[6%] hidden bg-cover sm:block ${still ? "" : "will-change-transform"}`}
        style={{ backgroundImage: `url(${BG_LANDSCAPE})`, backgroundPosition: "50% 58%" }}
        animate={still ? undefined : { x: [0, -16, 0], y: [0, 10, 0] }}
        transition={{ duration: 62, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* Ivory veil — the photograph stays as atmosphere, never as subject */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(176deg, rgba(255,253,249,0.38) 0%, rgba(252,250,245,0.28) 34%, rgba(250,246,238,0.34) 68%, rgba(248,243,233,0.44) 100%)",
        }}
      />

      {/* A little of the set's own warmth allowed back through at the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 56% at 50% 38%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 72%)",
        }}
      />

      {/* Seven separately composited specks is six too many for a phone. */}
      {!still &&
        motes.map((mote, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full will-change-transform"
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
              background:
                "radial-gradient(circle, rgba(212,175,55,0.9) 0%, rgba(212,175,55,0.35) 45%, rgba(212,175,55,0) 72%)",
            }}
            animate={{ y: [0, -mote.rise, 0], opacity: [0, mote.opacity, 0] }}
            transition={{
              duration: mote.duration,
              delay: mote.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Paper grain — stops the veil reading as flat */}
      <div className="grain absolute inset-0 opacity-[0.04]" />
    </div>
  );
}

export default memo(PageBackgroundBase);
