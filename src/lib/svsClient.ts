import { HttpClient } from './common/httpClient.js';
import type { SDKConfig } from './models/config.js';
import type {
    ValueSet,
    DescribedValueSet,
    RetrieveValueSetParams,
    RetrieveValueSetXMLResponse,
    RetrieveMultipleValueSetsXMLResponse,
    Concept,
} from './models/svs.js';

/**
 * SDK for VSAC SVS (Sharing Value Sets) API
 * Provides methods to retrieve value sets and their metadata
 * 
 * @remarks
 * The SVS API requires authentication using a UMLS API Key.
 * Use basic authentication with username='apikey' and password=your UMLS API Key.
 * 
 * @example
 * ```typescript
 * const sdk = new SVSClient({
 *   baseURL: 'https://vsac.nlm.nih.gov/vsac/svs',
 *   apiKey: 'your-umls-api-key'
 * });
 * 
 * // Retrieve a value set
 * const valueSet = await sdk.retrieveValueSet({ id: '2.16.840.1.114222.4.11.837' });
 * ```
 */
export class SVSClient {
    private client: HttpClient;
    private apiKey: string;

    /**
     * Initialize the SVS SDK
     * @param config - Configuration object containing baseURL and apiKey
     * @throws Error if configuration is invalid
     */
    constructor(config: SDKConfig) {
        if (!config || !config.baseURL) {
            throw new Error('Configuration with baseURL is required');
        }
        if (!config.apiKey) {
            throw new Error('API Key is required for SVS API authentication');
        }

        this.client = new HttpClient(config.baseURL);
        this.apiKey = config.apiKey;
    }

    /**
     * Get authorization header for API requests
     * @returns Headers object with Basic Auth
     */
    private getAuthHeaders(): Record<string, string> {
        const credentials = Buffer.from(`apikey:${this.apiKey}`).toString('base64');
        return {
            'Authorization': `Basic ${credentials}`,
        };
    }

    /**
     * Build query string from parameters
     * @param params - Request parameters
     * @returns Query string
     */
    private buildQueryString(params: RetrieveValueSetParams): string {
        const queryParams = new URLSearchParams();

        if (params.id) queryParams.append('id', params.id);
        if (params.release) queryParams.append('release', params.release);
        if (params.version) queryParams.append('version', params.version);
        if (params.profile) queryParams.append('profile', params.profile);
        if (params.includeDraft) queryParams.append('includeDraft', params.includeDraft);
        if (params.tagName) queryParams.append('tagName', params.tagName);
        if (params.tagValue) queryParams.append('tagValue', params.tagValue);
        if (params.effectiveDate) queryParams.append('effectiveDate', params.effectiveDate);
        if (params.programType) queryParams.append('programType', params.programType);

        const query = queryParams.toString();
        return query ? `?${query}` : '';
    }

    /**
     * Transform raw XML concept data to Concept interface
     * @param rawConcept - Raw concept data from XML
     * @returns Concept object
     */
    private transformConcept(rawConcept: {
        _code: string;
        _codeSystem: string;
        _codeSystemName: string;
        _codeSystemVersion: string;
        _displayName: string;
    }): Concept {
        return {
            code: rawConcept._code,
            codeSystem: rawConcept._codeSystem,
            codeSystemName: rawConcept._codeSystemName,
            codeSystemVersion: rawConcept._codeSystemVersion,
            displayName: rawConcept._displayName,
        };
    }

    /**
     * Transform RetrieveValueSet XML response to ValueSet interface
     * @param response - Raw XML response
     * @returns ValueSet object
     */
    private transformValueSetResponse(response: RetrieveValueSetXMLResponse): ValueSet {
        const valueSetData = response['ns0:RetrieveValueSetResponse']['ns0:ValueSet'];
        const conceptList = valueSetData['ns0:ConceptList'];

        let concepts: Concept[] = [];
        if (conceptList && conceptList['ns0:Concept']) {
            const rawConcepts = conceptList['ns0:Concept'];
            // Handle both single concept and array of concepts
            if (Array.isArray(rawConcepts)) {
                concepts = rawConcepts.map(c => this.transformConcept(c));
            } else {
                concepts = [this.transformConcept(rawConcepts)];
            }
        }

        return {
            id: valueSetData._ID,
            displayName: valueSetData._displayName,
            version: valueSetData._version,
            concepts,
        };
    }

    /**
     * Transform RetrieveMultipleValueSets XML response to DescribedValueSet interface
     * @param response - Raw XML response
     * @returns Array of DescribedValueSet objects
     */
    private transformMultipleValueSetsResponse(response: RetrieveMultipleValueSetsXMLResponse): DescribedValueSet[] {
        const describedValueSets = response['ns0:RetrieveMultipleValueSetsResponse']['ns0:DescribedValueSet'];

        // Handle both single value set and array of value sets
        const valueSetsArray = Array.isArray(describedValueSets) ? describedValueSets : [describedValueSets];

        return valueSetsArray.map(valueSetData => {
            const conceptList = valueSetData['ns0:ConceptList'];

            let concepts: Concept[] = [];
            if (conceptList && conceptList['ns0:Concept']) {
                const rawConcepts = conceptList['ns0:Concept'];
                // Handle both single concept and array of concepts
                if (Array.isArray(rawConcepts)) {
                    concepts = rawConcepts.map(c => this.transformConcept(c));
                } else {
                    concepts = [this.transformConcept(rawConcepts)];
                }
            }

            return {
                id: valueSetData._ID,
                displayName: valueSetData._displayName,
                version: valueSetData._version,
                concepts,
                source: valueSetData['ns0:Source'],
                purpose: valueSetData['ns0:Purpose'],
                type: valueSetData['ns0:Type'],
                binding: valueSetData['ns0:Binding'],
                status: valueSetData['ns0:Status'],
                revisionDate: valueSetData['ns0:RevisionDate'],
            };
        });
    }

    /**
     * Retrieve a value set concept list without metadata
     * 
     * @param params - Request parameters
     * @returns Value set with concept list
     * 
     * @example
     * ```typescript
     * // Retrieve most recent value set expansion
     * const valueSet = await sdk.retrieveValueSet({ id: '2.16.840.1.114222.4.11.837' });
     * console.log(valueSet.displayName); // "Ethnicity"
     * console.log(valueSet.concepts); // Array of concepts
     * ```
     */
    async retrieveValueSet(params: RetrieveValueSetParams): Promise<ValueSet> {
        if (!params.id && !params.tagName) {
            throw new Error('Either id or tagName parameter is required');
        }

        const queryString = this.buildQueryString(params);
        const response = await this.client.get(
            `/RetrieveValueSet${queryString}`,
            { headers: this.getAuthHeaders() }
        ) as RetrieveValueSetXMLResponse;

        return this.transformValueSetResponse(response);
    }

    /**
     * Retrieve value set metadata and concept list
     * 
     * @param params - Request parameters
     * @returns Array of described value sets with metadata
     * 
     * @example
     * ```typescript
     * // Retrieve most recent value set expansion with metadata
     * const valueSets = await sdk.retrieveMultipleValueSets({ id: '2.16.840.1.114222.4.11.836' });
     * console.log(valueSets[0].displayName); // "Race"
     * console.log(valueSets[0].source); // "Centers for Disease Control..."
     * console.log(valueSets[0].status); // "Active"
     * 
     * // Retrieve by program release
     * const releaseSets = await sdk.retrieveMultipleValueSets({
     *   id: '2.16.840.1.114222.4.11.836',
     *   release: 'eCQM Update 2020-05-07'
     * });
     * 
     * // Retrieve by version
     * const versionSets = await sdk.retrieveMultipleValueSets({
     *   id: '2.16.840.1.114222.4.11.836',
     *   version: '20170505'
     * });
     * 
     * // Retrieve with expansion profile
     * const profileSets = await sdk.retrieveMultipleValueSets({
     *   id: '2.16.840.1.114222.4.11.836',
     *   profile: 'Most Recent Code System Versions in VSAC'
     * });
     * 
     * // Retrieve draft value set (requires author/steward permissions)
     * const draftSets = await sdk.retrieveMultipleValueSets({
     *   id: '2.16.840.1.114222.4.11.836',
     *   profile: 'eCQM Update 2020-05-07',
     *   includeDraft: 'yes'
     * });
     * 
     * // Retrieve by tag
     * const tagSets = await sdk.retrieveMultipleValueSets({
     *   tagName: 'CMS eMeasure ID',
     *   tagValue: 'CMS68v9'
     * });
     * 
     * // Retrieve by effective date
     * const dateSets = await sdk.retrieveMultipleValueSets({
     *   id: '2.16.840.1.114222.4.11.836',
     *   effectiveDate: '20200507'
     * });
     * 
     * // Retrieve by effective date and program type
     * const programDateSets = await sdk.retrieveMultipleValueSets({
     *   id: '2.16.840.1.114222.4.11.836',
     *   effectiveDate: '20200507',
     *   programType: 'eCQM'
     * });
     * ```
     */
    async retrieveMultipleValueSets(params: RetrieveValueSetParams): Promise<DescribedValueSet[]> {
        if (!params.id && !params.tagName) {
            throw new Error('Either id or tagName parameter is required');
        }

        const queryString = this.buildQueryString(params);
        const response = await this.client.get(
            `/RetrieveMultipleValueSets${queryString}`,
            { headers: this.getAuthHeaders() }
        ) as RetrieveMultipleValueSetsXMLResponse;

        return this.transformMultipleValueSetsResponse(response);
    }
}
