'use client';

/**
 * TextReveal — a premium masked headline reveal: each word rises out of an
 * overflow-hidden mask with a soft blur-clear, lightly staggered. Used for the
 * hero headline. Per-word className is preserved so existing gradient styling
 * stays intact. Static for reduced-motion users.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { EASE } from './tokens';

type Segment = { text: string; className?: string };

export function TextReveal({
  segments,
  className,
  delay = 0,
  stagger = 0.12,
}: {
  segments: Segment[];
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const word: Variants = {
    hidden: reduce ? { opacity: 0 } : { y: '115%', opacity: 0, filter: 'blur(10px)' },
    show: reduce
      ? { opacity: 1, transition: { duration: 0.5 } }
      : { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'inline-block' }}
    >
      {segments.map((s, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em' }}
        >
          <motion.span variants={word} className={s.className} style={{ display: 'inline-block' }}>
            {s.text}
          </motion.span>
          {i < segments.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </motion.span>
  );
}
