import { SwitchLayoutGroupContext, motion } from "framer-motion";
import { keepFollower, layout, spring } from "../lib/motion";

/**
 * Supplied artwork, served from `public/brand`. Two tones of the same lockup:
 * `ink` is the original dark-brown-and-gold rendering that holds on cream and
 * pearl, `light` swaps the brown type for cream so it reads on burgundy panels.
 */
const sources = {
  ink: {
    lockup: "/brand/hamarachoice-logo-ink.png",
    mark: "/brand/hamarachoice-mark-ink.png",
    wordmark: "/brand/hamarachoice-wordmark-ink.png",
  },
  light: {
    lockup: "/brand/hamarachoice-logo.png",
    mark: "/brand/hamarachoice-mark.png",
    wordmark: "/brand/hamarachoice-wordmark.png",
  },
} as const;

type Variant = keyof (typeof sources)["ink"];
type Tone = keyof typeof sources;

interface BrandLogoProps {
  variant?: Variant;
  /** `ink` for pale surfaces, `light` for burgundy ones. */
  tone?: Tone;
  /** Rendered width of the artwork in pixels. */
  width?: number;
  /**
   * Responsive width classes, e.g. `w-[150px] lg:w-[200px]`. Prefer this over a
   * scale utility: shared-layout elements carry an inline transform from
   * Framer, which would override any `scale-*` class.
   */
  sizeClass?: string;
  /** Participates in the shared-element transition between screens. */
  shared?: boolean;
  className?: string;
}

const ALT = "Hamara Choice";

export default function BrandLogo({
  variant = "lockup",
  tone = "ink",
  width = 190,
  sizeClass,
  shared = false,
  className = "",
}: BrandLogoProps) {
  const image = (
    <img
      src={sources[tone][variant]}
      alt={ALT}
      width={width}
      style={sizeClass ? { height: "auto" } : { width, height: "auto" }}
      className={`block select-none ${sizeClass ?? ""}`}
      draggable={false}
      /*
        Decoded before the frame that first shows it. A fresh <img> is
        otherwise decoded off-thread and can miss its first paint — on a phone
        that is a frame with no logo, right as the previous screen's copy goes.
      */
      decoding="sync"
      loading="eager"
    />
  );

  if (!shared) {
    return <div className={className}>{image}</div>;
  }

  /* See `keepFollower`: the outgoing logo stays put until its screen leaves. */
  return (
    <SwitchLayoutGroupContext.Provider value={keepFollower}>
      <motion.div
        layoutId={layout.logo}
        transition={spring.screen}
        className={className}
      >
        {image}
      </motion.div>
    </SwitchLayoutGroupContext.Provider>
  );
}
