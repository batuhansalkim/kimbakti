'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getSocialMediaInfo } from '@/lib/firebase';
import { generateStalkReport } from '@/lib/stalkerGenerator';

export default function ReportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stalkers, setStalkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      if (!user) return;

      try {
        const socialMedia = await getSocialMediaInfo(user.uid);
        const report = generateStalkReport(
          socialMedia?.instagram,
          socialMedia?.tiktok
        );
        setStalkers(report);
      } catch (error) {
        console.error('Error loading report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [user]);

  if (!user && !loading) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
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
                    <span className="text-purple-500 text-sm">Premium'a Özel</span>
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
              Premium'a Geç
            </button>

            <button 
              onClick={() => {
                const username = user?.displayName || 'Anonim';
                router.push(`/u/${encodeURIComponent(username)}`);
              }}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Raporu Paylaş
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 