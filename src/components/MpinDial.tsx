import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";
import { ease, spring } from "../lib/motion";

interface MpinDialProps {
  filled: number;
  total: number;
  status: "idle" | "error" | "done";
}

const SIZE = 112;
const R = 46;
const CIRC = 2 * Math.PI * R;

/**
 * The vault dial. Each digit closes one quarter of a gold ring around a lock;
 * on the fourth the ring completes, the lock turns to a seal and the whole
 * thing pulses once. Replaces the row of dots, which said how many digits had
 * been typed but nothing about what they were for.
 */
export default function MpinDial({ filled, total, status }: MpinDialProps) {
  const reduced = useReducedMotion();
  const gap = 9;
  const seg = CIRC / total - gap;
  const done = status === "done";
  const errored = status === "error";

  return (
    <motion.div
      className="relative"
      style={{ width: "clamp(74px,15vh,110px)", height: "clamp(74px,15vh,110px)" }}
      animate={
        reduced
          ? undefined
          : errored
            ? { x: [0, -8, 8, -5, 0] }
            : done
              ? { scale: [1, 1.05, 1] }
              : { x: 0, scale: 1 }
      }
      transition={errored ? { duration: 0.42, ease: ease.glide } : spring.soft}
    >
      {/* Glow that swells as the dial closes */}
      <motion.span
        aria-hidden
        className="absolute -inset-3 rounded-full"
        style={{
          background: errored
            ? "radial-gradient(circle, rgba(176,59,54,0.2) 0%, rgba(176,59,54,0) 70%)"
            : "radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0) 70%)",
          filter: "blur(10px)",
        }}
        initial={false}
        animate={{ opacity: done ? 1 : 0.18 + (filled / total) * 0.6, scale: done ? 1.08 : 1 }}
        transition={{ duration: 0.6, ease: ease.silk }}
      />

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="dial-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e5c76b" />
            <stop offset="52%" stopColor="#c29a2c" />
            <stop offset="100%" stopColor="#8a6a1f" />
          </linearGradient>
        </defs>

        {Array.from({ length: total }).map((_, index) => {
          const rotation = -90 + index * (360 / total) + gap / 2 / (CIRC / 360);
          const isSet = index < filled || done;

          return (
            <g key={index} transform={`rotate(${rotation} ${SIZE / 2} ${SIZE / 2})`}>
              {/* The empty quarter */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                stroke="rgba(212,175,55,0.2)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${seg} ${CIRC}`}
              />
              {/* …drawn in when its digit lands */}
              <motion.circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                stroke={errored ? "rgba(176,59,54,0.85)" : "url(#dial-gold)"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${seg} ${CIRC}`}
                initial={false}
                animate={{ strokeDashoffset: isSet ? 0 : seg, opacity: isSet ? 1 : 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { ...spring.soft, delay: done ? index * 0.07 : 0 }
                }
              />
            </g>
          );
        })}
      </svg>

      {/* The lock at the centre, which becomes a seal once the dial closes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.span
              key="sealed"
              initial={{ opacity: 0, scale: 0.5, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ ...spring.soft, delay: 0.24 }}
              className="gold-fill flex h-11 w-11 items-center justify-center rounded-full text-wine-900"
              style={{ boxShadow: "0 10px 22px -12px rgba(140,105,35,0.9)" }}
            >
              <ShieldCheck size={20} strokeWidth={2} />
            </motion.span>
          ) : (
            <motion.span
              key="locked"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={spring.soft}
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                errored ? "bg-[rgba(176,59,54,0.08)] text-negative" : "bg-gold-50 text-gold-700"
              }`}
              style={{
                border: errored
                  ? "1px solid rgba(176,59,54,0.4)"
                  : "1px solid rgba(212,175,55,0.35)",
              }}
            >
              <Lock size={17} strokeWidth={1.8} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
