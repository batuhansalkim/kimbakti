'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { saveSocialMediaInfo } from '@/lib/firebase';

// Hata mesajlarını göstermek için yardımcı fonksiyon
const showAlert = (message: string, type: 'error' | 'info' = 'error') => {
  const style = type === 'error' ? 'background: #fee2e2; color: #dc2626; padding: 10px;' : 'background: #dbeafe; color: #2563eb; padding: 10px;';
  console.log(`%c${message}`, style);
  alert(message);
};

export default function SocialsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [instagram, setInstagram] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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
    // Kullanıcı yoksa login'e yönlendir
    if (!user && !loading) {
      console.log('No user found in socials, redirecting to login');
      window.location.href = '/login';
    }
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSaving) return;

    if (isOffline) {
      const errorMessage = 'İnternet bağlantınız yok. Çevrimiçi olduğunuzda tekrar deneyin.';
      showAlert(errorMessage, 'error');
      setError(errorMessage);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Önce yönlendirmeyi başlat
      const reportUrl = `/report/${user.uid}`;
      router.prefetch(reportUrl);

      // Instagram kullanıcı adını kaydet
      await saveSocialMediaInfo(user.uid, {
        instagram: instagram.trim()
      });

      // Hemen yönlendirmeyi yap
      window.location.href = reportUrl;
    } catch (error: unknown) {
      console.error('Error:', error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
      
      // Hata olsa bile report sayfasına yönlendir
      window.location.href = `/report/${user.uid}`;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Instagram Hesabınız
        </h1>

        <p className="text-gray-400 text-center mb-8 max-w-md">
          Daha doğru sonuçlar için Instagram kullanıcı adınızı girin.
          İsterseniz boş bırakabilirsiniz, rapor tamamen rastgele olur.
        </p>

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
              disabled={isSaving}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="@kullaniciadi"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Yönlendiriliyor...
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