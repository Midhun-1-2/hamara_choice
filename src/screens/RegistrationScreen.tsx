import { useState } from "react";
import { ArrowRight, Lock, Phone, User } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Checkbox from "../components/Checkbox";
import PremiumButton from "../components/PremiumButton";
import TextField from "../components/TextField";
import { layout } from "../lib/motion";
import type { Account } from "../types";

interface RegistrationScreenProps {
  onContinue: (account: Account) => void;
}

export default function RegistrationScreen({ onContinue }: RegistrationScreenProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [remember, setRemember] = useState(true);

  /*
    Prototype: nothing is validated. An empty form still walks through to the
    code screen, with stand-in details so the rest of the app has something to
    greet and mask.
  */
  const submit = () => {
    const digits = phone.replace(/\D/g, "");
    onContinue({
      name: name.trim() || "Guest",
      phone: digits || "9876543210",
    });
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to your account"
      body="Continue your golden journey with us."
      footnote={
        <p className="text-center text-[11.5px] leading-relaxed text-muted">
          By continuing you accept our terms and privacy notice.
        </p>
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="flex flex-col gap-3.5"
      >
        <TextField
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChange={setName}
          autoComplete="name"
          icon={<User size={17} strokeWidth={1.6} />}
        />
        <TextField
          label="Mobile Number"
          placeholder="Enter your 10 digit mobile number"
          value={phone}
          onChange={(next) => setPhone(next.replace(/[^\d\s+]/g, ""))}
          inputMode="tel"
          autoComplete="tel"
          maxLength={15}
          icon={<Phone size={17} strokeWidth={1.6} />}
        />

        <div className="pt-1">
          <Checkbox checked={remember} onChange={setRemember}>
            Remember me
          </Checkbox>
        </div>

        <button type="submit" className="sr-only">
          Continue
        </button>
      </form>

      <div className="mt-5">
        <PremiumButton
          onClick={submit}
          layoutId={layout.primaryAction}
          size="lg"
          icon={<ArrowRight size={15} strokeWidth={1.9} />}
        >
          Continue
        </PremiumButton>
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-[12.5px] text-muted">
        <Lock size={12} strokeWidth={1.7} className="text-gold-600" />
        Your data is safe with us
      </p>
    </AuthLayout>
  );
}
