// hooks/useRouterWithLoading.ts
import { useRouter } from 'next/router';
import { useLoading } from '@/components/globalspinner/LoadingContext';
import { useEffect } from 'react';

export const useRouterWithLoading = () => {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        startLoading();
      }
    };

    const handleComplete = () => stopLoading();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router, startLoading, stopLoading]);

  // Return enhanced router with loading-aware methods
  return {
    ...router,
    push: async (url: string) => {
      startLoading();
      try {
        await router.push(url);
      } finally {
        stopLoading();
      }
    },
    replace: async (url: string) => {
      startLoading();
      try {
        await router.replace(url);
      } finally {
        stopLoading();
      }
    },
  };
};