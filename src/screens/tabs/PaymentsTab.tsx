import { motion } from "framer-motion";
import { CalendarClock, Check, Download, Receipt } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmptyState from "../../components/EmptyState";
import GoldBadge from "../../components/GoldBadge";
import PageHeader from "../../components/PageHeader";
import PremiumButton from "../../components/PremiumButton";
import PremiumCard from "../../components/PremiumCard";
import SectionHeader from "../../components/SectionHeader";
import { GoldSpinner } from "../../components/LoadingState";
import StatusBadge from "../../components/StatusBadge";
import RollingNumber from "../../components/RollingNumber";
import { formatGrams, formatRupees } from "../../lib/format";
import { payments } from "../../data/mock";
import { rise, stagger, staggerTight } from "../../lib/motion";
import { useToast } from "../../hooks/useToasts";
import type { NavKey } from "../../lib/nav";

interface PaymentsTabProps {
  onNavigate: (key: NavKey) => void;
}

export default function PaymentsTab({ onNavigate }: PaymentsTabProps) {
  const [paying, setPaying] = useState(false);
  const timeout = useRef<number>(0);
  const toast = useToast();
  const totalGrams = payments.history.reduce((sum, entry) => sum + entry.grams, 0);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  /** Checkout is mocked, but the pending state is the real one a gateway needs. */
  const pay = () => {
    if (paying) return;
    setPaying(true);
    timeout.current = window.setTimeout(() => {
      setPaying(false);
      toast({
        title: "Payment started",
        detail: `${formatRupees(payments.nextDue.amount)} · mock checkout`,
      });
    }, 1100);
  };

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-col gap-5 sm:gap-7 lg:gap-9">
      <PageHeader
        eyebrow="Payments"
        title={
          <>
            Every instalment, <span className="text-gold-shimmer">accounted</span>
          </>
        }
        description="What you have paid this year, what falls due next, and a receipt for each one."
        aside={<GoldBadge icon={<Receipt size={11} strokeWidth={1.8} />}>{payments.history.length} paid</GoldBadge>}
      />

      {/* Summary — the figure, and the thing to do about it */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-5">
        <PremiumCard tone="gilt" sheenDelay={0} className="flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">Paid this year</p>
            <p className="mt-2.5 font-display text-[clamp(28px,8vw,44px)] leading-none text-ink sm:mt-4 sm:text-[clamp(32px,9vw,44px)]">
              <RollingNumber value={formatRupees(payments.paidThisYear)} delay={0.2} />
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[rgba(212,175,55,0.25)] pt-3 text-[13px] text-muted sm:mt-6 sm:pt-4">
            <span>
              <span className="font-display text-[15px] text-ink">{payments.history.length}</span>{" "}
              instalments
            </span>
            <span>
              <span className="font-display text-[15px] text-ink">{formatGrams(totalGrams)}</span> accrued
            </span>
            <span className="truncate">{payments.history[0].scheme}</span>
          </div>
        </PremiumCard>

        <PremiumCard tone="cream" sheenDelay={1.6} className="flex flex-col justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium tracking-luxe uppercase text-gold-700">
              <CalendarClock size={12} strokeWidth={1.8} />
              Next instalment
            </p>
            <p className="mt-2.5 font-display text-[26px] leading-none text-ink sm:mt-4 sm:text-[30px]">
              {formatRupees(payments.nextDue.amount)}
            </p>
            <p className="mt-2 text-[13px] text-muted sm:mt-2.5">
              Due {payments.nextDue.date} · {payments.nextDue.scheme}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-6">
            <PremiumButton
              size="sm"
              block={false}
              onClick={pay}
              disabled={paying}
              leadingIcon={paying ? <GoldSpinner size={13} /> : undefined}
            >
              {paying ? "Processing" : "Pay now"}
            </PremiumButton>
            <PremiumButton
              variant="outline"
              size="sm"
              block={false}
              onClick={() => toast({ title: "Payment reminder set", detail: payments.nextDue.date })}
            >
              Remind me
            </PremiumButton>
          </div>
        </PremiumCard>
      </div>

      {/* The ledger */}
      <section>
        <SectionHeader
          eyebrow="All transactions"
          title="Your payment history"
          action={
            <button
              type="button"
              onClick={() => onNavigate("wallet")}
              className="tap-area text-[11.5px] font-medium tracking-luxe-sm uppercase text-wine-700 underline decoration-[rgba(212,175,55,0.6)] underline-offset-4"
            >
              View wallet
            </button>
          }
        />

        {payments.history.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={<Receipt size={20} strokeWidth={1.5} />}
            title="No payments yet"
            body="Once your first instalment is made, every receipt will be listed here."
            action={
              <PremiumButton size="sm" block={false} onClick={() => onNavigate("join")}>
                Join a scheme
              </PremiumButton>
            }
          />
        ) : (
          <PremiumCard className="mt-4" padded={false}>
            <motion.ul variants={staggerTight} className="flex flex-col px-4 py-1 sm:px-7">
              {payments.history.map((entry) => (
                <motion.li
                  key={entry.id}
                  variants={rise}
                  className="group flex items-center gap-3 border-b border-line-soft py-3 last:border-b-0 sm:gap-4 sm:py-4"
                >
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700 transition-transform duration-400 group-hover:scale-105 sm:h-10 sm:w-10"
                    style={{ border: "1px solid rgba(212,175,55,0.35)" }}
                  >
                    <Check size={15} strokeWidth={2.2} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-medium text-ink sm:text-[14.5px]">
                        {entry.scheme}
                      </span>
                      {/*
                        Wrapped rather than given `hidden` of its own: the badge
                        sets `inline-flex` inside its own component, and the two
                        display utilities cancel out — which is why every phone
                        row was carrying a badge it was supposed to drop, and
                        why the scheme name was truncated to "Kanaka…".
                      */}
                      <span className="hidden lg:inline-flex">
                        <StatusBadge status={entry.status} />
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[12.5px] text-muted sm:text-[13px]">
                      {entry.date} · {entry.method}
                      <span className="hidden lg:inline"> · {entry.id}</span>
                    </span>
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="block font-display text-[15px] leading-none text-ink sm:text-[16px]">
                      {formatRupees(entry.amount)}
                    </span>
                    <span className="mt-1 block text-[12px] text-muted">{formatGrams(entry.grams)}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => toast({ title: `Receipt ${entry.id}`, detail: "Mock download for the demo" })}
                    aria-label={`Download receipt ${entry.id}`}
                    className="ml-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent text-muted-soft transition-colors duration-300 hover:border-line hover:text-wine-700 sm:h-9 sm:w-9"
                  >
                    <Download size={15} strokeWidth={1.6} />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </PremiumCard>
        )}
      </section>
    </motion.div>
  );
}
