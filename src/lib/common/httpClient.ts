import { XmlParser } from './xmlParser.js';
import type { RequestOptions } from '../models/util.js';
import type { Cache } from './cache.js';

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

    // Default headers
    const headers: Record<string, string> = {
      Accept: 'application/json, application/xml, text/xml',
      ...options.headers
    };

    const fetchOptions: RequestInit = {
      method: 'GET',
      headers
    };

    // Handle timeout with AbortController
    if (options.timeout) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout);
      fetchOptions.signal = controller.signal;

      // Ensure timeout is cleared after request
      // We can't strictly ensure it inside fetch's promise chain easily without wrapping
      // but modern runtimes handle cleanup well.
      // For stricter cleanup, we can wrap:
      try {
        const response = await fetch(url.toString(), fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.text();
        const contentType = response.headers.get('content-type') || '';

        let parsedData: unknown;
        if (contentType.includes('application/json')) {
          try {
            parsedData = JSON.parse(data);
          } catch {
            // Fallback if content-type lied, though uncommon for JSON
            parsedData = this.xmlParser.parse(data);
          }
        } else if (contentType.includes('xml') || data.trim().startsWith('<?xml')) {
          parsedData = this.xmlParser.parse(data);
        } else {
          try {
            parsedData = JSON.parse(data);
          } catch {
            parsedData = this.xmlParser.parse(data);
          }
        }

        // Store in cache
        if (this.cache) {
          const cacheKey = url.toString();
          // Fire and forget cache set to not block response
          this.cache.set(cacheKey, parsedData, options.ttl).catch(() => {});
        }

        return parsedData;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new Error('Request timeout');
          }
          throw new Error(`Request failed: ${error.message}`);
        }
        throw new Error('Unknown error occurred');
      }
    } else {
      // No timeout path
      try {
        const response = await fetch(url.toString(), fetchOptions);
        if (!response.ok) {
          // For better error messages, try to read body
          const errorText = await response.text().catch(() => response.statusText);
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        const data = await response.text();
        const contentType = response.headers.get('content-type') || '';

        let parsedData: unknown;
        if (contentType.includes('application/json')) {
          try {
            parsedData = JSON.parse(data);
          } catch {
            parsedData = this.xmlParser.parse(data);
          }
        } else if (contentType.includes('xml') || data.trim().startsWith('<?xml')) {
          parsedData = this.xmlParser.parse(data);
        } else {
          try {
            parsedData = JSON.parse(data);
          } catch {
            parsedData = this.xmlParser.parse(data);
          }
        }

        // Store in cache
        if (this.cache) {
          const cacheKey = url.toString();
          this.cache.set(cacheKey, parsedData, options.ttl).catch(() => {});
        }

        return parsedData;
      } catch (error) {
        throw new Error(
          `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  }
}
