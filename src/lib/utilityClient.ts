import { HttpClient } from './common/index.js';
import type {
  ProgramsResponse,
  ProgramWithReleases,
  LatestProfileResponse,
  VersionListResponse,
  ProfileListResponse,
  TagNamesResponse,
  TagValuesResponse
} from './models/util.js';

/**
 * SDK for VSAC Utility Endpoints
 * Provides methods to interact with VSAC utility API endpoints
 */
export class UtilityClient {
  private client: HttpClient;

  /**
   * Initialize the Utility SDK
   * @param config - Configuration object
   * @example
   * const sdk = new UtilityClient('https://vsac.nlm.nih.gov');
   */
  constructor(baseURL: string) {
    if (!baseURL) {
      throw new Error('Base URL is required');
    }

    // Normalize baseURL to remove trailing slash for consistency
    const sanitizedBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;

    this.client = new HttpClient(sanitizedBaseURL);
  }

  /**
   * Get all available programs
   * @returns List of programs
   * @example
   * const programs = await sdk.getPrograms();
   * // Returns: { Program: [{ name: "...", description: "..." }, ...] }
   */
  async getPrograms(): Promise<ProgramsResponse> {
    return this.client.get('/vsac/programs') as Promise<ProgramsResponse>;
  }

  /**
   * Get details of a specific program
   * @param programName - Name of the program
   * @returns Program details with releases
   * @example
   * const program = await sdk.getProgram('CMS FHIR® eCQM');
   * // Returns: { name: "...", description: "...", release: [...] }
   */
  async getProgram(programName: string): Promise<ProgramWithReleases> {
    if (!programName) {
      throw new Error('Program name is required');
    }
    return this.client.get(
      `/vsac/program/${encodeURIComponent(programName)}`
    ) as Promise<ProgramWithReleases>;
  }

  /**
   * Get programs associated with a specific OID
   * @param oid - Object Identifier
   * @returns List of programs associated with the OID
   * @example
   * const programs = await sdk.getOidPrograms('2.16.840.1.114222.4.11.836');
   * // Returns: { Program: [{ name: "...", description: "..." }, ...] }
   */
  async getOidPrograms(oid: string): Promise<ProgramsResponse> {
    if (!oid) {
      throw new Error('OID is required');
    }
    return this.client.get(
      `/vsac/oid/${encodeURIComponent(oid)}/programs`
    ) as Promise<ProgramsResponse>;
  }

  /**
   * Get program details for a specific OID and program name
   * @param oid - Object Identifier
   * @param programName - Name of the program
   * @returns Program details with releases
   * @example
   * const program = await sdk.getOidProgram('2.16.840.1.114222.4.11.836', 'CMS Pre-rulemaking eCQM');
   * // Returns: { name: "...", description: "...", release: [...] }
   */
  async getOidProgram(oid: string, programName: string): Promise<ProgramWithReleases> {
    if (!oid) {
      throw new Error('OID is required');
    }
    if (!programName) {
      throw new Error('Program name is required');
    }
    return this.client.get(
      `/vsac/oid/${encodeURIComponent(oid)}/program/${encodeURIComponent(programName)}`
    ) as Promise<ProgramWithReleases>;
  }

  /**
   * Get all versions for a specific OID
   * @param oid - Object Identifier
   * @returns List of versions (converted from XML to JSON)
   * @example
   * const versions = await sdk.getOidVersions('2.16.840.1.114222.4.11.836');
   * // Returns: { VersionList: { '_oid': '...', version: [...] } }
   */
  async getOidVersions(oid: string): Promise<VersionListResponse> {
    if (!oid) {
      throw new Error('OID is required');
    }
    const response = (await this.client.get(
      `/vsac/oid/${encodeURIComponent(oid)}/versions`
    )) as VersionListResponse;
    if (response.VersionList.version && !Array.isArray(response.VersionList.version)) {
      response.VersionList.version = [response.VersionList.version];
    }
    return response;
  }

  /**
   * Get all available profiles
   * @returns List of profiles (converted from XML to JSON)
   * @example
   * const profiles = await sdk.getProfiles();
   * // Returns: { ProfileList: { profile: [...] } }
   */
  async getProfiles(): Promise<ProfileListResponse> {
    const response = (await this.client.get('/vsac/profiles')) as ProfileListResponse;
    if (response.ProfileList.profile && !Array.isArray(response.ProfileList.profile)) {
      response.ProfileList.profile = [response.ProfileList.profile];
    }
    return response;
  }

  /**
   * Get the latest profile for a specific program
   * @param programName - Name of the program
   * @returns Latest profile information
   * @example
   * const latestProfile = await sdk.getProgramLatestProfile('CMS eCQM');
   * // Returns: { name: "...", requestTime: "..." }
   */
  async getProgramLatestProfile(programName: string): Promise<LatestProfileResponse> {
    if (!programName) {
      throw new Error('Program name is required');
    }
    return this.client.get(
      `/vsac/program/${encodeURIComponent(programName)}/latest profile`
    ) as Promise<LatestProfileResponse>;
  }

  /**
   * Get all available tag names
   * @returns List of tag names (converted from XML to JSON)
   * @example
   * const tagNames = await sdk.getTagNames();
   * // Returns: { tagNames: { name: [...] } }
   */
  async getTagNames(): Promise<TagNamesResponse> {
    const response = (await this.client.get('/vsac/tagNames')) as TagNamesResponse;
    if (response.tagNames.name && !Array.isArray(response.tagNames.name)) {
      response.tagNames.name = [response.tagNames.name];
    }
    return response;
  }

  /**
   * Get tag values for a specific tag name
   * @param tagName - Name of the tag
   * @returns List of tag values (converted from XML to JSON)
   * @example
   * const tagValues = await sdk.getTagValues('CMS eMeasure ID');
   * // Returns: { tagValues: { '@_tagName': '...', value: [...] } }
   */
  async getTagValues(tagName: string): Promise<TagValuesResponse> {
    if (!tagName) {
      throw new Error('Tag name is required');
    }
    const response = (await this.client.get(
      `/vsac/tagName/${encodeURIComponent(tagName)}/tagValues`
    )) as TagValuesResponse;
    if (response.tagValues.value && !Array.isArray(response.tagValues.value)) {
      response.tagValues.value = [response.tagValues.value];
    }
    return response;
  }
}
