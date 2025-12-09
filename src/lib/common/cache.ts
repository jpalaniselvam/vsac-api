/**
 * Cache interface for storing and retrieving data
 */
export interface Cache {
  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns Cached value or null if not found or expired
   */
  get(key: string): Promise<unknown | null>;

  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (optional)
   */
  set(key: string, value: unknown, ttl?: number): Promise<void>;

  /**
   * Clear the cache
   */
  clear(): Promise<void>;
}
