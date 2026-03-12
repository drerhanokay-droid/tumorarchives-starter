import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const mono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TumorArchives',
    template: '%s | TumorArchives',
  },
  description:
    'TumorArchives; device-first tumor archive, radiology domain management, follow-up timeline, license operations and research export platform.',
  applicationName: 'TumorArchives',
  keywords: [
    'tumor archive',
    'musculoskeletal oncology',
    'sarcoma registry',
    'radiology archive',
    'follow-up timeline',
    'device-first clinical app',
  ],
  openGraph: {
    title: 'TumorArchives',
    description:
      'Device-first tumor archive platform for radiology domains, follow-up workflows, licensing and research export.',
    url: siteUrl,
    siteName: 'TumorArchives',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TumorArchives',
    description:
      'Device-first tumor archive platform for radiology domains, follow-up workflows and research export.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#081018',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${sans.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
