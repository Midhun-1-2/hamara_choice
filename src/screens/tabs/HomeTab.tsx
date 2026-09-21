import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  CalendarPlus,
  Gem,
  Gift,
  Receipt,
  UserRound,
  Wallet as WalletIcon,
} from "lucide-react";
import ActivityFeed from "../../components/ActivityFeed";
import BentoPanel from "../../components/BentoPanel";
import GoldJourney from "../../components/GoldJourney";
import GoldRateCard from "../../components/GoldRateCard";
import PremiumCard from "../../components/PremiumCard";
import PromotionCard from "../../components/PromotionCard";
import QuickAction from "../../components/QuickAction";
import ReferralCard from "../../components/ReferralCard";
import RollingNumber from "../../components/RollingNumber";
import { dateLabel, formatGrams, formatRupees } from "../../lib/format";
import { payments, wallet } from "../../data/mock";
import { bentoStagger, dealIn, staggerTight } from "../../lib/motion";
import type { NavKey } from "../../lib/nav";

interface HomeTabProps {
  name: string;
  onOpenSchemes: () => void;
  onNavigate: (key: NavKey) => void;
}

/** Small label above a figure inside the holdings stack. */
function Line({
  label,
  value,
  detail,
  icon,
  onClick,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-2.5 rounded-2xl px-2 py-2 text-left transition-colors duration-300 hover:bg-[rgba(255,255,255,0.5)] sm:gap-3 sm:py-2.5"
    >
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(212,175,55,0.14)] text-gold-700 sm:h-8 sm:w-8"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium tracking-luxe-sm uppercase text-muted">{label}</span>
        {/* A full step, not a half: at a half the tracked label's box still
            reached two pixels into the line beneath it. */}
        <span className="mt-1 block truncate text-[13px] text-muted">{detail}</span>
      </span>
      <span className="shrink-0 font-display text-[16px] text-ink">{value}</span>
    </button>
  );
}

export default function HomeTab({ name, onOpenSchemes, onNavigate }: HomeTabProps) {
  const firstName = name.trim().split(" ")[0] || "there";

  return (
    <motion.div variants={bentoStagger} initial="initial" animate="animate" className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
      {/*
        Greeting rides on the set itself, with no plate under it. On desktop
        it moves up into the top bar, parallel with the bell and account
        capsule, so the dashboard's own content starts right under it instead
        of a second, taller header repeating it below — see `HomeScreen`'s
        `greeting` prop to `TopBar`.
      */}
      <motion.div variants={dealIn} className="flex flex-wrap items-end justify-between gap-4 px-1 lg:hidden">
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">{dateLabel()}</p>
          {/* One word, so the name is what the line is about. */}
          <h1 className="mt-1.5 font-display text-[26px] leading-[1.08] text-ink sm:mt-2.5 sm:text-[34px] lg:text-[42px]">
            Hi, <span className="text-gold-shimmer">{firstName}</span>
          </h1>
          {/* 1.08 leading on the line above pulls its descenders into this
              paragraph's box; the extra step of margin keeps them apart. */}
          <p className="mt-1.5 text-[12.5px] text-muted sm:mt-2 sm:text-[13.5px] lg:text-[14.5px]">
            Your gold journey continues with trust.
          </p>
        </div>
      </motion.div>

      {/*
        The bento. Twelve columns on desktop, one on phones — every panel is
        the same component, only its span changes.
      */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5">
        <BentoPanel className="lg:col-span-8">
          <GoldRateCard />
        </BentoPanel>

        {/* Holdings — three figures in one stack, replacing the old tile row */}
        <BentoPanel className="lg:col-span-4">
          <PremiumCard tone="gilt" sheenDelay={0.8} className="flex h-full flex-col">
            <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">Your holdings</p>

            <p className="mt-2.5 font-display text-[clamp(26px,7vw,38px)] leading-none text-ink sm:mt-4 sm:text-[clamp(30px,8vw,38px)]">
              <RollingNumber value={formatGrams(wallet.goldGrams)} delay={0.35} />
            </p>
            <p className="mt-1.5 text-[13px] text-muted sm:mt-2">
              Worth <RollingNumber className="font-display text-[14px] text-ink" value={formatRupees(wallet.goldValue)} delay={0.4} />{" "}
              today
            </p>

            <div className="mt-3 flex flex-col border-t border-[rgba(212,175,55,0.28)] pt-1.5 sm:mt-4 sm:pt-2">
              <Line
                label="Active plan"
                value={`${wallet.scheme.paid}/${wallet.scheme.total}`}
                detail={wallet.scheme.name}
                icon={<CalendarPlus size={14} strokeWidth={1.7} />}
                onClick={() => onNavigate("payments")}
              />
              <Line
                label="Next instalment"
                value={formatRupees(payments.nextDue.amount)}
                detail={`Due ${payments.nextDue.date}`}
                icon={<CalendarClock size={14} strokeWidth={1.7} />}
                onClick={() => onNavigate("payments")}
              />
            </div>
          </PremiumCard>
        </BentoPanel>

        {/* Quick actions sit on their own glass rail */}
        <BentoPanel className="lg:col-span-12" tilt={false}>
          <PremiumCard tone="wine" padded={false} className="px-2.5 py-2.5 sm:px-5 sm:py-4">
            <motion.div
              variants={staggerTight}
              className="grid grid-cols-3 gap-1.5 sm:gap-3 lg:grid-cols-6"
            >
              <QuickAction
                primary
                onWine
                label="Join Scheme"
                icon={<CalendarPlus size={19} strokeWidth={1.7} />}
                onClick={() => onNavigate("join")}
              />
              <QuickAction
                onWine
                label="Make Payment"
                icon={<Receipt size={19} strokeWidth={1.6} />}
                onClick={() => onNavigate("payments")}
              />
              <QuickAction
                onWine
                label="View Wallet"
                icon={<WalletIcon size={19} strokeWidth={1.6} />}
                onClick={() => onNavigate("wallet")}
              />
              <QuickAction
                onWine
                label="Gold Schemes"
                icon={<Gem size={19} strokeWidth={1.6} />}
                onClick={onOpenSchemes}
              />
              <QuickAction
                onWine
                label="Refer & Earn"
                icon={<Gift size={19} strokeWidth={1.6} />}
                onClick={() => onNavigate("wallet")}
              />
              <QuickAction
                onWine
                label="My Profile"
                icon={<UserRound size={19} strokeWidth={1.6} />}
                onClick={() => onNavigate("profile")}
              />
            </motion.div>
          </PremiumCard>
        </BentoPanel>

        <BentoPanel className="lg:col-span-7">
          <GoldJourney onExplore={onOpenSchemes} onPay={() => onNavigate("payments")} />
        </BentoPanel>

        {/* Activity runs tall beside the journey */}
        <BentoPanel className="lg:col-span-5">
          <div className="flex h-full flex-col">
            <div className="mb-2 flex items-center justify-between gap-3 px-1 sm:mb-3">
              <p className="flex items-center gap-2 text-[11px] font-medium tracking-luxe uppercase text-gold-700">
                <Activity size={11} strokeWidth={1.9} />
                Recent activity
              </p>
              <button
                type="button"
                onClick={() => onNavigate("payments")}
                className="tap-area group flex items-center gap-1 text-[11.5px] font-medium tracking-luxe-sm uppercase text-wine-700"
              >
                View all
                <ArrowUpRight
                  size={12}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
            </div>
            <ActivityFeed className="flex-1" limit={4} />
          </div>
        </BentoPanel>

        <BentoPanel className="lg:col-span-7">
          <ReferralCard layout="stacked" className="h-full" />
        </BentoPanel>

        <BentoPanel className="lg:col-span-5" tilt={false}>
          <PromotionCard className="h-full" />
        </BentoPanel>
      </div>
    </motion.div>
  );
}
