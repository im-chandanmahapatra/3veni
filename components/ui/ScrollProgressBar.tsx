'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

/**
 * Refined 2.5px terracotta scroll progress indicator pinned to the top edge of the viewport.
 */
export default function ScrollProgressBar() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-[60] h-[2.5px] bg-[#24221E]/10 pointer-events-none"
    >
      <motion.div
        data-testid="scroll-progress-bar"
        className="h-full w-full origin-left bg-gradient-to-r from-[#98400F] via-[#B44F17] to-[#C49A50]"
        style={{
          scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress,
        }}
      />
    </div>
  );
}
