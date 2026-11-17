import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { createClient, TRPCProvider } from '@Api/trpc';

import { TaskItem } from './TaskItem';

const queryClient = new QueryClient();
const trpcClient = createClient();

const meta = {
  component: TaskItem,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
          <Story />
        </TRPCProvider>
      </QueryClientProvider>
    ),
  ],
  tags: ['autodocs'],
  title: 'Domain/TaskItem',
} satisfies Meta<typeof TaskItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const base = {
  dataCriacao: '2025-01-01T10:00:00.000Z',
  id: '1',
  titulo: 'Write the README',
};

export const WithDescription: Story = {
  args: { task: { ...base, descricao: 'Explain how to run and how it works.' } },
};

export const TitleOnly: Story = { args: { task: base } };
