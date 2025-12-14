import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FileCache } from '../src/lib/node/fileCache.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

describe('FileCache', () => {
  let cacheDir: string;
  let cache: FileCache;

  beforeEach(async () => {
    cacheDir = path.join(os.tmpdir(), 'vsac-cache-test-' + Date.now());
    cache = new FileCache(cacheDir);
  });

  afterEach(async () => {
    try {
      await fs.rm(cacheDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
    vi.restoreAllMocks();
  });

  it('should store and retrieve values', async () => {
    const key = 'test-key';
    const value = { data: 'test-value' };

    await cache.set(key, value);
    const retrieved = await cache.get(key);

    expect(retrieved).toEqual(value);
  });

  it('should return null for non-existent keys', async () => {
    const retrieved = await cache.get('non-existent');
    expect(retrieved).toBeNull();
  });

  it('should expire items based on TTL', async () => {
    const key = 'expired-key';
    const value = { data: 'expired-value' };
    const ttl = 100; // 100ms

    await cache.set(key, value, ttl);

    // Verify it exists initially
    let retrieved = await cache.get(key);
    expect(retrieved).toEqual(value);

    // Advance time
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 200);

    // Verify it's gone
    retrieved = await cache.get(key);
    expect(retrieved).toBeNull();
  });

  it('should use default TTL if not provided', async () => {
    const shortCache = new FileCache(cacheDir, 100);
    const key = 'default-ttl-key';
    const value = { data: 'value' };

    await shortCache.set(key, value);

    // Advance time
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 200);

    const retrieved = await shortCache.get(key);
    expect(retrieved).toBeNull();
  });

  it('should overwrite existing keys', async () => {
    const key = 'overwrite-key';
    await cache.set(key, { value: 1 });
    await cache.set(key, { value: 2 });

    const retrieved = await cache.get(key);
    expect(retrieved).toEqual({ value: 2 });
  });
});
