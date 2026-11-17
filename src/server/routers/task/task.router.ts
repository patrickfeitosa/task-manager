import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { taskInputSchema, taskListInputSchema } from '@Schemas/task';
import { findTask, insertTask, listTasks, patchTask, removeTask } from '@Server/store';
import { publicProcedure, router } from '@Server/trpc';

const idSchema = z.object({ id: z.string().min(1) });

// A missing task is a NOT_FOUND error (HTTP 404); input validation failures are raised by Zod
// as BAD_REQUEST automatically. The client maps these codes to translated messages (ADR 0003).
const notFound = () => new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });

export const taskRouter = router({
  byId: publicProcedure.input(idSchema).query(({ input }) => {
    const task = findTask(input.id);

    if (!task) {
      throw notFound();
    }

    return task;
  }),

  create: publicProcedure.input(taskInputSchema).mutation(({ input }) => insertTask(input)),

  delete: publicProcedure.input(idSchema).mutation(({ input }) => {
    if (!removeTask(input.id)) {
      throw notFound();
    }

    return { id: input.id };
  }),

  // Offset cursor pagination: `cursor` is the index of the first item of the page.
  list: publicProcedure
    .input(taskListInputSchema)
    .query(({ input }) => listTasks(input.cursor ?? 0, input.limit, input.q || undefined)),

  update: publicProcedure
    .input(idSchema.extend(taskInputSchema.shape))
    .mutation(({ input: { id, ...data } }) => {
      const task = patchTask(id, data);

      if (!task) {
        throw notFound();
      }

      return task;
    }),
});
