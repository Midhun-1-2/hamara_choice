import { motion, useIsPresent, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import type { ReactNode } from "react";
import BrandLogo from "./BrandLogo";
import { ease, rise, spring } from "../lib/motion";

interface AuthLayoutProps {
  eyebrow: string;
  /** Editorial headline inside the card. */
  title: ReactNode;
  body?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  children: ReactNode;
  /** Small print under the card. */
  footnote?: ReactNode;
  /**
   * True only for the screen that leaves the auth flow entirely (login →
   * home). Home's dashboard is heavy enough to mount that a same-frame,
   * no-op exit can leave this screen fully opaque a beat too long, showing
   * through the incoming dashboard's translucent cards as a ghost. A real,
   * short fade guarantees it is on its way to invisible even if removal
   * lags a frame — every other auth step keeps the root still and lets only
   * the card move, as described below.
   */
  exitFade?: boolean;
}

/*
  STEP TO STEP — the card is what changes, so the card is what moves.

  The set, the brand and the frame hold still (see the note on the root
  below); the outgoing card lifts away and thins out while the incoming one
  settles down onto the same spot, tipped back a touch and dropping flat —
  the house "laid on the counter" entrance. Both run at once, so the hand-off
  reads as one surface replacing another rather than a cut. The outgoing side
  is driven by presence, not by `exit` props, because variant labels do not
  propagate through this tree (the column sets its own `animate`).
*/
/*
  `custom` is "first auth screen of the session". The opening delay exists so
  the brand lands a beat before the card on that first screen; on every later
  step the brand is already standing still, so the delay only held the new
  card back while the old one was leaving — a moment with no card on the set.
*/
const column: Variants = {
  initial: {},
  animate: (first: boolean) => ({
    transition: { staggerChildren: 0.055, delayChildren: first ? 0.06 : 0 },
  }),
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const settle: Variants = {
  initial: { opacity: 0, y: 30, scale: 0.955, rotateX: 7 },
  animate: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: spring.soft },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.985,
    rotateX: -4,
    transition: { duration: 0.26, ease: ease.exit },
  },
};

/** Back arrow and small print: same bloom in, a quick lift out. */
const riseAway: Variants = {
  ...rise,
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: ease.exit } },
};

/*
  THE FLICKER — and why the set and the brand animate only once.

  Every auth step is its own `AuthLayout`, and steps overlap for 0.32s while
  the card hands over. The photograph used to run its 1.6s reveal (opacity 0,
  scale 1.08) on every mount, so the moment the outgoing step unmounted the
  incoming one was still half-transparent: the set dipped to the shell's ivory
  and came back — a visible blink on each step. The brand block did the same
  in miniature, blooming from 0.94 over the outgoing one that was still at 1.
  Both are meant to *hold still* between steps; only the card moves. So the
  reveal plays on the first `AuthLayout` of the session and never again — a
  later mount starts at its resting state.
*/
let setRevealed = false;

const BG_PORTRAIT = "/brand/login-bg-mobile.jpg";
const BG_LANDSCAPE = "/brand/login-bg-desktop.jpg";

/** Gold leaf sprig, tucked into a corner of the card. */
function LeafOrnament({ corner }: { corner: "tr" | "bl" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      fill="none"
      className={`pointer-events-none absolute h-24 w-24 opacity-[0.55] sm:h-28 sm:w-28 ${
        corner === "tr" ? "-right-1 -top-1 rotate-180" : "-bottom-1 -left-1"
      }`}
    >
      <path
        d="M14 108 C 44 104, 78 88, 100 58"
        stroke="rgba(176,141,40,0.45)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {[
        [34, 102, -8, -20],
        [54, 94, -6, -22],
        [72, 82, -4, -22],
        [88, 68, -2, -20],
      ].map(([x, y, dx, dy], i) => (
        <path
          key={i}
          d={`M${x} ${y} C ${x + dx - 6} ${y + dy + 6}, ${x + dx} ${y + dy}, ${x + dx + 8} ${y + dy - 2} C ${x + dx + 6} ${y + dy + 10}, ${x + dx / 2} ${y + 2}, ${x} ${y} Z`}
          fill="rgba(212,175,55,0.16)"
          stroke="rgba(176,141,40,0.35)"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

/**
 * The sign-in furniture. A photographic set dresses the page — portrait on
 * phones, landscape from `sm` up — with the brand standing on it and a single
 * frosted card beneath. One column at every width, sized to the viewport so
 * the screen never scrolls.
 */
export default function AuthLayout({
  eyebrow,
  title,
  body,
  onBack,
  backLabel = "Back",
  children,
  footnote,
  exitFade = false,
}: AuthLayoutProps) {
  const reduced = useReducedMotion();
  const present = useIsPresent();
  /* Decided once per mount: is this the first auth screen of the session? */
  const firstMount = useRef(!setRevealed);
  setRevealed = true;
  const reveal = !reduced && firstMount.current;

  /*
    The auth flow does not carry a whole-screen transition — no scale, tilt or
    fade on this outer frame, the way `ScreenTransition` gives every other
    screen. Stepping from one auth screen to the next is meant to read as the
    same set continuing: the photograph, the brand mark and the card frame all
    hold still, and only what actually changed — the card — moves: the
    outgoing one lifts away as the incoming one settles (`settle` above). It
    is only this root that carries no animation of its own.

    It still has to be a motion component with an `exit`, though — not for
    looks, for bookkeeping. `AnimatePresence` in App.tsx keeps an outgoing
    screen mounted until something inside it reports its exit animation
    finished, and that report only ever comes from a motion descendant
    carrying `exit`; a plain div has nothing to report. `exit` below matches
    `animate`, so the root does not visibly change; its duration is simply
    the card's departure time, so the screen is removed the moment the card
    has gone rather than before or long after.

    (A same-values check here of counting DOM nodes after each step is not
    trustworthy evidence either way: this preview pane runs hidden, which
    starves `requestAnimationFrame` — confirmed separately, zero frames fire
    in 600ms — so no Framer animation anywhere in the app, including the
    splash screen's long-working exit, completes while it stays hidden. A
    live tab does not have that limitation.)
  */
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={exitFade ? { opacity: 0 } : { opacity: 1 }}
      /*
        Held for as long as the card takes to leave (0.26s plus the reverse
        stagger): the root itself does not move, it only stays mounted so the
        card's departure below can play out on it. The one real fade (into the
        dashboard) stays short: while it runs, this screen's copy of the logo
        and the dashboard's copy are both drawn mid-morph, and the dashboard is
        arriving under a scale-and-tilt of its own, so the two do not sit on
        exactly the same pixels — the less time that overlap is visible the
        better.
      */
      transition={exitFade ? { duration: 0.14, ease: ease.exit } : { duration: 0.32 }}
      className="absolute inset-0 isolate flex flex-col overflow-hidden">
      {/*
        The set. Its floor is the photograph's own average tone, so while the
        first reveal is still fading the picture up (and the splash has already
        gone) what shows through is warm sand, not the shell's pale ivory —
        the hand-off from burgundy no longer passes through a bright flash.
      */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-[#dcbfa6]">
        <motion.div
          className="absolute inset-0 bg-cover bg-center will-change-transform sm:hidden"
          style={{ backgroundImage: `url(${BG_PORTRAIT})` }}
          initial={reveal ? { scale: 1.08, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: ease.silk }}
        />
        <motion.div
          className="absolute inset-0 hidden bg-cover bg-center will-change-transform sm:block"
          style={{ backgroundImage: `url(${BG_LANDSCAPE})` }}
          initial={reveal ? { scale: 1.06, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: ease.silk }}
        />
        {/* Lifts the card off the photograph without dulling it */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 62%, rgba(255,252,246,0.62) 0%, rgba(255,252,246,0.18) 55%, rgba(255,252,246,0) 100%)",
          }}
        />
      </div>

      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,calc(env(safe-area-inset-top)+0.5rem))] sm:px-8">
        <motion.div
          variants={column}
          custom={firstMount.current}
          initial="initial"
          animate={present ? "animate" : "exit"}
          /*
            `min-h-full` rather than `flex-1`: a flex child that is told to
            fill its parent cannot grow past it, so on a short screen the card
            overflowed and the column had nothing to scroll. This centres while
            there is room and grows — and scrolls — when there is not.
          */
          className="mx-auto flex min-h-full w-full max-w-[520px] shrink-0 flex-col items-center justify-center gap-[clamp(10px,1.8vh,24px)] py-1"
        >
          {/* Brand, standing on the set above the card */}
          <motion.div
            variants={rise}
            initial={firstMount.current ? undefined : false}
            className="flex shrink-0 flex-col items-center"
          >
            {/*
              Optically centred, not just geometrically: the diamond on the
              left is far denser than the type, so the lockup's visual mass sits
              at 46% of its width and the box reads as sitting left. Nudged
              right by that 4% (of 160-250px) so the weight lands on the axis.
            */}
            <BrandLogo
              variant="lockup"
              width={250}
              sizeClass="w-[clamp(160px,42vw,250px)]"
              className="ml-[6px] sm:ml-[10px]"
              shared
            />

            <div className="mt-2.5 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-[rgba(176,141,40,0.55)] sm:w-10" />
              <span className="text-[11px] font-medium tracking-luxe uppercase text-gold-700 sm:text-[11px]">
                Est. Kochi
              </span>
              <span aria-hidden className="h-px w-8 bg-[rgba(176,141,40,0.55)] sm:w-10" />
            </div>
          </motion.div>

          {onBack && (
            <motion.button
              variants={riseAway}
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              whileHover={reduced ? undefined : { scale: 1.06 }}
              whileTap={reduced ? undefined : { scale: 0.94 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(255,253,248,0.82)] text-wine-700 backdrop-blur-sm"
            >
              <ArrowLeft size={15} strokeWidth={1.7} />
            </motion.button>
          )}

          {/* The card */}
          <motion.div
            variants={settle}
            className="relative isolate w-full overflow-hidden rounded-[26px] px-5 py-5 sm:px-8 sm:py-7"
            style={{
              transformPerspective: 1200,
              background:
                "linear-gradient(158deg, rgba(255,253,249,0.94) 0%, rgba(253,248,238,0.9) 100%)",
              border: "1px solid rgba(212,175,55,0.45)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow:
                "0 28px 60px -30px rgba(92,62,30,0.45), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            <LeafOrnament corner="tr" />
            <LeafOrnament corner="bl" />

            <div className="relative">
              <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">{eyebrow}</p>
              <h1 className="mt-2 font-display text-[clamp(23px,5.6vw,30px)] leading-[1.12] text-wine-800">
                {title}
              </h1>
              {body && (
                <p className="mt-2 text-[clamp(12px,3.2vw,13px)] leading-relaxed text-muted">
                  {body}
                </p>
              )}

              <div className="mt-[clamp(14px,2vh,22px)]">{children}</div>
            </div>
          </motion.div>

          {footnote && (
            <motion.div variants={riseAway} className="shrink-0">
              {footnote}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
