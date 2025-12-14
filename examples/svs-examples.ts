/**
 * Example usage of the SVS SDK
 *
 * This file demonstrates how to use the SVS SDK to retrieve value sets
 * from the VSAC SVS API.
 */

import { SVSClient } from '../src/index.js';

// Initialize the SDK with your configuration
const sdk = new SVSClient({
  baseURL: 'https://vsac.nlm.nih.gov/vsac/svs',
  apiKey: process.env.UMLS_API_KEY || 'your-umls-api-key-here'
});

/**
 * Example 1: Retrieve a value set without metadata
 */
async function example1() {
  console.log('\n=== Example 1: Retrieve Value Set (Concept List Only) ===\n');

  try {
    const valueSet = await sdk.retrieveValueSet('2.16.840.1.114222.4.11.837');

    console.log('Value Set ID:', valueSet.id);
    console.log('Display Name:', valueSet.displayName);
    console.log('Version:', valueSet.version);
    console.log('Number of Concepts:', valueSet.concepts.length);
    console.log('\nFirst Concept:');
    console.log(JSON.stringify(valueSet.concepts[0], null, 2));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 2: Retrieve value sets with metadata
 */
async function example2() {
  console.log('\n=== Example 2: Retrieve Multiple Value Sets (With Metadata) ===\n');

  try {
    const valueSets = await sdk.retrieveMultipleValueSets({
      ids: ['2.16.840.1.114222.4.11.836']
    });

    const valueSet = valueSets[0];
    console.log('Value Set ID:', valueSet.id);
    console.log('Display Name:', valueSet.displayName);
    console.log('Version:', valueSet.version);
    console.log('Source:', valueSet.source);
    console.log('Status:', valueSet.status);
    console.log('Type:', valueSet.type);
    console.log('Binding:', valueSet.binding);
    console.log('Revision Date:', valueSet.revisionDate);
    console.log('Number of Concepts:', valueSet.concepts.length);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 3: Retrieve value sets by program release
 */
async function example3() {
  console.log('\n=== Example 3: Retrieve by Program Release ===\n');

  try {
    const valueSets = await sdk.retrieveMultipleValueSets({
      ids: ['2.16.840.1.114222.4.11.836'],
      release: 'eCQM Update 2020-05-07'
    });

    console.log('Retrieved', valueSets.length, 'value set(s)');
    console.log('Display Name:', valueSets[0].displayName);
    console.log('Version:', valueSets[0].version);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 4: Retrieve value sets by tag
 */
async function example4() {
  console.log('\n=== Example 4: Retrieve by Tag ===\n');

  try {
    const valueSets = await sdk.retrieveMultipleValueSets({
      tagName: 'CMS eMeasure ID',
      tagValue: 'CMS68v9'
    });

    console.log('Retrieved', valueSets.length, 'value set(s)');
    valueSets.forEach((vs, index) => {
      console.log(`\nValue Set ${index + 1}:`);
      console.log('  ID:', vs.id);
      console.log('  Display Name:', vs.displayName);
      console.log('  Concepts:', vs.concepts.length);
    });
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 5: Retrieve value sets by effective date
 */
async function example5() {
  console.log('\n=== Example 5: Retrieve by Effective Date ===\n');
  try {
    const valueSets = await sdk.retrieveMultipleValueSets({
      ids: ['2.16.840.1.113883.3.117.1.7.1.226'],
      effectiveDate: '20190510'
    });

    console.log('Retrieved', valueSets.length, 'value set(s)');
    console.log('Display Name:', valueSets[0].displayName);
    console.log('Version:', valueSets[0].version);
    console.log('Status:', valueSets[0].status);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 6: Retrieve value sets with expansion profile
 */
async function example6() {
  console.log('\n=== Example 6: Retrieve with Expansion Profile ===\n');

  try {
    const valueSets = await sdk.retrieveMultipleValueSets({
      ids: ['2.16.840.1.114222.4.11.836'],
      profile: 'Most Recent Code System Versions in VSAC'
    });

    console.log('Retrieved', valueSets.length, 'value set(s)');
    console.log('Display Name:', valueSets[0].displayName);
    console.log('Version:', valueSets[0].version);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// Run all examples
async function runExamples() {
  console.log('\nNote: Make sure to set your UMLS_API_KEY environment variable');
  console.log('or replace "your-umls-api-key-here" in the code.\n');

  await example1();
  await example2();
  await example3();
  await example4();
  await example5();
  await example6();
  console.log('\n=== All Examples Completed ===\n');
}

runExamples().catch(console.error);
