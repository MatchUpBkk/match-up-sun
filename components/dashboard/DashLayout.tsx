'use client';

import { useState, type ReactNode, type ComponentType } from 'react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

export interface DashTab {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  content: ReactNode;
}

export function DashLayout({
  title,
  welcome,
  badge,
  tabs,
}: {
  title: string;
  welcome?: string;
  badge?: ReactNode;
  tabs: DashTab[];
}) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((tb) => tb.key === active) ?? tabs[0];

  return (
    <div className="container-x pt-24 pb-24 sm:pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
          {welcome && <p className="mt-1 text-white/55">{welcome}</p>}
        </div>
        {badge}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="glass flex gap-2 overflow-x-auto p-2 lg:flex-col">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setActive(tb.key)}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition',
                  active === tb.key ? 'bg-neon-cyan/10 text-neon-cyan ring-1 ring-neon-cyan/30' : 'text-white/60 hover:bg-white/5 hover:text-white',
                )}
              >
                <tb.icon className="h-5 w-5 shrink-0" />
                <span className="whitespace-nowrap">{tb.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="min-w-0">{current?.content}</section>
      </div>
    </div>
  );
}

export function StatTile({ label, value, accent = 'cyan' }: { label: string; value: string; accent?: 'cyan' | 'purple' | 'lime' }) {
  const accents = {
    cyan: 'text-neon-cyan',
    purple: 'text-neon-purple',
    lime: 'text-neon-lime',
  };
  return (
    <div className="glass p-5">
      <p className={cn('text-2xl font-extrabold', accents[accent])}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-white/45">{label}</p>
    </div>
  );
}

export function DataPanel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="glass overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <h3 className="font-bold text-white">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
