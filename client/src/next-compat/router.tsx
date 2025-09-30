import { useLocation, useNavigate } from 'react-router-dom'

type RouteChangeHandler = (url: string) => void

// Simple global event hub for route changes
const EVENT_START = 'routeChangeStart'
const EVENT_COMPLETE = 'routeChangeComplete'
const EVENT_ERROR = 'routeChangeError'

type EventName = typeof EVENT_START | typeof EVENT_COMPLETE | typeof EVENT_ERROR

const handlerStore: Record<EventName, Map<RouteChangeHandler, EventListener>> = {
  [EVENT_START]: new Map(),
  [EVENT_COMPLETE]: new Map(),
  [EVENT_ERROR]: new Map(),
}

function normalizeEvent(event: string): EventName {
  return event === 'routeChangeStart' ? EVENT_START : event === 'routeChangeError' ? EVENT_ERROR : EVENT_COMPLETE
}

function on(event: string, handler: RouteChangeHandler) {
  const ev = normalizeEvent(event)
  const listener: EventListener = (e: Event) => {
    const detail = (e as CustomEvent<{ url: string }>).detail
    handler(detail?.url ?? window.location.pathname + window.location.search)
  }
  window.addEventListener(ev, listener)
  handlerStore[ev].set(handler, listener)
  return () => {
    const stored = handlerStore[ev].get(handler)
    if (stored) {
      window.removeEventListener(ev, stored)
      handlerStore[ev].delete(handler)
    }
  }
}

function off(event: string, handler: RouteChangeHandler) {
  const ev = normalizeEvent(event)
  const stored = handlerStore[ev].get(handler)
  if (stored) {
    window.removeEventListener(ev, stored)
    handlerStore[ev].delete(handler)
  }
}

export function useRouter() {
  const location = useLocation()
  const navigate = useNavigate()
  return {
    pathname: location.pathname,
    asPath: location.pathname + location.search + location.hash,
    query: Object.fromEntries(new URLSearchParams(location.search).entries()),
    isReady: true,
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    reload: () => window.location.reload(),
    events: { on, off },
  }
}

// Default export compatibility similar to Next.js Router singleton
let _navigate: ((to: string, opts?: { replace?: boolean }) => void) | null = null

export function __setNavigate(fn: (to: string, opts?: { replace?: boolean }) => void) {
  _navigate = fn
}

function getLocationParts() {
  if (typeof window === 'undefined') {
    return { pathname: '/', search: '', hash: '', asPath: '/', query: {} as Record<string, string> }
  }
  const { pathname, search, hash } = window.location
  const asPath = pathname + search + hash
  const query = Object.fromEntries(new URLSearchParams(search).entries())
  return { pathname, search, hash, asPath, query }
}

const router = {
  get pathname() {
    return getLocationParts().pathname
  },
  get asPath() {
    return getLocationParts().asPath
  },
  get query() {
    return getLocationParts().query
  },
  isReady: true,
  push: (url: string) => {
    const current = ((): string => {
      try {
        const u = new URL(window.location.href)
        return u.pathname + u.search + u.hash
      } catch {
        return window.location.pathname + window.location.search + window.location.hash
      }
    })()

    window.dispatchEvent(new CustomEvent(EVENT_START, { detail: { url } }))

    if (_navigate) {
      _navigate(url)
    } else {
      window.location.assign(url)
    }

    // Do not emit COMPLETE here; RouteEventsBridge will emit it on actual location change.
    // If navigating to the same URL (no location change), schedule a COMPLETE so listeners don't hang.
    const nextNormalized = ((): string => {
      try {
        const u = new URL(url, window.location.origin)
        return u.pathname + u.search + u.hash
      } catch {
        return url
      }
    })()
    if (nextNormalized === current) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(EVENT_COMPLETE, { detail: { url } }))
      }, 0)
    }
  },
  replace: (url: string) => {
    const current = ((): string => {
      try {
        const u = new URL(window.location.href)
        return u.pathname + u.search + u.hash
      } catch {
        return window.location.pathname + window.location.search + window.location.hash
      }
    })()

    window.dispatchEvent(new CustomEvent(EVENT_START, { detail: { url } }))

    if (_navigate) {
      _navigate(url, { replace: true })
    } else {
      window.location.replace(url)
    }

    // Same logic as push: only emit COMPLETE if URL doesn't change
    const nextNormalized = ((): string => {
      try {
        const u = new URL(url, window.location.origin)
        return u.pathname + u.search + u.hash
      } catch {
        return url
      }
    })()
    if (nextNormalized === current) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(EVENT_COMPLETE, { detail: { url } }))
      }, 0)
    }
  },
  reload: () => window.location.reload(),
  events: { on, off },
}

export default router
