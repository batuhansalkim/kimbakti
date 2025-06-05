'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { saveSocialMediaInfo, getSocialMediaInfo } from '@/lib/firebase';

export default function SocialsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Kullanıcı yoksa login'e yönlendir
        if (!user && !loading) {
          console.log('No user found in socials, redirecting to login');
          window.location.href = '/login';
          return;
        }

        // Kullanıcı varsa bilgileri yükle
        if (user) {
          console.log('Loading social media info in socials page');
          const data = await getSocialMediaInfo(user.uid);
          if (mounted && data) {
            setInstagram(data.instagram || '');
            setTiktok(data.tiktok || '');
          }
        }
      } catch (error: any) {
        console.error('Error in socials page:', error);
        if (mounted) {
          if (isOffline) {
            setError('İnternet bağlantınız yok. Çevrimiçi olduğunuzda tekrar deneyin.');
          } else {
            setError(error.message || 'Bilgiler yüklenirken bir hata oluştu.');
          }
        }
      } finally {
        if (mounted) {
          setPageLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [user, loading, isOffline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSaving) return;

    if (isOffline) {
      setError('İnternet bağlantınız yok. Çevrimiçi olduğunuzda tekrar deneyin.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      console.log('Saving social media info...');
      const saveResult = await saveSocialMediaInfo(user.uid, {
        instagram: instagram.trim(),
        tiktok: tiktok.trim()
      });

      if (saveResult) {
        console.log('Social media info saved, redirecting to report');
        // Önce yönlendirmeyi dene
        try {
          router.push(`/report/${user.uid}`);
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Router ile yönlendirme başarısız olursa window.location kullan
          window.location.href = `/report/${user.uid}`;
        }
      } else {
        throw new Error('Bilgiler kaydedilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error: any) {
      console.error('Error saving social media:', error);
      setError(error.message || 'Bilgiler kaydedilirken bir hata oluştu.');
      setIsSaving(false);
    }
  };

  if (loading || pageLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Sosyal Medya Hesaplarınız
        </h1>

        <p className="text-gray-400 text-center mb-8 max-w-md">
          Daha doğru sonuçlar için sosyal medya kullanıcı adlarınızı girin.
          İsterseniz boş bırakabilirsiniz, rapor tamamen rastgele olur.
        </p>

        {isOffline && (
          <div className="w-full max-w-md mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-sm">
            Çevrimdışı moddasınız. İnternet bağlantınızı kontrol edin.
          </div>
        )}

        {error && (
          <div className="w-full max-w-md mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-300">
              Instagram Kullanıcı Adı
            </label>
            <input
              type="text"
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              disabled={isSaving || isOffline}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="@kullaniciadi"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tiktok" className="block text-sm font-medium text-gray-300">
              TikTok Kullanıcı Adı
            </label>
            <input
              type="text"
              id="tiktok"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              disabled={isSaving || isOffline}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="@kullaniciadi"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || isOffline}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Kaydediliyor...
              </>
            ) : (
              'Devam Et'
            )}
          </button>
        </form>
      </div>
    </main>
  );
} 