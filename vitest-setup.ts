// Needed for using Angular Testing Library with Vitest
import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

(globalThis as typeof globalThis & { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver =
  ResizeObserverMock;
