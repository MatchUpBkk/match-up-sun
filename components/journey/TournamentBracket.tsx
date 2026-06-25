'use client';

/**
 * TournamentBracket — a bracket that draws itself when scrolled into view.
 * Structural connectors stroke in left-to-right via pathLength; the winning
 * route is drawn last in a brighter gradient with a travelling shimmer and a
 * glowing champion node. Reduced-motion users see the finished bracket.
 */

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

// node coordinates (viewBox 0 0 560 280)
const SEEDS = [
  { x: 50, y: 40 },
  { x: 50, y: 110 },
  { x: 50, y: 170 },
  { x: 50, y: 240 },
];
const SEMIS = [
  { x: 250, y: 75 },
  { x: 250, y: 205 },
];
const FINAL = { x: 420, y: 140 };
const CHAMP = { x: 510, y: 140 };

/** elbow connector: horizontal out, vertical join, horizontal in */
function elbow(s: { x: number; y: number }, t: { x: number; y: number }) {
  const mid = (s.x + t.x) / 2;
  return `M ${s.x} ${s.y} H ${mid} V ${t.y} H ${t.x}`;
}

const STRUCTURAL = [
  elbow(SEEDS[0]!, SEMIS[0]!),
  elbow(SEEDS[1]!, SEMIS[0]!),
  elbow(SEEDS[2]!, SEMIS[1]!),
  elbow(SEEDS[3]!, SEMIS[1]!),
  elbow(SEMIS[0]!, FINAL),
  elbow(SEMIS[1]!, FINAL),
  `M ${FINAL.x} ${FINAL.y} H ${CHAMP.x}`,
];

// winner route: seed #2 -> semi #1 -> final -> champion
const WINNER = `${elbow(SEEDS[1]!, SEMIS[0]!)} ${elbow(SEMIS[0]!, FINAL)} M ${FINAL.x} ${FINAL.y} H ${CHAMP.x}`;

const NODES = [...SEEDS, ...SEMIS, FINAL];

export function TournamentBracket({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 560 280"
      fill="none"
      className={['w-full', className].filter(Boolean).join(' ')}
    >
      <defs>
        <linearGradient id="tb-win" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22e0ff" />
          <stop offset="55%" stopColor="#9ef01a" />
          <stop offset="100%" stopColor="#b14dff" />
        </linearGradient>
        <radialGradient id="tb-champ" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9ef01a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9ef01a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* structural connectors */}
      {STRUCTURAL.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={1.4}
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : i * 0.12 }}
        />
      ))}

      {/* winner path (drawn last, glowing) */}
      <motion.path
        d={WINNER}
        stroke="url(#tb-win)"
        strokeWidth={2.6}
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 6px rgba(158,240,26,0.7))' }}
        initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: EASE, delay: reduce ? 0 : 0.9 }}
      />

      {/* travelling shimmer along the winner path */}
      {!reduce && (
        <motion.path
          d={WINNER}
          stroke="#ffffff"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeDasharray="6 220"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 0.9, 0], strokeDashoffset: [0, -226] }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, ease: 'easeInOut', delay: 2 }}
        />
      )}

      {/* nodes */}
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={4}
          fill="#ffffff"
          fillOpacity={0.8}
          initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.3 + i * 0.08 }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}

      {/* champion node */}
      <circle cx={CHAMP.x} cy={CHAMP.y} r={26} fill="url(#tb-champ)" />
      <motion.circle
        cx={CHAMP.x}
        cy={CHAMP.y}
        r={7}
        fill="#9ef01a"
        style={{ filter: 'drop-shadow(0 0 10px rgba(158,240,26,0.9))', transformOrigin: `${CHAMP.x}px ${CHAMP.y}px` }}
        initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : 1.9 }}
      />

      {/* champion impact bloom — a single energy ring as the winner lands */}
      {!reduce && (
        <motion.circle
          cx={CHAMP.x}
          cy={CHAMP.y}
          r={7}
          fill="none"
          stroke="#9ef01a"
          strokeWidth={2}
          initial={{ scale: 0.2, opacity: 0 }}
          whileInView={{ scale: [0.2, 3.2], opacity: [0.9, 0] }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 2.1 }}
          style={{ transformOrigin: `${CHAMP.x}px ${CHAMP.y}px` }}
        />
      )}
    </svg>
  );
}
