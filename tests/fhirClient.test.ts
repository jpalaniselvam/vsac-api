import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FHIRClient } from '../src/lib/fhirClient.js';
import { HttpClient } from '../src/lib/common/httpClient.js';

// Mock HttpClient
vi.mock('../src/lib/common/httpClient.js');

describe('FHIRClient', () => {
  let client: FHIRClient;
  const apiKey = 'test-api-key';
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (HttpClient as any).mockReturnValue({
      get: mockGet
    });
    client = new FHIRClient(apiKey);
  });

  it('should initialize with default base URL', () => {
    expect(HttpClient).toHaveBeenCalledWith('https://cts.nlm.nih.gov/fhir');
  });

  it('should initialize with custom base URL', () => {
    new FHIRClient(apiKey, 'https://custom-url.com');
    expect(HttpClient).toHaveBeenCalledWith('https://custom-url.com');
  });

  describe('getValueSet', () => {
    it('should retrieve a value set by OID', async () => {
      const oid = '1.2.3.4';
      const mockResponse = { resourceType: 'ValueSet', id: oid };
      mockGet.mockResolvedValue(mockResponse);

      const result = await client.getValueSet(oid);

      expect(mockGet).toHaveBeenCalledWith(`ValueSet/${oid}?_format=json`, {
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Basic'),
          Accept: 'application/json'
        })
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('expandValueSet', () => {
    it('should expand a value set with no options', async () => {
      const oid = '1.2.3.4';
      const mockResponse = { resourceType: 'ValueSet', expansion: {} };
      mockGet.mockResolvedValue(mockResponse);

      const result = await client.expandValueSet(oid);

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining(`ValueSet/${oid}/$expand`),
        expect.any(Object)
      );
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('_format=json'),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should expand a value set with options', async () => {
      const oid = '1.2.3.4';
      const options = { filter: 'term', count: 10 };
      mockGet.mockResolvedValue({});

      await client.expandValueSet(oid, options);

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('filter=term'),
        expect.any(Object)
      );
      expect(mockGet).toHaveBeenCalledWith(expect.stringContaining('count=10'), expect.any(Object));
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('_format=json'),
        expect.any(Object)
      );
    });
  });

  describe('validateCode', () => {
    it('should validate a code', async () => {
      const params = { url: 'http://valueset', code: '123', system: 'http://system' };
      mockGet.mockResolvedValue({ resourceType: 'Parameters', parameter: [] });

      await client.validateCode(params);

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('ValueSet/$validate-code'),
        expect.any(Object)
      );
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('url=http%3A%2F%2Fvalueset'),
        expect.any(Object)
      );
      expect(mockGet).toHaveBeenCalledWith(expect.stringContaining('code=123'), expect.any(Object));
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('_format=json'),
        expect.any(Object)
      );
    });
  });

  describe('lookupCode', () => {
    it('should lookup a code', async () => {
      const params = { system: 'http://system', code: '123' };
      mockGet.mockResolvedValue({ resourceType: 'Parameters', parameter: [] });

      await client.lookupCode(params);

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('CodeSystem/$lookup'),
        expect.any(Object)
      );
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('system=http%3A%2F%2Fsystem'),
        expect.any(Object)
      );
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('_format=json'),
        expect.any(Object)
      );
    });
  });

  describe('searchValueSet', () => {
    it('should search for value sets', async () => {
      const title = 'Diabetes';
      mockGet.mockResolvedValue({ resourceType: 'Bundle' });

      await client.searchValueSet(title);

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('ValueSet?'),
        expect.any(Object)
      );
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('title=Diabetes'),
        expect.any(Object)
      );
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('_format=json'),
        expect.any(Object)
      );
    });
  });

  describe('getCodeSystem', () => {
    it('should retrieve a code system by ID', async () => {
      const id = 'LOINC';
      mockGet.mockResolvedValue({ resourceType: 'CodeSystem', id });

      await client.getCodeSystem(id);

      expect(mockGet).toHaveBeenCalledWith(`CodeSystem/${id}?_format=json`, expect.any(Object));
    });
  });
});
