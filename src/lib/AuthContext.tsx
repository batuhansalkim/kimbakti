'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from './firebase';
import { usePathname, useRouter } from 'next/navigation';

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
  const pathname = usePathname();
  const router = useRouter();

  // Auth state değişikliklerini izle
  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'No user');
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Yönlendirme mantığı için ayrı bir useEffect
  useEffect(() => {
    console.log('Navigation effect running:', {
      user: user?.email,
      loading,
      pathname
    });

    if (!loading) {
      if (user) {
        // Kullanıcı giriş yapmışsa ve login sayfasındaysa
        if (pathname === '/login') {
          console.log('User is authenticated, forcing navigation to /socials');
          window.location.href = '/socials';
        }
      } else {
        // Kullanıcı giriş yapmamışsa ve korumalı bir sayfadaysa
        const protectedRoutes = ['/socials', '/report', '/premium'];
        if (protectedRoutes.some(route => pathname?.startsWith(route))) {
          console.log('User is not authenticated, forcing navigation to /login');
          window.location.href = '/login';
        }
      }
    }
  }, [user, loading, pathname]);

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