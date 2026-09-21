import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { navItems } from "../lib/nav";
import type { NavKey } from "../lib/nav";
import { spring } from "../lib/motion";

interface BottomNavigationProps {
  active: NavKey;
  onChange: (key: NavKey) => void;
  className?: string;
}

/** The coin, and the bite the bar takes out of itself to seat it. */
const COIN = 44;
/** Coin radius plus a five-pixel gap ring. */
const NOTCH = 27;
/**
 * How far the coin's centre sits above the bar's top edge. Low enough that the
 * coin nearly meets the label under it — at 14 the two read as separate pieces
 * with a band of bar stranded between them — and still high enough that most
 * of it stands proud of the rule.
 */
const RISE = 5;
/** Lift that carries an icon from its resting row up into the coin. */
const ICON_LIFT = 25;

/** Three pips near the rim. Without them a disc of gold cannot be seen to turn. */
const PIPS = [0, 120, 240];

/**
 * The phone dock: a burgundy bar floating clear of all three edges, with a
 * gold coin seated in a bite taken out of its top rule.
 *
 * The coin is one element that lives above the row, not a marker redrawn
 * inside whichever tab is current — so moving between tabs slides the single
 * coin along the bar, and the bite travels with it. It also *rolls*: a whole
 * turn per tab crossed, clockwise going right, which lands it face-up again
 * wherever it stops. The icon rides on top of the coin without turning, so it
 * is never upside down.
 *
 * The bar carries no `backdrop-filter`. The old one did, and it made the phone
 * re-composite everything behind it on every frame of every scroll.
 */
export default function BottomNavigation({
  active,
  onChange,
  className = "",
}: BottomNavigationProps) {
  const reduced = useReducedMotion();
  const index = Math.max(
    0,
    navItems.findIndex((item) => item.key === active),
  );

  const card = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const placed = useRef(false);
  const lastIndex = useRef(index);
  const turns = useRef(0);
  const [ready, setReady] = useState(false);

  const travel = { stiffness: 250, damping: 28, mass: 0.9 };
  const x = useSpring(0, travel);
  const roll = useSpring(0, travel);

  /* Left edge of the coin, in the bar's own coordinates. */
  const measure = useCallback(() => {
    const host = card.current;
    const target = buttons.current[index];
    if (!host || !target) return;

    const hostBox = host.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();
    const left = targetBox.left - hostBox.left + targetBox.width / 2 - COIN / 2;

    if (!placed.current) {
      // First paint: the coin belongs under the current tab, not sliding to it.
      placed.current = true;
      x.jump(left);
      setReady(true);
      return;
    }
    x.set(left);
  }, [index, x]);

  useLayoutEffect(() => {
    measure();

    const step = index - lastIndex.current;
    lastIndex.current = index;
    if (!step) return;

    // A full turn per tab crossed: visibly rolling, and always face-up at rest.
    turns.current += step * 360;
    if (reduced) roll.jump(turns.current);
    else roll.set(turns.current);
  }, [index, measure, reduced, roll]);

  useLayoutEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /*
    The bite. A circle of transparency punched out of the bar's own plate,
    tracking the coin. It is on the plate rather than on the bar itself, so it
    never takes the icons or the labels with it.
  */
  const bite = useTransform(
    x,
    (left) =>
      `radial-gradient(circle ${NOTCH}px at ${left + COIN / 2}px ${-RISE}px, transparent 98%, #000 100%)`,
  );

  return (
    <nav
      aria-label="Primary"
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] ${className}`}
    >
      <div ref={card} className="pointer-events-auto relative mx-auto max-w-[460px]">
        {/* The bar itself, bitten */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-[26px]"
          style={{
            background: "linear-gradient(168deg, #71222A 0%, #55151C 56%, #3D0E14 100%)",
            border: "1px solid rgba(212,175,55,0.34)",
            boxShadow:
              "0 22px 44px -20px rgba(30,6,10,0.75), 0 4px 12px -6px rgba(30,6,10,0.5), inset 0 1px 0 rgba(255,246,224,0.14)",
            maskImage: bite,
            WebkitMaskImage: bite,
          }}
        />

        {/* The coin, seated in the bite */}
        <motion.div
          aria-hidden
          className="absolute left-0"
          style={{
            top: -(RISE + COIN / 2),
            height: COIN,
            width: COIN,
            x,
            opacity: ready ? 1 : 0,
          }}
        >
          {/* Everything that turns */}
          <motion.span
            className="gold-fill absolute inset-0 block rounded-full"
            style={{
              rotate: roll,
              boxShadow:
                "0 12px 22px -10px rgba(30,6,10,0.85), inset 0 1px 0 rgba(255,255,255,0.65)",
            }}
          >
            {/* Specular, held off-centre so the turn is legible */}
            <span
              className="absolute inset-[3px] rounded-full"
              style={{
                background:
                  "linear-gradient(142deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.12) 38%, rgba(255,255,255,0) 62%)",
              }}
            />

            {PIPS.map((angle) => (
              <span
                key={angle}
                className="absolute left-1/2 top-1/2 h-[3px] w-[3px] rounded-full"
                style={{
                  background: "rgba(90,58,10,0.45)",
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${COIN / 2 - 6}px)`,
                }}
              />
            ))}
          </motion.span>

          {/* Rim, which does not turn — a wine gap ring, then gold */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow:
                "0 0 0 4px rgba(61,14,20,0.96), 0 0 0 5px rgba(212,175,55,0.55), inset 0 0 0 1px rgba(255,246,224,0.3)",
            }}
          />
        </motion.div>

        {/* The row. Sits above both, so an icon is never masked or covered. */}
        {/*
          The row's vertical padding lives on the buttons, not on the row: the
          bar is the same height either way, but each target is then the full
          55px tall instead of the 35px its contents happen to measure.
        */}
        <div className="relative flex items-end px-1.5">
          {navItems.map(({ key, short, icon: Icon, label }, position) => {
            const isActive = key === active;

            return (
              <motion.button
                key={key}
                ref={(node) => {
                  buttons.current[position] = node;
                }}
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                whileTap={reduced ? undefined : { scale: 0.94 }}
                transition={spring.press}
                className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-0.5 pb-2.5 pt-2.5"
              >
                <motion.span
                  aria-hidden
                  className="relative z-10 flex h-5 items-center justify-center"
                  /* Not gated on reduced motion: this is where the icon lives
                     when selected, not an embellishment. Framer puts it there
                     without the spring when the user has asked for less. */
                  animate={{ y: isActive ? -ICON_LIFT : 0 }}
                  transition={travel}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.1 : 1.6}
                    className={`transition-colors duration-300 ${
                      isActive ? "text-wine-900" : "text-gold-200/70"
                    }`}
                  />
                </motion.span>

                <span
                  className={`relative z-10 text-[10.5px] leading-none font-medium transition-colors duration-300 ${
                    isActive ? "text-gold-300" : "text-gold-200/60"
                  }`}
                >
                  {short}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
