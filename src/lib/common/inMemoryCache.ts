import type { Cache } from './cache.js';

/**
 * In-memory cache implementation using a Map
 * Suitable for browser and other environments where file system access is not available or desired.
 */
export class InMemoryCache implements Cache {
  private cache: Map<string, { value: unknown; expirationTime: number }>;
  private defaultTTL: number;

  /**
   * Create a new InMemoryCache
   * @param defaultTTL - Default time to live in milliseconds (default: 1 hour)
   */
  constructor(defaultTTL: number = 3600000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get a value from the cache
   */
  async get(key: string): Promise<unknown | null> {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expirationTime) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set a value in the cache
   */
  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const expirationTime = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expirationTime });
  }

  /**
   * Clear the cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }
}
