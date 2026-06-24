import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
  approved: 'border-neon-lime/40 bg-neon-lime/10 text-neon-lime',
  pending: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  rejected: 'border-red-400/40 bg-red-400/10 text-red-300',
  featured: 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan',
  tournament: 'border-neon-purple/40 bg-neon-purple/10 text-neon-purple',
  session: 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan',
  free: 'border-white/15 bg-white/5 text-white/70',
};

export function Badge({ label, variant = 'free', className }: { label: string; variant?: keyof typeof styles | string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide', styles[variant] ?? styles.free, className)}>
      {label}
    </span>
  );
}
