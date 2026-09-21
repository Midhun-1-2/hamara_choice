import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { gesture, rise, spring } from "../lib/motion";

export type CardTone = "pearl" | "cream" | "gilt" | "wine";

interface PremiumCardProps {
  children: ReactNode;
  tone?: CardTone;
  /** Makes the card a button and enables the lift interaction. */
  onClick?: () => void;
  layoutId?: string;
  className?: string;
  padded?: boolean;
  label?: string;
  /** Opts this card out of the entrance stagger (already inside one). */
  still?: boolean;
  /** Offsets the sheen so neighbouring cards stay out of step. */
  sheenDelay?: number;
}

const toneClass: Record<CardTone, string> = {
  pearl: "surface",
  cream: "surface-cream",
  gilt: "surface-gilt",
  wine: "surface-wine text-gold-100",
};

/**
 * Every plate in the app. Pearl and cream carry the interface; gilt marks the
 * one module that matters most on a screen; wine is reserved for editorial and
 * promotional moments.
 */
export default function PremiumCard({
  children,
  tone = "pearl",
  onClick,
  layoutId,
  className = "",
  padded = true,
  label,
  still = false,
  sheenDelay = 0,
}: PremiumCardProps) {
  const reduced = useReducedMotion();
  const interactive = Boolean(onClick);
  const gilded = tone === "gilt" || tone === "wine";

  return (
    <motion.div
      variants={still ? undefined : rise}
      layoutId={layoutId}
      transition={spring.soft}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={label}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      whileHover={interactive && !reduced ? gesture.card.whileHover : undefined}
      whileTap={interactive && !reduced ? gesture.card.whileTap : undefined}
      className={`${toneClass[tone]} relative isolate overflow-hidden rounded-[var(--radius-card)] transition-shadow duration-500 ${
        interactive ? "cursor-pointer hover:lift-soft" : ""
      } ${padded ? "p-4 sm:p-6" : ""} ${className}`}
    >
      {/* Gold reflection along the top edge of the premium plates */}
      {gilded && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px"
          style={{
            background:
              tone === "wine"
                ? "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(229,199,107,0.6) 50%, rgba(212,175,55,0) 100%)"
                : "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.7) 50%, rgba(212,175,55,0) 100%)",
          }}
        />
      )}

      {gilded && !reduced && (
        <>
          {/* The top rule brightens from its centre instead of a band running along it */}
          <span
            aria-hidden
            className="edge-pulse pointer-events-none absolute inset-x-6 top-0 h-px will-change-transform"
            style={{
              background:
                "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(255,246,219,0.95) 50%, rgba(212,175,55,0) 100%)",
              animationDelay: `${sheenDelay}s`,
            }}
          />

          {/* A warm bloom swelling in the corner of the plate */}
          <span
            aria-hidden
            className="glow-breathe pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full will-change-transform"
            style={{
              background:
                tone === "wine"
                  ? "radial-gradient(circle, rgba(229,199,107,0.16) 0%, rgba(229,199,107,0) 70%)"
                  : "radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0) 70%)",
              filter: "blur(14px)",
              animationDelay: `${sheenDelay + 1.2}s`,
            }}
          />
        </>
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
