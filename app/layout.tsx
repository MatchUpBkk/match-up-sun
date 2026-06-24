import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://matchupbkk.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MATCH UP BKK — Play. Connect. Compete.',
    template: '%s · MATCH UP BKK',
  },
  description:
    'Bangkok’s premium football marketplace. Discover tournaments and weekday matches, register, pay online, and join the community.',
  keywords: ['football', 'Bangkok', 'tournaments', 'matches', 'PromptPay', 'soccer', 'futsal'],
  icons: {
    icon: [
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'MATCH UP BKK',
    title: 'MATCH UP BKK — Play. Connect. Compete.',
    description: 'Bangkok’s premium football marketplace for tournaments and weekday matches.',
    images: [{ url: '/brand/og-image.jpg', width: 1200, height: 630, alt: 'MATCH UP BKK' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MATCH UP BKK — Play. Connect. Compete.',
    description: 'Bangkok’s premium football marketplace for tournaments and weekday matches.',
    images: ['/brand/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#05060a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="bg-ink text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
