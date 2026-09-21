import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { promos } from "../data/mock";
import { useIsTouch } from "../hooks/useMediaQuery";
import { useToast } from "../hooks/useToasts";
import { ease, rise, spring } from "../lib/motion";

const ROTATE_MS = 6500;

interface PromotionCardProps {
  className?: string;
}

/**
 * The editorial moment — and the one place burgundy is allowed to fill a whole
 * plate. Warm jewellery photography sits behind a burgundy wash, with the
 * house serif over it and a gold action.
 */
export default function PromotionCard({ className = "" }: PromotionCardProps) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  /*
    Same reasoning as the gold rate card's clock: an automatic tick here
    crossfades a background photo, a heading and a body paragraph, all timed
    together, on an endless 6.5s loop, whether the tab is in view or not. It
    is chrome, not information — the dots below switch it by hand — so touch
    devices keep the card still and let a tap drive it instead.
  */
  const touch = useIsTouch();
  const toast = useToast();
  const promo = promos[index];

  useEffect(() => {
    if (reduced || touch) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % promos.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [reduced, touch]);

  return (
    <motion.div
      variants={rise}
      className={`surface-wine relative isolate flex min-h-[188px] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-4 sm:min-h-[264px] sm:p-8 lg:min-h-[300px] lg:p-10 ${className}`}
    >
      {/* Photography, drifting very slowly */}
      <AnimatePresence initial={false}>
        <motion.div
          key={promo.id}
          aria-hidden
          className="absolute inset-0 -z-20 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${promo.image})` }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: reduced ? 1.04 : 1.02 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9, ease: ease.silk }, scale: { duration: 9, ease: "easeOut" } }}
        />
      </AnimatePresence>

      {/* Burgundy wash, heaviest where the copy sits */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(94deg, rgba(58,13,19,0.94) 0%, rgba(74,17,23,0.88) 38%, rgba(107,31,38,0.6) 68%, rgba(107,31,38,0.32) 100%)",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ boxShadow: "inset 0 -70px 90px -50px rgba(26,4,8,0.9)" }}
      />

      <div className="relative max-w-[30ch] lg:max-w-[38ch]">
        <AnimatePresence mode="wait">
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: ease.silk }}
          >
            <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-400">{promo.eyebrow}</p>
            <h3 className="mt-2 font-display text-[20px] leading-[1.15] text-gold-100 sm:mt-3 sm:text-[30px] lg:text-[36px]">
              {promo.title}
            </h3>
            <p className="mt-1.5 text-[12px] leading-snug text-gold-200/80 sm:mt-3 sm:text-[13.5px] sm:leading-relaxed lg:text-[14.5px]">
              {promo.body}
            </p>

            <motion.button
              type="button"
              onClick={() => toast({ title: promo.title, detail: "Collection page is mocked for the demo" })}
              whileHover={reduced ? undefined : { scale: 1.03 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={spring.press}
              className="gold-fill mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium tracking-luxe-sm uppercase text-wine-900 sm:mt-6 sm:px-5 sm:py-2.5 sm:text-[12.5px]"
              style={{ boxShadow: "0 16px 34px -18px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.5)" }}
            >
              {promo.action}
              <ArrowRight size={14} strokeWidth={2} />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/*
        The dots are drawn small on purpose. The button around each one carries
        the padding, so the thumb target is ~24x30 while the mark itself stays
        1.5px tall. The negative margins cancel that padding exactly, so the
        row occupies the same 6px it always did (mt-4 + 12px of padding gives
        back the old mt-7 gap).
      */}
      <div className="relative mt-3 -mx-2 -mb-4 flex items-center sm:mt-4 sm:-mb-6">
        {promos.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${item.eyebrow}`}
            aria-current={i === index}
            className="flex items-center px-2 py-3"
          >
            <span
              aria-hidden
              className="block h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === index ? 28 : 8,
                background:
                  i === index
                    ? "linear-gradient(90deg,#c29a2c,#e5c76b,#c29a2c)"
                    : "rgba(229,199,107,0.28)",
              }}
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
