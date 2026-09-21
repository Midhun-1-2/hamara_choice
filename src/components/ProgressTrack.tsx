import { motion, useReducedMotion } from "framer-motion";
import { ease } from "../lib/motion";

interface ProgressTrackProps {
  /** 0-100. */
  value: number;
  label?: string;
  delay?: number;
  className?: string;
}

/** The linear gold rule that fills to show how far a plan has come. */
export default function ProgressTrack({
  value,
  label = "Progress",
  delay = 0.4,
  className = "",
}: ProgressTrackProps) {
  const reduced = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`relative h-[7px] w-full overflow-hidden rounded-full bg-beige ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <motion.span
        className="gold-fill absolute inset-y-0 left-0 w-full origin-left rounded-full"
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: clamped / 100 }}
        transition={{ duration: 1.4, delay, ease: ease.silk }}
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)" }}
      />
    </div>
  );
}
