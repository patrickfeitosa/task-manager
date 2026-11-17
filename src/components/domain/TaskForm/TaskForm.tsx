'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { type TaskInput, TITLE_MAX_LENGTH, taskInputSchema } from '@Schemas/task';

import { Button } from '@Ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@Ui/Card';
import { Input } from '@Ui/Input';
import { Label } from '@Ui/Label';
import { Textarea } from '@Ui/Textarea';

import { useCreateTask } from '@Hooks/useCreateTask';
import { useUpdateTask } from '@Hooks/useUpdateTask';
import { getErrorKey } from '@Libs/trpc-error';

import type { TaskFormProps } from './TaskForm.types';

export const TaskForm = (props: TaskFormProps) => {
  const { task } = props;
  const { t } = useTranslation('tasks');
  const router = useRouter();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isEditing = Boolean(task);
  const isSaving = createTask.isPending || updateTask.isPending;

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<TaskInput>({
    // Same Zod schema the server validates with: an empty title never leaves the browser,
    // and the server still rejects it if someone bypasses the form (ADR 0003).
    defaultValues: { descricao: task?.descricao ?? '', titulo: task?.titulo ?? '' },
    resolver: zodResolver(taskInputSchema),
  });

  const titleLength = (watch('titulo') ?? '').length;

  const onSubmit = async (values: TaskInput) => {
    try {
      if (task) {
        await updateTask.mutateAsync({ id: task.id, ...values });
        toast.success(t('toast.updated'));
      } else {
        await createTask.mutateAsync(values);
        toast.success(t('toast.created'));
      }

      router.push('/');
      // The list page is server-rendered: refresh so its first page includes the change.
      router.refresh();
    } catch (error) {
      toast.error(t(getErrorKey(error)));
    }
  };

  return (
    <Card>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button aria-label={t('form.back')} asChild size="icon" variant="ghost">
              <Link href="/">
                <ArrowLeft />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">
              {isEditing ? t('form.editTitle') : t('form.createTitle')}
            </h1>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="titulo">{t('form.titleLabel')}</Label>
              <span
                aria-hidden="true"
                className={
                  titleLength > TITLE_MAX_LENGTH
                    ? 'text-xs text-destructive'
                    : 'text-xs text-muted-foreground'
                }
              >
                {titleLength}/{TITLE_MAX_LENGTH}
              </span>
            </div>
            <Input
              aria-describedby={errors.titulo ? 'titulo-error' : undefined}
              aria-invalid={Boolean(errors.titulo)}
              id="titulo"
              placeholder={t('form.titlePlaceholder')}
              {...register('titulo')}
            />
            {errors.titulo ? (
              <p className="text-sm text-destructive" id="titulo-error" role="alert">
                {t(`validation.${errors.titulo.message}`)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">{t('form.descriptionLabel')}</Label>
            <Textarea
              aria-invalid={Boolean(errors.descricao)}
              id="descricao"
              placeholder={t('form.descriptionPlaceholder')}
              {...register('descricao')}
            />
            {errors.descricao ? (
              <p className="text-sm text-destructive" role="alert">
                {t(`validation.${errors.descricao.message}`)}
              </p>
            ) : null}
          </div>
        </CardContent>

        <CardFooter>
          <Button disabled={isSaving} type="submit">
            {isSaving ? <Loader2 className="animate-spin" /> : null}
            {isSaving
              ? t('form.saving')
              : isEditing
                ? t('form.submitUpdate')
                : t('form.submitCreate')}
          </Button>
          <Button onClick={() => router.push('/')} type="button" variant="ghost">
            {t('form.cancel')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
