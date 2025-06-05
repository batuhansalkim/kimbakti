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

  useEffect(() => {
    const loadSocialMedia = async () => {
      if (user) {
        try {
          const data = await getSocialMediaInfo(user.uid);
          if (data) {
            setInstagram(data.instagram || '');
            setTiktok(data.tiktok || '');
          }
        } catch (error) {
          console.error('Error loading social media info:', error);
        }
      }
    };

    loadSocialMedia();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await saveSocialMediaInfo(user.uid, {
        instagram: instagram.trim(),
        tiktok: tiktok.trim()
      });
      router.push(`/report/${user.uid}`);
    } catch (error) {
      console.error('Error saving social media:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Sosyal Medya Hesaplarınız
      </h1>

      <p className="text-gray-400 text-center mb-8 max-w-md">
        Daha doğru sonuçlar için sosyal medya kullanıcı adlarınızı girin.
        İsterseniz boş bırakabilirsiniz, rapor tamamen rastgele olur.
      </p>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-300">
            Instagram Kullanıcı Adı
          </label>
          <input
            type="text"
            id="instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="@kullaniciadi"
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSaving}
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
      </div>
    </div>
  );
} 