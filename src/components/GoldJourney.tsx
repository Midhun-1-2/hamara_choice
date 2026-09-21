import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import PremiumCard from "./PremiumCard";
import PremiumButton from "./PremiumButton";
import RollingNumber from "./RollingNumber";
import { formatGrams, formatRupees } from "../lib/format";
import { schemeCallout, wallet } from "../data/mock";
import { ease, layout } from "../lib/motion";

interface GoldJourneyProps {
  onExplore: () => void;
  onPay?: () => void;
  className?: string;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** The instalment ring: a gold arc drawing itself to the plan's progress. */
function ProgressRing({ paid, total }: { paid: number; total: number }) {
  const reduced = useReducedMotion();
  const ratio = paid / total;

  /*
    The caption sits under the circle rather than inside it. At the mobile ring
    size the word is wider than the ring, so in the centre it ran across the
    gold arc and crowded the figures in the next column.
  */
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <div className="relative flex h-[92px] w-[92px] items-center justify-center sm:h-[136px] sm:w-[136px] lg:h-[150px] lg:w-[150px]">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" fill="none" aria-hidden>
        <defs>
          <linearGradient id="ring-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c29a2c" />
            <stop offset="50%" stopColor="#e5c76b" />
            <stop offset="100%" stopColor="#a8801f" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r={RADIUS} stroke="#f0e5d2" strokeWidth="9" />
        <motion.circle
          cx="64"
          cy="64"
          r={RADIUS}
          stroke="url(#ring-gold)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={reduced ? false : { strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - ratio) }}
          transition={{ duration: 1.6, delay: 0.45, ease: ease.silk }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <p className="font-display text-[22px] leading-none text-ink sm:text-[32px]">
          {paid}
          <span className="text-[13px] text-muted-soft sm:text-[18px]">/{total}</span>
        </p>
      </div>
      </div>

      <p className="text-[10px] font-medium tracking-luxe-sm uppercase text-gold-700 sm:text-[11px] sm:tracking-luxe">
        Instalments
      </p>
    </div>
  );
}

/**
 * "I am building towards my next piece." The active plan is visualised on the
 * left; the invitation to start another sits on the right.
 */
export default function GoldJourney({ onExplore, onPay, className = "" }: GoldJourneyProps) {
  const { scheme } = wallet;
  const remaining = scheme.total - scheme.paid;

  return (
    <PremiumCard tone="cream" padded={false} sheenDelay={2.4} className={className}>
      <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-7 lg:p-8">
        {/* Where the plan stands */}
        <div className="flex items-center gap-4 sm:gap-7">
          <ProgressRing paid={scheme.paid} total={scheme.total} />

          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">Your plan</p>
            <p className="mt-1.5 font-display text-[17px] leading-tight text-ink sm:mt-2 sm:text-[21px]">{scheme.name}</p>
            <p className="mt-1 text-[12px] text-muted sm:mt-1.5 sm:text-[13px]">
              {formatRupees(scheme.monthly)} every month
            </p>

            {/*
              The column next to the ring is narrow on a 320px phone — narrow
              enough that a label and its figure will not sit on one line. The
              rows wrap rather than push the figure out of the card.
            */}
            <dl className="mt-3 flex flex-col gap-1.5 border-t border-line-soft pt-3 text-[12.5px] sm:mt-4 sm:gap-2 sm:pt-3.5 sm:text-[13px]">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                <dt className="text-muted">Gold held</dt>
                <dd className="font-display text-[14px] text-ink"><RollingNumber value={formatGrams(wallet.goldGrams)} delay={0.45} /></dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                <dt className="text-muted">Remaining</dt>
                <dd className="font-display text-[14px] whitespace-nowrap text-ink">
                  {remaining} {remaining === 1 ? "month" : "months"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Where it could go next */}
        <div className="min-w-0 border-t border-line-soft pt-3 sm:pt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,175,55,0.45)] bg-gold-50 px-2 py-0.5 text-[10px] font-medium tracking-luxe uppercase text-gold-700 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[11px]">
            <Sparkles size={10} strokeWidth={1.7} />
            {schemeCallout.eyebrow}
          </span>

          <h3 className="mt-2 font-display text-[16px] leading-[1.15] text-ink sm:mt-4 sm:text-[23px] lg:text-[27px]">
            {schemeCallout.title}
          </h3>
          <p className="mt-1 max-w-[44ch] text-[12px] leading-snug text-muted sm:mt-3 sm:text-[13.5px] sm:leading-relaxed">
            {schemeCallout.body}
          </p>

          {/*
            One under the other on phones. Both labels are set in tracking
            uppercase and neither may wrap, so side by side they need about
            390px of pill — nearly a hundred more than a 320px phone has inside
            this card, and the text simply ran out through the ends. Full width
            each, and the same row again from `lg` up — which is where the app
            leaves the phone frame and the card finally has that width.
          */}
          <div className="mt-3 flex flex-col gap-2 sm:mt-6 lg:flex-row lg:flex-wrap lg:gap-2.5">
            <PremiumButton
              layoutId={layout.primaryAction}
              onClick={onExplore}
              block={false}
              className="w-full lg:w-auto"
              icon={<ArrowRight size={14} strokeWidth={1.9} />}
            >
              {schemeCallout.action}
            </PremiumButton>

            {onPay && (
              <PremiumButton
                variant="outline"
                onClick={onPay}
                block={false}
                className="w-full lg:w-auto"
              >
                Make a payment
              </PremiumButton>
            )}
          </div>
        </div>
      </div>

      {/* Gold rule tying the two halves together */}
      <motion.span
        aria-hidden
        className="divider-gold pointer-events-none absolute inset-x-8 bottom-0 h-px"
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.1, delay: 0.5, ease: ease.silk }}
      />
    </PremiumCard>
  );
}
