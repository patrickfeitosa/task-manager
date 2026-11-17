import { describe, expect, it } from 'vitest';

import { taskInputSchema } from './task.schema';

describe('taskInputSchema', () => {
  it('trims the title', () => {
    expect(taskInputSchema.parse({ titulo: '  hello ' }).titulo).toBe('hello');
  });

  it('requires a title', () => {
    const result = taskInputSchema.safeParse({ titulo: '  ' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('titleRequired');
  });

  it('allows a missing description', () => {
    expect(taskInputSchema.safeParse({ titulo: 'ok' }).success).toBe(true);
  });
});
