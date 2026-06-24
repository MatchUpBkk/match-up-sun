'use client';

import Link from 'next/link';
import { IconBall } from '@/components/Icons';

export default function NotFound() {
  return (
    <div className="container-x flex min-h-screen flex-col items-center justify-center py-28 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-neon-cyan/10 text-neon-cyan ring-1 ring-neon-cyan/30">
        <IconBall className="h-10 w-10" />
      </span>
      <h1 className="mt-8 text-6xl font-extrabold text-gradient">404</h1>
      <p className="mt-3 max-w-sm text-white/55">This page is offside. Let’s get you back in the game.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
        <Link href="/events" className="btn btn-secondary">
          Find a Match
        </Link>
      </div>
    </div>
  );
}
