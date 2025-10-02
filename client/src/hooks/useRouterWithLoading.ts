// hooks/useRouterWithLoading.ts
import { useRouter } from 'next/router';
import { useLoading } from '@/components/globalspinner/LoadingContext';
import { useEffect } from 'react';

const EVENT_START = 'routeChangeStart';
const EVENT_COMPLETE = 'routeChangeComplete';

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
    push: (url: string) => {
      // Emit a global start event so GlobalRouteLoading can show the spinner
      try {
        window.dispatchEvent(new CustomEvent(EVENT_START, { detail: { url } }));
      } catch {}
      // Wait for the RouteEventsBridge to emit COMPLETE on real navigation
      // No premature stop here; GlobalRouteLoading handles stop.
      router.push(url);
    },
    replace: (url: string) => {
      try {
        window.dispatchEvent(new CustomEvent(EVENT_START, { detail: { url } }));
      } catch {}
      router.replace(url);
    },
  };
};
