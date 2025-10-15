import React from 'react'

type Loader<T extends React.ComponentType<any>> = () => Promise<{ default: T }>

type Options = {
  ssr?: boolean
  loading?: React.ComponentType<any>
}

export default function dynamic<T extends React.ComponentType<any>>(loader: Loader<T>, options?: Options) {
  const Lazy = React.lazy(loader)
  const Fallback = options?.loading ?? (() => null)
  return function DynamicComponent(props: React.ComponentProps<T>) {
    return (
      <React.Suspense fallback={<Fallback />}> 
        <Lazy {...props} />
      </React.Suspense>
    )
  }
}

