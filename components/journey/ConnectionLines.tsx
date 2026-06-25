'use client';

/**
 * ConnectionLines — a decorative network of players that draws itself when the
 * Community section scrolls into view: links animate via pathLength, nodes fade
 * and pulse in. Purely ambient (pointer-events-none); reduced-motion users get
 * the finished network with no drawing animation.
 */

import { motion, useReducedMotion } from 'framer-motion';

const NODES = [
  { id: 'hub', x: 400, y: 90, r: 7, hub: true },
  { id: 'n1', x: 120, y: 40, r: 4 },
  { id: 'n2', x: 250, y: 130, r: 5 },
  { id: 'n3', x: 560, y: 40, r: 5 },
  { id: 'n4', x: 680, y: 120, r: 4 },
  { id: 'n5', x: 110, y: 140, r: 4 },
  { id: 'n6', x: 640, y: 60, r: 3 },
  { id: 'n7', x: 330, y: 30, r: 3 },
];

const LINKS: Array<[string, string]> = [
  ['hub', 'n1'],
  ['hub', 'n2'],
  ['hub', 'n3'],
  ['hub', 'n4'],
  ['hub', 'n7'],
  ['n2', 'n5'],
  ['n3', 'n6'],
  ['n1', 'n7'],
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;
const EASE = [0.16, 1, 0.3, 1] as const;

export function ConnectionLines({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 800 180"
      fill="none"
      className={['pointer-events-none w-full', className].filter(Boolean).join(' ')}
    >
      <defs>
        <linearGradient id="cl-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22e0ff" />
          <stop offset="50%" stopColor="#9ef01a" />
          <stop offset="100%" stopColor="#b14dff" />
        </linearGradient>
        <radialGradient id="cl-hub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22e0ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22e0ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {LINKS.map(([a, b], i) => {
        const na = byId(a);
        const nb = byId(b);
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke="url(#cl-stroke)"
            strokeWidth={1.2}
            strokeOpacity={0.5}
            initial={reduce ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.5 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.15 + i * 0.08 }}
          />
        );
      })}

      {NODES.map((n, i) => (
        <g key={n.id}>
          {n.hub && <circle cx={n.x} cy={n.y} r={26} fill="url(#cl-hub)" />}
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.hub ? '#22e0ff' : '#ffffff'}
            fillOpacity={n.hub ? 1 : 0.75}
            initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.3 + i * 0.07 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        </g>
      ))}
    </svg>
  );
}
