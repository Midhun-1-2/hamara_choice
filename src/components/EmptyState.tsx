import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { rise } from "../lib/motion";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}

/** Nothing here yet — said calmly, in the house voice. */
export default function EmptyState({
  icon,
  title,
  body,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <motion.div
      variants={rise}
      className={`flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-[rgba(212,175,55,0.35)] bg-gold-50/50 px-5 py-7 text-center sm:px-6 sm:py-10 ${className}`}
    >
      {icon && (
        <span
          aria-hidden
          className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pearl text-gold-700 sm:mb-4 sm:h-12 sm:w-12"
          style={{ border: "1px solid rgba(212,175,55,0.32)" }}
        >
          {icon}
        </span>
      )}
      <p className="font-display text-[18px] text-ink">{title}</p>
      {body && <p className="mt-2 max-w-[34ch] text-[12.5px] leading-snug text-muted sm:text-[13px] sm:leading-relaxed">{body}</p>}
      {action && <div className="mt-4 sm:mt-5">{action}</div>}
    </motion.div>
  );
}
