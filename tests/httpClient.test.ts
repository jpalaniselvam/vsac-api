import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from '../src/lib/common/httpClient.js';
import http from 'node:http';
import https from 'node:https';

/**
 * Unit Tests for HttpClient
 *
 * These tests focus on testing HTTP client logic with mocked responses:
 * - URL construction
 * - Request options
 * - Response parsing (JSON and XML)
 * - Error handling
 * - Timeout handling
 */

describe('HttpClient - Unit Tests', () => {
  let client: HttpClient;

  beforeEach(() => {
    client = new HttpClient('https://vsac.nlm.nih.gov');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should create client instance with baseURL', () => {
      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(HttpClient);
    });

    it('should accept HTTP baseURL', () => {
      const httpClient = new HttpClient('http://example.com');
      expect(httpClient).toBeDefined();
    });

    it('should accept HTTPS baseURL', () => {
      const httpsClient = new HttpClient('https://example.com');
      expect(httpsClient).toBeDefined();
    });
  });

  describe('get - URL Construction', () => {
    it('should construct correct URL from baseURL and path', async () => {
      let capturedOptions: any = null;

      // Mock https.request to capture the request options
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        capturedOptions = options;

        // Create a mock response
        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('{"result":"success"}'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      await client.get('/vsac/programs');

      expect(capturedOptions).toBeDefined();
      expect(capturedOptions.hostname).toBe('vsac.nlm.nih.gov');
      expect(capturedOptions.path).toBe('/vsac/programs');
      expect(capturedOptions.method).toBe('GET');
    });

    it('should handle paths with query parameters', async () => {
      let capturedOptions: any = null;

      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        capturedOptions = options;

        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('{"result":"success"}'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      await client.get('/vsac/programs?filter=test');

      expect(capturedOptions.path).toBe('/vsac/programs?filter=test');
    });

    it('should use HTTP protocol for HTTP URLs', async () => {
      const httpClient = new HttpClient('http://example.com');
      let httpRequestCalled = false;

      vi.spyOn(http, 'request').mockImplementation((options: any, callback: any) => {
        httpRequestCalled = true;

        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('{"result":"success"}'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      await httpClient.get('/test');

      expect(httpRequestCalled).toBe(true);
    });
  });

  describe('get - Request Headers', () => {
    it('should include default Accept header', async () => {
      let capturedOptions: any = null;

      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        capturedOptions = options;

        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('{"result":"success"}'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      await client.get('/test');

      expect(capturedOptions.headers).toBeDefined();
      expect(capturedOptions.headers['Accept']).toBe('application/json, application/xml, text/xml');
    });

    it('should merge custom headers with default headers', async () => {
      let capturedOptions: any = null;

      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        capturedOptions = options;

        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('{"result":"success"}'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      await client.get('/test', {
        headers: {
          Authorization: 'Bearer token123',
          'Custom-Header': 'value'
        }
      });

      expect(capturedOptions.headers['Accept']).toBe('application/json, application/xml, text/xml');
      expect(capturedOptions.headers['Authorization']).toBe('Bearer token123');
      expect(capturedOptions.headers['Custom-Header']).toBe('value');
    });
  });

  describe('get - Response Parsing', () => {
    it('should parse JSON response', async () => {
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('{"name":"test","value":123}'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      const result = (await client.get('/test')) as any;

      expect(result).toEqual({ name: 'test', value: 123 });
    });

    it('should parse XML response with content-type application/xml', async () => {
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/xml' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('<?xml version="1.0"?><root><item>value</item></root>'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      const result = (await client.get('/test')) as any;

      expect(result).toBeDefined();
      expect(result.root).toBeDefined();
      expect(result.root.item).toBe('value');
    });

    it('should parse XML response with content-type text/xml', async () => {
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'text/xml' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('<?xml version="1.0"?><root><item>value</item></root>'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      const result = (await client.get('/test')) as any;

      expect(result).toBeDefined();
      expect(result.root).toBeDefined();
    });

    it('should auto-detect XML from content when no content-type', async () => {
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockResponse = {
          statusCode: 200,
          headers: {},
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('<?xml version="1.0"?><root><item>value</item></root>'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      const result = (await client.get('/test')) as any;

      expect(result).toBeDefined();
      expect(result.root).toBeDefined();
    });

    it('should handle chunked responses', async () => {
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              // Simulate chunked response
              handler(Buffer.from('{"name":'));
              handler(Buffer.from('"test",'));
              handler(Buffer.from('"value":123}'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      const result = (await client.get('/test')) as any;

      expect(result).toEqual({ name: 'test', value: 123 });
    });
  });

  describe('get - Error Handling', () => {
    it('should reject on HTTP error status codes', async () => {
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockResponse = {
          statusCode: 404,
          headers: { 'content-type': 'text/plain' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('Not Found'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      await expect(client.get('/test')).rejects.toThrow('HTTP 404');
    });

    it('should reject on network errors', async () => {
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockRequest = {
          on: vi.fn((event: string, handler: any) => {
            if (event === 'error') {
              handler(new Error('Network error'));
            }
          }),
          end: vi.fn(),
          setTimeout: vi.fn()
        };

        return mockRequest as any;
      });

      await expect(client.get('/test')).rejects.toThrow('Request failed: Network error');
    });

    it('should reject on invalid JSON', async () => {
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('invalid json {'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn()
        } as any;
      });

      await expect(client.get('/test')).rejects.toThrow('Failed to parse response');
    });
  });

  describe('get - Timeout Handling', () => {
    it('should handle timeout option', async () => {
      let setTimeoutCalled = false;
      let timeoutValue = 0;

      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockRequest = {
          on: vi.fn(),
          end: vi.fn(),
          setTimeout: vi.fn((timeout: number, handler: any) => {
            setTimeoutCalled = true;
            timeoutValue = timeout;
          })
        };

        const mockResponse = {
          statusCode: 200,
          headers: { 'content-type': 'application/json' },
          on: vi.fn((event: string, handler: any) => {
            if (event === 'data') {
              handler(Buffer.from('{"result":"success"}'));
            } else if (event === 'end') {
              handler();
            }
          })
        };

        callback(mockResponse);

        return mockRequest as any;
      });

      await client.get('/test', { timeout: 5000 });

      expect(setTimeoutCalled).toBe(true);
      expect(timeoutValue).toBe(5000);
    });

    it('should reject on timeout', async () => {
      vi.spyOn(https, 'request').mockImplementation((options: any, callback: any) => {
        const mockRequest = {
          on: vi.fn(),
          end: vi.fn(),
          destroy: vi.fn(),
          setTimeout: vi.fn((timeout: number, handler: any) => {
            // Immediately trigger timeout
            handler();
          })
        };

        return mockRequest as any;
      });

      await expect(client.get('/test', { timeout: 1000 })).rejects.toThrow('Request timeout');
    });
  });
});
