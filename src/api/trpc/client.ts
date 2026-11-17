import { createTRPCClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from '@Server/routers/app';

export const createClient = () =>
  createTRPCClient<AppRouter>({ links: [httpBatchLink({ url: '/api/trpc' })] });
