'use client'

import dynamic from 'next/dynamic'

const StoreApp = dynamic(() => import('./store-app'), {
  ssr: false,
  loading: () => <div className="min-h-svh bg-background" aria-busy="true" />,
})

export function StoreAppLoader() {
  return <StoreApp />
}
