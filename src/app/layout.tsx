import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import { AppHeader } from '@Domain/AppHeader';

import { LANGUAGE_COOKIE, resolveLanguage } from '@Libs/language';
import { themeInitScript } from '@Libs/theme-script';

import Providers from './providers';

import '@Styles/global/index.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  description: 'Simple task manager built with Next.js, tRPC and shadcn/ui',
  title: 'Task Manager',
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = async (props: RootLayoutProps) => {
  const { children } = props;
  const language = resolveLanguage((await cookies()).get(LANGUAGE_COOKIE)?.value);

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        {/* Rendered by a Server Component, so React does not warn about a script tag. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: constant script, no user input */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.className}>
        <Providers language={language}>
          <AppHeader />
          <main className="mx-auto w-full max-w-2xl p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
