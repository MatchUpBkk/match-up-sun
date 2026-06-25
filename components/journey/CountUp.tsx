'use client';

/**
 * CountUp — animates a number from 0 to its target the first time it scrolls
 * into view. Parses values like "4,800+", "320+", "12" so the prefix/suffix and
 * thousands separators are preserved. Static for reduced-motion users.
 */

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';

function parse(value: string) {
  const match = value.match(/^([^\d-]*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: '', target: 0, suffix: value, decimals: 0, hasSep: false };
  const prefix = match[1] ?? '';
  const raw = match[2] ?? '0';
  const suffix = match[3] ?? '';
  const hasSep = raw.includes(',');
  const decimals = raw.includes('.') ? (raw.split('.')[1]?.length ?? 0) : 0;
  const numeric = parseFloat(raw.replace(/,/g, ''));
  return { prefix, target: Number.isNaN(numeric) ? 0 : numeric, suffix, decimals, hasSep };
}

function format(n: number, decimals: number, hasSep: boolean) {
  const fixed = n.toFixed(decimals);
  if (!hasSep) return fixed;
  const [int, dec] = fixed.split('.');
  const withSep = (int ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec ? `${withSep}.${dec}` : withSep;
}

export function CountUp({
  value,
  className,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const { prefix, target, suffix, decimals, hasSep } = parse(value);
  const [display, setDisplay] = useState(`${prefix}${format(0, decimals, hasSep)}${suffix}`);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest: number) => setDisplay(`${prefix}${format(latest, decimals, hasSep)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, target, duration, prefix, suffix, decimals, hasSep, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
