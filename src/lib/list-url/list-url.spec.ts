import { describe, expect, it } from 'vitest';

import { buildListUrl } from './list-url';

describe('buildListUrl', () => {
  it('returns / by default', () => expect(buildListUrl({})).toBe('/'));
  it('omits page 1', () => expect(buildListUrl({ page: 1, q: 'milk' })).toBe('/?q=milk'));
  it('includes page > 1', () => expect(buildListUrl({ page: 3 })).toBe('/?page=3'));
  it('encodes the search term', () =>
    expect(buildListUrl({ page: 2, q: 'a b&c' })).toBe('/?q=a+b%26c&page=2'));
  it('ignores a blank search', () => expect(buildListUrl({ q: '   ' })).toBe('/'));
});
