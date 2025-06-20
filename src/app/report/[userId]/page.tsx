'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getSocialMediaInfo } from '@/lib/firebase';
import { generateStalkReport } from '@/lib/stalkerGenerator';

interface Stalker {
  id: string;
  name: string;
  location: string;
  time: string;
  source: string;
  isPremium?: boolean;
}

export default function ReportPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stalkers, setStalkers] = useState<Stalker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const loadReport = async () => {
      if (!user) return;

      try {
        const socialMedia = await getSocialMediaInfo(user.uid);
        const report = generateStalkReport(socialMedia?.instagram);
        setStalkers(report);
      } catch (error) {
        console.error('Error loading report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [user]);

  const handleShare = async () => {
    setShowShareModal(true);
  };

  const handleSocialShare = async (platform: 'whatsapp' | 'instagram' | 'copy') => {
    const shareUrl = `${window.location.origin}/u/${user?.uid}`;
    const shareText = 'Kim beni stalklıyor? Hemen öğren! 👀';

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
        break;
      case 'instagram':
        // Instagram Stories için deep link
        // Not: Instagram'ın kısıtlamaları nedeniyle sadece onaylı uygulamalar için çalışır
        window.open(`instagram://story?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        // Eğer deep link çalışmazsa Instagram'ı aç
        setTimeout(() => {
          window.open('https://instagram.com', '_blank');
        }, 1000);
        break;
      case 'copy':
        await navigator.clipboard.writeText(shareUrl);
        alert('Bağlantı kopyalandı!');
        break;
    }
    setShowShareModal(false);
  };

  if (!user && !loading) {
    window.location.href = '/login';
    return null;
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Son 24 Saatte Seni İzleyenler
        </h1>

        <div className="space-y-3">
          {stalkers.map((stalker) => (
            <div 
              key={stalker.id}
              className={`bg-[#1E1E1E] rounded-xl p-4 relative ${
                stalker.isPremium ? 'bg-opacity-40' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#2A2A2A] rounded-full flex items-center justify-center backdrop-blur-lg">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-[15px] text-gray-200">{stalker.name}</h3>
                    <p className="text-sm text-gray-500">{stalker.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{stalker.time}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{stalker.source}</p>
                </div>
              </div>
              {stalker.isPremium && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-purple-500 text-sm">Premium&apos;a Özel</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-6 space-y-3">
            <button 
              onClick={() => router.push('/premium')}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Premium&apos;a Geç
            </button>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleShare}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <span>Raporu Paylaş</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Raporu Paylaş</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* WhatsApp */}
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex flex-col items-center justify-center p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-sm font-medium">WhatsApp</span>
              </button>

              {/* Instagram */}
              <button
                onClick={() => handleSocialShare('instagram')}
                className="flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 hover:opacity-90 rounded-lg transition-opacity"
              >
                <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm font-medium">Instagram</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={() => handleSocialShare('copy')}
                className="flex flex-col items-center justify-center p-4 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors col-span-2"
              >
                <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span className="text-sm font-medium">Bağlantıyı Kopyala</span>
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="mt-6 w-full px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </main>
  );
} 