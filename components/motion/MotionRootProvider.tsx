'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';

export default function MotionRootProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
