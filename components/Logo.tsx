import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, size = 40, withWordmark = true }: { className?: string; size?: number; withWordmark?: boolean }) {
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-3', className)} aria-label="Match Up BKK — Home">
      <span
        className="relative inline-block shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image src="/brand/logo-256.png" alt="Match Up BKK" fill sizes={`${size}px`} priority className="object-contain drop-shadow-[0_0_12px_rgba(34,224,255,0.35)]" />
      </span>
      {withWordmark && (
        <span className="hidden flex-col leading-none sm:flex">
          <span className="text-base font-extrabold tracking-tight text-white">
            MATCH UP <span className="text-gradient">BKK</span>
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/45">
            Play · Connect · Compete
          </span>
        </span>
      )}
    </Link>
  );
}
