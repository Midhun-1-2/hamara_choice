import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { rise } from "../lib/motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  /** Optional trailing control — a link, a filter, a "view all". */
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** The rhythm marker between sections: eyebrow, serif title, quiet action. */
export default function SectionHeader({
  eyebrow,
  title,
  action,
  icon,
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={rise}
      className={`flex flex-wrap items-end justify-between gap-x-5 gap-y-2 ${className}`}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="flex items-center gap-2 text-[11px] font-medium tracking-luxe uppercase text-gold-700">
            {icon}
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1.5 font-display text-[17px] leading-tight text-ink sm:mt-2 sm:text-[21px]">
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0 pb-0.5">{action}</div>}
    </motion.div>
  );
}
