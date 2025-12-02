/**
 * FHIR ValueSet Resource
 */
export interface FHIRValueSet {
  resourceType: 'ValueSet';
  id: string;
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  experimental?: boolean;
  date?: string;
  publisher?: string;
  description?: string;
  purpose?: string;
  compose?: {
    include: {
      system?: string;
      version?: string;
      concept?: {
        code: string;
        display?: string;
        designation?: {
          value: string;
        }[];
      }[];
    }[];
  };
  expansion?: {
    identifier?: string;
    timestamp: string;
    total?: number;
    offset?: number;
    parameter?: {
      name: string;
      valueString?: string;
      valueBoolean?: boolean;
      valueInteger?: number;
      valueDecimal?: number;
      valueUri?: string;
      valueCode?: string;
    }[];
    contains?: {
      system?: string;
      abstract?: boolean;
      inactive?: boolean;
      version?: string;
      code?: string;
      display?: string;
    }[];
  };
}

/**
 * FHIR CodeSystem Resource
 */
export interface FHIRCodeSystem {
  resourceType: 'CodeSystem';
  id: string;
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  experimental?: boolean;
  date?: string;
  publisher?: string;
  description?: string;
  content: 'not-present' | 'example' | 'fragment' | 'complete' | 'supplement';
  count?: number;
  concept?: {
    code: string;
    display?: string;
    definition?: string;
    designation?: {
      value: string;
    }[];
  }[];
}

/**
 * FHIR Bundle Resource (Search Results)
 */
export interface FHIRBundle {
  resourceType: 'Bundle';
  id?: string;
  type:
    | 'document'
    | 'message'
    | 'transaction'
    | 'transaction-response'
    | 'batch'
    | 'batch-response'
    | 'history'
    | 'searchset'
    | 'collection';
  total?: number;
  link?: {
    relation: string;
    url: string;
  }[];
  entry?: {
    fullUrl?: string;
    resource: FHIRValueSet | FHIRCodeSystem; // Extend as needed
    search?: {
      mode?: 'match' | 'include' | 'outcome';
      score?: number;
    };
  }[];
}

/**
 * FHIR Parameters Resource (Lookup Response)
 */
export interface FHIRParameters {
  resourceType: 'Parameters';
  parameter: {
    name: string;
    valueString?: string;
    valueBoolean?: boolean;
    valueInteger?: number;
    valueDecimal?: number;
    valueUri?: string;
    valueCode?: string;
    part?: {
      name: string;
      valueString?: string;
      valueBoolean?: boolean;
      valueInteger?: number;
      valueDecimal?: number;
      valueUri?: string;
      valueCode?: string;
    }[];
  }[];
}

/**
 * FHIR OperationOutcome Resource (Error Response)
 */
export interface FHIROperationOutcome {
  resourceType: 'OperationOutcome';
  issue: {
    severity: 'fatal' | 'error' | 'warning' | 'information';
    code: string;
    details?: {
      text?: string;
    };
    diagnostics?: string;
    expression?: string[];
  }[];
}

/**
 * Common Identifier Interface
 */
export interface Identifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: {
    text?: string;
  };
  system?: string;
  value?: string;
  period?: {
    start?: string;
    end?: string;
  };
  assigner?: {
    display?: string;
  };
}

/**
 * Options for ValueSet Expansion
 */
export interface ExpandOptions {
  filter?: string;
  date?: string;
  offset?: number;
  count?: number;
  includeDesignations?: boolean;
  includeDefinition?: boolean;
  activeOnly?: boolean;
  displayLanguage?: string;
  excludeNested?: boolean;
  excludeNotForUI?: boolean;
  excludePostCoordinated?: boolean;
  limitedExpansion?: boolean;
}

/**
 * Parameters for Code Validation
 */
export interface ValidateCodeParams {
  code: string;
  system: string;
  url?: string;
  version?: string;
  display?: string;
  date?: string;
  abstract?: boolean;
}

/**
 * Parameters for Code Lookup
 */
export interface LookupCodeParams {
  system: string;
  code: string;
  version?: string;
  date?: string;
  property?: string[];
}
