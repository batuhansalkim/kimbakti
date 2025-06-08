import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/AuthContext';
import { Metadata, Viewport } from 'next';
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Seni Kim Stalklıyor?',
  description: 'Sosyal medya hesaplarını kim takip ediyor? Hemen öğren!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
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
