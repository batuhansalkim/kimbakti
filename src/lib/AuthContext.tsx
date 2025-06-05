'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User } from 'firebase/auth';
import { auth } from './firebase';
import { useRouter, usePathname } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const redirectAttempts = useRef(0);

  const handleRedirect = useCallback(async (user: User | null) => {
    if (isRedirecting || redirectAttempts.current > 3) return;

    try {
      setIsRedirecting(true);
      redirectAttempts.current += 1;
      
      if (user) {
        // Kullanıcı giriş yapmışsa ve login sayfasındaysa
        if (pathname === '/login') {
          console.log('User is authenticated, redirecting to /socials');
          window.location.href = '/socials';
        }
      } else {
        // Kullanıcı giriş yapmamışsa ve korumalı bir sayfadaysa
        const protectedRoutes = ['/socials', '/report', '/premium'];
        if (protectedRoutes.some(route => pathname?.startsWith(route))) {
          console.log('User is not authenticated, redirecting to /login');
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error during redirect:', error);
    } finally {
      setIsRedirecting(false);
    }
  }, [pathname, isRedirecting]);

  // Auth state değişimlerini izle
  useEffect(() => {
    console.log('AuthProvider mounted, current pathname:', pathname);
    let isSubscribed = true;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'No user');
      
      if (!isSubscribed) {
        console.log('Component unmounted, skipping state update');
        return;
      }

      try {
        setUser(user);
        setLoading(false);
        
        // Yönlendirmeyi yap
        if (!loading) {
          await handleRedirect(user);
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        if (isSubscribed) {
          setLoading(false);
        }
      }
    });

    return () => {
      console.log('AuthProvider unmounting');
      isSubscribed = false;
      unsubscribe();
    };
  }, [loading, handleRedirect, pathname]);

  // Debug için auth state değişimlerini izle
  useEffect(() => {
    console.log('Current auth state:', { 
      user: user?.email, 
      loading,
      isRedirecting,
      pathname,
      redirectAttempts: redirectAttempts.current
    });
  }, [user, loading, isRedirecting, pathname]);

  // 5 saniye sonra redirectAttempts'i sıfırla
  useEffect(() => {
    const timer = setTimeout(() => {
      redirectAttempts.current = 0;
    }, 5000);

    return () => clearTimeout(timer);
  }, [isRedirecting]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 