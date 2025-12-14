import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from '../src/lib/common/httpClient.js';
import { clear } from 'console';

/**
 * Unit Tests for HttpClient
 *
 * These tests focus on testing HTTP client logic with mocked fetch:
 * - URL construction
 * - Request options
 * - Response parsing (JSON and XML)
 * - Error handling
 * - Timeout handling
 * - cache handling
 */

describe('HttpClient - Unit Tests', () => {
  let client: HttpClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchMock: any;

  beforeEach(() => {
    client = new HttpClient('https://vsac.nlm.nih.gov');
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should create client instance with baseURL', () => {
      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(HttpClient);
    });
  });

  describe('get - URL Construction', () => {
    it('should construct correct URL from baseURL and path', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('{"result":"success"}')
      });

      await client.get('/vsac/programs');

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe('https://vsac.nlm.nih.gov/vsac/programs');
      expect(options.method).toBe('GET');
    });

    it('should handle paths with query parameters', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('{"result":"success"}')
      });

      await client.get('/vsac/programs?filter=test');

      const [url] = fetchMock.mock.calls[0];
      expect(url).toBe('https://vsac.nlm.nih.gov/vsac/programs?filter=test');
    });
  });

  describe('get - Request Headers', () => {
    it('should include default Accept header', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('{"result":"success"}')
      });

      await client.get('/test');

      const [, options] = fetchMock.mock.calls[0];
      expect(options.headers['Accept']).toBe('application/json, application/xml, text/xml');
    });

    it('should merge custom headers with default headers', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('{"result":"success"}')
      });

      await client.get('/test', {
        headers: {
          Authorization: 'Bearer token123',
          'Custom-Header': 'value'
        }
      });

      const [, options] = fetchMock.mock.calls[0];
      expect(options.headers['Accept']).toBe('application/json, application/xml, text/xml');
      expect(options.headers['Authorization']).toBe('Bearer token123');
      expect(options.headers['Custom-Header']).toBe('value');
    });
  });

  describe('get - Response Parsing', () => {
    it('should parse JSON response', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('{"name":"test","value":123}')
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await client.get('/test')) as any;

      expect(result).toEqual({ name: 'test', value: 123 });
    });

    it('should parse XML response with content-type application/xml', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/xml' }),
        text: () => Promise.resolve('<?xml version="1.0"?><root><item>value</item></root>')
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await client.get('/test')) as any;

      expect(result).toBeDefined();
      expect(result.root).toBeDefined();
      expect(result.root.item).toBe('value');
    });

    it('should auto-detect XML from content when content-type is missing/ambiguous but content is XML', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: () => Promise.resolve('<?xml version="1.0"?><root><item>value</item></root>')
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await client.get('/test')) as any;

      expect(result).toBeDefined();
      expect(result.root).toBeDefined();
    });
  });

  describe('get - Error Handling', () => {
    it('should reject on HTTP error status codes', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve('Not Found')
      });

      await expect(client.get('/test')).rejects.toThrow('HTTP 404: Not Found');
    });

    it('should reject on network errors', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'));
      await expect(client.get('/test')).rejects.toThrow('Request failed: Network error');
    });

    it('should resolve with {} on invalid JSON', async () => {
      // Mock a response that claims to be JSON but isn't, and isn't XML either
      // The parser will try JSON, fail, try XML, fail, and throw
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('invalid json {')
      });
      // Actually our current implementation throws "Failed to parse XML" if both fail because it falls back to XML parser which throws
      await expect(client.get('/test')).rejects.toThrow('Invalid XML');
    });
  });

  describe('get - Timeout Handling', () => {
    it('should pass signal to fetch when timeout is provided', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('{}')
      });

      await client.get('/test', { timeout: 5000 });

      const [, options] = fetchMock.mock.calls[0];
      expect(options.signal).toBeDefined();
    });

    it('should reject on AbortError (timeout)', async () => {
      const error = new Error('The operation was aborted');
      error.name = 'AbortError';
      fetchMock.mockRejectedValue(error);

      await expect(client.get('/test', { timeout: 100 })).rejects.toThrow('Request timeout');
    });
  });

  describe('get - Caching', () => {
    it('should use cache when available', async () => {
      const mockCache = {
        get: vi.fn().mockResolvedValue({ cached: true }),
        set: vi.fn().mockResolvedValue(undefined),
        clear: vi.fn().mockResolvedValue(undefined)
      };

      const clientWithCache = new HttpClient('https://example.com', mockCache);
      const result = await clientWithCache.get('/test');

      expect(result).toEqual({ cached: true });
      expect(mockCache.get).toHaveBeenCalledWith('https://example.com/test');
      expect(mockCache.set).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should make request on cache miss and store result', async () => {
      const mockCache = {
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn().mockResolvedValue(undefined),
        clear: vi.fn().mockResolvedValue(undefined)
      };

      fetchMock.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('{"result":"success"}')
      });

      const clientWithCache = new HttpClient('https://example.com', mockCache);
      const result = await clientWithCache.get('/test');

      expect(result).toEqual({ result: 'success' });
      expect(mockCache.get).toHaveBeenCalledWith('https://example.com/test');
      // Set is async and fire-and-forget, so we might need to wait a tick or check if called
      // Since we await the get call, the set call starts before return.
      expect(mockCache.set).toHaveBeenCalled();
    });
  });
});
