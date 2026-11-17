import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@Server/routers/app';

const handler = (request: Request) =>
  fetchRequestHandler({
    createContext: () => ({}),
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
  });

export { handler as GET, handler as POST };
