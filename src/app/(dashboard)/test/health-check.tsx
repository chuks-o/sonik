"use client";

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export const HealthCheck = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.health.queryOptions());

  return (
    <div>
      👌 {data.status}
    </div>
  )
}
