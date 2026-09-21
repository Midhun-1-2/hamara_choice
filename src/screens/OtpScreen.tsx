import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";
import PremiumButton from "../components/PremiumButton";
import { OTP_COUNTDOWN, OTP_LENGTH } from "../data/mock";
import { maskPhone } from "../lib/format";
import { ease, layout } from "../lib/motion";

interface OtpScreenProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

type Status = "idle" | "error" | "verified";

export default function OtpScreen({ phone, onVerified, onBack }: OtpScreenProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(OTP_COUNTDOWN);
  const [fieldKey, setFieldKey] = useState(0);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  /* Prototype: any code passes, and so does no code at all. */
  const verify = () => {
    if (status === "verified") return;
    setStatus("verified");
    timeouts.current.push(window.setTimeout(onVerified, 750));
  };

  const resend = () => {
    if (seconds > 0) return;
    setSeconds(OTP_COUNTDOWN);
    setStatus("idle");
    setFieldKey((key) => key + 1);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <AuthLayout
      eyebrow="Verification"
      title="Enter your six digits"
      body={
        <>
          We sent a one-time code to{" "}
          <span className="font-medium text-ink">{maskPhone(phone)}</span>. It stays valid for half a
          minute.
        </>
      }
      onBack={onBack}
      backLabel="Back to registration"
    >
      <OtpInput
        key={fieldKey}
        length={OTP_LENGTH}
        status={status}
        onChange={() => {
          if (status === "error") setStatus("idle");
        }}
        onComplete={verify}
        disabled={status === "verified"}
      />

      <div className="mt-3.5 min-h-[17px]">
        <AnimatePresence mode="wait">
          {status === "verified" && (
            <motion.p
              key="verified"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: ease.silk }}
              className="flex items-center gap-1.5 text-[13px] font-medium text-positive"
            >
              <Check size={13} strokeWidth={2.2} />
              Number verified
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* The window on the code, draining in place of a boxed countdown */}
      <div className="mt-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex items-baseline gap-2 text-[12.5px] text-muted">
            {seconds > 0 ? (
              <>
                Expires in
                <span className="font-display text-[17px] leading-none tabular-nums text-wine-800">
                  {mm}:{ss}
                </span>
              </>
            ) : (
              <span className="text-negative">Code expired</span>
            )}
          </span>

          <button
            type="button"
            onClick={resend}
            disabled={seconds > 0}
            className="tap-area text-[11.5px] font-medium tracking-luxe-sm uppercase text-wine-700 transition-opacity disabled:opacity-30"
          >
            Resend code
          </button>
        </div>

        <div className="relative mt-2 h-[3px] w-full overflow-hidden rounded-full bg-[rgba(212,175,55,0.16)]">
          <motion.span
            className="gold-fill absolute inset-y-0 left-0 w-full origin-left rounded-full"
            initial={false}
            animate={{ scaleX: seconds / OTP_COUNTDOWN }}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </div>
      </div>

      <div className="pt-[clamp(18px,2.8vh,26px)]">
        <PremiumButton
          layoutId={layout.primaryAction}
          onClick={verify}
          disabled={status === "verified"}
          size="lg"
          icon={<ShieldCheck size={15} strokeWidth={1.8} />}
        >
          {status === "verified" ? "Verified" : "Verify"}
        </PremiumButton>
      </div>
    </AuthLayout>
  );
}
