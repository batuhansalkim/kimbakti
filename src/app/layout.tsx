import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/AuthContext';
import { Metadata, Viewport } from 'next';
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Seni Kim Stalklıyor?',
  description: 'Sosyal medyada seni kim izliyor? Ücretsiz öğren!',
  icons: {
    icon: [
      {
        url: '/hacker.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        url: '/hacker.png',
        sizes: '16x16',
        type: 'image/png'
      }
    ],
    apple: [
      {
        url: '/hacker.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/hacker.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/hacker.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/hacker.png" />
      </head>
      <body 
        className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-900 to-black text-white antialiased`} 
        suppressHydrationWarning
      >
        <ClientProviders>
          <div className="page-transition">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
