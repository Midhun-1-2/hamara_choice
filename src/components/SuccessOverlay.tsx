import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { ease, spring } from "../lib/motion";

interface SuccessOverlayProps {
  open: boolean;
  title: string;
  detail?: string;
  /** Fires once the celebration has played out. */
  onDone: () => void;
  /** How long the seal holds before handing back. */
  holdMs?: number;
}

/** Gold sparks thrown outward as the seal lands. */
const SPARKS = Array.from({ length: 10 }, (_, index) => {
  const angle = (index / 10) * Math.PI * 2;
  return { x: Math.cos(angle) * 78, y: Math.sin(angle) * 78, delay: 0.24 + index * 0.012 };
});

/**
 * The confirmation moment: the page dims to warm ink, a gold seal presses in
 * with a drawn tick, sparks throw outward, and the whole thing lifts away.
 */
export default function SuccessOverlay({
  open,
  title,
  detail,
  onDone,
  holdMs = 1900,
}: SuccessOverlayProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onDone, reduced ? 700 : holdMs);
    return () => window.clearTimeout(timer);
  }, [open, onDone, holdMs, reduced]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-[60] flex items-center justify-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: ease.silk }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "rgba(43,14,18,0.52)", backdropFilter: "blur(3px)" }}
          />

          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.92, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -8 }}
            transition={spring.soft}
          >
            <div className="relative flex h-[104px] w-[104px] items-center justify-center">
              {/* Ring pressing outward as the seal lands */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ border: "1.5px solid rgba(229,199,107,0.7)" }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.6, 1.35], opacity: [0.9, 0] }}
                transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid rgba(229,199,107,0.45)" }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.6, 1.7], opacity: [0.7, 0] }}
                transition={{ duration: 1.3, delay: 0.36, ease: "easeOut" }}
              />

              {!reduced &&
                SPARKS.map((spark, index) => (
                  <motion.span
                    key={index}
                    aria-hidden
                    className="absolute h-1 w-1 rounded-full bg-gold-300"
                    style={{ boxShadow: "0 0 6px rgba(229,199,107,0.9)" }}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                    animate={{ x: spark.x, y: spark.y, opacity: [0, 1, 0], scale: [0.4, 1, 0.3] }}
                    transition={{ duration: 0.9, delay: spark.delay, ease: "easeOut" }}
                  />
                ))}

              {/* The seal itself */}
              <motion.span
                className="gold-fill relative flex h-[76px] w-[76px] items-center justify-center rounded-full text-wine-900"
                style={{
                  boxShadow:
                    "0 20px 44px -18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
                initial={{ scale: 0.4, rotate: -22, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ ...spring.press, delay: 0.1 }}
              >
                <motion.span
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...spring.press, delay: 0.32 }}
                  className="flex"
                >
                  <Check size={34} strokeWidth={2.6} />
                </motion.span>
              </motion.span>
            </div>

            <motion.p
              className="mt-6 text-center font-display text-[22px] leading-tight text-gold-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42, ease: ease.silk }}
            >
              {title}
            </motion.p>

            {detail && (
              <motion.p
                className="mt-2 max-w-[30ch] text-center text-[13px] leading-snug text-gold-200/85"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.54, ease: ease.silk }}
              >
                {detail}
              </motion.p>
            )}

            {/* Gold rule drawing under the message */}
            <motion.span
              aria-hidden
              className="gold-fill mt-5 h-px origin-center rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 96, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.62, ease: ease.silk }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
