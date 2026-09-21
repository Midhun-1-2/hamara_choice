import { motion, useReducedMotion } from "framer-motion";
import { Bell } from "lucide-react";
import type { ReactNode } from "react";
import BrandLogo from "./BrandLogo";
import { spring } from "../lib/motion";

interface TopBarProps {
  initial: string;
  showLogo: boolean;
  /** Desktop's Home tab hands its greeting up here, in the space the logo
   *  leaves empty on wide screens — takes over the left slot from `showLogo`. */
  leading?: ReactNode;
  unread?: boolean;
  onNotifications: () => void;
  onProfile: () => void;
}

/**
 * No bar any more — the page background runs straight to the top edge. The
 * brand mark sits free at the left on phones (the rail already carries it on
 * desktop, so nothing renders there — unless the caller hands in a `leading`
 * node, e.g. the desktop greeting, which fills that space instead). Bell and
 * account share one small floating capsule at the top right — the rate now
 * lives only on the gold rate card, so the header stays out of its way.
 */
export default function TopBar({
  initial,
  showLogo,
  leading,
  unread = true,
  onNotifications,
  onProfile,
}: TopBarProps) {
  const reduced = useReducedMotion();

  return (
    <div className="relative z-30 flex items-center justify-between gap-3 px-4 pt-[max(0.6rem,env(safe-area-inset-top))] pb-2 sm:px-5 sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-3 lg:px-10 lg:pt-4 lg:pb-2">
      {leading ??
        (showLogo ? (
          <BrandLogo variant="lockup" tone="ink" width={150} sizeClass="w-[140px] sm:w-[150px]" shared />
        ) : (
          <span aria-hidden />
        ))}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.soft}
        className="flex items-center gap-1 rounded-full p-1 sm:p-1.5"
        style={{
          background: "linear-gradient(168deg, #71222A 0%, #55151C 58%, #410F16 100%)",
          border: "1px solid rgba(212,175,55,0.4)",
          boxShadow: "0 16px 32px -18px rgba(30,6,10,0.7), inset 0 1px 0 rgba(255,246,224,0.16)",
        }}
      >
        <motion.button
          type="button"
          onClick={onNotifications}
          aria-label="Notifications"
          whileTap={reduced ? undefined : { scale: 0.92 }}
          transition={spring.press}
          /* 38px, not 32: a bell is a small glyph but it still has to be a
             thumb target, and the capsule has the room. */
          className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full text-gold-200 transition-colors duration-300 hover:text-gold-100 sm:h-9 sm:w-9"
        >
          <Bell size={15} strokeWidth={1.7} />
          {unread && (
            <motion.span
              aria-hidden
              className="gold-fill absolute right-2 top-2 h-[6px] w-[6px] rounded-full"
              animate={reduced ? undefined : { scale: [1, 1.2, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={onProfile}
          aria-label="Account"
          whileTap={reduced ? undefined : { scale: 0.94 }}
          whileHover={reduced ? undefined : { scale: 1.04 }}
          transition={spring.press}
          className="gold-fill flex h-[38px] w-[38px] items-center justify-center rounded-full font-display text-[14px] text-wine-900 sm:h-9 sm:w-9"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)" }}
        >
          {initial}
        </motion.button>
      </motion.div>
    </div>
  );
}
