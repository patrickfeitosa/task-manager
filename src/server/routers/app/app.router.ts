import { taskRouter } from '@Server/routers/task';
import { router } from '@Server/trpc';

export const appRouter = router({ task: taskRouter });

// The only thing the client imports from the server: a type (no server code in the bundle).
export type AppRouter = typeof appRouter;
