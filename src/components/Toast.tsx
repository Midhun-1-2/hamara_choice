import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { spring } from "../lib/motion";
import type { ToastMessage } from "../types";

interface ToastStackProps {
  toasts: ToastMessage[];
}

/** Contextual confirmations: pearl plates with a gold tick, stacked clear of the dock. */
export default function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-[96px] z-[60] flex flex-col items-center gap-2 px-5 lg:inset-x-auto lg:right-8 lg:bottom-8 lg:w-[350px] lg:items-end lg:px-0"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={spring.soft}
            className="surface flex w-full items-center gap-3 rounded-2xl px-4 py-3"
            style={{ boxShadow: "0 18px 40px -22px rgba(68,48,30,0.55)" }}
          >
            <span
              className="gold-fill flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              aria-hidden
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)" }}
            >
              <Check size={13} strokeWidth={2.6} className="text-wine-900" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-medium text-ink">{toast.title}</span>
              {toast.detail && (
                <span className="block truncate text-[12.5px] text-muted">{toast.detail}</span>
              )}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
