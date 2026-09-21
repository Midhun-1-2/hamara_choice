import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { rise } from "../lib/motion";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  /** Right-hand slot: a summary chip, a control, a secondary action. */
  aside?: ReactNode;
  className?: string;
}

/** Opens every tab: eyebrow, editorial title, one line of orientation. */
export default function PageHeader({
  eyebrow,
  title,
  description,
  aside,
  className = "",
}: PageHeaderProps) {
  return (
    <motion.header
      variants={rise}
      className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-3 sm:gap-y-4 ${className}`}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">{eyebrow}</p>
        <h1 className="mt-2 font-display text-[24px] leading-[1.12] text-ink sm:mt-2.5 sm:text-[32px] lg:text-[38px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-[52ch] text-[12.5px] leading-snug text-muted sm:mt-2.5 sm:text-[13.5px] sm:leading-relaxed lg:text-[14.5px]">
            {description}
          </p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </motion.header>
  );
}
