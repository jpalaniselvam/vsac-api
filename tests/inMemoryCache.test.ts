import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCache } from '../src/lib/common/inMemoryCache.js';

describe('InMemoryCache', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should store and retrieve values', async () => {
    await cache.set('key1', 'value1');
    const result = await cache.get('key1');
    expect(result).toBe('value1');
  });

  it('should return null for missing keys', async () => {
    const result = await cache.get('missing');
    expect(result).toBeNull();
  });

  it('should expire items after TTL', async () => {
    await cache.set('key1', 'value1', 1000);

    // Advance time by 500ms - should still exist
    vi.advanceTimersByTime(500);
    expect(await cache.get('key1')).toBe('value1');

    // Advance time by another 600ms (total 1100ms) - should expire
    vi.advanceTimersByTime(600);
    expect(await cache.get('key1')).toBeNull();
  });

  it('should use default TTL if not provided', async () => {
    const shortCache = new InMemoryCache(1000);
    await shortCache.set('key1', 'value1');

    vi.advanceTimersByTime(1100);
    expect(await shortCache.get('key1')).toBeNull();
  });

  it('should clear all items', async () => {
    await cache.set('key1', 'value1');
    await cache.set('key2', 'value2');

    cache.clear();

    expect(await cache.get('key1')).toBeNull();
    expect(await cache.get('key2')).toBeNull();
  });
});
