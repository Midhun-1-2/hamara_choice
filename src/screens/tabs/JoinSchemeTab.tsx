import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GoldBadge from "../../components/GoldBadge";
import PageHeader from "../../components/PageHeader";
import PremiumButton from "../../components/PremiumButton";
import PremiumCard from "../../components/PremiumCard";
import Checkbox from "../../components/Checkbox";
import { formatRupees } from "../../lib/format";
import { joinScheme, schemes } from "../../data/mock";
import { ease, rise, spring, stagger } from "../../lib/motion";

interface JoinSchemeTabProps {
  /** Hands the subscription up so the celebration can cover the whole screen. */
  onJoined: (summary: { scheme: string; detail: string }) => void;
}

/** Numbered step marker, so a three-part form still reads as a single path. */
function StepMark({ index, label, required }: { index: number; label: string; required?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-50 font-display text-[13px] text-gold-700"
        style={{ border: "1px solid rgba(212,175,55,0.4)" }}
      >
        {index}
      </span>
      <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">
        {label}
        {required && <span className="ml-1 text-wine-600">*</span>}
      </p>
    </div>
  );
}

/** Field label in the house style. */
function FieldLabel({ children }: { children: string }) {
  return (
    <span className="mb-2 block text-[11.5px] font-medium tracking-luxe-sm uppercase text-muted">{children}</span>
  );
}

const fieldClass =
  "w-full rounded-2xl border border-line bg-pearl px-4 text-ink caret-wine-700 transition-colors duration-300 focus-within:border-[rgba(212,175,55,0.85)]";

interface SchemeOption {
  name: string;
  tenure: string;
  note: string;
  minimum: number;
}

/**
 * The scheme chooser, collapsed to one field: three full plan cards read as
 * desktop furniture on a phone. Closed, it states the pick in the same
 * two-line shape as the house's other fields; open, each option keeps every
 * detail `SchemeCard` used to show — name, tenure, note, starting price.
 */
function SchemeSelect({
  options,
  value,
  onSelect,
}: {
  options: SchemeOption[];
  value: string;
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = options.find((option) => option.name === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-[60px] items-center justify-between gap-3 text-left ${fieldClass}`}
      >
        {active ? (
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[15px] text-ink">{active.name}</span>
            <span className="mt-0.5 block text-[11px] font-medium tracking-luxe-sm uppercase text-gold-700">
              {active.tenure} · {formatRupees(active.minimum)}/month
            </span>
          </span>
        ) : (
          <span className="text-[14px] font-normal text-muted-soft">Select a scheme</span>
        )}
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={spring.soft}
          className="shrink-0 text-gold-600"
        >
          <ChevronDown size={18} strokeWidth={1.8} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.24, ease: ease.silk }}
            className="mt-2 overflow-hidden rounded-2xl border border-line bg-pearl shadow-[0_18px_40px_-24px_rgba(68,48,30,0.4)]"
          >
            <div role="listbox" aria-label="Select scheme">
              {options.map((option) => {
                const selected = option.name === value;
                return (
                  <button
                    key={option.name}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onSelect(option.name);
                      setOpen(false);
                    }}
                    className={`flex w-full items-start gap-3 border-b border-line-soft px-4 py-3 text-left transition-colors duration-200 last:border-b-0 ${
                      selected ? "bg-[rgba(212,175,55,0.1)]" : "hover:bg-[rgba(212,175,55,0.05)]"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-[14.5px] text-ink">{option.name}</span>
                        <span className="shrink-0 text-[12.5px] text-muted">{formatRupees(option.minimum)}/mo</span>
                      </span>
                      <span className="mt-0.5 block text-[11px] font-medium tracking-luxe-sm uppercase text-gold-700">
                        {option.tenure}
                      </span>
                      <span className="mt-1 block text-[12px] leading-snug text-muted">{option.note}</span>
                    </span>
                    {selected && (
                      <span
                        aria-hidden
                        className="gold-fill mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      >
                        <Check size={11} strokeWidth={3} className="text-wine-900" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JoinSchemeTab({ onJoined }: JoinSchemeTabProps) {
  const [scheme, setScheme] = useState("");
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [nominee, setNominee] = useState(false);
  const [nomineeName, setNomineeName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [agreed, setAgreed] = useState(false);

  const schemeOptions: SchemeOption[] = schemes.map((option) => ({
    ...option,
    tenure: joinScheme.tenures[option.name] ?? option.tenure,
  }));

  const amountValue = Number(amount.replace(/\D/g, ""));
  /* Prototype: nothing is required, but a filled form still reads as ready. */
  const ready = Boolean(scheme) && amountValue > 0 && agreed;
  const tenure = scheme ? joinScheme.tenures[scheme] : undefined;

  /* Prototype: nothing is required — the seal plays, then the ledger opens. */
  const submit = () =>
    onJoined({
      scheme: scheme || "Your scheme",
      detail: amountValue
        ? `${formatRupees(amountValue)} every month${tenure ? ` for ${tenure}` : ""}`
        : "Your plan is active. Instalments begin next month.",
    });

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-col gap-5 sm:gap-7 lg:gap-9">
      <PageHeader
        eyebrow="Join a scheme"
        title={
          <>
            Start your <span className="text-gold-shimmer">gold plan</span>
          </>
        }
        description="Three steps: pick a plan, set what you will put aside each month, and confirm."
        aside={
          <GoldBadge icon={<Sparkles size={11} strokeWidth={1.8} />}>
            {schemes.length} plans available
          </GoldBadge>
        }
      />

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
        {/* The form */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Step 1 — the plan */}
          <motion.section variants={rise}>
            <StepMark index={1} label="Choose your scheme" required />

            <div className="mt-3 sm:mt-4">
              <SchemeSelect
                options={schemeOptions}
                value={scheme}
                onSelect={setScheme}
              />
            </div>
          </motion.section>

          {/* Step 2 — the amount */}
          <PremiumCard sheenDelay={1.2}>
            <StepMark index={2} label="Monthly amount" required />

            <div className="mt-4">
              <div className={`flex h-[52px] items-center gap-2 ${fieldClass}`}>
                <span className="text-[19px] font-semibold text-gold-600">₹</span>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="Amount"
                  aria-label="Monthly amount"
                  className="w-full bg-transparent text-[19px] font-semibold text-ink placeholder:text-[14px] placeholder:font-normal placeholder:text-muted-soft"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {joinScheme.presets.map((preset) => {
                  const isActive = amountValue === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(String(preset))}
                      aria-pressed={isActive}
                      className={`relative isolate rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-wine-900"
                          : "border border-line bg-cream text-muted hover:text-wine-700"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="preset-chip"
                          aria-hidden
                          className="gold-fill absolute inset-0 -z-10 rounded-full"
                          transition={spring.soft}
                        />
                      )}
                      {formatRupees(preset)}
                    </button>
                  );
                })}
              </div>
            </div>
          </PremiumCard>

          {/* Step 3 — the optional detail */}
          <PremiumCard sheenDelay={2.4}>
            <StepMark index={3} label="Details (optional)" />

            <div className="mt-4 flex flex-col gap-5">
              <div>
                <FieldLabel>Referral code</FieldLabel>
                <div className={`flex h-[52px] items-center ${fieldClass}`}>
                  <input
                    value={code}
                    onChange={(event) => setCode(event.target.value.toUpperCase())}
                    placeholder="Referral code"
                    aria-label="Referral code"
                    maxLength={12}
                    className="w-full bg-transparent text-[16px] font-semibold tracking-[0.14em] text-ink placeholder:text-[14px] placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-soft"
                  />
                </div>
              </div>

              <div>
                <Checkbox checked={nominee} onChange={setNominee}>
                  Add a nominee
                </Checkbox>

                <AnimatePresence initial={false}>
                  {nominee && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: ease.silk }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-3 flex h-[52px] items-center ${fieldClass}`}>
                        <input
                          value={nomineeName}
                          onChange={(event) => setNomineeName(event.target.value)}
                          placeholder="Nominee name"
                          aria-label="Nominee name"
                          className="w-full bg-transparent text-[16px] font-semibold text-ink placeholder:text-[14px] placeholder:font-normal placeholder:text-muted-soft"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <FieldLabel>Remarks</FieldLabel>
                <textarea
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  rows={3}
                  placeholder="Anything we should know"
                  aria-label="Remarks"
                  className={`resize-none py-3 text-[14.5px] placeholder:text-muted-soft ${fieldClass}`}
                />
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* The summary — sticky beside the form on desktop */}
        <motion.div variants={rise} className="lg:sticky lg:top-24">
          <PremiumCard tone="gilt" sheenDelay={0.6}>
            <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">Your subscription</p>

            <dl className="mt-3 flex flex-col divide-y divide-[rgba(212,175,55,0.22)] text-[13.5px] sm:mt-4">
              <div className="flex items-center justify-between gap-3 py-2">
                <dt className="text-muted">Scheme</dt>
                <dd className="truncate font-medium text-ink">{scheme || "Not chosen"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-2">
                <dt className="text-muted">Tenure</dt>
                <dd className="font-medium text-ink">{tenure ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 py-2">
                <dt className="text-muted">Nominee</dt>
                <dd className="truncate font-medium text-ink">
                  {nominee ? nomineeName.trim() || "To be confirmed" : "None"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 py-3">
                <dt className="text-muted">You pay</dt>
                <dd className="font-display text-[22px] leading-none text-ink">
                  {amountValue ? (
                    <>
                      {formatRupees(amountValue)}
                      <span className="ml-1 font-sans text-[12.5px] text-muted">/ month</span>
                    </>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-3 border-t border-[rgba(212,175,55,0.25)] pt-3 sm:mt-4 sm:pt-4">
              <Checkbox checked={agreed} onChange={setAgreed}>
                I agree to the scheme terms and conditions
              </Checkbox>
            </div>

            <motion.div
              className="mt-4 sm:mt-5"
              animate={{ opacity: ready ? 1 : 0.82 }}
              transition={{ duration: 0.3 }}
            >
              <PremiumButton onClick={submit} size="lg" icon={<Check size={15} strokeWidth={2.3} />}>
                Subscribe
              </PremiumButton>
            </motion.div>

            <p className="mt-3 text-center text-[11.5px] leading-snug text-muted-soft sm:mt-3.5 sm:text-[12px] sm:leading-relaxed">
              Instalments are collected monthly. You may pause or close a plan at the boutique.
            </p>
          </PremiumCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
