import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import GoldBadge from "./GoldBadge";
import GoldRateChart from "./GoldRateChart";
import PremiumCard from "./PremiumCard";
import RollingNumber from "./RollingNumber";
import { useIsTouch } from "../hooks/useMediaQuery";
import { formatRupeesExact } from "../lib/format";
import { goldRate } from "../data/mock";
import { spring } from "../lib/motion";

/** Ingot motif, drawn in line-gold — the old rotating dial was too busy for cream. */
function IngotMotif() {
  const reduced = useReducedMotion();
  /*
    Four infinite Framer (JS, rAF-driven) animations live in this one motif —
    the float plus three staggered sparkles — on top of everything else this
    card already runs on a timer. Each is individually cheap; on a phone,
    stacked with the rest of the screen's own decoration, they are part of
    what adds up to "laggy". A coarse pointer never sees this motif's
    intended context (a cursor drifting past it), so it holds still there.
  */
  const touch = useIsTouch();
  const still = reduced || touch;

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 160 160"
      fill="none"
      className="pointer-events-none absolute -right-4 -top-6 hidden h-36 w-36 opacity-[0.42] sm:block sm:h-40 sm:w-40 lg:-right-12 lg:top-auto lg:bottom-[-18px] lg:h-40 lg:w-40"
      animate={still ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="ingot-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(212,175,55,0.5)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0.12)" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((row) => (
        <g key={row} transform={`translate(${row * 9} ${row * -17})`}>
          <path
            d={`M42 ${118} L54 ${104} L118 ${104} L106 ${118} Z`}
            fill="url(#ingot-gold)"
            stroke="rgba(176,141,40,0.4)"
            strokeWidth="0.9"
          />
        </g>
      ))}
      {[[126, 48], [40, 40], [136, 92]].map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M${x} ${y - 7} L${x + 1.8} ${y - 1.8} L${x + 7} ${y} L${x + 1.8} ${y + 1.8} L${x} ${y + 7} L${x - 1.8} ${y + 1.8} L${x - 7} ${y} L${x - 1.8} ${y - 1.8} Z`}
          fill="rgba(212,175,55,0.55)"
          animate={still ? undefined : { opacity: [0.25, 0.9, 0.25], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 4.5, delay: i * 1.3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      ))}
    </motion.svg>
  );
}

const CYCLE_MS = 4200;

/**
 * The headline module: a gilded plate split between the number and its
 * movement. The purity selector sits under the price on phones and beside the
 * chart on desktop, so the figure always leads. It also steps through the
 * three weights on its own, the way a rate board would — the same
 * self-advancing pattern as the promotions card below it.
 */
export default function GoldRateCard() {
  const [selected, setSelected] = useState(goldRate.options[0].id);
  const active = goldRate.options.find((option) => option.id === selected) ?? goldRate.options[0];
  const falling = active.change < 0;
  const reduced = useReducedMotion();
  const touch = useIsTouch();

  /*
    Every automatic tick remounts `RollingNumber` (it is keyed on `active.id`),
    which replays the full digit-drum roll for every character in the price —
    real, repeated Framer animation work, on a timer, whether anyone is
    looking or not. On a phone that is the single heaviest thing on this
    screen firing every 4.2 seconds forever, and it is pure decoration: the
    purity chips underneath do the same job on a tap. Touch devices keep the
    chips, lose the clock.
  */
  useEffect(() => {
    if (reduced || touch) return;
    const timer = window.setInterval(() => {
      setSelected((current) => {
        const index = goldRate.options.findIndex((option) => option.id === current);
        return goldRate.options[(index + 1) % goldRate.options.length].id;
      });
    }, CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [reduced, touch]);

  return (
    <PremiumCard tone="gilt" padded={false} sheenDelay={0} className="overflow-hidden">
      <div className="relative grid gap-2 p-3 sm:gap-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12 lg:p-8">
        {/* The number */}
        <div className="relative min-w-0">
          <IngotMotif />
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-medium tracking-luxe uppercase text-gold-700 sm:text-[11px]">Today&apos;s gold rate</p>
            <GoldBadge live>Live</GoldBadge>
          </div>

          <p className="mt-1.5 font-display text-[clamp(24px,7.5vw,52px)] leading-[0.95] text-ink sm:mt-5 sm:text-[clamp(34px,10vw,52px)]">
            <RollingNumber key={active.id} value={formatRupeesExact(active.price)} delay={0.25} />
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:mt-4 sm:gap-2">
            <span className="rounded-full border border-line bg-pearl/70 px-2.5 py-1 text-[10.5px] font-medium tracking-luxe-sm uppercase text-muted sm:px-3 sm:py-1.5 sm:text-[12px]">
              {active.unit} · {active.karat}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:py-1.5 sm:text-[13px] ${
                falling
                  ? "bg-[rgba(176,59,54,0.08)] text-negative"
                  : "bg-[rgba(44,122,86,0.08)] text-positive"
              }`}
            >
              {falling ? (
                <ArrowDownRight size={12} strokeWidth={2} className="sm:hidden" />
              ) : (
                <ArrowUpRight size={12} strokeWidth={2} className="sm:hidden" />
              )}
              {falling ? (
                <ArrowDownRight size={13} strokeWidth={2} className="hidden sm:block" />
              ) : (
                <ArrowUpRight size={13} strokeWidth={2} className="hidden sm:block" />
              )}
              ₹{Math.abs(active.change).toFixed(2)}
              <span className="font-normal opacity-70">vs last update</span>
            </span>
          </div>

          <p className="mt-1.5 flex items-center gap-1.5 text-[10.5px] font-medium text-muted sm:mt-4 sm:text-[12.5px]">
            <Clock3 size={11} strokeWidth={1.6} className="shrink-0 text-gold-600 sm:h-3 sm:w-3" />
            Quoted {goldRate.quotedOn} · {goldRate.quotedAt}
          </p>
        </div>

        {/* The movement */}
        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[10px] font-medium tracking-luxe uppercase text-gold-700 sm:text-[11px]">Recent movement</p>
            <p className="text-[10.5px] font-medium text-muted-soft sm:text-[11.5px]">Last 13 updates</p>
          </div>

          <GoldRateChart
            samples={goldRate.movement}
            seriesKey={active.id}
            className="mt-1.5 h-[42px] sm:mt-2 sm:h-[96px] lg:h-[110px]"
          />

          {/* Purity selector */}
          <div
            className="mt-2 flex gap-1 rounded-full border border-line bg-pearl/80 p-1 sm:mt-5 sm:gap-1.5"
            role="group"
            aria-label="Gold weight and purity"
          >
            {goldRate.options.map((option) => {
              const isActive = option.id === selected;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  aria-pressed={isActive}
                  className={`relative isolate flex-1 rounded-full px-2 py-2.5 text-[12px] font-medium tracking-luxe-sm uppercase transition-colors duration-400 sm:py-2 sm:text-[12.5px] ${
                    isActive ? "text-wine-900" : "text-muted hover:text-wine-700"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="rate-chip"
                      aria-hidden
                      className="gold-fill absolute inset-0 -z-10 rounded-full"
                      style={{ boxShadow: "0 6px 14px -8px rgba(140,105,35,0.8)" }}
                      transition={spring.soft}
                    />
                  )}
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="mt-1.5 text-[10px] font-medium text-muted-soft sm:mt-3 sm:text-[12px]">{goldRate.footnote}</p>
        </div>
      </div>
    </PremiumCard>
  );
}
