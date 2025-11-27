/**
 * Concept within a value set
 */
export interface Concept {
  code: string;
  codeSystem: string;
  codeSystemName: string;
  codeSystemVersion: string;
  displayName: string;
}

/**
 * Value Set response from RetrieveValueSet endpoint
 */
export interface ValueSet {
  id: string;
  displayName: string;
  version: string;
  concepts: Concept[];
}

/**
 * Described Value Set response from RetrieveMultipleValueSets endpoint
 * Includes metadata in addition to concepts
 */
export interface DescribedValueSet extends ValueSet {
  source: string | undefined;
  purpose: string | undefined;
  type: string | undefined;
  binding: string | undefined;
  status: string | undefined;
  revisionDate: string | undefined;
}

/**
 * Parameters for retrieving a value set
 */
export interface RetrieveValueSetParams {
  /** Value set object unique identifier (OID) */
  id?: string;
  /** Name of a program release */
  release?: string;
  /** A release version label that uniquely identifies a specific value set expansion */
  version?: string;
  /** An expansion profile label that defines a calculation algorithm */
  profile?: string;
  /** Allows retrieval of a non-published draft value set definition. Value is 'yes' or 'no' */
  includeDraft?: 'yes' | 'no';
  /** A tag for a collection of value sets (e.g., 'CMS eMeasure ID') */
  tagName?: string;
  /** The value of a member within a collection (tagName) of value sets */
  tagValue?: string;
  /** A date on or before which a published value set expansion is published (format: yyyymmdd) */
  effectiveDate?: string;
  /** The name of a program that contains the requested OID (e.g., 'eCQM') */
  programType?: string;
}

/**
 * Raw XML response structure from RetrieveValueSet
 */
export interface RetrieveValueSetXMLResponse {
  'ns0:RetrieveValueSetResponse': {
    'ns0:ValueSet': {
      _ID: string;
      _displayName: string;
      _version: string;
      'ns0:ConceptList'?: {
        'ns0:Concept':
          | Array<{
              _code: string;
              _codeSystem: string;
              _codeSystemName: string;
              _codeSystemVersion: string;
              _displayName: string;
            }>
          | {
              _code: string;
              _codeSystem: string;
              _codeSystemName: string;
              _codeSystemVersion: string;
              _displayName: string;
            };
      };
    };
  };
}

/**
 * Raw XML response structure from RetrieveMultipleValueSets
 */
export interface RetrieveMultipleValueSetsXMLResponse {
  'ns0:RetrieveMultipleValueSetsResponse': {
    'ns0:DescribedValueSet':
      | Array<{
          _ID: string;
          _displayName: string;
          _version: string;
          'ns0:ConceptList'?: {
            'ns0:Concept':
              | Array<{
                  _code: string;
                  _codeSystem: string;
                  _codeSystemName: string;
                  _codeSystemVersion: string;
                  _displayName: string;
                }>
              | {
                  _code: string;
                  _codeSystem: string;
                  _codeSystemName: string;
                  _codeSystemVersion: string;
                  _displayName: string;
                };
          };
          'ns0:Source'?: string;
          'ns0:Purpose'?: string;
          'ns0:Type'?: string;
          'ns0:Binding'?: string;
          'ns0:Status'?: string;
          'ns0:RevisionDate'?: string;
        }>
      | {
          _ID: string;
          _displayName: string;
          _version: string;
          'ns0:ConceptList'?: {
            'ns0:Concept':
              | Array<{
                  _code: string;
                  _codeSystem: string;
                  _codeSystemName: string;
                  _codeSystemVersion: string;
                  _displayName: string;
                }>
              | {
                  _code: string;
                  _codeSystem: string;
                  _codeSystemName: string;
                  _codeSystemVersion: string;
                  _displayName: string;
                };
          };
          'ns0:Source'?: string;
          'ns0:Purpose'?: string;
          'ns0:Type'?: string;
          'ns0:Binding'?: string;
          'ns0:Status'?: string;
          'ns0:RevisionDate'?: string;
        };
  };
}
