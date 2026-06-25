'use client';

/**
 * Shared Framer Motion reveal primitives for the "Match Journey" experience.
 * All of these respect `prefers-reduced-motion` (they render their final,
 * static state when the user opts out of motion) and animate only transform +
 * opacity so they stay GPU-cheap and never trigger layout.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

type Direction = 'up' | 'down' | 'left' | 'right';

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance };
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: distance, y: 0 };
    case 'right':
      return { x: -distance, y: 0 };
    default:
      return { x: 0, y: distance };
  }
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 26,
  className,
  amount = 0.3,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  distance?: number;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const from = offsetFor(direction, distance);

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, ...from }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: EASE, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container that staggers its <StaggerItem> children as the group scrolls in.
 */
export function StaggerGroup({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0.05,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
}) {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  direction = 'up',
  distance = 28,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const from = offsetFor(direction, distance);

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, ...from },
    show: reduce
      ? { opacity: 1, transition: { duration: 0.4 } }
      : { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
