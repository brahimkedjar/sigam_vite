import React, { useEffect, useState } from 'react'
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

function GlobalRouteLoading() {
  // Safety net: keep the global spinner in sync with route events,
  // even if a page doesn't use useRouterWithLoading.
  const { startLoading, stopLoading, resetLoading } = useLoading()
  useEffect(() => {
    const onStart = () => startLoading()
    const onDone = () => {
      // If there are no active tracked requests, force stop.
      try {
        const active = (window as any).__SIGAM_ACTIVE_REQUESTS__ ?? 0
        if (active <= 0) {
          resetLoading()
        } else {
          stopLoading()
        }
      } catch {
        stopLoading()
      }
    }
    window.addEventListener('routeChangeStart', onStart)
    window.addEventListener('routeChangeComplete', onDone)
    window.addEventListener('routeChangeError', onDone)
    // Also react to global data loading events from fetch/axios
    window.addEventListener('globalLoadingStart', onStart)
    window.addEventListener('globalLoadingStop', onDone)
    return () => {
      window.removeEventListener('routeChangeStart', onStart)
      window.removeEventListener('routeChangeComplete', onDone)
      window.removeEventListener('routeChangeError', onDone)
      window.removeEventListener('globalLoadingStart', onStart)
      window.removeEventListener('globalLoadingStop', onDone)
    }
  }, [startLoading, stopLoading])
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
