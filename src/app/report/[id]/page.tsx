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

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Son 24 Saatte Seni İzleyenler
      </h1>

      <div className="w-full max-w-2xl space-y-4">
        {stalkers.map((stalker) => (
          <div 
            key={stalker.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-4 relative overflow-hidden"
          >
            {stalker.isPremium && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="flex items-center space-x-2 text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Premium'a Özel</span>
                </div>
              </div>
            )}
            <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0" />
            <div className="flex-grow">
              <h3 className="font-semibold">{stalker.name}</h3>
              <p className="text-sm text-gray-400">{stalker.location}</p>
            </div>
            <div className="text-right text-sm text-gray-400">
              <p>{stalker.source}</p>
              <p>{stalker.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4 w-full max-w-md">
        <button 
          onClick={() => router.push('/premium')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Premium'a Geç</span>
        </button>

        <button 
          onClick={() => {
            const username = user?.displayName || 'Anonim';
            router.push(`/u/${encodeURIComponent(username)}`);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Raporu Paylaş</span>
        </button>
      </div>
    </div>
  );
} 