import { Suspense } from 'react'
import { HealthCheck } from './health-check'
import { HydrateClient, prefetch, trpc } from '@/trpc/server'
import { ErrorBoundary } from 'react-error-boundary'

const TestPage = () => {
  prefetch(trpc.health.queryOptions())

  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center mb-3">
        <h1 className="text-2xl font-bold">TRPC here</h1>
        <div className="ml-2 text-sm text-gray-500">
          <ErrorBoundary fallback={<div>Error occurred while fetching health check.</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <HealthCheck />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </HydrateClient>
  )
}

export default TestPage