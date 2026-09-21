import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { gesture, rise, spring } from "../lib/motion";

interface StatCardProps {
  label: string;
  value: ReactNode;
  /** One line of context under the number. */
  detail?: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  /** Warms the tile — used for the one figure that matters most in a row. */
  accent?: boolean;
  className?: string;
}

/**
 * Compact figure tile. Three or four of these make the financial strip that
 * replaced the old stack of equally-weighted cards.
 */
export default function StatCard({
  label,
  value,
  detail,
  icon,
  onClick,
  accent = false,
  className = "",
}: StatCardProps) {
  const reduced = useReducedMotion();
  const interactive = Boolean(onClick);

  return (
    <motion.div
      variants={rise}
      transition={spring.soft}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
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
      className={`${
        accent ? "surface-gilt" : "surface"
      } relative isolate flex min-w-0 flex-col justify-between overflow-hidden rounded-[var(--radius-tile)] p-3.5 transition-shadow duration-500 sm:p-[18px] ${
        interactive ? "cursor-pointer hover:lift-soft" : ""
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] leading-tight font-medium tracking-luxe-sm uppercase text-muted">{label}</p>
        {icon && (
          <span
            aria-hidden
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-7 sm:w-7 ${
              accent ? "bg-[rgba(212,175,55,0.16)] text-gold-700" : "bg-cream text-wine-700"
            }`}
          >
            {icon}
          </span>
        )}
      </div>

      <p className="mt-2 font-display text-[19px] leading-none text-ink sm:mt-3 sm:text-[23px]">{value}</p>
      {detail && <p className="mt-1 truncate text-[11.5px] text-muted sm:mt-1.5 sm:text-[12.5px]">{detail}</p>}
    </motion.div>
  );
}
