'use client';

import { I18nProvider } from '@/lib/i18n/context';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </I18nProvider>
  );
}
