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

  const startLoading = () => {
    setCount((c) => Math.max(0, c) + 1);
    // Clear any pending auto-stop
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopLoading = () => {
    setCount((c) => Math.max(0, c - 1));
  };

  const resetLoading = () => {
    setCount(0);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
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
