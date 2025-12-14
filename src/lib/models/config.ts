import type { Cache } from '../common/cache.js';

/**
 * Configuration for initializing the SDK
 */
export interface SDKConfig {
  baseURL: string;
  apiKey: string;
  cache?: Cache;
}
