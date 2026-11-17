import { describe, expect, it } from 'vitest';

import { resolveLanguage } from './language';

describe('resolveLanguage', () => {
  it('accepts supported languages', () => expect(resolveLanguage('pt')).toBe('pt'));
  it('falls back to the default', () => {
    expect(resolveLanguage('fr')).toBe('en');
    expect(resolveLanguage(undefined)).toBe('en');
    expect(resolveLanguage(null)).toBe('en');
  });
});
