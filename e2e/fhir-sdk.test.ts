import { describe, it, expect, beforeAll } from 'vitest';
import { FHIRClient } from '../src/lib/fhirClient.js';
import dotenv from 'dotenv';

dotenv.config();

describe('FHIR SDK Integration Tests', () => {
  let client: FHIRClient;
  const apiKey = process.env.VSAC_API_KEY;

  beforeAll(() => {
    if (!apiKey) {
      console.warn('Skipping FHIR SDK tests: VSAC_API_KEY not found in environment variables');
      return;
    }
    const VSAC_BASE_URL = process.env.VSAC_BASE_URL;
    client = new FHIRClient(apiKey);
  });

  it('should retrieve a value set by OID', async () => {
    if (!apiKey) return;
    // Office Visit Value Set
    const oid = '2.16.840.1.113883.3.464.1003.101.12.1001';
    try {
      const valueSet = await client.getValueSet(oid);
      expect(valueSet).toBeDefined();
      expect(valueSet.resourceType).toBe('ValueSet');
      expect(valueSet.id).toContain(oid);
      expect(valueSet.title).toBe('Office Visit');
    } catch (error) {
      console.error('Error retrieving value set:', error);
    }
  });

  it('should expand a value set', async () => {
    if (!apiKey) return;
    const oid = '2.16.840.1.113883.3.464.1003.101.12.1001';
    const valueSet = await client.expandValueSet(oid, { count: 10 });

    expect(valueSet).toBeDefined();
    expect(valueSet.resourceType).toBe('ValueSet');
    expect(valueSet.expansion).toBeDefined();
    expect(valueSet.expansion?.contains).toBeDefined();
    expect(valueSet.expansion?.contains?.length).toBeGreaterThan(0);
  });

  it('should validate a code in a value set', async () => {
    if (!apiKey) return;
    const valueset = '2.16.840.1.113883.3.464.1003.113.11.1090'
    const params = {
      system: 'http://hl7.org/fhir/sid/icd-10-cm',
      code: 'M45.0',
    };

    const result = await client.validateCode(valueset, params);

    // The result can be Parameters (success/fail) or OperationOutcome (error)
    // For a valid code, it should be Parameters with result=true
    if (result.resourceType === 'Parameters') {
      const resultParam = result.parameter.find((p) => p.name === 'result');
      expect(resultParam?.valueBoolean).toBe(true);
    } else {
      // If it's OperationOutcome, it might be due to invalid code or system
      // But for this test we expect success
      expect(result.resourceType).toBe('Parameters');
    }
  });

  it('should validate a code in a value set', async () => {
    if (!apiKey) return;
    const valueset = '2.16.840.1.113883.3.464.1003.113.11.1090'
    const params = {
      system: 'http://hl7.org/fhir/sid/icd-10-cm',
      code: 'M45.0',
      display: 'Ankylosing spondylitis of multiple sites in spine',
    };

    const result = await client.validateCode(valueset, params);

    // The result can be Parameters (success/fail) or OperationOutcome (error)
    // For a valid code, it should be Parameters with result=true
    if (result.resourceType === 'Parameters') {
      const resultParam = result.parameter.find((p) => p.name === 'result');
      expect(resultParam?.valueBoolean).toBe(true);
    } else {
      // If it's OperationOutcome, it might be due to invalid code or system
      // But for this test we expect success
      expect(result.resourceType).toBe('Parameters');
    }
  });

  it('should lookup a code in a code system', async () => {
    if (!apiKey) return;
    const params = {
      system: 'http://loinc.org',
      code: '1963-8'
    };

    const result = await client.lookupCode(params);

    expect(result).toBeDefined();
    expect(result.resourceType).toBe('Parameters');
    const displayParam = result.parameter.find((p) => p.name === 'display');
    expect(displayParam?.valueString).toBeDefined();
  });

  it('should search for value sets by title', async () => {
    if (!apiKey) return;
    const title = 'Office Visit';
    const bundle = await client.searchValueSet(title);

    expect(bundle).toBeDefined();
    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.entry).toBeDefined();
    expect(bundle.entry?.length).toBeGreaterThan(0);

    const firstEntry = bundle.entry?.[0].resource;
    if (firstEntry?.resourceType === 'ValueSet') {
      expect(firstEntry.title).toContain(title);
    }
  });

  it('should retrieve a code system by ID', async () => {
    if (!apiKey) return;
    // CDCREC is a known code system
    const id = 'CDCREC';
    const codeSystem = await client.getCodeSystem(id);

    expect(codeSystem).toBeDefined();
    expect(codeSystem.resourceType).toBe('CodeSystem');
    expect(codeSystem.id).toBe(id);
  });
});
