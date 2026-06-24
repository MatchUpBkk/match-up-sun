import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function GlassCard({ children, className, hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <div className={cn('glass p-6', hover && 'glass-hover', className)}>{children}</div>;
}
