import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { spring } from "../lib/motion";

interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: ReactNode;
  className?: string;
}

/** Square gold tick that fills when checked. One control, used everywhere. */
export default function Checkbox({ checked, onChange, children, className = "" }: CheckboxProps) {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`tap-area flex items-center gap-3 text-left ${className}`}
    >
      <motion.span
        aria-hidden
        animate={{ borderColor: checked ? "rgba(212,175,55,0.9)" : "var(--color-line)" }}
        whileTap={reduced ? undefined : { scale: 0.92 }}
        transition={spring.press}
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] ${
          checked ? "gold-fill" : "bg-pearl"
        }`}
        style={{ borderWidth: 1, borderStyle: "solid" }}
      >
        <AnimatePresence>
          {checked && (
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
      </motion.span>
      <span className="text-[13.5px] text-ink-soft">{children}</span>
    </button>
  );
}
