import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useTRPC } from '@Api/trpc';

export const useDeleteTask = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.task.delete.mutationOptions({
      // Any change (even a failed one, e.g. a task already deleted elsewhere) refreshes the list.
      onSettled: () => {
        // Not returned on purpose: awaiting the refetch would delay the mutation result.
        void queryClient.invalidateQueries(trpc.task.list.pathFilter());
      },
    }),
  );
};
