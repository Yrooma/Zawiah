
"use client";

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
import './globals.css';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'زاوية',
  description: 'مخطط المحتوى التعاوني الخاص بك.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  openGraph: {
    title: 'زاوية',
    description: 'مخطط المحتوى التعاوني الخاص بك.',
    url: 'https://zawiah.app',
    siteName: 'زاوية',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'زاوية - مخطط المحتوى التعاوني',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'زاوية',
    description: 'مخطط المحتوى التعاوني الخاص بك.',
    images: ['/og.png'],
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'زاوية',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            {!isStandalone && (
              <div className="fixed bottom-4 right-4 z-50">
                <div className="bg-background border rounded-lg shadow-lg p-4 max-w-sm">
                  <h3 className="font-bold font-headline">تثبيت التطبيق</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ثبت تطبيق زاوية على جهازك للوصول السريع والميزات الحصرية.
                  </p>
                  {isIOS && (
                    <p className="text-xs text-muted-foreground mt-2">
                      اضغط على زر المشاركة ثم "إضافة إلى الشاشة الرئيسية".
                    </p>
                  )}
                </div>
              </div>
            )}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
