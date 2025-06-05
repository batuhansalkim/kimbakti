'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { generateStalkerNotification } from './stalkerGenerator';

type Notification = {
  id: string;
  message: string;
  timestamp: Date;
};

type StalkContextType = {
  notifications: Notification[];
  stalkScore: number;
  topStalker: string | null;
  addNotification: (notification: Notification) => void;
  increaseScore: (points: number) => void;
  setTopStalker: (name: string) => void;
};

const StalkContext = createContext<StalkContextType>({
  notifications: [],
  stalkScore: 0,
  topStalker: null,
  addNotification: () => {},
  increaseScore: () => {},
  setTopStalker: () => {},
});

export function StalkProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stalkScore, setStalkScore] = useState(0);
  const [topStalker, setTopStalker] = useState<string | null>(null);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 5));
  };

  const increaseScore = (points: number) => {
    setStalkScore(prev => prev + points);
  };

  // Otomatik bildirim üretici
  useEffect(() => {
    const interval = setInterval(() => {
      const notification = generateStalkerNotification();
      if (notification) {
        addNotification({
          id: Math.random().toString(),
          message: notification,
          timestamp: new Date(),
        });
      }
    }, 30000); // Her 30 saniyede bir

    return () => clearInterval(interval);
  }, []);

  return (
    <StalkContext.Provider 
      value={{ 
        notifications, 
        stalkScore, 
        topStalker,
        addNotification, 
        increaseScore,
        setTopStalker: (name: string) => setTopStalker(name),
      }}
    >
      {children}
    </StalkContext.Provider>
  );
}

export const useStalk = () => useContext(StalkContext); 