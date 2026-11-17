'use client';

import { useTranslation } from 'react-i18next';

import { TriangleAlert } from 'lucide-react';

import { Button } from '@Ui/Button';
import { Card, CardContent } from '@Ui/Card';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage = (props: ErrorPageProps) => {
  const { reset } = props;
  const { t } = useTranslation('common');

  return (
    <Card className="mt-8 items-center text-center">
      <CardContent className="flex flex-col items-center gap-3">
        <TriangleAlert className="size-10 text-destructive" />
        <h1 className="text-2xl font-bold">{t('error.title')}</h1>
        <p className="text-muted-foreground">{t('error.description')}</p>
        <Button onClick={reset} variant="outline">
          {t('error.retry')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorPage;
