import { XmlParser } from './xmlParser.js';
import type { RequestOptions } from '../models/util.js';
import type { Cache } from './cache.js';

const DEFAULT_TIMEOUT = 30000;

/**
 * HTTP Client utility for making API requests
 */
export class HttpClient {
  private baseURL: string;
  private xmlParser: XmlParser;
  private cache?: Cache;

  constructor(baseURL: string, cache?: Cache) {
    this.baseURL = baseURL;
    this.xmlParser = new XmlParser();
    if (cache) {
      this.cache = cache;
    }
  }

  /**
   * Make an HTTP GET request
   * @param path - API endpoint path
   * @param options - Additional request options
   * @returns Response data in JSON format
   */
  async get(path: string, options: RequestOptions = {}): Promise<unknown> {
    const url = new URL(path, this.baseURL);

    // Check cache
    if (this.cache) {
      const cacheKey = url.toString();
      const cachedResponse = await this.cache.get(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    const headers: Record<string, string> = {
      Accept: 'application/json, application/xml, text/xml',
      ...options.headers
    };

    const controller = new AbortController();
    const timeoutId = options.timeout
      ? setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT)
      : null;

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const parsedData = await this.parseResponse(response);

      // Store in cache
      if (this.cache) {
        const cacheKey = url.toString();
        this.cache.set(cacheKey, parsedData, options.ttl).catch((error) => {
          console.warn('Failed to cache response:', error);
        });
      }

      return parsedData;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw new Error(`Request failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred');
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * Parse response body based on content type
   * @param response - Fetch API Response object
   * @returns Parsed data
   */
  private async parseResponse(response: Response): Promise<unknown> {
    const data = await response.text();
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        return JSON.parse(data);
      } catch {
        // Fallback if content-type lied, though uncommon for JSON
        return this.xmlParser.parse(data);
      }
    } else if (contentType.includes('xml') || data.trim().startsWith('<?xml')) {
      return this.xmlParser.parse(data);
    } else {
      // Try JSON first, then XML
      try {
        return JSON.parse(data);
      } catch {
        return this.xmlParser.parse(data);
      }
    }
  }
}
