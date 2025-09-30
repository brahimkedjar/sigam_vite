// lib/api-interceptor.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Idempotent client-side patching: ensure we only patch once
declare global {
  interface Window {
    __SIGAM_API_PATCHED__?: boolean
    __SIGAM_ORIGINAL_FETCH__?: typeof fetch
    __SIGAM_NAV_ABORT__?: AbortController
  }
}

if (typeof window !== 'undefined' && !window.__SIGAM_API_PATCHED__) {
  window.__SIGAM_API_PATCHED__ = true;

  // Configure axios once
  axios.defaults.withCredentials = true;

  // Navigation-scoped AbortController: refreshed on each route start
  window.__SIGAM_NAV_ABORT__ = new AbortController();
  const resetAbort = () => {
    try { window.__SIGAM_NAV_ABORT__?.abort() } catch {}
    window.__SIGAM_NAV_ABORT__ = new AbortController();
  };
  window.addEventListener('routeChangeStart', resetAbort);

  axios.interceptors.request.use((config) => {
    try {
      const auth = useAuthStore.getState().auth;
      const headers = new Headers(config.headers as any);
      if (auth?.id) headers.set('X-User-Id', String(auth.id));
      if (auth?.username || auth?.email) headers.set('X-User-Name', String(auth.username || auth.email));
      config.headers = Object.fromEntries(headers.entries()) as any;
      // Attach navigation abort signal if not provided
      if (!config.signal && window.__SIGAM_NAV_ABORT__) {
        (config as any).signal = window.__SIGAM_NAV_ABORT__.signal;
      }
      // Cache-bust GET requests to avoid stale caches after repeated navigations
      const method = (config.method ?? 'get').toString().toLowerCase();
      if (method === 'get' && typeof config.url === 'string') {
        try {
          const u = new URL(config.url, window.location.origin);
          u.searchParams.set('_ts', String(Date.now()));
          config.url = u.toString();
        } catch {
          // ignore
        }
      }
    } catch {
      // noop
    }
    return config;
  });

  // Patch fetch once and preserve original
  if (!window.__SIGAM_ORIGINAL_FETCH__) {
    window.__SIGAM_ORIGINAL_FETCH__ = window.fetch.bind(window);
    const originalFetch = window.__SIGAM_ORIGINAL_FETCH__;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const auth = useAuthStore.getState().auth;
        const headers = new Headers(init?.headers as any);
        if (auth?.id) headers.set('X-User-Id', String(auth.id));
        if (auth?.username || auth?.email) headers.set('X-User-Name', String(auth.username || auth.email));
        // Do not force Content-Type; let callers set it appropriately
        const nextInit: RequestInit = { ...(init || {}), headers };
        if (!nextInit.signal && window.__SIGAM_NAV_ABORT__) {
          nextInit.signal = window.__SIGAM_NAV_ABORT__.signal;
        }
        // Cache-bust GET
        let nextInput: RequestInfo | URL = input;
        try {
          const method = (nextInit.method ?? 'GET').toString().toUpperCase();
          if (method === 'GET') {
            const u = typeof input === 'string' ? new URL(input, window.location.origin) : new URL((input as URL).href);
            u.searchParams.set('_ts', String(Date.now()));
            nextInput = u.toString();
          }
        } catch {
          // ignore
        }
        return originalFetch(nextInput, nextInit);
      } catch {
        return originalFetch(input, init);
      }
    };
  }
}

export default function setupApiInterceptors() {
  // Importing this module is sufficient; function is a no-op by design
}
