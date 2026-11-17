import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';

import { afterEach } from 'vitest';

import '@I18n';

// jsdom lacks ResizeObserver, which Radix popper-based components (tooltips) rely on.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

afterEach(() => cleanup());
