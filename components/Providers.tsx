'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/lib/i18n/context';
import { AuthProvider } from '@/lib/auth/context';
import type { AppRole } from '@/lib/auth/roles';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Providers({
  children,
  initialUser = null,
  initialRole = null,
  initialName = null,
  initialAvatar = null,
}: {
  children: ReactNode;
  initialUser?: { id: string; email: string | null } | null;
  initialRole?: AppRole | null;
  initialName?: string | null;
  initialAvatar?: string | null;
}) {
  return (
    <AuthProvider
      initialUser={initialUser}
      initialRole={initialRole}
      initialName={initialName}
      initialAvatar={initialAvatar}
    >
      <I18nProvider>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </I18nProvider>
    </AuthProvider>
  );
}
