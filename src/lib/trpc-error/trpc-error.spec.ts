import { TRPCClientError } from '@trpc/client';
import { describe, expect, it } from 'vitest';

import { getErrorKey } from './trpc-error';

const withCode = (code: string) =>
  TRPCClientError.from({ error: { code: -1, data: { code }, message: 'x' } });

describe('getErrorKey', () => {
  it('maps NOT_FOUND', () => expect(getErrorKey(withCode('NOT_FOUND'))).toBe('errors.notFound'));
  it('maps BAD_REQUEST', () => expect(getErrorKey(withCode('BAD_REQUEST'))).toBe('errors.invalid'));
  it('falls back to unknown', () => expect(getErrorKey(new Error('boom'))).toBe('errors.unknown'));
});
