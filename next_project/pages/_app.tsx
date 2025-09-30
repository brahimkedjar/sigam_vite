// pages/_app.tsx
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';
import ClientLayout from '../utils/ClientLayout';
import { StepGuardProvider } from '@/src/hooks/StepGuardContext';
import { ConfigProvider } from 'antd';
import { LoadingProvider } from '@/components/globalspinner/LoadingContext';
import { GlobalSpinner } from '@/components/globalspinner/GlobalSpinner';
import { ToastContainer } from 'react-toastify';

// Create a custom hook for route change handling
function useRouteChangeHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Add a small delay to ensure the new page is ready
      setTimeout(() => {
        // Dispatch a custom event that pages can listen to
        window.dispatchEvent(new CustomEvent('routeChangeComplete', {
          detail: { url }
        }));

        // Force a re-render trigger for all components
        window.dispatchEvent(new Event('visibilitychange'));
      }, 100);
    };

    // Listen for route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}

// RouteAwareComponent wrapper
function RouteAwareComponent({ children }: { children: React.ReactNode }) {
  useRouteChangeHandler();
  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <LoadingProvider>
      <StepGuardProvider>
        <ConfigProvider componentSize="small">
          <ClientLayout>
            <RouteAwareComponent>
              <GlobalSpinner />
              <ToastContainer theme="colored" />
              <Component key={router.asPath} {...pageProps} />
            </RouteAwareComponent>
          </ClientLayout>
        </ConfigProvider>
      </StepGuardProvider>
    </LoadingProvider>
  );
}

export default MyApp;
