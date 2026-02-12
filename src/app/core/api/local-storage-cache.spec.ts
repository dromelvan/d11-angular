import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalStorageCachedObservable } from './local-storage-cache';

describe('LocalStorageCachedObservable', () => {
  const storageKey = 'test-key';
  const prefixedKey = `d11:${storageKey}`;
  const testValue = { id: 1, name: 'test' };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('is created', () => {
    const cache = new LocalStorageCachedObservable(storageKey, () => of(testValue));

    expect(cache).toBeTruthy();
  });

  it('returns source factory value on first call', async () => {
    const sourceFactory = vi.fn(() => of(testValue));
    const cache = new LocalStorageCachedObservable(storageKey, sourceFactory);

    const result = await firstValueFrom(cache.get());

    expect(result).toEqual(testValue);
    expect(sourceFactory).toHaveBeenCalledOnce();
  });

  it('stores value in localStorage', async () => {
    const cache = new LocalStorageCachedObservable(storageKey, () => of(testValue));

    await firstValueFrom(cache.get());

    const stored = localStorage.getItem(prefixedKey);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.value).toEqual(testValue);
  });

  it('returns cached value from memory on subsequent calls', async () => {
    const sourceFactory = vi.fn(() => of(testValue));
    const cache = new LocalStorageCachedObservable(storageKey, sourceFactory);

    const result1 = await firstValueFrom(cache.get());
    const result2 = await firstValueFrom(cache.get());
    const result3 = await firstValueFrom(cache.get());

    expect(result1).toEqual(testValue);
    expect(result2).toEqual(testValue);
    expect(result3).toEqual(testValue);
    expect(sourceFactory).toHaveBeenCalledOnce();
  });

  it('returns cached value from localStorage on new instance', async () => {
    const sourceFactory1 = vi.fn(() => of(testValue));
    const cache1 = new LocalStorageCachedObservable(storageKey, sourceFactory1);

    await firstValueFrom(cache1.get());

    const sourceFactory2 = vi.fn(() => of({ id: 2, name: 'different' }));
    const cache2 = new LocalStorageCachedObservable(storageKey, sourceFactory2);
    const result = await firstValueFrom(cache2.get());

    expect(result).toEqual(testValue);
    expect(sourceFactory2).not.toHaveBeenCalled();
  });

  it('stores expiry time when TTL is provided', async () => {
    const ttl = 5000;
    const cache = new LocalStorageCachedObservable(storageKey, () => of(testValue), ttl);
    const beforeTime = Date.now();

    await firstValueFrom(cache.get());

    const stored = localStorage.getItem(prefixedKey);
    const parsed = JSON.parse(stored!);
    expect(parsed.expiry).toBeDefined();
    expect(parsed.expiry).toBeGreaterThanOrEqual(beforeTime + ttl);
    expect(parsed.expiry).toBeLessThanOrEqual(Date.now() + ttl);
  });

  it('does not store expiry time when TTL is not provided', async () => {
    const cache = new LocalStorageCachedObservable(storageKey, () => of(testValue));

    await firstValueFrom(cache.get());

    const stored = localStorage.getItem(prefixedKey);
    const parsed = JSON.parse(stored!);
    expect(parsed.expiry).toBeUndefined();
  });

  it('returns cached value if not expired', async () => {
    const ttl = 5000;
    const sourceFactory1 = vi.fn(() => of(testValue));
    const cache1 = new LocalStorageCachedObservable(storageKey, sourceFactory1, ttl);

    await firstValueFrom(cache1.get());

    const sourceFactory2 = vi.fn(() => of({ id: 2, name: 'different' }));
    const cache2 = new LocalStorageCachedObservable(storageKey, sourceFactory2, ttl);
    const result = await firstValueFrom(cache2.get());

    expect(result).toEqual(testValue);
    expect(sourceFactory2).not.toHaveBeenCalled();
  });

  it('fetches fresh value if cache expired', async () => {
    const ttl = 100;
    const newValue = { id: 2, name: 'fresh' };
    const sourceFactory1 = vi.fn(() => of(testValue));
    const cache1 = new LocalStorageCachedObservable(storageKey, sourceFactory1, ttl);

    await firstValueFrom(cache1.get());

    await new Promise((resolve) => setTimeout(resolve, 150));

    const sourceFactory2 = vi.fn(() => of(newValue));
    const cache2 = new LocalStorageCachedObservable(storageKey, sourceFactory2, ttl);
    const result = await firstValueFrom(cache2.get());

    expect(result).toEqual(newValue);
    expect(sourceFactory2).toHaveBeenCalledOnce();
  });

  it('removes expired cache from localStorage', async () => {
    const ttl = 100;
    const newValue = { id: 2, name: 'fresh' };
    const cache1 = new LocalStorageCachedObservable(storageKey, () => of(testValue), ttl);

    await firstValueFrom(cache1.get());
    expect(localStorage.getItem(prefixedKey)).toBeTruthy();

    // Wait for expiry
    await new Promise((resolve) => setTimeout(resolve, 150));

    const cache2 = new LocalStorageCachedObservable(storageKey, () => of(newValue), ttl);
    await firstValueFrom(cache2.get());

    const stored = localStorage.getItem(prefixedKey);
    const parsed = JSON.parse(stored!);
    expect(parsed.value).toEqual(newValue);
  });

  it('removes corrupted cache and fetches fresh value', async () => {
    localStorage.setItem(prefixedKey, 'invalid-json');
    const sourceFactory = vi.fn(() => of(testValue));
    const cache = new LocalStorageCachedObservable(storageKey, sourceFactory);

    const result = await firstValueFrom(cache.get());

    expect(result).toEqual(testValue);
    expect(sourceFactory).toHaveBeenCalledOnce();
    const stored = localStorage.getItem(prefixedKey);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.value).toEqual(testValue);
  });

  it('handles QuotaExceededError gracefully', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });

    const cache = new LocalStorageCachedObservable(storageKey, () => of(testValue));
    const result = await firstValueFrom(cache.get());

    expect(result).toEqual(testValue);
    expect(consoleWarnSpy).toHaveBeenCalledWith('localStorage quota exceeded, cache not saved');

    setItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('handles other storage errors silently', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Some other error');
    });

    const cache = new LocalStorageCachedObservable(storageKey, () => of(testValue));
    const result = await firstValueFrom(cache.get());

    expect(result).toEqual(testValue);

    setItemSpy.mockRestore();
  });

  it('clears memory and localStorage cache', async () => {
    const cache = new LocalStorageCachedObservable(storageKey, () => of(testValue));

    await firstValueFrom(cache.get());
    expect(localStorage.getItem(prefixedKey)).toBeTruthy();

    cache.clear();

    expect(localStorage.getItem(prefixedKey)).toBeNull();
  });

  it('fetches fresh value after clear', async () => {
    const newValue = { id: 2, name: 'fresh' };
    const sourceFactory = vi
      .fn()
      .mockReturnValueOnce(of(testValue))
      .mockReturnValueOnce(of(newValue));

    const cache = new LocalStorageCachedObservable(storageKey, sourceFactory);

    const result1 = await firstValueFrom(cache.get());
    expect(result1).toEqual(testValue);
    expect(sourceFactory).toHaveBeenCalledOnce();

    cache.clear();

    const result2 = await firstValueFrom(cache.get());
    expect(result2).toEqual(newValue);
    expect(sourceFactory).toHaveBeenCalledTimes(2);
  });

  it('shares the same observable between multiple subscribers', async () => {
    const sourceFactory = vi.fn(() => of(testValue));
    const cache = new LocalStorageCachedObservable(storageKey, sourceFactory);

    const observable = cache.get();
    const promise1 = firstValueFrom(observable);
    const promise2 = firstValueFrom(observable);
    const promise3 = firstValueFrom(observable);

    const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);

    expect(result1).toEqual(testValue);
    expect(result2).toEqual(testValue);
    expect(result3).toEqual(testValue);
    expect(sourceFactory).toHaveBeenCalledOnce();
  });

  it('propagates source errors to subscribers', async () => {
    const error = new Error('Source error');
    const cache = new LocalStorageCachedObservable(storageKey, () => throwError(() => error));

    await expect(firstValueFrom(cache.get())).rejects.toThrow('Source error');
  });

  it('uses different storage keys for different instances', async () => {
    const key1 = 'key1';
    const key2 = 'key2';
    const value1 = { id: 1, name: 'first' };
    const value2 = { id: 2, name: 'second' };

    const cache1 = new LocalStorageCachedObservable(key1, () => of(value1));
    const cache2 = new LocalStorageCachedObservable(key2, () => of(value2));

    await firstValueFrom(cache1.get());
    await firstValueFrom(cache2.get());

    const stored1 = JSON.parse(localStorage.getItem(`d11:${key1}`)!);
    const stored2 = JSON.parse(localStorage.getItem(`d11:${key2}`)!);

    expect(stored1.value).toEqual(value1);
    expect(stored2.value).toEqual(value2);
  });
});
