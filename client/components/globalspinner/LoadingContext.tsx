// contexts/LoadingContext.tsx
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  resetLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
  resetLoading: () => {},
});

export const LoadingProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [count, setCount] = useState(0);
  const timerRef = useRef<number | null>(null);
  const lastStartAtRef = useRef<number>(0);
  const MIN_VISIBLE_MS = 250; // keep spinner at least this long so user sees it

  const startLoading = () => {
    lastStartAtRef.current = Date.now();
    setCount((c) => Math.max(0, c) + 1);
    // Clear any pending auto-stop
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopLoading = () => {
    setCount((c) => {
      const next = Math.max(0, c - 1);
      if (next === 0) {
        const elapsed = Date.now() - lastStartAtRef.current;
        const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setCount(0);
          timerRef.current = null;
        }, delay) as any;
        return c; // keep visible until timeout fires
      }
      return next;
    });
  };

  const resetLoading = () => {
    const elapsed = Date.now() - lastStartAtRef.current;
    const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setCount(0);
      timerRef.current = null;
    }, delay) as any;
  };

  const value = useMemo<LoadingContextType>(() => ({
    isLoading: count > 0,
    startLoading,
    stopLoading,
    resetLoading,
  }), [count]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
