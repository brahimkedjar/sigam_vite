'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

const CACHE_KEY = '__sigam_query_cache__';

type CacheShape = Record<string, Record<string, string>>;

function getSearchFromAsPath(asPath?: string | null) {
  if (!asPath) return '';
  const queryIndex = asPath.indexOf('?');
  if (queryIndex === -1) return '';
  const hashIndex = asPath.indexOf('#', queryIndex);
  if (hashIndex === -1) {
    return asPath.slice(queryIndex + 1);
  }
  return asPath.slice(queryIndex + 1, hashIndex);
}

function readCache(): CacheShape {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed as CacheShape;
    }
    return {};
  } catch (error) {
    console.warn('Failed to read search param cache', error);
    return {};
  }
}

function writeCache(cache: CacheShape) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to persist search param cache', error);
  }
}

export function useSearchParams() {
  const router = useRouter();
  const pathKey = router?.pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');

  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.search.slice(1);
    }
    return getSearchFromAsPath(router?.asPath);
  });

  const [cachedParams, setCachedParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const nextSearch = typeof window !== 'undefined'
      ? window.location.search.slice(1)
      : getSearchFromAsPath(router?.asPath);
    setSearch(nextSearch);
  }, [router.asPath]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cache = readCache();
    setCachedParams(cache[pathKey] ?? {});
  }, [pathKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(search);
    if (Array.from(params.keys()).length === 0) {
      return;
    }

    const entries = Object.fromEntries(params.entries());
    const cache = readCache();
    cache[pathKey] = entries;
    writeCache(cache);
    setCachedParams(entries);
  }, [search, pathKey]);

  const resolvedParams = useMemo(() => {
    const merged = new URLSearchParams();

    Object.entries(cachedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        merged.set(key, value);
      }
    });

    if (search) {
      const liveParams = new URLSearchParams(search);
      liveParams.forEach((value, key) => {
        merged.set(key, value);
      });
    }

    return merged;
  }, [cachedParams, search]);

  return resolvedParams;
}
