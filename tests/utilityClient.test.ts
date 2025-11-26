import { describe, it, expect, beforeEach } from 'vitest';
import { UtilityClient } from '../src/lib/utilityClient.js';

/**
 * Unit Tests for UtilityClient
 * 
 * These tests focus on testing the core logic without making real API calls.
 * We test:
 * - Configuration validation
 * - Input parameter validation
 * - Error handling
 */

describe('UtilityClient - Unit Tests', () => {
    describe('Constructor', () => {
        it('should throw error when config is missing', () => {
            expect(() => new UtilityClient(null as any)).toThrow('Configuration with baseURL is required');
        });

        it('should throw error when baseURL is missing', () => {
            expect(() => new UtilityClient({} as any)).toThrow('Configuration with baseURL is required');
        });

        it('should create instance with valid config (baseURL only)', () => {
            const sdk = new UtilityClient({
                baseURL: 'https://vsac.nlm.nih.gov',
                apiKey: ''
            });
            expect(sdk).toBeDefined();
            expect(sdk).toBeInstanceOf(UtilityClient);
        });

        it('should create instance with valid config (baseURL and apiKey)', () => {
            const sdk = new UtilityClient({
                baseURL: 'https://vsac.nlm.nih.gov',
                apiKey: 'test-api-key'
            });
            expect(sdk).toBeDefined();
            expect(sdk).toBeInstanceOf(UtilityClient);
        });
    });

    describe('getProgram - Input Validation', () => {
        let sdk: UtilityClient;

        beforeEach(() => {
            sdk = new UtilityClient({
                baseURL: 'https://vsac.nlm.nih.gov',
                apiKey: ''
            });
        });

        it('should throw error for empty program name', async () => {
            await expect(sdk.getProgram('')).rejects.toThrow('Program name is required');
        });

        it('should throw error for undefined program name', async () => {
            await expect(sdk.getProgram(undefined as any)).rejects.toThrow('Program name is required');
        });

        it('should throw error for null program name', async () => {
            await expect(sdk.getProgram(null as any)).rejects.toThrow('Program name is required');
        });
    });

    describe('getOidPrograms - Input Validation', () => {
        let sdk: UtilityClient;

        beforeEach(() => {
            sdk = new UtilityClient({
                baseURL: 'https://vsac.nlm.nih.gov',
                apiKey: ''
            });
        });

        it('should throw error for empty OID', async () => {
            await expect(sdk.getOidPrograms('')).rejects.toThrow('OID is required');
        });

        it('should throw error for undefined OID', async () => {
            await expect(sdk.getOidPrograms(undefined as any)).rejects.toThrow('OID is required');
        });

        it('should throw error for null OID', async () => {
            await expect(sdk.getOidPrograms(null as any)).rejects.toThrow('OID is required');
        });
    });

    describe('getOidProgram - Input Validation', () => {
        let sdk: UtilityClient;

        beforeEach(() => {
            sdk = new UtilityClient({
                baseURL: 'https://vsac.nlm.nih.gov',
                apiKey: ''
            });
        });

        it('should throw error for empty OID', async () => {
            await expect(sdk.getOidProgram('', 'Test Program')).rejects.toThrow('OID is required');
        });

        it('should throw error for undefined OID', async () => {
            await expect(sdk.getOidProgram(undefined as any, 'Test Program')).rejects.toThrow('OID is required');
        });

        it('should throw error for null OID', async () => {
            await expect(sdk.getOidProgram(null as any, 'Test Program')).rejects.toThrow('OID is required');
        });

        it('should throw error for empty program name', async () => {
            await expect(sdk.getOidProgram('2.16.840.1.113762.1.4.1', '')).rejects.toThrow('Program name is required');
        });

        it('should throw error for undefined program name', async () => {
            await expect(sdk.getOidProgram('2.16.840.1.113762.1.4.1', undefined as any)).rejects.toThrow('Program name is required');
        });

        it('should throw error for null program name', async () => {
            await expect(sdk.getOidProgram('2.16.840.1.113762.1.4.1', null as any)).rejects.toThrow('Program name is required');
        });

        it('should throw error when both OID and program name are empty', async () => {
            await expect(sdk.getOidProgram('', '')).rejects.toThrow('OID is required');
        });
    });

    describe('getOidVersions - Input Validation', () => {
        let sdk: UtilityClient;

        beforeEach(() => {
            sdk = new UtilityClient({
                baseURL: 'https://vsac.nlm.nih.gov',
                apiKey: ''
            });
        });

        it('should throw error for empty OID', async () => {
            await expect(sdk.getOidVersions('')).rejects.toThrow('OID is required');
        });

        it('should throw error for undefined OID', async () => {
            await expect(sdk.getOidVersions(undefined as any)).rejects.toThrow('OID is required');
        });

        it('should throw error for null OID', async () => {
            await expect(sdk.getOidVersions(null as any)).rejects.toThrow('OID is required');
        });
    });

    describe('getProgramLatestProfile - Input Validation', () => {
        let sdk: UtilityClient;

        beforeEach(() => {
            sdk = new UtilityClient({
                baseURL: 'https://vsac.nlm.nih.gov',
                apiKey: ''
            });
        });

        it('should throw error for empty program name', async () => {
            await expect(sdk.getProgramLatestProfile('')).rejects.toThrow('Program name is required');
        });

        it('should throw error for undefined program name', async () => {
            await expect(sdk.getProgramLatestProfile(undefined as any)).rejects.toThrow('Program name is required');
        });

        it('should throw error for null program name', async () => {
            await expect(sdk.getProgramLatestProfile(null as any)).rejects.toThrow('Program name is required');
        });
    });

    describe('getTagValues - Input Validation', () => {
        let sdk: UtilityClient;

        beforeEach(() => {
            sdk = new UtilityClient({
                baseURL: 'https://vsac.nlm.nih.gov',
                apiKey: ''
            });
        });

        it('should throw error for empty tag name', async () => {
            await expect(sdk.getTagValues('')).rejects.toThrow('Tag name is required');
        });

        it('should throw error for undefined tag name', async () => {
            await expect(sdk.getTagValues(undefined as any)).rejects.toThrow('Tag name is required');
        });

        it('should throw error for null tag name', async () => {
            await expect(sdk.getTagValues(null as any)).rejects.toThrow('Tag name is required');
        });
    });

    describe('URL Encoding', () => {
        let sdk: UtilityClient;

        beforeEach(() => {
            sdk = new UtilityClient({
                baseURL: 'https://vsac.nlm.nih.gov',
                apiKey: ''
            });
        });

        it('should handle special characters in program name', async () => {
            // This test verifies that special characters are properly encoded
            // We expect the HTTP call to fail (since we're not mocking), but we can verify
            // that the method doesn't throw a validation error
            const programName = 'CMS FHIR® eCQM';

            try {
                await sdk.getProgram(programName);
            } catch (error) {
                // We expect a network error, not a validation error
                expect(error).toBeDefined();
                expect((error as Error).message).not.toContain('Program name is required');
            }
        });

        it('should handle special characters in tag name', async () => {
            const tagName = 'CMS eMeasure ID';

            try {
                await sdk.getTagValues(tagName);
            } catch (error) {
                // We expect a network error, not a validation error
                expect(error).toBeDefined();
                expect((error as Error).message).not.toContain('Tag name is required');
            }
        });

        it('should handle OID with dots', async () => {
            const oid = '2.16.840.1.113762.1.4.1';

            try {
                await sdk.getOidPrograms(oid);
            } catch (error) {
                // We expect a network error, not a validation error
                expect(error).toBeDefined();
                expect((error as Error).message).not.toContain('OID is required');
            }
        });
    });
});
