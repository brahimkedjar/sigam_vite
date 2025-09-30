'use client';

import { useEffect } from 'react';

import { useAuthStore } from '../store/useAuthStore';

export function useAuthReady() {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoaded = useAuthStore((state) => state.isLoaded);

  useEffect(() => {
    if (!isLoaded) {
      void initialize();
    }
  }, [initialize, isLoaded]);

  return isLoaded;
}
