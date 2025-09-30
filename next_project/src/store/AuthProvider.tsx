// AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from './useAuthStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore(state => state.initialize);
  const isLoaded = useAuthStore(state => state.isLoaded);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}