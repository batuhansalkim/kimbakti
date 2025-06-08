import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { app } from '@/lib/firebase';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Analytics'i sadece production ortamında kullan
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      const analytics = getAnalytics(app);
      
      const logPageView = () => {
        logEvent(analytics, 'page_view', {
          page_path: router.pathname,
          page_title: document.title,
        });
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