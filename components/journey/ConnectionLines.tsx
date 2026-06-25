'use client';

/**
 * ConnectionLines — a quiet, network-inspired motif for the Community section.
 * Links draw themselves once on view, then a slow pulse flows outward along the
 * main spokes and the hub gently breathes — enough to feel alive, never busy.
 * Purely decorative (pointer-events-none); static for reduced-motion users.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './tokens';

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

const LINKS: Array<[string, string, boolean]> = [
  // [from, to, isSpoke]
  ['hub', 'n1', true],
  ['hub', 'n2', true],
  ['hub', 'n3', true],
  ['hub', 'n4', true],
  ['hub', 'n7', true],
  ['n2', 'n5', false],
  ['n3', 'n6', false],
  ['n1', 'n7', false],
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

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

      {LINKS.map(([a, b, spoke], i) => {
        const na = byId(a);
        const nb = byId(b);
        return (
          <g key={`${a}-${b}`}>
            <motion.line
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="url(#cl-stroke)"
              strokeWidth={1.2}
              strokeOpacity={0.45}
              initial={reduce ? { pathLength: 1, opacity: 0.45 } : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.45 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.1 + i * 0.07 }}
            />
            {/* slow flowing pulse along the main spokes */}
            {spoke && !reduce && (
              <motion.line
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="#ffffff"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeDasharray="3 180"
                initial={{ opacity: 0, strokeDashoffset: 0 }}
                whileInView={{ opacity: [0, 0.7, 0], strokeDashoffset: [0, -183] }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.6, delay: 1 + i * 0.25 }}
              />
            )}
          </g>
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
            fillOpacity={n.hub ? 1 : 0.7}
            initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            whileInView={
              reduce
                ? { scale: 1, opacity: 1 }
                : n.hub
                  ? { scale: [1, 1.18, 1], opacity: 1 }
                  : { scale: 1, opacity: 1 }
            }
            viewport={{ once: true, amount: 0.4 }}
            transition={
              n.hub && !reduce
                ? { scale: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }, opacity: { duration: 0.5, delay: 0.3 } }
                : { duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.3 + i * 0.06 }
            }
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        </g>
      ))}
    </svg>
  );
}
