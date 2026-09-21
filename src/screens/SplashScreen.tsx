import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import BrandLogo from "../components/BrandLogo";
import ScreenTransition from "../components/ScreenTransition";

interface SplashScreenProps {
  onDone: () => void;
}

/** How long the opening runs before the app takes over. */
const HOLD_MS = 2800;

/**
 * Shorthand for the keyframe utility: name, how long, when, easing, how often.
 * Everything on this screen is driven this way.
 */
const anim = (
  name: string,
  duration: number,
  delay = 0,
  repeat: number | "infinite" = 1,
  easing = "cubic-bezier(0.22, 1, 0.36, 1)",
): CSSProperties =>
  ({
    "--splash-name": name,
    "--splash-duration": `${duration}s`,
    "--splash-delay": `${delay}s`,
    "--splash-repeat": repeat,
    "--splash-ease": easing,
  }) as CSSProperties;

/** Dust leaving the floor. Left offset, size, when it starts, how long it lives. */
const DUST = [
  { x: 6, size: 3, delay: 0.2, duration: 2.6 },
  { x: 17, size: 2, delay: 1.1, duration: 3 },
  { x: 28, size: 2.5, delay: 0.55, duration: 2.3 },
  { x: 39, size: 2, delay: 1.5, duration: 2.8 },
  { x: 50, size: 3, delay: 0.85, duration: 2.5 },
  { x: 61, size: 2, delay: 1.8, duration: 3.1 },
  { x: 72, size: 2.5, delay: 0.35, duration: 2.7 },
  { x: 83, size: 2, delay: 1.3, duration: 2.4 },
  { x: 93, size: 3, delay: 0.7, duration: 2.9 },
];

/** Corner filigree, in the house's printed style. */
function Filigree({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 150 150" fill="none" className={className}>
      <path
        d="M2 2 C 54 2, 92 18, 118 48 C 132 64, 140 88, 142 116"
        stroke="rgba(229,199,107,0.42)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M2 22 C 44 24, 76 38, 98 64 C 110 78, 116 96, 119 116"
        stroke="rgba(229,199,107,0.22)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {[
        [30, 10],
        [66, 26],
        [96, 54],
        [114, 88],
      ].map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r="1.8" fill="rgba(229,199,107,0.55)" />
      ))}
    </svg>
  );
}

/**
 * THE OPENING — "the assay ring".
 *
 * A burgundy field, the way a piece is presented in its box, with one gold ring
 * at the centre of it. A bright arc runs that ring without stopping, a finer
 * ring of dashes turns against it, the mark is struck into the middle by a
 * travelling edge of light, and gold dust lifts off the floor of the frame the
 * whole time.
 *
 * Every one of those is a CSS keyframe rather than a library animation — see
 * the note over the keyframes in `index.css`. The app sets the motion library
 * to honour the system's "reduce motion" flag, which is correct for the
 * interface but would leave this screen a still photograph on any machine with
 * animations switched off. Keyframes run regardless, and the media query at
 * the foot of that block gives anyone who has asked for less a short, quiet
 * version instead of a dead one.
 *
 * Tap anywhere to skip.
 */
export default function SplashScreen({ onDone }: SplashScreenProps) {
  const fired = useRef(false);
  const done = useRef(onDone);

  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  const finish = () => {
    if (fired.current) return;
    fired.current = true;
    done.current();
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (fired.current) return;
      fired.current = true;
      done.current();
    }, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ScreenTransition className="isolate overflow-hidden">
      {/* The field */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 34%, #7A2530 0%, #5A171F 42%, #3E0E15 74%, #2C070C 100%)",
        }}
      />
      <span aria-hidden className="grain absolute inset-0 opacity-[0.09]" />

      <button
        type="button"
        onClick={finish}
        aria-label="Skip intro"
        className="absolute inset-0 z-50 h-full w-full cursor-default"
      />

      {/* Dust off the floor */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
        {DUST.map((speck, index) => (
          <span
            key={index}
            className="splash-anim absolute bottom-0 rounded-full"
            style={{
              ...anim("splash-rise", speck.duration, speck.delay, "infinite", "cubic-bezier(0.4, 0, 0.5, 1)"),
              left: `${speck.x}%`,
              width: speck.size,
              height: speck.size,
              background: "rgba(248,232,178,0.95)",
              boxShadow: "0 0 10px rgba(229,199,107,0.9)",
            }}
          />
        ))}
      </div>

      {/* Filigree in the upper corners */}
      <div
        aria-hidden
        className="splash-anim pointer-events-none absolute left-0 top-0 h-[128px] w-[128px] sm:h-[168px] sm:w-[168px]"
        style={anim("splash-lift", 0.9, 0.15)}
      >
        <Filigree className="h-full w-full" />
      </div>
      <div
        aria-hidden
        className="splash-anim pointer-events-none absolute right-0 top-0 h-[128px] w-[128px] -scale-x-100 sm:h-[168px] sm:w-[168px]"
        style={anim("splash-lift", 0.9, 0.25)}
      >
        <Filigree className="h-full w-full" />
      </div>

      {/* ---------------------------------------------------------- the ring */}

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        <div
          className="splash-anim relative flex items-center justify-center"
          style={{
            ...anim("splash-enter", 0.85, 0.05),
            width: "clamp(232px,66vw,290px)",
            height: "clamp(232px,66vw,290px)",
          }}
        >
          {/* Halo behind everything */}
          <span
            aria-hidden
            className="splash-anim absolute inset-[-18%] rounded-full"
            style={{
              ...anim("splash-halo", 2.4, 0.3, "infinite", "ease-in-out"),
              background:
                "radial-gradient(circle, rgba(229,199,107,0.28) 0%, rgba(229,199,107,0.06) 46%, rgba(229,199,107,0) 72%)",
            }}
          />

          {/* Fine dashes, turning slowly against the arc */}
          <svg
            aria-hidden
            viewBox="0 0 240 240"
            fill="none"
            className="splash-anim absolute inset-0 h-full w-full"
            style={anim("splash-spin-back", 9, 0, "infinite", "linear")}
          >
            <circle
              cx="120"
              cy="120"
              r="112"
              stroke="rgba(229,199,107,0.42)"
              strokeWidth="1"
              strokeDasharray="2 10"
            />
          </svg>

          {/* The ring itself, and the arc running it */}
          <svg aria-hidden viewBox="0 0 240 240" fill="none" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="assay-arc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff6db" />
                <stop offset="45%" stopColor="#e5c76b" />
                <stop offset="100%" stopColor="rgba(212,175,55,0)" />
              </linearGradient>
            </defs>
            <circle cx="120" cy="120" r="98" stroke="rgba(229,199,107,0.3)" strokeWidth="1.2" />
          </svg>

          <svg
            aria-hidden
            viewBox="0 0 240 240"
            fill="none"
            className="splash-anim absolute inset-0 h-full w-full"
            style={anim("splash-spin", 1.9, 0, "infinite", "linear")}
          >
            {/* A 150px stroke on a ~616px circumference: a quarter of the ring */}
            <circle
              cx="120"
              cy="120"
              r="98"
              stroke="url(#assay-arc)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray="150 466"
            />
          </svg>

          {/* The head of the arc, a bright bead on the ring */}
          <div
            aria-hidden
            className="splash-anim absolute inset-0"
            style={anim("splash-spin", 1.9, 0, "infinite", "linear")}
          >
            <span
              className="absolute left-1/2 rounded-full"
              /* The ring is r=98 in a 240 viewBox: 40.83% of the box from the
                 centre, so the bead rides it at 9.17% from the top. */
              style={{
                top: "9.17%",
                width: 7,
                height: 7,
                marginLeft: -3.5,
                marginTop: -3.5,
                background: "#fff8e6",
                boxShadow: "0 0 16px rgba(255,246,219,1), 0 0 30px rgba(229,199,107,0.8)",
              }}
            />
          </div>

          {/* ------------------------------------------------------- the mark */}

          <div className="relative flex flex-col items-center">
            <div className="relative inline-block">
              <div
                className="splash-anim overflow-hidden"
                style={anim("splash-strike", 0.9, 0.5)}
              >
                <BrandLogo
                  variant="lockup"
                  tone="light"
                  sizeClass="w-[clamp(156px,42vw,196px)]"
                  width={196}
                  shared
                />

                {/*
                  The repeating band of light lives inside the wipe's box,
                  which is the only element here that clips — outside it the
                  band would run on past the lockup across bare burgundy.
                */}
                <span
                  aria-hidden
                  className="splash-anim pointer-events-none absolute inset-y-0 w-1/4"
                  style={{
                    ...anim("splash-shine", 2.2, 1.5, "infinite", "cubic-bezier(0.4, 0, 0.2, 1)"),
                    background:
                      "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,250,232,0.38) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </div>

              {/* The edge doing the striking, carried across on a transform */}
              <span
                aria-hidden
                className="splash-anim pointer-events-none absolute inset-x-0 -inset-y-3"
                style={anim("splash-edge", 0.9, 0.5)}
              >
                <span
                  className="absolute inset-y-0 right-0 w-[2px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(229,199,107,0) 0%, rgba(255,250,235,1) 50%, rgba(229,199,107,0) 100%)",
                    boxShadow: "0 0 18px rgba(255,246,219,0.95)",
                  }}
                />
              </span>

            </div>

            {/*
              Hung below the lockup rather than stacked in flow, so the lockup
              alone sits on the ring's centre and the rule does not push it up.
            */}
            <span
              aria-hidden
              className="splash-anim gold-fill absolute left-1/2 top-full mt-4 block h-px w-[86px] -translate-x-1/2 origin-center rounded-full"
              style={anim("splash-fill", 0.7, 1.15)}
            />
          </div>
        </div>

        {/* --------------------------------------------------------- the foot */}

        <div
          className="splash-anim mt-8 flex items-center gap-3"
          style={anim("splash-lift", 0.6, 1.25)}
        >
          <span aria-hidden className="h-px w-7 bg-[rgba(229,199,107,0.7)]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.34em] text-gold-300">
            Est. Kochi
          </span>
          <span aria-hidden className="h-px w-7 bg-[rgba(229,199,107,0.7)]" />
        </div>

        <p
          className="splash-anim mt-4 max-w-[34ch] text-center text-[12.5px] leading-snug text-gold-200/85"
          style={anim("splash-lift", 0.6, 1.45)}
        >
          Gold held with trust, since the first instalment.
        </p>

        <div className="absolute bottom-[clamp(44px,9vh,80px)] flex flex-col items-center gap-3">
          <div className="relative h-[2px] w-[clamp(120px,36vw,160px)] overflow-hidden rounded-full bg-[rgba(229,199,107,0.2)]">
            <span
              className="splash-anim gold-fill absolute inset-y-0 left-0 w-full origin-left"
              style={anim("splash-fill", HOLD_MS / 1000 - 0.2, 0.15, 1, "linear")}
            />
          </div>

          <span
            className="splash-anim text-[9.5px] font-medium uppercase tracking-[0.34em] text-gold-200/60"
            style={anim("splash-glint", 1.6, 0.9, "infinite", "ease-in-out")}
          >
            Opening your vault
          </span>
        </div>
      </div>
    </ScreenTransition>
  );
}
