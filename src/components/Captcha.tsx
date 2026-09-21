import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ease, spring } from "../lib/motion";

interface CaptchaProps {
  /** Reports the drawn code so a real build could check it. */
  onIssued?: (code: string) => void;
  className?: string;
}

/** No look-alikes: O/0 and I/1/l are left out so the code is readable in gold. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const LENGTH = 5;

const draw = () =>
  Array.from({ length: LENGTH }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");

/**
 * The house challenge: five characters struck across a gilded plate, each one
 * set at its own angle, with two hairlines ruled over the top. Prototype only —
 * nothing is checked, the refresh simply draws a new one.
 */
export default function Captcha({ onIssued, className = "" }: CaptchaProps) {
  const [code, setCode] = useState(draw);
  const reduced = useReducedMotion();

  useEffect(() => {
    onIssued?.(code);
  }, [code, onIssued]);

  const refresh = useCallback(() => setCode(draw()), []);

  return (
    <div className={`flex items-stretch gap-2.5 ${className}`}>
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl px-3 py-2.5"
        style={{
          background: "linear-gradient(135deg, #fdf9ef 0%, #f6ecd6 52%, #fdf9ef 100%)",
          border: "1px solid rgba(212,175,55,0.5)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
        aria-label={`Captcha code ${code.split("").join(" ")}`}
        role="img"
      >
        {/* Two hairlines ruled across the plate */}
        <svg aria-hidden viewBox="0 0 200 48" fill="none" className="absolute inset-0 h-full w-full">
          <path
            d="M2 34 C 48 14, 96 40, 198 16"
            stroke="rgba(176,141,40,0.32)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M2 16 C 62 40, 118 10, 198 32"
            stroke="rgba(107,31,38,0.16)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>

        <AnimatePresence mode="wait">
          <motion.div
            key={code}
            className="relative flex items-center gap-1.5"
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: ease.silk }}
          >
            {code.split("").map((character, index) => (
              <motion.span
                key={`${code}-${index}`}
                className="font-display text-[21px] leading-none text-wine-800 select-none"
                style={{
                  transform: `rotate(${(index % 2 ? 1 : -1) * (5 + index * 2)}deg) translateY(${
                    index % 3 === 0 ? -2 : 2
                  }px)`,
                  textShadow: "0 1px 0 rgba(255,255,255,0.8)",
                }}
                initial={reduced ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring.press, delay: index * 0.045 }}
              >
                {character}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        onClick={refresh}
        aria-label="New captcha code"
        whileTap={reduced ? undefined : { scale: 0.92, rotate: -90 }}
        transition={spring.press}
        className="flex w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-pearl text-muted transition-colors duration-300 hover:border-[rgba(212,175,55,0.7)] hover:text-gold-700"
      >
        <RefreshCw size={15} strokeWidth={1.8} />
      </motion.button>
    </div>
  );
}
