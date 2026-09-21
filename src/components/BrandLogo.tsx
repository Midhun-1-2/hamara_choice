import { motion } from "framer-motion";
import { layout, spring } from "../lib/motion";

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
    />
  );

  if (!shared) {
    return <div className={className}>{image}</div>;
  }

  /*
    `layoutCrossfade={false}`: by default the incoming shared element fades in
    over the whole morph — with `spring.screen` that is well over a second in
    which the arriving screen shows no logo, because the outgoing screen (and
    the logo it carried) has already exited. Held at full opacity, the mark is
    on screen from the first frame and only its position travels.
  */
  return (
    <motion.div
      layoutId={layout.logo}
      layoutCrossfade={false}
      transition={spring.screen}
      className={className}
    >
      {image}
    </motion.div>
  );
}
