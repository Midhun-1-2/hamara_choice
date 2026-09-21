import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Delete } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ease, spring } from "../lib/motion";

interface MpinKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"] as const;

/**
 * Pressed-metal keys: pale pills with a gold hairline and serif numerals.
 * Pressing one sends a gold ring out from under it and warms the face for a
 * beat. Physical keyboard digits work too.
 */
export default function MpinKeypad({ onDigit, onBackspace, disabled = false }: MpinKeypadProps) {
  const [pulse, setPulse] = useState<{ id: number; key: string } | null>(null);
  const pulseId = useRef(0);
  const reduced = useReducedMotion();

  const flash = useCallback((key: string) => {
    pulseId.current += 1;
    setPulse({ id: pulseId.current, key });
  }, []);

  useEffect(() => {
    if (disabled) return;
    const handler = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) {
        onDigit(event.key);
        flash(event.key);
      } else if (event.key === "Backspace") {
        onBackspace();
        flash("back");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDigit, onBackspace, disabled, flash]);

  const press = (key: string) => {
    if (disabled) return;
    flash(key);
    if (key === "back") onBackspace();
    else if (key !== "clear") onDigit(key);
    else for (let i = 0; i < 4; i += 1) onBackspace();
  };

  return (
    <div
      className="grid grid-cols-3 gap-[clamp(6px,1.2vh,13px)]"
      role="group"
      aria-label="PIN keypad"
    >
      {keys.map((key) => {
        const isAction = key === "back" || key === "clear";
        const lit = pulse?.key === key;

        return (
          <motion.button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => press(key)}
            whileTap={reduced || disabled ? undefined : { scale: 0.94 }}
            whileHover={reduced || disabled ? undefined : { scale: 1.03 }}
            transition={spring.press}
            aria-label={key === "back" ? "Delete" : key === "clear" ? "Clear" : key}
            className="relative isolate flex h-[clamp(40px,5.6vh,58px)] items-center justify-center rounded-full disabled:opacity-40"
            style={{
              background: isAction
                ? "linear-gradient(160deg, rgba(248,244,234,0.92), rgba(243,234,217,0.92))"
                : "linear-gradient(160deg, rgba(255,255,255,0.96), rgba(253,249,239,0.94))",
              border: "1px solid rgba(212,175,55,0.3)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 16px -12px rgba(92,62,30,0.6)",
            }}
          >
            {/* A gold ring leaving the key on press */}
            <AnimatePresence>
              {lit && !reduced && (
                <motion.span
                  key={pulse?.id}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{ border: "1.5px solid rgba(212,175,55,0.8)" }}
                  initial={{ opacity: 0.9, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.35 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: ease.silk }}
                  onAnimationComplete={() => setPulse(null)}
                />
              )}
            </AnimatePresence>

            {/* …and the face warming for a beat underneath it */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0) 70%)",
              }}
              initial={false}
              animate={{ opacity: lit ? 1 : 0 }}
              transition={{ duration: lit ? 0.12 : 0.5, ease: ease.silk }}
            />

            <span
              className={`relative z-10 ${
                isAction
                  ? "text-[11.5px] font-medium tracking-luxe-sm uppercase text-muted"
                  : "text-[clamp(21px,5.2vw,26px)] font-semibold text-wine-800"
              }`}
            >
              {key === "back" ? (
                <Delete size={18} strokeWidth={1.6} className="text-muted" />
              ) : key === "clear" ? (
                "Clear"
              ) : (
                key
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
