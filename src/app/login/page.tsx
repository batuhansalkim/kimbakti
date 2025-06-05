'use client';

import { useRouter } from 'next/navigation';
import { signInWithGoogle, signInAnonymous } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Kullanıcı oturum açtığında otomatik yönlendirme
  useEffect(() => {
    if (user) {
      router.push('/socials');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymous();
    } catch (error) {
      console.error('Anonymous sign in failed:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Giriş Yap
      </h1>

      <div className="w-full max-w-md space-y-4">
        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
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
          <span>Google ile Giriş Yap</span>
        </button>

        <button 
          onClick={handleAnonymousSignIn}
          className="w-full bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
        >
          Anonim Olarak Devam Et
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
    </div>
  );
} 