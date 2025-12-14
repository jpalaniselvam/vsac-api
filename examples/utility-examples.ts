/**
 * Example usage of the Utility SDK
 *
 * This file demonstrates how to use the Utility SDK to retrieve
 * information about programs, releases, profiles, and tags from VSAC.
 */

import { UtilityClient } from '../src/index.js';
import { pathToFileURL } from 'url';

// Initialize the SDK with your configuration
const sdk = new UtilityClient('https://vsac.nlm.nih.gov');

/**
 * Example 1: Retrieve all available programs
 */
async function example1() {
  console.log('\n=== Example 1: Retrieve All Programs ===\n');

  try {
    const response = await sdk.getPrograms();
    const programs = response.Program;

    console.log(`Retrieved ${programs.length} programs.`);
    console.log('First 3 programs:');
    programs.slice(0, 3).forEach((p) => {
      console.log(`- ${p.name}`);
    });
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 2: Retrieve details of a specific program
 */
async function example2() {
  console.log('\n=== Example 2: Retrieve Program Details ===\n');

  try {
    const programName = 'CMS FHIR® eCQM';
    const program = await sdk.getProgram(programName);

    console.log(`Program: ${program.name}`);
    console.log(`Release Count: ${program.release.length}`);
    console.log('Latest Release:', program.release[0]?.name);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 3: Retrieve profiles
 */
async function example3() {
  console.log('\n=== Example 3: Retrieve Profiles ===\n');

  try {
    const response = await sdk.getProfiles();
    const profiles = response.ProfileList.profile;

    console.log(`Retrieved ${profiles.length} profiles.`);
    console.log('First 3 profiles:');
    profiles.slice(0, 3).forEach((p) => {
      console.log(`- ${p}`);
    });
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 4: Retrieve latest profile for a program
 */
async function example4() {
  console.log('\n=== Example 4: Retrieve Latest Profile for Program ===\n');

  try {
    const programName = 'CMS eCQM';
    const latest = await sdk.getProgramLatestProfile(programName);

    console.log(`Program: ${programName}`);
    console.log(`Latest Profile: ${latest.name}`);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example 5: Retrieve tag names and values
 */
async function example5() {
  console.log('\n=== Example 5: Retrieve Tags ===\n');

  try {
    // Get Tag Names
    const namesResponse = await sdk.getTagNames();
    const tagNames = namesResponse.tagNames.name;
    console.log(`Found ${tagNames.length} tags.`);

    if (tagNames.length > 0) {
      const firstTag = tagNames[0];
      console.log(`Fetching values for tag: ${firstTag}`);

      // Get Tag Values for the first tag
      const valuesResponse = await sdk.getTagValues('NQF Number');
      const values = valuesResponse.tagValues.value;

      console.log(`Found ${values.length} values for tag 'NQF Number'.`);
      console.log('First 3 values:', values.slice(0, 3));
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// Run all examples
async function runExamples() {
  console.log('Utility SDK Examples');
  console.log('====================');

  await example1();
  await example2();
  await example3();
  await example4();
  await example5();

  console.log('\n=== All Examples Completed ===\n');
}

runExamples().catch(console.error);
