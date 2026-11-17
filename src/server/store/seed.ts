import type { Task } from '@Schemas/task';

// Optional demo data, enabled with SEED_TASKS=true (`yarn dev:seed`). The app starts empty by
// default, as the case describes; the seed only exists so infinite scroll can be seen without
// creating a dozen tasks by hand. Purely fictional, newest first.
export const SEED_COUNT = 25;

export const createSeedTasks = (): Task[] => {
  const now = Date.now();

  return Array.from({ length: SEED_COUNT }, (_, index) => ({
    dataCriacao: new Date(now - index * 3_600_000).toISOString(),
    descricao: index % 3 === 0 ? `Sample description for task ${SEED_COUNT - index}` : undefined,
    id: crypto.randomUUID(),
    titulo: `Sample task ${SEED_COUNT - index}`,
  }));
};
