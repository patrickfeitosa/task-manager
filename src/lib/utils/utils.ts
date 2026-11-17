import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Required by shadcn/ui components: merges class names and resolves Tailwind conflicts.
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
