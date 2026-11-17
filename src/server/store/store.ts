import type { Task, TaskInput, TaskList } from '@Schemas/task';

import { createSeedTasks } from './seed';

// In-memory "database" (the case does not require persistence, see ADR 0001).
// It is kept on globalThis so it survives dev-server hot reloads and is shared by the tRPC route
// handler and the server-side caller used for SSR. Data is lost on restart and is NOT shared
// between serverless instances: fine for this exercise, wrong for production.
type TaskStore = { tasks: Task[] };

const globalForStore = globalThis as unknown as { taskStore?: TaskStore };

const getStore = (): TaskStore => {
  // Starts empty unless demo data is requested (SEED_TASKS=true, see seed.ts).
  globalForStore.taskStore ??= {
    tasks: process.env.SEED_TASKS === 'true' ? createSeedTasks() : [],
  };

  return globalForStore.taskStore;
};

export const listTasks = (cursor: number, limit: number, q?: string): TaskList => {
  const term = q?.toLowerCase();
  // Filter first, then paginate, so cursors index into the filtered list.
  const tasks = term
    ? getStore().tasks.filter(
        (task) =>
          task.titulo.toLowerCase().includes(term) || task.descricao?.toLowerCase().includes(term),
      )
    : getStore().tasks;
  const items = tasks.slice(cursor, cursor + limit);
  const next = cursor + limit;

  return { items, nextCursor: next < tasks.length ? next : null };
};

export const findTask = (id: string): Task | undefined =>
  getStore().tasks.find((task) => task.id === id);

export const insertTask = (input: TaskInput): Task => {
  const task: Task = {
    dataCriacao: new Date().toISOString(),
    descricao: input.descricao || undefined,
    id: crypto.randomUUID(),
    titulo: input.titulo,
  };

  getStore().tasks.unshift(task);

  return task;
};

export const patchTask = (id: string, input: TaskInput): Task | undefined => {
  const task = findTask(id);

  if (!task) {
    return undefined;
  }

  task.titulo = input.titulo;
  task.descricao = input.descricao || undefined;

  return task;
};

export const removeTask = (id: string): boolean => {
  const { tasks } = getStore();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);

  return true;
};
