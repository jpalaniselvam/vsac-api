import { HttpClient } from './common/httpClient.js';
import type {
  FHIRValueSet,
  FHIRCodeSystem,
  FHIRBundle,
  FHIRParameters,
  FHIROperationOutcome,
  ExpandOptions,
  ValidateCodeParams,
  LookupCodeParams
} from './models/fhir.js';

/**
 * Client for interacting with the VSAC FHIR API
 */
export class FHIRClient {
  private httpClient: HttpClient;
  private apiKey: string;

  /**
   * Create a new FHIR Client
   * @param apiKey - UMLS API Key
   * @param baseURL - Optional base URL (defaults to https://cts.nlm.nih.gov/fhir)
   */
  constructor(apiKey: string, baseURL: string = 'https://cts.nlm.nih.gov/fhir/res') {
    this.apiKey = apiKey;
    this.httpClient = new HttpClient(baseURL);
  }

  /**
   * Get the authorization headers
   */
  private getHeaders(): Record<string, string> {
    const auth = Buffer.from(`apikey:${this.apiKey}`).toString('base64');
    return {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json'
    };
  }

  /**
   * Retrieve a Value Set by OID
   * @param oid - Value Set OID
   * @returns FHIR ValueSet resource
   */
  async getValueSet(oid: string): Promise<FHIRValueSet> {
    return this.httpClient.get(`ValueSet/${oid}?_format=json`, {
      headers: this.getHeaders()
    }) as Promise<FHIRValueSet>;
  }

  /**
   * Expand a Value Set
   * @param oid - Value Set OID
   * @param options - Expansion options
   * @returns Expanded FHIR ValueSet resource
   */
  async expandValueSet(oid: string, options: ExpandOptions = {}): Promise<FHIRValueSet> {
    const queryParams = new URLSearchParams();
    queryParams.append('_format', 'json');
    if (options.filter) queryParams.append('filter', options.filter);
    if (options.date) queryParams.append('date', options.date);
    if (options.offset) queryParams.append('offset', options.offset.toString());
    if (options.count) queryParams.append('count', options.count.toString());
    if (options.includeDesignations) queryParams.append('includeDesignations', 'true');
    if (options.includeDefinition) queryParams.append('includeDefinition', 'true');
    if (options.activeOnly) queryParams.append('activeOnly', 'true');
    if (options.displayLanguage) queryParams.append('displayLanguage', options.displayLanguage);
    if (options.excludeNested) queryParams.append('excludeNested', 'true');
    if (options.excludeNotForUI) queryParams.append('excludeNotForUI', 'true');
    if (options.excludePostCoordinated) queryParams.append('excludePostCoordinated', 'true');
    if (options.limitedExpansion) queryParams.append('limitedExpansion', 'true');

    const queryString = queryParams.toString();
    const path = `ValueSet/${oid}/$expand?${queryString}`;

    return this.httpClient.get(path, {
      headers: this.getHeaders()
    }) as Promise<FHIRValueSet>;
  }

  /**
   * Validate a code in a Value Set
   * @param params - Validation parameters
   * @returns Parameters resource (true/false) or OperationOutcome
   */
  async validateCode(oid: string, params: ValidateCodeParams): Promise<FHIRParameters | FHIROperationOutcome> {
    const queryParams = new URLSearchParams();
    queryParams.append('_format', 'json');
    queryParams.append('code', params.code);
    queryParams.append('system', params.system);
    if (params.url) queryParams.append('url', params.url);
    if (params.version) queryParams.append('version', params.version);
    if (params.display) queryParams.append('display', params.display);
    if (params.date) queryParams.append('date', params.date);
    if (params.abstract) queryParams.append('abstract', 'true');
    return this.httpClient.get(`ValueSet/${oid}/$validate-code?${queryParams.toString()}`, {
      headers: this.getHeaders()
    }) as Promise<FHIRParameters | FHIROperationOutcome>;
  }

  /**
   * Lookup a code in a Code System
   * @param params - Lookup parameters
   * @returns Parameters resource with code details
   */
  async lookupCode(params: LookupCodeParams): Promise<FHIRParameters> {
    const queryParams = new URLSearchParams();
    queryParams.append('_format', 'json');
    queryParams.append('system', params.system);
    queryParams.append('code', params.code);
    if (params.version) queryParams.append('version', params.version);
    if (params.date) queryParams.append('date', params.date);
    if (params.property) {
      params.property.forEach((p) => queryParams.append('property', p));
    }

    return this.httpClient.get(`CodeSystem/$lookup?${queryParams.toString()}`, {
      headers: this.getHeaders()
    }) as Promise<FHIRParameters>;
  }

  /**
   * Search for Value Sets by name
   * @param title - Value Set title/name
   * @returns Bundle resource containing matching Value Sets
   */
  async searchValueSet(title: string): Promise<FHIRBundle> {
    const queryParams = new URLSearchParams();
    queryParams.append('_format', 'json');
    queryParams.append('title', title);

    return this.httpClient.get(`ValueSet?${queryParams.toString()}`, {
      headers: this.getHeaders()
    }) as Promise<FHIRBundle>;
  }

  /**
   * Retrieve a Code System by ID
   * @param id - Code System ID
   * @returns FHIR CodeSystem resource
   */
  async getCodeSystem(id: string): Promise<FHIRCodeSystem> {
    return this.httpClient.get(`CodeSystem/${id}?_format=json`, {
      headers: this.getHeaders()
    }) as Promise<FHIRCodeSystem>;
  }
}
