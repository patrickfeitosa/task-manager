import type { ReactNode } from 'react';

// Generic and domain-agnostic: the caller passes already-translated text.
export type EmptyStateProps = {
  action?: ReactNode;
  description?: string;
  icon?: ReactNode;
  title: string;
};
