'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { StalkProvider } from "@/lib/StalkContext";
import NotificationOverlay from "@/components/NotificationOverlay";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackUserActivity } from '@/lib/firebase';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Sayfa görüntülenmelerini izle
  useEffect(() => {
    trackUserActivity.pageView(pathname);
  }, [pathname]);

  return (
    <html lang="tr">
      <head>
        <title>Seni Kim Stalklıyor?</title>
        <meta name="description" content="Sosyal medyada seni kim izliyor? Ücretsiz öğren!" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <StalkProvider>
            <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
              {children}
            </main>
            <NotificationOverlay />
          </StalkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
