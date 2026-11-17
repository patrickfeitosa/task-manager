'use client';

import { useTranslation } from 'react-i18next';

import Link from 'next/link';

import classNames from 'classnames';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@Ui/AlertDialog';
import { Button } from '@Ui/Button';
import { Card, CardContent } from '@Ui/Card';

import { useCreateTask } from '@Hooks/useCreateTask';
import { useDeleteTask } from '@Hooks/useDeleteTask';
import { formatDate, formatRelative } from '@Libs/format-date';
import { getErrorKey } from '@Libs/trpc-error';

import type { TaskItemProps } from './TaskItem.types';

export const TaskItem = (props: TaskItemProps) => {
  const { task } = props;
  const { i18n, t } = useTranslation('tasks');
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();

  // mutateAsync (not mutate + callbacks): a deleted item unmounts when the list refreshes, and
  // callbacks passed to mutate() are dropped once the component is gone.
  // Undo re-creates the task (new id and date): there is no soft delete on the server.
  const handleUndo = async () => {
    try {
      await createTask.mutateAsync({ descricao: task.descricao, titulo: task.titulo });
      toast.success(t('delete.restored'));
    } catch (error) {
      toast.error(t(getErrorKey(error)));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask.mutateAsync({ id: task.id });
      // Visual feedback required by the case: a toast for success and for failure.
      toast.success(t('delete.success'), {
        action: { label: t('delete.undo'), onClick: handleUndo },
      });
    } catch (error) {
      toast.error(t(getErrorKey(error)));
    }
  };

  return (
    <Card
      className={classNames(
        'animate-in fade-in slide-in-from-bottom-2 gap-0 py-4 duration-300 motion-reduce:animate-none',
        'transition-opacity',
        { 'opacity-50': deleteTask.isPending },
      )}
      data-testid="task-item"
    >
      <CardContent className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="font-semibold break-words">{task.titulo}</p>
          {task.descricao ? (
            <p className="line-clamp-2 text-sm whitespace-pre-wrap text-muted-foreground">
              {task.descricao}
            </p>
          ) : null}
          {/* Relative time depends on "now", so it can differ between server and client. */}
          <time
            className="text-xs text-muted-foreground"
            dateTime={task.dataCriacao}
            suppressHydrationWarning
            title={t('list.created', { date: formatDate(task.dataCriacao, i18n.language) })}
          >
            {formatRelative(task.dataCriacao, i18n.language)}
          </time>
        </div>

        <div className="flex shrink-0 gap-1">
          <Button aria-label={t('list.edit')} asChild size="icon" variant="ghost">
            <Link href={`/tasks/${task.id}/edit`}>
              <Pencil />
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                aria-label={t('delete.action')}
                disabled={deleteTask.isPending}
                size="icon"
                variant="ghost"
              >
                <Trash2 className="text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('delete.title')}</AlertDialogTitle>
                <AlertDialogDescription>{t('delete.description')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('delete.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>{t('delete.confirm')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
