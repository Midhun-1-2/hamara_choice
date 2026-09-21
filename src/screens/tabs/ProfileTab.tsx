import { motion } from "framer-motion";
import {
  BadgeCheck,
  BellRing,
  ChevronRight,
  FileText,
  LifeBuoy,
  Lock,
  LogOut,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import GoldBadge from "../../components/GoldBadge";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import PremiumButton from "../../components/PremiumButton";
import PremiumCard from "../../components/PremiumCard";
import { maskPhone } from "../../lib/format";
import { profile } from "../../data/mock";
import { ease, rise, stagger, staggerTight } from "../../lib/motion";
import { useToast } from "../../hooks/useToasts";

interface ProfileTabProps {
  name: string;
  phone: string;
  onSignOut: () => void;
}

const PIN_FIELDS = [
  { key: "current", label: "Current MPIN" },
  { key: "next", label: "New MPIN" },
  { key: "confirm", label: "Confirm new MPIN" },
] as const;

type PinKey = (typeof PIN_FIELDS)[number]["key"];

/** One icon per settings row, so the lists scan without reading. */
const itemIcons: Record<string, LucideIcon> = {
  details: UserRound,
  invoices: FileText,
  mpin: Lock,
  alerts: BellRing,
  help: LifeBuoy,
  boutique: MapPin,
};

export default function ProfileTab({ name, phone, onSignOut }: ProfileTabProps) {
  const [mpinOpen, setMpinOpen] = useState(false);
  const [pins, setPins] = useState<Record<PinKey, string>>({ current: "", next: "", confirm: "" });
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();
  const initial = (name.trim()[0] || "T").toUpperCase();

  const pinError =
    pins.current.length !== 4
      ? "Enter your current 4-digit MPIN."
      : pins.next.length !== 4
        ? "New MPIN must be 4 digits."
        : pins.next === pins.current
          ? "New MPIN must differ from the current one."
          : pins.confirm !== pins.next
            ? "The confirmation doesn't match."
            : undefined;

  const saveMpin = () => {
    setSubmitted(true);
    if (pinError) return;
    setMpinOpen(false);
    setPins({ current: "", next: "", confirm: "" });
    setSubmitted(false);
    toast({ title: "MPIN updated", detail: "Use the new PIN next time you sign in" });
  };

  const openItem = (key: string, label: string) => {
    if (key === "mpin") {
      setMpinOpen(true);
      return;
    }
    toast({ title: label, detail: "Placeholder destination" });
  };

  /* The phone grid ignores the section headings and shows the six destinations
     flat — three headings for two rows each cost more height than they earn. */
  const allItems = profile.sections.flatMap((section) => section.items);

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-col gap-2.5 lg:gap-9">
      {/*
        The page title is the card below it on a phone — the account holder's
        own name, with their mark over it. Repeating "Your account" above that
        would cost a fifth of the screen to say what the card already says, and
        this tab has to land inside one screen without scrolling.
      */}
      <div className="hidden lg:block">
        <PageHeader
          eyebrow="Profile"
          title={
            <>
              Your <span className="text-gold-shimmer">account</span>
            </>
          }
          description="Your details, the way you sign in, and the people who can help."
        />
      </div>

      {/* Identity — the house colour, with the mark set at the top of it */}
      <PremiumCard tone="wine" sheenDelay={0} padded={false} className="px-4 pb-3 pt-4 lg:p-6">
        <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:text-left">
          <div className="flex min-w-0 flex-col items-center gap-2 lg:flex-row lg:items-center lg:gap-4">
            <span
              aria-hidden
              className="gold-fill flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full font-display text-[21px] text-wine-900 lg:h-16 lg:w-16 lg:text-[26px]"
              style={{
                boxShadow:
                  "0 14px 28px -12px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.65), 0 0 0 5px rgba(212,175,55,0.16)",
              }}
            >
              {initial}
            </span>

            <div className="min-w-0">
              <p className="truncate font-display text-[19px] leading-none text-gold-100 lg:text-[23px]">
                {name.trim() || "Guest"}
              </p>
              <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[12.5px] text-gold-200/80 lg:mt-2.5 lg:text-[13px] lg:justify-start">
                <Phone size={12} strokeWidth={1.7} className="text-gold-300" />
                {maskPhone(phone)}
              </p>
            </div>
          </div>

          {/*
            Two tracked capsules will not sit on one line on a phone, and
            stacked they cost fifty pixels this tab does not have. Same two
            facts, set as one quiet line; the capsules return from `lg` up.
          */}
          <p className="flex items-center gap-1.5 text-[10.5px] font-medium tracking-luxe-sm uppercase text-gold-300/85 lg:hidden">
            <BadgeCheck size={11} strokeWidth={1.9} className="shrink-0 text-gold-300" />
            KYC {profile.kyc} · Since {profile.memberSince}
          </p>

          <div className="hidden flex-wrap items-center gap-2 lg:flex lg:justify-start">
            <GoldBadge tone="onWine" icon={<BadgeCheck size={11} strokeWidth={1.9} />}>
              KYC {profile.kyc}
            </GoldBadge>
            <GoldBadge tone="onWine">Member since {profile.memberSince}</GoldBadge>
          </div>
        </div>
      </PremiumCard>

      {/* Settings, as a grid of plates — phones only */}
      <motion.div variants={staggerTight} className="grid grid-cols-2 gap-2 lg:hidden">
        {allItems.map((item) => {
          const Icon = itemIcons[item.key] ?? ChevronRight;
          return (
            <motion.button
              key={item.key}
              variants={rise}
              type="button"
              onClick={() => openItem(item.key, item.label)}
              className="surface flex min-h-[70px] flex-col items-start justify-between gap-1.5 rounded-[var(--radius-card)] px-2.5 py-2.5 text-left transition-colors duration-300 active:bg-cream"
            >
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700"
                style={{ border: "1px solid rgba(212,175,55,0.3)" }}
              >
                <Icon size={14} strokeWidth={1.6} />
              </span>
              {/* 12px, so "Certificates & invoices" holds one line and every
                  tile in the grid keeps the same height. */}
              <span className="block text-[12px] font-medium leading-tight text-ink">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Grouped settings — the full lists, from `lg` up, where the app leaves
          the phone frame and there is room for three columns of rows */}
      <motion.div variants={staggerTight} className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
        {profile.sections.map((section, index) => (
          <PremiumCard key={section.title} sheenDelay={1 + index} padded={false} className="flex flex-col">
            <p className="px-4 pt-4 text-[11px] font-medium tracking-luxe uppercase text-gold-700 sm:px-6 sm:pt-5">
              {section.title}
            </p>

            <ul className="mt-1 flex flex-col px-2 pb-2 sm:px-3">
              {section.items.map((item) => {
                const Icon = itemIcons[item.key] ?? ChevronRight;
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => openItem(item.key, item.label)}
                      className="group flex w-full items-center gap-3 rounded-2xl px-2.5 py-3 text-left transition-colors duration-300 hover:bg-cream sm:gap-3.5 sm:px-3 sm:py-3.5"
                    >
                      <span
                        aria-hidden
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700 transition-transform duration-400 group-hover:scale-105 sm:h-9 sm:w-9"
                        style={{ border: "1px solid rgba(212,175,55,0.3)" }}
                      >
                        <Icon size={15} strokeWidth={1.6} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-ink">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[12.5px] text-muted">{item.hint}</span>
                      </span>

                      <ChevronRight
                        size={15}
                        strokeWidth={1.6}
                        className="shrink-0 text-muted-soft transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-wine-700"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </PremiumCard>
        ))}
      </motion.div>

      {/* Sign out */}
      <motion.div variants={rise} className="lg:max-w-[280px]">
        <PremiumButton
          variant="quiet"
          size="sm"
          onClick={onSignOut}
          leadingIcon={<LogOut size={15} strokeWidth={1.7} />}
          className="lg:px-6 lg:py-3.5 lg:text-[13px]"
        >
          Sign out
        </PremiumButton>
      </motion.div>

      <Modal
        open={mpinOpen}
        onClose={() => setMpinOpen(false)}
        eyebrow="Security"
        title="Change MPIN"
        footer={<PremiumButton onClick={saveMpin}>Update MPIN</PremiumButton>}
      >
        <div className="flex flex-col gap-4 pb-1">
          {PIN_FIELDS.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-2 block text-[11.5px] font-medium tracking-luxe-sm uppercase text-muted">
                {field.label}
              </span>
              <input
                value={pins[field.key]}
                onChange={(event) =>
                  setPins((current) => ({
                    ...current,
                    [field.key]: event.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                inputMode="numeric"
                type="password"
                autoComplete="off"
                aria-label={field.label}
                className="h-[54px] w-full rounded-2xl border border-line bg-pearl px-4 text-[20px] font-semibold tracking-[0.5em] text-ink caret-wine-700 transition-colors duration-300 focus:border-[rgba(212,175,55,0.85)]"
              />
            </label>
          ))}

          {submitted && pinError && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: ease.silk }}
              className="text-[13px] text-negative"
            >
              {pinError}
            </motion.p>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}
