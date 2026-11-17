'use client';

import { type PropsWithChildren, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import { QueryClientProvider } from '@tanstack/react-query';

import { createClient, TRPCProvider } from '@Api/trpc';

import { Toaster } from '@Ui/Sonner';

import { createI18n } from '@I18n';
import type { Language } from '@Libs/language';
import { createQueryClient } from '@Libs/query-client';

type ProvidersProps = PropsWithChildren<{
  // Language read from the cookie on the server, so server and client render the same text.
  language: Language;
}>;

const Providers = (props: ProvidersProps) => {
  const { children, language } = props;
  const [i18n] = useState(() => createI18n(language));
  const [queryClient] = useState(createQueryClient);
  const [trpcClient] = useState(createClient);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
          {children}
          <Toaster />
        </TRPCProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default Providers;
