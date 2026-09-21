import { motion } from "framer-motion";
import { Gift, TrendingUp, Users, Wallet as WalletIcon } from "lucide-react";
import GoldBadge from "../../components/GoldBadge";
import PageHeader from "../../components/PageHeader";
import PremiumButton from "../../components/PremiumButton";
import PremiumCard from "../../components/PremiumCard";
import ProgressTrack from "../../components/ProgressTrack";
import ReferralCard from "../../components/ReferralCard";
import SectionHeader from "../../components/SectionHeader";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import RollingNumber from "../../components/RollingNumber";
import { formatGrams, formatRupees } from "../../lib/format";
import { referral, wallet } from "../../data/mock";
import { rise, stagger, staggerTight } from "../../lib/motion";
import type { NavKey } from "../../lib/nav";

interface WalletTabProps {
  onNavigate: (key: NavKey) => void;
}

/** Holdings first, then the referral ledger that feeds them. */
export default function WalletTab({ onNavigate }: WalletTabProps) {
  const schemeProgress = (wallet.scheme.paid / wallet.scheme.total) * 100;

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-col gap-5 sm:gap-7 lg:gap-9">
      <PageHeader
        eyebrow="Wallet"
        title={
          <>
            Your gold, <span className="text-gold-shimmer">held</span>
          </>
        }
        description="Everything you have accumulated with Thirukochi, and the bonus your invitations have earned."
        aside={<GoldBadge icon={<WalletIcon size={11} strokeWidth={1.8} />}>{wallet.scheme.name}</GoldBadge>}
      />

      {/* Holdings */}
      <PremiumCard tone="gilt" padded={false} sheenDelay={0}>
        <div className="grid gap-4 p-4 sm:gap-7 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:p-8">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">Total holding</p>
            <p className="mt-2.5 font-display text-[clamp(30px,9vw,50px)] leading-none text-ink sm:mt-4 sm:text-[clamp(36px,10vw,50px)]">
              <RollingNumber value={formatGrams(wallet.goldGrams)} delay={0.25} />
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-muted sm:mt-3 sm:text-[13.5px]">
              <RollingNumber className="font-display text-[17px] text-ink" value={formatRupees(wallet.goldValue)} delay={0.3} />
              at today&apos;s rate
              <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(44,122,86,0.08)] px-2.5 py-1 text-[12.5px] font-medium text-positive">
                <TrendingUp size={12} strokeWidth={1.9} />
                Growing
              </span>
            </p>
          </div>

          <div className="min-w-0 border-t border-line-soft pt-4 sm:pt-6 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">Scheme progress</p>
              <p className="text-[13px] text-muted">
                <span className="font-display text-[15px] text-ink">{wallet.scheme.paid}</span> of{" "}
                {wallet.scheme.total}
              </p>
            </div>

            <ProgressTrack className="mt-2.5 sm:mt-3.5" value={schemeProgress} label="Scheme progress" />

            <p className="mt-2.5 text-[13px] text-muted sm:mt-3.5">
              {wallet.scheme.name} · {formatRupees(wallet.scheme.monthly)} every month
            </p>

            <PremiumButton
              variant="outline"
              size="sm"
              className="mt-3.5 sm:mt-5"
              block={false}
              onClick={() => onNavigate("payments")}
            >
              View payments
            </PremiumButton>
          </div>
        </div>
      </PremiumCard>

      {/* Referral figures */}
      <section>
        <SectionHeader eyebrow="Referral bonus" title="What your invitations earned" />

        <motion.div variants={staggerTight} className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-4 lg:grid-cols-3">
          <StatCard
            accent
            label="Bonus earned"
            value={formatRupees(referral.bonusEarned)}
            detail="Credited to your account"
            icon={<Gift size={14} strokeWidth={1.7} />}
          />
          <StatCard
            label="Pending"
            value={formatRupees(referral.bonusPending)}
            detail="Awaiting first instalments"
            icon={<TrendingUp size={14} strokeWidth={1.7} />}
          />
          <StatCard
            label="Friends joined"
            value={`${referral.joined} / ${referral.invited}`}
            detail="Invitations accepted"
            icon={<Users size={14} strokeWidth={1.7} />}
            className="col-span-2 lg:col-span-1"
          />
        </motion.div>
      </section>

      <ReferralCard />

      {/* The ledger, as a timeline */}
      <section>
        <SectionHeader eyebrow="Bonus history" title="Every friend, in order" />

        <PremiumCard className="mt-3 sm:mt-4" padded={false}>
          <motion.ul variants={staggerTight} className="relative flex flex-col px-4 py-1 sm:px-7 sm:py-2">
            {/* The rail the nodes hang from */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-7 left-[27px] top-7 w-px bg-line sm:bottom-8 sm:left-[37px] sm:top-8"
            />

            {referral.history.map((entry) => {
              const pending = entry.status === "Pending";
              return (
                <motion.li
                  key={entry.name}
                  variants={rise}
                  className="relative flex items-center gap-3 border-b border-line-soft py-3 last:border-b-0 sm:gap-4 sm:py-4"
                >
                  <span
                    aria-hidden
                    className={`relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                      pending ? "bg-cream" : "gold-fill"
                    }`}
                    style={{
                      border: pending ? "1px solid var(--color-line)" : "none",
                      boxShadow: pending ? "0 0 0 4px #ffffff" : "0 0 0 4px #ffffff, 0 0 0 5px rgba(212,175,55,0.25)",
                    }}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium text-ink">{entry.name}</span>
                    <span className="mt-0.5 block truncate text-[13px] text-muted">
                      {entry.note} · {entry.date}
                    </span>
                  </span>

                  <span className="flex shrink-0 flex-col items-end gap-1.5">
                    <span
                      className={`font-display text-[16px] leading-none ${
                        pending ? "text-muted" : "text-ink"
                      }`}
                    >
                      +{formatRupees(entry.amount)}
                    </span>
                    <StatusBadge status={entry.status} />
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        </PremiumCard>
      </section>
    </motion.div>
  );
}
