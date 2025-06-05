'use client';

import { AuthProvider } from "@/lib/AuthContext";
import { StalkProvider } from "@/lib/StalkContext";
import NotificationOverlay from "@/components/NotificationOverlay";
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackUserActivity } from '@/lib/firebase';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    trackUserActivity.pageView(pathname);
  }, [pathname]);

  return (
    <AuthProvider>
      <StalkProvider>
        {children}
        <NotificationOverlay />
      </StalkProvider>
    </AuthProvider>
  );
} 