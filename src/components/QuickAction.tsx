import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { gesture, slideIn, spring } from "../lib/motion";

interface QuickActionProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** Fills the disc with gold — for the single most-used action in a rail. */
  primary?: boolean;
  /** Set when the tile sits on the burgundy rail rather than a pale card. */
  onWine?: boolean;
  className?: string;
}

/**
 * One tile in the quick-action cluster: a gold-rimmed disc over a short label.
 * On phones these sit in a horizontally scrolling rail; on desktop they line up
 * as a row of tiles.
 */
export default function QuickAction({
  label,
  icon,
  onClick,
  primary = false,
  onWine = false,
  className = "",
}: QuickActionProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      variants={slideIn}
      onClick={onClick}
      whileHover={reduced ? undefined : gesture.tile.whileHover}
      whileTap={reduced ? undefined : gesture.tile.whileTap}
      transition={spring.hover}
      className={`group flex h-full min-w-0 flex-col items-center justify-start gap-1 rounded-[var(--radius-tile)] px-1.5 py-2 text-center transition-shadow duration-400 sm:gap-2.5 sm:px-3 sm:py-4 ${
        onWine ? "bg-[rgba(255,246,224,0.07)]" : "surface hover:lift-soft"
      } ${className}`}
      style={onWine ? { border: "1px solid rgba(212,175,55,0.22)" } : undefined}
    >
      <span
        aria-hidden
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-400 group-hover:scale-105 sm:h-11 sm:w-11 ${
          primary
            ? "gold-fill text-wine-900"
            : onWine
              ? "bg-[rgba(255,246,224,0.1)] text-gold-200"
              : "bg-gold-50 text-wine-700"
        }`}
        style={{
          border: primary ? "none" : "1px solid rgba(212,175,55,0.38)",
          boxShadow: primary
            ? "0 10px 22px -12px rgba(140,105,35,0.7), inset 0 1px 0 rgba(255,255,255,0.5)"
            : onWine
              ? "none"
              : "inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        {icon}
      </span>
      <span
        className={`w-full text-[10px] leading-tight font-medium break-words hyphens-auto sm:text-[12px] ${
          onWine ? "text-gold-100/90" : "text-ink-soft"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}
