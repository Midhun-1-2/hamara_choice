import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { formatRupees } from "../lib/format";
import { gesture, rise, spring } from "../lib/motion";

export interface Scheme {
  name: string;
  tenure: string;
  note: string;
  minimum: number;
}

interface SchemeCardProps {
  scheme: Scheme;
  /** Draws the selected treatment and the tick. */
  selected?: boolean;
  onSelect?: () => void;
  /** Trailing control when the card is not a chooser — e.g. an enquire link. */
  action?: ReactNode;
  className?: string;
}

/**
 * One plan, stated plainly: what it is called, how long it runs, what it gives
 * you and what it costs to start. Doubles as the chooser in Join Scheme.
 */
export default function SchemeCard({
  scheme,
  selected = false,
  onSelect,
  action,
  className = "",
}: SchemeCardProps) {
  const reduced = useReducedMotion();
  const choosable = Boolean(onSelect);

  return (
    <motion.div
      variants={rise}
      role={choosable ? "radio" : undefined}
      aria-checked={choosable ? selected : undefined}
      tabIndex={choosable ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        choosable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      whileHover={choosable && !reduced ? gesture.card.whileHover : undefined}
      whileTap={choosable && !reduced ? gesture.card.whileTap : undefined}
      transition={spring.soft}
      className={`relative isolate flex h-full flex-col overflow-hidden rounded-[var(--radius-tile)] p-3.5 transition-all duration-400 sm:p-5 ${
        selected
          ? "surface-gilt"
          : "bg-pearl border border-line-soft shadow-[0_1px_2px_rgba(68,48,30,0.04),0_12px_30px_-24px_rgba(68,48,30,0.35)]"
      } ${choosable ? "cursor-pointer hover:lift-soft" : ""} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-[18px] leading-tight text-ink">{scheme.name}</p>
          <p className="mt-1 text-[11.5px] font-medium tracking-luxe-sm uppercase text-gold-700">{scheme.tenure}</p>
        </div>

        {choosable ? (
          <span
            aria-hidden
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-400 ${
              selected ? "gold-fill border-transparent" : "border-line bg-cream"
            }`}
          >
            <AnimatePresence>
              {selected && (
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={spring.press}
                  className="flex"
                >
                  <Check size={13} strokeWidth={3} className="text-wine-900" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        ) : (
          action
        )}
      </div>

      <p className="mb-3 mt-2.5 text-[12.5px] leading-snug text-muted sm:mb-4 sm:mt-3 sm:text-[13px] sm:leading-relaxed">{scheme.note}</p>

      <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-3">
        <span className="text-[11.5px] font-medium tracking-luxe-sm uppercase text-muted-soft">From</span>
        <span className="font-display text-[15px] text-ink">
          {formatRupees(scheme.minimum)}
          <span className="ml-1 font-sans text-[12.5px] text-muted">/ month</span>
        </span>
      </div>
    </motion.div>
  );
}
