'use client';

/**
 * CinematicCard — a restrained, premium hover for the featured cards on the
 * landing page only. The card subtly tilts toward the cursor with a spring,
 * lifts on hover, and a soft neon highlight tracks the pointer. Reduced-motion
 * users get a clean static card with a gentle hover lift via the child styles.
 *
 * It wraps content, so the underlying EventCard is untouched and the /events
 * page is unaffected.
 */

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import type { ReactNode } from 'react';
import { SPRING } from './tokens';

export function CinematicCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // pointer position within the card (0..1)
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  // tilt (degrees) — small, so it reads as depth not a gimmick
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), SPRING);

  // glow follows the cursor
  const gx = useTransform(px, [0, 1], ['0%', '100%']);
  const gy = useTransform(py, [0, 1], ['0%', '100%']);
  const glow = useMotionTemplate`radial-gradient(180px circle at ${gx} ${gy}, rgba(34,224,255,0.18), transparent 65%)`;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
    setHovered(false);
  }

  if (reduce) {
    return (
      <div className={['transition-transform duration-300 hover:-translate-y-1', className].filter(Boolean).join(' ')}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      animate={{ y: hovered ? -6 : 0, scale: hovered ? 1.02 : 1 }}
      transition={SPRING}
      className={['group/cc relative [transform-style:preserve-3d]', className].filter(Boolean).join(' ')}
    >
      {/* pointer-tracking highlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/cc:opacity-100"
        style={{ background: glow }}
      />
      {/* soft border glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 ring-1 ring-neon-cyan/40 transition-opacity duration-300 group-hover/cc:opacity-100"
        style={{ boxShadow: '0 18px 50px -20px rgba(34,224,255,0.45)' }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
