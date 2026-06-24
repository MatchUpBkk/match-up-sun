'use client';

import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n/context';
import { LOCALE_META, LOCALES } from '@/lib/i18n/dictionaries';
import { IconGlobe } from './Icons';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/25 hover:text-white"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <IconGlobe width={16} height={16} />
        <span className="font-medium">{LOCALE_META[locale].flag}</span>
        {!compact && <span className="hidden sm:inline">{LOCALE_META[locale].label}</span>}
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-ink-700/95 p-1 shadow-glass backdrop-blur-xl"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === locale}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                  l === locale ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-white/80 hover:bg-white/5',
                )}
              >
                <span>{LOCALE_META[l].flag}</span>
                <span className="font-medium">{LOCALE_META[l].label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
