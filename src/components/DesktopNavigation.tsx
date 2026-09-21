import { motion, useReducedMotion } from "framer-motion";
import { LogOut } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { navItems } from "../lib/nav";
import type { NavKey } from "../lib/nav";
import { houseLine } from "../data/mock";
import { spring } from "../lib/motion";

interface DesktopNavigationProps {
  active: NavKey;
  onChange: (key: NavKey) => void;
  onSignOut: () => void;
  /** Only one logo may claim the shared layoutId at a time. */
  showLogo?: boolean;
}

/** A sprig of gold leaf, the way the printed brand furniture uses it. */
function LeafMotif() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 150"
      fill="none"
      className="pointer-events-none absolute -left-3 bottom-28 h-[170px] w-[136px] opacity-[0.22]"
    >
      <path
        d="M60 146 C 60 104, 52 66, 30 34"
        stroke="rgba(229,199,107,0.7)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {[
        [58, 118, 22, 12],
        [54, 98, -24, -10],
        [49, 80, 20, 10],
        [43, 62, -20, -9],
        [37, 47, 16, 8],
      ].map(([x, y, dx, dy], i) => (
        <path
          key={i}
          d={`M${x} ${y} C ${x + dx * 0.5} ${y + dy - 10}, ${x + dx} ${y + dy - 4}, ${x + dx} ${y + dy + 4} C ${x + dx * 0.6} ${y + dy + 8}, ${x + dx * 0.2} ${y + 4}, ${x} ${y} Z`}
          fill="rgba(229,199,107,0.28)"
          stroke="rgba(229,199,107,0.5)"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

/**
 * The desktop rail, in the house burgundy. The app is otherwise pale, so the
 * rail is what anchors it — a burgundy card floating on the set, with the
 * brand in gold at its head and a gold plate marking the current section.
 */
export default function DesktopNavigation({
  active,
  onChange,
  onSignOut,
  showLogo = true,
}: DesktopNavigationProps) {
  const reduced = useReducedMotion();

  return (
    <div className="hidden h-full py-4 pl-4 lg:block xl:py-5 xl:pl-5">
      <aside
        className="relative flex h-full flex-col overflow-hidden rounded-[26px] px-5 py-8 xl:px-6"
        style={{
          background: "linear-gradient(168deg, #71222A 0%, #4E131A 48%, #380C12 100%)",
          border: "1px solid rgba(212,175,55,0.38)",
          boxShadow:
            "0 30px 60px -28px rgba(46,10,16,0.75), inset 0 1px 0 rgba(255,246,224,0.16)",
        }}
      >
        {/* Warm light falling in at the top, the way it does on the set */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(229,199,107,0.22) 0%, rgba(229,199,107,0) 70%)",
            filter: "blur(18px)",
          }}
          animate={reduced ? undefined : { opacity: [0.5, 1, 0.5], scale: [0.95, 1.06, 0.95] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <span aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.06]" />

        <LeafMotif />

        {/*
          Centred both ways. The lockup is a fixed 152px inside a rail about
          220px wide, so left-aligned it sat well off the rail's axis. Pinned
          flush to the top edge it also read as a letterhead rather than a
          mark set apart — a `clamp` height gives it a header zone of its own
          to sit in the middle of, capped so a short window never pushes the
          nav list or the footer out of the rail.
        */}
        <div
          className="relative z-10 flex items-center justify-center px-1"
          style={{ height: "clamp(160px,26vh,280px)" }}
        >
          {showLogo && <BrandLogo variant="lockup" tone="light" width={198} shared />}
        </div>

        <nav aria-label="Primary" className="relative z-10 mt-4 flex flex-col gap-1.5">
          {navItems.map(({ key, label, icon: Icon }) => {
            const isActive = key === active;

            return (
              <motion.button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? "page" : undefined}
                whileHover={reduced || isActive ? undefined : { x: 4 }}
                whileTap={reduced ? undefined : { scale: 0.985 }}
                transition={spring.hover}
                className="group relative isolate flex items-center gap-3.5 rounded-2xl px-4 py-3 text-left"
              >
                {isActive ? (
                  <motion.span
                    layoutId="rail-active"
                    aria-hidden
                    className="gold-fill absolute inset-0 -z-10 rounded-2xl"
                    style={{
                      boxShadow:
                        "0 14px 30px -14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.55)",
                    }}
                    transition={spring.soft}
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-2xl transition-colors duration-300 group-hover:bg-[rgba(255,246,224,0.09)]"
                  />
                )}

                <Icon
                  size={17}
                  strokeWidth={isActive ? 2 : 1.6}
                  className={`shrink-0 transition-colors duration-400 ${
                    isActive ? "text-wine-900" : "text-gold-300/80 group-hover:text-gold-200"
                  }`}
                />
                <span
                  className={`text-[13px] font-medium transition-colors duration-400 ${
                    isActive ? "text-wine-900" : "text-gold-100/85 group-hover:text-gold-100"
                  }`}
                >
                  {label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        <div className="relative z-10 mt-auto pt-8">
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[12.5px] font-medium text-gold-200/85 transition-colors duration-300 hover:bg-[rgba(255,246,224,0.1)] hover:text-gold-100"
            style={{ border: "1px solid rgba(212,175,55,0.35)" }}
          >
            <LogOut size={15} strokeWidth={1.7} />
            Sign out
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[11px] font-medium tracking-luxe-sm uppercase text-gold-300/70">
            {houseLine.map((word, index) => (
              <span key={word} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-gold-400">·</span>}
                {word}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
