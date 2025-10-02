// src/hooks/useSessionLoader.ts
'use client';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

// Hydrate auth from localStorage and verify token if present.
// This runs once on app start via ClientLayout, so Navbar/Sidebar
// get user + permissions on hard refresh even without a token field.
export function useSessionLoader() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initialize();
      } finally {
        if (!mounted) return;
      }
    })();
    return () => { mounted = false };
  }, [initialize]);
}

