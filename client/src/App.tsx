import React, { useEffect, useState, useRef } from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import AutoRoutes from './router/AutoRoutes'
import { __setNavigate } from './next-compat/router'

// Providers from the original Next app
import { StepGuardProvider } from '@/src/hooks/StepGuardContext'
import { ConfigProvider } from 'antd'
import { LoadingProvider } from '@/components/globalspinner/LoadingContext'
import { GlobalSpinner } from '@/components/globalspinner/GlobalSpinner'
import { ToastContainer } from 'react-toastify'
import ClientLayout from '@/utils/ClientLayout'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import setupApiInterceptors from '@/src/hooks/api-interceptor'
import { useLoading } from '@/components/globalspinner/LoadingContext'

function RouteEventsBridge() {
  const location = useLocation()
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('routeChangeComplete', {
        detail: { url: location.pathname + location.search },
      })
    )
    // Also trigger visibility to mimic Next logic used by ClientLayout
    window.dispatchEvent(new Event('visibilitychange'))
  }, [location])
  return null
}

function LinkClickBridge() {
  // Dispatch routeChangeStart on internal <a>/<Link> clicks
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      try {
        // Only left-click without modifier keys
        if (ev.defaultPrevented) return
        if (ev.button !== 0) return
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return
        const target = ev.target as Element | null
        if (!target) return
        const anchor = target.closest('a') as HTMLAnchorElement | null
        if (!anchor) return
        // Opt-out flags and non-navigating anchors
        if (anchor.hasAttribute('download')) return
        if (anchor.getAttribute('target') && anchor.getAttribute('target') !== '_self') return
        const href = anchor.getAttribute('href') || ''
        if (!href || href === '#' || href.startsWith('#')) return
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return
        // External links: skip
        let url: URL | null = null
        try { url = new URL(href, window.location.origin) } catch { url = null }
        if (!url) return
        if (url.origin !== window.location.origin) return
        // Dispatch start just before the router processes the click
        window.dispatchEvent(new CustomEvent('routeChangeStart', { detail: { url: url.pathname + url.search + url.hash } }))
      } catch {}
    }
    // Capture phase to ensure we run before router handles the click
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true } as any)
  }, [])
  return null
}

function HistoryStartBridge() {
  // Dispatch routeChangeStart for programmatic history navigations
  useEffect(() => {
    const START = 'routeChangeStart'
    const origPush = history.pushState.bind(history)
    const origReplace = history.replaceState.bind(history)
    function dispatchStart(url: string | URL | null) {
      try {
        if (!url) return
        const u = new URL(String(url), window.location.origin)
        const next = u.pathname + u.search + u.hash
        const curr = window.location.pathname + window.location.search + window.location.hash
        if (next !== curr) {
          window.dispatchEvent(new CustomEvent(START, { detail: { url: next } }))
        }
      } catch {}
    }
    ;(history as any).pushState = function (data: any, title: string, url?: string | URL | null) {
      dispatchStart(url ?? null)
      return origPush(data, title, url as any)
    }
    ;(history as any).replaceState = function (data: any, title: string, url?: string | URL | null) {
      dispatchStart(url ?? null)
      return origReplace(data, title, url as any)
    }
    return () => {
      ;(history as any).pushState = origPush as any
      ;(history as any).replaceState = origReplace as any
    }
  }, [])
  return null
}

function PopstateStartBridge() {
  useEffect(() => {
    const onPop = () => {
      try {
        const url = window.location.pathname + window.location.search + window.location.hash
        window.dispatchEvent(new CustomEvent('routeChangeStart', { detail: { url } }))
      } catch {}
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return null
}

function GlobalRouteLoading() {
  // Safety net: keep the global spinner in sync with route events,
  // even if a page doesn't use useRouterWithLoading.
  const { startLoading, stopLoading, resetLoading } = useLoading()
  const watchdogRef = useRef<number | null>(null)
  useEffect(() => {
    const onStart = () => startLoading()
    // Stop the route spinner when navigation completes or errors
    const onDone = () => {
      if (watchdogRef.current) {
        window.clearTimeout(watchdogRef.current)
        watchdogRef.current = null
      }
      resetLoading()
    }
    const onStartWithWatchdog = () => {
      try {
        if (watchdogRef.current) {
          window.clearTimeout(watchdogRef.current)
          watchdogRef.current = null
        }
      } catch {}
      onStart()
      // Failsafe: auto-clear spinner if COMPLETE never arrives
      try {
        watchdogRef.current = window.setTimeout(() => {
          resetLoading()
          watchdogRef.current = null
        }, ) as any
      } catch {}
    }
    window.addEventListener('routeChangeStart', onStartWithWatchdog)
    window.addEventListener('routeChangeComplete', onDone)
    window.addEventListener('routeChangeError', onDone)
    return () => {
      window.removeEventListener('routeChangeStart', onStartWithWatchdog)
      window.removeEventListener('routeChangeComplete', onDone)
      window.removeEventListener('routeChangeError', onDone)
    }
  }, [startLoading, resetLoading])
  return null
}

function NavigatorBinder() {
  const navigate = useNavigate()
  useEffect(() => {
    __setNavigate((to, opts) => navigate(to, opts))
  }, [navigate])
  return null
}

function RemountOnRouteChange({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [tick, setTick] = useState(0)
  // Also remount on synthetic route completes for same-URL navigations
  useEffect(() => {
    const onComplete = () => setTick((t) => t + 1)
    window.addEventListener('routeChangeComplete', onComplete as EventListener)
    return () => window.removeEventListener('routeChangeComplete', onComplete as EventListener)
  }, [])
  const key = `${location.pathname}${location.search}${location.hash}:${tick}`
  return <div key={key}>{children}</div>
}

function AppShell() {
  // ensure axios/fetch headers are patched once on app init
  useEffect(() => {
    setupApiInterceptors()
  }, [])
  return (
    <LoadingProvider>
      <StepGuardProvider>
        <ConfigProvider componentSize="small">
          <ToastContainer theme="colored" />
          <GlobalRouteLoading />
          <LinkClickBridge />
          <HistoryStartBridge />
          <PopstateStartBridge />
          <NavigatorBinder />
          <RouteEventsBridge />
          <ClientLayout>
            <GlobalSpinner />
            <RemountOnRouteChange>
              <AutoRoutes />
            </RemountOnRouteChange>
          </ClientLayout>
        </ConfigProvider>
      </StepGuardProvider>
    </LoadingProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
