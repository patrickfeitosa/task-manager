'use client';

import { useTranslation } from 'react-i18next';

import Link from 'next/link';

import { FileQuestion } from 'lucide-react';

import { Button } from '@Ui/Button';
import { Card, CardContent } from '@Ui/Card';

const NotFound = () => {
  const { t } = useTranslation('common');

  return (
    <Card className="mt-8 items-center text-center">
      <CardContent className="flex flex-col items-center gap-3">
        <FileQuestion className="size-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold">{t('notFound.title')}</h1>
        <p className="text-muted-foreground">{t('notFound.description')}</p>
        <Button asChild>
          <Link href="/">{t('notFound.back')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotFound;
