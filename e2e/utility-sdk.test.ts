import { describe, it, expect, beforeAll } from 'vitest';
import { UtilityClient } from '../src/lib/utilityClient.js';
import type {
  ProgramsResponse,
  ProgramWithReleases,
  VersionListResponse,
  ProfileListResponse,
  LatestProfileResponse,
  TagNamesResponse,
  TagValuesResponse
} from '../src/lib/models/util.js';

/**
 * E2E Integration Tests for UtilitySDK
 *
 * These tests make real HTTP calls to the VSAC API.
 * Make sure you have a valid API key and network connection.
 *
 * To run these tests:
 * npm run test:e2e
 *
 * To run a specific test:
 * npm run test:e2e -- -t "should get all programs"
 */

describe('UtilitySDK - E2E Integration Tests', () => {
  let sdk: UtilityClient;
  const BASE_URL = process.env.VSAC_BASE_URL || 'https://vsac.nlm.nih.gov';
  const API_KEY = process.env.VSAC_API_KEY || '';

  // Test data - these are known valid values from VSAC
  const TEST_OID = '2.16.840.1.113762.1.4.1';
  const TEST_PROGRAM_NAME = 'CMS FHIR® eCQM';
  const TEST_TAG_NAME = 'NQF Number';

  const timeout = 30000;

  beforeAll(() => {
    // Initialize SDK with configuration
    sdk = new UtilityClient({
      baseURL: BASE_URL,
      apiKey: API_KEY
    });
  });

  describe('getPrograms', () => {
    it('should get all programs', async () => {
      const response = await sdk.getPrograms();
      expect(response).toBeDefined();
      expect(response.Program).toBeDefined();
      expect(response.Program.length).toBeGreaterThan(0);
      expect(response.Program[0].name).toBeDefined();
      expect(response.Program[0].description).toBeDefined();
      expect(typeof response.Program[0].name).toBe('string');
      expect(typeof response.Program[0].description).toBe('string');
    });
  });

  describe('getProgram', () => {
    it(
      'should get program details',
      async () => {
        const response = await sdk.getProgram(TEST_PROGRAM_NAME);
        expect(response).toBeDefined();
        expect(response.name).toBeDefined();
        expect(response.description).toBeDefined();
        expect(response.release).toBeDefined();
        expect(response.release.length).toBeGreaterThan(0);
        expect(response.release[0].name).toBeDefined();
        expect(response.release[0].releaseDate).toBeDefined();
        expect(typeof response.release[0].name).toBe('string');
        expect(typeof response.release[0].releaseDate).toBe('number');
      },
      timeout
    );

    it(
      'should throw error for invalid program name',
      async () => {
        await expect(sdk.getProgram('invalid program name')).rejects.toThrow();

        await expect(sdk.getProgram('')).rejects.toThrow();
      },
      timeout
    );
  });

  describe('getOidPrograms', () => {
    it(
      'should get oid programs',
      async () => {
        const response = await sdk.getOidPrograms(TEST_OID);
        expect(response).toBeDefined();
        expect(response.Program).toBeDefined();
        expect(response.Program.length).toBeGreaterThan(0);
        expect(response.Program[0].name).toBeDefined();
        expect(response.Program[0].description).toBeDefined();
        expect(typeof response.Program[0].name).toBe('string');
        expect(typeof response.Program[0].description).toBe('string');
      },
      timeout
    );

    it(
      'should throw error for empty oid',
      async () => {
        await expect(sdk.getOidPrograms('')).rejects.toThrow();
      },
      timeout
    );

    it(
      'should get zero programs for invalid oid',
      async () => {
        const response = await sdk.getOidPrograms('invalid oid');
        expect(response).toBeDefined();
        expect(response.Program).toBeDefined();
        expect(response.Program.length).toBe(0);
      },
      timeout
    );
  });

  describe('getOidProgram', () => {
    it(
      'should get oid program',
      async () => {
        const response = await sdk.getOidProgram(TEST_OID, 'CMS eCQM and Hybrid Measure');
        expect(response).toBeDefined();
        expect(response.name).toBeDefined();
        expect(response.description).toBeDefined();
        expect(response.release).toBeDefined();
        expect(response.release.length).toBeGreaterThan(0);
        expect(response.release[0].name).toBeDefined();
        expect(response.release[0].releaseDate).toBeDefined();
        expect(typeof response.release[0].name).toBe('string');
        expect(typeof response.release[0].releaseDate).toBe('number');
      },
      timeout
    );

    it(
      'should throw error for empty oid',
      async () => {
        await expect(sdk.getOidProgram('', 'CMS eCQM and Hybrid Measure')).rejects.toThrow();
      },
      timeout
    );

    it(
      'should throw error for empty program name',
      async () => {
        await expect(sdk.getOidProgram(TEST_OID, '')).rejects.toThrow();
      },
      timeout
    );

    it(
      'should throw error for invalid data',
      async () => {
        await expect(sdk.getOidProgram('invalid oid', 'invalid program name')).rejects.toThrow();
        await expect(
          sdk.getOidProgram('invalid oid', 'CMS eCQM and Hybrid Measure')
        ).rejects.toThrow();
        await expect(sdk.getOidProgram(TEST_OID, 'invalid program name')).rejects.toThrow();
      },
      timeout
    );
  });

  describe('getOidVersions', () => {
    it(
      'should get oid versions',
      async () => {
        const response = await sdk.getOidVersions(TEST_OID);
        expect(response).toBeDefined();
        expect(response.VersionList).toBeDefined();
        expect(response.VersionList.version).toBeDefined();
        expect(response.VersionList.version.length).toBeGreaterThan(0);
        expect(typeof response.VersionList.version[0]).toBe('string');
      },
      timeout
    );

    it(
      'should throw error for empty oid',
      async () => {
        await expect(sdk.getOidVersions('')).rejects.toThrow();
      },
      timeout
    );

    it(
      'should get empty list for invalid oid',
      async () => {
        const response = await sdk.getOidVersions('invalid oid');
        expect(response).toBeDefined();
        expect(response.VersionList).toBeDefined();
        expect(response.VersionList.version).toBeUndefined();
      },
      timeout
    );
  });

  describe('getProfiles', () => {
    it(
      'should get profiles',
      async () => {
        const response = await sdk.getProfiles();
        expect(response).toBeDefined();
        expect(response.ProfileList).toBeDefined();
        expect(response.ProfileList.profile).toBeDefined();
        expect(response.ProfileList.profile.length).toBeGreaterThan(0);
        console.log(JSON.stringify(response));
        expect(typeof response.ProfileList.profile[0]).toBe('string');
      },
      timeout
    );
  });

  describe('getProgramLatestProfile', () => {
    it(
      'should get program latest profile',
      async () => {
        const response = await sdk.getProgramLatestProfile(TEST_PROGRAM_NAME);
        expect(response).toBeDefined();
        expect(response.name).toBeDefined();
        expect(response.requestTime).toBeDefined();
        expect(typeof response.name).toBe('string');
        expect(typeof response.requestTime).toBe('string');
      },
      timeout
    );

    it(
      'should throw error for empty program name',
      async () => {
        await expect(sdk.getProgramLatestProfile('')).rejects.toThrow();
      },
      timeout
    );

    it(
      'should get empty response with no name field for invalid program name   ',
      async () => {
        const response = await sdk.getProgramLatestProfile('invalid program name');
        expect(response).toBeDefined();
        expect(response.name).toBeUndefined();
        expect(response.requestTime).toBeDefined();
        expect(typeof response.requestTime).toBe('string');
      },
      timeout
    );
  });

  describe('getTagName', () => {
    it(
      'should get tag name',
      async () => {
        const response = await sdk.getTagNames();
        expect(response).toBeDefined();
        expect(response.tagNames).toBeDefined();
        expect(response.tagNames.name).toBeDefined();
        expect(['number', 'string']).toContain(typeof response.tagNames.name[0]);
      },
      timeout
    );
  });

  describe('getTagValues', () => {
    it(
      'should get tag values',
      async () => {
        const response = await sdk.getTagValues(TEST_TAG_NAME);
        expect(response).toBeDefined();
        expect(response.tagValues).toBeDefined();
        expect(response.tagValues.value).toBeDefined();
        expect(Array.isArray(response.tagValues.value)).toBe(true);
        expect(['number', 'string']).toContain(typeof response.tagValues.value[0]);
      },
      timeout
    );

    it(
      'should throw error for empty tag name',
      async () => {
        await expect(sdk.getTagValues('')).rejects.toThrow();
      },
      timeout
    );

    it(
      'should get empty response with no value field for invalid tag name',
      async () => {
        const response = await sdk.getTagValues('invalid tag name');
        expect(response).toBeDefined();
        expect(response.tagValues).toBeDefined();
        expect(response.tagValues.value).toBeUndefined();
      },
      timeout
    );
  });

  describe('getTagValues', () => {
    it(
      'should get tag values',
      async () => {
        const response = await sdk.getTagValues(TEST_TAG_NAME);
        expect(response).toBeDefined();
        expect(response.tagValues).toBeDefined();
        expect(response.tagValues.value).toBeDefined();
        expect(Array.isArray(response.tagValues.value)).toBe(true);
        console.log(JSON.stringify(response.tagValues.value));
        expect(response.tagValues.value.length).toBeGreaterThan(0);
        expect(response.tagValues.value[0]).toBeDefined();
        expect(['number', 'string']).toContain(typeof response.tagValues.value[0]);
      },
      timeout
    );

    it(
      'should throw error for empty tag name',
      async () => {
        await expect(sdk.getTagValues('')).rejects.toThrow();
      },
      timeout
    );
  });
});
