import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { analytics } from '@/lib/firebase';
import { logEvent, getAnalytics } from 'firebase/analytics';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Analytics'i sadece production ortamında kullan
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      const logPageView = () => {
        // analytics null değilse logEvent'i çağır
        if (analytics) {
          logEvent(analytics, 'page_view', {
            page_path: router.pathname,
            page_title: document.title,
          });
        }
      };

      // İlk sayfa yüklendiğinde
      logPageView();

      // Sayfa değişimlerinde
      router.events.on('routeChangeComplete', logPageView);

      return () => {
        router.events.off('routeChangeComplete', logPageView);
      };
    }
  }, [router]);

  return <Component {...pageProps} />;
} 