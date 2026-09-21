import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useRef, useState } from "react";
import { ease, spring } from "../lib/motion";

type Status = "idle" | "error" | "verified";

interface OtpInputProps {
  length: number;
  status: Status;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
  disabled?: boolean;
}

/** Gold arc that orbits the cell being typed into. */
function ScanRing() {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 48 48"
      fill="none"
      className="pointer-events-none absolute -inset-[3px]"
      animate={{ rotate: 360 }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="url(#scan-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="26 112"
      />
      <defs>
        <linearGradient id="scan-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e5c76b" />
          <stop offset="100%" stopColor="#8a6a1f" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

/**
 * Six seals rather than six boxes. Each cell is a pressed disc: empty it
 * carries a small gold bead, typed into it flips the digit over, and on a
 * correct code every disc turns to gold in sequence. The input itself sits
 * invisible on top, so keyboard, paste and one-time-code autofill are
 * untouched.
 */
export default function OtpInput({ length, status, onChange, onComplete, disabled }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const reduced = useReducedMotion();

  const commit = (next: string[]) => {
    setDigits(next);
    const value = next.join("");
    onChange(value);
    if (value.length === length && !next.includes("")) onComplete(value);
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    commit(next);
    if (digit && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      commit(next);
      inputs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < length - 1) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    const next = Array<string>(length).fill("");
    pasted.split("").forEach((digit, i) => {
      next[i] = digit;
    });
    commit(next);
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  const filledCount = digits.filter(Boolean).length;
  const errored = status === "error";
  const verified = status === "verified";

  return (
    <div>
      <div
        className="flex items-center justify-between gap-[clamp(5px,1.8vw,10px)]"
        role="group"
        aria-label={`${length} digit verification code`}
      >
        {digits.map((digit, index) => {
          const active = focusedIndex === index && !verified;
          const filled = Boolean(digit);

          return (
            <motion.div
              key={index}
              className="relative aspect-square flex-1"
              style={{ transformPerspective: 700 }}
              animate={
                reduced
                  ? undefined
                  : errored
                    ? { rotate: [0, -5, 5, -3, 0], y: [0, -3, 0] }
                    : { rotate: 0, y: 0 }
              }
              transition={
                errored
                  ? { duration: 0.42, delay: index * 0.035, ease: ease.glide }
                  : spring.soft
              }
            >
              {/* The disc */}
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={false}
                animate={{
                  scale: active ? 1.07 : 1,
                  borderColor: errored
                    ? "rgba(176,59,54,0.65)"
                    : verified
                      ? "rgba(212,175,55,0.9)"
                      : active
                        ? "rgba(212,175,55,0.9)"
                        : filled
                          ? "rgba(212,175,55,0.55)"
                          : "rgba(212,175,55,0.28)",
                  backgroundColor: verified ? "#e8cd7a" : filled ? "#fffdf8" : "#fdfaf3",
                  boxShadow: active
                    ? "0 0 0 4px rgba(212,175,55,0.16), 0 10px 22px -14px rgba(140,105,35,0.7)"
                    : verified
                      ? "0 8px 20px -12px rgba(140,105,35,0.8)"
                      : "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 5px -3px rgba(92,62,30,0.3)",
                }}
                transition={{ duration: 0.4, ease: ease.silk }}
                style={{ borderWidth: 1.5, borderStyle: "solid" }}
              />

              {active && !reduced && <ScanRing />}

              {/* Bead, digit and tick share the centre — only one is ever shown */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  {verified ? (
                    <motion.span
                      key="done"
                      initial={{ opacity: 0, rotateX: -90, scale: 0.7 }}
                      animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ ...spring.soft, delay: index * 0.06 }}
                      className="flex"
                    >
                      <Check size={16} strokeWidth={3} className="text-wine-800" />
                    </motion.span>
                  ) : filled ? (
                    <motion.span
                      key={`d-${digit}`}
                      initial={reduced ? false : { opacity: 0, rotateX: 80, y: -6 }}
                      animate={{ opacity: 1, rotateX: 0, y: 0 }}
                      exit={{ opacity: 0, rotateX: -60, y: 6 }}
                      transition={spring.soft}
                      className={`text-[clamp(18px,4.8vw,22px)] font-semibold leading-none ${
                        errored ? "text-negative" : "text-wine-800"
                      }`}
                    >
                      {digit}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="bead"
                      aria-hidden
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: active ? 0.85 : 0.4, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.4 }}
                      transition={{ duration: 0.28, ease: ease.silk }}
                      className="h-1.5 w-1.5 rounded-full bg-gold-600"
                    />
                  )}
                </AnimatePresence>
              </div>

              <input
                ref={(element) => {
                  inputs.current[index] = element;
                }}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                disabled={disabled}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                aria-label={`Digit ${index + 1}`}
                className="absolute inset-0 h-full w-full cursor-pointer rounded-full bg-transparent text-center text-transparent caret-transparent outline-none"
              />
            </motion.div>
          );
        })}
      </div>

      {/* How much of the code is in, drawn as a gold thread under the seals */}
      <div className="relative mt-4 h-px w-full overflow-hidden rounded-full bg-[rgba(212,175,55,0.2)]">
        <motion.span
          className="gold-fill absolute inset-y-0 left-0 w-full origin-left"
          initial={false}
          animate={{ scaleX: verified ? 1 : filledCount / length }}
          transition={spring.soft}
        />
      </div>
    </div>
  );
}
