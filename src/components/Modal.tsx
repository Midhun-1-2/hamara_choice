import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useIsDesktop } from "../hooks/useMediaQuery";
import { ease, spring } from "../lib/motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  /** Pinned to the bottom of the panel, outside the scrolling body. */
  footer?: ReactNode;
}

/**
 * One dialog, two shapes: a drag-dismissible sheet on phones, a centred panel
 * on desktop. Escape closes both; the scrim is a warm wash rather than a
 * blackout, so the page stays visible behind it.
 */
export default function Modal({ open, onClose, title, eyebrow, children, footer }: ModalProps) {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  /*
    Every dialog is raised out of wherever it was declared and hung on the
    frame itself, so it always covers the whole screen — header and dock
    included — whatever the component that opened it happens to sit inside.
  */
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHost(document.getElementById("app-frame"));
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const header = (
    <div className="flex items-start justify-between gap-4 px-5 pt-3.5 pb-2.5 sm:px-7 sm:pt-4 sm:pb-3">
      <div className="min-w-0">
        {eyebrow && <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">{eyebrow}</p>}
        <h2 className="mt-1 font-display text-[20px] leading-tight text-ink sm:mt-1.5 sm:text-[25px]">
          {title}
        </h2>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="mt-1 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-[rgba(107,31,38,0.3)] hover:text-wine-700 sm:h-9 sm:w-9"
      >
        <X size={15} strokeWidth={1.6} />
      </button>
    </div>
  );

  if (!host) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-[rgba(58,29,20,0.28)] backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: ease.silk }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            /* No `-translate-y-1/2` here: Tailwind v4 writes the `translate`
               property, which would stack with the `y` transform Framer sets
               and push the panel a full height off centre. */
            className="absolute inset-x-0 bottom-0 z-50 flex max-h-[84%] flex-col overflow-hidden rounded-t-[26px] border border-line-soft bg-pearl pb-[calc(env(safe-area-inset-bottom)+14px)] lg:inset-x-auto lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:max-h-[78vh] lg:w-[min(560px,calc(100%-4rem))] lg:-translate-x-1/2 lg:rounded-[26px] lg:pb-4"
            style={{ boxShadow: "0 -20px 60px -30px rgba(68,48,30,0.55), 0 40px 80px -40px rgba(68,48,30,0.5)" }}
            initial={isDesktop ? { opacity: 0, scale: 0.96, y: "-46%" } : { y: "100%" }}
            animate={isDesktop ? { opacity: 1, scale: 1, y: "-50%" } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.97, y: "-48%" } : { y: "100%" }}
            transition={reduced ? { duration: 0.2 } : spring.sheet}
            drag={reduced || isDesktop ? false : "y"}
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 520) onClose();
            }}
          >
            {/* Gold hairline across the top edge of the panel */}
            <span aria-hidden className="divider-gold absolute inset-x-10 top-0 h-px" />

            {!isDesktop && (
              <div className="flex cursor-grab justify-center pt-3 pb-0.5 active:cursor-grabbing">
                <span className="h-1 w-10 rounded-full bg-line" />
              </div>
            )}

            {header}

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-1 sm:px-7">
              {children}
            </div>

            {footer && (
              <div className="border-t border-line-soft px-5 pt-3.5 sm:px-7 sm:pt-4">{footer}</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    host,
  );
}
