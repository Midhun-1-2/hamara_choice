import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { ease, gesture, spring } from "../lib/motion";

export type ButtonVariant = "primary" | "gold" | "outline" | "quiet";
export type ButtonSize = "sm" | "md" | "lg";

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  /** Icon placed before the label — used for add/copy style actions. */
  leadingIcon?: ReactNode;
  layoutId?: string;
  /** Stretches to the container. Actions in a row usually want this off. */
  block?: boolean;
  className?: string;
  "aria-label"?: string;
}

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5 text-[12.5px]",
  md: "px-6 py-3.5 text-[13px]",
  lg: "px-7 py-[17px] text-[13.5px]",
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "wine-fill text-gold-100 disabled:opacity-40",
  gold: "gold-fill text-wine-900 disabled:opacity-40 disabled:saturate-50",
  outline:
    "bg-pearl text-wine-700 border border-[rgba(212,175,55,0.5)] hover:border-[rgba(212,175,55,0.9)] disabled:opacity-40",
  quiet: "bg-cream text-ink-soft border border-line hover:bg-beige disabled:opacity-40",
};

const shadowFor: Record<ButtonVariant, string> = {
  primary: "0 16px 34px -20px rgba(74,17,23,0.85), 0 2px 6px -3px rgba(74,17,23,0.4)",
  gold: "0 16px 34px -20px rgba(140,105,35,0.75), 0 2px 6px -3px rgba(140,105,35,0.35)",
  outline: "0 8px 22px -18px rgba(68,48,30,0.5)",
  quiet: "none",
};

/**
 * The house action. Burgundy is the default weight; gold is the celebratory
 * one. Both compress by 1.5% on press and carry a single light sweep — the
 * restraint is deliberate, the old metal had four overlapping effects.
 */
export default function PremiumButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
  size = "md",
  icon,
  leadingIcon,
  layoutId,
  block = true,
  className = "",
  ...rest
}: PremiumButtonProps) {
  const reduced = useReducedMotion();
  const filled = variant === "primary" || variant === "gold";

  return (
    <motion.button
      {...rest}
      type={type}
      onClick={onClick}
      disabled={disabled}
      layoutId={layoutId}
      transition={spring.screen}
      initial={false}
      whileTap={disabled || reduced ? undefined : gesture.button.whileTap}
      whileHover={disabled || reduced ? undefined : gesture.button.whileHover}
      className={`group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full font-medium tracking-luxe-sm uppercase transition-colors duration-300 disabled:cursor-not-allowed ${
        block ? "w-full" : ""
      } ${sizeClass[size]} ${variantClass[variant]} ${className}`}
      style={{ boxShadow: disabled ? "none" : shadowFor[variant] }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2.5 whitespace-nowrap">
        {leadingIcon}
        {children}
        {icon}
      </span>

      {/* Light opens out of the centre rather than travelling across the face */}
      {filled && !reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.12) 38%, rgba(255,255,255,0) 68%)",
          }}
          initial={{ scale: 0.2, opacity: 0 }}
          whileHover={disabled ? undefined : { scale: 1, opacity: 0.9 }}
          whileTap={disabled ? undefined : { scale: 1.15, opacity: 1 }}
          transition={{ duration: 0.55, ease: ease.silk }}
        />
      )}

      {/* Struck edge, so the fills read as pressed metal rather than flat ink */}
      {filled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow:
              variant === "gold"
                ? "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -6px 14px rgba(120,88,18,0.28)"
                : "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -6px 16px rgba(24,4,7,0.35)",
          }}
        />
      )}
    </motion.button>
  );
}
