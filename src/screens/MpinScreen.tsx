import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import MpinDial from "../components/MpinDial";
import MpinKeypad from "../components/MpinKeypad";
import { MPIN_LENGTH } from "../data/mock";
import { ease } from "../lib/motion";

interface MpinScreenProps {
  onComplete: () => void;
}

type Step = "set" | "confirm" | "done";

export default function MpinScreen({ onComplete }: MpinScreenProps) {
  const [step, setStep] = useState<Step>("set");
  const [first, setFirst] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const stepRef = useRef<Step>("set");
  const firstRef = useRef("");
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    firstRef.current = first;
  }, [first]);

  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  const schedule = (fn: () => void, delay: number) => {
    timeouts.current.push(window.setTimeout(fn, delay));
  };

  const handleDigit = useCallback(
    (digit: string) => {
      setError(false);
      setPin((current) => {
        if (stepRef.current === "done" || current.length >= MPIN_LENGTH) return current;
        const next = current + digit;

        if (next.length === MPIN_LENGTH) {
          if (stepRef.current === "set") {
            schedule(() => {
              setFirst(next);
              firstRef.current = next;
              setPin("");
              setStep("confirm");
            }, 340);
          } else {
            /* Prototype: the confirmation is not checked against the first. */
            schedule(() => {
              setStep("done");
              schedule(onComplete, 900);
            }, 240);
          }
        }

        return next;
      });
    },
    [onComplete],
  );

  const handleBackspace = useCallback(() => {
    setError(false);
    setPin((current) => (stepRef.current === "done" ? current : current.slice(0, -1)));
  }, []);

  const copy = {
    set: { eyebrow: "Security", title: "Set your MPIN", body: "Four digits. Used each time you open the vault." },
    confirm: { eyebrow: "Security", title: "Confirm your MPIN", body: "Enter the same four digits once more." },
    done: { eyebrow: "Secured", title: "Vault sealed", body: "Your portfolio is ready." },
  }[step];

  return (
    <AuthLayout
      eyebrow={copy.eyebrow}
      title={
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copy.title}
            className="block"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: ease.silk }}
          >
            {copy.title}
          </motion.span>
        </AnimatePresence>
      }
      body={
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copy.body}
            className="block"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: ease.silk }}
          >
            {copy.body}
          </motion.span>
        </AnimatePresence>
      }
    >
      <div className="flex flex-col items-center">
        <MpinDial
          filled={pin.length}
          total={MPIN_LENGTH}
          status={step === "done" ? "done" : error ? "error" : "idle"}
        />

        <div className="mt-2 min-h-[15px]">
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="mismatch"
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px] text-negative"
              >
                Those didn&apos;t match. Starting again.
              </motion.p>
            )}
            {step === "done" && (
              <motion.p
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 text-[13px] font-medium text-positive"
              >
                <Check size={13} strokeWidth={2.2} />
                MPIN confirmed
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full pt-[clamp(12px,2vh,20px)]">
          <MpinKeypad onDigit={handleDigit} onBackspace={handleBackspace} disabled={step === "done"} />
        </div>

        {/* Prototype: a way past the keypad without setting anything. */}
        <button
          type="button"
          onClick={onComplete}
          disabled={step === "done"}
          className="tap-area mt-3 text-[11.5px] font-medium tracking-luxe-sm uppercase text-wine-700 transition-opacity disabled:opacity-30"
        >
          Skip for now
        </button>
      </div>
    </AuthLayout>
  );
}
