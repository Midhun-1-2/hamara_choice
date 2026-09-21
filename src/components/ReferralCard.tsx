import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Gift, Share2 } from "lucide-react";
import { useState } from "react";
import PremiumCard from "./PremiumCard";
import PremiumButton from "./PremiumButton";
import { referral } from "../data/mock";
import { useToast } from "../hooks/useToasts";
import { ease, spring } from "../lib/motion";

interface ReferralCardProps {
  /** `wide` lays the code beside the copy; `stacked` keeps it in one column. */
  layout?: "wide" | "stacked";
  className?: string;
}

/** A wrapped gift, drawn in line-gold, sitting behind the code. */
function GiftMotif() {
  const reduced = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      fill="none"
      className="pointer-events-none absolute -right-4 -bottom-6 hidden h-36 w-36 opacity-[0.45] sm:block"
    >
      <rect x="28" y="52" width="64" height="44" rx="6" stroke="rgba(176,141,40,0.4)" strokeWidth="1.1" />
      <rect
        x="22"
        y="40"
        width="76"
        height="16"
        rx="5"
        fill="rgba(212,175,55,0.12)"
        stroke="rgba(176,141,40,0.4)"
        strokeWidth="1.1"
      />
      <path d="M60 40 L60 96" stroke="rgba(176,141,40,0.4)" strokeWidth="1.1" />
      <path
        d="M60 40 C 50 40, 40 32, 44 24 C 48 17, 58 26, 60 40 C 62 26, 72 17, 76 24 C 80 32, 70 40, 60 40 Z"
        fill="rgba(212,175,55,0.16)"
        stroke="rgba(176,141,40,0.45)"
        strokeWidth="1.1"
      />
      <motion.circle
        cx="24"
        cy="26"
        r="2"
        fill="rgba(212,175,55,0.8)"
        animate={reduced ? undefined : { opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="104"
        cy="30"
        r="1.6"
        fill="rgba(212,175,55,0.8)"
        animate={reduced ? undefined : { opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 4.4, delay: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function ReferralCard({ layout = "wide", className = "" }: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const reduced = useReducedMotion();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referral.code);
    } catch {
      // Clipboard can be blocked; the toast still confirms the intent.
    }
    setCopied(true);
    toast({ title: "Referral code copied", detail: referral.code });
    window.setTimeout(() => setCopied(false), 2000);
  };

  const share = () => toast({ title: "Share sheet", detail: "Mock action for the demo" });

  return (
    <PremiumCard tone="cream" sheenDelay={1.4} className={className}>
      <GiftMotif />

      <div
        className={
          layout === "wide"
            ? "relative grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-center lg:gap-8"
            : "relative flex flex-col gap-4 sm:gap-5"
        }
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700 sm:h-10 sm:w-10"
              style={{ border: "1px solid rgba(212,175,55,0.38)" }}
            >
              <Gift size={17} strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">Referral</p>
              <h3 className="mt-1 font-display text-[17px] leading-tight text-ink sm:text-[19px]">
                {referral.headline}
              </h3>
            </div>
          </div>

          <p className="mt-2 max-w-[46ch] text-[12.5px] leading-snug text-muted sm:mt-3.5 sm:text-[13.5px] sm:leading-relaxed">
            {referral.body}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted sm:mt-4 sm:gap-x-5 sm:text-[12.5px]">
            <span>
              <span className="font-display text-[15px] text-ink">{referral.invited}</span> invited
            </span>
            <span className="h-3 w-px bg-line" aria-hidden />
            <span>
              <span className="font-display text-[15px] text-ink">{referral.joined}</span> joined
            </span>
          </div>
        </div>

        {/* The code, and the two things you can do with it */}
        <div className="relative">
          <div
            className="flex items-center justify-between gap-3 rounded-2xl bg-pearl px-3.5 py-3 sm:px-4 sm:py-3.5"
            style={{ border: "1px dashed rgba(212,175,55,0.55)" }}
          >
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-luxe uppercase text-muted-soft">Your code</p>
              <p className="mt-1 truncate font-display text-[20px] leading-none tracking-[0.14em] text-gold-foil sm:text-[23px]">
                {referral.code}
              </p>
            </div>

            <motion.button
              type="button"
              onClick={share}
              aria-label="Share referral code"
              whileTap={reduced ? undefined : { scale: 0.94 }}
              transition={spring.press}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-[rgba(212,175,55,0.6)] hover:text-gold-700"
            >
              <Share2 size={15} strokeWidth={1.6} />
            </motion.button>
          </div>

          <div className="mt-2.5 flex gap-2.5 sm:mt-3">
            <PremiumButton
              variant="gold"
              size="sm"
              onClick={copy}
              leadingIcon={
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "done" : "copy"}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2, ease: ease.silk }}
                    className="flex"
                  >
                    {copied ? <Check size={13} strokeWidth={2.6} /> : <Copy size={13} strokeWidth={2} />}
                  </motion.span>
                </AnimatePresence>
              }
            >
              {copied ? "Copied" : "Copy code"}
            </PremiumButton>

            <PremiumButton variant="outline" size="sm" onClick={share}>
              Share
            </PremiumButton>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
