import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// Eager false for code-splitting
const modules = import.meta.glob('../../pages/**/*.{tsx,jsx}', { eager: false })

function fileToPath(file: string): string | null {
  // Normalize start
  let p = file
    .replace(/^\.\.\/\.\.\//, '/') // remove ../../
    .replace(/^\/pages/, '') // drop /pages prefix
    .replace(/\.(t|j)sx?$/, '') // drop extension

  // Ignore private/Next special files
  if (/\/(?:_app|_document)(?:\.|\/|$)/.test(p)) return null

  // Convert Next dynamic segments [id] -> :id
  p = p.replace(/\[(\.\.\.)?([^\]]+)\]/g, (_, dots: string, name: string) => {
    if (dots) return `:${name}*`
    return `:${name}`
  })

  // index -> root of its folder
  p = p.replace(/\/index$/, '/')

  // Ensure leading slash
  if (!p.startsWith('/')) p = '/' + p

  return p
}

export default function AutoRoutes() {
  const routes = Object.entries(modules)
    .map(([file, loader]) => {
      const path = fileToPath(file)
      if (!path) return null
      const Component = React.lazy(loader as any)
      return { path, Component }
    })
    .filter(Boolean) as { path: string; Component: React.LazyExoticComponent<any> }[]

  // Always include 404 fallback to redirect to '/'
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Suspense>
  )
}

