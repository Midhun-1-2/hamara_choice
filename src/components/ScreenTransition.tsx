import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { PERSPECTIVE, screenVariants } from "../lib/motion";

interface ScreenTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Screens stack absolutely so an outgoing and incoming screen can overlap,
 * which is what lets the shared logo morph between them.
 */
export default function ScreenTransition({ children, className = "" }: ScreenTransitionProps) {
  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ transformPerspective: PERSPECTIVE }}
      className={`absolute inset-0 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
