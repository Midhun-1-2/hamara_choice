import { motion, useReducedMotion } from "framer-motion";
import { ease } from "../lib/motion";

interface SkeletonProps {
  className?: string;
}

/** A single shimmering plate. Compose these into a page-shaped placeholder. */
export function Skeleton({ className = "" }: SkeletonProps) {
  return <span aria-hidden className={`skeleton block rounded-lg ${className}`} />;
}

interface LoadingStateProps {
  /** How many card placeholders to draw. */
  rows?: number;
  label?: string;
  className?: string;
}

/** Card-shaped waiting state, used while a screen's data settles. */
export default function LoadingState({
  rows = 3,
  label = "Loading",
  className = "",
}: LoadingStateProps) {
  const reduced = useReducedMotion();

  return (
    <div role="status" aria-live="polite" aria-busy className={`flex flex-col gap-4 ${className}`}>
      <span className="sr-only">{label}</span>

      {Array.from({ length: rows }).map((_, index) => (
        <motion.div
          key={index}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.08, ease: ease.silk }}
          className="surface rounded-[var(--radius-card)] p-5 sm:p-6"
        >
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="mt-4 h-7 w-44" />
          <Skeleton className="mt-3 h-2.5 w-full max-w-[280px]" />
        </motion.div>
      ))}
    </div>
  );
}

/** Inline spinner for buttons and small controls. */
export function GoldSpinner({ size = 16 }: { size?: number }) {
  return (
    <motion.span
      aria-hidden
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        border: "2px solid rgba(212,175,55,0.25)",
        borderTopColor: "var(--color-gold-600)",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
    />
  );
}
