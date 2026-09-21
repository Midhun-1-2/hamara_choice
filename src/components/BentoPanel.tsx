import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useTilt } from "../hooks/useTilt";
import { dealIn } from "../lib/motion";

interface BentoPanelProps {
  children: ReactNode;
  /** Grid placement classes for the desktop bento. */
  className?: string;
  /** Off for panels whose own content already leans, like the promo photo. */
  tilt?: boolean;
}

/**
 * One cell of the dashboard bento. Deals itself in on mount, then leans
 * towards the cursor while the pointer is over it. The tilt lives on this
 * wrapper so the card inside keeps its own hover and press behaviour.
 */
export default function BentoPanel({ children, className = "", tilt = true }: BentoPanelProps) {
  const { ref, handlers, style } = useTilt({ max: 4.5, lift: 12 });

  return (
    <motion.div
      ref={ref}
      variants={dealIn}
      className={`min-w-0 ${className}`}
      {...(tilt ? handlers : {})}
      style={tilt ? style : undefined}
    >
      {children}
    </motion.div>
  );
}
