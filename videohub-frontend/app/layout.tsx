import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata = {
  title: 'VideoHub Downloader - Download Videos Without Watermark',
  description: 'Download videos from TikTok, Facebook, YouTube without watermark in high quality',
  keywords: 'video downloader, tiktok, facebook, youtube',
  authors: [{ name: 'VideoHub Team' }],
  openGraph: {
    type: 'website',
    title: 'VideoHub Downloader',
    description: 'Download videos from TikTok, Facebook, YouTube without watermark',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoHub Downloader',
    description: 'Download videos without watermark',
  },
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F172A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-background text-white antialiased">
        <ErrorBoundary>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
