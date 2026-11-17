import { TRPCClientError } from '@trpc/client';

// Maps a failed tRPC call to an i18n key (namespace `tasks`). Helpers return keys, not text.
export const getErrorKey = (error: unknown): string => {
  if (error instanceof TRPCClientError) {
    const code = (error.data as { code?: string } | null)?.code;

    if (code === 'NOT_FOUND') {
      return 'errors.notFound';
    }

    if (code === 'BAD_REQUEST') {
      return 'errors.invalid';
    }
  }

  return 'errors.unknown';
};
