'use client';

import { useStalk } from "@/lib/StalkContext";
import { useEffect, useState } from "react";

export default function NotificationOverlay() {
  const { notifications } = useStalk();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-purple-600/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-slide-in"
          >
            <p className="text-sm">{notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 