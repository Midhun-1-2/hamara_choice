import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface GoldBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  /** Adds the slow pulsing dot used by the live rate. */
  live?: boolean;
  tone?: "gold" | "wine" | "quiet" | "onWine";
  className?: string;
}

const toneClass = {
  gold: "border-[rgba(212,175,55,0.45)] bg-gold-50 text-gold-700",
  wine: "border-[rgba(107,31,38,0.22)] bg-wine-50 text-wine-700",
  quiet: "border-line bg-cream text-muted",
  onWine: "border-[rgba(229,199,107,0.35)] bg-[rgba(212,175,55,0.12)] text-gold-200",
} as const;

/** Small tracked capsule: LIVE, purity, KYC, tenure, status. */
export default function GoldBadge({
  children,
  icon,
  live = false,
  tone = "gold",
  className = "",
}: GoldBadgeProps) {
  const reduced = useReducedMotion();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-luxe-sm uppercase ${toneClass[tone]} ${className}`}
    >
      {live && (
        <motion.span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-gold-500"
          style={{ boxShadow: "0 0 0 3px rgba(212,175,55,0.18)" }}
          animate={reduced ? undefined : { opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {icon}
      {children}
    </span>
  );
}
