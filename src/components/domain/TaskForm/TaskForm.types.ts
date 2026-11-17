import type { Task } from '@Schemas/task';

export type TaskFormProps = {
  // When present the form edits this task; otherwise it creates a new one.
  task?: Task;
};
