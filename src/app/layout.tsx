import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/AuthContext';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
