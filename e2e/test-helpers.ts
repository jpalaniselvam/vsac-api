/**
 * Test Helper Utilities
 *
 * Common utilities and helpers for E2E tests
 */

/**
 * Sleep for a specified duration
 * Useful for rate limiting or waiting between API calls
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * Useful for handling transient API failures
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Check if running in CI environment
 */
export function isCI(): boolean {
  return process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
}

/**
 * Skip test if API key is not configured
 */
export function requiresApiKey(): boolean {
  const hasApiKey = !!process.env.VSAC_API_KEY && process.env.VSAC_API_KEY !== 'your-api-key-here';

  if (!hasApiKey) {
    console.warn('⚠️  Skipping test: VSAC_API_KEY not configured');
  }

  return hasApiKey;
}

/**
 * Format test output for better readability
 */
export function formatTestResult(label: string, value: any): void {
  console.log(`\n  📊 ${label}:`);
  console.log(`     ${JSON.stringify(value, null, 2).split('\n').join('\n     ')}`);
}

/**
 * Validate OID format
 */
export function isValidOID(oid: string): boolean {
  // OID format: numbers separated by dots
  const oidRegex = /^[0-9]+(\.[0-9]+)*$/;
  return oidRegex.test(oid);
}

/**
 * Common test data for VSAC API
 */
export const TEST_DATA = {
  // Known valid OIDs
  VALID_OIDS: [
    '2.16.840.1.113762.1.4.1',
    '2.16.840.1.114222.4.11.836',
    '2.16.840.1.113883.3.464.1003.101.12.1061'
  ],

  // Known valid program names
  VALID_PROGRAMS: ['CMS eCQM', 'CMS FHIR® eCQM', 'CMS Pre-rulemaking eCQM'],

  // Known valid tag names
  VALID_TAG_NAMES: ['CMS eMeasure ID', 'Grouping', 'Category'],

  // Invalid test cases
  INVALID_OID: 'invalid.oid.format',
  INVALID_PROGRAM: 'NonExistentProgram_12345_XYZ',
  INVALID_TAG: 'NonExistentTag_12345_XYZ'
};
