import { motion, useReducedMotion } from "framer-motion";
import { Coins, Gem, Gift, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PremiumCard from "./PremiumCard";
import StatusBadge from "./StatusBadge";
import { formatRupees } from "../lib/format";
import { accountStatus, activity } from "../data/mock";
import { rise, staggerTight } from "../lib/motion";

interface ActivityFeedProps {
  /** Caps the list on dense screens. */
  limit?: number;
  className?: string;
}

const kindIcon: Record<string, LucideIcon> = {
  payment: Receipt,
  gold: Gem,
  referral: Gift,
  rate: TrendingDown,
  scheme: Coins,
};

/**
 * What the account has been doing lately. A standing status sits at the head,
 * then each event as its own row: icon, what happened, when, and where it got
 * to. Rows stack on phones so nothing ever sits on top of anything else.
 */
export default function ActivityFeed({ limit, className = "" }: ActivityFeedProps) {
  const reduced = useReducedMotion();
  const rows = limit ? activity.slice(0, limit) : activity;

  return (
    <PremiumCard padded={false} sheenDelay={1.8} className={className}>
      {/* Standing status */}
      <div className="flex flex-col items-start gap-1.5 border-b border-line-soft px-4 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="relative flex h-2.5 w-2.5 shrink-0">
            <motion.span
              className="absolute inset-0 rounded-full bg-positive"
              animate={reduced ? undefined : { opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="absolute -inset-1 rounded-full border border-[rgba(44,122,86,0.3)]" />
          </span>

          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-ink">{accountStatus.label}</p>
            <p className="mt-0.5 truncate text-[12.5px] text-muted">{accountStatus.detail}</p>
          </div>
        </div>

        <p className="pl-[26px] text-[10.5px] font-medium tracking-luxe-sm uppercase text-muted-soft sm:pl-0 sm:text-[11.5px]">
          {accountStatus.lastSync}
        </p>
      </div>

      {/* The events */}
      <motion.ul variants={staggerTight} className="flex flex-col px-4 sm:px-6">
        {rows.map((entry) => {
          const Icon = kindIcon[entry.kind] ?? TrendingUp;
          const pending = entry.status === "Pending";

          return (
            <motion.li
              key={entry.id}
              variants={rise}
              className="flex items-start gap-3 border-b border-line-soft py-3 last:border-b-0 sm:gap-3.5 sm:py-3.5"
            >
              <span
                aria-hidden
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9 ${
                  pending ? "bg-cream text-muted" : "bg-gold-50 text-gold-700"
                }`}
                style={{
                  border: pending ? "1px solid var(--color-line)" : "1px solid rgba(212,175,55,0.35)",
                }}
              >
                <Icon size={14} strokeWidth={1.7} />
              </span>

              {/*
                Three quiet lines instead of two columns fighting over one.
                The old row gave the figures a column of their own, which left
                the account name about forty per cent of a phone to live in —
                every title arrived truncated, and the amount, the badge and
                the time stacked up beside it three deep. Now the headline and
                its figure share the top line, the detail gets the full width
                underneath, and the status and the time sit together on a third
                line where neither has to be read past anything.
              */}
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink sm:text-[14.5px]">
                    {entry.title}
                  </span>
                  {entry.amount !== undefined && (
                    <span
                      className={`shrink-0 font-display text-[14px] leading-none sm:text-[15px] ${
                        pending ? "text-muted" : "text-ink"
                      }`}
                    >
                      +{formatRupees(entry.amount)}
                    </span>
                  )}
                </span>

                <span className="block truncate text-[12px] leading-snug text-muted sm:text-[13px]">
                  {entry.detail}
                </span>

                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <StatusBadge status={entry.status} />
                  <span className="text-[11px] text-muted-soft sm:text-[12px]">{entry.time}</span>
                </span>
              </span>
            </motion.li>
          );
        })}
      </motion.ul>
    </PremiumCard>
  );
}
