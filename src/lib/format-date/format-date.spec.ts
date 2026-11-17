import { describe, expect, it } from 'vitest';

import { formatRelative } from './format-date';

const now = Date.parse('2025-01-01T12:00:00.000Z');

describe('formatRelative', () => {
  it('formats hours in the past', () => {
    expect(formatRelative('2025-01-01T10:00:00.000Z', 'en', now)).toBe('2 hours ago');
  });

  it('formats days in the past', () => {
    expect(formatRelative('2024-12-30T12:00:00.000Z', 'en', now)).toBe('2 days ago');
  });

  it('says "now" for the current instant', () => {
    expect(formatRelative('2025-01-01T12:00:00.000Z', 'en', now)).toBe('now');
  });

  it('respects the locale', () => {
    expect(formatRelative('2025-01-01T10:00:00.000Z', 'pt', now)).toBe('há 2 horas');
  });
});
