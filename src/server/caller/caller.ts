import { appRouter } from '@Server/routers/app';
import { createCallerFactory } from '@Server/trpc';

// Calls the router in-process (no HTTP). Used by Server Components for SSR and by tests.
export const createCaller = createCallerFactory(appRouter);
export const serverCaller = () => createCaller({});
