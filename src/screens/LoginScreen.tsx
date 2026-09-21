import { useState } from "react";
import { ArrowRight, Lock, Phone, ShieldCheck } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Captcha from "../components/Captcha";
import PremiumButton from "../components/PremiumButton";
import TextField from "../components/TextField";
import { MPIN_LENGTH } from "../data/mock";
import { layout } from "../lib/motion";

interface LoginScreenProps {
  phone: string;
  onLogin: () => void;
}

/**
 * The returning-customer screen, reached once an MPIN has been set: the number
 * on the account, the PIN that unlocks it, and the house challenge. Nothing is
 * validated in the prototype — the action always opens the vault.
 */
export default function LoginScreen({ phone, onLogin }: LoginScreenProps) {
  const [number, setNumber] = useState(phone);
  const [mpin, setMpin] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your vault"
      body="Your number, your MPIN, and the code on the plate."
      exitFade
      footnote={
        <p className="text-center text-[11.5px] leading-relaxed text-muted">
          Trouble signing in? Visit the boutique and we will help.
        </p>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onLogin();
        }}
        className="flex flex-col gap-2.5"
      >
        <TextField
          label="Mobile Number"
          placeholder="Enter your 10 digit mobile number"
          value={number}
          onChange={(next) => setNumber(next.replace(/[^\d\s+]/g, ""))}
          inputMode="tel"
          autoComplete="tel"
          maxLength={15}
          icon={<Phone size={17} strokeWidth={1.6} />}
        />

        <TextField
          label="MPIN"
          placeholder={`${MPIN_LENGTH} digit vault PIN`}
          value={mpin}
          onChange={(next) => setMpin(next.replace(/\D/g, "").slice(0, MPIN_LENGTH))}
          inputMode="numeric"
          autoComplete="off"
          icon={<Lock size={17} strokeWidth={1.6} />}
        />

        <div>
          <span className="mb-1.5 block text-[11.5px] font-medium tracking-luxe-sm uppercase text-muted">
            Security check
          </span>
          <Captcha />

          {/*
            One compact line rather than a second stacked field — the pair has
            to clear a 568px-tall phone alongside the number and the PIN.
          */}
          <label className="mt-2 flex h-[48px] cursor-text items-center gap-3 rounded-2xl border border-line bg-pearl px-4 transition-colors duration-300 focus-within:border-[rgba(212,175,55,0.85)]">
            <ShieldCheck size={16} strokeWidth={1.6} className="shrink-0 text-gold-600" />
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value.toUpperCase().slice(0, 6))}
              placeholder="Type the code above"
              aria-label="Enter the captcha code"
              autoComplete="off"
              className="w-full bg-transparent text-[15px] font-semibold tracking-[0.18em] text-ink outline-none placeholder:text-[13.5px] placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-soft"
            />
          </label>
        </div>

        <button type="submit" className="sr-only">
          Sign in
        </button>
      </form>

      <div className="mt-3.5">
        <PremiumButton
          onClick={onLogin}
          layoutId={layout.primaryAction}
          size="lg"
          icon={<ArrowRight size={15} strokeWidth={1.9} />}
        >
          Sign in
        </PremiumButton>
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-muted">
        <Lock size={12} strokeWidth={1.7} className="text-gold-600" />
        Your data is safe with us
      </p>
    </AuthLayout>
  );
}
