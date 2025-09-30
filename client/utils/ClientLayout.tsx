'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/router';

import { useAuthReady } from '@/src/hooks/useAuthReady';

interface ClientLayoutProps {
  children: ReactNode;
}

type MissingDocsPayload = {
  missing: string[];
  procedureId?: number | null;
  demandeId?: string | null;
  phase?: string;
  allowedPrefixes?: string[];
  path?: string;
  query?: string;
  updatedAt?: string;
};

type StoredMissingDocs = { procedures?: Record<string, MissingDocsPayload> } & MissingDocsPayload;

const STORAGE_KEY = 'sigam_missing_required_docs';

const sanitizeNames = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
        .filter((entry): entry is string => entry.length > 0)
    : [];

const normalizePayload = (payload: MissingDocsPayload | null | undefined): MissingDocsPayload | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const missing = sanitizeNames(payload.missing);
  if (missing.length === 0) {
    return null;
  }

  const rawProcedureId = payload.procedureId;
  const procedureId =
    rawProcedureId == null || rawProcedureId === null
      ? null
      : Number.isFinite(Number(rawProcedureId))
      ? Number(rawProcedureId)
      : null;

  const rawDemandeId = payload.demandeId;
  const demandeId = rawDemandeId == null || rawDemandeId === '' ? null : String(rawDemandeId);

  const allowedPrefixes = Array.isArray(payload.allowedPrefixes)
    ? payload.allowedPrefixes
        .map((prefix) => (typeof prefix === 'string' ? prefix.trim() : ''))
        .filter((prefix) => prefix.length > 0)
    : undefined;

  const phase =
    typeof payload.phase === 'string' && payload.phase.trim().length > 0
      ? payload.phase.trim().toUpperCase()
      : undefined;

  return {
    ...payload,
    missing,
    allowedPrefixes: allowedPrefixes && allowedPrefixes.length > 0 ? allowedPrefixes : undefined,
    procedureId,
    demandeId,
    phase,
    path: typeof payload.path === 'string' ? payload.path : undefined,
    query: typeof payload.query === 'string' ? payload.query : undefined,
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : undefined,
  };
};

const unpackCandidates = (raw: unknown): MissingDocsPayload[] => {
  if (!raw || typeof raw !== 'object') {
    return [];
  }

  const candidates: MissingDocsPayload[] = [];
  const normalizedRoot = normalizePayload(raw as MissingDocsPayload);
  if (normalizedRoot) {
    candidates.push(normalizedRoot);
  }

  const record = (raw as StoredMissingDocs).procedures;
  if (record && typeof record === 'object') {
    Object.values(record).forEach((entry) => {
      const normalized = normalizePayload(entry);
      if (normalized) {
        candidates.push(normalized);
      }
    });
  }

  return candidates;
};

const pickLatestMatch = (
  candidates: MissingDocsPayload[],
  matches: (payload: MissingDocsPayload | null) => boolean
): MissingDocsPayload | null => {
  let selected: MissingDocsPayload | null = null;
  let selectedTime = -Infinity;

  candidates.forEach((candidate) => {
    if (!matches(candidate)) {
      return;
    }

    const timestamp = candidate.updatedAt ? Date.parse(candidate.updatedAt) : Number.NaN;
    const safeTime = Number.isFinite(timestamp) ? timestamp : 0;

    if (!selected || safeTime > selectedTime) {
      selected = candidate;
      selectedTime = safeTime;
    }
  });

  return selected;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const isAuthReady = useAuthReady();
  const { pathname } = useRouter();
  const [hasStoredSession, setHasStoredSession] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [missingDocsState, setMissingDocsState] = useState<MissingDocsPayload | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedAuth = window.localStorage.getItem('auth');
    setHasStoredSession(Boolean(storedAuth));
  }, []);

  const shouldSkipOverlay = pathname === '/' || !hasStoredSession;
  const isContentReady = shouldSkipOverlay || isAuthReady;

  useEffect(() => {
    if (shouldSkipOverlay) {
      setOverlayVisible(false);
      return;
    }

    if (isAuthReady) {
      const timeout = setTimeout(() => setOverlayVisible(false), 240);
      return () => clearTimeout(timeout);
    }

    setOverlayVisible(true);
    return undefined;
  }, [shouldSkipOverlay, isAuthReady]);

  const matchesCurrentContext = useCallback(
    (payload: MissingDocsPayload | null): boolean => {
      if (!payload || payload.missing.length === 0) {
        return false;
      }

      if (typeof window === 'undefined') {
        return false;
      }

      const isProcedureRoute = pathname.startsWith('/demande') || pathname.startsWith('/renouvellement');
      if (!isProcedureRoute) {
        return false;
      }

      if (payload.phase && payload.phase !== 'FIRST') {
        return false;
      }

      const search = window.location.search || '';
      const params = new URLSearchParams(search);
      const procedureParam = params.get('id');
      const demandeParam = params.get('demande') ?? params.get('id_demande');

      if (payload.procedureId != null) {
        if (!procedureParam || Number(procedureParam) !== Number(payload.procedureId)) {
          return false;
        }
      }

      if (payload.demandeId != null && payload.demandeId !== '') {
        if (!demandeParam || String(demandeParam) !== String(payload.demandeId)) {
          return false;
        }
      }

      const hasIdentity =
        payload.procedureId != null || (payload.demandeId != null && payload.demandeId !== '');
      if (!hasIdentity) {
        return false;
      }

      if (payload.query && payload.query !== search) {
        return false;
      }

      if (payload.allowedPrefixes?.length) {
        if (!payload.allowedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
          return false;
        }
      } else if (payload.path) {
        if (pathname !== payload.path) {
          return false;
        }
      } else if (!pathname.includes('/step1')) {
        return false;
      }

      return true;
    },
    [pathname]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const readPersisted = () => {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setMissingDocsState(null);
        return;
      }

      try {
        const parsed = JSON.parse(raw) as StoredMissingDocs;
        const candidates = unpackCandidates(parsed);
        const match = pickLatestMatch(candidates, matchesCurrentContext);
        setMissingDocsState(match);
      } catch (error) {
        setMissingDocsState(null);
      }
    };

    const handleCustom = (event: Event) => {
      const detail = normalizePayload((event as CustomEvent<MissingDocsPayload | null>).detail ?? null);
      if (detail && matchesCurrentContext(detail)) {
        setMissingDocsState(detail);
        return;
      }

      readPersisted();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        readPersisted();
      }
    };

    readPersisted();
    window.addEventListener('sigam:missing-docs', handleCustom as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('sigam:missing-docs', handleCustom as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, [matchesCurrentContext]);

  const showMissingBanner = useMemo(
    () => matchesCurrentContext(missingDocsState),
    [missingDocsState, matchesCurrentContext]
  );

  const displayedMissingDocs = showMissingBanner ? missingDocsState?.missing ?? [] : [];

  const contentClassName = [
    'client-layout__content',
    isContentReady && 'client-layout__content--ready',
    showMissingBanner && 'client-layout__content--with-banner',
  ]
    .filter((value): value is string => Boolean(value))
    .join(' ');

  const overlayClassName = [
    'client-layout__overlay',
    isAuthReady && 'client-layout__overlay--fade-out',
  ]
    .filter((value): value is string => Boolean(value))
    .join(' ');

  return (
    <div className="client-layout">
      {/* Missing documents banner is disabled; alerts are shown only on specific pages */}

      <div className={contentClassName}>{children}</div>

      {overlayVisible && !shouldSkipOverlay && (
        <div className={overlayClassName} aria-live="polite" role="status">
          <div className="client-layout__spinner" />
          <h1 className="client-layout__title">Initializing session</h1>
          <p className="client-layout__subtitle">Securing your connection...</p>
          <div className="client-layout__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      <style jsx>{`
        .client-layout {
          min-height: 100vh;
          position: relative;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .client-layout__content {
          opacity: 0.4;
          transition: opacity 200ms ease;
        }

        .client-layout__content--ready {
          opacity: 1;
        }
        .client-layout__content--with-banner {
          margin-top: 56px;
        }

        .client-layout__missing-alert {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(220, 38, 38, 0.92);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .client-layout__missing-alert strong {
          font-weight: 700;
        }

        .client-layout__missing-alert span {
          font-weight: 500;
        }

        .client-layout__overlay {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          color: #fff;
          background: linear-gradient(135deg, rgba(17, 24, 39, 0.96) 0%, rgba(31, 41, 55, 0.96) 100%);
          z-index: 9999;
          transition: opacity 200ms ease;
        }

        .client-layout__overlay--fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .client-layout__spinner {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 4px solid rgba(59, 130, 246, 0.35);
          border-top-color: #3b82f6;
          margin: 0 0 1.5rem;
          animation: client-layout-spin 1s linear infinite;
        }

        .client-layout__title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .client-layout__subtitle {
          color: #9ca3af;
          margin-bottom: 1.5rem;
        }

        .client-layout__dots {
          display: flex;
          gap: 0.5rem;
        }

        .client-layout__dots span {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 9999px;
          background: #3b82f6;
          opacity: 0.6;
          animation: client-layout-bounce 1.4s ease-in-out infinite;
        }

        .client-layout__dots span:nth-child(2) {
          animation-delay: 120ms;
        }

        .client-layout__dots span:nth-child(3) {
          animation-delay: 240ms;
        }

        @keyframes client-layout-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes client-layout-bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          40% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
