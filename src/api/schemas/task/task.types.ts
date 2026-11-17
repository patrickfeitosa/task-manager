import type { z } from 'zod';

import type {
  taskInputSchema,
  taskListInputSchema,
  taskListSchema,
  taskSchema,
} from './task.schema';

export type Task = z.infer<typeof taskSchema>;
export type TaskInput = z.input<typeof taskInputSchema>;
export type TaskList = z.infer<typeof taskListSchema>;
export type TaskListInput = z.input<typeof taskListInputSchema>;
