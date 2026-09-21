import { motion, useReducedMotion } from "framer-motion";
import { useId, useMemo } from "react";
import { ease } from "../lib/motion";

const WIDTH = 320;
const HEIGHT = 96;
const PAD = 8;

interface GoldRateChartProps {
  /** Normalised 0-1 samples, oldest first. */
  samples: number[];
  /** Redraws the curve when the selected option changes. */
  seriesKey?: string;
  className?: string;
}

/** Smooth path through the samples, plus the area beneath it. */
function usePath(samples: number[]) {
  return useMemo(() => {
    const step = WIDTH / (samples.length - 1);
    const points = samples.map((value, index) => ({
      x: index * step,
      y: HEIGHT - PAD - value * (HEIGHT - PAD * 2),
    }));

    let line = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;
      line += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }

    return { line, area: `${line} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`, last: points[points.length - 1] };
  }, [samples]);
}

/**
 * The movement curve. Gold ink on cream, three whisper-thin guides and a
 * pulsing marker at the latest print — enough to read a trend, nothing of the
 * trading terminal about it.
 */
export default function GoldRateChart({ samples, seriesKey = "", className = "" }: GoldRateChartProps) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/[:]/g, "");
  const { line, area, last } = usePath(samples);

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={`line-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c9a13a" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#c9962a" />
            <stop offset="100%" stopColor="#8a6a1f" />
          </linearGradient>
          <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Guides — barely visible, just enough to give the curve a floor */}
        {[0.25, 0.55, 0.85].map((t) => (
          <line
            key={t}
            x1="0"
            x2={WIDTH}
            y1={HEIGHT * t}
            y2={HEIGHT * t}
            stroke="rgba(176,141,40,0.14)"
            strokeWidth="0.75"
            strokeDasharray="3 6"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <motion.path
          key={`area-${seriesKey}`}
          d={area}
          fill={`url(#area-${uid})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: ease.silk }}
        />
        <motion.path
          key={`line-${seriesKey}`}
          d={line}
          stroke={`url(#line-${uid})`}
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: ease.silk }}
        />
      </svg>

      {/* Latest print */}
      <motion.span
        aria-hidden
        className="absolute h-2 w-2 rounded-full bg-gold-500"
        style={{
          left: `${(last.x / WIDTH) * 100}%`,
          top: `${(last.y / HEIGHT) * 100}%`,
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: "0 0 0 4px rgba(212,175,55,0.2)",
        }}
        animate={reduced ? undefined : { scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
