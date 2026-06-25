'use client';

/**
 * JourneyBall — the "Match Journey" guide.
 *
 * A single ambient neon orb, fixed over the page, whose position is linked to
 * scroll progress (spring-smoothed so it glides rather than snaps). It weaves
 * in a gentle S-curve, descends slowly as the story progresses, shifts colour
 * cyan -> lime -> purple, dims through the middle of sections and blooms at the
 * hero (start) and the final CTA (arrival). There is no rail and no progress
 * UI — it reads as a living accent, not a tracker.
 *
 * Honours prefers-reduced-motion: falls back to a single static soft glow.
 */

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';

export function JourneyBall() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Smooth the raw scroll progress so the orb glides (Linear/Vercel feel).
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.6 });

  // Horizontal weave (S-curve) and slow descent, expressed in viewport units.
  const x = useTransform(p, [0, 0.2, 0.4, 0.6, 0.8, 1], ['52vw', '30vw', '64vw', '34vw', '60vw', '50vw']);
  const y = useTransform(p, [0, 1], ['22vh', '78vh']);

  // Colour journey + glow.
  const color = useTransform(p, [0, 0.5, 1], ['#22e0ff', '#9ef01a', '#b14dff']);
  const glow = useMotionTemplate`0 0 60px 14px ${color}`;

  // Bloom brighter at the very start (hero intro) and the very end (CTA arrival),
  // softer while travelling through the middle of the page.
  const opacity = useTransform(p, [0, 0.05, 0.5, 0.95, 1], [0, 0.85, 0.42, 0.8, 1]);
  const scale = useTransform(p, [0, 0.05, 0.5, 0.92, 1], [0.6, 1, 0.92, 1.05, 1.7]);

  if (reduce) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30 hidden md:block">
        <div
          className="absolute left-1/2 top-[30vh] h-3 w-3 -translate-x-1/2 rounded-full"
          style={{ background: '#22e0ff', boxShadow: '0 0 50px 12px rgba(34,224,255,0.5)' }}
        />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <motion.div className="absolute left-0 top-0" style={{ x, y, opacity, scale }}>
        {/* translate the orb onto its own anchor point */}
        <div className="-translate-x-1/2 -translate-y-1/2">
          {/* idle float for a touch of life */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* outer halo */}
            <motion.div
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ backgroundColor: color, opacity: 0.18 }}
            />
            {/* core */}
            <motion.div
              className="relative h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: color, boxShadow: glow }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
