import { createTRPCContext } from '@trpc/tanstack-react-query';

import type { AppRouter } from '@Server/routers/app';

// Fully typed from the server router; no codegen, no hand-written client functions (ADR 0001).
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
