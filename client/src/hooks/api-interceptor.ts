// lib/api-interceptor.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Idempotent client-side patching: ensure we only patch once
declare global {
  interface Window {
    __SIGAM_API_PATCHED__?: boolean
    __SIGAM_ORIGINAL_FETCH__?: typeof fetch
    __SIGAM_NAV_ABORT__?: AbortController
    __SIGAM_ACTIVE_REQUESTS__?: number
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

  // Note: We no longer drive the GlobalSpinner from backend requests.
  // Any prior global loading counters are intentionally removed so that
  // the spinner reflects only route transitions.

  // Resolve API base and helper to detect internal vs external requests
  const VITE_API_BASE: string | undefined = (() => {
    try { return (import.meta as any)?.env?.VITE_API_URL; } catch { return undefined; }
  })();
  const API_BASE: string | undefined = ((process.env as any)?.NEXT_PUBLIC_API_URL as any) || VITE_API_BASE;
  let INTERNAL_HOST: string | null = null;
  try { if (API_BASE) INTERNAL_HOST = new URL(API_BASE).host; } catch {}
  const isArcgisHost = (host: string) => {
    const h = host.toLowerCase();
    return (
      h === 'sig.anam.dz' ||
      h.endsWith('.arcgis.com') ||
      h.endsWith('arcgisonline.com') ||
      h === 'cdn.arcgis.com' ||
      h === 'js.arcgis.com'
    );
  };
  const isInternal = (urlStr?: string) => {
    try {
      if (!urlStr) return true; // likely relative → treat as internal
      const u = new URL(urlStr, (API_BASE || window.location.origin));
      // Consider internal only if host matches configured API host
      if (INTERNAL_HOST) return u.host === INTERNAL_HOST;
      // Fallback: same-origin relative API
      return u.origin === window.location.origin && u.pathname.startsWith('/api');
    } catch { return false; }
  };

  axios.interceptors.request.use((config) => {
    try {
      const auth = useAuthStore.getState().auth;
      const headers = new Headers(config.headers as any);

      // Decide whether to attach auth-identifying headers
      let targetUrl: string | undefined = undefined;
      try {
        // Build absolute URL to inspect host
        const base = (config.baseURL as any) || API_BASE || window.location.origin;
        if (typeof config.url === 'string') {
          targetUrl = new URL(config.url, base).toString();
        }
      } catch {}

      const attachUserHeaders = isInternal(targetUrl);
      let toArcgis = false;
      try { if (targetUrl) toArcgis = isArcgisHost(new URL(targetUrl).host); } catch {}
      if (attachUserHeaders) {
        if (auth?.id) headers.set('X-User-Id', String(auth.id));
        if (auth?.username || auth?.email) headers.set('X-User-Name', String(auth.username || auth.email));
      } else {
        // Ensure we do not leak these to third-party hosts (e.g., ArcGIS)
        headers.delete('X-User-Id');
        headers.delete('x-user-id');
        headers.delete('X-User-Name');
        headers.delete('x-user-name');
      }
      config.headers = Object.fromEntries(headers.entries()) as any;
      // Attach navigation abort signal if not provided
      if (!config.signal && window.__SIGAM_NAV_ABORT__) {
        (config as any).signal = window.__SIGAM_NAV_ABORT__.signal;
      }
      // Cache-bust GET requests to avoid stale caches after repeated navigations
      const method = (config.method ?? 'get').toString().toLowerCase();
      if (method === 'get' && typeof config.url === 'string' && isInternal(targetUrl) && !toArcgis) {
        try {
          const u = new URL(config.url, window.location.origin);
          u.searchParams.set('_ts', String(Date.now()));
          config.url = u.toString();
        } catch {
          // ignore
        }
      }
      // Do not trigger any global loading UI from requests
      (config as any).__gl_track__ = false;
    } catch {
      // noop
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Patch fetch once and preserve original
  if (!window.__SIGAM_ORIGINAL_FETCH__) {
    window.__SIGAM_ORIGINAL_FETCH__ = window.fetch.bind(window);
    const originalFetch = window.__SIGAM_ORIGINAL_FETCH__;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const auth = useAuthStore.getState().auth;
        const headers = new Headers(init?.headers as any);
        // Determine target host
        let u: URL | null = null;
        try {
          if (typeof input === 'string') {
            u = new URL(input, (API_BASE || window.location.origin));
          } else {
            u = new URL((input as URL).toString());
          }
        } catch {}

        const host = u?.host || '';
        const toArcgis = host ? isArcgisHost(host) : false;
        const toInternal = u ? isInternal(u.toString()) : true;

        // Hard-bypass our wrapper for ArcGIS/ANAM/CDN requests to avoid
        // stack traces pointing at this file and to keep behavior pristine.
        if (toArcgis) {
          return originalFetch(input as any, init);
        }

        // Only attach user headers for internal API requests
        if (toInternal) {
          if (auth?.id) headers.set('X-User-Id', String(auth.id));
          if (auth?.username || auth?.email) headers.set('X-User-Name', String(auth.username || auth.email));
        } else {
          headers.delete('X-User-Id');
          headers.delete('x-user-id');
          headers.delete('X-User-Name');
          headers.delete('x-user-name');
        }
        // Do not force Content-Type; let callers set it appropriately
        const nextInit: RequestInit = { ...(init || {}), headers };
        if (!nextInit.signal && window.__SIGAM_NAV_ABORT__) {
          nextInit.signal = window.__SIGAM_NAV_ABORT__.signal;
        }
        // Cache-bust GET
        let nextInput: RequestInfo | URL = input;
        try {
          const method = (nextInit.method ?? 'GET').toString().toUpperCase();
          if (method === 'GET' && toInternal) {
            const urlObj = typeof input === 'string' ? new URL(input, window.location.origin) : new URL((input as URL).href);
            urlObj.searchParams.set('_ts', String(Date.now()));
            nextInput = urlObj.toString();
          }
        } catch {
          // ignore
        }
        // Do not trigger any global loading UI from fetch requests
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
