import { notFound } from 'next/navigation';

import { TRPCError } from '@trpc/server';

import { serverCaller } from '@Server/caller';

import { TaskForm } from '@Domain/TaskForm';

export const dynamic = 'force-dynamic';

type EditTaskProps = {
  params: Promise<{ id: string }>;
};

const EditTask = async (props: EditTaskProps) => {
  const { id } = await props.params;

  try {
    const task = await serverCaller().task.byId({ id });

    return <TaskForm task={task} />;
  } catch (error) {
    // Unknown id -> the 404 page; anything else goes to the error boundary.
    if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
      notFound();
    }

    throw error;
  }
};

export default EditTask;
