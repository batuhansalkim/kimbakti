'use client';

import { signInWithGoogle, signInAnonymous, auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthError extends Error {
  code?: string;
  message: string;
}

export default function LoginPage() {
  const { user, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Debug için auth durumunu izle
  useEffect(() => {
    console.log('Login Page - Auth State:', {
      user: user?.email,
      loading,
      currentUser: auth.currentUser?.email,
      isProcessing,
      error
    });

    // Eğer kullanıcı giriş yapmışsa ve yükleme tamamlandıysa
    if (user && !loading) {
      console.log('User already logged in, redirecting to socials');
      router.push('/socials');
    }
  }, [user, loading, isProcessing, router, error]);

  const handleGoogleSignIn = async () => {
    if (isProcessing) return;

    try {
      setError(null);
      setIsProcessing(true);
      console.log('Starting Google sign in process...');
      
      const user = await signInWithGoogle();
      console.log('Sign in result:', user);
      
      if (user) {
        console.log('Google sign in successful:', user.email);
        // Session cookie'sini ayarla
        const idToken = await user.getIdToken();
        document.cookie = `__session=${idToken}; path=/; max-age=3600; secure`;
        
        console.log('Redirecting to socials after Google sign in');
        window.location.href = '/socials';
      } else {
        console.log('Redirect flow started, waiting for completion...');
      }
    } catch (error: unknown) {
      console.error('Google sign in error:', error);
      if (error instanceof Error) {
        const authError = error as AuthError;
        setError(authError.message || 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      } else {
        setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    if (isProcessing) return;

    try {
      setError(null);
      setIsProcessing(true);
      console.log('Starting anonymous sign in process...');
      const result = await signInAnonymous();
      
      if (result) {
        console.log('Anonymous sign in successful');
        // Session cookie'sini ayarla
        const idToken = await result.getIdToken();
        document.cookie = `__session=${idToken}; path=/; max-age=3600; secure`;
        
        console.log('Redirecting to socials after anonymous sign in');
        window.location.href = '/socials';
      }
    } catch (error: unknown) {
      console.error('Anonymous sign in error:', error);
      if (error instanceof Error) {
        const authError = error as AuthError;
        setError(authError.message || 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      } else {
        setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Yükleniyor...</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Giriş Yap
            </h1>

            {error && (
              <div className="w-full max-w-md mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="w-full max-w-md space-y-4">
              <button 
                onClick={handleGoogleSignIn}
                disabled={isProcessing}
                className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>{isProcessing ? 'Giriş yapılıyor...' : 'Google ile Giriş Yap'}</span>
              </button>

              <button 
                onClick={handleAnonymousSignIn}
                disabled={isProcessing}
                className="w-full bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Giriş yapılıyor...' : 'Anonim Olarak Devam Et'}
              </button>
            </div>

            <p className="mt-8 text-sm text-gray-400 text-center max-w-md">
              Giriş yaparak{" "}
              <a href="/privacy" className="text-purple-400 hover:underline">
                Gizlilik Politikamızı
              </a>{" "}
              ve{" "}
              <a href="/terms" className="text-purple-400 hover:underline">
                Kullanım Koşullarımızı
              </a>{" "}
              kabul etmiş olursunuz.
            </p>
          </>
        )}
      </div>
    </main>
  );
} 