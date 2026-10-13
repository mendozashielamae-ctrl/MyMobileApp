import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [hasChanged, setHasChanged] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasChanged(true);
      const timer = setTimeout(() => setHasChanged(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasChanged(true);
      const timer = setTimeout(() => setHasChanged(false), 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, hasChanged };
}
