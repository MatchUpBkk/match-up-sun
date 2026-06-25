/**
 * Shared motion tokens — one easing + timing language across the whole page so
 * the experience feels cohesive and intentional (the Linear/Stripe signature).
 * "Less animation, better animation": restrained durations, an effortless ease.
 */

// Expo-out: starts with confidence, settles softly. The "expensive" curve.
export const EASE = [0.16, 1, 0.3, 1] as const;

export const DUR = {
  fast: 0.5,
  base: 0.8,
  slow: 1.1,
} as const;

// A calm spring used for hover/tilt interactions.
export const SPRING = { type: 'spring', stiffness: 180, damping: 22, mass: 0.6 } as const;
