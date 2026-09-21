import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ease } from "../lib/motion";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Sits in the value row until something is typed. */
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  inputMode?: "text" | "tel" | "numeric";
  autoComplete?: string;
  maxLength?: number;
}

/**
 * Pearl field on a warm hairline. The label stays put above the value, so it
 * is readable at every moment rather than only while the field is empty.
 */
export default function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon,
  error,
  hint,
  inputMode = "text",
  autoComplete,
  maxLength,
}: TextFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      {/* The whole box is the label, so a tap anywhere inside focuses the field. */}
      <motion.label
        htmlFor={id}
        className="flex cursor-text items-center gap-3.5 rounded-2xl bg-pearl px-4 py-3"
        animate={{
          borderColor: error
            ? "rgba(176,59,54,0.55)"
            : focused
              ? "rgba(212,175,55,0.85)"
              : "rgba(232,222,208,1)",
          boxShadow: error
            ? "0 0 0 3px rgba(176,59,54,0.09)"
            : focused
              ? "0 0 0 3px rgba(212,175,55,0.16), 0 8px 20px -14px rgba(140,105,35,0.55)"
              : "0 1px 2px rgba(68,48,30,0.04)",
        }}
        transition={{ duration: 0.35, ease: ease.silk }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
      >
        {icon && (
          <span
            aria-hidden
            className={`shrink-0 transition-colors duration-400 ${
              error ? "text-negative" : focused ? "text-gold-600" : "text-muted-soft"
            }`}
          >
            {icon}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span
            className={`block text-[13.5px] leading-none font-medium transition-colors duration-400 ${
              error ? "text-negative" : "text-ink"
            }`}
          >
            {label}
          </span>

          <input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            inputMode={inputMode}
            autoComplete={autoComplete}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-label={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? `${id}-msg` : undefined}
            className="mt-1.5 block w-full bg-transparent p-0 text-[16px] font-semibold leading-tight text-ink caret-wine-700 placeholder:text-[14px] placeholder:font-normal placeholder:text-muted-soft"
          />
        </span>
      </motion.label>

      <AnimatePresence mode="wait">
        {(error || hint) && (
          <motion.p
            key={error ?? hint}
            id={`${id}-msg`}
            role={error ? "alert" : undefined}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.26, ease: ease.silk }}
            className={`mt-2 pl-1 text-[13px] ${error ? "text-negative" : "text-muted"}`}
          >
            {error ?? hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
