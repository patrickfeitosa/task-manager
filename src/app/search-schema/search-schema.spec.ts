import { describe, expect, it } from 'vitest';

import { homeSearchSchema } from './search-schema';

describe('homeSearchSchema', () => {
  it('applies defaults', () => expect(homeSearchSchema.parse({})).toEqual({ page: 1, q: '' }));

  it('parses valid params', () =>
    expect(homeSearchSchema.parse({ page: '3', q: ' milk ' })).toEqual({ page: 3, q: 'milk' }));

  it('falls back on invalid values', () => {
    expect(homeSearchSchema.parse({ page: 'abc', q: ['a', 'b'] })).toEqual({ page: 1, q: '' });
    expect(homeSearchSchema.parse({ page: '999' }).page).toBe(1);
    expect(homeSearchSchema.parse({ page: '-2' }).page).toBe(1);
  });
});
