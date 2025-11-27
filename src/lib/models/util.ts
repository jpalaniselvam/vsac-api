/**
 * HTTP request options
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Program information
 */
export interface Program {
  name: string;
  description: string;
}

/**
 * Release information
 */
export interface Release {
  name: string;
  releaseDate: number;
  isPublished?: number;
}

/**
 * Program with releases
 */
export interface ProgramWithReleases {
  name: string;
  description: string;
  release: Release[];
}

/**
 * Programs list response
 */
export interface ProgramsResponse {
  Program: Program[];
}

/**
 * Latest profile response
 */
export interface LatestProfileResponse {
  name: string;
  requestTime: string;
}

/**
 * Version list response (from XML)
 */
export interface VersionListResponse {
  VersionList: {
    _oid: string;
    version: string[];
  };
}

/**
 * Profile list response (from XML)
 */
export interface ProfileListResponse {
  ProfileList: {
    profile: string[];
  };
}

/**
 * Tag names response (from XML)
 */
export interface TagNamesResponse {
  tagNames: {
    name: string[];
  };
}

/**
 * Tag values response (from XML)
 */
export interface TagValuesResponse {
  tagValues: {
    _tagName: string;
    value: string[];
  };
}
