// noinspection JSUnusedGlobalSymbols

import { DestroyRef } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  it('returns false with no registered resources', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('returns true with a loading resource', () => {
    const mockDestroyRef = { onDestroy: vi.fn() } as unknown as DestroyRef;
    const loadingResource = { isLoading: () => true };

    service.register(mockDestroyRef, loadingResource);

    expect(service.isLoading()).toBe(true);
  });

  it('returns false with no loading resources', () => {
    const mockDestroyRef = { onDestroy: vi.fn() } as unknown as DestroyRef;
    const resource1 = { isLoading: () => false };
    const resource2 = { isLoading: () => false };

    service.register(mockDestroyRef, resource1, resource2);

    expect(service.isLoading()).toBe(false);
  });

  it('returns true with at least one loading resource', () => {
    const mockDestroyRef = { onDestroy: vi.fn() } as unknown as DestroyRef;
    const resource1 = { isLoading: () => false };
    const resource2 = { isLoading: () => true };
    const resource3 = { isLoading: () => false };

    service.register(mockDestroyRef, resource1, resource2, resource3);

    expect(service.isLoading()).toBe(true);
  });

  it('registers destroy callback', () => {
    const mockDestroyRef = { onDestroy: vi.fn() } as unknown as DestroyRef;
    const resource = { isLoading: () => false };

    service.register(mockDestroyRef, resource);

    expect(mockDestroyRef.onDestroy).toHaveBeenCalledOnce();
    expect(mockDestroyRef.onDestroy).toHaveBeenCalledWith(expect.any(Function));
  });

  it('registers multiple and removes multiple resources', () => {
    let destroyCallback: (() => void) | undefined;
    const mockDestroyRef = {
      onDestroy: vi.fn((callback) => {
        destroyCallback = callback;
      }),
    } as unknown as DestroyRef;

    const resource1 = { isLoading: () => true };
    const resource2 = { isLoading: () => false };
    const resource3 = { isLoading: () => true };

    service.register(mockDestroyRef, resource1, resource2, resource3);
    expect(service.isLoading()).toBe(true);

    destroyCallback!();
    expect(service.isLoading()).toBe(false);
  });

  it('removes resource on destroy callback', () => {
    let destroyCallback: (() => void) | undefined;
    const mockDestroyRef = {
      onDestroy: vi.fn((callback) => {
        destroyCallback = callback;
      }),
    } as unknown as DestroyRef;
    const resource = { isLoading: () => true };

    service.register(mockDestroyRef, resource);
    expect(service.isLoading()).toBe(true);

    destroyCallback!();
    expect(service.isLoading()).toBe(false);
  });

  it('removes only the specific resource on destroy callback', () => {
    let destroyCallback1: (() => void) | undefined;
    let destroyCallback2: (() => void) | undefined;

    const mockDestroyRef1 = {
      onDestroy: vi.fn((callback) => {
        destroyCallback1 = callback;
      }),
    } as unknown as DestroyRef;

    const mockDestroyRef2 = {
      onDestroy: vi.fn((callback) => {
        destroyCallback2 = callback;
      }),
    } as unknown as DestroyRef;

    const resource1 = { isLoading: () => true };
    const resource2 = { isLoading: () => true };

    service.register(mockDestroyRef1, resource1);
    service.register(mockDestroyRef2, resource2);
    expect(service.isLoading()).toBe(true);

    destroyCallback1!();
    expect(service.isLoading()).toBe(true);

    destroyCallback2!();
    expect(service.isLoading()).toBe(false);
  });

  it('handles multiple registrations and cleanups', () => {
    const destroyCallbacks: (() => void)[] = [];

    const createMockDestroyRef = () =>
      ({
        onDestroy: vi.fn((callback) => {
          destroyCallbacks.push(callback);
        }),
      }) as unknown as DestroyRef;

    const resource1 = { isLoading: () => true };
    const resource2 = { isLoading: () => false };
    const resource3 = { isLoading: () => true };

    service.register(createMockDestroyRef(), resource1);
    service.register(createMockDestroyRef(), resource2);
    service.register(createMockDestroyRef(), resource3);

    expect(service.isLoading()).toBe(true);

    destroyCallbacks[0]();
    expect(service.isLoading()).toBe(true);

    destroyCallbacks[2]();
    expect(service.isLoading()).toBe(false);

    destroyCallbacks[1]();
    expect(service.isLoading()).toBe(false);
  });
});
